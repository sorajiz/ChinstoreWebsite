'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Users, Zap } from 'lucide-react';

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
  description: 'Trum Scammers VN',
  icon: '/logo.png',
  banner: '/discord-banner.gif',
  approximate_member_count: 1197,
  approximate_presence_count: 251,
  instant_invite: 'https://discord.gg/mSG6dR4JMv',
  foundedDate: 'Thanh lap tu thg 11 2025',
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

const GAME_ACTIVITIES = [
  { id: 'geometry-dash', name: 'Geometry Dash', icon: '/games/geometry-dash.png' },
  { id: 'minecraft', name: 'Minecraft', icon: '/games/minecraft.png' },
  { id: 'goose-duck', name: 'Goose Goose Duck', icon: '/games/goose-goose-duck.jpg' },
  { id: 'roblox', name: 'Roblox', icon: '/games/roblox.png' },
  { id: 'south-park', name: 'South Park', icon: '/games/south-park.jpg' },
  { id: 'plus-one', name: '+1 Game khac', icon: '/games/plus-one.jpg' },
];

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

      <div className="relative rounded-3xl bg-[#111213] border border-[#27272A] shadow-2xl shadow-black/60 overflow-visible">

        {/* HEADER */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase font-mono">
              {isVi ? 'MAY CHU CONG DONG' : 'COMMUNITY SERVER'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#8A43AD] to-[#E05697] text-white text-[11px] font-bold shadow-md">
            <span>💎</span>
            <span>{isVi ? `Cap ${stats.premium_tier}` : `Level ${stats.premium_tier}`}</span>
          </div>
        </div>

        {/* BANNER */}
        <div
          className="relative mx-4 rounded-2xl overflow-hidden bg-zinc-950"
          style={{ aspectRatio: '16/7' }}
        >
          <Image
            src={stats.banner || '/discord-banner.gif'}
            alt={stats.name}
            fill
            unoptimized
            className="object-cover object-center hover:scale-[1.03] transition-transform duration-700 ease-out"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-sm border border-white/10 text-xs font-bold text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{formatNumber(stats.approximate_presence_count)} {isVi ? 'truc tuyen' : 'online'}</span>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-sm border border-white/10 text-[10px] font-mono font-bold text-zinc-300">
              {stats.premium_subscription_count} boosts
            </div>
          </div>
        </div>

        {/* SERVER INFO */}
        <div className="px-5 pt-4 pb-2 space-y-3">
          <div className="space-y-1.5">
            <p className="text-[11px] text-[#949BA4] font-mono tracking-wide uppercase">
              {stats.foundedDate}
            </p>
            <div className="flex items-start gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border-2 border-[#27272A] shrink-0 bg-zinc-900">
                <Image
                  src={stats.icon || '/logo.png'}
                  alt={stats.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-base font-bold text-white leading-tight font-sans truncate">
                    {stats.name}
                  </h3>
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
                        {isVi ? 'May Chu Cong Dong' : 'Community Server'}
                      </h4>
                      <p className="text-[11px] text-zinc-400 text-center mb-2.5 leading-relaxed">
                        {isVi ? 'Ai cung co the tham gia may chu nay.' : 'Anyone can join this server.'}
                      </p>
                      <div className="grid grid-cols-2 rounded-lg overflow-hidden text-[11px] font-bold">
                        <div className="bg-[#8A43AD] py-1.5 px-2 flex items-center justify-center gap-1 text-white">
                          <span>💎</span>
                          <span>{isVi ? `Cap ${stats.premium_tier}` : `Level ${stats.premium_tier}`}</span>
                        </div>
                        <div className="bg-[#E05697] py-1.5 px-2 flex items-center justify-center text-white">
                          {isVi ? `${stats.premium_subscription_count} Nang Cap` : `${stats.premium_subscription_count} Boosts`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-[#949BA4] mt-0.5 leading-tight">{stats.description}</p>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <strong className="text-white">{formatNumber(stats.approximate_presence_count)}</strong>
              <span>{isVi ? 'truc tuyen' : 'online'}</span>
            </div>
            <span className="text-zinc-700">·</span>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 text-zinc-500 shrink-0" />
              <strong className="text-white">{formatNumber(stats.approximate_member_count)}</strong>
              <span>{isVi ? 'thanh vien' : 'members'}</span>
            </div>
          </div>
        </div>

        <div className="mx-5 border-t border-[#27272A]" />

        {/* GAME ACTIVITY */}
        <div className="px-5 pt-3 pb-3">
          <p className="text-[10px] text-[#5C5F66] uppercase font-mono tracking-widest mb-2">
            {isVi ? 'Hoat dong tro choi' : 'Game Activity'}
          </p>
          <div className="flex items-center gap-2">
            {GAME_ACTIVITIES.map((game) => (
              <div key={game.id} className="relative group/game flex-1">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-[#27272A] hover:border-zinc-500 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer bg-[#18181C]">
                  <Image
                    src={game.icon}
                    alt={game.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 bg-[#111214] border border-[#2B2D31] text-white text-[10px] font-bold rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover/game:opacity-100 invisible group-hover/game:visible transition-all duration-150 pointer-events-none z-30">
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-[#111214] border-r border-b border-[#2B2D31] rotate-45 -mt-1" />
                  {game.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-5 border-t border-[#27272A]" />

        {/* CTA */}
        <div className="px-5 pt-4 pb-5">
          <a
            href={stats.instant_invite}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-full py-3.5 px-5 rounded-xl bg-[#23A55A] hover:bg-[#1F924F] active:bg-[#1A7C43] text-white font-bold text-sm text-center flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/30 hover:shadow-emerald-900/40 transition-all duration-200 active:scale-[0.98] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
            <span className="relative">{isVi ? 'Tham Gia May Chu' : 'Join Server'}</span>
            <span className="relative text-base leading-none group-hover:translate-x-0.5 transition-transform">→</span>
          </a>
        </div>

        {/* TRUST FOOTER */}
        <div className="flex items-center justify-around border-t border-[#27272A] px-5 py-3">
          <div className="flex items-center gap-1.5 text-[11px] text-[#5C5F66] font-mono">
            <Zap className="w-3 h-3 text-emerald-500" />
            <span>{isVi ? 'Tham gia mien phi' : 'Free to Join'}</span>
          </div>
          <div className="w-px h-4 bg-[#2B2D31]" />
          <div className="flex items-center gap-1.5 text-[11px] text-[#5C5F66] font-mono">
            <svg viewBox="0 0 16 16" className="w-3 h-3 shrink-0" fill="none">
              <path d="M8 1.5L13.5 4v4c0 3.5-2.5 5.5-5.5 6.5C5 13.5 2.5 11.5 2.5 8V4L8 1.5z" stroke="#5C5F66" strokeWidth="1.5" />
              <path d="M5.5 8l2 2 3-3" stroke="#23A55A" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>{isVi ? 'Cong dong an toan' : 'Safe Community'}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
