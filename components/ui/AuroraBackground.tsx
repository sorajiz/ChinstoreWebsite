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
    <div className="relative min-h-screen w-full bg-[#F8F7F4] dark:bg-[#0c0c0e] text-[#121214] dark:text-[#F4F4F5] antialiased selection:bg-brand-primary/30 selection:text-white transition-colors duration-300 overflow-x-clip">
      {/* 1. Nền Đen Obsidian Sang Trọng & Ánh Sáng Parallax Mịn Màng Chuẩn Ảnh Tham Khảo */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none hidden dark:block transition-opacity duration-300"
        style={{
          background: 'radial-gradient(120% 75% at 50% -5%, #18181c 0%, #0c0c0e 65%)'
        }}
      />

      {/* 2. Dải ánh sáng Parallax Ambient Glow siêu mịn (Monochrome Đen Xám - Pure Dark Obsidian) */}
      <div 
        data-sora-opt="particle"
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden blur-[140px] opacity-15 dark:opacity-25"
      >
        <div 
          className="absolute rounded-full bg-gradient-to-br from-zinc-300/20 dark:from-zinc-800/30 via-zinc-400/10 dark:via-zinc-900/20 to-transparent transition-transform duration-700 ease-out"
          style={{
            top: '-10%',
            left: '25%',
            width: '50vw',
            height: '50vw',
            transform: `translateY(${scrollY * 0.12}px)`,
          }}
        />
        <div 
          className="absolute rounded-full bg-gradient-to-bl from-zinc-400/15 dark:from-zinc-800/25 via-zinc-500/10 dark:via-zinc-900/15 to-transparent transition-transform duration-700 ease-out"
          style={{
            top: '40%',
            right: '-10%',
            width: '45vw',
            height: '45vw',
            transform: `translateY(${scrollY * -0.08}px)`,
          }}
        />
        <div 
          className="absolute rounded-full bg-gradient-to-tr from-zinc-500/10 dark:from-zinc-800/20 via-zinc-600/10 dark:via-zinc-900/10 to-transparent transition-transform duration-700 ease-out"
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
