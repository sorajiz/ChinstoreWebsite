'use client';

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslations } from 'next-intl';
import { formatPrice } from '@/lib/utils';
import confetti from 'canvas-confetti';
import {
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Clock,
  KeyRound,
  Download,
  AlertTriangle,
  Printer,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import RadialCountdownTimer from '@/components/ui/RadialCountdownTimer';
import LiveTransactionRadar from '@/components/ui/LiveTransactionRadar';

interface LitecoinPaymentViewProps {
  order: any;
  paymentDetails: {
    address: string;
    amountLtc: string;
    ltcUsdRate?: string;
    qrUri: string;
    orderCode: string;
    expiresAt?: string;
  };
  onClose: () => void;
}

export default function LitecoinPaymentView({
  order: initialOrder,
  paymentDetails,
  onClose,
}: LitecoinPaymentViewProps) {
  const [order, setOrder] = useState(initialOrder);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // 10-minute Price Lock timer (600 seconds)
  const [secondsLeft, setSecondsLeft] = useState(600);

  const orderCode = paymentDetails.orderCode || order.orderCode;
  const ltcAmountStr = paymentDetails.amountLtc || order.totalLTC || '0.000000';
  const qrValue = paymentDetails.qrUri || `litecoin:${paymentDetails.address}?amount=${ltcAmountStr}`;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success('Đã sao chép vào bộ nhớ tạm!');
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleDownloadTxt = (dataToSave: string) => {
    const element = document.createElement('a');
    const file = new Blob([dataToSave], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `CHINSTORE_${orderCode}_LTC_ACCOUNT_DATA.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Đã tải xuống file thông tin tài khoản!');
  };

  // Timer countdown (10 minutes)
  useEffect(() => {
    if (order.status === 'PAID') return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [order.status]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  // Auto-polling every 4 seconds
  useEffect(() => {
    if (order.status === 'PAID') return;

    const poll = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${orderCode}`);
        const data = await res.json();
        if (data.success && data.data) {
          if (data.data.status !== order.status) {
            setOrder(data.data);
            if (data.data.status === 'PAID') {
              confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
              toast.success(`Xác nhận thanh toán Litecoin ${orderCode} thành công!`);
              clearInterval(poll);
            }
          }
        }
      } catch (err) {
        console.warn('LTC poll error:', err);
      }
    }, 4000);

    return () => clearInterval(poll);
  }, [order.status, orderCode]);

  // Query 4 Blockchain Explorer Engines
  const handleCheckBlockchain = async () => {
    try {
      setIsVerifying(true);
      const res = await fetch('/api/orders/worker-ltc');
      const data = await res.json();

      // Refetch full order
      const orderRes = await fetch(`/api/orders/${orderCode}`);
      const orderData = await orderRes.json();
      if (orderData.success) {
        setOrder(orderData.data);
        if (orderData.data.status === 'PAID') {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          toast.success('Giao dịch Litecoin đã được xác thực trên Blockchain!');
        } else {
          toast.info('Đang quét mempool (0-conf)... Chưa tìm thấy giao dịch hợp lệ.');
        }
      }
    } catch (e) {
      toast.error('Lỗi kiểm tra Blockchain');
    } finally {
      setIsVerifying(false);
    }
  };

  // Simulate payment modes
  const handleSimulate = async (mode: 'FULL_PAYMENT' | 'UNDERPAID' | 'EXPIRED_LATE') => {
    try {
      setIsSimulating(true);
      const res = await fetch(`/api/orders/${orderCode}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      });
      const data = await res.json();

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
      toast.error('Lỗi mô phỏng');
    } finally {
      setIsSimulating(false);
    }
  };

  const isPaid = order.status === 'PAID';
  const isUnderpaid = order.status === 'UNDERPAID';
  const isManualReview = order.status === 'MANUAL_REVIEW';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-lg transition-opacity"
      />

      <div className="relative w-full max-w-3xl bg-[#090d1c] border border-purple-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.2)] z-10 my-8">
        {/* Glow Strip */}
        <div
          className={`h-1.5 w-full ${
            isPaid
              ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400'
              : isUnderpaid || isManualReview
              ? 'bg-gradient-to-r from-orange-400 via-yellow-400 to-rose-400'
              : 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400'
          }`}
        />

        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold font-mono text-base ${
                isPaid
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-purple-500/20 text-purple-400 border border-purple-500/40 animate-pulse'
              }`}
            >
              {isPaid ? <CheckCircle2 className="w-6 h-6" /> : 'Ł'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                {isPaid
                  ? 'THANH TOÁN LTC THÀNH CÔNG!'
                  : isUnderpaid
                  ? 'CẢNH BÁO: THIẾU TIỀN LTC'
                  : isManualReview
                  ? 'ĐƠN HÀNG CHỜ DUYỆT THỦ CÔNG'
                  : 'Cổng Litecoin (LTC) On-Chain'}
              </h2>
              <div className="text-xs font-mono text-slate-400">
                Mã đơn hàng:{' '}
                <span className="text-purple-400 font-bold">{orderCode}</span>
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
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-teal-950/20 to-black border border-emerald-500/30 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)]">
                  <Sparkles className="w-8 h-8 animate-bounce" />
                </div>
                <h3 className="text-2xl font-black text-white font-display">
                  Xác Nhận On-Chain Hoàn Tất
                </h3>
                <p className="text-xs text-emerald-300 max-w-md mx-auto">
                  Giao dịch Litecoin đã được xác thực qua 4 Engine Blockchain. Dữ liệu kho hàng số đã giải mã AES-256-GCM thành công bên dưới.
                </p>
              </div>

              {/* Decrypted Payload */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-purple-400 font-bold uppercase flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-purple-400" />
                    <span>Dữ liệu tài khoản / License Key (Đã giải mã):</span>
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
                          className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-mono flex items-center gap-1.5 transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Tải .txt</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/70 border border-purple-500/30 font-mono text-xs text-emerald-300 select-all break-all whitespace-pre-wrap shadow-inner leading-relaxed">
                  {order.decryptedData || 'Đang cập nhật...'}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-semibold text-white transition-all flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4 text-slate-400" />
                  <span>In Hóa Đơn</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                >
                  <span>Tiếp Tục Mua Sắm</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : isManualReview ? (
            /* Late Payment Guard */
            <div className="space-y-4 animate-fade-in">
              <div className="p-5 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-center space-y-2">
                <AlertTriangle className="w-12 h-12 text-purple-400 mx-auto" />
                <h3 className="text-xl font-bold text-white font-display">
                  Đơn Hàng Chờ Xử Lý Thủ Công (Late Payment)
                </h3>
                <p className="text-xs text-purple-200">
                  Giao dịch LTC đến sau khi đồng hồ khóa giá 10 phút đã hết hạn. Tiền của bạn đã được ghi nhận an toàn trên Blockchain.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
                Lý do: {order.reviewReason || 'Giao dịch đến sau khi đơn hết hạn'}. Liên hệ Admin Telegram @ChinStoreSupport để đổi sản phẩm mới hoặc nhận hoàn tiền.
              </div>
            </div>
          ) : (
            /* PENDING LTC PAYMENT */
            <div className="space-y-6">
              <LiveTransactionRadar
                status={order.status}
                gateway="LITECOIN"
                orderCode={orderCode}
              />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                {/* QR Code & Radial Countdown */}
                <div className="md:col-span-5 flex flex-col items-center space-y-4">
                  <div className="relative p-3 rounded-2xl bg-white shadow-[0_0_30px_rgba(168,85,247,0.3)] border border-purple-400/50">
                    <QRCodeSVG
                      value={qrValue}
                      size={200}
                      level="H"
                      includeMargin={false}
                    />
                  </div>

                  {/* Radial Progress Countdown Timer */}
                  <RadialCountdownTimer
                    expiresAt={paymentDetails.expiresAt}
                    totalDurationSeconds={600}
                    size={110}
                    strokeWidth={6}
                  />
                </div>

              {/* Address & Exact Amount */}
              <div className="md:col-span-7 space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Gửi chính xác số lượng Litecoin bên dưới tới địa chỉ ví (Hỗ trợ 0-conf mempool & Native SegWit):
                </p>

                <div className="space-y-2.5 font-mono text-xs">
                  {/* Amount with 6 decimals */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-purple-950/60 to-pink-950/50 border border-purple-400/50 flex items-center justify-between shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                    <div>
                      <div className="text-[10px] text-purple-300 uppercase font-bold">
                        Số lượng LTC chính xác (Decimal.js):
                      </div>
                      <div className="text-xl font-black text-white tracking-wider">
                        {ltcAmountStr} LTC
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(ltcAmountStr, 'ltcAmount')}
                      className="px-3 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs flex items-center gap-1 shadow-md transition-all"
                    >
                      {copiedField === 'ltcAmount' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Đã copy</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy LTC</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Merchant Wallet Address */}
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Địa chỉ ví LTC nhận:</span>
                      <span className="text-purple-400">Native SegWit (Bech32)</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-white text-xs break-all select-all font-mono">
                        {paymentDetails.address}
                      </span>
                      <button
                        onClick={() => handleCopy(paymentDetails.address, 'address')}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300"
                      >
                        {copiedField === 'address' ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4-Engine Blockchain Explorer Scan */}
                <button
                  onClick={handleCheckBlockchain}
                  disabled={isVerifying}
                  className="w-full py-2.5 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-xs text-slate-200 font-mono flex items-center justify-center gap-2 transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                  <span>Quét 4 Engine Explorer (Bitaps, Litecoin Space, 3xpl, Blockchair)</span>
                </button>

                {/* Test Simulation Panel */}
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-[#5865F2]" />
                    <span>Bảng Điều Khiển Test Demo (LTC):</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleSimulate('FULL_PAYMENT')}
                      disabled={isSimulating}
                      className="p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-[11px] font-mono font-bold text-purple-300 transition-all text-center"
                    >
                      Duyệt Đủ LTC (PAID)
                    </button>
                    <button
                      onClick={() => handleSimulate('UNDERPAID')}
                      disabled={isSimulating}
                      className="p-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-[11px] font-mono font-bold text-orange-300 transition-all text-center"
                    >
                      Thiếu LTC
                    </button>
                    <button
                      onClick={() => handleSimulate('EXPIRED_LATE')}
                      disabled={isSimulating}
                      className="p-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/40 border border-purple-500/30 text-[11px] font-mono font-bold text-purple-300 transition-all text-center"
                    >
                      LTC Trễ Hạn
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
