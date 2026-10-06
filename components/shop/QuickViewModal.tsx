'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import { X, ShoppingCart, Zap, CheckCircle2, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface QuickViewModalProps {
  onQuickCheckout?: () => void;
}

export default function QuickViewModal({ onQuickCheckout }: QuickViewModalProps) {
  const t = useTranslations('shop');
  const tToast = useTranslations('toasts');
  const { quickViewProduct, setQuickViewProduct, addItem, currency } = useStore();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'];

  const specs = product.specs || {};

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(tToast('addedToCart', { name: product.name }), {
      className: 'bg-[#0a0f1f] text-white border border-cyan-500/30',
      icon: <ShoppingCart className="w-4 h-4 text-cyan-400" />,
    });
    setQuickViewProduct(null);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    setQuickViewProduct(null);
    if (onQuickCheckout) {
      onQuickCheckout();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setQuickViewProduct(null)}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-[#121215] border border-[#27272A] rounded-3xl overflow-hidden shadow-2xl z-10 my-8">
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
          {/* Left: Gallery */}
          <div className="space-y-4">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black/40 border border-white/10">
              <Image
                src={images[selectedImageIdx] || images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIdx === idx
                        ? 'border-white shadow-sm'
                        : 'border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="Thumbnail" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Digital Delivery Feature Tag */}
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-2 text-xs text-zinc-300">
              <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t('digitalDeliver')}</span>
            </div>
          </div>

          {/* Right: Info & Actions */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono text-zinc-300 bg-zinc-800/80 px-2.5 py-1 rounded-md border border-zinc-700">
                  {product.category?.name || 'Digital Key'}
                </span>
                <h2 className="text-2xl font-bold font-display text-white mt-2">
                  {product.name}
                </h2>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {formatPrice(product.price, currency)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-zinc-500 line-through font-mono">
                    {formatPrice(product.originalPrice, currency)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                {product.description}
              </p>

              {/* Specs Table */}
              {Object.keys(specs).length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-zinc-400" />
                    {t('specifications')}
                  </h4>
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 divide-y divide-zinc-800 text-xs font-mono">
                    {Object.entries(specs).map(([key, val]) => (
                      <div key={key} className="flex justify-between py-2 px-3">
                        <span className="text-zinc-400">{key}:</span>
                        <span className="text-zinc-200 text-right font-medium">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity & CTA */}
            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <div className="flex items-center gap-4">
                <span className="text-xs text-zinc-400 font-mono">{t('quantity')}</span>
                <div className="flex items-center rounded-xl border border-zinc-700 bg-zinc-900 overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-800 text-sm font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-white font-mono text-xs">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-800 text-sm font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t('inStock')}
                </span>
              </div>

              {/* Actions - Image 1 Two-tone style */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="py-3 px-4 rounded-xl bg-[#18181C] hover:bg-[#222228] border border-[#27272E] text-xs sm:text-sm font-bold text-white transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4 stroke-[2]" />
                  <span>{t('addToCart')}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-3 px-4 rounded-xl bg-white hover:bg-zinc-100 text-xs sm:text-sm font-bold text-zinc-950 transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  <span>{t('buyNow')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
