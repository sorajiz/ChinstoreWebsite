'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { useSession } from 'next-auth/react';
import { useRouter } from '@/navigation';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import {
  X,
  Trash2,
  ArrowRight,
  ShoppingCart,
  Plus,
  Minus,
} from 'lucide-react';
import { toast } from 'sonner';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

// 3D Isometric Wireframe Box Icon matching reference screenshot
function IsometricBoxIcon({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Outer Hexagon Cube */}
      <path d="M32 8L12 19.5V44.5L32 56L52 44.5V19.5L32 8Z" />
      {/* Center Y division for 3 faces */}
      <path d="M32 32V56" />
      <path d="M12 19.5L32 32L52 19.5" />
      {/* Top Face Box Seam detailing */}
      <path d="M22 13.8L42 25.2" strokeWidth="1.8" opacity="0.6" />
    </svg>
  );
}

export default function CartDrawer({ onProceedToCheckout }: CartDrawerProps) {
  const t = useTranslations('cart');
  const tToast = useTranslations('toasts');
  const locale = useLocale();
  const isEn = locale === 'en';
  const router = useRouter();

  const { data: session } = useSession();
  const {
    cart,
    isCartOpen,
    setCartOpen,
    removeItem,
    updateQuantity,
    clearCart,
    getCartTotalVND,
    getCartItemCount,
    currency,
    setAuthModalOpen,
  } = useStore();

  const handleCheckoutClick = () => {
    setCartOpen(false);
    if (!session?.user) {
      toast.info(isEn ? 'Please login with Discord to proceed with checkout!' : 'Vui lòng đăng nhập Discord để tiếp tục thanh toán và nhận tài khoản tức thì!');
      router.push('/login');
      return;
    }
    onProceedToCheckout();
  };

  if (!isCartOpen) return null;

  const totalVND = getCartTotalVND();
  const itemCount = getCartItemCount();

  const handleRemove = (productId: string) => {
    removeItem(productId);
    toast.info(tToast('removedFromCart'), {
      className: 'bg-zinc-900 text-white border border-zinc-700',
    });
  };

  const handleClearAll = () => {
    clearCart();
    toast.info(isEn ? 'Cart cleared' : 'Đã xóa toàn bộ giỏ hàng');
  };

  const handleExploreProducts = () => {
    setCartOpen(false);
    const el = document.getElementById('featured-products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push('/shop');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Backdrop */}
      <div
        data-sora-opt="glass"
        onClick={() => setCartOpen(false)}
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* ========================================================================= */}
      {/* 1. MOBILE DRAWER: Dạng Bottom Sheet trượt từ dưới lên chuẩn 100% Ảnh 1      */}
      {/* ========================================================================= */}
      <aside
        className="md:hidden fixed bottom-0 left-0 right-0 z-10 w-full max-h-[85vh] bg-white dark:bg-[#121215] text-zinc-950 dark:text-white rounded-t-[28px] border-t border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col transition-colors duration-200 animate-in slide-in-from-bottom duration-300 ease-out"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      >
        {/* Mobile Top Grab Indicator */}
        <div className="pt-2 pb-1 flex justify-center">
          <div className="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        </div>

        {/* Header Mobile: [🛒 Giỏ hàng] ... [✕] */}
        <div className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between bg-white dark:bg-[#121215] shrink-0">
          <div className="flex items-center gap-2.5">
            <ShoppingCart className="w-5 h-5 text-zinc-950 dark:text-white stroke-[2.2]" />
            <h2 className="text-base font-bold text-zinc-950 dark:text-white tracking-tight">
              {t('title')}
            </h2>
            {itemCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-[#18181c] border border-zinc-200/80 dark:border-zinc-800 text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">
                {itemCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs font-medium text-zinc-400 hover:text-rose-500 transition-colors px-2 py-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer flex items-center gap-1"
                title={isEn ? 'Clear all' : 'Xóa tất cả'}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isEn ? 'Clear' : 'Xóa hết'}</span>
              </button>
            )}

            <button
              onClick={() => setCartOpen(false)}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5 stroke-[2]" />
            </button>
          </div>
        </div>

        {/* Body Mobile: Trống -> Căn giữa 100% chuẩn Ảnh 1 */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-14">
            <IsometricBoxIcon className="w-16 h-16 text-zinc-400 dark:text-zinc-500 stroke-[1.8] mb-4" />

            <p className="text-sm font-normal text-zinc-600 dark:text-zinc-400 font-sans mb-3">
              {t('emptyTitle')}
            </p>

            <button
              onClick={handleExploreProducts}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-zinc-950 dark:text-white hover:opacity-80 transition-opacity cursor-pointer group"
            >
              <span>{t('exploreProducts')}</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        ) : (
          /* Danh sách sản phẩm trên Mobile */
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col space-y-3 max-h-[50vh] scrollbar-thin">
            {cart.map(({ product, quantity }) => {
              const img =
                product.images?.[0] ||
                'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';
              return (
                <div
                  key={product.id}
                  className="p-3 rounded-2xl bg-zinc-50 dark:bg-[#18181c] border border-zinc-200/80 dark:border-zinc-800 flex gap-3 items-center shadow-2xs"
                >
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white dark:bg-[#0e0e11] border border-zinc-200/80 dark:border-zinc-800 shrink-0">
                    <Image
                      src={img}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                      {product.name}
                    </h4>
                    <div className="text-xs font-mono font-bold text-zinc-950 dark:text-zinc-100">
                      {formatPrice(product.price * quantity, currency)}
                    </div>

                    <div className="flex items-center gap-2 pt-0.5">
                      <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#0e0e11]">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-[11px] font-mono font-bold text-zinc-900 dark:text-white">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(product.id)}
                        className="p-1 text-zinc-400 hover:text-rose-500 transition-colors ml-auto cursor-pointer"
                        title={t('remove')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Mobile: Tổng tiền & Nút thanh toán */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-zinc-200/90 dark:border-white/10 bg-zinc-50/90 dark:bg-[#151518] space-y-3 shrink-0">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">{t('subtotal')}</span>
              <span className="text-base font-black text-zinc-950 dark:text-white font-mono">
                {formatPrice(totalVND, currency)}
              </span>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="w-full py-3 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-850 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 cursor-pointer"
            >
              <span>{t('checkout')}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        )}
      </aside>

      {/* ========================================================================= */}
      {/* 2. DESKTOP DRAWER: Giữ nguyên vẹn cho thiết bị PC (slide-in bên phải)      */}
      {/* ========================================================================= */}
      <aside
        className="hidden md:flex fixed top-0 bottom-0 right-0 z-10 w-[420px] md:w-[440px] h-full h-screen max-h-screen bg-white dark:bg-[#0c0c0e] text-zinc-950 dark:text-white border-l border-zinc-200/90 dark:border-white/10 shadow-2xl flex-col transition-colors duration-200 animate-in slide-in-from-right duration-300 ease-out"
      >
        {/* Header PC: [🛒 Giỏ hàng] ... [✕] */}
        <div className="px-6 py-5 border-b border-zinc-200/90 dark:border-white/10 flex items-center justify-between bg-white dark:bg-[#0c0c0e] shrink-0 transition-colors">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-5 h-5 text-zinc-950 dark:text-white stroke-[2.2]" />
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white font-sans tracking-tight">
              {t('title')}
            </h2>
            {itemCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-[#18181c] border border-zinc-200/80 dark:border-zinc-800 text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">
                {itemCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs font-medium text-zinc-400 hover:text-rose-500 transition-colors px-2 py-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer flex items-center gap-1"
                title={isEn ? 'Clear all' : 'Xóa tất cả'}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isEn ? 'Clear' : 'Xóa hết'}</span>
              </button>
            )}

            <button
              onClick={() => setCartOpen(false)}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5 stroke-[2]" />
            </button>
          </div>
        </div>

        {/* Body PC: Trống */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
            <IsometricBoxIcon className="w-16 h-16 sm:w-20 sm:h-20 text-zinc-500 dark:text-zinc-500 stroke-[1.8] mb-4" />

            <p className="text-sm sm:text-base font-normal text-zinc-500 dark:text-zinc-400 font-sans mb-2">
              {t('emptyTitle')}
            </p>

            <button
              onClick={handleExploreProducts}
              className="inline-flex items-center gap-1.5 text-sm sm:text-base font-bold text-zinc-950 dark:text-white hover:opacity-80 transition-opacity cursor-pointer group"
            >
              <span>{t('exploreProducts')}</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        ) : (
          /* Danh sách sản phẩm PC */
          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col space-y-3 scrollbar-thin">
            {cart.map(({ product, quantity }) => {
              const img =
                product.images?.[0] ||
                'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';
              return (
                <div
                  key={product.id}
                  className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-[#141417] border border-zinc-200/80 dark:border-zinc-800 flex gap-3.5 items-center group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-2xs"
                >
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white dark:bg-[#0e0e11] border border-zinc-200/80 dark:border-zinc-800 shrink-0">
                    <Image
                      src={img}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white truncate">
                      {product.name}
                    </h4>
                    <div className="text-xs sm:text-sm font-mono font-bold text-zinc-950 dark:text-zinc-100">
                      {formatPrice(product.price * quantity, currency)}
                    </div>

                    <div className="flex items-center gap-2 pt-0.5">
                      <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#0e0e11]">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-[11px] font-mono font-bold text-zinc-900 dark:text-white">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(product.id)}
                        className="p-1 text-zinc-400 hover:text-rose-500 transition-colors ml-auto cursor-pointer"
                        title={t('remove')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer PC */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-zinc-200/90 dark:border-white/10 bg-zinc-50/90 dark:bg-[#111114] space-y-3.5 shrink-0 transition-colors">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">{t('subtotal')}</span>
              <span className="text-lg sm:text-xl font-black text-zinc-950 dark:text-white font-mono">
                {formatPrice(totalVND, currency)}
              </span>
            </div>

            <button
              id="checkout-drawer-btn"
              onClick={handleCheckoutClick}
              className="w-full py-3.5 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-850 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 cursor-pointer"
            >
              <span>{t('checkout')}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
