'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Tag,
  ShoppingCart,
  Check,
  Star,
  BarChart2,
  Heart,
  ExternalLink,
  Laptop,
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useStore } from '@/lib/store';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductCardProps {
  product?: Product;
  onQuickCheckout?: (product: Product) => void;
  id?: string;
  name?: string;
  category?: string;
  priceVND?: number;
  stock?: number;
  image?: string;
}

// Pixel Minecraft Totem of Undying sprite badge matching Image 2 (Đồng bộ Theme)
function TotemBadge() {
  return (
    <div
      className="w-6 h-7 rounded-md bg-zinc-100 border border-zinc-200/90 dark:bg-[#132030] dark:border-[#223d5a] flex items-center justify-center shadow-2xs transition-colors"
      title="Totem of Undying"
    >
      <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
        <rect x="5" y="2" width="6" height="5" fill="#FACC15" />
        <rect x="6" y="3" width="1.5" height="1.5" fill="#10B981" />
        <rect x="8.5" y="3" width="1.5" height="1.5" fill="#10B981" />
        <rect x="3" y="7" width="10" height="2" fill="#F59E0B" />
        <rect x="6" y="9" width="4" height="4" fill="#D97706" />
        <rect x="5" y="13" width="6" height="2" fill="#B45309" />
      </svg>
    </div>
  );
}

// Pixel Minecraft Grass Block sprite badge matching Image 2 (Đồng bộ Theme)
function GrassBlockBadge() {
  return (
    <div
      className="w-6 h-7 rounded-md bg-zinc-100 border border-zinc-200/90 dark:bg-[#132030] dark:border-[#223d5a] flex items-center justify-center shadow-2xs transition-colors"
      title="Grass Block"
    >
      <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
        <rect x="2" y="2" width="12" height="4" fill="#22C55E" />
        <rect x="3" y="6" width="3" height="2" fill="#16A34A" />
        <rect x="9" y="6" width="2" height="1.5" fill="#16A34A" />
        <rect x="2" y="6" width="12" height="8" fill="#78350F" />
        <rect x="4" y="9" width="2" height="2" fill="#92400E" />
        <rect x="10" y="10" width="2" height="2" fill="#92400E" />
      </svg>
    </div>
  );
}

