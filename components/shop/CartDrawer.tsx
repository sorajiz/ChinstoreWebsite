'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
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
  } = useStore();

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

      {/* Side Drawer: Trượt từ bên phải sang, full chiều cao, chuẩn 100% ảnh tham khảo */}
      <aside
        className="fixed top-0 bottom-0 right-0 z-10 w-full sm:w-[420px] md:w-[440px] h-full h-screen max-h-screen bg-white dark:bg-[#0c0c0e] text-zinc-950 dark:text-white border-l border-zinc-200/90 dark:border-white/10 shadow-2xl flex flex-col transition-colors duration-200 animate-in slide-in-from-right duration-300 ease-out"
      >
        {/* Header: [🛒 Giỏ hàng] ... [✕] chuẩn 100% ảnh */}
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
                <span className="hidden sm:inline">{isEn ? 'Clear' : 'Xóa hết'}</span>
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

        {/* Body: Khi giỏ trống, nội dung nằm ở CENTER hoàn toàn theo chiều dọc & ngang chuẩn ảnh */}
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
          /* Danh sách sản phẩm trong giỏ khi có hàng */
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
                  {/* Thumbnail */}
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white dark:bg-[#0e0e11] border border-zinc-200/80 dark:border-zinc-800 shrink-0">
                    <Image
                      src={img}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white truncate">
                      {product.name}
                    </h4>
                    <div className="text-xs sm:text-sm font-mono font-bold text-zinc-950 dark:text-zinc-100">
                      {formatPrice(product.price * quantity, currency)}
                    </div>

                    {/* Quantity Controls */}
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

        {/* Footer with Subtotal & Checkout Button */}
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
              onClick={() => {
                setCartOpen(false);
                onProceedToCheckout();
              }}
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
