'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// UI Overlays
import Loader from '@/components/ui/Loader';
import OverlayHUD from '@/components/ui/OverlayHUD';
import ContactForm from '@/components/ui/ContactForm';
import ProjectsModal from '@/components/ui/ProjectsModal';
import StackDetailsCard from '@/components/ui/StackDetailsCard';
import PortfolioSections from '@/components/ui/PortfolioSections';
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
  
  // Selection states
  const [selectedNode, setSelectedNode] = useState<TechNode | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  
  // 3D form transmission animation state
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);

  const handleSelectNode = (node: TechNode | null) => {
    setSelectedProject(null); // Clear project selection if details overlay opens
    setSelectedNode(node);
  };

  const handleSelectProject = (project: ProjectData | null) => {
    setSelectedNode(null); // Clear node selection if details overlay opens
    setSelectedProject(project);
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

      <PortfolioSections
        activeSection={activeSection}
        setActiveSection={handleSectionChange}
        onSelectProject={handleSelectProject}
      />

      {/* 3. 2D HUD Navigation Overlay */}
      <OverlayHUD
        activeSection={activeSection}
        setActiveSection={handleSectionChange}
        selectedNodeName={selectedNode?.name}
        selectedProjectName={selectedProject?.name}
      />

      {/* 4. Contact Gateway Input Modal */}
      <ContactForm
        activeSection={activeSection}
        isTransmitting={isTransmitting}
        setIsTransmitting={setIsTransmitting}
      />

      {/* 5. Projects Specs Details Card */}
      <ProjectsModal
        selectedProject={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* 6. System Tech Spec Details Card */}
      <StackDetailsCard
        selectedNode={selectedNode}
        onClose={() => setSelectedNode(null)}
      />

      {/* 7. Animated 3D Loader wrapped in React Suspense */}
      <Loader />

      {/* 8. Glowing Cyber Cursor */}
      <CustomCursor />
    </main>
  );
}
