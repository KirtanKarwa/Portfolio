import * as THREE from "three";
import gsap from "gsap";

export const handleMouseMove = (
  event: MouseEvent,
  setMousePosition: (x: number, y: number) => void
) => {
  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  setMousePosition(mouseX, mouseY);
};

export const handleTouchMove = (
  event: TouchEvent,
  setMousePosition: (x: number, y: number) => void
) => {
  const mouseX = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
  setMousePosition(mouseX, mouseY);
};

export const handleTouchEnd = (
  setMousePosition: (
    x: number,
    y: number,
    interpolationX: number,
    interpolationY: number
  ) => void
) => {
  setTimeout(() => {
    setMousePosition(0, 0, 0.03, 0.03);
    setTimeout(() => {
      setMousePosition(0, 0, 0.1, 0.2);
    }, 1000);
  }, 2000);
};

export const handleHeadRotation = (
  headBone: THREE.Object3D,
  mouseX: number,
  mouseY: number,
  interpolationX: number,
  interpolationY: number,
  lerp: (x: number, y: number, t: number) => number,
  character?: THREE.Object3D | null
) => {
  if (!headBone) return;
  if (window.scrollY < 200) {
    const maxRotation = Math.PI / 6;
    headBone.rotation.y = lerp(
      headBone.rotation.y,
      mouseX * maxRotation,
      interpolationY
    );
    let minRotationX = -0.3;
    let maxRotationX = 0.4;
    if (mouseY > minRotationX) {
      if (mouseY < maxRotationX) {
        headBone.rotation.x = lerp(
          headBone.rotation.x,
          -mouseY - 0.5 * maxRotation,
          interpolationX
        );
      } else {
        headBone.rotation.x = lerp(
          headBone.rotation.x,
          -maxRotation - 0.5 * maxRotation,
          interpolationX
        );
      }
    } else {
      headBone.rotation.x = lerp(
        headBone.rotation.x,
        -minRotationX - 0.5 * maxRotation,
        interpolationX
      );
    }

    // 🌟 3D Mouse Parallax Body Tilt
    if (character) {
      character.rotation.z = lerp(character.rotation.z, -mouseX * 0.04, 0.05);
      character.rotation.x = lerp(character.rotation.x, mouseY * 0.03, 0.05);
    }
  } else {
    if (window.innerWidth > 1024) {
      headBone.rotation.x = lerp(headBone.rotation.x, -0.4, 0.03);
      headBone.rotation.y = lerp(headBone.rotation.y, -0.3, 0.03);
      if (character) {
        character.rotation.z = lerp(character.rotation.z, 0, 0.05);
      }
    }
  }
};

// 🌟 Interactive Click Reaction (Nod & Eyebrow Flick)
export const triggerClickReaction = (
  headBone: THREE.Object3D | null,
  mixer?: THREE.AnimationMixer | null
) => {
  if (!headBone) return;

  // Head Nod Animation
  gsap.timeline()
    .to(headBone.rotation, {
      x: headBone.rotation.x + 0.35,
      duration: 0.15,
      ease: "power2.out"
    })
    .to(headBone.rotation, {
      x: headBone.rotation.x,
      duration: 0.4,
      ease: "elastic.out(1, 0.4)"
    });
};
