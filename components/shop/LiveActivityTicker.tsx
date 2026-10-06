'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface ActivityItem {
  id: string;
  user: string;
  item: string;
  gateway: 'VietQR' | 'Litecoin';
  timeVal: number;
  timeUnit: 'sec' | 'min';
}

const ACTIVITIES: ActivityItem[] = [
  { id: '1', user: 'hoang_minh***', item: 'Minecraft Java & Bedrock Full Access', gateway: 'VietQR', timeVal: 12, timeUnit: 'sec' },
  { id: '2', user: 'cyber_alex***', item: 'Steam CS2 Prime VIP Clean 100%', gateway: 'Litecoin', timeVal: 35, timeUnit: 'sec' },
  { id: '3', user: 'quang_huy***', item: 'Claude 3.5 Sonnet Pro 1 Month', gateway: 'VietQR', timeVal: 1, timeUnit: 'min' },
  { id: '4', user: 'duy_anh***', item: 'Minecraft Hypixel MVP+ Level 120', gateway: 'VietQR', timeVal: 2, timeUnit: 'min' },
  { id: '5', user: 'crypto_whale***', item: 'Valorant Diamond Account Unrated', gateway: 'Litecoin', timeVal: 3, timeUnit: 'min' },
  { id: '6', user: 'linh_tran***', item: 'ChatGPT Plus Team GPT-4o 30 Days', gateway: 'VietQR', timeVal: 4, timeUnit: 'min' },
  { id: '7', user: 'nam_nguyen***', item: 'Netflix 4K UHD Private Profile 1 Year', gateway: 'VietQR', timeVal: 6, timeUnit: 'min' },
  { id: '8', user: 'viet_anh***', item: 'OptiFine Custom Cape Official', gateway: 'VietQR', timeVal: 8, timeUnit: 'min' },
];

export default function LiveActivityTicker() {
  const t = useTranslations('ticker');

  return (
    <div className="w-full bg-zinc-100/80 dark:bg-[#101013]/90 border-y border-zinc-200 dark:border-zinc-800/80 backdrop-blur-md overflow-hidden py-2.5 relative z-20">
      {/* Edge gradient masks for smooth fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#F8F7F4] dark:from-[#09090B] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#F8F7F4] dark:from-[#09090B] to-transparent z-10 pointer-events-none" />

      {/* Marquee Track */}
      <div className="flex w-max items-center animate-marquee hover:[animation-play-state:paused]">
        {[...ACTIVITIES, ...ACTIVITIES].map((act, index) => {
          const timeText = act.timeUnit === 'sec' ? `${act.timeVal} ${t('secAgo')}` : `${act.timeVal} ${t('minAgo')}`;
          return (
            <div
              key={`${act.id}-${index}`}
              className="flex items-center gap-2.5 mx-6 text-xs text-zinc-700 dark:text-zinc-300 font-mono shrink-0 select-none group"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-zinc-900 dark:text-zinc-100 font-semibold">{act.user}</span>
              <span className="text-zinc-400 dark:text-zinc-500">{t('justPurchased')}</span>
              <span className="text-zinc-900 dark:text-white font-medium bg-white dark:bg-white/[0.04] px-2 py-0.5 rounded border border-zinc-200 dark:border-white/10 group-hover:border-zinc-500/40 transition-colors shadow-xs">
                {act.item}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 font-bold">
                {act.gateway}
              </span>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500">{timeText}</span>
              <span className="text-zinc-300 dark:text-zinc-700 mx-2">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
