'use client';

import React, { useEffect, useState } from 'react';

export default function AuroraBackground({ children }: { children?: React.ReactNode }) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#F8F7F4] dark:bg-[#09090B] text-[#121214] dark:text-[#F4F4F5] antialiased selection:bg-brand-primary/30 selection:text-white transition-colors duration-300 overflow-x-clip">
      {/* 1. Lưới Grid Caro Khung Vuông To (72px x 72px) Cao Cấp */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.05] dark:opacity-[0.14]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse 95% 75% at 50% 20%, black 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 95% 75% at 50% 20%, black 40%, transparent 95%)'
        }}
      />

      {/* 2. Dải ánh sáng Parallax Ambient Glow siêu mịn */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden blur-[140px] opacity-20 dark:opacity-35">
        <div 
          className="absolute rounded-full bg-gradient-to-br from-indigo-500/30 dark:from-indigo-600/35 via-purple-500/20 dark:via-purple-600/25 to-transparent transition-transform duration-700 ease-out"
          style={{
            top: '-10%',
            left: '25%',
            width: '50vw',
            height: '50vw',
            transform: `translateY(${scrollY * 0.12}px)`,
          }}
        />
        <div 
          className="absolute rounded-full bg-gradient-to-bl from-cyan-500/15 dark:from-cyan-600/20 via-indigo-500/10 dark:via-indigo-600/15 to-transparent transition-transform duration-700 ease-out"
          style={{
            top: '40%',
            right: '-10%',
            width: '45vw',
            height: '45vw',
            transform: `translateY(${scrollY * -0.08}px)`,
          }}
        />
        <div 
          className="absolute rounded-full bg-gradient-to-tr from-purple-600/10 dark:from-purple-700/20 via-brand-primary/10 dark:via-brand-primary/15 to-transparent transition-transform duration-700 ease-out"
          style={{
            top: '75%',
            left: '-10%',
            width: '40vw',
            height: '40vw',
            transform: `translateY(${scrollY * 0.05}px)`,
          }}
        />
      </div>

      {children ? (
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      ) : null}
    </div>
  );
}
