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

// 1. Geometry Dash / Yellow Hazard Icon
function HazardIcon() {
  return (
    <div
      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#F4CA16] border border-[#DEB20A] flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-transform cursor-pointer"
      title="Geometry Dash / Hazard"
    >
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-black fill-current">
        <path d="M12 2L1 21h22L12 2zm0 4.5l8.5 14.5H3.5L12 6.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z" />
      </svg>
    </div>
  );
}

// 2. Minecraft Grass Block Icon
function MinecraftBlockIcon() {
  return (
    <div
      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#5C8E32] border border-[#487226] overflow-hidden flex flex-col shadow-xs hover:scale-105 active:scale-95 transition-transform cursor-pointer relative"
      title="Minecraft"
    >
      {/* Top Grass Green with overhang pixels */}
      <div className="h-[40%] bg-[#5C8E32] relative w-full">
        <div className="absolute -bottom-1 left-1 w-1.5 h-1.5 bg-[#5C8E32]" />
        <div className="absolute -bottom-1 left-4 w-1.5 h-1 bg-[#5C8E32]" />
        <div className="absolute -bottom-1 right-2 w-1.5 h-1.5 bg-[#5C8E32]" />
      </div>
      {/* Bottom Dirt Brown with pixel dots */}
      <div className="h-[60%] bg-[#866043] relative w-full">
        <div className="absolute top-1 left-2 w-1 h-1 bg-[#573D26]" />
        <div className="absolute top-2 right-2 w-1 h-1 bg-[#A07452]" />
        <div className="absolute bottom-1 left-4 w-1 h-1 bg-[#573D26]" />
      </div>
    </div>
  );
}

// 3. Goose Goose Duck Icon
function DuckIcon() {
  return (
    <div
      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#2B2D31] border border-[#35373C] flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-transform cursor-pointer"
      title="Goose Goose Duck"
    >
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none">
        <path
          d="M7 17C7 14 9 12 11 12H13V7C13 5.34 14.34 4 16 4C17.66 4 19 5.34 19 7C19 8.2 18.27 9.22 17.22 9.68L17 14C17 16.5 15 18.5 12.5 18.5H8.5C7.67 18.5 7 17.83 7 17Z"
          fill="#FFFFFF"
        />
        <path d="M19 6L23 7L19 8V6Z" fill="#F59E0B" />
        <circle cx="16.5" cy="6" r="0.75" fill="#18181B" />
      </svg>
    </div>
  );
}

// 4. Roblox Icon
function RobloxIcon() {
  return (
    <div
      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1E1F22] border border-[#2B2D31] flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-transform cursor-pointer"
      title="Roblox"
    >
      <div className="w-4 h-4 bg-white -rotate-12 flex items-center justify-center rounded-[2px] shadow-xs">
        <div className="w-1.5 h-1.5 bg-[#1E1F22] rounded-[1px]" />
      </div>
    </div>
  );
}

// 5. Community Group Icon
function CommunityIcon() {
  return (
    <div
      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#2B2D31] border border-[#35373C] flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-transform cursor-pointer"
      title="Community Group"
    >
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#949BA4] fill-current">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    </div>
  );
}

// 6. +1 Badge Icon
function PlusOneBadge() {
  return (
    <div
      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1E1F22] border border-[#2B2D31] flex items-center justify-center text-xs font-mono font-bold text-[#949BA4] hover:text-white transition-colors cursor-pointer"
      title="+1 More Activity"
    >
      +1
    </div>
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
        const res = await fetch('/api/discord-server', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data) {
            setStats(data);
          }
        }
      } catch (err) {
        // Fallback already in state, zero failure
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
    <div className="relative rounded-3xl bg-[#121215] border border-zinc-200 dark:border-[#27272A] shadow-2xl overflow-hidden transition-all duration-300">
      
      {/* 1. Header Animated Banner matching Ảnh 2 */}
      <div className="relative w-full h-32 sm:h-36 bg-zinc-950 overflow-hidden">
        <Image
          src={stats.banner || '/discord-banner.gif'}
          alt={stats.name}
          fill
          unoptimized
          className="object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
          priority
        />
        {/* Soft dark gradient fade into card body */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-transparent to-black/20" />
      </div>

      {/* 2. Avatar & Content Body matching Ảnh 2 */}
      <div className="relative px-6 pb-6 pt-0 space-y-4">
        
        {/* Overlapping Avatar (Realtime pill deleted as requested!) */}
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
        </div>

        {/* Server Name & Pink Community Globe Badge with Tooltip Popover (Ảnh 4) */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center gap-2 relative">
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight font-sans">
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

              {/* Tooltip Popover matching Ảnh 4 */}
              <div
                className={`absolute top-full left-1/2 sm:left-0 -translate-x-1/2 sm:translate-x-0 mt-2.5 w-72 sm:w-80 p-3.5 sm:p-4 rounded-2xl bg-[#111214] border border-[#2B2D31] shadow-2xl shadow-black/90 z-50 transition-all duration-200 pointer-events-auto ${
                  isTooltipOpen
                    ? 'opacity-100 scale-100 visible translate-y-0'
                    : 'opacity-0 scale-95 invisible -translate-y-1'
                }`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                role="tooltip"
              >
                {/* Tooltip Arrow Caret pointing UP to the badge */}
                <div className="absolute -top-1.5 left-1/2 sm:left-2.5 -translate-x-1/2 sm:translate-x-0 w-3 h-3 bg-[#111214] border-l border-t border-[#2B2D31] rotate-45" />

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
                  <div className="bg-[#8A43AD] py-2 px-3 flex items-center justify-center gap-1.5 text-white">
                    <span className="text-xs">💎</span>
                    <span>
                      {locale === 'vi'
                        ? `Cấp ${stats.premium_tier || 3}`
                        : `Level ${stats.premium_tier || 3}`}
                    </span>
                  </div>

                  {/* Right: 34 Nâng Cấp */}
                  <div className="bg-[#E05697] py-2 px-3 flex items-center justify-center text-white text-center">
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

        {/* Description & Founded Info matching Ảnh 2 */}
        <div className="space-y-1 text-xs text-zinc-400 font-sans border-t border-zinc-800/80 pt-3">
          <p className="text-zinc-400">
            {stats.foundedDate || 'Thành lập từ thg 11 2025'}
          </p>
          <p className="text-zinc-200 font-semibold">
            {stats.description || 'Trùm Scammers VN'}
          </p>
        </div>

        {/* Game Activity Badges Row matching Ảnh 2 */}
        <div className="flex items-center gap-2 pt-1">
          <HazardIcon />
          <MinecraftBlockIcon />
          <DuckIcon />
          <RobloxIcon />
          <CommunityIcon />
          <PlusOneBadge />
        </div>

        {/* Join Server Button matching Ảnh 2 */}
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

