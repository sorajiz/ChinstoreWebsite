'use client';

import React from 'react';
import { Sparkles, CheckCircle2, Zap, ShieldCheck } from 'lucide-react';

interface ActivityItem {
  id: string;
  user: string;
  item: string;
  gateway: 'VietQR' | 'Litecoin';
  timeAgo: string;
}

const ACTIVITIES: ActivityItem[] = [
  { id: '1', user: 'hoang_minh***', item: 'Minecraft Java & Bedrock Full Access', gateway: 'VietQR', timeAgo: '12 giây trước' },
  { id: '2', user: 'cyber_alex***', item: 'Steam CS2 Prime VIP Clean 100%', gateway: 'Litecoin', timeAgo: '35 giây trước' },
  { id: '3', user: 'quang_huy***', item: 'Claude 3.5 Sonnet Pro 1 Tháng', gateway: 'VietQR', timeAgo: '1 phút trước' },
  { id: '4', user: 'duy_anh***', item: 'Minecraft Hypixel MVP+ Level 120', gateway: 'VietQR', timeAgo: '2 phút trước' },
  { id: '5', user: 'crypto_whale***', item: 'Valorant Diamond Account Unrated', gateway: 'Litecoin', timeAgo: '3 phút trước' },
  { id: '6', user: 'linh_tran***', item: 'ChatGPT Plus Team GPT-4o 30 Ngày', gateway: 'VietQR', timeAgo: '4 phút trước' },
  { id: '7', user: 'nam_nguyen***', item: 'Netflix 4K UHD Profile Riêng 1 Năm', gateway: 'VietQR', timeAgo: '6 phút trước' },
  { id: '8', user: 'viet_anh***', item: 'OptiFine Custom Cape Official', gateway: 'VietQR', timeAgo: '8 phút trước' },
];

export default function LiveActivityTicker() {
  return (
    <div className="w-full bg-[#EFECE5]/80 dark:bg-[#151518]/90 border-y border-[#E5E1D8] dark:border-[#27272A] backdrop-blur-md overflow-hidden py-2.5 relative z-20">
      {/* Edge gradient masks for smooth fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#F6F4EE] dark:from-[#111113] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#F6F4EE] dark:from-[#111113] to-transparent z-10 pointer-events-none" />

      {/* Marquee Track (Duplicated for seamless loop) */}
      <div className="flex w-max items-center animate-marquee hover:[animation-play-state:paused]">
        {[...ACTIVITIES, ...ACTIVITIES].map((act, index) => (
          <div
            key={`${act.id}-${index}`}
            className="flex items-center gap-2.5 mx-6 text-xs text-slate-700 dark:text-slate-300 font-mono shrink-0 select-none group"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[#5865F2] font-semibold">{act.user}</span>
            <span className="text-slate-400 dark:text-slate-500">vừa mua</span>
            <span className="text-slate-900 dark:text-white font-medium bg-white dark:bg-white/[0.04] px-2 py-0.5 rounded border border-[#E5E1D8] dark:border-white/10 group-hover:border-[#5865F2]/40 transition-colors shadow-xs">
              {act.item}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#5865F2]/10 text-[#5865F2] border border-[#5865F2]/20 font-bold">
              {act.gateway}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">{act.timeAgo}</span>
            <span className="text-slate-300 dark:text-slate-700 mx-2">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
