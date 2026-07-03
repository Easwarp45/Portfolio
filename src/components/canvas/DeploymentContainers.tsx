'use client';

import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

export interface ProjectData {
  id: string;
  name: string;
  category: string;
  description: string;
  tech: string[];
  metrics: {
    label: string;
    value: string;
  }[];
  liveUrl: string;
  githubUrl: string;
  pos: [number, number, number];
}

export const projectsData: ProjectData[] = [
  {
    id: 'kanakku-platform',
    name: 'Kanakku Platform',
    category: 'Finance Workflow',
    description: 'An Indian-market expense tracker that helps users log spending, spot trends, and stay on top of day-to-day budgeting without adding friction.',
    tech: ['Flutter', 'Supabase', 'Riverpod', 'PostgreSQL', 'Dart'],
    metrics: [
      { label: 'Focus', value: 'Budgeting' },
      { label: 'Platform', value: 'Mobile App' },
      { label: 'Database', value: 'PostgreSQL' }
    ],
    liveUrl: '/demos/kanakku',
    githubUrl: 'https://github.com/Easwarp45/kanakku',
    pos: [-16.0, 0.2, 0.5]
  },
  {
    id: 'hirewise-platform',
    name: 'HireWise',
    category: 'SaaS AI Automation',
    description: 'An automated recruitment pipeline system that scores resume structures, filters candidate profiles, and manages talent acquisition stages for hiring teams.',
    tech: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Tailwind CSS'],
    metrics: [
      { label: 'Type', value: 'Recruiter SaaS' },
      { label: 'API Latency', value: '< 100ms' },
      { label: 'Scale', value: 'Enterprise' }
    ],
    liveUrl: 'https://hirewise-zeta.vercel.app/',
    githubUrl: 'https://github.com/deepak-9962/hirewise',
    pos: [-13.8, 1.2, -0.5]
  },
  {
    id: 'keyforge-platform',
    name: 'KeyForge (Secure Pass)',
    category: 'Auth Experience',
    description: 'A secure authentication and passwordless key-management concept exploring WebAuthn protocols, secure cryptographic credential trust, and SRP handshakes.',
    tech: ['Next.js', 'TypeScript', 'WebAuthn', 'Supabase', 'Node.js'],
    metrics: [
      { label: 'Standard', value: 'WebAuthn/FIDO2' },
      { label: 'Database', value: 'Supabase BaaS' },
      { label: 'Auth Flow', value: 'Passwordless' }
    ],
    liveUrl: '/demos/keyforge',
    githubUrl: 'https://github.com/Easwarp45/secure_pass',
    pos: [-12.0, -0.8, 0.5]
  }
];

interface DeploymentContainersProps {
  onSelectProject: (project: ProjectData | null) => void;
  selectedProject: ProjectData | null;
}

export default function DeploymentContainers({ onSelectProject, selectedProject }: DeploymentContainersProps) {
  const [hoveredPodId, setHoveredPodId] = useState<string | null>(null);

  // Maintain separate references to apply floating animations independently
  const podRefs = useRef<{ [key: string]: THREE.Group | null }>({});

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    projectsData.forEach((project, idx) => {
      const ref = podRefs.current[project.id];
      if (ref) {
        // Floating motion: offset Y slightly based on time and index offset
        ref.position.y = project.pos[1] + Math.sin(time * 1.5 + idx * 2.0) * 0.15;
        
        // Spin the container drive slowly
        ref.rotation.y = time * 0.2 + idx * 0.5;
        
        // Tilt slightly
        ref.rotation.x = Math.sin(time * 0.8 + idx) * 0.08;
      }
    });
  });

  return (
    <group>
      {/* Visual coordinates reference grid */}
      <gridHelper 
        args={[10, 10, '#00f0ff', 'rgba(0, 240, 255, 0.04)']} 
        position={[-14, -2.5, 0]} 
        rotation={[Math.PI / 2, 0, 0]}
      />

      {projectsData.map((project) => {
        const isHovered = hoveredPodId === project.id;
        const isSelected = selectedProject?.id === project.id;
        
        // Glow styling colors
        const color = isSelected ? '#00ff66' : isHovered ? '#ff007f' : '#00f0ff';

        return (
          <group
            key={project.id}
            ref={(el) => {
              podRefs.current[project.id] = el;
            }}
            position={project.pos}
          >
            {/* Main Interactive server pod */}
            <mesh
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredPodId(project.id);
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                setHoveredPodId(null);
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectProject(project);
              }}
            >
              <boxGeometry args={[0.9, 1.3, 0.9]} />
              <meshBasicMaterial
                color={color}
                wireframe
                transparent
                opacity={isHovered || isSelected ? 0.9 : 0.5}
              />
            </mesh>

            {/* Floating internal core core */}
            <mesh scale={[0.5, 0.8, 0.5]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={isHovered || isSelected ? 0.6 : 0.2}
              />
            </mesh>

            {/* Glowing spinning antenna hoops */}
            <mesh position={[0, 0.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.4, 0.02, 8, 24]} />
              <meshBasicMaterial color={color} transparent opacity={0.6} />
            </mesh>
            <mesh position={[0, -0.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.4, 0.02, 8, 24]} />
              <meshBasicMaterial color={color} transparent opacity={0.6} />
            </mesh>

            {/* Interactive HTML status tags above the floating drive */}
            <Html distanceFactor={6} position={[0, 1.2, 0]} center pointerEvents="none">
              <div className="flex flex-col items-center select-none whitespace-nowrap">
                <div 
                  className="text-[10px] font-mono bg-[#04040c] text-[#00ffcc] border border-[#00ffcc]/40 px-2 py-1 rounded shadow-lg transition-colors duration-300"
                >
                  {project.name}
                </div>
                <div className="w-[1px] h-3 mt-1" style={{ backgroundColor: color }} />
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
