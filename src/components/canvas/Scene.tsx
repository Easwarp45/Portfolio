'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import CameraController from './CameraController';
import QuantumCore from './QuantumCore';
import SystemArchitecture, { TechNode } from './SystemArchitecture';
import DeploymentContainers, { ProjectData } from './DeploymentContainers';
import DataPacket from './DataPacket';

interface SceneProps {
  activeSection: string;
  onSelectNode: (node: TechNode | null) => void;
  selectedNode: TechNode | null;
  onSelectProject: (project: ProjectData | null) => void;
  selectedProject: ProjectData | null;
  isTransmitting: boolean;
  onAnimationComplete: () => void;
}

// Background space dust particles to provide context and depth during flights
function SpaceDust() {
  const pointsRef = useRef<THREE.Points>(null);
  const COUNT = 350;

  const positions = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      // Scatter points across a wide box bounding all sections
      pos[i * 3] = (Math.random() - 0.5) * 50;  // X: -25 to 25
      pos[i * 3 + 1] = (Math.random() - 0.5) * 45; // Y: -22 to 22
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20; // Z: -10 to 10
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.getElapsedTime();
      // Subtle floating rotation
      pointsRef.current.rotation.y = time * 0.01;
      pointsRef.current.rotation.x = Math.sin(time * 0.05) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.035}
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function Scene({
  activeSection,
  onSelectNode,
  selectedNode,
  onSelectProject,
  selectedProject,
  isTransmitting,
  onAnimationComplete,
}: SceneProps) {
  return (
    <>
      {/* 1. Camera path management */}
      <CameraController activeSection={activeSection} />

      {/* 2. Global Stage Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 10, 10]} intensity={1.5} color="#00f0ff" />
      <pointLight position={[14, 5, 5]} intensity={1.0} color="#bd00ff" />
      <pointLight position={[-14, 5, 5]} intensity={1.0} color="#00f0ff" />
      <pointLight position={[0, -10, 5]} intensity={1.2} color="#00ff66" />
      <directionalLight position={[0, -5, -5]} intensity={0.5} color="#030712" />

      {/* 3. Infinite Background Space Dust */}
      <SpaceDust />

      {/* 4. Page Coordinate Systems */}
      {/* Section 1: Home (Quantum Core) at [0, 0, 0] */}
      <group position={[0, 0, 0]}>
        <QuantumCore />
      </group>

      {/* Section 2: About / Stack (System Architecture Node-Graph) at [14, 0, 0] */}
      <group position={[0, 0, 0]}>
        <SystemArchitecture onSelectNode={onSelectNode} selectedNode={selectedNode} />
      </group>

      {/* Section 3: Projects (Deployment Server Pods) at [-14, 0, 0] */}
      <group position={[0, 0, 0]}>
        <DeploymentContainers onSelectProject={onSelectProject} selectedProject={selectedProject} />
      </group>

      {/* Section 4: Contact (API Gateway Hub) at [0, -15, 0] */}
      <group position={[0, 0, 0]}>
        <DataPacket isTransmitting={isTransmitting} onAnimationComplete={onAnimationComplete} />
      </group>
    </>
  );
}
