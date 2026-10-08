'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { useSession } from 'next-auth/react';
import { Link, useRouter } from '@/navigation';
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
} from 'lucide-react';
import RollingArrowButton from '@/components/ui/RollingArrowButton';
import { toast } from 'sonner';

interface FeaturedProductsSectionProps {
  products: Product[];
  categories: Category[];
  onQuickCheckout?: (product: Product) => void;
  activeCategory?: string;
  onResetCategory?: () => void;
}

export default function FeaturedProductsSection({
  products,
  categories,
  onQuickCheckout,
  activeCategory = 'all',
  onResetCategory,
}: FeaturedProductsSectionProps) {
  const router = useRouter();
  const t = useTranslations('featuredProducts');
  const locale = useLocale();
  const isEn = locale === 'en';
  const { data: session } = useSession();
  const {
    currency,
    addItem,
    setQuickViewProduct,
    setViewMfaProduct,
    setAuthModalOpen,
  } = useStore();

  const filteredProducts = useMemo(() => {
    if (!activeCategory || activeCategory === 'all') {
      return products;
    }
    const cat = activeCategory.toLowerCase();
    const result = products.filter((p) => {
      const slug = (p.category?.slug || '').toLowerCase();
      const name = (p.name || '').toLowerCase();
      if (slug === cat || slug.includes(cat) || cat.includes(slug)) return true;
      if (cat === 'gaming-accounts' && (slug.includes('game') || slug.includes('acc') || name.includes('game') || name.includes('steam') || name.includes('valorant'))) return true;
      if (cat === 'discord-services' && (slug.includes('discord') || name.includes('nitro') || name.includes('boost'))) return true;
      if (cat === 'streaming-vpn' && (slug.includes('stream') || name.includes('netflix') || name.includes('spotify') || name.includes('youtube') || name.includes('vpn'))) return true;
      if (cat === 'minecraft-alts' && (slug.includes('minecraft') || name.includes('hypixel') || name.includes('optifine'))) return true;
      return false;
    });
    return result.length > 0 ? result : products;
  }, [products, activeCategory]);

  const handleBuyNow = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (!session?.user) {
      toast.info(isEn ? 'Please login with Discord to proceed with checkout!' : 'Vui lòng đăng nhập Discord để tiếp tục thanh toán và nhận tài khoản tức thì!');
      router.push('/login');
      return;
    }
    addItem(product, 1);
    if (onQuickCheckout) {
      onQuickCheckout(product);
    }
  };

  const handleOpenProduct = (product: Product) => {
    const isMinecraft =
      product.name.toLowerCase().includes('minecraft') ||
      product.name.toLowerCase().includes('hypixel') ||
      product.name.toLowerCase().includes('optifine') ||
      product.category?.slug === 'minecraft-alts';

    if (isMinecraft) {
      setViewMfaProduct(product);
    } else {
      setQuickViewProduct(product);
    }
  };

  return (
    <section id="featured-products" data-sora-opt="content" className="py-12 sm:py-16 relative z-10 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
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

        {/* Product Cards Grid: 4 thẻ thịnh hành chuẩn trang chủ */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.slice(0, 4).map((product, idx) => (
            <ProductCardItem
              key={product.id}
              product={product}
              index={idx}
              currency={currency}
              isEn={isEn}
              onBuyNow={(e) => handleBuyNow(e, product)}
              onQuickView={() => handleOpenProduct(product)}
            />
          ))}
        </div>

        {/* Bottom Status Bar (Đã bỏ nút Làm Mới theo yêu cầu Ảnh 2) */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 pt-4 border-t border-zinc-200 dark:border-zinc-800/80 gap-3">
          <span>{t('publicPricing')}</span>
        </div>

      </div>
    </section>
  );
}

// Single Product Card Component matching Image 3 & Image 1
function ProductCardItem({
  product,
  index,
  currency,
  isEn,
  onBuyNow,
  onQuickView,
}: {
  product: Product;
  index: number;
  currency: any;
  isEn: boolean;
  onBuyNow: (e: React.MouseEvent) => void;
  onQuickView: () => void;
}) {
  const hasImage = Boolean(product.images?.[0] && !product.images[0].includes('placeholder'));
  const [imgError, setImgError] = useState(false);

  const stockCount = product.availableCount ?? 1;

  return (
    <div
      onClick={onQuickView}
      className="group rounded-2xl sm:rounded-3xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-[#27272A] overflow-hidden shadow-xs hover:shadow-xl hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top Image Box (Đã bỏ icon con mắt theo yêu cầu) */}
        <div className="relative w-full aspect-[4/3] bg-zinc-100 dark:bg-[#18181C] flex items-center justify-center overflow-hidden border-b border-zinc-200 dark:border-[#27272A]">

          {hasImage && !imgError ? (
            <Image
              src={product.images![0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
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
        </div>

        {/* Content Info */}
        <div className="p-3 sm:p-4 space-y-1.5">
          {/* Category Line */}
          <div className="flex items-center text-[10px] sm:text-[11px] text-zinc-500 dark:text-[#94949E]">
            <span className="font-semibold capitalize truncate">
              {product.category?.name || 'Vật phẩm'}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="text-xs sm:text-sm font-bold text-zinc-950 dark:text-[#F4F4F5] line-clamp-2 leading-snug group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors min-h-[2rem] sm:min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Price */}
          <div className="text-sm sm:text-base font-black text-zinc-950 dark:text-white pt-0.5 font-mono">
            {formatPrice(product.priceVND, currency)}
          </div>

          {/* Stock: In Stock / Out of Stock (Còn hàng / Hết hàng tiếng Việt) */}
          <div className={`text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 pt-0.5 ${
            stockCount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${stockCount > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <span>
              {stockCount > 0
                ? (isEn ? 'In Stock' : 'Còn hàng')
                : (isEn ? 'Out of Stock' : 'Hết hàng')}
            </span>
          </div>
        </div>
      </div>

      {/* 2 Nút thao tác: [ Chọn Gói ] và [ Mua Ngay ] vừa vặn mobile, không phình to (Đã bỏ ô số lượng) */}
      <div className="px-2.5 sm:px-4 pb-2.5 sm:pb-4 pt-1">
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
          {/* Nút 1: Chọn Gói */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView();
            }}
            className="py-2 sm:py-2.5 px-1 sm:px-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-[#1a1a1e] dark:hover:bg-[#25252a] text-zinc-900 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 text-[10px] sm:text-xs font-bold text-center transition-all cursor-pointer active:scale-98 shadow-2xs whitespace-nowrap"
          >
            {isEn ? 'Options' : 'Chọn Gói'}
          </button>

          {/* Nút 2: Mua Ngay */}
          <button
            type="button"
            onClick={onBuyNow}
            className="py-2 sm:py-2.5 px-1 sm:px-2 rounded-xl bg-zinc-950 hover:bg-zinc-850 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-[10px] sm:text-xs font-bold text-center transition-all cursor-pointer active:scale-98 shadow-xs whitespace-nowrap flex items-center justify-center gap-1"
          >
            <span>{isEn ? 'Buy Now' : 'Mua Ngay'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
