'use client';

import React from 'react';
import Link from 'next/link';
import { Gamepad2, Sparkles, Film, ArrowRight, Flame } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  count: string;
  tag: string;
  icon: React.ReactNode;
  gradient: string;
  borderGlow: string;
  description: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: '1',
    name: 'Minecraft Alts & Ranks',
    slug: 'minecraft',
    count: '3 Sản Phẩm',
    tag: 'BÁN CHẠY #1',
    icon: <Gamepad2 className="w-6 h-6 text-indigo-400" />,
    gradient: 'from-indigo-500/15 via-purple-500/5 to-transparent',
    borderGlow: 'hover:border-indigo-400/40 hover:shadow-[0_0_25px_rgba(99,102,241,0.2)]',
    description: 'Tài khoản Java & Bedrock FA, rank Hypixel MVP+, OptiFine Cape chính chủ.',
  },
  {
    id: '2',
    name: 'Steam & CS2 Prime',
    slug: 'steam-gaming',
    count: '2 Sản Phẩm',
    tag: 'CLEAN 100%',
    icon: <Flame className="w-6 h-6 text-cyan-400" />,
    gradient: 'from-cyan-500/15 via-blue-500/5 to-transparent',
    borderGlow: 'hover:border-cyan-400/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]',
    description: 'Acc CS2 Prime Medal, Valorant skin hiếm, bảo hành khôi phục trọn đời.',
  },
  {
    id: '3',
    name: 'AI & Chatbot VIP',
    slug: 'ai-software',
    count: '2 Sản Phẩm',
    tag: 'CÔNG NGHỆ HOT',
    icon: <Sparkles className="w-6 h-6 text-purple-400" />,
    gradient: 'from-purple-500/15 via-indigo-500/5 to-transparent',
    borderGlow: 'hover:border-purple-400/40 hover:shadow-[0_0_25px_rgba(139,92,246,0.2)]',
    description: 'ChatGPT Plus GPT-4o không giới hạn, Claude 3.5 Sonnet Pro hỗ trợ lập trình viên.',
  },
  {
    id: '4',
    name: 'Streaming 4K UHD',
    slug: 'entertainment',
    count: '2 Sản Phẩm',
    tag: 'ỔN ĐỊNH',
    icon: <Film className="w-6 h-6 text-pink-400" />,
    gradient: 'from-pink-500/15 via-rose-500/5 to-transparent',
    borderGlow: 'hover:border-pink-400/40 hover:shadow-[0_0_25px_rgba(236,72,153,0.2)]',
    description: 'Netflix Premium 4K Profile riêng, Spotify Family 1 năm không lỗi gia đình.',
  },
];

export default function FeaturedCategories() {
  return (
    <section className="py-16 sm:py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-indigo-300 text-xs font-medium backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>NGÀNH HÀNG TIÊU BIỂU</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-sans text-white tracking-tight">
              Khám Phá Các Danh Mục Hot
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg font-sans">
              Lựa chọn sản phẩm theo từng ngành hàng chuyên biệt chuẩn Plati.market.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-indigo-400 hover:text-indigo-300 font-sans group"
          >
            <span>Vào Cửa Hàng Đầy Đủ</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className={`relative rounded-3xl p-6 glass-card border border-white/[0.06] transition-all duration-300 group overflow-hidden flex flex-col justify-between space-y-6 ${cat.borderGlow}`}
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${cat.gradient} opacity-30 group-hover:opacity-60 transition-opacity`}
              />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-inner">
                    {cat.icon}
                  </div>
                  <span className="text-[10px] font-mono font-medium tracking-wider px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-indigo-300">
                    {cat.tag}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors font-sans">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="relative z-10 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-sans text-slate-400">
                <span>{cat.count}</span>
                <span className="text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                  Xem ngay <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
