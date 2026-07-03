'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// UI Overlays
import Loader from '@/components/ui/Loader';
import OverlayHUD from '@/components/ui/OverlayHUD';
import CustomCursor from '@/components/ui/CustomCursor';

// Type definitions
import { TechNode } from '@/components/canvas/SystemArchitecture';
import { ProjectData } from '@/components/canvas/DeploymentContainers';

// Dynamically import the Client Canvas to bypass SSR hydration issues with Three.js
const ClientCanvas = dynamic(() => import('@/components/canvas/ClientCanvas'), {
  ssr: false,
});

export default function Home() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [visitedSections, setVisitedSections] = useState<string[]>(['home']);

  useEffect(() => {
    setVisitedSections((prev) => 
      prev.includes(activeSection) ? prev : [...prev, activeSection]
    );
  }, [activeSection]);

  const scanPercentage = Math.round((visitedSections.length / 4) * 100);
  
  // Selection states (for Stack nodes and Project containers)
  const [selectedNode, setSelectedNode] = useState<TechNode | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  
  // 3D form transmission animation state
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);

  const handleSelectNode = (node: TechNode | null) => {
    setSelectedProject(null); // Clear project selection if details overlay opens
    setSelectedNode(node);
    if (node) {
      setActiveSection('about'); // Force transition to Stack tab when clicking a 3D node
    }
  };

  const handleSelectProject = (project: ProjectData | null) => {
    setSelectedNode(null); // Clear node selection if details overlay opens
    setSelectedProject(project);
    if (project) {
      setActiveSection('projects'); // Force transition to Projects tab when clicking a 3D container
    }
  };

  const handleSectionChange = (section: string) => {
    // Reset selection overlays when transitioning pages
    setSelectedNode(null);
    setSelectedProject(null);
    setActiveSection(section);
  };

  return (
    <main className="relative min-h-screen w-screen overflow-hidden text-white scanlines">
      {/* 1. Cyberpunk Overlay Grid & Vignette */}
      <div className="cyber-grid pointer-events-none" />
      <div className="cyber-vignette pointer-events-none" />

      {/* 2. Interactive R3F 3D Canvas */}
      <ClientCanvas
        activeSection={activeSection}
        selectedNode={selectedNode}
        onSelectNode={handleSelectNode}
        selectedProject={selectedProject}
        onSelectProject={handleSelectProject}
        isTransmitting={isTransmitting}
        onAnimationComplete={() => setIsTransmitting(false)}
      />

      {/* 3D Viewport Translucent Readability Mask */}
      <div className="fixed inset-0 bg-[#020205]/60 backdrop-blur-[0.5px] pointer-events-none z-5" />

      {/* 3. Redesigned HUD Cockpit Navigation & Control Deck Panel */}
      <OverlayHUD
        activeSection={activeSection}
        setActiveSection={handleSectionChange}
        selectedNode={selectedNode}
        setSelectedNode={handleSelectNode}
        selectedProject={selectedProject}
        setSelectedProject={handleSelectProject}
        isTransmitting={isTransmitting}
        setIsTransmitting={setIsTransmitting}
        scanPercentage={scanPercentage}
      />

      {/* 4. Animated 3D Loader wrapped in React Suspense */}
      <Loader />

      {/* 5. Glowing Cyber Cursor */}
      <CustomCursor />
    </main>
  );
}
