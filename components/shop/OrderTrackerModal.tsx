'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { formatPrice } from '@/lib/utils';
import { X, Search, CheckCircle2, Clock, XCircle, KeyRound, Copy, Check, Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPayPendingOrder?: (order: any, paymentDetails: any) => void;
}

export default function OrderTrackerModal({
  isOpen,
  onClose,
  onPayPendingOrder,
}: OrderTrackerModalProps) {
  const t = useTranslations('common');
  const [orderCodeInput, setOrderCodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderCodeInput.trim()) return;

    try {
      setLoading(true);
      setErrorMsg('');
      setOrderResult(null);

      const code = orderCodeInput.trim().toUpperCase();
      const res = await fetch(`/api/orders/${code}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Không tìm thấy đơn hàng với mã này');
      }

      setOrderResult(data.data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Không tìm thấy đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(id);
    toast.success('Đã sao chép mã khóa!');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      <div className="relative w-full max-w-xl bg-[#090d1c] border border-white/15 rounded-3xl overflow-hidden shadow-2xl z-10 my-8">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white font-display">
              Tra Cứu Đơn Hàng & Kích Hoạt Key
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Nhập mã đơn hàng của bạn (VD: CHIN8392) để kiểm tra trạng thái và nhận tài nguyên
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={orderCodeInput}
                onChange={(e) => setOrderCodeInput(e.target.value)}
                placeholder="Nhập mã đơn: CHIN..."
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 text-sm font-mono uppercase focus:outline-none focus:border-cyan-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>Tra cứu</span>
            </button>
          </form>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Result Card */}
          {orderResult && (
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4 font-mono text-xs">
              {/* Header Status */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <div className="text-[10px] text-slate-400">Mã đơn hàng:</div>
                  <div className="text-white font-bold text-sm">
                    {orderResult.orderCode}
                  </div>
                </div>

                <div>
                  {orderResult.status === 'PAID' ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ĐÃ THANH TOÁN
                    </span>
                  ) : orderResult.status === 'PENDING' ? (
                    <span className="px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 text-[11px] font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 animate-spin" />
                      CHỜ THANH TOÁN
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[11px] font-bold flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      {orderResult.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Order Details */}
              <div className="space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Khách hàng:</span>
                  <span>{orderResult.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span>{orderResult.customerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tổng tiền:</span>
                  <span className="text-white font-bold">
                    {formatPrice(orderResult.totalVND, 'VND')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Phương thức:</span>
                  <span className="text-cyan-400">
                    {orderResult.paymentMethod === 'SEPAY'
                      ? 'VietQR SePay (MBBank)'
                      : 'Litecoin Network (LTC)'}
                  </span>
                </div>
              </div>

              {/* Digital Keys If PAID */}
              {orderResult.status === 'PAID' && (
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <div className="text-[11px] text-cyan-400 font-bold uppercase flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Mã bản quyền / Tài nguyên đã cấp:</span>
                  </div>

                  {orderResult.items?.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-black/60 border border-cyan-500/30 space-y-1"
                    >
                      <div className="text-[11px] text-white font-sans font-bold">
                        {item.product?.name}
                      </div>
                      <div className="flex items-center justify-between gap-2 p-2 rounded bg-black/50 text-emerald-300 text-[11px]">
                        <span className="truncate select-all">
                          {item.product?.digitalKey || `KEY-CHIN-${orderResult.orderCode}`}
                        </span>
                        <button
                          onClick={() =>
                            handleCopyKey(
                              item.product?.digitalKey || `KEY-CHIN-${orderResult.orderCode}`,
                              `search-${idx}`
                            )
                          }
                          className="p-1 rounded bg-white/10 text-white"
                        >
                          {copiedKey === `search-${idx}` ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <Link
                  href={`/order/${orderResult.orderCode}`}
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all btn-haptic"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Mở Buồng Lái Đơn Hàng</span>
                </Link>

                {orderResult.status === 'PAYMENT_PENDING' && onPayPendingOrder && (
                  <button
                    onClick={() => {
                      onClose();
                      onPayPendingOrder(orderResult, orderResult.paymentDetails);
                    }}
                    className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all btn-haptic"
                  >
                    <span>Thanh toán ngay</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
