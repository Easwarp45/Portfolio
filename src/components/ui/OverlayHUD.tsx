'use client';

import { Terminal, Mail, Cpu, FolderGit2, Send, Orbit, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { GithubIcon, LinkedinIcon } from './Icons';

interface OverlayHUDProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  selectedNodeName?: string;
  selectedProjectName?: string;
}

export default function OverlayHUD({
  activeSection,
  setActiveSection,
  selectedNodeName,
  selectedProjectName
}: OverlayHUDProps) {
  const [timeStr, setTimeStr] = useState('');
  const [frameRate, setFrameRate] = useState(60);

  // Update current time coordinates continuously
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTimeStr(d.toLocaleTimeString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate floating FPS values for cyber authenticity
  useEffect(() => {
    const fpsInterval = setInterval(() => {
      setFrameRate(() => Math.floor(Math.random() * 4) + 57); // 57-60 fps
    }, 1200);
    return () => clearInterval(fpsInterval);
  }, []);

  // Map sections to coordinates values for HUD indicator
  const getCoordinates = () => {
    switch (activeSection) {
      case 'home': return 'COORD_SEC_00 // [0.00, 0.00, 7.00]';
      case 'about': return 'COORD_SEC_01 // [14.0, 3.00, 8.00]';
      case 'projects': return 'COORD_SEC_02 // [-14.0, 2.00, 8.0]';
      case 'contact': return 'COORD_SEC_03 // [0.00, -15.0, 7.0]';
      default: return 'COORD_SEC_00 // [0.00, 0.00, 0.00]';
    }
  };

  const navItems = [
    { id: 'home', label: 'Quantum Core', icon: Orbit },
    { id: 'about', label: 'Stack Graph', icon: Cpu },
    { id: 'projects', label: 'Containers', icon: FolderGit2 },
    { id: 'contact', label: 'API Gateway', icon: Send }
  ];

  return (
    <>
      {/* 1. Header (Redesigned Dedicated Top Bar Layout with z-30 pointer-events-auto) */}
      <header className="fixed top-0 left-0 right-0 z-30 pointer-events-auto bg-slate-950/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 pt-4 w-full flex items-center justify-between border-b border-[#00ffcc]/20 pb-3 select-none font-mono">
          
          {/* Brand/Title Card */}
          <div className="flex items-center gap-2 bg-slate-950/70 border border-cyber-cyan/20 px-3.5 py-1.5 rounded relative">
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-cyber-cyan" />
            <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-cyber-cyan" />
            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-cyber-cyan" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-cyber-cyan" />
            
            <Terminal className="w-4 h-4 text-cyber-cyan animate-pulse" />
            <span className="text-xs font-bold tracking-widest text-white text-glow-cyan uppercase">
              EASWARAMURTHY <span className="text-cyber-cyan">P</span>
            </span>
          </div>

          {/* HUD Navbar Capsule */}
          <nav className="flex items-center bg-slate-950/90 border border-cyber-cyan/35 px-2.5 py-1 rounded-full shadow-[0_0_15px_rgba(0,240,255,0.15)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] md:text-xs uppercase tracking-wider transition-all duration-300 relative ${
                    isActive 
                      ? 'bg-cyber-cyan/15 text-cyber-cyan text-glow-cyan border border-cyber-cyan/40 shadow-inner' 
                      : 'text-gray-400 hover:text-white border border-transparent'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cyber-pink rounded-full animate-ping" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Status Indicator Panel */}
          <div className="hidden md:flex items-center gap-3 bg-slate-950/70 border border-cyber-cyan/20 px-3 py-1.5 rounded text-[10px] text-cyber-cyan/80 relative">
            <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-cyber-cyan" />
            <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-cyber-cyan" />
            <div className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
            <span>FPS: {frameRate}</span>
          </div>

        </div>
      </header>

      {/* 2. HUD Viewport Overlays (Diagnostics, Social vertical docks, and scrolling logs footer) */}
      <div className="fixed inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 md:p-6 select-none font-mono pt-20">
        
        {/* Decorative Sci-fi CRT HUD overlay borders (Corner brackets) */}
        <div className="absolute top-20 left-4 w-4 h-4 border-t-2 border-l-2 border-cyber-cyan/60 pointer-events-none" />
        <div className="absolute top-20 right-4 w-4 h-4 border-t-2 border-r-2 border-cyber-cyan/60 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-cyber-cyan/60 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-cyber-cyan/60 pointer-events-none" />

        {/* Center crosshair HUD for core tracking (only on landing home screen) */}
        {activeSection === 'home' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 flex items-center justify-center pointer-events-none opacity-25">
            <div className="absolute w-full h-[1px] bg-cyber-cyan" />
            <div className="absolute h-full w-[1px] bg-cyber-cyan" />
            <div className="w-16 h-16 border border-cyber-cyan rounded-full border-dashed animate-spin" style={{ animationDuration: '20s' }} />
            <div className="absolute w-3 h-3 border border-cyber-pink rounded-full" />
            <span className="absolute top-2 left-2 text-[7px] text-cyber-cyan uppercase tracking-widest">TRK_LOCK: TRUE</span>
          </div>
        )}

        {/* Empty layout spacer to match vertical flex structure */}
        <div />

        {/* 2. Side Panels */}
        <div className="w-full flex justify-between items-center grow my-4 relative">
          
          {/* Left Side: System Metadata Diagnostic Box */}
          <div className="hidden lg:flex flex-col gap-3.5 text-[9px] text-gray-400 bg-slate-950/85 border border-cyber-cyan/20 p-4 rounded backdrop-blur-md pointer-events-auto max-w-[210px] relative shadow-lg">
            {/* Neon corner tabs */}
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-cyber-cyan" />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-cyber-cyan" />
            <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-cyber-cyan" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-cyber-cyan" />

            <div className="text-[10px] text-cyber-cyan border-b border-cyber-cyan/20 pb-1.5 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-ping" />
              <span>PROFILE_CONSOLE</span>
            </div>
            <div>CAMERA VECTOR:<br/><span className="text-white text-glow-cyan font-bold">{getCoordinates()}</span></div>
            <div>ACTIVE STACK NODE:<br/><span className="text-cyber-pink font-bold">{selectedNodeName || 'NONE_SELECTED'}</span></div>
            <div>ACTIVE PROJECT:<br/><span className="text-cyber-green font-bold">{selectedProjectName || 'NONE_SELECTED'}</span></div>
          </div>

          {/* Right Side: Social links vertical cyber dock */}
          <div className="absolute right-0 flex flex-col gap-3 pointer-events-auto bg-slate-950/85 border border-cyber-cyan/20 p-2.5 rounded backdrop-blur-md shadow-lg relative">
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-cyber-cyan" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-cyber-cyan" />

            <a 
              href="https://github.com/Easwarp45" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 rounded border border-cyber-cyan/15 hover:border-cyber-cyan/60 flex items-center justify-center text-gray-400 hover:text-cyber-cyan hover:bg-cyber-cyan/10 transition-all duration-300"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a 
              href="https://www.linkedin.com/search/results/all/?keywords=Easwaramurthy%20P" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 rounded border border-cyber-cyan/15 hover:border-cyber-cyan/60 flex items-center justify-center text-gray-400 hover:text-cyber-cyan hover:bg-cyber-cyan/10 transition-all duration-300"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a 
              href="https://www.instagram.com/eswar.png/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 rounded border border-cyber-cyan/15 hover:border-cyber-cyan/60 flex items-center justify-center text-gray-400 hover:text-cyber-cyan hover:bg-cyber-cyan/10 transition-all duration-300"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <a 
              href="mailto:contact@easwar.dev" 
              className="w-8 h-8 rounded border border-cyber-cyan/15 hover:border-cyber-cyan/60 flex items-center justify-center text-gray-400 hover:text-cyber-cyan hover:bg-cyber-cyan/10 transition-all duration-300"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* 3. Footer (System Logs & Clock) */}
        <footer className="w-full flex flex-col md:flex-row justify-between items-center gap-2 pointer-events-auto border-t border-cyber-cyan/20 pt-3.5 text-[9px] md:text-[10px] text-gray-400 backdrop-blur-sm bg-slate-950/10 px-2">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-cyber-pink rounded-full animate-ping" />
            <span>ROUTE: </span>
            <span className="text-cyber-cyan text-glow-cyan uppercase font-bold">{activeSection}_ZONE_BOUND</span>
          </div>
          
          {/* Scrolling logs output */}
          <div className="hidden lg:block text-cyber-cyan/40 text-[9px] max-w-[40%] truncate font-mono">
            {activeSection === 'home' && '>> SYS_INIT: QUANTUM CORE RENDERED --NODES [120] --SAT [3]'}
            {activeSection === 'about' && '>> STACK_INIT: DOMAIN SCANNED --NODES [16] --LINKS [19]'}
            {activeSection === 'projects' && '>> MON_CONN: DEPLOYED DRIVES ONLINE --CONTAINERS [3]'}
            {activeSection === 'contact' && '>> APIGATE: LISTENING ON PORT 443 --SSL_ENABLED [TRUE]'}
          </div>

          <div className="flex items-center gap-2 bg-slate-950/50 border border-cyber-cyan/10 px-2 py-0.5 rounded">
            <span className="text-white text-glow-cyan">{timeStr}</span>
            <span className="text-cyber-cyan/40">GMT+0530</span>
          </div>
        </footer>
      </div>
    </>
  );
}
