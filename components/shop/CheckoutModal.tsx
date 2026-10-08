'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import { PaymentMethod } from '@/types';
import { useSession } from 'next-auth/react';
import { X, QrCode, Shield, Check, Lock, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: (orderData: any, paymentDetails: any) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  onOrderCreated,
}: CheckoutModalProps) {
  const t = useTranslations('checkout');
  const tToast = useTranslations('toasts');
  const locale = useLocale();
  const isEn = locale === 'en';
  const { data: session } = useSession();
  const {
    cart,
    clearCart,
    getCartTotalVND,
    currency,
    setCheckoutModalOpen,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
  } = useStore();

  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(selectedPaymentMethod || 'SEPAY');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedPaymentMethod) {
      setPaymentMethod(selectedPaymentMethod);
    }
  }, [selectedPaymentMethod, isOpen]);

  useEffect(() => {
    if (session?.user?.email) {
      setCustomerEmail(session.user.email);
    }
  }, [session]);

  // Đồng bộ trạng thái mở modal checkout vào store để ẩn BottomNavigation
  useEffect(() => {
    setCheckoutModalOpen(isOpen);
    return () => setCheckoutModalOpen(false);
  }, [isOpen, setCheckoutModalOpen]);

  if (!isOpen) return null;

  const totalVND = getCartTotalVND();
  const selectedProduct = cart[0]?.product;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerEmail.trim()) {
      toast.error(
        isEn
          ? 'Please enter your email to receive credentials/keys'
          : 'Vui lòng nhập Email để nhận tài khoản / bản quyền'
      );
      return;
    }

    if (!selectedProduct) {
      toast.error(
        isEn ? 'No product selected in cart!' : 'Chưa có sản phẩm nào được chọn trong giỏ hàng!'
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail,
          paymentMethod,
          productId: selectedProduct.id,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || (isEn ? 'Error creating order' : 'Lỗi khi tạo đơn hàng'));
      }

      toast.success(
        isEn
          ? `Order #${data.data.order.orderCode} initialized! Locked for 10 minutes.`
          : `Đã khởi tạo đơn hàng #${data.data.order.orderCode}! Khóa hàng 10 phút.`
      );

      clearCart();
      onClose();

      onOrderCreated(data.data.order, data.data.paymentDetails);
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || (isEn ? 'System error' : 'Lỗi hệ thống'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[75] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog: Chuẩn phong cách Dark Obsidian & Mobile Bottom Sheet */}
      <div className="relative w-full max-w-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-t-[28px] sm:rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90dvh] sm:max-h-[85vh] flex flex-col text-zinc-900 dark:text-white">
        {/* Top Accent Strip */}
        <div className="h-1 w-full bg-zinc-950 dark:bg-white" />

        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-zinc-950 dark:text-white font-sans tracking-tight">
              {isEn ? 'Instant Automated Checkout' : 'Thanh Toán Tự Động'}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {isEn
                ? 'Atomic Lock reservation & instant AES-256 automated delivery'
                : 'Khóa hàng nguyên tử (Atomic Lock) & giao tự động qua AES-256'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
            title={isEn ? 'Close' : 'Đóng'}
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Section 1: Customer Email */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
              <span>{isEn ? '1. Recipient Email' : '1. Email Nhận Bản Quyền'}</span>
            </h3>

            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
                {isEn
                  ? 'Email address (Receive credentials and warranty support) *'
                  : 'Địa chỉ Email (Nhận thông tin đăng nhập và hỗ trợ bảo hành) *'}
              </label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="your-email@example.com"
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-all font-mono"
              />
            </div>
          </div>

          {/* Section 2: Payment Gateway Selection (Đồng bộ Theme Obsidian) */}
          <div className="space-y-2.5 pt-1">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
              <span>{isEn ? '2. Payment Method' : '2. Phương Thức Thanh Toán'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Option 1: VietQR SePay */}
              <div
                onClick={() => {
                  setPaymentMethod('SEPAY');
                  setSelectedPaymentMethod('SEPAY');
                }}
                className={`p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'SEPAY'
                    ? 'bg-zinc-100/90 dark:bg-[#1a1a20] border-zinc-950 dark:border-white ring-1 ring-zinc-950 dark:ring-white shadow-xs'
                    : 'bg-zinc-50/60 dark:bg-[#161619] border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-zinc-200/80 dark:bg-zinc-800 flex items-center justify-center text-zinc-950 dark:text-white">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-950 dark:text-white">
                        VietQR (SePay Auto)
                      </div>
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                        {isEn ? 'MBBank • Scan QR 5s' : 'MBBank • Quét mã 5s'}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'SEPAY'
                        ? 'border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950'
                        : 'border-zinc-400 dark:border-zinc-600'
                    }`}
                  >
                    {paymentMethod === 'SEPAY' && (
                      <Check className="w-3 h-3 font-bold" />
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  {isEn
                    ? 'Scan automated bank QR code. Auto-verified within 5 seconds.'
                    : 'Quét mã QR chuyển khoản tự động. Xác nhận trong 5 giây.'}
                </p>
              </div>

              {/* Option 2: Litecoin (LTC) */}
              <div
                onClick={() => {
                  setPaymentMethod('LITECOIN');
                  setSelectedPaymentMethod('LITECOIN');
                }}
                className={`p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'LITECOIN'
                    ? 'bg-zinc-100/90 dark:bg-[#1a1a20] border-zinc-950 dark:border-white ring-1 ring-zinc-950 dark:ring-white shadow-xs'
                    : 'bg-zinc-50/60 dark:bg-[#161619] border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-zinc-200/80 dark:bg-zinc-800 flex items-center justify-center text-zinc-950 dark:text-white font-black text-sm">
                      Ł
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-950 dark:text-white">
                        Litecoin (LTC)
                      </div>
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                        On-Chain Crypto
                      </div>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'LITECOIN'
                        ? 'border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950'
                        : 'border-zinc-400 dark:border-zinc-600'
                    }`}
                  >
                    {paymentMethod === 'LITECOIN' && (
                      <Check className="w-3.5 h-3.5 font-bold" />
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  {isEn
                    ? '0-conf mempool scan, ultra-low network fees, 10-min rate lock.'
                    : 'Quét mempool 0-conf, phí mạng rẻ, khóa tỷ giá 10 phút.'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Order Summary Box */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#18181c] border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>{isEn ? 'Product:' : 'Sản phẩm:'}</span>
              <span className="text-zinc-900 dark:text-white font-medium truncate max-w-[200px] sm:max-w-[300px]">
                {selectedProduct?.name}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm font-bold text-zinc-950 dark:text-white pt-2 border-t border-zinc-200/80 dark:border-zinc-800/80">
              <span>{isEn ? 'Total:' : 'Tổng thanh toán:'}</span>
              <span className="text-zinc-950 dark:text-white font-mono text-base font-black">
                {formatPrice(totalVND, currency)}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="space-y-3 pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-2xl bg-zinc-950 hover:bg-zinc-850 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 font-bold text-sm tracking-wide transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-inherit" />
                  <span>{isEn ? 'Locking inventory...' : 'Đang khóa giữ đơn hàng...'}</span>
                </>
              ) : (
                <>
                  <span>
                    {isEn
                      ? 'Confirm & Open Payment Gateway'
                      : 'Xác Nhận & Mở Màn Hình Thanh Toán'}
                  </span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 font-sans">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>
                {isEn
                  ? 'Inventory atomically held for 10 minutes to prevent collisions'
                  : 'Kho hàng được khóa nguyên tử 10 phút chống xung đột đơn'}
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
