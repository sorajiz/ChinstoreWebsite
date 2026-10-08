'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/navigation';
import { useSession } from 'next-auth/react';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import {
  X,
  ShoppingCart,
  Zap,
  CheckCircle2,
  Cpu,
  ArrowRight,
  PackageCheck,
  Tag,
  Laptop,
  QrCode,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';

interface QuickViewModalProps {
  onQuickCheckout?: () => void;
}

export default function QuickViewModal({ onQuickCheckout }: QuickViewModalProps) {
  const router = useRouter();
  const t = useTranslations('shop');
  const tToast = useTranslations('toasts');
  const locale = useLocale();
  const isEn = locale === 'en';
  const { data: session } = useSession();
  const {
    quickViewProduct,
    setQuickViewProduct,
    addItem,
    currency,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    setAuthModalOpen,
  } = useStore();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
    setSelectedImageIdx(0);
    setQuantity(1);
  }, [quickViewProduct?.id]);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [];

  const specs = product.specs || {};
  const currentImg = images[selectedImageIdx] || images[0];
  const stockCount = product.availableCount ?? 1;
  const isOutOfStock = stockCount <= 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(isEn ? `Added to cart: ${product.name}` : `Đã thêm vào giỏ: ${product.name}`);
    setQuickViewProduct(null);
  };

  const handleBuyNow = () => {
    if (!session?.user) {
      toast.info(isEn ? 'Please login with Discord to proceed with checkout!' : 'Vui lòng đăng nhập Discord để tiếp tục thanh toán và nhận tài khoản tức thì!');
      setQuickViewProduct(null);
      router.push('/login');
      return;
    }

    addItem(product, quantity);
    setQuickViewProduct(null);
    if (onQuickCheckout) {
      onQuickCheckout();
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        onClick={() => setQuickViewProduct(null)}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog: Thiết kế Bottom Sheet trên Mobile, Box chuẩn trên PC */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-t-[28px] sm:rounded-3xl shadow-2xl z-10 max-h-[92dvh] sm:max-h-[88vh] flex flex-col overflow-hidden text-zinc-900 dark:text-white">
        
        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800/80 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700">
              {product.category?.name || (isEn ? 'Digital Product' : 'Sản phẩm số')}
            </span>
            <span className={`text-[11px] font-bold flex items-center gap-1 ${
              !isOutOfStock ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${!isOutOfStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              {!isOutOfStock ? (isEn ? 'In Stock' : 'Còn hàng') : (isEn ? 'Out of Stock' : 'Hết hàng')}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setQuickViewProduct(null)}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
            title={isEn ? 'Close' : 'Đóng'}
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Nội dung cuộn linh hoạt (Body) - Lướt lên lướt xuống mượt mà trên mobile */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 pb-8 space-y-5 touch-pan-y scrollbar-thin" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Cột 1: Ảnh sản phẩm (Có Fallback chống vỡ ảnh) */}
            <div className="space-y-3">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-[#18181c] border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-center">
                {currentImg && !imgError ? (
                  <Image
                    src={currentImg}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 text-zinc-400 dark:text-zinc-500">
                    <Laptop className="w-12 h-12 stroke-[1.5] opacity-60" />
                    <span className="text-xs font-mono">ChinStore Verified</span>
                  </div>
                )}
              </div>

              {/* Thumbnails nếu có nhiều ảnh */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {images.map((img, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => {
                        setSelectedImageIdx(idx);
                        setImgError(false);
                      }}
                      className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        selectedImageIdx === idx
                          ? 'border-zinc-950 dark:border-white shadow-xs'
                          : 'border-zinc-200 dark:border-zinc-800 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt="Thumbnail" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Tag cam kết nhận hàng tự động */}
              <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-[#18181c] border border-zinc-200/80 dark:border-zinc-800/80 flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                <span>{isEn ? 'Automated AES-256 instant delivery' : 'Giao hàng tự động qua AES-256'}</span>
              </div>
            </div>

            {/* Cột 2: Tiêu đề, Giá, Phương thức thanh toán & Chi tiết */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-black text-zinc-950 dark:text-white font-sans tracking-tight leading-snug">
                  {product.name}
                </h2>

                {/* Giá tiền */}
                <div className="flex items-baseline gap-2 pt-2">
                  <span className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white font-mono">
                    {formatPrice(product.price, currency)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs sm:text-sm text-zinc-400 dark:text-zinc-500 line-through font-mono">
                      {formatPrice(product.originalPrice, currency)}
                    </span>
                  )}
                </div>
              </div>

              {/* Chọn phương thức thanh toán tự động (Đồng bộ tương ứng với Checkout) */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-bold">
                  {isEn ? 'Payment method' : 'Phương thức thanh toán'}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {/* VietQR */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPaymentMethod('SEPAY');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedPaymentMethod === 'SEPAY'
                        ? 'bg-zinc-100 dark:bg-[#1a1a20] border-zinc-950 dark:border-white ring-1 ring-zinc-950 dark:ring-white shadow-xs'
                        : 'bg-zinc-50/60 dark:bg-[#161619] border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      {selectedPaymentMethod === 'SEPAY' && (
                        <Check className="w-3.5 h-3.5 text-zinc-950 dark:text-white" />
                      )}
                    </div>
                    <div className="text-xs font-bold text-zinc-950 dark:text-white mt-1">VietQR</div>
                    <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">MBBank 5s</div>
                  </button>

                  {/* Litecoin LTC */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPaymentMethod('LITECOIN');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedPaymentMethod === 'LITECOIN'
                        ? 'bg-zinc-100 dark:bg-[#1a1a20] border-zinc-950 dark:border-white ring-1 ring-zinc-950 dark:ring-white shadow-xs'
                        : 'bg-zinc-50/60 dark:bg-[#161619] border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm text-cyan-600 dark:text-cyan-400 font-mono">Ł</span>
                      {selectedPaymentMethod === 'LITECOIN' && (
                        <Check className="w-3.5 h-3.5 text-zinc-950 dark:text-white" />
                      )}
                    </div>
                    <div className="text-xs font-bold text-zinc-950 dark:text-white mt-1">Litecoin</div>
                    <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">On-Chain</div>
                  </button>
                </div>
              </div>

              {/* Mô tả */}
              {product.description && (
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
                  {product.description}
                </p>
              )}

              {/* Bảng thông số specs */}
              {Object.keys(specs).length > 0 && (
                <div className="space-y-2 pt-1">
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Package Specifications' : 'Thông tin gói'}</span>
                  </h4>
                  <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 divide-y divide-zinc-200 dark:divide-zinc-800 text-xs font-mono">
                    {Object.entries(specs).map(([key, val]) => (
                      <div key={key} className="flex justify-between py-2 px-3">
                        <span className="text-zinc-500 dark:text-zinc-400">{key}:</span>
                        <span className="text-zinc-900 dark:text-zinc-200 font-medium">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Thanh thao tác cố định ở chân Modal - Button làm to to xíu theo yêu cầu */}
        <div className="sticky bottom-0 bg-white/95 dark:bg-[#121215]/95 backdrop-blur-xl border-t border-zinc-200/90 dark:border-zinc-800/90 p-4 sm:p-5 flex items-center justify-between gap-3 shrink-0 z-20 shadow-lg">
          {/* Bộ chọn số lượng (To rõ, dễ bấm trên mobile) */}
          <div className="flex items-center rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/90 dark:bg-[#18181c] overflow-hidden shrink-0">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-3 text-zinc-700 dark:text-zinc-200 hover:text-black dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 text-base font-black transition-colors cursor-pointer active:scale-95"
              aria-label={isEn ? "Decrease quantity" : "Giảm số lượng"}
            >
              -
            </button>
            <span className="px-3.5 py-3 text-zinc-950 dark:text-white font-mono text-sm sm:text-base font-black min-w-[36px] text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 py-3 text-zinc-700 dark:text-zinc-200 hover:text-black dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 text-base font-black transition-colors cursor-pointer active:scale-95"
              aria-label={isEn ? "Increase quantity" : "Tăng số lượng"}
            >
              +
            </button>
          </div>

          {/* 2 Nút thao tác: Thêm vào giỏ & Mua ngay - To rõ ràng, bấm cực sướng */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-1 justify-end">
            <button
              type="button"
              onClick={handleAddToCart}
              className="py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-[#1a1a1e] dark:hover:bg-[#25252a] text-zinc-900 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-xs whitespace-nowrap"
            >
              <ShoppingCart className="w-4 h-4 stroke-[2]" />
              <span className="hidden xs:inline">{isEn ? 'Add to Cart' : 'Thêm vào giỏ'}</span>
              <span className="xs:hidden">{isEn ? 'Cart' : 'Giỏ'}</span>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="py-3.5 sm:py-4 px-6 sm:px-8 rounded-2xl bg-zinc-950 hover:bg-zinc-850 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-xs sm:text-sm font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 whitespace-nowrap"
            >
              <span>{isEn ? 'Buy Now' : 'Mua Ngay'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
