'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Zap, ShieldCheck, Download, Headset } from 'lucide-react';

export default function TrustBadges() {
  const t = useTranslations('trust');

  const badges = [
    {
      icon: Zap,
      title: t('badge1_title'),
      desc: t('badge1_desc'),
      glowColor: 'group-hover:border-cyan-500/40 text-cyan-400',
      bgGlow: 'from-cyan-500/10 to-transparent',
    },
    {
      icon: ShieldCheck,
      title: t('badge2_title'),
      desc: t('badge2_desc'),
      glowColor: 'group-hover:border-emerald-500/40 text-emerald-400',
      bgGlow: 'from-emerald-500/10 to-transparent',
    },
    {
      icon: Download,
      title: t('badge3_title'),
      desc: t('badge3_desc'),
      glowColor: 'group-hover:border-purple-500/40 text-purple-400',
      bgGlow: 'from-purple-500/10 to-transparent',
    },
    {
      icon: Headset,
      title: t('badge4_title'),
      desc: t('badge4_desc'),
      glowColor: 'group-hover:border-pink-500/40 text-pink-400',
      bgGlow: 'from-pink-500/10 to-transparent',
    },
  ];

  return (
    <section id="features" className="py-12 border-y border-[#E5E1D8] dark:border-[#27272A] bg-[#F7F5F0]/60 dark:bg-[#09090B]/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className={`relative group rounded-2xl p-6 bg-white dark:bg-[#121215] border border-[#E5E1D8] dark:border-[#27272A] shadow-sm transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
              >
                {/* Background Glow */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${b.bgGlow} rounded-bl-full pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity`}
                />

                <div className="relative z-10 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#EFECE5]/60 dark:bg-[#18181C] border border-[#E5E1D8] dark:border-[#27272A] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white font-display tracking-tight">
                    {b.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                    {b.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
