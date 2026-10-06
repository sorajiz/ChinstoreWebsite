'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/navigation';
import { formatPrice } from '@/lib/utils';
import RadialCountdownTimer from '@/components/ui/RadialCountdownTimer';
import LiveTransactionRadar from '@/components/ui/LiveTransactionRadar';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import {
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  KeyRound,
  Download,
  Printer,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Zap,
  Building,
  Coins,
  Lock,
  ExternalLink,
} from 'lucide-react';

interface OrderItem {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    images: string[];
    warrantyPolicy?: string;
  };
  priceVND: number;
  quantity: number;
}

interface OrderData {
  id: string;
  orderCode: string;
  customerEmail: string;
  totalVND: number;
  totalLTC?: string;
  gateway: 'SEPAY' | 'LITECOIN';
  status: 'PAYMENT_PENDING' | 'PAID' | 'UNDERPAID' | 'MANUAL_REVIEW' | 'EXPIRED';
  reviewReason?: string;
  expiresAt: string;
  paidAt?: string | null;
  items: OrderItem[];
  decryptedData?: string | null;
  paymentDetails: any;
  totalReceived?: string;
}

interface FocusedCheckoutCockpitProps {
  initialOrder: OrderData;
}

export default function FocusedCheckoutCockpit({ initialOrder }: FocusedCheckoutCockpitProps) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderData>(initialOrder);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const orderCode = order.orderCode;
  const isPaid = order.status === 'PAID';
  const isUnderpaid = order.status === 'UNDERPAID';
  const isManualReview = order.status === 'MANUAL_REVIEW';
  const isExpired = order.status === 'EXPIRED';
  const isPending = order.status === 'PAYMENT_PENDING';

  // 1-Click Smart Copy with Visual Feedback
  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success('Đã lưu vào bộ nhớ tạm!', {
      icon: <Check className="w-4 h-4 text-emerald-400" />,
    });
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Download TXT credentials file
  const handleDownloadTxt = (dataToSave: string) => {
    const element = document.createElement('a');
    const file = new Blob([dataToSave], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `CHINSTORE_${orderCode}_CREDENTIALS.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Đã tải xuống file thông tin tài khoản!');
  };

  // Auto-polling every 3 seconds while order is not finalized
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
              confetti({
                particleCount: 150,
                spread: 90,
                origin: { y: 0.6 },
                colors: ['#00f0ff', '#10b981', '#a855f7', '#facc15'],
              });
              toast.success(`Thanh toán đơn hàng #${orderCode} thành công!`);
            }
          }
        }
      } catch (err) {
        console.warn('Polling error:', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [order.status, orderCode]);

  // Handle Simulation
  const handleSimulate = async (mode: 'FULL_PAYMENT' | 'UNDERPAID' | 'EXPIRED_LATE') => {
    try {
      setIsSimulating(true);
      const res = await fetch(`/api/orders/${orderCode}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      });
      const data = await res.json();

      // Refetch order
      const orderRes = await fetch(`/api/orders/${orderCode}`);
      const orderData = await orderRes.json();
      if (orderData.success) {
        setOrder(orderData.data);
        if (orderData.data.status === 'PAID') {
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 },
          });
        }
      }
      toast.success(data.message || 'Mô phỏng thành công');
    } catch (e: any) {
      toast.error('Lỗi khi mô phỏng kịch bản');
    } finally {
      setIsSimulating(false);
    }
  };

  const primaryItem = order.items?.[0];
  const product = primaryItem?.product;
  const paymentDetails = order.paymentDetails;

  return (
    <div className="min-h-screen bg-[#07080d] text-slate-100 flex flex-col relative selection:bg-cyan-500 selection:text-black">
      {/* Cockpit Top Bar (Distraction-Free) */}
      <header className="sticky top-0 z-40 bg-[#090d1c]/90 border-b border-white/10 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/shop"
            className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 btn-haptic"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại Shop</span>
          </Link>

          <div className="hidden sm:flex items-center space-x-2">
            <span className="text-sm font-black font-display text-white tracking-wider">
              CHIN<span className="gradient-text-cyan-purple">STORE</span>
            </span>
            <span className="text-[10px] font-mono uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.5 rounded">
              COCKPIT
            </span>
          </div>
        </div>

        {/* Order Identifier Pill */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">Mã đơn hàng:</span>
          <button
            onClick={() => handleCopy(orderCode, 'topOrderCode')}
            className="flex items-center gap-2 px-3 py-1 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold hover:bg-cyan-950 transition-colors btn-haptic"
          >
            <span>#{orderCode}</span>
            {copiedField === 'topOrderCode' ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-cyan-400" />
            )}
          </button>
        </div>
      </header>

      {/* Main Cockpit Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* Cockpit Title & Status Banner */}
        <div className="mb-8 space-y-4">
          <LiveTransactionRadar
            status={order.status}
            gateway={order.gateway}
            orderCode={orderCode}
          />
        </div>

        {/* Two-Column Cockpit Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT COLUMN: ORDER SUMMARY & SPECS ================= */}
          <div className="lg:col-span-5 space-y-6">
            {/* Order Summary Card */}
            <div className="rounded-3xl glass-card border border-white/10 p-6 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>CHI TIẾT ĐƠN HÀNG</span>
                </div>
                <span
                  className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                    isPaid
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : isUnderpaid
                      ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                      : isManualReview
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : isExpired
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Product Info */}
              {product && (
                <div className="flex gap-4 items-start">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shrink-0">
                    <Image
                      src={
                        product.images?.[0] ||
                        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <h3 className="text-base font-bold text-white font-display truncate">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="text-xs font-mono text-slate-300 pt-1">
                      Số lượng: <span className="font-bold text-white">{primaryItem?.quantity || 1}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2.5 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Phương thức:</span>
                  <span className="text-white font-bold">
                    {order.gateway === 'SEPAY' ? 'VietQR (Ngân hàng)' : 'Litecoin (LTC)'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Email người nhận:</span>
                  <span className="text-cyan-300 font-bold truncate max-w-[200px]">
                    {order.customerEmail}
                  </span>
                </div>
                {order.totalLTC && (
                  <div className="flex justify-between text-slate-400">
                    <span>Số lượng LTC:</span>
                    <span className="text-cyan-400 font-bold">{order.totalLTC} LTC</span>
                  </div>
                )}
                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-sm">
                  <span className="text-slate-300 font-sans font-semibold">Tổng thanh toán:</span>
                  <span className="text-lg font-black text-white gradient-text-cyan-purple font-mono">
                    {formatPrice(order.totalVND, 'VND')}
                  </span>
                </div>
              </div>

              {/* Warranty & Delivery Guarantee */}
              <div className="space-y-2 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span>Mã hóa AES-256-GCM bảo vệ kho hàng</span>
                </div>
                <div className="flex items-center gap-2 text-purple-300">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>Chính sách: {product?.warrantyPolicy || 'Bảo hành 1 đổi 1 24h'}</span>
                </div>
              </div>
            </div>

            {/* Step-by-Step Payment Instructions */}
            <div className="rounded-3xl glass-card border border-white/10 p-6 space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Quy trình thanh toán tự động</span>
              </h4>

              <div className="space-y-3 text-xs text-slate-300 font-sans">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono font-bold flex items-center justify-center shrink-0 border border-cyan-500/40">
                    1
                  </div>
                  <p>
                    {order.gateway === 'SEPAY'
                      ? 'Mở ứng dụng Ngân hàng trên điện thoại và chọn Quét mã VietQR ở khung bên phải.'
                      : 'Mở ví điện tử Litecoin (Exodus, Trust Wallet, Binance...) và quét mã QR hoặc dán địa chỉ ví.'}
                  </p>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono font-bold flex items-center justify-center shrink-0 border border-cyan-500/40">
                    2
                  </div>
                  <p>
                    {order.gateway === 'SEPAY'
                      ? 'Kiểm tra nội dung chuyển khoản phải ghi đúng mã '
                      : 'Chuyển chính xác số lượng LTC hiển thị để hệ thống phát hiện 0-conf.'}
                    {order.gateway === 'SEPAY' && (
                      <span className="font-mono text-cyan-400 font-bold bg-cyan-950/60 px-1 py-0.5 rounded border border-cyan-500/30">
                        {orderCode}
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono font-bold flex items-center justify-center shrink-0 border border-cyan-500/40">
                    3
                  </div>
                  <p>
                    Giữ nguyên màn hình. Khi ngân hàng/blockchain xác nhận, dữ liệu tài khoản sẽ lập tức hiển thị ngay tại trang này.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: PAYMENT COCKPIT & LIVE STATUS ================= */}
          <div className="lg:col-span-7 space-y-6">
            {/* ================= SCENARIO 1: PAID STATE (FULFILLMENT) ================= */}
            {isPaid ? (
              <div className="rounded-3xl glass-card border border-emerald-500/40 p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(16,185,129,0.2)] animate-fade-in">
                {/* Celebration Header */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/50 via-teal-950/30 to-black border border-emerald-500/30 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)]">
                    <Sparkles className="w-8 h-8 animate-bounce" />
                  </div>
                  <h2 className="text-2xl font-black text-white font-display">
                    Giao Dịch Đã Hoàn Tất!
                  </h2>
                  <p className="text-xs text-emerald-300 max-w-md mx-auto">
                    Hệ thống đã nhận đủ thanh toán cho đơn hàng #{orderCode}. Dữ liệu tài khoản đã được giải mã AES-256-GCM an toàn bên dưới.
                  </p>
                </div>

                {/* Decrypted Credentials Box */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <span className="font-mono text-cyan-400 font-bold uppercase flex items-center gap-1.5">
                      <KeyRound className="w-4 h-4 text-cyan-400" />
                      <span>Thông tin tài khoản / License Key:</span>
                    </span>
                    <div className="flex items-center gap-2">
                      {order.decryptedData && (
                        <>
                          <button
                            onClick={() => handleCopy(order.decryptedData!, 'decryptedData')}
                            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono flex items-center gap-1.5 transition-all text-white btn-haptic"
                          >
                            {copiedField === 'decryptedData' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span>Copy tất cả</span>
                          </button>
                          <button
                            onClick={() => handleDownloadTxt(order.decryptedData!)}
                            className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-all btn-haptic"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Tải .txt</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-black/80 border border-cyan-500/30 font-mono text-sm text-emerald-300 select-all break-all whitespace-pre-wrap shadow-inner leading-relaxed">
                    {order.decryptedData || 'Đang nạp dữ liệu từ kho mã hóa...'}
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Thời gian thanh toán: {order.paidAt ? new Date(order.paidAt).toLocaleString('vi-VN') : 'Vừa xong'}</span>
                    <span className="text-emerald-400 font-medium">Bảo vệ AES-256-GCM</span>
                  </div>
                </div>

                {/* Print and Continue Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-3 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-semibold text-white transition-all flex items-center justify-center gap-2 btn-haptic"
                  >
                    <Printer className="w-4 h-4 text-slate-400" />
                    <span>In Hóa Đơn Điện Tử</span>
                  </button>
                  <Link
                    href="/shop"
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)] btn-haptic"
                  >
                    <span>Tiếp Tục Mua Sắm</span>
                    <Sparkles className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : isUnderpaid ? (
              /* ================= SCENARIO 2: UNDERPAID ALERT ================= */
              <div className="rounded-3xl glass-card border border-orange-500/40 p-6 sm:p-8 space-y-6 shadow-[0_0_40px_rgba(251,146,60,0.2)] animate-fade-in">
                <div className="p-5 rounded-2xl bg-orange-950/40 border border-orange-500/40 text-center space-y-2">
                  <AlertTriangle className="w-12 h-12 text-orange-400 mx-auto" />
                  <h3 className="text-xl font-bold text-white font-display">
                    Cảnh Báo: Chuyển Khoản Chưa Đủ Số Tiền
                  </h3>
                  <p className="text-xs text-orange-200 max-w-lg mx-auto leading-relaxed">
                    Hệ thống chưa thể giải mã giao hàng tự động vì số tiền nhận được chưa đủ giá trị đơn hàng #{orderCode}.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 text-xs font-mono space-y-2.5">
                  <div className="flex justify-between text-slate-400">
                    <span>Tổng tiền đơn hàng:</span>
                    <span className="text-white font-bold">{formatPrice(order.totalVND, 'VND')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Số tiền đã nhận:</span>
                    <span className="text-emerald-400 font-bold">
                      {formatPrice(Number(order.totalReceived || 0), 'VND')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400 pt-1 border-t border-white/10">
                    <span>Số tiền còn thiếu:</span>
                    <span className="text-rose-400 font-bold text-sm">
                      {formatPrice(Math.max(0, order.totalVND - Number(order.totalReceived || 0)), 'VND')}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-orange-950/20 border border-orange-500/30 text-xs text-orange-200 space-y-2">
                  <p className="font-semibold flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                    <span>Hướng dẫn khắc phục:</span>
                  </p>
                  <p>
                    Vui lòng chuyển tiếp đúng <b>số tiền còn thiếu</b> với <b>CÙNG NỘI DUNG CHUYỂN KHOẢN: {orderCode}</b>. Khi nhận đủ tiền, hệ thống sẽ tự động duyệt đơn ngay!
                  </p>
                </div>
              </div>
            ) : isManualReview || isExpired ? (
              /* ================= SCENARIO 3: MANUAL REVIEW / EXPIRED ================= */
              <div className="rounded-3xl glass-card border border-purple-500/40 p-6 sm:p-8 space-y-6 shadow-[0_0_40px_rgba(168,85,247,0.2)] animate-fade-in">
                <div className="p-5 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-center space-y-2">
                  <AlertTriangle className="w-12 h-12 text-purple-400 mx-auto" />
                  <h3 className="text-xl font-bold text-white font-display">
                    {isManualReview ? 'Đơn Hàng Chờ Xử Lý Thủ Công' : 'Đơn Hàng Đã Hết Hạn'}
                  </h3>
                  <p className="text-xs text-purple-200 max-w-lg mx-auto leading-relaxed">
                    {isManualReview
                      ? 'Khoản tiền của bạn đã được ghi nhận an toàn vào hệ thống sau thời gian giữ chỗ. Kỹ thuật viên sẽ hỗ trợ cấp hàng ngay.'
                      : 'Thời gian 10 phút giữ kho hàng đã kết thúc. Nếu bạn đã chuyển tiền, hệ thống sẽ tự động chuyển sang trạng thái chờ duyệt thủ công.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 text-xs font-mono space-y-2">
                  <div className="flex justify-between text-slate-400">
                    <span>Lý do kiểm tra:</span>
                    <span className="text-purple-300 font-bold">
                      {order.reviewReason || 'Late payment or expired reservation'}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Mã tra cứu:</span>
                    <span className="text-white font-bold">{orderCode}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link
                    href="/shop"
                    className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono text-center transition-all"
                  >
                    Tạo đơn hàng mới
                  </Link>
                </div>
              </div>
            ) : (
              /* ================= SCENARIO 4: PENDING PAYMENT VIEW ================= */
              <div className="rounded-3xl glass-card border border-cyan-500/30 p-6 sm:p-8 space-y-6 shadow-[0_0_40px_rgba(0,240,255,0.15)] animate-fade-in">
                {/* Timer Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-black/40 border border-white/10">
                  <div className="text-center sm:text-left space-y-1">
                    <span className="text-xs font-mono text-cyan-300 font-bold uppercase flex items-center justify-center sm:justify-start gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>THỜI HẠN GIỮ KHO HÀNG (ATOMIC LOCK)</span>
                    </span>
                    <p className="text-xs text-slate-400">
                      Sản phẩm được khóa độc quyền cho bạn trong 10 phút.
                    </p>
                  </div>

                  {/* Radial Progress Countdown Timer */}
                  <RadialCountdownTimer
                    expiresAt={order.expiresAt}
                    totalDurationSeconds={600}
                    onExpire={() => {
                      toast.warning('Thời gian giữ kho đã hết hạn');
                    }}
                  />
                </div>

                {/* Gateway Specific View */}
                {order.gateway === 'SEPAY' && paymentDetails ? (
                  /* ============ VIETQR SEPAY FRAME ============ */
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Left: QR Code Box */}
                    <div className="md:col-span-5 flex flex-col items-center space-y-3">
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

                      <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 bg-cyan-950/50 border border-cyan-500/20 px-3 py-1 rounded-full">
                        <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
                        <span>SePay IPN Listening (3s)</span>
                      </div>
                    </div>

                    {/* Right: Copyable Banking Info */}
                    <div className="md:col-span-7 space-y-2.5 font-mono text-xs">
                      {/* Bank Code */}
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
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 btn-haptic"
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
                        <span className="text-white font-bold uppercase truncate max-w-[170px]">
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
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 btn-haptic"
                        >
                          {copiedField === 'amount' ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Memo (7-char code) */}
                      <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-950/70 to-purple-950/60 border border-cyan-400/50 flex items-center justify-between shadow-[0_0_15px_rgba(0,240,255,0.2)]">
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
                          className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-md transition-all btn-haptic"
                        >
                          {copiedField === 'memo' ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Đã copy</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy memo</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : order.gateway === 'LITECOIN' && paymentDetails ? (
                  /* ============ LITECOIN CRYPTO FRAME ============ */
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Left: QR Code Box */}
                    <div className="md:col-span-5 flex flex-col items-center space-y-3">
                      <div className="p-3 rounded-2xl bg-white shadow-[0_0_30px_rgba(0,240,255,0.3)] border border-cyan-400/50">
                        <QRCodeSVG
                          value={paymentDetails.qrUri || `litecoin:${paymentDetails.address}?amount=${paymentDetails.amountLtc}`}
                          size={200}
                          level="M"
                        />
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 bg-cyan-950/50 border border-cyan-500/20 px-3 py-1 rounded-full">
                        <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
                        <span>LTC Mempool Engine Active</span>
                      </div>
                    </div>

                    {/* Right: LTC Address & Amount */}
                    <div className="md:col-span-7 space-y-3 font-mono text-xs">
                      {/* LTC Amount */}
                      <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-slate-400">Số lượng LTC chính xác:</div>
                          <div className="text-cyan-400 font-bold text-base">
                            {paymentDetails.amountLtc} LTC
                          </div>
                        </div>
                        <button
                          onClick={() => handleCopy(paymentDetails.amountLtc, 'ltcAmount')}
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 btn-haptic"
                        >
                          {copiedField === 'ltcAmount' ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* LTC Address */}
                      <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">Địa chỉ ví nhận Litecoin:</span>
                          <button
                            onClick={() => handleCopy(paymentDetails.address, 'ltcAddress')}
                            className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[11px] flex items-center gap-1 btn-haptic"
                          >
                            {copiedField === 'ltcAddress' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span>Copy ví</span>
                          </button>
                        </div>
                        <div className="text-xs text-white break-all select-all font-bold">
                          {paymentDetails.address}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-200 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Hệ thống hỗ trợ <b>0-conf instant detection</b>. Ngay khi giao dịch xuất hiện trong Mempool, đơn hàng sẽ được kích hoạt!</span>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Simulation Control Panel for Verification */}
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-[#5865F2]" />
                    <span>Sandbox Simulation (Thử nghiệm các kịch bản thực tế):</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleSimulate('FULL_PAYMENT')}
                      disabled={isSimulating}
                      className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-[11px] font-mono font-bold text-emerald-300 transition-all text-center btn-haptic"
                    >
                      Duyệt Đủ Tiền (PAID)
                    </button>
                    <button
                      onClick={() => handleSimulate('UNDERPAID')}
                      disabled={isSimulating}
                      className="p-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-[11px] font-mono font-bold text-orange-300 transition-all text-center btn-haptic"
                    >
                      Thiếu Tiền (Underpaid)
                    </button>
                    <button
                      onClick={() => handleSimulate('EXPIRED_LATE')}
                      disabled={isSimulating}
                      className="p-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-[11px] font-mono font-bold text-purple-300 transition-all text-center btn-haptic"
                    >
                      Trễ Hạn (Late Guard)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
