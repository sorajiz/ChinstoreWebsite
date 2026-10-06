'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Sparkles, ShieldCheck, QrCode, Lock, CheckCircle2, Heart } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const tCommon = useTranslations('common');

  return (
    <footer className="relative border-t border-white/[0.08] bg-[#05070E] pt-16 pb-12 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-primary via-indigo-600 to-brand-secondary p-[1px] shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                <div className="w-full h-full bg-[#08090E] rounded-[11px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-wider text-white font-sans">
                CHIN<span className="bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">STORE</span>
                <span className="text-[10px] ml-1.5 uppercase font-mono px-1.5 py-0.5 rounded bg-brand-primary/20 text-brand-primary border border-brand-primary/30">
                  2.0
                </span>
              </span>
            </div>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Nền tảng thương mại số chuyên cung cấp tài nguyên game, key phần mềm, tài khoản bản quyền tự động 24/7 với tốc độ giao hàng 3 giây.
            </p>

            {/* Payment & Security Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                VietQR SePay
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-[11px] font-mono text-indigo-300 flex items-center gap-1.5">
                <span className="font-bold">Ł</span>
                Litecoin 0-Conf
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-[11px] font-mono text-emerald-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                Mã Hoá AES-256
              </span>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              Danh Mục Hàng
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/shop?category=minecraft-alts" className="hover:text-indigo-300 transition-colors">
                  Minecraft Alts & Ranks
                </Link>
              </li>
              <li>
                <Link href="/shop?category=gaming-accounts" className="hover:text-indigo-300 transition-colors">
                  Steam & CS2 Prime VIP
                </Link>
              </li>
              <li>
                <Link href="/shop?category=ai-software" className="hover:text-indigo-300 transition-colors">
                  AI ChatGPT & Claude 3.5
                </Link>
              </li>
              <li>
                <Link href="/shop?category=entertainment" className="hover:text-indigo-300 transition-colors">
                  Netflix 4K & Spotify
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              Liên Kết Nhanh
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/" className="hover:text-indigo-300 transition-colors">
                  Trang Chủ
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-indigo-300 transition-colors">
                  Toàn Bộ Cửa Hàng
                </Link>
              </li>
              <li>
                <a href="#featured-products" className="hover:text-indigo-300 transition-colors">
                  Hot Deals Hôm Nay
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-indigo-300 transition-colors">
                  Tính Năng Tự Động
                </a>
              </li>
            </ul>
          </div>

          {/* Support & Community */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              Hỗ Trợ & CSKH
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Hỗ Trợ 24/7 Qua Discord
                </span>
              </li>
              <li>
                <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-300 transition-colors">
                  Cộng Đồng 5,200+ Game Thủ
                </a>
              </li>
              <li>
                <span className="hover:text-indigo-300 cursor-pointer transition-colors">
                  Chính Sách 1 Đổi 1
                </span>
              </li>
              <li>
                <span className="hover:text-indigo-300 cursor-pointer transition-colors">
                  Điều Khoản Giao Dịch
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} CHIN STORE. Bản quyền thuộc về ChinStore Cyber Platform.</p>
          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Hệ Thống Trực Tuyến 100%</span>
            </div>
            <span>•</span>
            <span>Next.js 14 App Router</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
