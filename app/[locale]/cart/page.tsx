'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { useSession } from 'next-auth/react';
import { useRouter, Link } from '@/navigation';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CheckoutModal from '@/components/shop/CheckoutModal';
import AuthModal from '@/components/auth/AuthModal';
import {
  ArrowLeft,
  ArrowRight,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

// 3D Isometric Wireframe Box Icon matching reference screenshot
function IsometricBoxIcon({ className = 'w-20 h-20' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M32 8L12 19.5V44.5L32 56L52 44.5V19.5L32 8Z" />
      <path d="M32 32V56" />
      <path d="M12 19.5L32 32L52 19.5" />
      <path d="M22 13.8L42 25.2" strokeWidth="1.8" opacity="0.6" />
    </svg>
  );
}

export default function CartPage() {
  const t = useTranslations('cart');
  const tToast = useTranslations('toasts');
  const locale = useLocale();
  const isEn = locale === 'en';
  const router = useRouter();

  const { data: session } = useSession();
  const {
    cart,
    removeItem,
    updateQuantity,
    clearCart,
    getCartTotalVND,
    getCartItemCount,
    currency,
    setAuthModalOpen,
  } = useStore();

  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  const totalVND = getCartTotalVND();
  const itemCount = getCartItemCount();

  const handleRemove = (productId: string) => {
    removeItem(productId);
    toast.info(tToast('removedFromCart'), {
      className: 'bg-zinc-900 text-white border border-zinc-700',
    });
  };

  const handleClearAll = () => {
    clearCart();
    toast.info(isEn ? 'Cart cleared' : 'Đã xóa toàn bộ giỏ hàng');
  };

  const handleOrderCreated = (orderData: any) => {
    router.push(`/order/${orderData.orderCode}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-[#09090B] text-zinc-900 dark:text-white transition-colors">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-24">
        {/* Page Title Section matching Ảnh 2 */}
        <div className="mb-6 sm:mb-8 space-y-1">
          <div className="text-xs sm:text-sm font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            <span>——</span>
            <span>{isEn ? 'Checkout' : 'Thanh toán'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white font-sans">
            {t('title')}
          </h1>
        </div>

        {/* Khi giỏ hàng trống - Chuẩn 100% Ảnh 2 */}
        {cart.length === 0 ? (
          <div className="w-full max-w-xl mx-auto rounded-3xl bg-white dark:bg-[#121215] border border-zinc-200/90 dark:border-white/10 p-10 sm:p-16 shadow-xs flex flex-col items-center justify-center text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <IsometricBoxIcon className="w-20 h-20 sm:w-24 sm:h-24 text-zinc-400 dark:text-zinc-500 stroke-[1.8] mb-1" />

            <h2 className="text-base sm:text-lg font-bold text-zinc-800 dark:text-zinc-200">
              {isEn ? 'Your cart is empty' : 'Giỏ hàng của bạn đang trống'}
            </h2>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 font-bold text-sm sm:text-base transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
              <span>{isEn ? 'Explore products' : 'Khám phá sản phẩm'}</span>
            </Link>
          </div>
        ) : (
          /* Khi có sản phẩm trong giỏ hàng */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Cột trái: Danh sách sản phẩm */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  {itemCount} {isEn ? 'products' : 'sản phẩm'}
                </span>
                <button
                  onClick={handleClearAll}
                  className="text-xs font-medium text-zinc-400 hover:text-rose-500 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Clear all' : 'Xóa toàn bộ'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {cart.map(({ product, quantity }) => {
                  const img =
                    product.images?.[0] ||
                    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';
                  return (
                    <div
                      key={product.id}
                      className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200/90 dark:border-white/10 flex gap-4 items-center shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                    >
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shrink-0">
                        <Image
                          src={img}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white truncate">
                            {product.name}
                          </h3>
                          <button
                            onClick={() => handleRemove(product.id)}
                            className="p-1 text-zinc-400 hover:text-rose-500 transition-colors shrink-0 cursor-pointer"
                            title={t('remove')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-xs sm:text-sm font-mono font-bold text-zinc-950 dark:text-zinc-100">
                          {formatPrice(product.price * quantity, currency)}
                        </div>

                        <div className="flex items-center gap-3 pt-1">
                          <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-[#0e0e11]">
                            <button
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2.5 text-xs font-mono font-bold text-zinc-900 dark:text-white">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="text-[11px] text-zinc-400">
                            {formatPrice(product.price, currency)} / gói
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{isEn ? 'Continue shopping' : 'Tiếp tục chọn sản phẩm'}</span>
                </Link>
              </div>
            </div>

            {/* Cột phải: Tóm tắt thanh toán */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-white dark:bg-[#121215] border border-zinc-200/90 dark:border-white/10 p-6 space-y-5 shadow-xs sticky top-28">
                <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                  {isEn ? 'Order Summary' : 'Tóm tắt đơn hàng'}
                </h3>

                <div className="space-y-3 text-sm border-b border-zinc-100 dark:border-zinc-800 pb-4">
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>{t('subtotal')}</span>
                    <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-200">
                      {formatPrice(totalVND, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>{isEn ? 'Delivery' : 'Bàn giao'}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" />
                      {isEn ? 'Instant (Auto)' : 'Tức thì (Tự động)'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-base">
                  <span className="font-bold text-zinc-950 dark:text-white">
                    {t('total')}
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white font-mono">
                    {formatPrice(totalVND, currency)}
                  </span>
                </div>

                <button
                  id="cart-page-checkout-btn"
                  onClick={() => {
                    if (!session?.user) {
                      toast.info(isEn ? 'Please login with Discord to proceed with checkout!' : 'Vui lòng đăng nhập Discord để tiếp tục thanh toán và nhận tài khoản tức thì!');
                      router.push('/login');
                      return;
                    }
                    setCheckoutOpen(true);
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-850 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 cursor-pointer"
                >
                  <span>{t('checkout')}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 text-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Bảo mật AES-256 • Nhận tài khoản ngay sau khi thanh toán</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <AuthModal />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onOrderCreated={handleOrderCreated}
      />

      <Footer />
    </div>
  );
}
