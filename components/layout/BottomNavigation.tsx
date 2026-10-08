'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/navigation';
import { useStore } from '@/lib/store';
import { Home, ShoppingBag, ShoppingCart, LayoutGrid } from 'lucide-react';

export default function BottomNavigation() {
  const t = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();
  const {
    getCartItemCount,
    isCartOpen,
    isMobileMenuOpen,
    quickViewProduct,
    isCheckoutModalOpen,
    isAuthModalOpen,
    viewMfaProduct,
  } = useStore();
  const itemCount = getCartItemCount();

  // Khi modal giỏ hàng, menu drawer, quick view, checkout, auth hay MFA view đang mở trên mobile, ẩn bottom nav để tránh che khuất
  if (
    isCartOpen ||
    isMobileMenuOpen ||
    quickViewProduct ||
    isCheckoutModalOpen ||
    isAuthModalOpen ||
    viewMfaProduct
  )
    return null;

  const isHome = pathname === '/' || pathname === '';
  const isShop = pathname.startsWith('/shop');
  const isCart = pathname.startsWith('/cart');
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
    if (isCart) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/cart');
    }
  };

  const handleAccountClick = () => {
    router.push('/profile');
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      data-sora-opt="glass"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0E0E12]/95 backdrop-blur-2xl border-t border-zinc-200/90 dark:border-[#27272A] px-4 py-2 sm:py-2.5 flex items-center justify-around shadow-2xl transition-colors duration-200"
      style={{ paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom))' }}
    >
      {/* 1. Trang chủ */}
      <button
        onClick={handleHomeClick}
        className={`flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
          isHome
            ? 'bg-zinc-950 text-white dark:bg-zinc-800 dark:text-white rounded-2xl py-2 px-4 shadow-sm font-bold scale-[1.02]'
            : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white py-2 px-3'
        }`}
      >
        <Home className="w-6 h-6 stroke-[2.2]" />
        <span className="text-xs font-semibold tracking-tight leading-none">
          {t('home')}
        </span>
      </button>

      {/* 2. Cửa hàng */}
      <button
        onClick={handleShopClick}
        className={`flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
          isShop
            ? 'bg-zinc-950 text-white dark:bg-zinc-800 dark:text-white rounded-2xl py-2 px-4 shadow-sm font-bold scale-[1.02]'
            : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white py-2 px-3'
        }`}
      >
        <ShoppingBag className="w-6 h-6 stroke-[2.2]" />
        <span className="text-xs font-semibold tracking-tight leading-none">
          {t('store')}
        </span>
      </button>

      {/* 3. Giỏ (Chuyển trang /cart) */}
      <button
        onClick={handleCartClick}
        className={`relative flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
          isCart
            ? 'bg-zinc-950 text-white dark:bg-zinc-800 dark:text-white rounded-2xl py-2 px-4 shadow-sm font-bold scale-[1.02]'
            : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white py-2 px-3'
        }`}
      >
        <div className="relative">
          <ShoppingCart className="w-6 h-6 stroke-[2.2]" />
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
              {itemCount}
            </span>
          )}
        </div>
        <span className="text-xs font-semibold tracking-tight leading-none">
          {t('cart')}
        </span>
      </button>

      {/* 4. Tài khoản */}
      <button
        onClick={handleAccountClick}
        className={`flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
          isProfile
            ? 'bg-zinc-950 text-white dark:bg-zinc-800 dark:text-white rounded-2xl py-2 px-4 shadow-sm font-bold scale-[1.02]'
            : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white py-2 px-3'
        }`}
      >
        <LayoutGrid className="w-6 h-6 stroke-[2.2]" />
        <span className="text-xs font-semibold tracking-tight leading-none">
          {t('myProfile')}
        </span>
      </button>
    </nav>
  );
}
