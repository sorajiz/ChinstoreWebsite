'use client';

import React from 'react';
import { ArrowRight, Gamepad2, Bot, Film, Pickaxe } from 'lucide-react';

interface QuickCategoryPillsProps {
  onSelectCategory?: (categorySlug: string) => void;
  activeCategory?: string;
}

export function QuickCategoryPills({ onSelectCategory, activeCategory }: QuickCategoryPillsProps) {
  const items = [
    {
      title: 'Game & ứng dụng',
      subtitle: 'Nạp game, tài khoản và thẻ cào',
      slug: 'gaming-accounts',
      icon: Gamepad2,
    },
    {
      title: 'Góc Discord',
      subtitle: 'Trang trí avatar và hồ sơ',
      slug: 'discord-services',
      icon: Bot,
    },
    {
      title: 'Netflix & Media',
      subtitle: 'Khám phá dịch vụ Netflix & Spotify',
      slug: 'streaming-vpn',
      icon: Film,
    },
    {
      title: 'Minecraft Alts',
      subtitle: 'Full Access & Hypixel MVP+',
      slug: 'minecraft-alts',
      icon: Pickaxe,
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 my-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200 dark:divide-zinc-800/80 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-[#27272A] shadow-sm overflow-hidden">
        {items.map((item, index) => {
          const isSelected = activeCategory === item.slug;
          return (
            <button
              key={index}
              onClick={() => onSelectCategory && onSelectCategory(item.slug)}
              className={`p-4 sm:p-5 flex items-center justify-between group transition-all text-left cursor-pointer hover:bg-zinc-50 dark:hover:bg-[#18181C] ${
                isSelected ? 'bg-zinc-100 dark:bg-[#1C1C22]' : ''
              }`}
            >
              <div className="space-y-1 pr-3">
                <h4 className="text-sm font-bold text-zinc-950 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 font-normal">
                  {item.subtitle}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuickCategoryPills;
