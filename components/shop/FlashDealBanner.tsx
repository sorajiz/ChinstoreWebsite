'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Flame, Copy, Check, ArrowRight, Tag } from 'lucide-react';
import { toast } from 'sonner';

export default function FlashDealBanner() {
  const t = useTranslations('flashDeal');
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText('CHIN2026');
    setCopied(true);
    toast.success(t('copySuccess'), {
      icon: <Tag className="w-4 h-4 text-emerald-400" />,
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const padZero = (n: number) => n.toString().padStart(2, '0');

  return (
    <section className="py-10 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-[1px] bg-zinc-300 dark:bg-zinc-800 shadow-xl overflow-hidden">
          
          {/* Inner Content Container */}
          <div className="relative rounded-[23px] bg-white/95 dark:bg-[#121215]/95 backdrop-blur-2xl p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 border border-zinc-200 dark:border-zinc-800">
            
            {/* Ambient Background glow */}
            <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-zinc-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-zinc-700/10 blur-3xl pointer-events-none" />

            {/* Left Content */}
            <div className="space-y-4 max-w-2xl text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
                <span>{t('badge')}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-950 dark:text-white tracking-tight leading-tight">
                {t('titlePart1')}
                <span className="text-zinc-600 dark:text-zinc-400 font-extrabold">
                  {t('titlePart2')}
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t('description')}
              </p>

              {/* Voucher Code Box */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{t('extraCode')}</span>
                <button
                  onClick={handleCopyCode}
                  className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white font-mono font-bold text-xs transition-all shadow-xs"
                >
                  <Tag className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="tracking-widest">CHIN2026</span>
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white" />
                  )}
                </button>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  {t('discountValue')}
                </span>
              </div>
            </div>

            {/* Right Timer & CTA */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-6 z-10 shrink-0">
              
              {/* Countdown Digits */}
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-center p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 min-w-[64px]">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-zinc-950 dark:text-white">
                    {padZero(timeLeft.hours)}
                  </span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-medium mt-0.5">{t('hours')}</span>
                </div>
                <span className="text-xl font-bold text-zinc-400 font-mono">:</span>
                <div className="flex flex-col items-center p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 min-w-[64px]">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-zinc-950 dark:text-white">
                    {padZero(timeLeft.minutes)}
                  </span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-medium mt-0.5">{t('minutes')}</span>
                </div>
                <span className="text-xl font-bold text-zinc-400 font-mono">:</span>
                <div className="flex flex-col items-center p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 min-w-[64px]">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-zinc-950 dark:text-white">
                    {padZero(timeLeft.seconds)}
                  </span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-medium mt-0.5">{t('seconds')}</span>
                </div>
              </div>

              {/* Action Button (Dark & Grey / White button) */}
              <Link
                href="/shop"
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all w-full sm:w-auto"
              >
                <span>{t('huntDeal')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
