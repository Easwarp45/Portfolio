'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function QuantumCore() {
  // Read mouse tracking values directly from useThree context
  const { mouse } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const coreMeshRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);

  const PARTICLE_COUNT = 150;

  // Pre-allocate base positions for the particle lattice network
  const originalPositions = useMemo(() => {
    const orig = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Scatter particles in a wide spherical region to fill all screen corners
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 3.5 + Math.random() * 11.5;

      orig[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      orig[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      orig[i * 3 + 2] = r * Math.cos(phi);
    }
    return orig;
  }, []);

  const positions = useMemo(() => new Float32Array(originalPositions), [originalPositions]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // 1. Core breathing pulse & rotations
    if (coreMeshRef.current) {
      coreMeshRef.current.rotation.y = time * 0.2;
      coreMeshRef.current.rotation.x = time * 0.1;
      
      const pulse = 1.0 + Math.sin(time * 2.2) * 0.05;
      coreMeshRef.current.scale.set(pulse, pulse, pulse);
    }

    // 2. Slow spin particle lattice container group
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.04;
    }

    // 3. Dynamic mouse-warp calculation on points attributes
    const points = pointsRef.current;
    if (points) {
      const geoPoints = points.geometry.getAttribute('position') as THREE.BufferAttribute;
      if (geoPoints) {
        const arr = geoPoints.array as Float32Array;
        
        // Transform standard 2D mouse vector coordinates to relative 3D space
        const mouseVec = new THREE.Vector3(mouse.x * 4.2, mouse.y * 4.2, 0);

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const i3 = i * 3;
          const px = originalPositions[i3];
          const py = originalPositions[i3 + 1];
          const pz = originalPositions[i3 + 2];

          // Compute base position with noise drift
          const pVector = new THREE.Vector3(
            px + Math.sin(time + px) * 0.08,
            py + Math.cos(time + py) * 0.08,
            pz + Math.sin(time * 0.5 + pz) * 0.08
          );

          // Warp away from mouse position if within boundary
          const dist = pVector.distanceTo(mouseVec);
          if (dist < 1.9) {
            const force = (1.9 - dist) * 0.16;
            const dir = pVector.clone().sub(mouseVec).normalize();
            pVector.addScaledVector(dir, force);
          }

          arr[i3] = pVector.x;
          arr[i3 + 1] = pVector.y;
          arr[i3 + 2] = pVector.z;
        }
        geoPoints.needsUpdate = true;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Core Mesh: icosahedronGeometry & wireframe meshStandardMaterial */}
      <mesh ref={coreMeshRef}>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshStandardMaterial 
          color="#00ffcc" 
          emissive="#00ffcc" 
          emissiveIntensity={1.2} 
          wireframe 
          roughness={0.25}
          metalness={0.85}
        />
      </mesh>

      {/* Decorative Outer Ring 1 - Cyan */}
      <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <torusGeometry args={[2.1, 0.015, 8, 48]} />
        <meshBasicMaterial color="#00ffcc" transparent opacity={0.25} />
      </mesh>

      {/* Decorative Outer Ring 2 - Pink */}
      <mesh rotation={[-Math.PI / 4, Math.PI / 3, 0]}>
        <torusGeometry args={[2.5, 0.01, 8, 48]} />
        <meshBasicMaterial color="#ff007f" transparent opacity={0.25} />
      </mesh>

      {/* Points particle lattice network */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={PARTICLE_COUNT}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#00ffcc"
          size={0.065}
          sizeAttenuation
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
