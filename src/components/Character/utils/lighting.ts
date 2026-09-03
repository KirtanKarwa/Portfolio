import * as THREE from "three";
import { RGBELoader } from "three-stdlib";
import { gsap } from "gsap";

const setLighting = (scene: THREE.Scene) => {
  const directionalLight = new THREE.DirectionalLight(0xc7a9ff, 0);
  directionalLight.intensity = 0;
  directionalLight.position.set(-0.47, -0.32, -1);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0xc2a4ff, 0, 100, 3);
  pointLight.position.set(3, 12, 4);
  pointLight.castShadow = true;
  scene.add(pointLight);

  // Dynamic interactive light following cursor across the 3D model
  const cursorLight = new THREE.PointLight(0xe4d4ff, 0, 35, 2.2);
  cursorLight.position.set(0, 12, 10);
  scene.add(cursorLight);

  let targetCursorIntensity = 1.2;

  new RGBELoader()
    .setPath("/models/")
    .load("char_enviorment.hdr", function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentIntensity = 0;
      scene.environmentRotation.set(5.76, 85.85, 1);
    });

  function setPointLight(screenLight: any) {
    if (screenLight && screenLight.material && screenLight.material.opacity > 0.9) {
      pointLight.intensity = screenLight.material.emissiveIntensity * 20;
    } else {
      pointLight.intensity = 0;
    }
  }

  function updateCursorLighting(mouseX: number, mouseY: number, speed: number = 0) {
    // Smoothly position cursor light in 3D scene relative to mouse
    cursorLight.position.x = THREE.MathUtils.lerp(cursorLight.position.x, mouseX * 14, 0.08);
    cursorLight.position.y = THREE.MathUtils.lerp(cursorLight.position.y, mouseY * 10 + 12, 0.08);
    
    // Shift directional rim lighting position based on mouse for dynamic rim reflection
    directionalLight.position.x = THREE.MathUtils.lerp(directionalLight.position.x, -0.47 + mouseX * 3, 0.05);

    // Boost glow intensity dynamically when cursor moves fast
    const speedBoost = Math.min(speed * 2.5, 2.0);
    targetCursorIntensity = 1.2 + speedBoost;
    cursorLight.intensity = THREE.MathUtils.lerp(cursorLight.intensity, targetCursorIntensity, 0.1);
  }

  const duration = 2;
  const ease = "power2.inOut";
  function turnOnLights() {
    gsap.to(scene, {
      environmentIntensity: 0.64,
      duration: duration,
      ease: ease,
    });
    gsap.to(directionalLight, {
      intensity: 1,
      duration: duration,
      ease: ease,
    });
    gsap.to(cursorLight, {
      intensity: 1.2,
      duration: duration,
      ease: ease,
    });
    gsap.to(".character-rim", {
      y: "55%",
      opacity: 1,
      delay: 0.2,
      duration: 2,
    });
  }

  return { setPointLight, turnOnLights, updateCursorLighting };
};

export default setLighting;
