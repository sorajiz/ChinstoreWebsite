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
  Zap,
  Wrench,
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/navigation';
import { useSession } from 'next-auth/react';
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
  const { data: session } = useSession();
  const {
    addItem,
    setQuickViewProduct,
    setViewMfaProduct,
    setAuthModalOpen,
    currency,
  } = useStore();
  const router = useRouter();
  const locale = useLocale();
  const isEn = locale === 'en';

  const id = product?.id || propId || '';
  const name = product?.name || propName || (isEn ? 'Digital Product' : 'Sản phẩm số');
  const category = product?.category?.name || propCategory || (isEn ? 'Account' : 'Tài khoản');
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

  const isOutOfStock = stock <= 0;

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
  let maskedName = 'Sa*******9';
  let rankBadge = 'NON';
  if (slug.includes('hypixel')) {
    maskedName = 'HY******MVP';
    rankBadge = 'MVP+';
  } else if (slug.includes('optifine') || slug.includes('cape')) {
    maskedName = 'MC******CAPE';
    rankBadge = 'CAPE';
  } else if (isMinecraft) {
    maskedName = 'Sa*******9';
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
    if (!session?.user) {
      toast.info(isEn ? 'Please login with Discord to proceed with checkout!' : 'Vui lòng đăng nhập Discord để tiếp tục thanh toán và nhận tài khoản tức thì!');
      router.push('/login');
      return;
    }

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

  const handleOpenDetail = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
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

    if (isMinecraft) {
      setViewMfaProduct(targetProduct);
    } else {
      setQuickViewProduct(targetProduct);
    }
  };

  /* =========================================================================
     1. GIAO DIỆN ACC MFA (MINECRAFT) - ĐỒNG BỘ 100% THEME TỐI OBSIDIAN CHUẨN WEBSITE
     ========================================================================= */
  if (isMinecraft) {
    return (
      <div
        onClick={handleOpenDetail}
        className="group relative rounded-2xl sm:rounded-3xl bg-white dark:bg-[#111114] border border-zinc-200/90 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700/90 p-2.5 sm:p-4 shadow-xs hover:shadow-xl dark:shadow-none transition-all duration-300 cursor-pointer flex flex-col justify-between"
      >
        <div>
          {/* Header trên ảnh: • AVAILABLE | ⭐ 5.0 | [🤍] */}
          <div className="flex items-center justify-between gap-1 pb-2 z-10">
            <div className="flex items-center gap-1 flex-wrap">
              {/* Badge 1: AVAILABLE */}
              <span className="px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-200/80 dark:bg-[#18181c] dark:text-emerald-400 dark:border-zinc-800 text-[9px] sm:text-[10px] font-bold tracking-wider flex items-center gap-1 shadow-2xs transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-emerald-400 animate-pulse" />
                {isEn ? 'AVAILABLE' : 'CÒN HÀNG'}
              </span>

              {/* Badge 2: ⭐ 5.0 */}
              <span className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-600 border border-amber-200/80 dark:bg-[#18181c] dark:text-amber-400 dark:border-zinc-800 text-[9px] sm:text-[10px] font-bold flex items-center gap-0.5 shadow-2xs transition-colors">
                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400" />
                5.0
              </span>
            </div>

            {/* Icon Yêu thích */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorited(!isFavorited);
              }}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-500 border border-zinc-200 dark:bg-[#18181c] dark:border-zinc-800 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center cursor-pointer shrink-0"
              title={isEn ? 'Favorite' : 'Yêu thích'}
            >
              <Heart
                className={`w-3 h-3 ${
                  isFavorited ? 'fill-rose-500 text-rose-500' : ''
                }`}
              />
            </button>
          </div>

          {/* Khung nhân vật Minecraft 3D & Giá tiền pill góc phải chuẩn ảnh */}
          <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-100 dark:bg-[#161619] border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-center transition-colors">
            {imgSrc && !imgError ? (
              <Image
                src={imgSrc}
                alt={name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                onError={() => setImgError(true)}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex items-center justify-center text-zinc-400 dark:text-zinc-600">
                <Tag className="w-10 h-10 stroke-[1.5]" />
              </div>
            )}

            {/* Tag Rank góc dưới bên trái ảnh (NON / MVP+ / CAPE) */}
            <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 pointer-events-none">
              <span className="text-[10px] sm:text-xs font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-black/50 backdrop-blur-xs">
                {rankBadge}
              </span>
            </div>

            {/* Giá tiền Pill góc dưới bên phải */}
            <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 pointer-events-none">
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl bg-white text-zinc-950 dark:bg-white dark:text-zinc-950 font-black text-[10px] sm:text-xs font-mono shadow-md flex items-center border border-black/5">
                {formatPrice(priceVND, currency)}
              </span>
            </div>
          </div>

          {/* Thông tin tài khoản: RA******M | 48m ago + Sprite item badges */}
          <div className="pt-2 sm:pt-3 pb-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-black text-zinc-950 dark:text-white font-mono tracking-wide truncate">
                {maskedName}
              </h3>
              <span className="text-[10px] sm:text-xs font-mono text-zinc-500 dark:text-zinc-400">
                {isEn ? '48m ago' : '48 phút trước'}
              </span>
            </div>

            {/* Hàng Sprite Badges Minecraft (Totem & Grass Block) */}
            <div className="flex items-center gap-1 flex-wrap">
              <TotemBadge />
              <GrassBlockBadge />
              <span className="text-[10px] sm:text-[11px] font-mono text-zinc-500 dark:text-zinc-400 pl-0.5">
                FA
              </span>
            </div>

            <p className="text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-400 line-clamp-1 leading-snug">
              {name}
            </p>
          </div>
        </div>

        {/* Nút thao tác: [ ↗ View ] và [ 🛒 ] icon */}
        <div className="flex items-center gap-1.5 pt-2 sm:pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
          <button
            type="button"
            onClick={handleOpenDetail}
            className="flex-1 py-2 sm:py-2.5 px-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200 dark:bg-[#18181c] dark:hover:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-800 text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer active:scale-98"
          >
            <ExternalLink className="w-3 h-3" />
            <span>{isEn ? 'View' : 'Xem'}</span>
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 dark:bg-[#18181c] dark:hover:bg-zinc-800 dark:text-zinc-200 dark:hover:text-white dark:border-zinc-800 flex items-center justify-center transition-all cursor-pointer active:scale-95 shrink-0 shadow-xs"
            title={isEn ? 'Add to cart' : 'Thêm vào giỏ hàng'}
          >
            {isAdded ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <ShoppingCart className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================================
     2. GIAO DIỆN SẢN PHẨM KHÁC (NITRO & DECO, MMO, MISC)
     Hiển thị 2 labels cùng lúc trên ảnh: [⚡ Giao/Nạp tự động] và [Còn X / Hết hàng] chuẩn Ảnh 2
     ========================================================================= */
  return (
    <div
      onClick={handleOpenDetail}
      className="group relative rounded-2xl sm:rounded-3xl bg-white dark:bg-[#111114] border border-zinc-200/90 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700/90 p-2.5 sm:p-4 md:p-5 shadow-xs hover:shadow-xl dark:shadow-none transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Khung Ảnh vuông với 2 Labels ở góc trên bên trái chuẩn Ảnh 2 */}
        <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl bg-zinc-100/90 dark:bg-[#161619] border border-zinc-200/70 dark:border-zinc-800/70 overflow-hidden flex items-center justify-center mb-2.5 sm:mb-3">
          {imgSrc && !imgError ? (
            <Image
              src={imgSrc}
              alt={name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setImgError(true)}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600">
              <Laptop className="w-10 h-10 sm:w-12 sm:h-12 stroke-[1.5] opacity-50" />
            </div>
          )}
        </div>

        {/* Thông tin sản phẩm: Category xám + Tiêu đề */}
        <div className="space-y-1 sm:space-y-1.5">
          <div className="text-[11px] sm:text-xs font-semibold text-zinc-400 dark:text-zinc-500 capitalize truncate">
            {category}
          </div>
          <h3 className="text-xs sm:text-sm md:text-base font-bold text-zinc-950 dark:text-white line-clamp-2 leading-snug min-h-[2rem] sm:min-h-[2.5rem]">
            {name}
          </h3>
        </div>
      </div>

      {/* Giá tiền & Các nút bấm */}
      <div className="pt-2 sm:pt-3 space-y-2 sm:space-y-2.5">
        <div className="flex items-baseline justify-between gap-1">
          <div className="flex items-baseline gap-1">
            <span className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              {isEn ? 'From' : 'Từ'}
            </span>
            <span className="text-sm sm:text-base md:text-lg font-black text-zinc-950 dark:text-white font-mono tracking-tight">
              {formatPrice(priceVND, currency)}
            </span>
          </div>

          {/* Tình trạng kho: In Stock / Out of Stock (Còn hàng / Hết hàng) */}
          <div className={`text-[10px] sm:text-xs font-semibold flex items-center gap-1 ${
            !isOutOfStock ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${!isOutOfStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <span>
              {!isOutOfStock
                ? (isEn ? 'In Stock' : 'Còn hàng')
                : (isEn ? 'Out of Stock' : 'Hết hàng')}
            </span>
          </div>
        </div>

        {/* 2 nút thao tác chuẩn: [ Chọn Gói ] và [ Mua Ngay ] */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
          {/* Nút 1: Chọn Gói */}
          <button
            type="button"
            onClick={handleOpenDetail}
            className="py-1.5 sm:py-2.5 px-1 sm:px-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-[#1a1a1e] dark:hover:bg-[#25252a] text-zinc-900 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 text-[10px] sm:text-xs font-bold text-center transition-all cursor-pointer shadow-2xs active:scale-98 whitespace-nowrap"
          >
            {isEn ? 'Options' : 'Chọn Gói'}
          </button>

          {/* Nút 2: Mua Ngay */}
          <button
            type="button"
            onClick={isOutOfStock ? undefined : handleBuyNow}
            disabled={isOutOfStock}
            className={`py-1.5 sm:py-2.5 px-1 sm:px-2 rounded-xl font-bold text-[10px] sm:text-xs flex items-center justify-center gap-1 transition-all shadow-xs whitespace-nowrap ${
              isOutOfStock
                ? 'bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500 cursor-not-allowed'
                : 'bg-zinc-950 hover:bg-zinc-850 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 cursor-pointer active:scale-98'
            }`}
          >
            <span>{isOutOfStock ? (isEn ? 'Sold out' : 'Hết hàng') : (isEn ? 'Buy Now' : 'Mua Ngay')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
