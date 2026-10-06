'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Sparkles, QrCode, Lock, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="relative border-t border-[#E5E1D8] dark:border-[#27272A] bg-[#F7F5F0] dark:bg-[#09090B] pt-16 pb-12 overflow-hidden text-zinc-700 dark:text-zinc-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info matching Image 5 */}
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

            {/* Discord CTA Button matching Image 5 */}
            <div className="pt-2">
              <a
                href="https://discord.gg"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-[#18181C] dark:hover:bg-[#222228] border border-zinc-700/60 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
              >
                <span>Tham gia Discord</span>
              </a>
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

          {/* Cột 2: Tài khoản */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-950 dark:text-white font-bold">
              Tài khoản
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/profile" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Ví của tôi
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Lịch sử đơn hàng
                </Link>
              </li>
              <li>
                <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Hỗ trợ 24/7 (Discord)
                </a>
              </li>
              <li>
                <Link href="/profile" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Liên kết tài khoản
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Pháp lý */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-950 dark:text-white font-bold">
              Pháp lý
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
