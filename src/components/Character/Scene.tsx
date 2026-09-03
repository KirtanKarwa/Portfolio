import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";
import ResumeDeskModal from "../ResumeDeskModal";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const { setLoading } = useLoading();
  const [isResumeDeskOpen, setIsResumeDeskOpen] = useState(false);
  const initialCamPos = useRef<{ x: number; y: number; z: number } | null>(null);

  const [, setChar] = useState<THREE.Object3D | null>(null);

  useEffect(() => {
    if (canvasDiv.current) {
      // Clear any pre-existing canvas or scene elements to prevent duplicate character models
      const existingCanvas = canvasDiv.current.querySelector("canvas");
      if (existingCanvas) {
        canvasDiv.current.removeChild(existingCanvas);
      }

      const scene = new THREE.Scene();
      sceneRef.current = scene;

      let rect = canvasDiv.current.getBoundingClientRect();
      let container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: window.devicePixelRatio < 2,
        powerPreference: "high-performance",
      });
      renderer.setSize(container.width, container.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      canvasDiv.current.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
      camera.position.z = 10;
      camera.position.set(0, 13.1, 24.7);
      camera.zoom = 1.1;
      camera.updateProjectionMatrix();

      let headBone: THREE.Object3D | null = null;
      let screenLight: any | null = null;
      let mixer: THREE.AnimationMixer;
      let animFrameId: number;

      const clock = new THREE.Clock();

      const light = setLighting(scene);
      let progress = setProgress((value: number) => setLoading(value));
      const { loadCharacter } = setCharacter(renderer, scene, camera);

      loadCharacter().then((gltf) => {
        if (gltf) {
          const animations = setAnimations(gltf);
          hoverDivRef.current && animations.hover(gltf, hoverDivRef.current);
          mixer = animations.mixer;
          let character = gltf.scene;
          setChar(character);
          scene.add(character);
          headBone = character.getObjectByName("spine006") || null;
          screenLight = character.getObjectByName("screenlight") || null;
          progress.loaded().then(() => {
            setTimeout(() => {
              light.turnOnLights();
              animations.startIntro();
            }, 2500);
          });
          window.addEventListener("resize", () =>
            handleResize(renderer, camera, canvasDiv, character)
          );
        }
      });

      let mouse = { x: 0, y: 0 },
        mouseSpeed = 0,
        interpolation = { x: 0.1, y: 0.2 };

      const onMouseMove = (event: MouseEvent) => {
        handleMouseMove(event, (x, y) => {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          mouseSpeed = Math.sqrt(dx * dx + dy * dy);
          mouse = { x, y };
        });
      };
      let debounce: number | undefined;
      const onTouchStart = (event: TouchEvent) => {
        const element = event.target as HTMLElement;
        debounce = setTimeout(() => {
          element?.addEventListener("touchmove", (e: TouchEvent) =>
            handleTouchMove(e, (x, y) => (mouse = { x, y }))
          );
        }, 200);
      };

      const onTouchEnd = () => {
        handleTouchEnd((x, y, interpolationX, interpolationY) => {
          mouse = { x, y };
          interpolation = { x: interpolationX, y: interpolationY };
        });
      };

      const handleOpenResumeDesk = () => {
        initialCamPos.current = {
          x: camera.position.x,
          y: camera.position.y,
          z: camera.position.z,
        };

        const openTl = gsap.timeline({
          onComplete: () => setIsResumeDeskOpen(true),
        });

        // Stage 1: Arc up over top of character while facing character
        openTl
          .to(camera.position, {
            x: 0,
            y: 19.5,
            z: 16.0,
            duration: 0.9,
            ease: "power2.in",
          })
          .to(
            camera.rotation,
            {
              x: -0.38,
              y: 0,
              z: 0,
              duration: 0.9,
              ease: "power2.in",
            },
            0
          )
          // Stage 2: Glide down to the desk surface beside the monitor
          .to(camera.position, {
            x: -1.5,
            y: 11.8,
            z: 18.0,
            duration: 1.1,
            ease: "power2.out",
          })
          .to(
            camera.rotation,
            {
              x: -0.05,
              y: 0.1,
              z: 0,
              duration: 1.1,
              ease: "power2.out",
            },
            "<"
          );
      };

      const handleCloseResumeDesk = () => {
        setIsResumeDeskOpen(false);
        const targetX = initialCamPos.current?.x || 0;
        const targetY = initialCamPos.current?.y || 13.1;
        const targetZ = initialCamPos.current?.z || 24.7;

        const closeTl = gsap.timeline();

        // Stage 1: Arc back up over top of character
        closeTl
          .to(camera.position, {
            x: 0,
            y: 19.5,
            z: 16.0,
            duration: 0.9,
            ease: "power2.in",
          })
          .to(
            camera.rotation,
            {
              x: -0.38,
              y: 0,
              z: 0,
              duration: 0.9,
              ease: "power2.in",
            },
            0
          )
          // Stage 2: Return to initial front view
          .to(camera.position, {
            x: targetX,
            y: targetY,
            z: targetZ,
            duration: 1.1,
            ease: "power2.out",
          })
          .to(
            camera.rotation,
            {
              x: 0,
              y: 0,
              z: 0,
              duration: 1.1,
              ease: "power2.out",
            },
            "<"
          );
      };

      window.addEventListener("openResumeDesk", handleOpenResumeDesk);
      window.addEventListener("closeResumeDesk", handleCloseResumeDesk);

      document.addEventListener("mousemove", onMouseMove);
      const landingDiv = document.getElementById("landingDiv");
      if (landingDiv) {
        landingDiv.addEventListener("touchstart", onTouchStart);
        landingDiv.addEventListener("touchend", onTouchEnd);
      }
      const animate = () => {
        animFrameId = requestAnimationFrame(animate);
        light.updateCursorLighting(mouse.x, mouse.y, mouseSpeed);
        mouseSpeed *= 0.92; // decay mouse speed smoothly
        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );
          light.setPointLight(screenLight);
        }
        const delta = clock.getDelta();
        if (mixer) {
          mixer.update(delta);
        }
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        cancelAnimationFrame(animFrameId);
        clearTimeout(debounce);
        window.removeEventListener("openResumeDesk", handleOpenResumeDesk);
        window.removeEventListener("closeResumeDesk", handleCloseResumeDesk);
        scene.clear();
        renderer.dispose();
        if (canvasDiv.current && renderer.domElement && canvasDiv.current.contains(renderer.domElement)) {
          canvasDiv.current.removeChild(renderer.domElement);
        }
        if (landingDiv) {
          document.removeEventListener("mousemove", onMouseMove);
          landingDiv.removeEventListener("touchstart", onTouchStart);
          landingDiv.removeEventListener("touchend", onTouchEnd);
        }
      };
    }
  }, []);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
      {isResumeDeskOpen && (
        <ResumeDeskModal
          onClose={() => {
            window.dispatchEvent(new CustomEvent("closeResumeDesk"));
          }}
        />
      )}
    </>
  );
};

export default Scene;
