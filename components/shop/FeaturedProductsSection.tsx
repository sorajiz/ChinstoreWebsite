'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Link } from '@/navigation';
import { useStore } from '@/lib/store';
import { Product, Category } from '@/types';
import { formatPrice } from '@/lib/utils';
import {
  Flame,
  Zap,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Eye,
  CheckCircle2,
  Lock,
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
      return products.slice(0, 8);
    }
    return products
      .filter((p) => p.category?.slug === selectedCategory)
      .slice(0, 8);
  }, [products, selectedCategory]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addItem(product, 1);
    toast.success(`Đã thêm "${product.name}" vào giỏ hàng!`, {
      icon: <ShoppingBag className="w-4 h-4 text-indigo-400" />,
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
    <section id="featured-products" className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/[0.06]">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-indigo-300 text-xs font-semibold backdrop-blur-md">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>SẢN PHẨM NỔI BẬT • BÁN CHẠY NHẤT</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Kho Tài Nguyên Số <span className="bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">Sẵn Hàng</span>
            </h2>
            <p className="text-sm text-slate-400 max-w-xl">
              Hệ thống kích hoạt và xuất key tự động trong 3 giây. Đầy đủ bảo hành 1 đổi 1 và hỗ trợ kỹ thuật 24/7.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.08] text-sm font-semibold text-slate-200 hover:text-white transition-all group backdrop-blur-md w-fit"
          >
            <span>Xem Toàn Bộ Kho Hàng ({products.length})</span>
            <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-2 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-[0_0_20px_rgba(99,102,241,0.35)]'
                : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.06]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tất Cả ({products.length})</span>
          </button>

          {categories.map((cat) => {
            const count = products.filter((p) => p.category?.slug === cat.slug).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                  selectedCategory === cat.slug
                    ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-[0_0_20px_rgba(99,102,241,0.35)]'
                    : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.1] font-mono">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
  const defaultFallback = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop';
  const initialImage = product.images?.[0] || defaultFallback;
  const [imgSrc, setImgSrc] = useState(initialImage);

  const originalPrice = Math.round(product.priceVND * 1.3);
  const stockCount = product.availableCount ?? 0;

  return (
    <div
      onClick={onQuickView}
      className="group relative rounded-2xl p-[1px] bg-white/[0.06] hover:bg-gradient-to-b hover:from-brand-primary/50 hover:via-indigo-500/20 hover:to-transparent transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div className="relative h-full flex flex-col justify-between rounded-[15px] bg-[#0C0E17]/90 backdrop-blur-xl p-4 overflow-hidden border border-white/[0.04] group-hover:border-transparent transition-colors">
        
        {/* Image Container with Badges */}
        <div className="space-y-3">
          <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 border border-white/[0.06]">
            <Image
              src={imgSrc}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              onError={() => setImgSrc(defaultFallback)}
            />
            
            {/* Gradient overlay on image */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C0E17] via-transparent to-transparent opacity-60" />

            {/* Top Badges */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-md bg-brand-primary/80 backdrop-blur-md text-[10px] font-bold text-white tracking-wide uppercase shadow-sm">
                ⚡ Tức Thì
              </span>
              <span className="px-2 py-0.5 rounded-md bg-red-500/80 backdrop-blur-md text-[10px] font-bold text-white tracking-wide">
                -25%
              </span>
            </div>

            {/* Stock Pill Badge */}
            <div className="absolute bottom-2.5 left-2.5">
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold backdrop-blur-md border ${
                  stockCount > 0
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                    : 'bg-red-950/80 text-red-300 border-red-500/30'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    stockCount > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
                  }`}
                />
                {stockCount > 0 ? `Còn ${stockCount} sẵn sàng` : 'Tạm hết hàng'}
              </span>
            </div>

            {/* Quick View Icon on Image hover */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView();
              }}
              className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 hover:bg-brand-primary text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200"
              title="Xem nhanh chi tiết"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Category & Title */}
          <div>
            <div className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider mb-1">
              {product.category?.name || 'Tài nguyên số'}
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
            <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>

        {/* Price & Actions Footer */}
        <div className="pt-4 mt-4 border-t border-white/[0.06] space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-xs text-slate-500 line-through font-mono">
                {formatPrice(originalPrice, currency)}
              </div>
              <div className="text-lg font-black text-white font-mono tracking-tight text-indigo-300">
                {formatPrice(product.priceVND, currency)}
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              1 Đổi 1
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onAddToCart}
              className="px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.1] text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-indigo-400" />
              <span>Giỏ Hàng</span>
            </button>

            <button
              onClick={onBuyNow}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary hover:brightness-110 text-xs font-semibold text-white transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Mua Ngay</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
