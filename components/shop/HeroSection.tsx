'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter, Link } from '@/navigation';
import {
  Zap,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Search,
  Flame,
  CheckCircle2,
  Lock,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

interface HeroSectionProps {
  onQuickCheckout?: (product: any) => void;
}

export function HeroSection({ onQuickCheckout }: HeroSectionProps) {
  const router = useRouter();
  const { currency, addItem } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/shop');
    }
  };

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
    <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-24 px-4 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* CỘT TRÁI: TIÊU ĐỀ & TÌM KIẾM NHANH */}
        <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
          
          {/* Badge Chuẩn Cyber */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md text-xs font-semibold text-slate-300 hover:border-brand-primary/40 transition-colors">
            <span className="flex h-2 w-2 rounded-full bg-brand-emerald animate-pulse" />
            <span className="text-white">CYBER 2.0</span>
            <span className="text-slate-500">•</span>
            <span>Giao Dịch Tự Động 24/7 • Nhận Key 3 Giây</span>
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 ml-1" />
          </div>

          {/* Headline Typography Cực Mạnh */}
          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight text-white leading-[1.12]">
            Kho Tài Nguyên Số & <br />
            <span className="bg-gradient-to-r from-white via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
              Game Bản Quyền Tự Động
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl font-normal leading-relaxed">
            Nền tảng cung cấp Minecraft Alts Full Access, Steam CS2 Prime, AI Chatbot Pro & Premium Accounts. Quét mã VietQR SePay hoặc Litecoin (LTC) On-Chain nhận dữ liệu tức thì sau 3 giây.
          </p>

          {/* Quick Search Box */}
          <form onSubmit={handleSearchSubmit} className="w-full max-w-xl">
            <div className="relative flex items-center">
              <div className="absolute left-4 text-slate-400 pointer-events-none">
                <Search className="w-4 h-4 text-indigo-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm nhanh: Minecraft FA, CS2 Prime, ChatGPT 4o, Netflix..."
                className="w-full pl-11 pr-32 py-3.5 rounded-2xl bg-[#0D101E]/90 border border-white/[0.1] focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 text-white placeholder-slate-500 text-xs sm:text-sm transition-all outline-none backdrop-blur-xl shadow-lg"
              />
              <button
                type="submit"
                className="absolute right-2 px-5 py-2 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary hover:brightness-110 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-1.5"
              >
                <span>Tìm Ngay</span>
              </button>
            </div>

            {/* Quick Hot Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] text-slate-400">
              <span className="text-slate-500 font-medium">Xu hướng:</span>
              <button
                type="button"
                onClick={() => router.push('/shop?category=minecraft-alts')}
                className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.06] transition-colors"
              >
                🎮 Minecraft FA
              </button>
              <button
                type="button"
                onClick={() => router.push('/shop?category=gaming-accounts')}
                className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.06] transition-colors"
              >
                🔥 CS2 Prime
              </button>
              <button
                type="button"
                onClick={() => router.push('/shop?category=ai-software')}
                className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.06] transition-colors"
              >
                ⚡ ChatGPT Plus
              </button>
            </div>
          </form>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/shop"
              className="group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-primary via-indigo-600 to-brand-secondary shadow-[0_0_30px_rgba(99,102,241,0.35)] hover:shadow-[0_0_45px_rgba(99,102,241,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <span>Vào Cửa Hàng Ngay</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#featured-products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-300 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:text-white transition-all backdrop-blur-md"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Xem Sản Phẩm Hot</span>
            </a>
          </div>

          {/* Metrics Bar */}
          <div className="grid grid-cols-4 gap-4 pt-6 border-t border-white/[0.06] w-full max-w-xl">
            <div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">99.9%</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Tự Động 24/7</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">&lt; 3s</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Nhận Key Ngay</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">15K+</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Đơn Thành Công</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">1:1</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Bảo Hành Uy Tín</div>
            </div>
          </div>

        </div>

        {/* CỘT PHẢI: INTERACTIVE CYBER COCKPIT CARD */}
        <div className="lg:col-span-5 relative">
          
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/25 via-cyan-500/20 to-purple-600/20 blur-3xl rounded-3xl pointer-events-none" />

          <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-white/[0.18] via-white/[0.06] to-transparent shadow-2xl">
            <div className="rounded-[23px] bg-[#0A0D18]/95 backdrop-blur-2xl p-6 border border-white/[0.06] space-y-5">
              
              {/* Header Showcase */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold tracking-wider uppercase text-white font-mono">
                    DEAL SPOTLIGHT HÔM NAY
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400" />
                  GIẢM 30%
                </span>
              </div>

              {/* Featured Product Box */}
              <div className="rounded-2xl p-4 bg-white/[0.02] border border-white/[0.06] hover:border-brand-primary/40 transition-all space-y-4">
                <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-900 border border-white/[0.06]">
                  <Image
                    src={sampleFeaturedDeal.images[0]}
                    alt={sampleFeaturedDeal.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D18] via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/80 text-white font-bold backdrop-blur-md">
                      🟢 Còn 2 tài khoản
                    </span>
                    <span className="px-2 py-0.5 rounded bg-black/60 text-slate-300 font-mono backdrop-blur-md">
                      Mã: MC-FA-01
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-xs font-mono text-indigo-400">Minecraft Official</span>
                    <span className="text-xs text-slate-500 line-through font-mono">250.000 đ</span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug">
                    {sampleFeaturedDeal.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {sampleFeaturedDeal.description}
                  </p>
                </div>

                {/* Price & Buy Button */}
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Giá thanh toán:</div>
                    <div className="text-xl font-black text-white font-mono text-indigo-300">
                      {formatPrice(sampleFeaturedDeal.priceVND, currency)}
                    </div>
                  </div>

                  <button
                    onClick={handleBuyFeatured}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary hover:brightness-110 text-white font-bold text-xs transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Mua Ngay (3s)</span>
                  </button>
                </div>
              </div>

              {/* Security & Multi-Gateway Trust Badges */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">VietQR Tự Động</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <Lock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">Mã Hoá AES-256</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
export default HeroSection;
