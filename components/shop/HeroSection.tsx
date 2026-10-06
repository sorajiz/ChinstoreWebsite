'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter, Link } from '@/navigation';
import {
  Zap,
  ArrowRight,
  Sparkles,
  Flame,
  CheckCircle2,
  Lock,
  Layers,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';

interface HeroSectionProps {
  onQuickCheckout?: (product: any) => void;
}

export function HeroSection({ onQuickCheckout }: HeroSectionProps) {
  const router = useRouter();
  const { currency, addItem } = useStore();

  const sampleFeaturedDeal = {
    id: 'cmuvgek3y00064shyr5d2ec3i',
    name: 'Minecraft Java & Bedrock FA (Full Access) + Migrated',
    slug: 'minecraft-fa-migrated',
    description: 'Đổi Email, Pass, Skin tự do. Không bị ban mọi server Hypixel.',
    priceVND: 180000,
    price: 180000,
    availableCount: 2,
    images: ['https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=800&q=80'],
  };

  const handleBuyFeatured = () => {
    addItem(sampleFeaturedDeal as any, 1);
    if (onQuickCheckout) {
      onQuickCheckout(sampleFeaturedDeal);
    } else {
      router.push('/shop');
    }
  };

  return (
    <section id="hero" className="relative pt-20 pb-14 sm:pt-28 sm:pb-20 px-4 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        
        {/* CỘT TRÁI: TIÊU ĐỀ & HÀNH ĐỘNG NHANH */}
        <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5865F2]/10 border border-[#5865F2]/25 text-[#5865F2] dark:text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold">CHINSTORE</span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span>Hệ Thống Giao Dịch Tự Động 24/7</span>
            <Sparkles className="w-3.5 h-3.5 ml-1 text-[#5865F2]" />
          </div>

          {/* Headline Typography */}
          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12] font-sans">
            Kho Tài Nguyên Số & <br />
            <span className="bg-gradient-to-r from-[#5865F2] via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Tài Khoản Bản Quyền
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl font-normal leading-relaxed">
            Nền tảng cung cấp Minecraft Alts Full Access, Steam CS2 Prime, AI Chatbot Pro & Premium Accounts. Quét mã VietQR SePay hoặc Crypto nhận dữ liệu tức thì sau 3 giây.
          </p>

          {/* Action CTAs (Replaces search box per user request) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/shop"
              className="group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm text-white bg-[#5865F2] hover:bg-[#4752C4] shadow-lg shadow-[#5865F2]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <span>Xem Bảng Giá Sản Phẩm</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#featured-products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-[#18181B] hover:bg-black/5 dark:hover:bg-white/10 border border-[#E5E1D8] dark:border-[#27272A] transition-all shadow-sm"
            >
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Sản Phẩm Bán Chạy</span>
            </a>
          </div>

          {/* Metrics Bar */}
          <div className="grid grid-cols-4 gap-4 pt-6 border-t border-[#E5E1D8] dark:border-[#27272A] w-full max-w-xl">
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">99.9%</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Tự Động 24/7</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">&lt; 3s</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Nhận Key Ngay</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">15K+</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Đơn Thành Công</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">1:1</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Bảo Hành Uy Tín</div>
            </div>
          </div>

        </div>

        {/* CỘT PHẢI: FEATURED SPOTLIGHT CARD */}
        <div className="lg:col-span-5 relative">
          
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-[#5865F2]/10 blur-3xl rounded-3xl pointer-events-none" />

          <div className="relative rounded-3xl bg-white dark:bg-[#18181B] border border-[#E5E1D8] dark:border-[#27272A] shadow-2xl p-5 sm:p-6 space-y-4">
            
            {/* Header Showcase */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E1D8] dark:border-[#27272A]">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold tracking-wider uppercase text-slate-900 dark:text-white font-mono">
                  DEAL SPOTLIGHT HÔM NAY
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                GIẢM 30%
              </span>
            </div>

            {/* Featured Product Box */}
            <div className="rounded-2xl p-4 bg-[#EFECE5]/50 dark:bg-[#202024]/50 border border-[#E5E1D8] dark:border-[#27272A] space-y-4">
              <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-900 border border-[#E5E1D8] dark:border-[#27272A]">
                <Image
                  src={sampleFeaturedDeal.images[0]}
                  alt={sampleFeaturedDeal.name}
                  fill
                  className="object-cover"
                  priority
                />
                
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px]">
                  <span className="px-2 py-0.5 rounded-md bg-black/80 text-emerald-400 font-bold backdrop-blur-md">
                    Còn 2 tài khoản
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-black/80 text-slate-300 font-mono backdrop-blur-md">
                    Mã: MC-FA-01
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs font-mono text-[#5865F2] font-semibold">Minecraft Official</span>
                  <span className="text-xs text-slate-400 line-through font-mono">250.000 đ</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {sampleFeaturedDeal.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {sampleFeaturedDeal.description}
                </p>
              </div>

              {/* Price & Buy Button */}
              <div className="flex items-center justify-between pt-3 border-t border-[#E5E1D8] dark:border-[#27272A]">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium">Giá thanh toán:</div>
                  <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
                    {formatPrice(sampleFeaturedDeal.priceVND, currency)}
                  </div>
                </div>

                <button
                  onClick={handleBuyFeatured}
                  className="px-5 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Mua Ngay (3s)</span>
                </button>
              </div>
            </div>

            {/* Security & Multi-Gateway Trust Badges */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] font-mono text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-[#18181B] border border-[#E5E1D8] dark:border-[#27272A]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">VietQR Tự Động</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-[#18181B] border border-[#E5E1D8] dark:border-[#27272A]">
                <Lock className="w-3.5 h-3.5 text-[#5865F2] shrink-0" />
                <span className="truncate">Mã Hoá AES-256</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
export default HeroSection;

