'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const posRef = useRef({ x: -100, y: -100 });
  const [renderPos, setRenderPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          setRenderPos({ ...posRef.current });
          setIsVisible(true);
          rafRef.current = 0;
        });
      }
    };

    // Track when user hovers interactive components to morph cursor
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.closest('button') || 
        target.closest('a') || 
        target.getAttribute('role') === 'button' ||
        target.classList.contains('cursor-pointer');
      
      setIsHovered(!!isClickable);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    
    // Hide cursor when leaving document bounds
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []); // Empty dependency array — no stale closure

  if (!isVisible) return null;

  return (
    <div 
      className="fixed top-0 left-0 pointer-events-none z-[99999] transform -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${renderPos.x}px`,
        top: `${renderPos.y}px`,
        willChange: 'left, top',
      }}
    >
      {/* Cyber terminal block tracking cursor */}
      <div 
        className={`border transition-all duration-200 relative ${
          isHovered 
            ? 'w-6 h-6 border-cyber-pink bg-cyber-pink/25 rotate-45 shadow-[0_0_12px_rgba(255,0,127,0.6)]' 
            : 'w-4 h-4 border-cyber-cyan bg-cyber-cyan/15 shadow-[0_0_8px_rgba(0,240,255,0.45)]'
        }`}
      >
        {/* Inner holographic pointer dot */}
        <div className={`w-1 h-1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full ${
          isHovered ? 'bg-cyber-pink' : 'bg-cyber-cyan'
        }`} />
      </div>
    </div>
  );
}
