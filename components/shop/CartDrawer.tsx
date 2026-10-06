'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/navigation';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import { X, Trash2, ArrowRight, ShoppingCart, Plus, Minus } from 'lucide-react';
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
  const router = useRouter();

  const {
    cart,
    isCartOpen,
    setCartOpen,
    removeItem,
    updateQuantity,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setCartOpen(false)}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Centered Modal Card matching reference screenshot */}
      <div className="relative w-full max-w-md rounded-2xl sm:rounded-3xl bg-[#FAF9F5] dark:bg-[#121215] border border-zinc-200 dark:border-[#27272A] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 transition-colors">
        
        {/* Header matching Screenshot: [🛒 Giỏ hàng] ... [✕] */}
        <div className="px-6 py-4.5 border-b border-zinc-200 dark:border-[#27272A] flex items-center justify-between bg-transparent">
          <div className="flex items-center gap-2.5">
            <ShoppingCart className="w-5 h-5 text-zinc-900 dark:text-[#F4F4F5] stroke-[2]" />
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-[#F4F4F5] font-sans">
              {t('title')} {itemCount > 0 && <span className="text-sm font-normal text-zinc-500">({itemCount})</span>}
            </h2>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5 stroke-[2]" />
          </button>
        </div>

        {/* Body: Empty State matching Screenshot OR Item List */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            /* Empty State matching Screenshot */
            <div className="text-center py-12 sm:py-16 space-y-4 flex flex-col items-center justify-center">
              <IsometricBoxIcon className="w-16 h-16 text-zinc-400 dark:text-zinc-500" />
              
              <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-[#F4F4F5] font-sans">
                {t('emptyTitle')}
              </h3>

              <button
                onClick={handleExploreProducts}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white transition-colors group cursor-pointer"
              >
                <span>{t('exploreProducts')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : (
            /* Non-empty cart item list */
            <div className="space-y-3">
              {cart.map(({ product, quantity }) => {
                const img =
                  product.images?.[0] ||
                  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';
                return (
                  <div
                    key={product.id}
                    className="p-3.5 rounded-2xl bg-white dark:bg-[#18181C] border border-zinc-200 dark:border-zinc-800 flex gap-3.5 items-center group hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors shadow-xs"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shrink-0">
                      <Image
                        src={img}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="text-xs font-bold text-zinc-950 dark:text-white truncate">
                        {product.name}
                      </h4>
                      <div className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-200">
                        {formatPrice(product.price * quantity, currency)}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 pt-0.5">
                        <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-[#121215]">
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
        </div>

        {/* Footer with Subtotal & Checkout Button */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-zinc-200 dark:border-[#27272A] bg-zinc-50/50 dark:bg-[#18181C]/50 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">{t('subtotal')}</span>
              <span className="text-lg font-black text-zinc-950 dark:text-white font-mono">
                {formatPrice(totalVND, currency)}
              </span>
            </div>

            <button
              id="checkout-drawer-btn"
              onClick={() => {
                setCartOpen(false);
                onProceedToCheckout();
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 cursor-pointer"
            >
              <span>{t('checkout')}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
