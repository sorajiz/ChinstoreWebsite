'use client';

import React, { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Zap, ShieldCheck, Coins, Lock, Sparkles } from 'lucide-react';

interface Pillar {
  icon: React.ReactNode;
  titleKey: string;
  tagKey: string;
  descKey: string;
  borderGlow: string;
}

const PILLAR_CONFIGS: Pillar[] = [
  {
    icon: <Zap className="w-6 h-6 text-zinc-400" />,
    titleKey: 'p1Title',
    tagKey: 'p1Tag',
    descKey: 'p1Desc',
    borderGlow: 'hover:border-zinc-500 hover:shadow-[0_0_30px_rgba(120,120,130,0.15)]',
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
    titleKey: 'p2Title',
    tagKey: 'p2Tag',
    descKey: 'p2Desc',
    borderGlow: 'hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]',
  },
  {
    icon: <Coins className="w-6 h-6 text-zinc-300" />,
    titleKey: 'p3Title',
    tagKey: 'p3Tag',
    descKey: 'p3Desc',
    borderGlow: 'hover:border-zinc-400 hover:shadow-[0_0_30px_rgba(160,160,170,0.15)]',
  },
  {
    icon: <Lock className="w-6 h-6 text-amber-400" />,
    titleKey: 'p4Title',
    tagKey: 'p4Tag',
    descKey: 'p4Desc',
    borderGlow: 'hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]',
  },
];

function SpotlightCard({ pillar, t }: { pillar: Pillar; t: any }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all duration-300 overflow-hidden group ${pillar.borderGlow}`}
    >
      {/* Dynamic Cursor Spotlight Radial Glow */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(200, 200, 220, 0.08), transparent 80%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-300">
            {pillar.icon}
          </div>
          <span className="text-[10px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">
            {t(pillar.tagKey)}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-zinc-950 dark:text-white font-sans group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
            {t(pillar.titleKey)}
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            {t(pillar.descKey)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CorePillars() {
  const t = useTranslations('pillars');

  return (
    <section id="features" className="py-16 sm:py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-200/80 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700/80 text-zinc-800 dark:text-zinc-200 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span>{t('badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-sans text-zinc-950 dark:text-white tracking-tight">
            {t('title')}<span className="text-zinc-600 dark:text-zinc-400 font-extrabold">{t('titleHighlight')}</span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLAR_CONFIGS.map((pillar, idx) => (
            <SpotlightCard key={idx} pillar={pillar} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
