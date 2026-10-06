'use client';

import React from 'react';
import { Star, ShieldCheck, CheckCircle2, MessageSquare, ExternalLink, Users } from 'lucide-react';

import { useTranslations } from 'next-intl';

interface Review {
  id: string;
  author: string;
  avatarColor: string;
  role: string;
  product: string;
  rating: number;
  content: string;
  timeAgo: string;
  verified: boolean;
}

const REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Minh Hoàng',
    avatarColor: 'from-zinc-700 to-zinc-900',
    role: 'Gamer Bedwars',
    product: 'Minecraft Java & Bedrock FA',
    rating: 5,
    content: 'Quét mã VietQR SePay xong chưa kịp chớp mắt là hệ thống tự động nhảy thông tin tài khoản luôn. Đổi mail với pass ngon lành, Hypixel unbanned 100%!',
    timeAgo: '14m ago',
    verified: true,
  },
  {
    id: '2',
    author: 'Alex Carter',
    avatarColor: 'from-zinc-600 to-zinc-800',
    role: 'CS2 Trader',
    product: 'Steam CS2 Prime VIP',
    rating: 5,
    content: 'Clean account with nice medal, instant Steam Guard support. 4th time purchasing here, totally satisfied with 1-to-1 warranty.',
    timeAgo: '35m ago',
    verified: true,
  },
  {
    id: '3',
    author: 'David Thanh',
    avatarColor: 'from-zinc-700 to-zinc-800',
    role: 'Fullstack Dev',
    product: 'Claude 3.5 Sonnet Pro',
    rating: 5,
    content: 'Works seamlessly via API. Paid via LTC, instant 0-conf confirmation was lightning fast and network fee was almost zero.',
    timeAgo: '1h ago',
    verified: true,
  },
  {
    id: '4',
    author: 'Duy Anh',
    avatarColor: 'from-zinc-600 to-zinc-900',
    role: 'Hypixel MVP+',
    product: 'Hypixel MVP+ Account',
    rating: 5,
    content: 'Rank MVP+ permanent exactly as advertised, high level bedwars. Top 1 trusted store!',
    timeAgo: '3h ago',
    verified: true,
  },
  {
    id: '5',
    author: 'Sarah Linh',
    avatarColor: 'from-zinc-700 to-zinc-900',
    role: 'Designer',
    product: 'ChatGPT Plus GPT-4o',
    rating: 5,
    content: 'Private profile, super stable work sessions without kicking. Affordable price and 5-star quality.',
    timeAgo: '5h ago',
    verified: true,
  },
  {
    id: '6',
    author: 'Tuấn Khang',
    avatarColor: 'from-zinc-600 to-zinc-800',
    role: 'Tech Lead',
    product: 'Netflix 4K UHD Profile',
    rating: 5,
    content: 'Smooth 4K playback, own profile with PIN. Will definitely support long term.',
    timeAgo: '8h ago',
    verified: true,
  },
];

export default function VouchWall() {
  const t = useTranslations('vouch');

  return (
    <section id="reviews" className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-200/80 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700/80 text-zinc-800 dark:text-zinc-200 text-xs font-semibold backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span>{t('badge')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-white tracking-tight">
            {t('title')}<span className="text-zinc-600 dark:text-zinc-400 font-extrabold">{t('titleHighlight')}</span>
          </h2>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="relative rounded-2xl p-6 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* User Info Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${review.avatarColor} flex items-center justify-center text-white font-bold text-sm shadow-md`}
                    >
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{review.author}</span>
                        {review.verified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/20" />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500">{review.role}</span>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Content */}
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  &ldquo;{review.content}&rdquo;
                </p>
              </div>

              {/* Bottom Metadata */}
              <div className="pt-3 border-t border-zinc-100 dark:border-[#27272A] flex items-center justify-between text-[11px]">
                <span className="text-zinc-600 dark:text-zinc-400 font-mono font-medium truncate max-w-[180px]">
                  {review.product}
                </span>
                <span className="text-zinc-400 dark:text-zinc-500 font-mono shrink-0">{review.timeAgo}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Discord Community Callout */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-[#27272A] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-[#18181C] border border-zinc-200 dark:border-[#27272A] flex items-center justify-center text-zinc-800 dark:text-zinc-200 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-zinc-950 dark:text-[#F4F4F5]">
                Gia Nhập Cộng Đồng ChinStore Discord
              </h4>
              <p className="text-xs text-zinc-600 dark:text-[#94949E] mt-0.5">
                Hơn 5,200+ thành viên đang hoạt động, cập nhật giveaway tài khoản và voucher mỗi tuần.
              </p>
            </div>
          </div>

          <a
            href="https://discord.gg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs sm:text-sm font-bold transition-all shadow-sm shrink-0 active:scale-95"
          >
            <span>Tham Gia Discord Ngay</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}
