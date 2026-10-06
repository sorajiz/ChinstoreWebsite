'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import { X, Trash2, ArrowRight, ShoppingBag, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export default function CartDrawer({ onProceedToCheckout }: CartDrawerProps) {
  const t = useTranslations('cart');
  const tToast = useTranslations('toasts');
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
      className: 'bg-[#0a0f1f] text-white border border-rose-500/30',
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setCartOpen(false)}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#121215] border-l border-[#27272A] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-[#27272A] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-zinc-200" />
              <h2 className="text-lg font-bold text-white font-display">
                {t('title')} ({itemCount})
              </h2>
            </div>
            <button
              onClick={() => setCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: Items List or Empty State */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto text-slate-500">
                  <ShoppingBag className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-base font-bold text-slate-300 font-display">
                  {t('emptyTitle')}
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  {t('emptyDesc')}
                </p>
                <button
                  onClick={() => setCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all inline-block mt-2"
                >
                  {t('exploreProducts')}
                </button>
              </div>
            ) : (
              cart.map(({ product, quantity }) => {
                const img = product.images?.[0] || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';
                return (
                  <div
                    key={product.id}
                    className="p-3 rounded-2xl bg-white/[0.02] border border-white/10 flex gap-3 items-center group hover:border-cyan-500/30 transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0">
                      <Image
                        src={img}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="text-xs font-bold text-white truncate font-display">
                        {product.name}
                      </h4>
                      <div className="text-xs font-mono text-cyan-400 font-bold">
                        {formatPrice(product.price * quantity, currency)}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 pt-1">
                        <div className="flex items-center rounded-lg border border-white/10 bg-black/40">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-[11px] font-mono text-slate-200">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemove(product.id)}
                          className="p-1 text-slate-400 hover:text-rose-400 transition-colors ml-auto"
                          title={t('remove')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#27272A] bg-[#0E0E12] space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">{t('subtotal')}</span>
                <span className="text-lg font-bold text-white font-mono">
                  {formatPrice(totalVND, currency)}
                </span>
              </div>

              <button
                id="checkout-drawer-btn"
                onClick={() => {
                  setCartOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-sm active:scale-95 cursor-pointer"
              >
                <span>{t('checkout')}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
