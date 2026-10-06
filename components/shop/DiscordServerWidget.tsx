'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';

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
}

const DEFAULT_STATS: DiscordStats = {
  id: '1434004045940391948',
  name: 'Chin Sì Cem | Scammers',
  description: 'Trùm Scammers VN',
  icon: '/logo.png',
  banner: '/logo.png',
  approximate_member_count: 1197,
  approximate_presence_count: 251,
  instant_invite: 'https://discord.gg/mSG6dR4JMv',
  foundedDate: 'Thành lập từ thg 11 2025',
};

// Flower Partner/Verified Guild Badge SVG from Discord
function DiscordPartnerFlowerBadge({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none">
      <path
        d="M8 0L9.8 1.8L12.4 1.2L13.4 3.6L15.8 4.6L15.2 7.2L17 9L15.2 10.8L15.8 13.4L13.4 14.4L12.4 16.8L9.8 16.2L8 18L6.2 16.2L3.6 16.8L2.6 14.4L0.2 13.4L0.8 10.8L-1 9L0.8 7.2L0.2 4.6L2.6 3.6L3.6 1.2L6.2 1.8L8 0Z"
        fill="#EB459E"
        transform="scale(0.85) translate(1, 0)"
      />
      <circle cx="8" cy="8" r="4" fill="white" />
      <path
        d="M8 5L8.9 7.1L11 8L8.9 8.9L8 11L7.1 8.9L5 8L7.1 7.1L8 5Z"
        fill="#EB459E"
      />
    </svg>
  );
}

export default function DiscordServerWidget() {
  const locale = useLocale();
  const [stats, setStats] = useState<DiscordStats>(DEFAULT_STATS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/discord-server', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data) {
            setStats(data);
          }
        }
      } catch (err) {
        // Fallback already in state, zero failure
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchStats();
    // Realtime polling every 25 seconds
    const interval = setInterval(fetchStats, 25000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Format with dot separator (e.g. 1.197 in VI, 1,197 in EN)
  const formatNumber = (num: number) => {
    if (locale === 'vi') {
      return num.toLocaleString('vi-VN');
    }
    return num.toLocaleString('en-US');
  };

  return (
    <div className="relative rounded-3xl bg-[#121215] border border-zinc-200 dark:border-[#27272A] shadow-2xl overflow-hidden transition-all duration-300">
      
      {/* 1. Header Banner matching Ảnh 4 */}
      <div className="relative w-full h-28 sm:h-32 bg-zinc-950 overflow-hidden flex items-center justify-center">
        {/* Dark Textured Watermark Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#121215] z-10" />
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 select-none pointer-events-none">
          <span className="text-3xl sm:text-4xl font-black tracking-widest text-white/40 font-mono">
            CHIN STORE
          </span>
          <span className="text-xs sm:text-sm font-bold tracking-[0.3em] text-zinc-400">
            OFFICIAL GUILD
          </span>
        </div>
      </div>

      {/* 2. Avatar & Content Body matching Ảnh 4 */}
      <div className="relative px-6 pb-6 pt-0 space-y-4">
        
        {/* Overlapping Avatar */}
        <div className="-mt-12 sm:-mt-14 flex items-end justify-between relative z-20">
          <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden border-4 border-[#121215] bg-zinc-900 shadow-xl shrink-0">
            <Image
              src={stats.icon || '/logo.png'}
              alt={stats.name}
              fill
              className="object-cover"
              sizes="88px"
              priority
            />
          </div>

          {/* Realtime Live Pulse Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>REALTIME</span>
          </div>
        </div>

        {/* Server Name & Discord Partner Badge */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight font-sans">
              {stats.name}
            </h3>
            <DiscordPartnerFlowerBadge className="w-5 h-5 shrink-0" />
          </div>

          {/* Member Count & Online Count Line matching Ảnh 4 */}
          <div className="flex items-center gap-4 text-xs font-medium text-zinc-300 font-mono pt-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <span>
                <strong className="text-white font-bold">{formatNumber(stats.approximate_presence_count)}</strong> {locale === 'vi' ? 'Trực tuyến' : 'Online'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-400 shrink-0" />
              <span>
                <strong className="text-white font-bold">{formatNumber(stats.approximate_member_count)}</strong> {locale === 'vi' ? 'thành viên' : 'members'}
              </span>
            </div>
          </div>
        </div>

        {/* Description & Founded Info matching Ảnh 4 */}
        <div className="space-y-1 text-xs text-zinc-400 font-sans border-t border-zinc-800/80 pt-3">
          <p className="text-zinc-400">
            {stats.foundedDate || 'Thành lập từ thg 11 2025'}
          </p>
          <p className="text-zinc-200 font-semibold">
            {stats.description || 'Trùm Scammers VN'}
          </p>
        </div>

        {/* Game Activity Badges Row matching Ảnh 4 */}
        <div className="flex items-center gap-2 pt-1">
          {/* 1. Geometry Dash */}
          <div className="w-8 h-8 rounded-lg bg-[#FFD700] border border-amber-300/40 p-1 flex items-center justify-center shadow-xs" title="Geometry Dash">
            <svg viewBox="0 0 24 24" className="w-full h-full text-zinc-950 fill-current">
              <path d="M12 2L2 22h20L12 2zm0 5l6 12H6l6-12z" />
            </svg>
          </div>

          {/* 2. Minecraft Grass Block */}
          <div className="w-8 h-8 rounded-lg bg-[#5C8E32] border border-emerald-600/40 p-1 flex items-center justify-center shadow-xs overflow-hidden" title="Minecraft">
            <div className="w-full h-full bg-[#855B32] border-t-4 border-[#5C8E32] rounded-xs" />
          </div>

          {/* 3. Goose / Duck */}
          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 p-1 flex items-center justify-center shadow-xs" title="Duck Community">
            <span className="text-sm select-none">🦆</span>
          </div>

          {/* 4. Roblox */}
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 p-1 flex items-center justify-center shadow-xs" title="Roblox">
            <div className="w-4 h-4 bg-white rotate-12 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-zinc-900" />
            </div>
          </div>

          {/* 5. Community Group */}
          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 p-1 flex items-center justify-center shadow-xs" title="Community Group">
            <span className="text-sm select-none">👥</span>
          </div>

          {/* 6. +1 Badge */}
          <div className="w-8 h-8 rounded-lg bg-zinc-900/90 border border-zinc-800 flex items-center justify-center text-[11px] font-mono font-bold text-zinc-400">
            +1
          </div>
        </div>

        {/* 3. Green Join Server Button matching Ảnh 4 */}
        <div className="pt-2">
          <a
            href={stats.instant_invite}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-[#23A55A] hover:bg-[#1F924F] active:bg-[#1A7C43] text-white font-bold text-sm text-center flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-900/30 transition-all duration-200 active:scale-[0.98]"
          >
            <span>{locale === 'vi' ? 'Đi tới Máy chủ' : 'Join Server'}</span>
            <span className="font-bold">→</span>
          </a>
        </div>

      </div>
    </div>
  );
}
