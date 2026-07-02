'use client';

import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface CameraControllerProps {
  activeSection: string;
}

export default function CameraController({ activeSection }: CameraControllerProps) {
  const { camera } = useThree();
  
  // Track base coordinates (which GSAP will transition between sections)
  const basePosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 7));
  const targetPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  
  // Track interpolated mouse positions for lag/inertia sway
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let camX = 0, camY = 0, camZ = 7;
    let lookX = 0, lookY = 0, lookZ = 0;

    switch (activeSection) {
      case 'home':
        camX = 0;
        camY = 0;
        camZ = 7;
        lookX = 0;
        lookY = 0;
        lookZ = 0;
        break;
      case 'about':
        camX = 14;
        camY = 3;
        camZ = 8;
        lookX = 14;
        lookY = 0;
        lookZ = 0;
        break;
      case 'projects':
        camX = -14;
        camY = 2;
        camZ = 8;
        lookX = -14;
        lookY = 0;
        lookZ = 0;
        break;
      case 'contact':
        camX = 0;
        camY = -15;
        camZ = 7;
        lookX = 0;
        lookY = -15;
        lookZ = 0;
        break;
    }

    // Kill any active GSAP animations to prevent conflicts
    gsap.killTweensOf(basePosRef.current);
    gsap.killTweensOf(targetPosRef.current);

    // Smooth transition of base camera coordinates
    gsap.to(basePosRef.current, {
      x: camX,
      y: camY,
      z: camZ,
      duration: 2.2,
      ease: 'power3.inOut',
    });

    // Smooth transition of camera target vector
    gsap.to(targetPosRef.current, {
      x: lookX,
      y: lookY,
      z: lookZ,
      duration: 2.2,
      ease: 'power3.inOut',
    });
  }, [activeSection]);

  useFrame((state) => {
    // Read the mouse coordinates directly from R3F state
    const mouseX = state.mouse.x;
    const mouseY = state.mouse.y;

    // Apply linear interpolation for smooth deceleration (inertia)
    mouseRef.current.x = THREE.MathUtils.lerp(mouseRef.current.x, mouseX, 0.05);
    mouseRef.current.y = THREE.MathUtils.lerp(mouseRef.current.y, mouseY, 0.05);

    // Compute sway factors (sway camera position offset)
    const swayX = mouseRef.current.x * 1.5;
    const swayY = mouseRef.current.y * 1.2;

    // Offset camera coordinates with the sway offset
    camera.position.x = basePosRef.current.x + swayX;
    camera.position.y = basePosRef.current.y + swayY;
    camera.position.z = basePosRef.current.z;

    // Apply parallax lookAt target shifts for complete spatial deep-tilt effect
    const currentTarget = targetPosRef.current.clone();
    camera.lookAt(
      currentTarget.x + mouseRef.current.x * 0.95,
      currentTarget.y + mouseRef.current.y * 0.85,
      currentTarget.z
    );
  });

  return null;
}
