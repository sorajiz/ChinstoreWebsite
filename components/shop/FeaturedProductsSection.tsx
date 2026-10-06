'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Link } from '@/navigation';
import { useStore } from '@/lib/store';
import { Product, Category } from '@/types';
import { formatPrice } from '@/lib/utils';
import {
  ShoppingBag,
  Zap,
  Tag,
  AppWindow,
  LayoutGrid,
  Eye,
  Check,
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
      icon: <ShoppingBag className="w-4 h-4 text-[#5865F2]" />,
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
        
        {/* Section Header (Exact Match to Image 3 & Image 4) */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider">
            — Cửa hàng
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
              Bảng giá sản phẩm
            </h2>

            {/* Total Products Pill (from Image 3 & 4) */}
            <div className="px-3.5 py-1.5 rounded-xl border border-[#DDD8CE] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-xs font-semibold text-slate-700 dark:text-slate-300 w-fit shadow-sm">
              <span className="font-bold">{products.length}</span> sản phẩm
            </div>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Tìm món cần mua, xem giá và chọn gói phù hợp. Hàng tự động sẽ hiện trong tài khoản ngay sau khi thanh toán.
          </p>
        </div>

        {/* Category Filter Pills (Exact Match to Image 3 & Image 4 - No search bar as requested) */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none pt-2">
          {/* All Category Pill */}
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 shadow-sm ${
              selectedCategory === 'all'
                ? 'bg-[#18181B] text-white dark:bg-white dark:text-[#18181B]'
                : 'bg-white dark:bg-[#18181B] text-slate-600 dark:text-slate-400 border border-[#E5E1D8] dark:border-[#27272A] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Tất cả</span>
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
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 shadow-sm ${
                  isSelected
                    ? 'bg-[#18181B] text-white dark:bg-white dark:text-[#18181B]'
                    : 'bg-white dark:bg-[#18181B] text-slate-600 dark:text-slate-400 border border-[#E5E1D8] dark:border-[#27272A] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[11px] opacity-75">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Products Grid (Exact Match to Image 3 & Image 4) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
          {filteredProducts.map((product) => (
            <ProductCardItem
              key={product.id}
              product={product}
              currency={currency}
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
  onAddToCart,
  onBuyNow,
  onQuickView,
}: {
  product: Product;
  currency: any;
  onAddToCart: (e: React.MouseEvent) => void;
  onBuyNow: (e: React.MouseEvent) => void;
  onQuickView: () => void;
}) {
  const hasImage = Boolean(product.images?.[0] && !product.images[0].includes('placeholder'));
  const [imgError, setImgError] = useState(false);

  const stockCount = product.availableCount ?? 1;
  const isAuto = true; // All items in chinstore are instant delivery

  return (
    <div
      onClick={onQuickView}
      className="group rounded-2xl bg-white dark:bg-[#18181B] border border-[#E5E1D8] dark:border-[#27272A] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top Image or Placeholder Area (Matches Image 3 & 4) */}
        <div className="relative w-full aspect-[4/3] bg-[#EFECE5] dark:bg-[#202024] flex items-center justify-center overflow-hidden border-b border-[#E5E1D8] dark:border-[#27272A]">
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
            <div className="flex items-center justify-center text-slate-400 dark:text-slate-500">
              {product.category?.slug === 'discord' ? (
                <AppWindow className="w-12 h-12 stroke-[1.2]" />
              ) : (
                <Tag className="w-12 h-12 stroke-[1.2]" />
              )}
            </div>
          )}

          {/* Top Badges (like "⚡ Giao tự động" & "Còn 17" in Image 3 & 4) */}
          <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/85 dark:bg-black/85 text-white text-[11px] font-bold backdrop-blur-md shadow-sm">
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>Giao tự động</span>
            </span>

            {stockCount > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-black/75 dark:bg-black/75 text-emerald-400 text-[10px] font-extrabold backdrop-blur-md">
                Còn {stockCount > 999 ? '999+' : stockCount}
              </span>
            )}
          </div>

          {/* Quick View Button on Hover */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView();
            }}
            className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-[#5865F2] text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 shadow-md"
            title="Xem nhanh"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content Info (Matches Image 3 & 4) */}
        <div className="p-4 space-y-2">
          {/* Category Tag */}
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {product.category?.name || 'Tài khoản'}
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-[#5865F2] dark:group-hover:text-indigo-400 transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="text-base font-extrabold text-slate-900 dark:text-white pt-1">
            {formatPrice(product.priceVND, currency)}
          </div>

          {/* Stock Count (Green Text from Image 3 & 4) */}
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            Còn {product.availableCount ?? 1.060} sản phẩm
          </div>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="px-4 pb-4 pt-1 flex items-center gap-2">
        <button
          onClick={onAddToCart}
          className="flex-1 py-2 px-3 rounded-xl border border-[#E5E1D8] dark:border-[#27272A] bg-[#EFECE5]/50 dark:bg-[#202024]/50 hover:bg-[#E5E0D5] dark:hover:bg-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all flex items-center justify-center gap-1.5"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-[#5865F2]" />
          <span>Thêm giỏ</span>
        </button>

        <button
          onClick={onBuyNow}
          className="py-2 px-3.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Mua ngay</span>
        </button>
      </div>
    </div>
  );
}

