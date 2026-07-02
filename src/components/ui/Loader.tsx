'use client';

import { useProgress } from '@react-three/drei';
import { useEffect, useState } from 'react';

export default function Loader() {
  const { active, progress: rawProgress } = useProgress();
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [dots, setDots] = useState('');
  const [isClient, setIsClient] = useState(false);

  // 1. Next.js Client-Side Hydration Guard
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 2. Flashing Console Dots effect
  useEffect(() => {
    if (!isClient) return;
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, [isClient]);

  // 3. Procedural / Actual loading progress tracking
  useEffect(() => {
    if (!isClient) return;

    if (active) {
      setProgress(rawProgress);
    } else {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          const increment = Math.floor(Math.random() * 18) + 12;
          return Math.min(100, prev + increment);
        });
      }, 60);

      return () => clearInterval(interval);
    }
  }, [active, rawProgress, isClient]);

  // 4. Smooth Fade-Out & Unmount on 100% completion
  useEffect(() => {
    if (progress === 100) {
      const fadeTimer = setTimeout(() => setFadeOut(true), 200);
      const unmountTimer = setTimeout(() => setShow(false), 1000);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(unmountTimer);
      };
    }
  }, [progress]);

  // 5. Fallback Failure Protection: Max 2.5 seconds hard timeout threshold
  useEffect(() => {
    if (!isClient) return;

    const fallbackTimer = setTimeout(() => {
      console.warn('[System Bootloader Timeout] Bypassing loading screen - forcing active viewport after 2.5s.');
      setProgress(100);
      setFadeOut(true);
      setTimeout(() => setShow(false), 800);
    }, 2500); // 2.5-second hard timeout fallback

    return () => clearTimeout(fallbackTimer);
  }, [isClient]);

  if (!isClient || !show) return null;

  // Format terminal text progress bar
  const barLength = 20;
  const filledLength = Math.round((progress / 100) * barLength);
  const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 transition-opacity duration-700 ease-in-out ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Cybersecurity matrix background grid */}
      <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />

      {/* Terminal Core Container */}
      <div className="w-[90%] max-w-[450px] font-mono text-xs border border-cyber-cyan/30 glass-panel p-6 rounded relative z-10 flex flex-col gap-4 text-glow-cyan">
        
        {/* Top bar with terminal header */}
        <div className="flex justify-between items-center border-b border-cyber-cyan/20 pb-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-cyber-pink animate-pulse" />
            <span className="text-[10px] tracking-widest text-cyber-cyan uppercase font-bold">
              System Bootloader v4.0.2
            </span>
          </div>
          <span className="text-[9px] text-cyber-cyan/60">SYS_OK</span>
        </div>

        {/* Load Status Logs */}
        <div className="flex flex-col gap-1.5 text-cyber-cyan/80 text-[11px] leading-relaxed">
          <div>&gt; CONNECT_ESTABLISHED: PORT_3D_SECURE</div>
          <div>&gt; ALLOCATING GPU SHADER BUFFER MEMORY...</div>
          <div>&gt; LOADING PROCEDURAL MESH GEOMETRIES...</div>
          <div className="text-cyber-green flex items-center justify-between">
            <span>&gt; INITIALIZING QUANTUM CORE{dots}</span>
            <span className="font-bold">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Progress Bar Grid */}
        <div className="w-full flex items-center gap-2">
          <span className="text-cyber-cyan/50">[</span>
          <span className="text-cyber-cyan tracking-tighter grow font-bold select-none">{bar}</span>
          <span className="text-cyber-cyan/50">]</span>
        </div>

        {/* Binary/Hex footer aesthetic */}
        <div className="flex justify-between items-center text-[9px] text-cyber-cyan/40 border-t border-cyber-cyan/20 pt-2 select-none">
          <span>MEM_ALLOC: 412.8KB</span>
          <span>GATEWAY: ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
