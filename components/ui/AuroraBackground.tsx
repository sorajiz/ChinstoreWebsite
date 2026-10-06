'use client';

import React from 'react';

export default function AuroraBackground({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full bg-[#08090E] text-slate-200 antialiased selection:bg-brand-primary/30 selection:text-white">
      {/* 1. Lưới Cyber Grid Pattern phủ mờ cao cấp */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.16]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 20%, black 50%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 20%, black 50%, transparent 95%)'
        }}
      />

      {/* 2. Dải ánh sáng Ambient Aurora Glow siêu mịn */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden blur-[130px] opacity-45">
        <div className="absolute top-[-15%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-indigo-600/40 via-purple-600/30 to-transparent animate-pulse-slow" />
        <div className="absolute top-[35%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-bl from-cyan-600/30 via-indigo-600/25 to-transparent" />
        <div className="absolute top-[65%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tr from-purple-700/25 via-brand-primary/20 to-transparent" />
      </div>

      {children ? (
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      ) : null}
    </div>
  );
}
