'use client';

import { ProjectData } from '../canvas/DeploymentContainers';
import { X, ExternalLink, BarChart3, Settings2 } from 'lucide-react';
import { GithubIcon } from './Icons';

interface ProjectsModalProps {
  selectedProject: ProjectData | null;
  onClose: () => void;
}

export default function ProjectsModal({ selectedProject, onClose }: ProjectsModalProps) {
  if (!selectedProject) return null;

  return (
    <div className="absolute bottom-[10%] left-1/2 transform -translate-x-1/2 md:translate-x-0 md:left-6 md:bottom-20 w-[92%] max-w-[420px] z-20 pointer-events-auto font-mono">
      <div className="glass-panel border border-cyber-cyan/30 rounded overflow-hidden text-glow-cyan">
        
        {/* Header Bar */}
        <div className="bg-slate-950 px-4 py-2 border-b border-cyber-cyan/20 flex justify-between items-center text-xs text-cyber-cyan/70">
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-cyber-cyan animate-spin" style={{ animationDuration: '6s' }} />
            <span className="font-bold tracking-wider uppercase">SPECIFICATION_SHEET</span>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-cyber-pink transition-colors p-0.5 rounded border border-transparent hover:border-cyber-pink/20"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Panel */}
        <div className="p-4 md:p-5 flex flex-col gap-4 text-xs">
          
          {/* Main Info */}
          <div>
            <span className="text-[9px] text-cyber-pink uppercase tracking-widest block font-bold mb-0.5">
              {selectedProject.category}
            </span>
            <h2 className="text-white text-base font-bold tracking-wide uppercase select-text">
              {selectedProject.name}
            </h2>
          </div>

          {/* Description */}
          <p className="text-gray-300 leading-relaxed text-[11px] select-text">
            {selectedProject.description}
          </p>

          {/* Core Tech Badges */}
          <div className="flex flex-wrap gap-1.5 border-t border-cyber-cyan/15 pt-3">
            {selectedProject.tech.map((t, i) => (
              <span 
                key={i} 
                className="bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 px-2 py-0.5 rounded text-[9px] font-semibold"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Production container metrics */}
          <div className="bg-slate-950/60 border border-cyber-cyan/10 p-3 rounded flex flex-col gap-2.5">
            <div className="flex items-center gap-1.5 text-[10px] text-cyber-cyan/70 font-bold border-b border-cyber-cyan/10 pb-1">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>CONTAINER_METRICS</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              {selectedProject.metrics.map((metric, i) => (
                <div key={i} className="flex flex-col border-r border-cyber-cyan/10 last:border-none px-1">
                  <span className="text-[8px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">{metric.label}</span>
                  <span className="text-[10px] text-white font-extrabold text-glow-cyan select-text">{metric.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer deployment links */}
          <div className="flex justify-between items-center border-t border-cyber-cyan/15 pt-3 gap-3">
            <a 
              href={selectedProject.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 bg-slate-950 border border-cyber-cyan/20 hover:border-cyber-cyan text-gray-300 hover:text-cyber-cyan py-2 rounded text-[10px] uppercase font-bold flex items-center justify-center gap-1.5 hover:shadow-[0_0_10px_rgba(0,240,255,0.2)] transition-all cursor-pointer"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>Explore Codebase</span>
            </a>
            
            <a 
              href={selectedProject.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan hover:text-white py-2 rounded text-[10px] uppercase font-bold flex items-center justify-center gap-1.5 hover:shadow-[0_0_12px_rgba(0,240,255,0.4)] transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Launch Live App</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
