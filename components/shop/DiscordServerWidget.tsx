'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';

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
  name: 'Chin Sì Cem | Scammers',
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

// Flower Partner / Community Guild Badge SVG from Discord (Quả địa cầu)
function DiscordCommunityGlobeBadge({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      {/* 16-point scalloped pink rosette flower */}
      <path
        d="M12 1.5l1.8 1.8 2.5-.5 1 2.3 2.5.9.1 2.5 2.1 1.4-.9 2.4 1.4 2.1-1.8 1.8.5 2.5-2.3 1-.9 2.5-2.5.1-1.4 2.1-2.4-.9-2.1 1.4-1.8-1.8-2.5.5-1-2.3-2.5-.9-.1-2.5-2.1-1.4.9-2.4-1.4-2.1 1.8-1.8-.5-2.5 2.3-1 .9-2.5 2.5-.1 1.4-2.1 2.4.9 2.1-1.4z"
        fill="#EB459E"
      />
      {/* White Globe Inside with latitude & longitude lines */}
      <circle cx="12" cy="12" r="5.2" fill="white" />
      <circle cx="12" cy="12" r="5.2" stroke="#EB459E" strokeWidth="1" fill="none" />
      <ellipse cx="12" cy="12" rx="2.5" ry="5.2" stroke="#EB459E" strokeWidth="1" fill="none" />
      <line x1="6.8" y1="12" x2="17.2" y2="12" stroke="#EB459E" strokeWidth="1" />
      <line x1="7.6" y1="9.2" x2="16.4" y2="9.2" stroke="#EB459E" strokeWidth="0.8" />
      <line x1="7.6" y1="14.8" x2="16.4" y2="14.8" stroke="#EB459E" strokeWidth="0.8" />
    </svg>
  );
}

