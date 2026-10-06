'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRouter, Link } from '@/navigation';
import {
  ArrowRight,
  Sparkles,
  Flame,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';

interface HeroSectionProps {
  onQuickCheckout?: (product: any) => void;
}

export function HeroSection({ onQuickCheckout }: HeroSectionProps) {
  const t = useTranslations('hero');
  const router = useRouter();
  const { currency, addItem } = useStore();

  const sampleFeaturedDeal = {
    id: 'cmuvgek3y00064shyr5d2ec3i',
    name: 'Minecraft Java & Bedrock FA (Full Access) + Migrated',
    slug: 'minecraft-fa-migrated',
    description: 'Đổi Email, Pass, Skin tự do. Không bị ban mọi server Hypixel.',
    priceVND: 180000,
    price: 180000,
    availableCount: 2,
    images: ['https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=800&q=80'],
  };

  const handleBuyFeatured = () => {
    addItem(sampleFeaturedDeal as any, 1);
    if (onQuickCheckout) {
      onQuickCheckout(sampleFeaturedDeal);
    } else {
      router.push('/shop');
    }
  };

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
              <Flame className="w-4 h-4 text-amber-500" />
              <span>{t('ctaBestSellers')}</span>
            </a>
          </div>

          {/* Metrics Bar */}
          <div className="grid grid-cols-4 gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800 w-full max-w-xl">
            <div>
              <div className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white font-mono tracking-tight">{t('stat1_value')}</div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">{t('stat1_label')}</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white font-mono tracking-tight">{t('stat2_value')}</div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">{t('stat2_label')}</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white font-mono tracking-tight">{t('stat3_value')}</div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">{t('stat3_label')}</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white font-mono tracking-tight">{t('stat4_value')}</div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">{t('stat4_label')}</div>
            </div>
          </div>

        </div>

        {/* CỘT PHẢI: FEATURED SPOTLIGHT CARD */}
        <div className="lg:col-span-5 relative">
          
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-zinc-500/10 dark:bg-zinc-700/15 blur-3xl rounded-3xl pointer-events-none" />

          <div className="relative rounded-3xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 shadow-2xl p-5 sm:p-6 space-y-4">
            
            {/* Header Showcase */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold tracking-wider uppercase text-zinc-900 dark:text-white font-mono">
                  {t('spotlightTag')}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                {t('discountTag')}
              </span>
            </div>

            {/* Featured Product Box */}
            <div className="rounded-2xl p-4 bg-zinc-50 dark:bg-[#18181C] border border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="relative w-full h-44 rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <Image
                  src={sampleFeaturedDeal.images[0]}
                  alt={sampleFeaturedDeal.name}
                  fill
                  className="object-cover"
                  priority
                />
                
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px]">
                  <span className="px-2 py-0.5 rounded-md bg-black/80 text-emerald-400 font-bold backdrop-blur-md">
                    {t('stockLeft')}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-black/80 text-zinc-300 font-mono backdrop-blur-md">
                    {t('code')} MC-FA-01
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 font-semibold">Minecraft Official</span>
                  <span className="text-xs text-zinc-400 line-through font-mono">250.000 đ</span>
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white leading-snug">
                  {sampleFeaturedDeal.name}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                  {sampleFeaturedDeal.description}
                </p>
              </div>

              {/* Price & Buy Button (Light / Grey button matching Ảnh 1) */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-medium">{t('checkoutPrice')}</div>
                  <div className="text-xl font-black text-zinc-950 dark:text-white font-mono">
                    {formatPrice(sampleFeaturedDeal.priceVND, currency)}
                  </div>
                </div>

                <button
                  onClick={handleBuyFeatured}
                  className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
                >
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{t('buyNow3s')}</span>
                </button>
              </div>
            </div>

            {/* Security & Multi-Gateway Trust Badges */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">{t('instantVietQR')}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800">
                <Lock className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />
                <span className="truncate">{t('aesEncrypted')}</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default HeroSection;
