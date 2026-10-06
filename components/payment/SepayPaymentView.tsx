'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { formatPrice } from '@/lib/utils';
import confetti from 'canvas-confetti';
import {
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Building,
  KeyRound,
  Download,
  Clock,
  Printer,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import RadialCountdownTimer from '@/components/ui/RadialCountdownTimer';
import LiveTransactionRadar from '@/components/ui/LiveTransactionRadar';

interface SepayPaymentViewProps {
  order: any;
  paymentDetails: {
    bankCode: string;
    accountNo: string;
    accountName: string;
    amount: number;
    orderCode: string;
    qrUrl: string;
    expiresAt?: string;
  };
  onClose: () => void;
}

export default function SepayPaymentView({
  order: initialOrder,
  paymentDetails,
  onClose,
}: SepayPaymentViewProps) {
  const t = useTranslations('payment');
  const [order, setOrder] = useState(initialOrder);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simMode, setSimMode] = useState<'FULL_PAYMENT' | 'UNDERPAID' | 'EXPIRED_LATE'>('FULL_PAYMENT');

  const orderCode = paymentDetails.orderCode || order.orderCode;

  // 1-Click Copy helper
  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success('Đã sao chép vào bộ nhớ tạm!');
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Download TXT credentials file
  const handleDownloadTxt = (dataToSave: string) => {
    const element = document.createElement('a');
    const file = new Blob([dataToSave], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `CHINSTORE_${orderCode}_ACCOUNT_DATA.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Đã tải xuống file thông tin tài khoản!');
  };

  // Auto-polling every 3 seconds while PENDING
  useEffect(() => {
    if (order.status === 'PAID') return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${orderCode}`);
        const data = await res.json();
        if (data.success && data.data) {
          if (data.data.status !== order.status) {
            setOrder(data.data);
            if (data.data.status === 'PAID') {
              // Confetti celebration
              confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
              toast.success(`Thanh toán đơn hàng ${orderCode} thành công!`);
              clearInterval(interval);
            }
          }
        }
      } catch (err) {
        console.warn('Polling error:', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [order.status, orderCode]);

  // Simulate payment button
  const handleSimulate = async (mode: 'FULL_PAYMENT' | 'UNDERPAID' | 'EXPIRED_LATE') => {
    try {
      setIsSimulating(true);
      const res = await fetch(`/api/orders/${orderCode}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      });
      const data = await res.json();

      // Refetch full order with decrypted data
      const orderRes = await fetch(`/api/orders/${orderCode}`);
      const orderData = await orderRes.json();
      if (orderData.success) {
        setOrder(orderData.data);
        if (orderData.data.status === 'PAID') {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        }
      }
      toast.success(data.message || 'Mô phỏng thành công');
    } catch (e: any) {
      toast.error('Lỗi khi mô phỏng');
    } finally {
      setIsSimulating(false);
    }
  };

  const isPaid = order.status === 'PAID';
  const isUnderpaid = order.status === 'UNDERPAID';
  const isManualReview = order.status === 'MANUAL_REVIEW';
  const isExpired = order.status === 'EXPIRED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-lg transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-[#090d1c] border border-cyan-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.2)] z-10 my-8">
        {/* Glowing Top Strip */}
        <div
          className={`h-1.5 w-full ${
            isPaid
              ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400'
              : isUnderpaid || isManualReview
              ? 'bg-gradient-to-r from-orange-400 via-yellow-400 to-rose-400'
              : 'bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500'
          }`}
        />

        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isPaid
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : isUnderpaid || isManualReview
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                  : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 animate-pulse'
              }`}
            >
              {isPaid ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : isUnderpaid || isManualReview ? (
                <AlertTriangle className="w-6 h-6" />
              ) : (
                <Building className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                {isPaid
                  ? 'THANH TOÁN THÀNH CÔNG!'
                  : isUnderpaid
                  ? 'CẢNH BÁO: CHUYỂN THIẾU TIỀN'
                  : isManualReview
                  ? 'ĐƠN HÀNG CHỜ DUYỆT THỦ CÔNG'
                  : isExpired
                  ? 'ĐƠN HÀNG ĐÃ HẾT HẠN'
                  : 'Cổng VietQR SePay Tự Động'}
              </h2>
              <div className="text-xs font-mono text-slate-400">
                Mã đơn hàng:{' '}
                <span className="text-cyan-400 font-bold">{orderCode}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl border border-white/10 text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            Đóng
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* ================= IF ORDER IS PAID ================= */}
          {isPaid ? (
            <div className="space-y-6 animate-fade-in">
              {/* Celebration Hero */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-teal-950/20 to-black border border-emerald-500/30 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)]">
                  <Sparkles className="w-8 h-8 animate-bounce" />
                </div>
                <h3 className="text-2xl font-black text-white font-display">
                  Giao Dịch Hoàn Tất & Nhận Hàng Ngay
                </h3>
                <p className="text-xs text-emerald-300 max-w-md mx-auto">
                  Hệ thống SePay IPN đã xác nhận tiền vào tài khoản. Dữ liệu kho hàng số đã được giải mã AES-256-GCM an toàn bên dưới.
                </p>
              </div>

              {/* Decrypted Account / License Key Box */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-cyan-400 font-bold uppercase flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-cyan-400" />
                    <span>Dữ liệu tài khoản / License Key (Đã giải mã AES-256-GCM):</span>
                  </span>
                  <div className="flex items-center gap-2">
                    {order.decryptedData && (
                      <>
                        <button
                          onClick={() => handleCopy(order.decryptedData, 'decryptedData')}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono flex items-center gap-1.5 transition-all text-white"
                        >
                          {copiedField === 'decryptedData' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>Copy tất cả</span>
                        </button>
                        <button
                          onClick={() => handleDownloadTxt(order.decryptedData)}
                          className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Tải .txt</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/70 border border-cyan-500/30 font-mono text-xs text-emerald-300 select-all break-all whitespace-pre-wrap shadow-inner leading-relaxed">
                  {order.decryptedData || 'Đang cập nhật dữ liệu...'}
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Chính sách: {order.items?.[0]?.product?.warrantyPolicy || 'Bảo hành 24h'}</span>
                  <span className="text-emerald-400 font-medium">Bảo vệ kho hàng Serialized AES-256-GCM</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-semibold text-white transition-all flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4 text-slate-400" />
                  <span>In / Lưu Hóa Đơn</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  <span>Hoàn Tất & Tiếp Tục Mua</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : isManualReview ? (
            /* ================= CRITICAL EDGE CASE 6.1: Late Payment Guard ================= */
            <div className="space-y-5 animate-fade-in">
              <div className="p-5 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-center space-y-2">
                <AlertTriangle className="w-12 h-12 text-purple-400 mx-auto" />
                <h3 className="text-xl font-bold text-white font-display">
                  Đơn Hàng Chờ Xử Lý Thủ Công (Late Payment)
                </h3>
                <p className="text-xs text-purple-200 max-w-lg mx-auto leading-relaxed">
                  Đơn hàng #{orderCode} đã hết hạn trước khi hệ thống nhận được tiền chuyển khoản. Tuy nhiên, số tiền của bạn đã được ghi nhận an toàn vào hệ thống!
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs font-mono space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Trạng thái:</span>
                  <span className="text-purple-300 font-bold">MANUAL_REVIEW</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Ghi chú hệ thống:</span>
                  <span className="text-white">{order.reviewReason || 'Nhận tiền sau thời gian hết hạn'}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Giải pháp hỗ trợ:</span>
                  <span className="text-emerald-400">Cấp tài khoản mới hoặc hoàn tiền 100%</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-300 flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Vui lòng chụp ảnh màn hình này hoặc cung cấp mã đơn <b className="text-white">#{orderCode}</b> gửi cho bộ phận hỗ trợ qua Telegram: <a href="https://t.me/" target="_blank" className="underline font-bold text-white">@ChinStoreSupport</a> để được duyệt cấp ngay tài khoản mới.</span>
              </div>
            </div>
          ) : isUnderpaid ? (
            /* ================= CRITICAL EDGE CASE 6.2: Underpaid Guard ================= */
            <div className="space-y-5 animate-fade-in">
              <div className="p-5 rounded-2xl bg-orange-950/40 border border-orange-500/40 text-center space-y-2">
                <AlertTriangle className="w-12 h-12 text-orange-400 mx-auto" />
                <h3 className="text-xl font-bold text-white font-display">
                  Cảnh Báo: Bạn Đã Chuyển Thiếu Tiền
                </h3>
                <p className="text-xs text-orange-200 max-w-lg mx-auto leading-relaxed">
                  Hệ thống chưa thể giải mã giao hàng vì số tiền chuyển khoản chưa đủ tổng giá trị đơn hàng.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs font-mono space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Tổng tiền đơn hàng:</span>
                  <span className="text-white font-bold">{formatPrice(order.totalVND, 'VND')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Đã nhận:</span>
                  <span className="text-emerald-400 font-bold">{formatPrice(order.totalReceived || 0, 'VND')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Số tiền còn thiếu:</span>
                  <span className="text-rose-400 font-bold">
                    {formatPrice(Math.max(0, order.totalVND - (order.totalReceived || 0)), 'VND')}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs text-slate-300">
                <ArrowRight className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Vui lòng chuyển tiếp số tiền còn thiếu với <b>CÙNG NỘI DUNG CHUYỂN KHOẢN: {orderCode}</b> để đơn hàng được duyệt tự động.</span>
              </div>
            </div>
          ) : (
            /* ================= PENDING PAYMENT VIEW ================= */
            <div className="space-y-6">
              <LiveTransactionRadar
                status={order.status}
                gateway="SEPAY"
                orderCode={orderCode}
              />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                {/* Left Column: VietQR Image & Radial Countdown */}
                <div className="md:col-span-5 flex flex-col items-center space-y-4">
                  <div className="relative p-2.5 rounded-2xl bg-white shadow-[0_0_30px_rgba(0,240,255,0.3)] border border-cyan-400/50">
                    <div className="relative w-56 h-56 rounded-xl overflow-hidden bg-white">
                      <Image
                        src={paymentDetails.qrUrl}
                        alt="VietQR SePay"
                        fill
                        unoptimized
                        priority
                        className="object-contain"
                      />
                    </div>
                  </div>

                  <RadialCountdownTimer
                    expiresAt={paymentDetails.expiresAt}
                    totalDurationSeconds={600}
                    size={110}
                    strokeWidth={6}
                  />
                </div>

                {/* Right Column: Bank Info & 1-Click Copy */}
                <div className="md:col-span-7 space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Mở app ngân hàng quét VietQR hoặc chuyển chính xác theo thông tin bên dưới (Khóa kho hàng nguyên tử 10 phút):
                </p>

                <div className="space-y-2.5 font-mono text-xs">
                  {/* Bank Name */}
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                    <span className="text-slate-400">Ngân hàng:</span>
                    <span className="text-white font-bold">{paymentDetails.bankCode}</span>
                  </div>

                  {/* Account Number */}
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400">Số tài khoản:</div>
                      <div className="text-white font-bold text-sm tracking-wide">
                        {paymentDetails.accountNo}
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(paymentDetails.accountNo, 'accountNo')}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300"
                    >
                      {copiedField === 'accountNo' ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Account Name */}
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                    <span className="text-slate-400">Chủ tài khoản:</span>
                    <span className="text-white font-bold uppercase">
                      {paymentDetails.accountName}
                    </span>
                  </div>

                  {/* Exact Amount */}
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400">Số tiền chính xác:</div>
                      <div className="text-emerald-400 font-bold text-sm">
                        {formatPrice(paymentDetails.amount, 'VND')}
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(String(paymentDetails.amount), 'amount')}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300"
                    >
                      {copiedField === 'amount' ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Transfer Memo (Base32 7-char) */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-950/60 to-purple-950/50 border border-cyan-400/50 flex items-center justify-between shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                    <div>
                      <div className="text-[10px] text-cyan-300 font-bold uppercase">
                        Nội dung chuyển khoản (Bắt buộc):
                      </div>
                      <div className="text-white font-black text-lg tracking-wider">
                        {orderCode}
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(orderCode, 'memo')}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-1 shadow-md transition-all"
                    >
                      {copiedField === 'memo' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Đã copy</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Memo</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Simulation Control Panel for Testing Edge Cases */}
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-[#5865F2]" />
                    <span>Bảng Điều Khiển Test Demo (Kiểm Thử Kịch Bản):</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleSimulate('FULL_PAYMENT')}
                      disabled={isSimulating}
                      className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-[11px] font-mono font-bold text-cyan-300 transition-all text-center"
                    >
                      Duyệt Đủ Tiền (PAID)
                    </button>
                    <button
                      onClick={() => handleSimulate('UNDERPAID')}
                      disabled={isSimulating}
                      className="p-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-[11px] font-mono font-bold text-orange-300 transition-all text-center"
                    >
                      Thiếu Tiền (Underpaid)
                    </button>
                    <button
                      onClick={() => handleSimulate('EXPIRED_LATE')}
                      disabled={isSimulating}
                      className="p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-[11px] font-mono font-bold text-purple-300 transition-all text-center"
                    >
                      Trễ Hạn (Late Guard)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
}
