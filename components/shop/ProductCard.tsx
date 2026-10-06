'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, ArrowRight, ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useStore } from '@/lib/store';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductCardProps {
  product?: Product;
  onQuickCheckout?: (product: Product) => void;
  // Alternative standalone props
  id?: string;
  name?: string;
  category?: string;
  priceVND?: number;
  stock?: number;
  image?: string;
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
  const t = useTranslations('featuredProducts');

  // Normalize data from either `product` object or direct props
  const id = product?.id || propId || '';
  const name = product?.name || propName || 'Sản phẩm số';
  const category =
    product?.category?.name ||
    propCategory ||
    'Tài nguyên số';
  const priceVND = product?.priceVND ?? propPriceVND ?? 0;
  const stock = product?.availableCount ?? propStock ?? 0;
  const rawImage =
    product?.images?.[0] ||
    propImage ||
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop';

  const [imgSrc, setImgSrc] = useState(rawImage);

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
    toast.success(`${t('addToCart')}: ${name}`, {
      icon: <ShoppingCart className="w-4 h-4 text-emerald-400" />,
    });
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

  return (
    <div 
      onClick={() => product && setQuickViewProduct(product)}
      className="group rounded-2xl bg-white dark:bg-[#121215] border border-[#E5E1D8] dark:border-[#27272A] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div className="relative h-full flex flex-col justify-between p-4">
        
        {/* Khung Ảnh Sản Phẩm */}
        <div className="relative w-full h-48 rounded-xl overflow-hidden bg-[#EFECE5] dark:bg-[#18181C] border border-[#E5E1D8] dark:border-[#27272A]">
          <Image 
            alt={name} 
            fill 
            src={imgSrc}
            sizes="(max-width: 768px) 100vw, 300px" 
            onError={() =>
              setImgSrc(
                'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop'
              )
            }
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[11px] font-medium text-white shadow-sm">
            {category}
          </div>

          <div
            className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full backdrop-blur-md text-[11px] font-semibold border ${
              stock > 0 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
            }`}
          >
            {stock > 0 ? t('stockCount', { count: stock }) : 'Hết hàng'}
          </div>
        </div>

        {/* Nội Dung Sản Phẩm */}
        <div className="mt-4 flex-1">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors line-clamp-1">
            {name}
          </h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {product?.description || 'Instant delivery upon verified VietQR or LTC checkout.'}
          </p>

          <div className="mt-4 flex items-baseline justify-between pt-3 border-t border-[#E5E1D8] dark:border-[#27272A]">
            <span className="text-xs text-zinc-400 font-medium">{t('price')}</span>
            <div className="text-lg font-black text-zinc-900 dark:text-white tracking-tight font-mono">
              {formatPrice(priceVND, currency)}
            </div>
          </div>
        </div>

        {/* Nút Hành Động - Chuẩn Ảnh 1 */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {/* Button 1: Dark Grey / Black [🛒 Thêm vào giỏ] */}
          <button 
            onClick={handleAddToCart}
            disabled={stock <= 0}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#121215] dark:bg-[#18181C] hover:bg-[#202025] dark:hover:bg-[#222228] text-white border border-[#27272E] text-xs font-bold transition-all duration-150 active:scale-95 disabled:opacity-40 shadow-xs cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5 stroke-[2]"/>
            {t('addToCart')}
          </button>
          
          {/* Button 2: Crisp Light Grey / White [→ Mua] */}
          <button 
            onClick={handleBuyNow}
            disabled={stock <= 0}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white hover:bg-zinc-100 dark:bg-[#F4F4F5] dark:hover:bg-zinc-200 text-zinc-950 text-xs font-bold shadow-sm transition-all duration-150 active:scale-95 disabled:opacity-40 cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]"/>
            {t('buy')}
          </button>
        </div>

      </div>
    </div>
  );
}

export default ProductCard;
