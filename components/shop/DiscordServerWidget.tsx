'use client';

import React, { useState, useEffect, useRef } from 'react';
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

function DiscordCommunityGlobeBadge({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 1.5l1.8 1.8 2.5-.5 1 2.3 2.5.9.1 2.5 2.1 1.4-.9 2.4 1.4 2.1-1.8 1.8.5 2.5-2.3 1-.9 2.5-2.5.1-1.4 2.1-2.4-.9-2.1 1.4-1.8-1.8-2.5.5-1-2.3-2.5-.9-.1-2.5-2.1-1.4.9-2.4-1.4-2.1 1.8-1.8-.5-2.5 2.3-1 .9-2.5 2.5-.1 1.4-2.1 2.4.9 2.1-1.4z"
        fill="#EB459E"
      />
      <circle cx="12" cy="12" r="5.2" fill="white" />
      <circle cx="12" cy="12" r="5.2" stroke="#EB459E" strokeWidth="1" fill="none" />
      <ellipse cx="12" cy="12" rx="2.5" ry="5.2" stroke="#EB459E" strokeWidth="1" fill="none" />
      <line x1="6.8" y1="12" x2="17.2" y2="12" stroke="#EB459E" strokeWidth="1" />
      <line x1="7.6" y1="9.2" x2="16.4" y2="9.2" stroke="#EB459E" strokeWidth="0.8" />
      <line x1="7.6" y1="14.8" x2="16.4" y2="14.8" stroke="#EB459E" strokeWidth="0.8" />
    </svg>
  );
}

export default function DiscordServerWidget() {
  const locale = useLocale();
  const [stats, setStats] = useState<DiscordStats>(DEFAULT_STATS);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleMouseEnter = () => {
    if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    setIsTooltipOpen(true);
  };
  const handleMouseLeave = () => {
    tooltipTimeoutRef.current = setTimeout(() => setIsTooltipOpen(false), 150);
  };

  const formatNumber = (num: number) =>
    locale === 'vi' ? num.toLocaleString('vi-VN') : num.toLocaleString('en-US');

  const isVi = locale === 'vi';

  return (
    <div className="relative w-full">
      <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-3xl pointer-events-none" />

      <div className="relative rounded-3xl bg-[#111214] border border-[#27272A] shadow-2xl shadow-black/60 overflow-visible p-4 sm:p-5">
        {/* BANNER (Nhấn để tham gia máy chủ Discord) */}
        <a
          href={stats.instant_invite}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block w-full rounded-2xl overflow-hidden bg-zinc-950 transition-all duration-300"
          style={{ aspectRatio: '16/7' }}
          title={isVi ? 'Tham gia máy chủ Discord' : 'Join Discord Server'}
        >
          <Image
            src={stats.banner || '/discord-banner.gif'}
            alt={stats.name}
            fill
            unoptimized
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Badges trên Banner */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-bold text-white shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {formatNumber(stats.approximate_presence_count)} {isVi ? 'trực tuyến' : 'online'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono font-bold text-zinc-300 shadow-lg">
              <span>{stats.premium_subscription_count} boosts</span>
            </div>
          </div>
        </a>

        {/* SERVER INFO */}
        <div className="pt-4 space-y-3">
          <div className="space-y-1.5">
            <p className="text-[11px] text-[#949BA4] font-mono tracking-wide">
              {stats.foundedDate}
            </p>
            <div className="flex items-start gap-3">
              <a
                href={stats.instant_invite}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-11 h-11 rounded-xl overflow-hidden border-2 border-[#27272A] hover:border-emerald-500 shrink-0 bg-zinc-900 transition-colors"
              >
                <Image
                  src={stats.icon || '/logo.png'}
                  alt={stats.name}
                  fill
                  className="object-cover"
                  sizes="44px"
                />
              </a>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <a
                    href={stats.instant_invite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-bold text-white leading-tight font-sans truncate hover:text-emerald-400 transition-colors"
                  >
                    {stats.name}
                  </a>
                  {/* Quả địa cầu (Community Globe Badge) */}
                  <div
                    className="relative inline-flex items-center cursor-pointer shrink-0"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => setIsTooltipOpen((p) => !p)}
                  >
                    <DiscordCommunityGlobeBadge className="w-4 h-4 hover:scale-110 active:scale-95 transition-transform" />
                    <div
                      className={`absolute top-full left-0 mt-2.5 w-64 sm:w-72 p-3 rounded-xl bg-[#111214] border border-[#2B2D31] shadow-2xl shadow-black/90 z-50 transition-all duration-200 pointer-events-auto ${
                        isTooltipOpen
                          ? 'opacity-100 scale-100 visible translate-y-0'
                          : 'opacity-0 scale-95 invisible -translate-y-1'
                      }`}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      role="tooltip"
                    >
                      <div className="absolute -top-1.5 left-3 w-3 h-3 bg-[#111214] border-l border-t border-[#2B2D31] rotate-45" />
                      <h4 className="text-xs font-bold text-white text-center mb-0.5">
                        {isVi ? 'Máy Chủ Cộng Đồng' : 'Community Server'}
                      </h4>
                      <p className="text-[11px] text-zinc-400 text-center mb-2.5 leading-relaxed">
                        {isVi ? 'Ai cũng có thể tham gia máy chủ này.' : 'Anyone can join this server.'}
                      </p>
                      <div className="grid grid-cols-2 rounded-lg overflow-hidden text-[11px] font-bold">
                        <div className="bg-[#8A43AD] py-1.5 px-2 flex items-center justify-center gap-1 text-white">
                          <span>💎</span>
                          <span>{isVi ? `Cấp ${stats.premium_tier}` : `Level ${stats.premium_tier}`}</span>
                        </div>
                        <div className="bg-[#E05697] py-1.5 px-2 flex items-center justify-center text-white">
                          {isVi ? `${stats.premium_subscription_count} Nâng Cấp` : `${stats.premium_subscription_count} Boosts`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-[#949BA4] mt-0.5 leading-tight">{stats.description}</p>
              </div>
            </div>
          </div>

          {/* Dòng Thống Kê (Realtime Stats) */}
          <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <strong className="text-white">{formatNumber(stats.approximate_presence_count)}</strong>
              <span>{isVi ? 'trực tuyến' : 'online'}</span>
            </div>
            <span className="text-zinc-700">·</span>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <strong className="text-white">{formatNumber(stats.approximate_member_count)}</strong>
              <span>{isVi ? 'thành viên' : 'members'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
