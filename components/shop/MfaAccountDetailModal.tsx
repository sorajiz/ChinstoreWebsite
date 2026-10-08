'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import { Product, PaymentMethod } from '@/types';
import {
  ArrowLeft,
  Check,
  ShieldCheck,
  Star,
  Zap,
  Lock,
  Share2,
  ShoppingCart,
  QrCode,
  Sparkles,
  ExternalLink,
  ChevronDown,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

interface MfaAccountDetailModalProps {
  onQuickCheckout?: (product: Product) => void;
}

export default function MfaAccountDetailModal({ onQuickCheckout }: MfaAccountDetailModalProps) {
  const { data: session } = useSession();
  const locale = useLocale();
  const isEn = locale === 'en';

  const {
    viewMfaProduct,
    setViewMfaProduct,
    addItem,
    currency,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    setAuthModalOpen,
  } = useStore();

  const [activeStatsTab, setActiveStatsTab] = useState<
    'BEDWARS' | 'SKYWARS' | 'DUELS' | 'SKYBLOCK' | 'DONUT'
  >('BEDWARS');

  if (!viewMfaProduct) return null;

  const product = viewMfaProduct;
  const isOutOfStock = (product.availableCount ?? 1) <= 0;

  // Masked Account Name chuẩn Ảnh 2 & 3
  const slug = product.slug || '';
  let maskedName = 'Sa*******9';
  let rankBadge = 'NON';
  if (slug.includes('hypixel')) {
    maskedName = 'HY******MVP';
    rankBadge = 'MVP+';
  } else if (slug.includes('optifine') || slug.includes('cape')) {
    maskedName = 'MC******CAPE';
    rankBadge = 'CAPE';
  }

  // Hình ảnh skin Minecraft chuẩn Ảnh 2 & 3
  let skinImage = product.images?.[0] || '/images/minecraft/skin-suit.jpg';
  if (slug.includes('hypixel')) {
    skinImage = '/images/minecraft/hypixel-mvp.jpg';
  } else if (slug.includes('optifine') || slug.includes('cape')) {
    skinImage = '/images/minecraft/optifine-cape.jpg';
  }

  // Tính phí người mua
  const basePriceVND = product.priceVND || product.price || 150000;
  const buyerFeeVND = Math.round(basePriceVND * 0.05); // 5% buyer fee
  const totalPayVND = basePriceVND + buyerFeeVND;

  const handleAddToCart = () => {
    addItem(product, 1);
    toast.success(isEn ? `Added ${maskedName} to cart` : `Đã thêm ${maskedName} vào giỏ hàng`);
  };

  const handleBuyNow = () => {
    // Nếu chưa login -> Bật modal login Discord chuẩn yêu cầu
    if (!session?.user) {
      toast.info(isEn ? 'Please login with Discord to proceed with checkout!' : 'Vui lòng đăng nhập để tiếp tục thanh toán và nhận tài khoản tức thì!');
      setAuthModalOpen(true);
      return;
    }

    addItem(product, 1);
    setViewMfaProduct(null);
    if (onQuickCheckout) {
      onQuickCheckout(product);
    }
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success(isEn ? 'Copied account link to clipboard!' : 'Đã sao chép liên kết tài khoản vào bộ nhớ tạm!');
    }
  };

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setViewMfaProduct(null)}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
      />

      {/* Modal Container: Fullscreen on mobile, rounded card on PC */}
      <div className="relative w-full max-w-6xl bg-[#090A0F] border border-zinc-800 rounded-none sm:rounded-3xl shadow-2xl z-10 my-auto min-h-screen sm:min-h-0 sm:max-h-[92vh] flex flex-col overflow-hidden text-white">
        
        {/* Top Sticky Bar */}
        <div className="p-4 sm:p-5 border-b border-zinc-800/80 bg-[#0E1017]/90 backdrop-blur-md flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => setViewMfaProduct(null)}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>&lt; {isEn ? 'Back to shop' : 'Quay lại cửa hàng'}</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
              Minecraft Java + Bedrock MFA
            </span>
            <button
              type="button"
              onClick={() => setViewMfaProduct(null)}
              className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-8">
          
          {/* Title Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-mono tracking-tight text-white flex items-center gap-3">
              <span>{maskedName}</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {rankBadge}
              </span>
            </h1>
          </div>

          {/* 2-Column Grid: Left (Skin, Description, Capes, Details, Stats) | Right (Price, Multi-select Gateway, Seller) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* CỘT TRÁI (8 CỘT) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              
              {/* 1. Minecraft 3D Character Skin Card */}
              <div className="relative w-full aspect-video sm:aspect-[16/9] rounded-2xl bg-[#0F111A] border border-zinc-800/90 overflow-hidden flex items-center justify-center group">
                <Image
                  src={skinImage}
                  alt={maskedName}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />

                {/* Badge time top right */}
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-mono text-zinc-400 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
                    15m ago
                  </span>
                </div>

                {/* Badge Capes góc dưới bên trái */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                  <div className="px-2 py-1 rounded bg-black/70 backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                    <span className="w-2.5 h-3.5 bg-amber-500 rounded-xs inline-block" />
                    <span className="text-[10px] font-mono font-bold text-amber-400">Pan</span>
                  </div>
                  <div className="px-2 py-1 rounded bg-black/70 backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                    <span className="w-2.5 h-3.5 bg-emerald-500 rounded-xs inline-block" />
                    <span className="text-[10px] font-mono font-bold text-emerald-400">Common</span>
                  </div>
                </div>
              </div>

              {/* 2. DESCRIPTION */}
              <div className="p-5 rounded-2xl bg-[#0F111A] border border-zinc-800/90 space-y-2.5">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                  {isEn ? 'DESCRIPTION' : 'MÔ TẢ CHI TIẾT'}
                </h3>
                <ul className="space-y-1.5 text-xs sm:text-sm text-zinc-300 font-sans">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{isEn ? 'Not a family or locked account — Has Minecraft Account (Java + Bedrock)' : 'Không phải acc family hay bị khóa — Sở hữu Minecraft bản quyền (Java + Bedrock)'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{isEn ? 'Full access — change email, password, and security settings' : 'Full access — đổi email, mật khẩu và thông tin bảo mật chính chủ'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{isEn ? 'Instant delivery after payment confirms' : 'Giao hàng tức thì ngay sau khi hoàn tất thanh toán'}</span>
                  </li>
                </ul>
              </div>

              {/* 3. CAPES */}
              <div className="p-5 rounded-2xl bg-[#0F111A] border border-zinc-800/90 space-y-2.5">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                  {isEn ? 'CAPES' : 'ÁO CHOÀNG (CAPES)'}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-xl bg-zinc-850 border border-zinc-700/80 flex items-center gap-2">
                    <span className="w-3 h-4 bg-amber-500 rounded-xs" />
                    <span className="text-xs font-mono font-bold text-zinc-200">Pan</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-zinc-850 border border-zinc-700/80 flex items-center gap-2">
                    <span className="w-3 h-4 bg-emerald-500 rounded-xs" />
                    <span className="text-xs font-mono font-bold text-zinc-200">Common</span>
                  </div>
                </div>
              </div>

              {/* 4. ACCOUNT DETAILS */}
              <div className="p-5 rounded-2xl bg-[#0F111A] border border-zinc-800/90 space-y-3">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                  {isEn ? 'ACCOUNT DETAILS' : 'CHI TIẾT TÀI KHOẢN'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-[#141622] border border-zinc-800 flex items-center justify-between">
                    <span className="text-zinc-400">Hypixel</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Unbanned
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#141622] border border-zinc-800 flex items-center justify-between">
                    <span className="text-zinc-400">DonutSMP</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold">
                      Unknown
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#141622] border border-zinc-800 flex items-center justify-between">
                    <span className="text-zinc-400">{isEn ? 'Name Change' : 'Đổi tên'}</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#141622] border border-zinc-800 flex items-center justify-between">
                    <span className="text-zinc-400">{isEn ? 'Region' : 'Khu vực'}</span>
                    <span className="text-zinc-200 font-bold">Global</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#141622] border border-zinc-800 flex items-center justify-between">
                    <span className="text-zinc-400">MS Rewards</span>
                    <span className="text-zinc-200 font-bold">122 pts</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#141622] border border-zinc-800 flex items-center justify-between">
                    <span className="text-zinc-400">{isEn ? 'Created' : 'Ngày tạo'}</span>
                    <span className="text-zinc-200 font-bold">Feb 28, 2024</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#141622] border border-zinc-800 flex items-center justify-between sm:col-span-2">
                    <span className="text-zinc-400">{isEn ? 'Purchases' : 'Lượt mua'}</span>
                    <span className="text-zinc-200 font-bold flex items-center gap-1">
                      29 <ChevronDown className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. ACCOUNT STATS TABS (Ảnh 3) */}
              <div className="p-5 rounded-2xl bg-[#0F111A] border border-zinc-800/90 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                    {isEn ? 'ACCOUNT STATS' : 'CHỈ SỐ TÀI KHOẢN'}
                  </h3>
                </div>

                {/* Tabs: BEDWARS | SKYWARS | DUELS | SKYBLOCK | DONUT */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-zinc-800">
                  {(['BEDWARS', 'SKYWARS', 'DUELS', 'SKYBLOCK', 'DONUT'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveStatsTab(tab)}
                      className={`pb-2 px-3 text-xs font-mono font-bold tracking-wider transition-colors cursor-pointer border-b-2 ${
                        activeStatsTab === tab
                          ? 'border-rose-500 text-rose-400'
                          : 'border-transparent text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* BedWars Stats Box chuẩn Ảnh 3 */}
                <div className="p-4 sm:p-5 rounded-xl bg-[#141622] border border-zinc-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
                    <div>
                      <h4 className="text-sm sm:text-base font-black font-mono text-zinc-100">
                        [{rankBadge}] {maskedName}
                      </h4>
                      <p className="text-xs font-mono text-zinc-400 mt-0.5">
                        Level: <span className="text-zinc-200 font-bold">[0 ★]</span> • EXP Progress:{' '}
                        <span className="text-emerald-400 font-bold">0/5,000</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono">
                      <span className="text-emerald-400">• Tokens: 0</span>
                      <span className="text-zinc-400">• Iron: 0</span>
                      <span className="text-amber-400">• Gold: 0</span>
                      <span className="text-cyan-400">• Diamonds: 0</span>
                      <span className="text-emerald-400">• Emeralds: 0</span>
                    </div>
                  </div>

                  {/* BedWars Stats Grid */}
                  <div className="space-y-2">
                    <div className="text-xs font-mono font-bold text-rose-400 uppercase">
                      {activeStatsTab} Stats (Overall)
                    </div>
                    <div className="grid grid-cols-3 gap-2.5 text-center font-mono">
                      <div className="p-2.5 rounded-lg bg-[#0F111A] border border-zinc-800">
                        <div className="text-[10px] text-emerald-400 uppercase font-bold">Wins</div>
                        <div className="text-base font-black text-white mt-0.5">0</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#0F111A] border border-zinc-800">
                        <div className="text-[10px] text-rose-400 uppercase font-bold">Losses</div>
                        <div className="text-base font-black text-white mt-0.5">0</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#0F111A] border border-zinc-800">
                        <div className="text-[10px] text-amber-400 uppercase font-bold">WLR</div>
                        <div className="text-base font-black text-white mt-0.5">0</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#0F111A] border border-zinc-800">
                        <div className="text-[10px] text-emerald-400 uppercase font-bold">Final Kills</div>
                        <div className="text-base font-black text-white mt-0.5">0</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#0F111A] border border-zinc-800">
                        <div className="text-[10px] text-rose-400 uppercase font-bold">Final Deaths</div>
                        <div className="text-base font-black text-white mt-0.5">0</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#0F111A] border border-zinc-800">
                        <div className="text-[10px] text-amber-400 uppercase font-bold">FKDR</div>
                        <div className="text-base font-black text-white mt-0.5">0</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* CỘT PHẢI (5 CỘT): Giá tiền, Multi-select cổng thanh toán, Seller */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-5 lg:sticky lg:top-6">
              
              {/* 1. Price Card & Fee Breakdown */}
              <div className="p-6 rounded-3xl bg-[#0F111A] border border-zinc-800/90 shadow-xl space-y-5">
                <div>
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                    {isEn ? 'PRICE' : 'GIÁ SẢN PHẨM'}
                  </div>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
                      {formatPrice(basePriceVND, currency)}
                    </span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      {isEn ? 'Available' : 'Còn hàng'}
                    </span>
                  </div>
                </div>

                {/* FEE BREAKDOWN */}
                <div className="space-y-2 pt-3 border-t border-zinc-800/80 text-xs font-mono">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    {isEn ? 'FEE BREAKDOWN' : 'CHI TIẾT THANH TOÁN'}
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>{isEn ? 'Item price' : 'Giá gốc'}</span>
                    <span className="text-zinc-200">{formatPrice(basePriceVND, currency)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>{isEn ? 'Buyer fee' : 'Phí bảo vệ'}</span>
                    <span className="text-zinc-200">{formatPrice(buyerFeeVND, currency)}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold pt-2 border-t border-zinc-800/80 text-sm">
                    <span>{isEn ? 'You pay' : 'Tổng thanh toán'}</span>
                    <span className="text-white font-black">{formatPrice(totalPayVND, currency)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 pt-1 font-sans">
                    <Check className="w-3.5 h-3.5" />
                    <span>{isEn ? '10-min secure payment window' : 'Cổng thanh toán tự động giữ chỗ 10 phút'}</span>
                  </div>
                </div>

                {/* Multi-select Chọn loại thanh toán tự động (Đồng bộ tương ứng với Checkout) */}
                <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                    {isEn ? 'CHOOSE PAYMENT METHOD' : 'CHỌN PHƯƠNG THỨC THANH TOÁN'}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {/* VietQR */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPaymentMethod('SEPAY');
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedPaymentMethod === 'SEPAY'
                          ? 'bg-zinc-850 border-white ring-1 ring-white shadow-xs'
                          : 'bg-[#141622] border-zinc-800 hover:border-zinc-700'
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

                    {/* Litecoin LTC */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPaymentMethod('LITECOIN');
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedPaymentMethod === 'LITECOIN'
                          ? 'bg-zinc-850 border-white ring-1 ring-white shadow-xs'
                          : 'bg-[#141622] border-zinc-800 hover:border-zinc-700'
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

                {/* Nút Mua Ngay & Thêm vào giỏ */}
                <div className="space-y-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-zinc-200 active:scale-98 text-zinc-950 font-black text-sm flex items-center justify-between transition-all shadow-lg shadow-white/10 cursor-pointer disabled:opacity-50"
                  >
                    <span>{isEn ? 'Buy Now' : 'Mua Ngay'}</span>
                    <span className="px-2.5 py-1 rounded-xl bg-zinc-900 text-white font-mono text-xs font-black">
                      {formatPrice(totalPayVND, currency)}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full py-3 px-4 rounded-2xl bg-zinc-850 hover:bg-zinc-800 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-zinc-700/80"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{isEn ? 'Add to Cart' : 'Thêm Vào Giỏ'}</span>
                  </button>
                </div>
              </div>

              {/* 2. Seller Card */}
              <div className="p-5 rounded-3xl bg-[#0F111A] border border-zinc-800/90 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold font-mono text-sm text-zinc-300">
                      C
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">Seller #499</span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">
                          VERIFIED
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-amber-400 font-mono mt-0.5">
                        <span>★★★★★</span>
                        <span className="text-zinc-400">4.9</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                  {isEn ? 'Verified seller • Escrow protected by ChinStore Automated Security' : 'Người bán uy tín • Bảo vệ bởi hệ thống ChinStore'}
                </p>

                <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-zinc-800/80 font-mono">
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase">{isEn ? 'Rating' : 'Đánh giá'}</div>
                    <div className="text-xs font-bold text-white mt-0.5">★ 4.9</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase">{isEn ? 'Sales' : 'Đã bán'}</div>
                    <div className="text-xs font-bold text-white mt-0.5">122</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase">{isEn ? 'Delivery' : 'Bàn giao'}</div>
                    <div className="text-xs font-bold text-emerald-400 mt-0.5">{isEn ? 'Instant' : 'Tức thì'}</div>
                  </div>
                </div>
              </div>

              {/* 3. Actions Footer */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0F111A] hover:bg-zinc-850 text-zinc-400 hover:text-white text-xs font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer border border-zinc-800"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Share This Listing' : 'Chia sẻ bài đăng'}</span>
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 font-mono text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{isEn ? 'Crypto • Instant Delivery • Secure' : 'Crypto • Giao tức thì • An toàn 100%'}</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
