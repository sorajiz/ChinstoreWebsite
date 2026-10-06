'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, Zap, ShieldCheck } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Product } from '@/types';
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
      className="group relative rounded-2xl p-[1px] bg-white/[0.05] hover:bg-gradient-to-b hover:from-brand-primary/40 hover:via-white/[0.08] hover:to-transparent transition-all duration-300 cursor-pointer"
    >
      <div className="relative h-full flex flex-col justify-between rounded-[15px] bg-[#0B0D14]/90 backdrop-blur-xl p-4 overflow-hidden border border-white/[0.04]">
        
        {/* Khung Ảnh Sản Phẩm */}
        <div className="relative w-full h-48 rounded-xl overflow-hidden bg-slate-950">
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
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D14] via-transparent to-transparent opacity-60" />

          {/* Badges Tinh Tế */}
          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-medium text-slate-300">
            {category}
          </div>

          <div
            className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full backdrop-blur-md text-[11px] font-semibold border ${
              stock > 0 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}
          >
            {stock > 0 ? `Còn ${stock}` : 'Hết hàng'}
          </div>
        </div>

        {/* Nội Dung Sản Phẩm */}
        <div className="mt-4 flex-1">
          <h3 className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
            {name}
          </h3>
          <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {product?.description || 'Nhận thông tin ngay lập tức trên màn hình sau khi quét VietQR hoặc thanh toán LTC.'}
          </p>

          <div className="mt-4 flex items-baseline justify-between pt-3 border-t border-white/[0.04]">
            <span className="text-xs text-slate-500 font-medium">Đơn giá</span>
            <div className="text-lg font-bold text-white tracking-tight">
              {priceVND.toLocaleString('vi-VN')} <span className="text-xs text-slate-400 font-normal">VND</span>
            </div>
          </div>
        </div>

        {/* Nút Hành Động Uiverse Button */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button 
            onClick={handleAddToCart}
            disabled={stock <= 0}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs font-semibold text-slate-300 hover:text-white transition-all active:scale-95 disabled:opacity-40"
          >
            <ShoppingBag className="w-3.5 h-3.5"/>
            Giỏ Hàng
          </button>
          
          <button 
            onClick={handleBuyNow}
            disabled={stock <= 0}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-brand-primary hover:bg-indigo-500 text-xs font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all active:scale-95 disabled:opacity-40"
          >
            <Zap className="w-3.5 h-3.5"/>
            Mua Ngay
          </button>
        </div>

      </div>
    </div>
  );
}

export default ProductCard;
