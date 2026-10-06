'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
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
} from 'lucide-react';
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

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return products;
    }
    return products.filter((p) => p.category?.slug === selectedCategory);
  }, [products, selectedCategory]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addItem(product, 1);
    toast.success(`Đã thêm "${product.name}" vào giỏ hàng!`, {
      icon: <ShoppingCart className="w-4 h-4 text-white" />,
    });
  };

  const handleBuyNow = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addItem(product, 1);
    if (onQuickCheckout) {
      onQuickCheckout(product);
    }
  };

  return (
    <section id="featured-products" className="py-12 sm:py-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider">
            {t('subtitle')}
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white font-sans">
              {t('title')}
            </h2>

            {/* Total Products Pill */}
            <div className="px-3.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] text-xs font-semibold text-zinc-700 dark:text-zinc-300 w-fit shadow-xs">
              <span className="font-bold">{products.length}</span> {t('productCount', { count: '' }).trim()}
            </div>
          </div>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            {t('description')}
          </p>
        </div>

        {/* Category Filter Pills (Instant in-memory switch) */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none pt-2">
          {/* All Category Pill */}
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 shadow-xs active:scale-95 ${
              selectedCategory === 'all'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-black'
                : 'bg-white dark:bg-[#121215] text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{t('all')}</span>
            <span className="text-[11px] opacity-75">{products.length}</span>
          </button>

          {/* Dynamic Categories */}
          {categories.map((cat) => {
            const count = products.filter((p) => p.category?.slug === cat.slug).length;
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 shadow-xs active:scale-95 ${
                  isSelected
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-black'
                    : 'bg-white dark:bg-[#121215] text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[11px] opacity-75">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
          {filteredProducts.map((product) => (
            <ProductCardItem
              key={product.id}
              product={product}
              currency={currency}
              t={t}
              onAddToCart={(e) => handleAddToCart(e, product)}
              onBuyNow={(e) => handleBuyNow(e, product)}
              onQuickView={() => setQuickViewProduct(product)}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

function ProductCardItem({
  product,
  currency,
  t,
  onAddToCart,
  onBuyNow,
  onQuickView,
}: {
  product: Product;
  currency: any;
  t: any;
  onAddToCart: (e: React.MouseEvent) => void;
  onBuyNow: (e: React.MouseEvent) => void;
  onQuickView: () => void;
}) {
  const hasImage = Boolean(product.images?.[0] && !product.images[0].includes('placeholder'));
  const [imgError, setImgError] = useState(false);

  const stockCount = product.availableCount ?? 1;

  return (
    <div
      onClick={onQuickView}
      className="group rounded-2xl bg-white dark:bg-[#111114] border border-zinc-200 dark:border-zinc-800/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top Image or Placeholder Area */}
        <div className="relative w-full aspect-[4/3] bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center overflow-hidden border-b border-zinc-200 dark:border-zinc-800/80">
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

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/85 text-white text-[11px] font-bold backdrop-blur-md shadow-xs">
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>{t('autoDelivery')}</span>
            </span>

            {stockCount > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-black/75 text-emerald-400 text-[10px] font-extrabold backdrop-blur-md">
                {t('stockCount', { count: stockCount > 999 ? '999+' : stockCount })}
              </span>
            )}
          </div>

          {/* Quick View Button on Hover */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView();
            }}
            className="absolute top-3 right-3 p-2 rounded-xl bg-black/70 hover:bg-zinc-800 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 shadow-md"
            title={t('quickView')}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content Info */}
        <div className="p-4 space-y-2">
          {/* Category Tag */}
          <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
            {product.category?.name || 'Digital Resource'}
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-2 leading-snug group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
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

      {/* Actions Footer - Buttons matching Image 1 exactly! */}
      <div className="px-4 pb-4 pt-1 flex items-center gap-2">
        {/* Button 1: Dark Grey / Black [🛒 Thêm vào giỏ] */}
        <button
          onClick={onAddToCart}
          className="flex-1 py-2 px-3 rounded-xl bg-[#121215] dark:bg-[#121215] hover:bg-[#1C1C22] dark:hover:bg-[#1C1C22] text-white border border-[#27272E] dark:border-[#27272E] text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-xs"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>{t('addToCart')}</span>
        </button>

        {/* Button 2: Crisp Light Grey / White [→ Mua] */}
        <button
          onClick={onBuyNow}
          className="py-2 px-4 rounded-xl bg-white hover:bg-zinc-100 dark:bg-white dark:hover:bg-zinc-100 text-zinc-950 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
        >
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{t('buy')}</span>
        </button>
      </div>
    </div>
  );
}
