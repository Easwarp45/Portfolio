'use client';

import { TechNode } from '../canvas/SystemArchitecture';
import { X, ShieldCheck, Database, Wrench, Layout } from 'lucide-react';

interface StackDetailsCardProps {
  selectedNode: TechNode | null;
  onClose: () => void;
}

export default function StackDetailsCard({ selectedNode, onClose }: StackDetailsCardProps) {
  if (!selectedNode) return null;

  // Render icons corresponding to categories
  const getCategoryIcon = () => {
    switch (selectedNode.category) {
      case 'frontend': return <Layout className="w-4 h-4 text-cyber-cyan" />;
      case 'backend': return <ShieldCheck className="w-4 h-4 text-cyber-purple" />;
      case 'database': return <Database className="w-4 h-4 text-cyber-pink" />;
      case 'devops': return <Wrench className="w-4 h-4 text-amber-400" />;
      default: return null;
    }
  };

  const getBorderColor = () => {
    switch (selectedNode.category) {
      case 'frontend': return 'border-cyber-cyan/30';
      case 'backend': return 'border-cyber-purple/30';
      case 'database': return 'border-cyber-pink/30';
      case 'devops': return 'border-amber-400/30';
      default: return 'border-cyber-cyan/30';
    }
  };

  const getGlowClass = () => {
    switch (selectedNode.category) {
      case 'frontend': return 'text-glow-cyan';
      case 'backend': return 'text-glow-purple';
      case 'database': return 'text-glow-pink'; // standard text flow
      case 'devops': return 'text-amber-400';
      default: return 'text-glow-cyan';
    }
  };

  return (
    <div className="absolute bottom-[10%] left-1/2 transform -translate-x-1/2 md:translate-x-0 md:left-6 md:bottom-20 w-[92%] max-w-[400px] z-20 pointer-events-auto font-mono">
      <div className={`glass-panel border ${getBorderColor()} rounded overflow-hidden ${getGlowClass()}`}>
        
        {/* Header Bar */}
        <div className="bg-slate-950 px-4 py-2 border-b border-cyber-cyan/15 flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            {getCategoryIcon()}
            <span className="font-bold tracking-wider uppercase">{selectedNode.category}_CORE_SPEC</span>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-0.5 rounded border border-transparent"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Panel */}
        <div className="p-4 md:p-5 flex flex-col gap-4 text-xs">
          <div>
            <span className="text-[8px] uppercase tracking-widest block font-bold text-gray-400 mb-0.5">
              Proficiency Details
            </span>
            <h2 className="text-white text-base font-bold tracking-wide uppercase select-text">
              {selectedNode.name}
            </h2>
          </div>

          <p className="text-gray-300 leading-relaxed text-[11px] select-text">
            {selectedNode.details}
          </p>

          {/* Sub skills stack */}
          <div className="flex flex-col gap-2 border-t border-cyber-cyan/15 pt-3">
            <span className="text-[8px] uppercase tracking-widest block font-bold text-gray-500">
              Technical Modules / Proficiencies:
            </span>
            <div className="grid grid-cols-2 gap-1.5 mt-1 select-text">
              {selectedNode.skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-1.5 text-white">
                  <span className="w-1 h-1 bg-cyber-green rounded-full shrink-0" />
                  <span className="text-[10px] text-gray-300">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Candidate Profile Summary */}
          <div className="bg-slate-950/70 border border-cyber-cyan/15 p-3 rounded flex flex-col gap-1.5 text-[9px] text-gray-400 mt-1 select-text">
            <div className="text-[8px] text-cyber-cyan font-bold tracking-wider uppercase mb-0.5">
              CANDIDATE_PROFILE
            </div>
            <div>STATUS: <span className="text-white font-bold">Undergraduate Engineer</span></div>
            <div>OBJECTIVE: <span className="text-cyber-pink font-bold">Professional Full-Stack Developer Roles</span></div>
            <p className="text-[9px] text-gray-400 leading-relaxed italic border-t border-cyber-cyan/10 pt-1 mt-0.5">
              Undergraduate engineer expanding digital portfolios to demonstrate readiness for professional, enterprise-scale software engineering roles.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
