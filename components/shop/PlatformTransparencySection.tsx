'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Zap, Clock, MessageSquare, QrCode, ShieldCheck, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from '@/navigation';

export function PlatformTransparencySection() {
  const t = useTranslations('transparency');

  return (
    <section id="transparency" className="py-14 sm:py-20 relative max-w-7xl mx-auto px-4 sm:px-6 w-full">
      {/* Header */}
      <div className="space-y-2 mb-8 sm:mb-10 text-left">
        <span className="text-xs font-mono font-bold tracking-wider text-zinc-500 uppercase">
          {t('badge')}
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 dark:text-[#F4F4F5] tracking-tight font-sans">
          {t('title')}
        </h2>
      </div>

      {/* Grid 5 Cards matching Image 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Card 1: Giao hàng (Chiếm 7 cột) */}
        <div className="lg:col-span-7 rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-[#27272A] shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-[#18181C] border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200">
              <Zap className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
              <span>{t('deliveryBadge')}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-[#F4F4F5]">
              {t('deliveryTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-[#94949E] leading-relaxed">
              {t('deliveryDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#18181C] border border-zinc-200 dark:border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-white">
                <Zap className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{t('instantTitle')}</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {t('instantDesc')}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#18181C] border border-zinc-200 dark:border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-white">
                <Clock className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />
                <span>{t('manualTitle')}</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {t('manualDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Discord Support 1-1 (Chiếm 5 cột) */}
        <div className="lg:col-span-5 rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-[#27272A] shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-[#18181C] border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200">
              <MessageSquare className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
              <span>{t('discordBadge')}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-[#F4F4F5]">
              {t('discordTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-[#94949E] leading-relaxed">
              {t('discordDesc')}
            </p>
          </div>

        </div>

        {/* Card 3: Thanh toán QR (4 cột) */}
        <div className="lg:col-span-4 rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-[#27272A] shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-[#18181C] border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200">
              <QrCode className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
              <span>{t('paymentBadge')}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-[#F4F4F5]">
              {t('paymentTitle')}
            </h3>
            <p className="text-xs text-zinc-600 dark:text-[#94949E] leading-relaxed">
              {t('paymentDesc')}
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px] text-zinc-600 dark:text-zinc-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>{t('qrItem1')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>{t('qrItem2')}</span>
            </div>
          </div>
        </div>

        {/* Card 4: Bảo hành (4 cột) */}
        <div className="lg:col-span-4 rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-[#27272A] shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-[#18181C] border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
              <span>{t('warrantyBadge')}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-[#F4F4F5]">
              {t('warrantyTitle')}
            </h3>
            <p className="text-xs text-zinc-600 dark:text-[#94949E] leading-relaxed">
              {t('warrantyDesc')}
            </p>
          </div>

          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {t('warrantyNote')}
            </span>
          </div>
        </div>

        {/* Card 5: Trang trí Decao (4 cột) */}
        <div className="lg:col-span-4 rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-[#27272A] shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-[#18181C] border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200">
              <Sparkles className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
              <span>{t('decaoBadge')}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-[#F4F4F5]">
              {t('decaoTitle')}
            </h3>
            <p className="text-xs text-zinc-600 dark:text-[#94949E] leading-relaxed">
              {t('decaoDesc')}
            </p>
          </div>

          <Link
            href="/shop?category=discord-services"
            className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-[#18181C] dark:hover:bg-[#202025] text-white border border-zinc-800 dark:border-zinc-700 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xs"
          >
            <span>{t('decaoBtn')}</span>
            <ArrowRight className="w-4 h-4 stroke-[2]" />
          </Link>
        </div>

      </div>
    </section>
  );
}

export default PlatformTransparencySection;
