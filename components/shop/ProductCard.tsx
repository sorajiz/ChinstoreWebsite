'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, Zap, ShieldCheck } from 'lucide-react';
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

  // Fallback ảnh game chuẩn, không bao giờ để vỡ ảnh
  const [imgSrc, setImgSrc] = useState(rawImage);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product) {
      addItem(product, 1);
    } else {
      addItem(
        {
          id,
          name,
          slug: id,
          description: '',
          priceVND,
          price: priceVND,
          availableCount: stock,
          images: [imgSrc],
        } as Product,
        1
      );
    }
    toast.success(`Đã thêm "${name}" vào giỏ hàng!`, {
      icon: <ShoppingBag className="w-4 h-4 text-indigo-400" />,
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
      className="group rounded-2xl bg-white dark:bg-[#18181B] border border-[#E5E1D8] dark:border-[#27272A] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div className="relative h-full flex flex-col justify-between p-4">
        
        {/* Khung Ảnh Sản Phẩm */}
        <div className="relative w-full h-48 rounded-xl overflow-hidden bg-[#EFECE5] dark:bg-[#202024] border border-[#E5E1D8] dark:border-[#27272A]">
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

          {/* Badges Tinh Tế */}
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
            {stock > 0 ? `Còn ${stock}` : 'Hết hàng'}
          </div>
        </div>

        {/* Nội Dung Sản Phẩm */}
        <div className="mt-4 flex-1">
          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#5865F2] dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
            {name}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {product?.description || 'Nhận thông tin ngay lập tức trên màn hình sau khi quét VietQR hoặc thanh toán LTC.'}
          </p>

          <div className="mt-4 flex items-baseline justify-between pt-3 border-t border-[#E5E1D8] dark:border-[#27272A]">
            <span className="text-xs text-slate-400 font-medium">Đơn giá</span>
            <div className="text-lg font-black text-slate-900 dark:text-white tracking-tight font-mono">
              {formatPrice(priceVND, currency)}
            </div>
          </div>
        </div>

        {/* Nút Hành Động */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button 
            onClick={handleAddToCart}
            disabled={stock <= 0}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#EFECE5]/60 dark:bg-[#202024] hover:bg-[#E5E0D5] dark:hover:bg-white/10 border border-[#E5E1D8] dark:border-[#27272A] text-xs font-bold text-slate-700 dark:text-slate-200 transition-all active:scale-95 disabled:opacity-40"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#5865F2]"/>
            Giỏ Hàng
          </button>
          
          <button 
            onClick={handleBuyNow}
            disabled={stock <= 0}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-xs font-bold text-white shadow-md transition-all active:scale-95 disabled:opacity-40"
          >
            <Zap className="w-3.5 h-3.5 fill-current"/>
            Mua Ngay
          </button>
        </div>

      </div>
    </div>
  );
}

export default ProductCard;
