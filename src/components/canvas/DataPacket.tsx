'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DataPacketProps {
  isTransmitting: boolean;
  onAnimationComplete: () => void;
}

export default function DataPacket({ isTransmitting, onAnimationComplete }: DataPacketProps) {
  const gatewayRef = useRef<THREE.Mesh>(null);
  const packetRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Points>(null);
  const explosionRef = useRef<THREE.Points>(null);

  const [active, setActive] = useState(false);
  const [exploded, setExploded] = useState(false);

  // Bezier curve defining the data packet trajectory from user overlay space to API gateway
  const curve = useMemo(() => {
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, -12, 3),    // Spawn near the screen/HUD overlay
      new THREE.Vector3(-1.8, -13.5, 1), // Warp curve
      new THREE.Vector3(0, -15, -1)     // Target API Gateway Node
    );
  }, []);

  const progressRef = useRef(0);

  // Pre-allocate trail particle positions (static relative offsets, dynamically positioned behind packet)
  const trailCount = 15;
  const [trailPositions, trailAges] = useMemo(() => {
    const pos = new Float32Array(trailCount * 3);
    const age = new Float32Array(trailCount);
    return [pos, age];
  }, []);

  // Pre-allocate explosion particle positions and velocity directions
  const explosionCount = 45;
  const [explosionPositions, explosionVelocities] = useMemo(() => {
    const pos = new Float32Array(explosionCount * 3);
    const vel = new Float32Array(explosionCount * 3);
    for (let i = 0; i < explosionCount; i++) {
      // Random directions
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = 0.05 + Math.random() * 0.08;

      vel[i * 3] = speed * Math.sin(phi) * Math.cos(theta);
      vel[i * 3 + 1] = speed * Math.sin(phi) * Math.sin(theta);
      vel[i * 3 + 2] = speed * Math.cos(phi);
    }
    return [pos, vel];
  }, []);

  useEffect(() => {
    if (isTransmitting) {
      setActive(true);
      setExploded(false);
      progressRef.current = 0;
      
      // Initialize trail positions at spawn coordinate
      const spawnPt = curve.getPointAt(0);
      for (let i = 0; i < trailCount; i++) {
        trailPositions[i * 3] = spawnPt.x;
        trailPositions[i * 3 + 1] = spawnPt.y;
        trailPositions[i * 3 + 2] = spawnPt.z;
        trailAges[i] = i / trailCount;
      }
    }
  }, [isTransmitting, curve, trailPositions, trailAges]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Slow rotate gateway node
    if (gatewayRef.current) {
      gatewayRef.current.rotation.y = time * 0.5;
      gatewayRef.current.rotation.z = Math.sin(time) * 0.2;
    }

    // 2. Animate Data Packet along Curve
    if (active) {
      progressRef.current += 0.018; // Speed of flight

      if (progressRef.current >= 1.0) {
        progressRef.current = 1.0;
        setActive(false);
        setExploded(true);

        // Initialize explosion positions at gateway node position
        const targetPt = curve.getPointAt(1);
        for (let i = 0; i < explosionCount; i++) {
          explosionPositions[i * 3] = targetPt.x;
          explosionPositions[i * 3 + 1] = targetPt.y;
          explosionPositions[i * 3 + 2] = targetPt.z;
        }

        // Complete contact callback after explosion completes
        setTimeout(() => {
          setExploded(false);
          onAnimationComplete();
        }, 1200);
      }

      // Update packet mesh coordinate
      const currentPt = curve.getPointAt(progressRef.current);
      if (packetRef.current) {
        packetRef.current.position.copy(currentPt);
      }

      // Update trail points
      const trail = trailRef.current;
      if (trail) {
        const geo = trail.geometry.getAttribute('position') as THREE.BufferAttribute;
        if (!geo) return;
        const arr = geo.array as Float32Array;

        for (let i = 0; i < trailCount; i++) {
          trailAges[i] += 0.05;
          if (trailAges[i] >= 1.0) {
            trailAges[i] = 0;
            // Snaps back to current packet head position
            arr[i * 3] = currentPt.x;
            arr[i * 3 + 1] = currentPt.y;
            arr[i * 3 + 2] = currentPt.z;
          } else {
            // Apply drift to trail points to create dynamic tail effect
            arr[i * 3] += (Math.random() - 0.5) * 0.02;
            arr[i * 3 + 1] += (Math.random() - 0.5) * 0.02;
            arr[i * 3 + 2] += (Math.random() - 0.5) * 0.02;
          }
        }
        geo.needsUpdate = true;
      }
    }

    // 3. Animate Explosion
    if (exploded) {
      const explosion = explosionRef.current;
      if (explosion) {
        const geo = explosion.geometry.getAttribute('position') as THREE.BufferAttribute;
        if (!geo) return;
        const arr = geo.array as Float32Array;

        for (let i = 0; i < explosionCount; i++) {
          arr[i * 3] += explosionVelocities[i * 3];
          arr[i * 3 + 1] += explosionVelocities[i * 3 + 1];
          arr[i * 3 + 2] += explosionVelocities[i * 3 + 2];
          
          // Apply gravity/damping decay
          explosionVelocities[i * 3] *= 0.96;
          explosionVelocities[i * 3 + 1] *= 0.96;
          explosionVelocities[i * 3 + 2] *= 0.96;
        }
        geo.needsUpdate = true;
      }
    }
  });

  return (
    <group>
      {/* 1. API Gateway Target Server Node */}
      <mesh ref={gatewayRef} position={[0, -15, -1]}>
        <octahedronGeometry args={[0.65, 0]} />
        <meshBasicMaterial 
          color={isTransmitting ? '#00ff66' : '#bd00ff'} 
          wireframe 
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Core ring */}
      <mesh position={[0, -15, -1]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 0.95, 32]} />
        <meshBasicMaterial 
          color="#00f0ff" 
          transparent 
          opacity={0.3} 
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* 2. Flying Data Packet Node */}
      {active && (
        <mesh ref={packetRef}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="#00ff66" />
        </mesh>
      )}

      {/* 3. Packet Trail Particle System */}
      {active && (
        <points ref={trailRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[trailPositions, 3]}
              count={trailCount}
              array={trailPositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#00f0ff"
            size={0.05}
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      {/* 4. Explosion Particle System */}
      {exploded && (
        <points ref={explosionRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[explosionPositions, 3]}
              count={explosionCount}
              array={explosionPositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#00ff66"
            size={0.06}
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}
    </group>
  );
}
