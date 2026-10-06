'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
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
  const { data: session } = useSession();
  const { cart, clearCart, getCartTotalVND, currency } = useStore();

  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('SEPAY');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      setCustomerEmail(session.user.email);
    }
  }, [session]);

  if (!isOpen) return null;

  const totalVND = getCartTotalVND();
  const selectedProduct = cart[0]?.product;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerEmail.trim()) {
      toast.error('Vui lòng nhập Email để nhận tài khoản / key', {
        className: 'bg-[#0a0f1f] text-white border border-rose-500/30',
      });
      return;
    }

    if (!selectedProduct) {
      toast.error('Chưa có sản phẩm nào được chọn trong giỏ hàng!', {
        className: 'bg-[#0a0f1f] text-white border border-rose-500/30',
      });
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
        throw new Error(data.error || 'Lỗi khi tạo đơn hàng');
      }

      toast.success(`Đã khởi tạo đơn hàng #${data.data.order.orderCode}! Khóa hàng 10 phút.`, {
        className: 'bg-[#0a0f1f] text-white border border-cyan-500/30',
      });

      clearCart();
      onClose();

      onOrderCreated(data.data.order, data.data.paymentDetails);
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Lỗi hệ thống', {
        className: 'bg-[#0a0f1f] text-white border border-rose-500/30',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-[#090d1c] border border-white/15 rounded-3xl overflow-hidden shadow-2xl z-10 my-8">
        {/* Glow Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500" />

        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white font-display">
              Thanh Toán & Nhận Hàng Tự Động
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Giữ chỗ nguyên tử (Atomic Lock) & giao hàng qua AES-256-GCM
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Section 1: Customer Email */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              1. Email Nhận Tài Khoản / Bản Quyền
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Địa chỉ Email (Nhận thông tin đăng nhập và hỗ trợ bảo hành) *
              </label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="your-email@example.com"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-all font-mono"
              />
            </div>
          </div>

          {/* Section 2: Payment Gateway Selection */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              2. Chọn Phương Thức Thanh Toán Tự Động
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: VietQR SePay */}
              <div
                onClick={() => setPaymentMethod('SEPAY')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'SEPAY'
                    ? 'bg-gradient-to-br from-cyan-950/50 to-blue-950/40 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                    : 'bg-black/30 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">
                        VietQR (SePay Auto)
                      </div>
                      <div className="text-[10px] text-cyan-300/80 font-mono">
                        MBBank • 3 Tầng Bảo Mật
                      </div>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'SEPAY'
                        ? 'border-cyan-400 bg-cyan-400'
                        : 'border-slate-600'
                    }`}
                  >
                    {paymentMethod === 'SEPAY' && (
                      <Check className="w-3 h-3 text-black font-bold" />
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed">
                  Quét mã VietQR chuyển khoản tự động. Duyệt đơn trong 5s.
                </p>
              </div>

              {/* Option 2: Litecoin (LTC) */}
              <div
                onClick={() => setPaymentMethod('LITECOIN')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'LITECOIN'
                    ? 'bg-gradient-to-br from-purple-950/50 to-pink-950/40 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                    : 'bg-black/30 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black text-sm">
                      Ł
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">
                        Litecoin (LTC)
                      </div>
                      <div className="text-[10px] text-purple-300/80 font-mono">
                        4 Engine On-Chain
                      </div>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'LITECOIN'
                        ? 'border-purple-400 bg-purple-400'
                        : 'border-slate-600'
                    }`}
                  >
                    {paymentMethod === 'LITECOIN' && (
                      <Check className="w-3 h-3 text-black font-bold" />
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed">
                  Quét mempool 0-conf, phí mạng rẻ, khóa giá chính xác 10 phút.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Order Summary Box */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Sản phẩm:</span>
              <span className="text-white font-medium">{selectedProduct?.name}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-bold text-white pt-2 border-t border-white/5">
              <span>Tổng thanh toán:</span>
              <span className="text-cyan-400 font-mono text-base">
                {formatPrice(totalVND, currency)}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm tracking-wide transition-all shadow-[0_0_25px_rgba(0,240,255,0.4)] disabled:opacity-50 flex items-center justify-center gap-2 active:scale-98"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Đang khóa giữ kho hàng...</span>
                </>
              ) : (
                <>
                  <span>Khóa Hàng & Mở Màn Hình Thanh Toán</span>
                  <ArrowRight className="w-4 h-4 text-cyan-300" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-sans">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kho hàng được khóa nguyên tử 10 phút chống xung đột (Anti Race-Condition)</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
