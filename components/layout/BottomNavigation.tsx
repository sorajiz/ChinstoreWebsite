'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/navigation';
import { useStore } from '@/lib/store';
import { Home, ShoppingBag, ShoppingCart, Wallet, LayoutGrid } from 'lucide-react';

export default function BottomNavigation() {
  const t = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();
  const { setCartOpen, getCartItemCount, isCartOpen } = useStore();
  const itemCount = getCartItemCount();

  // Khi giỏ hàng đang mở trên mobile, ẩn thanh bottom nav để giỏ hàng chiếm trọn màn hình thoải mái
  if (isCartOpen) return null;

  const isHome = pathname === '/' || pathname === '';
  const isShop = pathname === '/shop';
  const isProfile = pathname.startsWith('/profile');

  const handleHomeClick = () => {
    if (isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/');
    }
  };

  const handleShopClick = () => {
    if (isShop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/shop');
    }
  };

  const handleCartClick = () => {
    setCartOpen(true);
  };

  const handleAccountClick = () => {
    router.push('/profile');
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      data-sora-opt="glass"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0E0E12]/95 backdrop-blur-2xl border-t border-zinc-200/90 dark:border-[#27272A] px-3 py-1.5 flex items-center justify-around shadow-2xl transition-colors duration-200"
      style={{ paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom))' }}
    >
      {/* 1. Trang chủ */}
      <button
        onClick={handleHomeClick}
        className={`flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
          isHome
            ? 'bg-zinc-950 text-white dark:bg-zinc-800 dark:text-white rounded-xl py-1.5 px-3.5 shadow-xs font-bold'
            : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white py-1.5 px-2.5'
        }`}
      >
        <Home className="w-5 h-5 stroke-[2]" />
        <span className="text-[11px] font-semibold tracking-tight leading-none">
          {t('home')}
        </span>
      </button>

      {/* 2. Cửa hàng (Chuyển trực tiếp vào trang mua sắm /shop) */}
      <button
        onClick={handleShopClick}
        className={`flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
          isShop
            ? 'bg-zinc-950 text-white dark:bg-zinc-800 dark:text-white rounded-xl py-1.5 px-3.5 shadow-xs font-bold'
            : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white py-1.5 px-2.5'
        }`}
      >
        <ShoppingBag className="w-5 h-5 stroke-[2]" />
        <span className="text-[11px] font-semibold tracking-tight leading-none">
          {t('store')}
        </span>
      </button>

      {/* 3. Giỏ hàng */}
      <button
        onClick={handleCartClick}
        className="relative flex flex-col items-center justify-center gap-1 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white py-1.5 px-2.5 transition-all cursor-pointer"
      >
        <div className="relative">
          <ShoppingCart className="w-5 h-5 stroke-[2]" />
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold text-[10px] flex items-center justify-center shadow-xs">
              {itemCount}
            </span>
          )}
        </div>
        <span className="text-[11px] font-semibold tracking-tight leading-none">
          {t('cart')}
        </span>
      </button>

      {/* 4. Tài khoản */}
      <button
        onClick={handleAccountClick}
        className={`flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
          isProfile
            ? 'bg-zinc-950 text-white dark:bg-zinc-800 dark:text-white rounded-xl py-1.5 px-3.5 shadow-xs font-bold'
            : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white py-1.5 px-2.5'
        }`}
      >
        <LayoutGrid className="w-5 h-5 stroke-[2]" />
        <span className="text-[11px] font-semibold tracking-tight leading-none">
          {t('myProfile')}
        </span>
      </button>
    </nav>
  );
}
