'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Sparkles, CheckCircle2, ArrowUp, ExternalLink } from 'lucide-react';

function DiscordIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export default function Footer() {
  const t = useTranslations('footer');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-[#E5E1D8] dark:border-[#27272A] bg-[#F7F5F0] dark:bg-[#09090B] pt-16 pb-12 overflow-hidden text-zinc-700 dark:text-zinc-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info with Jump Discord Button */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-zinc-800 border border-zinc-700/50 p-[1px] shadow-sm">
                <div className="w-full h-full bg-zinc-900 dark:bg-[#121214] rounded-[11px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-wider text-zinc-950 dark:text-white font-sans">
                Chin<span className="text-zinc-500 dark:text-zinc-400">Store</span>
              </span>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm leading-relaxed">
              Cửa hàng số: nạp game, Minecraft, Discord Nitro, Deco, Netflix, Spotify và vật phẩm. Giao tự động, thanh toán bằng ví & VietQR. Hỗ trợ trực tiếp qua Discord.
            </p>

            {/* Jump Link Discord Button with Status Indicator */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="https://discord.gg"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-[#18181C] dark:hover:bg-[#222228] border border-zinc-700/60 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
              >
                <DiscordIcon className="w-4 h-4 fill-current text-white group-hover:scale-110 transition-transform" />
                <span>Gia nhập Discord ChinStore</span>
                <span className="relative flex h-2 w-2 ml-0.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* Scroll to Top Jump Link */}
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-[#121215] dark:hover:bg-[#18181C] border border-zinc-200 dark:border-[#27272A] text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                title="Cuộn lên đầu trang"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Lên đầu trang</span>
              </button>
            </div>
          </div>

          {/* Cột 1: Mua sắm */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-950 dark:text-white font-bold">
              Mua sắm
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/shop" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Tất cả sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/shop?category=minecraft-alts" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Minecraft Alts & Ranks
                </Link>
              </li>
              <li>
                <Link href="/shop?category=discord-services" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Discord Nitro & Decao
                </Link>
              </li>
              <li>
                <Link href="/shop?category=streaming-vpn" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Netflix 4K & Spotify
                </Link>
              </li>
              <li>
                <Link href="/shop?category=gaming-accounts" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Steam & CS2 Prime
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 2: Điều hướng nhanh (Jump Anchors) */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-950 dark:text-white font-bold">
              Điều hướng nhanh
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <a href="#hero" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="#featured-products" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Sản phẩm thịnh hành
                </a>
              </li>
              <li>
                <a href="#transparency" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Cam kết dịch vụ ChinStore
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Hỏi đáp (FAQ)
                </a>
              </li>
              <li>
                <Link href="/profile" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Ví & Lịch sử đơn
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Pháp lý & Trạng thái */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-950 dark:text-white font-bold">
              Pháp lý & Cam kết
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <span className="hover:text-zinc-950 dark:hover:text-white cursor-pointer transition-colors">
                  Điều khoản dịch vụ
                </span>
              </li>
              <li>
                <span className="hover:text-zinc-950 dark:hover:text-white cursor-pointer transition-colors">
                  Chính sách bảo mật
                </span>
              </li>
              <li>
                <span className="hover:text-zinc-950 dark:hover:text-white cursor-pointer transition-colors">
                  Chính sách 1 đổi 1
                </span>
              </li>
              <li>
                <span className="text-emerald-500 flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Trạng thái hệ thống 100%
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#E5E1D8] dark:border-[#27272A] flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 gap-4">
          <p>© {new Date().getFullYear()} CHIN STORE. {t('rights')}</p>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('systemOnline')}</span>
            </div>
            <span>•</span>
            <span>Next.js 14 App Router</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