// 6 Game Activity Icons matching Ảnh 2 100%
const GAME_ACTIVITIES = [
  {
    id: 'geometry-dash',
    name: 'Geometry Dash',
    icon: '/games/geometry-dash.png',
  },
  {
    id: 'minecraft',
    name: 'Minecraft',
    icon: '/games/minecraft.png',
  },
  {
    id: 'goose-duck',
    name: 'Goose Goose Duck',
    icon: '/games/goose-goose-duck.jpg',
  },
  {
    id: 'roblox',
    name: 'Roblox',
    icon: '/games/roblox.png',
  },
  {
    id: 'south-park',
    name: 'South Park',
    icon: '/games/south-park.jpg',
  },
  {
    id: 'plus-one',
    name: '+1 Game khác',
    icon: '/games/plus-one.jpg',
  },
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
          if (isMounted && data) {
            setStats(data);
          }
        }
      } catch (err) {
        // Fallback already in state
      }
    };

    fetchStats();
    // Realtime polling every 20 seconds
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
    tooltipTimeoutRef.current = setTimeout(() => {
      setIsTooltipOpen(false);
    }, 150);
  };

  // Format with dot separator (e.g. 1.197 in VI, 1,197 in EN)
  const formatNumber = (num: number) => {
    if (locale === 'vi') {
      return num.toLocaleString('vi-VN');
    }
    return num.toLocaleString('en-US');
  };

  return (
    <div className="relative w-full max-w-[390px] sm:max-w-[420px] mx-auto rounded-3xl bg-[#1E1F22] border border-[#2B2D31]/80 shadow-2xl transition-all duration-300">
      
      {/* 1. Header Animated Server Banner matching Ảnh 2 */}
      <div className="relative w-full h-28 sm:h-32 bg-zinc-950 rounded-t-3xl overflow-hidden">
        <Image
          src={stats.banner || '/discord-banner.gif'}
          alt={stats.name}
          fill
          unoptimized
          className="object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
          priority
        />
        {/* Soft bottom dark gradient fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1F22] via-transparent to-black/20" />
      </div>

      {/* 2. Avatar & Content Body matching Ảnh 2 */}
      <div className="relative px-5 sm:px-6 pb-6 pt-0 space-y-4">
        
        {/* Overlapping Avatar */}
        <div className="-mt-12 sm:-mt-14 flex items-end justify-between relative z-20">
          <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden border-4 border-[#1E1F22] bg-zinc-900 shadow-xl shrink-0">
            <Image
              src={stats.icon || '/logo.png'}
              alt={stats.name}
              fill
              className="object-cover"
              sizes="88px"
              priority
            />
          </div>
        </div>

        {/* Server Name & Pink Community Globe Badge with Non-Clipped Tooltip Popover (Ảnh 4) */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center gap-2 relative">
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight font-sans">
              {stats.name}
            </h3>

            {/* Quả địa cầu (Community Flower Badge) */}
            <div
              className="relative inline-flex items-center cursor-pointer"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => setIsTooltipOpen((prev) => !prev)}
            >
              <DiscordCommunityGlobeBadge className="w-5 h-5 shrink-0 hover:scale-110 active:scale-95 transition-transform" />

              {/* Tooltip Popover matching Ảnh 4 - Clearly visible & never clipped */}
              <div
                className={`absolute top-full left-0 sm:-left-8 mt-2.5 w-72 sm:w-80 p-3.5 sm:p-4 rounded-2xl bg-[#111214] border border-[#2B2D31] shadow-2xl shadow-black/95 z-50 transition-all duration-200 pointer-events-auto ${
                  isTooltipOpen
                    ? 'opacity-100 scale-100 visible translate-y-0'
                    : 'opacity-0 scale-95 invisible -translate-y-1'
                }`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                role="tooltip"
              >
                {/* Tooltip Arrow Caret pointing UP to the badge */}
                <div className="absolute -top-1.5 left-2 sm:left-9 w-3 h-3 bg-[#111214] border-l border-t border-[#2B2D31] rotate-45" />

                {/* Header */}
                <h4 className="text-sm font-bold text-white text-center font-sans tracking-wide">
                  {locale === 'vi' ? 'Máy Chủ Cộng Đồng' : 'Community Server'}
                </h4>

                {/* Subtitle */}
                <p className="text-xs text-zinc-300 text-center font-sans mt-0.5 mb-3 leading-relaxed">
                  {locale === 'vi' ? 'Ai cũng có thể tham gia máy chủ này.' : 'Anyone can join this server.'}
                </p>

                {/* Dual-pill boost tags matching Ảnh 4 */}
                <div className="grid grid-cols-2 rounded-xl overflow-hidden font-bold text-xs shadow-md">
                  {/* Left: Cấp 3 */}
                  <div className="bg-[#8A43AD] py-2 px-3 flex items-center justify-center gap-1.5 text-white whitespace-nowrap">
                    <span className="text-xs">💎</span>
                    <span>
                      {locale === 'vi'
                        ? `Cấp ${stats.premium_tier || 3}`
                        : `Level ${stats.premium_tier || 3}`}
                    </span>
                  </div>

                  {/* Right: 34 Nâng Cấp */}
                  <div className="bg-[#E05697] py-2 px-3 flex items-center justify-center text-white text-center whitespace-nowrap">
                    <span>
                      {locale === 'vi'
                        ? `${stats.premium_subscription_count || 34} Nâng Cấp`
                        : `${stats.premium_subscription_count || 34} Boosts`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Member Count & Online Count Line matching Ảnh 2 */}
          <div className="flex items-center gap-4 text-xs font-medium text-zinc-300 font-mono pt-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#23A55A] shrink-0" />
              <span>
                <strong className="text-white font-bold">{formatNumber(stats.approximate_presence_count)}</strong> {locale === 'vi' ? 'Trực tuyến' : 'Online'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#80848E] shrink-0" />
              <span>
                <strong className="text-white font-bold">{formatNumber(stats.approximate_member_count)}</strong> {locale === 'vi' ? 'thành viên' : 'members'}
              </span>
            </div>
          </div>
        </div>

        {/* Description & Founded Info matching Ảnh 2 */}
        <div className="space-y-1 text-xs text-zinc-400 font-sans border-t border-zinc-800/80 pt-3">
          <p className="text-[#949BA4]">
            {stats.foundedDate || 'Thành lập từ thg 11 2025'}
          </p>
          <p className="text-[#DBDEE1] font-semibold">
            {stats.description || 'Trùm Scammers VN'}
          </p>
        </div>

        {/* Game Activity Badges Row matching Ảnh 2 - with Hover Tooltips showing game name below */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2 pt-1 relative">
          {GAME_ACTIVITIES.map((game) => (
            <div key={game.id} className="relative group/game flex flex-col items-center">
              {/* App Icon */}
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden bg-[#1E1F22] border border-[#2B2D31] hover:border-zinc-400 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer shadow-md shadow-black/40">
                <Image
                  src={game.icon}
                  alt={game.name}
                  fill
                  className="object-cover"
                  sizes="44px"
                />
              </div>

              {/* Hover Tooltip displaying game name below the icon */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 bg-[#111214] border border-[#2B2D31] text-white text-[11px] font-bold rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover/game:opacity-100 group-hover/game:visible invisible transition-all duration-150 pointer-events-none z-30 transform group-hover/game:translate-y-0 translate-y-1">
                {/* Arrow pointing UP */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#111214] border-l border-t border-[#2B2D31] rotate-45" />
                {game.name}
              </div>
            </div>
          ))}
        </div>

        {/* Join Server Button matching Ảnh 2 (cleanly centered, green, no arrow) */}
        <div className="pt-2">
          <a
            href={stats.instant_invite}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-[#23A55A] hover:bg-[#1F924F] active:bg-[#1A7C43] text-white font-bold text-sm text-center flex items-center justify-center shadow-lg hover:shadow-emerald-950/40 transition-all duration-200 active:scale-[0.98]"
          >
            {locale === 'vi' ? 'Đi tới Máy chủ' : 'Join Server'}
          </a>
        </div>

      </div>
    </div>
  );
}


