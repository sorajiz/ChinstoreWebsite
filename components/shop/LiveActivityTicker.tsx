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
    <div className="w-full bg-[#080c1a]/90 border-y border-white/[0.08] backdrop-blur-md overflow-hidden py-2.5 relative z-20">
      {/* Edge gradient masks for smooth fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#07080d] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#07080d] to-transparent z-10 pointer-events-none" />

      {/* Marquee Track (Duplicated for seamless loop) */}
      <div className="flex w-max items-center animate-marquee hover:[animation-play-state:paused]">
        {[...ACTIVITIES, ...ACTIVITIES].map((act, index) => (
          <div
            key={`${act.id}-${index}`}
            className="flex items-center gap-2.5 mx-6 text-xs text-slate-300 font-mono shrink-0 select-none group"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-cyan-400 font-semibold">{act.user}</span>
            <span className="text-slate-500">vừa mua</span>
            <span className="text-white font-medium bg-white/[0.04] px-2 py-0.5 rounded border border-white/10 group-hover:border-cyan-400/40 transition-colors">
              {act.item}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
              {act.gateway}
            </span>
            <span className="text-[11px] text-slate-500">{act.timeAgo}</span>
            <span className="text-slate-700 mx-2">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