export function ProductCard({
  product,
  onQuickCheckout,
  id: propId,
  name: propName,
  category: propCategory,
  priceVND: propPriceVND,
  stock: propStock,
  image: propImage,
}: ProductCardProps) {
  const { addItem, setQuickViewProduct, currency } = useStore();
  const locale = useLocale();
  const isEn = locale === 'en';

  const id = product?.id || propId || '';
  const name = product?.name || propName || 'Sản phẩm số';
  const category = product?.category?.name || propCategory || 'Tài khoản';
  const priceVND = product?.priceVND ?? propPriceVND ?? 0;
  const stock = product?.availableCount ?? propStock ?? 0;

  // Xác định xem đây có phải là Acc MFA (Minecraft) hay sản phẩm thông thường
  const slug = product?.slug || '';
  const isMinecraft =
    name.toLowerCase().includes('minecraft') ||
    name.toLowerCase().includes('hypixel') ||
    name.toLowerCase().includes('optifine') ||
    name.toLowerCase().includes('badlion') ||
    product?.category?.slug === 'minecraft-alts';

  // Xác định ảnh hiển thị
  let defaultImage = product?.images?.[0] || propImage || '';
  if (isMinecraft) {
    if (slug.includes('hypixel')) {
      defaultImage = '/images/minecraft/hypixel-mvp.jpg';
    } else if (slug.includes('optifine') || slug.includes('cape')) {
      defaultImage = '/images/minecraft/optifine-cape.jpg';
    } else {
      defaultImage = '/images/minecraft/skin-suit.jpg';
    }
  }

  const [imgSrc, setImgSrc] = useState(defaultImage);
  const [imgError, setImgError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Masked nickname chuẩn ảnh 2
  let maskedName = 'RA******M';
  let rankBadge = 'NON';
  if (slug.includes('hypixel')) {
    maskedName = 'HY******MVP';
    rankBadge = 'MVP+';
  } else if (slug.includes('optifine') || slug.includes('cape')) {
    maskedName = 'MC******CAPE';
    rankBadge = 'CAPE';
  } else if (isMinecraft) {
    maskedName = 'RA******M';
    rankBadge = 'NON';
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const itemToAdd: Product = product || ({
      id,
      name,
      slug: id,
      description: '',
      priceVND,
      price: priceVND,
      availableCount: stock,
      images: [imgSrc],
    } as Product);

    addItem(itemToAdd, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);

    toast.success(isEn ? `Added to cart: ${name}` : `Đã thêm vào giỏ: ${name}`);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    const targetProduct: Product = product || ({
      id,
      name,
      slug: id,
      description: '',
      priceVND,
      price: priceVND,
      availableCount: stock,
      images: [imgSrc],
    } as Product);

    addItem(targetProduct, 1);
    if (onQuickCheckout) {
      onQuickCheckout(targetProduct);
    }
  };

  const handleOpenDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product) {
      setQuickViewProduct(product);
    }
  };

  /* =========================================================================
     1. GIAO DIỆN ACC MFA (MINECRAFT) - ĐỒNG BỘ 100% THEME TỐI OBSIDIAN CHUẨN WEBSITE
     ========================================================================= */
  if (isMinecraft) {
    return (
      <div
        onClick={handleOpenDetail}
        className="group relative rounded-2xl sm:rounded-3xl bg-white dark:bg-[#111114] border border-zinc-200/90 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700/90 p-3.5 sm:p-4 shadow-xs hover:shadow-xl dark:shadow-none transition-all duration-300 cursor-pointer flex flex-col justify-between"
      >
        <div>
          {/* Header trên ảnh: • AVAILABLE | ⭐ 5.0 | [📊] [🤍] Đồng bộ Theme Tối Chuẩn */}
          <div className="flex items-center justify-between gap-1.5 pb-2.5 z-10">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Badge 1: AVAILABLE */}
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-200/80 dark:bg-[#18181c] dark:text-emerald-400 dark:border-zinc-800 text-[10px] sm:text-[11px] font-bold tracking-wider flex items-center gap-1 shadow-2xs transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-emerald-400 animate-pulse" />
                AVAILABLE
              </span>

              {/* Badge 2: ⭐ 5.0 */}
              <span className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-600 border border-amber-200/80 dark:bg-[#18181c] dark:text-amber-400 dark:border-zinc-800 text-[10px] sm:text-[11px] font-bold flex items-center gap-1 shadow-2xs transition-colors">
                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400" />
                5.0
              </span>
            </div>

            {/* Các icon bên phải: Thống kê & Yêu thích */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toast.info('Tỉ lệ uy tín: 100% tài khoản sạch');
                }}
                className="w-7 h-7 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-emerald-600 border border-zinc-200 dark:bg-[#18181c] dark:border-zinc-800 dark:text-emerald-400 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center cursor-pointer"
                title="Độ uy tín"
              >
                <BarChart2 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFavorited(!isFavorited);
                }}
                className="w-7 h-7 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-500 border border-zinc-200 dark:bg-[#18181c] dark:border-zinc-800 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center cursor-pointer"
                title="Yêu thích"
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    isFavorited ? 'fill-rose-500 text-rose-500' : ''
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Khung nhân vật Minecraft 3D & Giá tiền pill góc phải chuẩn ảnh */}
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-zinc-100 dark:bg-[#161619] border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-center transition-colors">
            {imgSrc && !imgError ? (
              <Image
                src={imgSrc}
                alt={name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                onError={() => setImgError(true)}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex items-center justify-center text-zinc-400 dark:text-zinc-600">
                <Tag className="w-12 h-12 stroke-[1.5]" />
              </div>
            )}

            {/* Tag Rank góc dưới bên trái ảnh (NON / MVP+ / CAPE) */}
            <div className="absolute bottom-2 left-2 pointer-events-none">
              <span className="text-xs sm:text-sm font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-black/40 backdrop-blur-xs">
                {rankBadge}
              </span>
            </div>

            {/* Giá tiền Pill góc dưới bên phải */}
            <div className="absolute bottom-2 right-2 pointer-events-none">
              <span className="px-2.5 py-1 rounded-xl bg-white text-zinc-950 dark:bg-white dark:text-zinc-950 font-black text-xs sm:text-sm font-mono shadow-xl flex items-center gap-0.5 border border-black/5">
                {formatPrice(priceVND, currency)}
              </span>
            </div>
          </div>

          {/* Thông tin tài khoản: RA******M | 48m ago + Sprite item badges */}
          <div className="pt-3 pb-1 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-zinc-950 dark:text-white font-mono tracking-wide">
                {maskedName}
              </h3>
              <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">48m ago</span>
            </div>

            {/* Hàng Sprite Badges Minecraft (Totem & Grass Block) */}
            <div className="flex items-center gap-1.5">
              <TotemBadge />
              <GrassBlockBadge />
              <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 pl-1">
                Full Access (FA)
              </span>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-1 leading-snug">
              {name}
            </p>
          </div>
        </div>

        {/* Nút thao tác: [ ↗ View ] và [ 🛒 ] icon */}
        <div className="flex items-center gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
          <button
            onClick={handleOpenDetail}
            className="flex-1 py-2.5 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200 dark:bg-[#18181c] dark:hover:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-800 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-98"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View</span>
          </button>

          <button
            onClick={handleAddToCart}
            className="w-10 h-10 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 dark:bg-[#18181c] dark:hover:bg-zinc-800 dark:text-zinc-200 dark:hover:text-white dark:border-zinc-800 flex items-center justify-center transition-all cursor-pointer active:scale-95 shrink-0 shadow-xs"
            title="Thêm vào giỏ hàng"
          >
            {isAdded ? (
              <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================================
     2. GIAO DIỆN SẢN PHẨM KHÁC (NITRO & DECO, MMO, MISC)
     (Đã xóa badge Nạp tự động theo yêu cầu Ảnh 2; Chọn gói, -> Mua)
     ========================================================================= */
  return (
    <div
      onClick={handleOpenDetail}
      className="group relative rounded-2xl sm:rounded-3xl bg-white dark:bg-[#111114] border border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700/90 p-4 sm:p-5 shadow-xs hover:shadow-xl dark:shadow-none transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Khung Ảnh / Icon to và bự (Đã gỡ badge Nạp tự động theo yêu cầu Ảnh 2) */}
        <div className="relative w-full h-40 sm:h-48 rounded-xl sm:rounded-2xl bg-zinc-100/90 dark:bg-[#161619] border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden flex items-center justify-center mb-3.5">
          {imgSrc && !imgError ? (
            <Image
              src={imgSrc}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              onError={() => setImgError(true)}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600">
              <Laptop className="w-12 h-12 stroke-[1.5] opacity-50" />
            </div>
          )}
        </div>

        {/* Thông tin sản phẩm: category nhỏ xám + tiêu đề đậm */}
        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 lowercase">
            {category}
          </div>
          <h3 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white line-clamp-2 leading-snug min-h-[2.8rem]">
            {name}
          </h3>
        </div>
      </div>

      {/* Giá tiền: Từ XX.XXX VNĐ + Nút [ Chọn gói ] và [ → Mua ] */}
      <div className="pt-3 space-y-3">
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            Từ
          </span>
          <span className="text-base sm:text-lg font-black text-zinc-950 dark:text-white font-mono tracking-tight">
            {formatPrice(priceVND, currency)}
          </span>
        </div>

        {/* 2 nút: [ Chọn gói ] và [ → Mua ] */}
        <div className="grid grid-cols-2 gap-2">
          {/* Nút 1: Chọn gói */}
          <button
            onClick={handleOpenDetail}
            className="py-2.5 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-[#1a1a1e] dark:hover:bg-[#25252a] text-zinc-900 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm font-bold text-center transition-all cursor-pointer shadow-2xs active:scale-98"
          >
            {isEn ? 'Options' : 'Chọn gói'}
          </button>

          {/* Nút 2: → Mua */}
          <button
            onClick={handleBuyNow}
            className="py-2.5 px-3 rounded-xl bg-zinc-950 hover:bg-zinc-850 text-white dark:bg-[#f2efe9] dark:hover:bg-white dark:text-zinc-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-98"
          >
            <span>→</span>
            <span>{isEn ? 'Buy' : 'Mua'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
