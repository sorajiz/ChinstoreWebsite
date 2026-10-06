'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { useStore } from '@/lib/store';
import { Product, Category } from '@/types';
import { formatPrice } from '@/lib/utils';
import {
  ShoppingCart,
  ArrowRight,
  Zap,
  Tag,
  AppWindow,
  LayoutGrid,
  Eye,
  Wrench,
  RotateCw,
  Plus,
  Minus,
} from 'lucide-react';
import RollingArrowButton from '@/components/ui/RollingArrowButton';
import { toast } from 'sonner';

interface FeaturedProductsSectionProps {
  products: Product[];
  categories: Category[];
  onQuickCheckout?: (product: Product) => void;
}

export default function FeaturedProductsSection({
  products,
  categories,
  onQuickCheckout,
}: FeaturedProductsSectionProps) {
  const t = useTranslations('featuredProducts');
  const { currency, addItem, setQuickViewProduct } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return products;
    }
    return products.filter((p) => p.category?.slug === selectedCategory);
  }, [products, selectedCategory]);

  const getProductQty = (id: string) => quantities[id] || 1;

  const updateProductQty = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const qty = getProductQty(product.id);
    addItem(product, qty);
    toast.success(`Đã thêm (${qty}) "${product.name}" vào giỏ hàng!`, {
      icon: <ShoppingCart className="w-4 h-4 text-white" />,
    });
  };

  const handleBuyNow = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const qty = getProductQty(product.id);
    addItem(product, qty);
    if (onQuickCheckout) {
      onQuickCheckout(product);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success(t('refresh') + ' thành công!');
    }, 600);
  };

  return (
    <section id="featured-products" className="py-12 sm:py-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header matching Image 3 */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-[#F4F4F5] font-sans">
              {t('trendingTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-[#94949E] max-w-xl leading-relaxed">
              {t('trendingSubtitle')}
            </p>
          </div>

          <RollingArrowButton href="/shop">
            {t('exploreProducts')}
          </RollingArrowButton>
        </div>


        {/* Product Cards Grid: Exactly 4 products for clean, compact layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.slice(0, 4).map((product, idx) => (
            <ProductCardItem
              key={product.id}
              product={product}
              index={idx}
              quantity={getProductQty(product.id)}
              onQtyChange={(delta) => updateProductQty(product.id, delta)}
              currency={currency}
              t={t}
              onAddToCart={(e) => handleAddToCart(e, product)}
              onBuyNow={(e) => handleBuyNow(e, product)}
              onQuickView={() => setQuickViewProduct(product)}
            />
          ))}
        </div>

        {/* Bottom Status Bar matching Image 3 */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 pt-4 border-t border-zinc-200 dark:border-zinc-800/80 gap-3">
          <span>{t('publicPricing')}</span>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 hover:text-zinc-950 dark:hover:text-white font-medium transition-colors cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{t('refresh')}</span>
          </button>
        </div>

      </div>
    </section>
  );
}

// Single Product Card Component matching Image 3
function ProductCardItem({
  product,
  index,
  quantity,
  onQtyChange,
  currency,
  t,
  onAddToCart,
  onBuyNow,
  onQuickView,
}: {
  product: Product;
  index: number;
  quantity: number;
  onQtyChange: (delta: number) => void;
  currency: any;
  t: any;
  onAddToCart: (e: React.MouseEvent) => void;
  onBuyNow: (e: React.MouseEvent) => void;
  onQuickView: () => void;
}) {
  const hasImage = Boolean(product.images?.[0] && !product.images[0].includes('placeholder'));
  const [imgError, setImgError] = useState(false);

  const stockCount = product.availableCount ?? 1;
  const isManual = index % 4 === 0;

  return (
    <div
      onClick={onQuickView}
      className="group rounded-3xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-[#27272A] overflow-hidden shadow-xs hover:shadow-xl hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top Image Box */}
        <div className="relative w-full aspect-[4/3] bg-zinc-100 dark:bg-[#18181C] flex items-center justify-center overflow-hidden border-b border-zinc-200 dark:border-[#27272A]">
          {hasImage && !imgError ? (
            <Image
              src={product.images![0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex items-center justify-center text-zinc-400 dark:text-zinc-600">
              {product.category?.slug === 'discord' ? (
                <AppWindow className="w-12 h-12 stroke-[1.2]" />
              ) : (
                <Tag className="w-12 h-12 stroke-[1.2]" />
              )}
            </div>
          )}



          {/* Quick View Button on Hover */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView();
            }}
            className="absolute top-3 right-3 p-2 rounded-xl bg-black/70 hover:bg-zinc-800 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 shadow-md cursor-pointer"
            title={t('quickView')}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content Info matching Image 3 */}
        <div className="p-4 space-y-2">
          {/* Category Line */}
          <div className="flex items-center text-[11px] text-zinc-500 dark:text-[#94949E]">
            <span className="font-semibold capitalize">
              {product.category?.name || 'Vật phẩm'}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-bold text-zinc-950 dark:text-[#F4F4F5] line-clamp-2 leading-snug group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="text-base font-black text-zinc-950 dark:text-white pt-1 font-mono">
            {formatPrice(product.priceVND, currency)}
          </div>

          {/* Stock Count */}
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {t('itemsLeft', { count: product.availableCount ?? 1 })}
          </div>
        </div>
      </div>

      {/* Quantity Selector + Actions matching Image 3 & Image 1 */}
      <div className="px-4 pb-4 pt-1 space-y-2.5">
        {/* Quantity Row */}
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span className="font-mono text-[11px]">{t('quantity')}</span>
          <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#18181C] overflow-hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQtyChange(-1);
              }}
              className="px-2 py-0.5 text-zinc-600 dark:text-zinc-300 hover:text-white hover:bg-zinc-700/50 text-xs font-bold transition-colors cursor-pointer"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-2.5 py-0.5 font-mono text-[11px] font-bold text-zinc-900 dark:text-white">
              {quantity}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQtyChange(1);
              }}
              className="px-2 py-0.5 text-zinc-600 dark:text-zinc-300 hover:text-white hover:bg-zinc-700/50 text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Action Buttons matching Image 1 */}
        <div className="grid grid-cols-2 gap-2">
          {/* Button 1: Dark Grey / Black [🛒 Thêm vào giỏ] */}
          <button
            onClick={onAddToCart}
            className="py-2.5 px-3 rounded-xl bg-[#121215] dark:bg-[#18181C] hover:bg-[#202025] dark:hover:bg-[#222228] text-white border border-[#27272E] text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-xs cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5 stroke-[2]" />
            <span className="truncate">{t('addToCart')}</span>
          </button>

          {/* Button 2: Crisp Light Grey / White [→ Mua] */}
          <button
            onClick={onBuyNow}
            className="py-2.5 px-3 rounded-xl bg-white hover:bg-zinc-100 dark:bg-[#F4F4F5] dark:hover:bg-zinc-200 text-zinc-950 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{t('buy')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
