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
    <section id="features" className="py-12 border-y border-white/[0.06] bg-[#070a14]/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className={`relative group rounded-2xl p-6 glass-card border border-white/10 ${b.glowColor} transition-all duration-300 hover:-translate-y-1.5 overflow-hidden`}
              >
                {/* Background Glow */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${b.bgGlow} rounded-bl-full pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity`}
                />

                <div className="relative z-10 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className={`w-6 h-6 ${b.glowColor}`} />
                  </div>
                  <h3 className="text-base font-bold text-white font-display tracking-tight">
                    {b.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
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
