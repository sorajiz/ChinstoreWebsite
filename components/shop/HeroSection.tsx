'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRouter, Link } from '@/navigation';
import {
  ArrowRight,
  Sparkles,
  Flame,
  ShoppingBag,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import DiscordServerWidget from '@/components/shop/DiscordServerWidget';

interface HeroSectionProps {
  onQuickCheckout?: (product: any) => void;
}

export function HeroSection({ onQuickCheckout }: HeroSectionProps) {
  const t = useTranslations('hero');
  const router = useRouter();

  return (
    <section id="hero" className="relative pt-20 pb-14 sm:pt-28 sm:pb-20 px-4 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        
        {/* CỘT TRÁI: TIÊU ĐỀ & HÀNH ĐỘNG NHANH */}
        <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
          
          {/* Headline Typography */}
          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight text-zinc-950 dark:text-white leading-[1.12] font-sans">
            {t('title_part1')} <br />
            <span className="text-zinc-600 dark:text-zinc-400 font-extrabold">
              {t('title_part2')}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-xl font-normal leading-relaxed">
            {t('subtitle')}
          </p>

          {/* Action CTAs (Dark & Grey buttons) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/shop"
              className="group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <span>{t('ctaPricing')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#featured-products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm text-zinc-800 dark:text-zinc-200 bg-white dark:bg-[#121215] hover:bg-zinc-100 dark:hover:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 transition-all shadow-xs active:scale-[0.98]"
            >
              <ShoppingBag className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
              <span>{t('ctaBestSellers')}</span>
            </a>
          </div>

          {/* Metrics Bar with Animated Rolling Numbers */}
          <div className="grid grid-cols-4 gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800 w-full max-w-xl">
            <div>
              <div className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white font-mono tracking-tight">
                <AnimatedCounter end={500} suffix="+" />
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">{t('stat1_label')}</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white font-mono tracking-tight">
                <AnimatedCounter end={1} suffix={t('stat2_value').includes('Min') ? ' Min' : ' Phút'} />
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">{t('stat2_label')}</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white font-mono tracking-tight">
                <AnimatedCounter end={2.5} decimals={1} suffix="K+" />
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">{t('stat3_label')}</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white font-mono tracking-tight">
                <span className="tabular-nums font-mono">1:1</span>
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">{t('stat4_label')}</div>
            </div>
          </div>

        </div>

        {/* CỘT PHẢI: REALTIME DISCORD SERVER GUILD CARD (Ảnh 4) */}
        <div className="lg:col-span-5 relative w-full">
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-500/15 blur-3xl rounded-3xl pointer-events-none" />
          <DiscordServerWidget />
        </div>

      </div>
    </section>
  );
}

export default HeroSection;
