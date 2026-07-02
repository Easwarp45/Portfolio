'use client';

import { Canvas } from '@react-three/fiber';
import Scene from './Scene';
import { TechNode } from './SystemArchitecture';
import { ProjectData } from './DeploymentContainers';

interface ClientCanvasProps {
  activeSection: string;
  onSelectNode: (node: TechNode | null) => void;
  selectedNode: TechNode | null;
  onSelectProject: (project: ProjectData | null) => void;
  selectedProject: ProjectData | null;
  isTransmitting: boolean;
  onAnimationComplete: () => void;
}

export default function ClientCanvas(props: ClientCanvasProps) {
  return (
    <div className="fixed inset-0 w-screen h-screen z-0 overflow-hidden pointer-events-auto bg-transparent">
      <Canvas
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: true, 
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false,
          precision: 'highp'
        }}
        camera={{ position: [0, 0, 7], fov: 60, near: 0.1, far: 100 }}
      >
        {/* Lights required by the rendering corrective framework */}
        <ambientLight intensity={1.2} />
        <pointLight position={[10, 10, 10]} intensity={2.5} color="#00ffcc" />
        <pointLight position={[-10, -10, -10]} intensity={2.5} color="#ff007f" />

        <Scene {...props} />
      </Canvas>
    </div>
  );
}
