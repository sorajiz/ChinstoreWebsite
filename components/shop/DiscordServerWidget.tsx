'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Users } from 'lucide-react';

interface DiscordStats {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  banner: string | null;
  approximate_member_count: number;
  approximate_presence_count: number;
  instant_invite: string;
  foundedDate: string;
  premium_tier: number;
  premium_subscription_count: number;
}

const DEFAULT_STATS: DiscordStats = {
  id: '1434004045940391948',
  name: 'Chin Si Cem | Scammers',
  description: 'Trùm Scammers VN',
  icon: '/logo.png',
  banner: '/discord-banner.gif',
  approximate_member_count: 1197,
  approximate_presence_count: 251,
  instant_invite: 'https://discord.gg/mSG6dR4JMv',
  foundedDate: 'Thành lập từ thg 11 2025',
  premium_tier: 3,
  premium_subscription_count: 34,
};

export default function DiscordServerWidget() {
  const locale = useLocale();
  const [stats, setStats] = useState<DiscordStats>(DEFAULT_STATS);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/discord-server?t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data) setStats(data);
        }
      } catch {}
    };
    fetchStats();
    const interval = setInterval(fetchStats, 20000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const formatNumber = (num: number) =>
    locale === 'vi' ? num.toLocaleString('vi-VN') : num.toLocaleString('en-US');

  const isVi = locale === 'vi';

  return (
    <div className="relative w-full">
      {/* CARD HIỂN THỊ THUẦN TÚY - ĐỒNG BỘ THEO THEME SÁNG / TỐI */}
      <div className="relative rounded-3xl bg-white dark:bg-[#111214] border border-zinc-200/90 dark:border-[#27272A] shadow-xl dark:shadow-2xl shadow-zinc-200/60 dark:shadow-black/60 overflow-hidden p-4 sm:p-5 select-none cursor-default transition-colors duration-200">
        {/* BANNER (Đã xóa 2 badge, không thể click) */}
        <div
          className="relative block w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-950 border border-zinc-200/50 dark:border-white/5"
          style={{ aspectRatio: '16/7' }}
          data-sora-opt="media"
        >
          <Image
            src={stats.banner || '/discord-banner.gif'}
            alt={stats.name}
            fill
            unoptimized
            className="object-cover object-center pointer-events-none"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 dark:from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* SERVER INFO */}
        <div className="pt-4 space-y-3">
          <div className="space-y-1.5">
            <p className="text-[11px] text-zinc-500 dark:text-[#949BA4] font-mono tracking-wide">
              {stats.foundedDate}
            </p>
            <div className="flex items-start gap-3">
              <div className="relative w-11 h-11 rounded-xl overflow-hidden border-2 border-zinc-200 dark:border-[#27272A] shrink-0 bg-zinc-100 dark:bg-zinc-900 pointer-events-none">
                <Image
                  src={stats.icon || '/logo.png'}
                  alt={stats.name}
                  fill
                  className="object-cover"
                  sizes="44px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-base font-bold text-zinc-950 dark:text-white leading-tight font-sans truncate">
                    {stats.name}
                  </h3>
                </div>
                <p className="text-xs text-zinc-600 dark:text-[#949BA4] mt-0.5 leading-tight">{stats.description}</p>
              </div>
            </div>
          </div>

          {/* Dòng Thống Kê (Realtime Stats) */}
          <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400 font-mono pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <strong className="text-zinc-950 dark:text-white">{formatNumber(stats.approximate_presence_count)}</strong>
              <span>{isVi ? 'trực tuyến' : 'online'}</span>
            </div>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
              <strong className="text-zinc-950 dark:text-white">{formatNumber(stats.approximate_member_count)}</strong>
              <span>{isVi ? 'thành viên' : 'members'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
