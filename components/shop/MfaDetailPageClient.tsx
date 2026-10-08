'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter, Link } from '@/navigation';
import { useLocale } from 'next-intl';
import { useSession } from 'next-auth/react';
import { useStore } from '@/lib/store';
import { MfaAccount } from '@/lib/mfa-data';
import { formatPrice } from '@/lib/utils';
import {
  ArrowLeft,
  X,
  Check,
  ShieldCheck,
  QrCode,
  ShoppingCart,
  Zap,
  Clock,
  UserCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CheckoutModal from '@/components/shop/CheckoutModal';
import CartDrawer from '@/components/shop/CartDrawer';
import AuthModal from '@/components/auth/AuthModal';

interface MfaDetailPageClientProps {
  account: MfaAccount;
}

export default function MfaDetailPageClient({ account }: MfaDetailPageClientProps) {
  const router = useRouter();
  const locale = useLocale();
  const isEn = locale === 'en';
  const { data: session } = useSession();

  const {
    currency,
    addItem,
    setCartOpen,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    setAuthModalOpen,
  } = useStore();

  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  // Tính phí dịch vụ và tổng tiền thanh toán
  const buyerFeePercent = 0.05; // 5% buyer protection fee
  const priceDisplayVND = account.priceVND;
  const buyerFeeVND = Math.round(priceDisplayVND * buyerFeePercent);
  const totalPayVND = priceDisplayVND + buyerFeeVND;

  // Tính tiền USD cho fee breakdown chuẩn Ảnh 2
  const priceUSD = account.priceUSD;
  const buyerFeeUSD = Number((priceUSD * buyerFeePercent).toFixed(2));
  const totalPayUSD = Number((priceUSD + buyerFeeUSD).toFixed(2));

  // Map MfaAccount thành đối tượng Product để thêm vào Cart / Checkout
  const accountProduct = {
    id: account.id,
    name: `Minecraft MFA (${account.maskedName}) - ${account.server}`,
    slug: account.slug,
    description: account.description.join('. '),
    priceVND: totalPayVND,
    price: totalPayVND,
    images: [account.skinImage],
    categoryId: 'minecraft-alts',
    availableCount: account.status === 'AVAILABLE' ? 1 : 0,
    category: {
      id: 'minecraft-alts',
      name: 'Minecraft Accounts & Alts',
      slug: 'minecraft-alts',
      icon: 'Gamepad2',
    },
  };

  const handleAddToCart = () => {
    if (account.status !== 'AVAILABLE') {
      toast.error(isEn ? 'This account is not available for purchase.' : 'Tài khoản này hiện không khả dụng để đặt mua.');
      return;
    }
    addItem(accountProduct as any, 1);
    toast.success(isEn ? `Added ${account.maskedName} to cart` : `Đã thêm ${account.maskedName} vào giỏ hàng`);
  };

  const handleBuyNow = () => {
    if (account.status !== 'AVAILABLE') {
      toast.error(isEn ? 'This account is not available for purchase.' : 'Tài khoản này hiện không khả dụng để đặt mua.');
      return;
    }

    if (!session?.user) {
      toast.info(isEn ? 'Please login with Discord to proceed with instant checkout!' : 'Vui lòng đăng nhập Discord để tiếp tục thanh toán và nhận tài khoản tức thì!');
      router.push('/login');
      return;
    }

    addItem(accountProduct as any, 1);
    setCheckoutOpen(true);
  };

  const handleOrderCreated = (orderData: any) => {
    router.push(`/order/${orderData.orderCode}`);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col selection:bg-brand-primary/30 selection:text-white">
      {/* Sticky Header */}
      <Navbar />

      {/* Main Container - Cuộn lên xuống mượt mà trên Mobile & PC */}
      <main className="flex-1 py-4 sm:py-8 px-3 sm:px-6 max-w-6xl mx-auto w-full space-y-6">
        
        {/* Top Navigation Bar Chuẩn Ảnh 2: [< Back to shop] ... [Minecraft Java + Bedrock MFA] [✕] */}
        <div className="flex items-center justify-between gap-3 text-xs font-mono py-2">
          <Link
            href="/shop?category=minecraft-alts"
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>&lt; {isEn ? 'Back to shop' : 'Quay lại cửa hàng'}</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-[11px] tracking-wide">
              Minecraft Java + Bedrock MFA
            </span>

            <Link
              href="/shop?category=minecraft-alts"
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title={isEn ? "Close" : "Đóng"}
            >
              <X className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Tiêu đề tài khoản: MC******CAPE [CAPE] Chuẩn Ảnh 2 */}
        <div className="flex items-center gap-3 pt-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-mono tracking-tight text-white uppercase">
            {account.maskedName}
          </h1>
          {account.capeType && (
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-black uppercase tracking-wider">
              {account.capeType}
            </span>
          )}
        </div>

        {/* Bố cục 2 cột chuẩn Ảnh 2: Trái (Visual + Description), Phải (Price + Fee + Phương thức + Nút Mua) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ============================================================== */}
          {/* CỘT TRÁI (7 Cột): ẢNH MINECRAFT 3D + BADGES + MÔ TẢ            */}
          {/* ============================================================== */}
          <div className="lg:col-span-7 space-y-5">
            {/* Khung ảnh Skin Minecraft 3D Lớn Chuẩn Ảnh 2 */}
            <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-2xl sm:rounded-3xl bg-[#0f0f14] border border-zinc-800/90 overflow-hidden shadow-2xl flex items-center justify-center group">
              <Image
                src={account.skinImage}
                alt={account.maskedName}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
              />

              {/* Tag thời gian góc trên bên phải: 15m ago */}
              <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-zinc-400 text-[10px] font-mono">
                {account.timeAgo}
              </div>

              {/* Badges góc dưới bên trái: [■ Pan] [■ Common] Chuẩn Ảnh 2 */}
              <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5 pointer-events-none">
                {account.badges.map((b, idx) => (
                  <div
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-[10px] font-mono font-bold text-zinc-200"
                  >
                    <span
                      className={`w-2 h-2.5 rounded-2xs inline-block ${
                        b.color === 'amber'
                          ? 'bg-amber-500'
                          : b.color === 'emerald'
                          ? 'bg-emerald-500'
                          : b.color === 'cyan'
                          ? 'bg-cyan-500'
                          : b.color === 'rose'
                          ? 'bg-rose-500'
                          : 'bg-indigo-500'
                      }`}
                    />
                    <span>{b.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hộp Mô Tả Chuẩn Ảnh 2: DESCRIPTION */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0f0f14] border border-zinc-800/90 space-y-3">
              <div className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                {isEn ? 'DESCRIPTION' : 'MÔ TẢ CHI TIẾT'}
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-zinc-300 font-sans">
                {account.description.map((item, idx) => {
                  let translatedItem = item;
                  if (!isEn) {
                    if (item.includes('Not a family')) translatedItem = 'Không phải acc family hay bị khóa — Sở hữu Minecraft bản quyền (Java + Bedrock)';
                    else if (item.includes('Full access — change email')) translatedItem = 'Full access — đổi email, mật khẩu và thông tin bảo mật chính chủ';
                    else if (item.includes('Instant delivery after payment')) translatedItem = 'Giao hàng tức thì ngay sau khi hoàn tất thanh toán';
                    else if (item.includes('Clean Hypixel history')) translatedItem = 'Lịch sử Hypixel sạch sẽ, không bị cấm hay hạn chế chat';
                    else if (item.includes('Instant delivery via AES-256')) translatedItem = 'Giao tài khoản tức thì qua kho mã hóa an toàn AES-256';
                    else if (item.includes('Xbox GamePass PC')) translatedItem = 'Tài khoản Xbox GamePass PC đang hoạt động bản quyền';
                    else if (item.includes('Includes Minecraft Java')) translatedItem = 'Bao gồm Minecraft Java & Bedrock Edition trọn gói';
                    else if (item.includes('Backed by ChinStore')) translatedItem = 'Bảo hành và hỗ trợ chuẩn theo chính sách ChinStore';
                    else if (item.includes('Equipped with official')) translatedItem = 'Trang bị áo choàng Minecraft chính hãng trên tài khoản';
                  }
                  return (
                    <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                      <span>{translatedItem}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* ============================================================== */}
          {/* CỘT PHẢI (5 Cột): GIÁ + PHÍ + PHƯƠNG THỨC + NÚT MUA            */}
          {/* ============================================================== */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Box Giá & Thanh toán */}
            <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#0f0f14] border border-zinc-800/90 space-y-5 shadow-2xl">
              
              {/* PRICE Header + Status */}
              <div className="space-y-1">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                  {isEn ? 'PRICE' : 'GIÁ SẢN PHẨM'}
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
                    {currency === 'USD' ? `$${account.priceUSD.toFixed(2)}` : formatPrice(account.priceVND, currency)}
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 border ${
                    account.status === 'AVAILABLE'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : account.status === 'RESERVED'
                      ? 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                      : account.status === 'IN_COMING'
                      ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      account.status === 'AVAILABLE'
                        ? 'bg-emerald-500'
                        : account.status === 'RESERVED'
                        ? 'bg-purple-500'
                        : account.status === 'IN_COMING'
                        ? 'bg-cyan-500'
                        : 'bg-rose-500'
                    }`} />
                    <span>
                      {account.status === 'AVAILABLE'
                        ? (isEn ? 'Available' : 'Còn hàng')
                        : account.status === 'RESERVED'
                        ? (isEn ? 'Reserved' : 'Đã đặt chỗ')
                        : account.status === 'IN_COMING'
                        ? (isEn ? 'In Coming' : 'Đang về')
                        : (isEn ? 'Sold' : 'Đã bán')}
                    </span>
                  </div>
                </div>
              </div>

              {/* FEE BREAKDOWN Chuẩn Ảnh 2 */}
              <div className="space-y-2 pt-1 border-t border-zinc-800/80">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                  {isEn ? 'FEE BREAKDOWN' : 'CHI TIẾT THANH TOÁN'}
                </div>
                <div className="space-y-1.5 text-xs font-mono text-zinc-400">
                  <div className="flex justify-between">
                    <span>{isEn ? 'Item price' : 'Giá gốc'}:</span>
                    <span className="text-zinc-200">
                      {currency === 'USD' ? `$${priceUSD.toFixed(2)}` : formatPrice(priceDisplayVND, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isEn ? 'Buyer fee' : 'Phí bảo hiểm'}:</span>
                    <span className="text-zinc-200">
                      {currency === 'USD' ? `$${buyerFeeUSD.toFixed(2)}` : formatPrice(buyerFeeVND, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-zinc-800/60 font-bold text-sm text-white">
                    <span>{isEn ? 'You pay' : 'Tổng thanh toán'}:</span>
                    <span className="text-base text-emerald-400">
                      {currency === 'USD' ? `$${totalPayUSD.toFixed(2)}` : formatPrice(totalPayVND, currency)}
                    </span>
                  </div>
                </div>

                <div className="pt-1 flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  <span>{isEn ? '10-min secure payment window' : 'Cổng thanh toán tự động giữ chỗ 10 phút'}</span>
                </div>
              </div>

              {/* CHỌN PHƯƠNG THỨC THANH TOÁN Chuẩn Ảnh 2 (Không bắn toast làm phiền) */}
              <div className="space-y-2 pt-1 border-t border-zinc-800/80">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                  {isEn ? 'CHOOSE PAYMENT METHOD' : 'CHỌN PHƯƠNG THỨC THANH TOÁN'}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {/* VietQR */}
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('SEPAY')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedPaymentMethod === 'SEPAY'
                        ? 'bg-zinc-850 border-white ring-1 ring-white shadow-xs'
                        : 'bg-[#14141a] border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <QrCode className="w-4 h-4 text-emerald-400" />
                      {selectedPaymentMethod === 'SEPAY' && (
                        <Check className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>
                    <div className="text-xs font-bold text-white mt-1.5">VietQR</div>
                    <div className="text-[10px] text-zinc-400 font-mono">MBBank 5s</div>
                  </button>

                  {/* Litecoin */}
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('LITECOIN')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedPaymentMethod === 'LITECOIN'
                        ? 'bg-zinc-850 border-white ring-1 ring-white shadow-xs'
                        : 'bg-[#14141a] border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm text-cyan-400 font-mono">Ł</span>
                      {selectedPaymentMethod === 'LITECOIN' && (
                        <Check className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>
                    <div className="text-xs font-bold text-white mt-1.5">Litecoin</div>
                    <div className="text-[10px] text-zinc-400 font-mono">On-Chain</div>
                  </button>
                </div>
              </div>

              {/* 2 Nút Mua: [ Buy Now $9.09 ] & [ 🛒 Add to Cart ] Chuẩn Ảnh 2 */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={account.status !== 'AVAILABLE'}
                  className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-zinc-200 text-zinc-950 text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{isEn ? 'Buy Now' : 'Mua Ngay'}</span>
                  <span className="font-mono">
                    {currency === 'USD' ? `$${totalPayUSD.toFixed(2)}` : formatPrice(totalPayVND, currency)}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={account.status !== 'AVAILABLE'}
                  className="w-full py-3 px-6 rounded-2xl bg-[#14141a] hover:bg-[#1a1a22] text-white text-xs sm:text-sm font-bold border border-zinc-800 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{isEn ? 'Add to Cart' : 'Thêm Vào Giỏ Hàng'}</span>
                </button>
              </div>

            </div>

            {/* Seller Info Badge Chuẩn Ảnh 2: Seller #499 [VERIFIED] */}
            <div className="p-4 rounded-2xl bg-[#0f0f14] border border-zinc-800/90 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 font-bold text-xs font-mono">
                  #
                </div>
                <div>
                  <div className="text-xs font-bold text-white font-mono flex items-center gap-2">
                    <span>{account.seller}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
                      VERIFIED
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono">
                    {isEn ? 'Completion rate: 100% (5.0★)' : 'Tỷ lệ hoàn thành: 100% (5.0★)'}
                  </div>
                </div>
              </div>

              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>

          </div>

        </div>

      </main>

      {/* Global Modals */}
      <CartDrawer onProceedToCheckout={() => setCheckoutOpen(true)} />
      <AuthModal />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onOrderCreated={handleOrderCreated}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
