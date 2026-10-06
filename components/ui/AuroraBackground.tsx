'use client';

import React from 'react';

export default function AuroraBackground({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full bg-[#08090E] text-slate-200 antialiased selection:bg-brand-primary/30 selection:text-white">
      {/* 1. Lưới Lattice Grid Pattern phủ mờ cao cấp (AuraGradients) */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.14]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 20%, black 50%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 20%, black 50%, transparent 95%)'
        }}
      />

      {/* 2. Dải ánh sáng Ambient Glow siêu mịn (Webflow / Linear Style) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden blur-[140px] opacity-40">
        <div className="absolute top-[-15%] left-[20%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-br from-indigo-600/40 via-purple-600/30 to-transparent animate-pulse-slow" />
        <div className="absolute top-[25%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-bl from-cyan-600/30 via-blue-600/20 to-transparent" />
      </div>

      {children ? (
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      ) : null}
    </div>
  );
}
