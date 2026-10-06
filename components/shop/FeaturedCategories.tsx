'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Gamepad2, Sparkles, Film, ArrowRight, Flame } from 'lucide-react';

export default function FeaturedCategories() {
  const t = useTranslations('featuredCategories');

  const categories = [
    {
      id: '1',
      name: t('cat1_name'),
      slug: 'minecraft-alts',
      count: t('cat1_count'),
      tag: t('cat1_tag'),
      icon: <Gamepad2 className="w-6 h-6 text-zinc-200" />,
      gradient: 'from-zinc-700/20 via-zinc-800/10 to-transparent',
      borderGlow: 'hover:border-zinc-500 hover:shadow-lg',
      description: t('cat1_desc'),
    },
    {
      id: '2',
      name: t('cat2_name'),
      slug: 'gaming-accounts',
      count: t('cat2_count'),
      tag: t('cat2_tag'),
      icon: <Flame className="w-6 h-6 text-zinc-200" />,
      gradient: 'from-zinc-700/20 via-zinc-800/10 to-transparent',
      borderGlow: 'hover:border-zinc-500 hover:shadow-lg',
      description: t('cat2_desc'),
    },
    {
      id: '3',
      name: t('cat3_name'),
      slug: 'ai-software',
      count: t('cat3_count'),
      tag: t('cat3_tag'),
      icon: <Sparkles className="w-6 h-6 text-zinc-200" />,
      gradient: 'from-zinc-700/20 via-zinc-800/10 to-transparent',
      borderGlow: 'hover:border-zinc-500 hover:shadow-lg',
      description: t('cat3_desc'),
    },
    {
      id: '4',
      name: t('cat4_name'),
      slug: 'entertainment',
      count: t('cat4_count'),
      tag: t('cat4_tag'),
      icon: <Film className="w-6 h-6 text-zinc-200" />,
      gradient: 'from-zinc-700/20 via-zinc-800/10 to-transparent',
      borderGlow: 'hover:border-zinc-500 hover:shadow-lg',
      description: t('cat4_desc'),
    },
  ];

  return (
    <section className="py-16 sm:py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/60 border border-zinc-700/60 text-zinc-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
              <span>{t('badge')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-sans text-zinc-900 dark:text-white tracking-tight">
              {t('title')}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-lg font-sans">
              {t('description')}
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 font-sans group active:scale-95 transition-all"
          >
            <span>{t('viewFullStore')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className={`relative rounded-3xl p-6 bg-white dark:bg-[#121215] border border-[#E5E1D8] dark:border-[#27272A] shadow-sm transition-all duration-300 group overflow-hidden flex flex-col justify-between space-y-6 ${cat.borderGlow} active:scale-[0.98]`}
            >
              {/* Subtle Ambient Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${cat.gradient} opacity-20 group-hover:opacity-40 transition-opacity`}
              />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#EFECE5]/60 dark:bg-[#18181C] border border-[#E5E1D8] dark:border-[#27272A] flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-xs">
                    {cat.icon}
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#EFECE5] dark:bg-[#18181C] border border-[#E5E1D8] dark:border-[#27272A] text-zinc-700 dark:text-zinc-300">
                    {cat.tag}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors font-sans">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="relative z-10 pt-3 border-t border-[#E5E1D8] dark:border-[#27272A] flex items-center justify-between text-xs font-sans text-zinc-500 dark:text-zinc-400">
                <span>{cat.count}</span>
                <span className="text-zinc-900 dark:text-white group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                  {t('viewNow')} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
