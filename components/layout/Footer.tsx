'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/navigation';
import { ArrowUp, ExternalLink, Sparkles, Scale, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const isEn = locale === 'en';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-[#E5E1D8] dark:border-[#27272A] bg-[#F7F5F0] dark:bg-[#09090B] pt-16 pb-28 md:pb-14 overflow-hidden text-zinc-700 dark:text-zinc-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Brand Info with Jump Discord Button */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700/80 shadow-xs shrink-0">
                <Image
                  src="/logo.png"
                  alt="ChinStore"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white font-sans">
                ChinStore
              </span>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm leading-relaxed">
              {isEn
                ? 'Digital Store: Game top-up, Minecraft MFA, Discord Nitro, Decos, Netflix 4K, Spotify and licensed accounts. Automated delivery, wallet & VietQR payments. 24/7 direct Discord support.'
                : 'Cửa hàng số: nạp game, Minecraft MFA, Discord Nitro, Deco, Netflix 4K, Spotify và tài khoản bản quyền. Giao tự động, thanh toán bằng ví & VietQR. Hỗ trợ trực tiếp 24/7 qua Discord.'}
            </p>

            {/* Jump Link Discord Button & Scroll To Top */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="https://discord.gg/mSG6dR4JMv"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-[#18181C] dark:hover:bg-[#222228] border border-zinc-700/60 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <span>{isEn ? 'Join Discord' : 'Gia nhập Discord'}</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* Scroll to Top Jump Link */}
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-[#121215] dark:hover:bg-[#18181C] border border-zinc-200 dark:border-[#27272A] text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                title={isEn ? 'Scroll to top' : 'Cuộn lên đầu trang'}
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>{isEn ? 'Back to top' : 'Lên đầu trang'}</span>
              </button>
            </div>
          </div>

          {/* Cột 1: MUA SẮM */}
          <div className="lg:col-span-3 space-y-3.5 lg:pl-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-950 dark:text-white font-bold">
              {isEn ? 'SHOPPING' : 'MUA SẮM'}
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/shop" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  {isEn ? 'All Products' : 'Tất cả sản phẩm'}
                </Link>
              </li>
              <li>
                <Link href="/shop?category=minecraft-alts" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Minecraft Alts & Ranks
                </Link>
              </li>
              <li>
                <Link href="/shop?category=discord-services" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  {isEn ? 'Discord Nitro & Decos' : 'Discord Nitro & Decao'}
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

          {/* Cột 2: ĐIỀU HƯỚNG NHANH */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-950 dark:text-white font-bold">
              {isEn ? 'QUICK LINKS' : 'ĐIỀU HƯỚNG NHANH'}
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <a href="#hero" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  {isEn ? 'Home' : 'Trang chủ'}
                </a>
              </li>
              <li>
                <a href="#featured-products" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  {isEn ? 'Featured Products' : 'Sản phẩm thịnh hành'}
                </a>
              </li>
              <li>
                <a href="#transparency" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  {isEn ? 'ChinStore Commitments' : 'Cam kết dịch vụ ChinStore'}
                </a>
              </li>
              <li>
                <Link href="/profile" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  {isEn ? 'Wallet & Order History' : 'Ví & Lịch sử đơn'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: PHÁP LÝ (Chuẩn 3 mục gọn gàng theo Ảnh 3, xóa trạng thái bảo mật) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-950 dark:text-white font-bold">
              {isEn ? 'LEGAL' : 'PHÁP LÝ'}
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <Link
                  href="/terms"
                  className="hover:text-zinc-950 dark:hover:text-white cursor-pointer transition-colors text-left"
                >
                  {isEn ? 'Terms of Service' : 'Điều khoản dịch vụ'}
                </Link>
              </li>
              <li>
                <Link
                  href="/refund"
                  className="hover:text-zinc-950 dark:hover:text-white cursor-pointer transition-colors text-left"
                >
                  {isEn ? 'Refund & Warranty Policy' : 'Chính sách hoàn tiền & Bảo hành'}
                </Link>
              </li>
              <li>
                <Link
                  href="/payment-policy"
                  className="hover:text-zinc-950 dark:hover:text-white cursor-pointer transition-colors text-left"
                >
                  {isEn ? 'Payment Regulations' : 'Quy định thanh toán'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#E5E1D8] dark:border-[#27272A] flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 gap-4">
          <p>© {new Date().getFullYear()} ChinStore. {t('rights')}</p>
        </div>
      </div>
    </footer>
  );
}

