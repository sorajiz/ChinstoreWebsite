'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/navigation';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/shop/HeroSection';
import LiveActivityTicker from '@/components/shop/LiveActivityTicker';
import FeaturedProductsSection from '@/components/shop/FeaturedProductsSection';
import FlashDealBanner from '@/components/shop/FlashDealBanner';
import CorePillars from '@/components/shop/CorePillars';
import FeaturedCategories from '@/components/shop/FeaturedCategories';
import VouchWall from '@/components/shop/VouchWall';
import TrustBadges from '@/components/shop/TrustBadges';
import FaqSection from '@/components/shop/FaqSection';
import CartDrawer from '@/components/shop/CartDrawer';
import OrderTrackerModal from '@/components/shop/OrderTrackerModal';
import CheckoutModal from '@/components/shop/CheckoutModal';
import QuickViewModal from '@/components/shop/QuickViewModal';
import Footer from '@/components/layout/Footer';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Category, Product } from '@/types';

interface LandingPageClientProps {
  initialCategories?: Category[];
  initialProducts?: Product[];
}

export default function LandingPageClient({
  initialCategories = [],
  initialProducts = [],
}: LandingPageClientProps) {
  const router = useRouter();
  const [isTrackerOpen, setTrackerOpen] = useState(false);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  const handleOrderCreated = (orderData: any) => {
    router.push(`/order/${orderData.orderCode}`);
  };

  const handleQuickCheckout = () => {
    setCheckoutOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Header Navigation */}
      <Navbar onOpenTrackModal={() => setTrackerOpen(true)} />

      {/* 2. Cyber Hero Section */}
      <HeroSection onQuickCheckout={handleQuickCheckout} />

      {/* 3. Live Social Proof Marquee Ticker */}
      <LiveActivityTicker />

      {/* 4. Trending & Featured Products Section */}
      <FeaturedProductsSection
        products={initialProducts}
        categories={initialCategories}
        onQuickCheckout={handleQuickCheckout}
      />

      {/* 5. Cyber Flash Deal & Voucher Banner */}
      <FlashDealBanner />

      {/* 6. Core Pillars (Cursor Spotlight Bento Grid) */}
      <CorePillars />

      {/* 7. Featured Category Niches */}
      <FeaturedCategories />

      {/* 8. Verified Gamer Reviews & Discord Wall */}
      <VouchWall />

      {/* 9. Security & Trust Badges */}
      <TrustBadges />

      {/* 10. Frequently Asked Questions (FAQ) */}
      <FaqSection />

      {/* 11. High-Impact Call-to-Action Banner */}
      <section className="py-20 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl p-8 sm:p-14 overflow-hidden border border-[#E5E1D8] dark:border-[#27272A] bg-white/95 dark:bg-[#18181B]/95 shadow-xl text-center space-y-6">
            {/* Ambient Aurora Glow */}
            <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#5865F2]/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5865F2]/10 border border-[#5865F2]/20 text-[#5865F2] text-xs font-semibold backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>KHO HÀNG TỰ ĐỘNG CẬP NHẬT 24/7</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-sans text-slate-900 dark:text-white tracking-tight leading-tight">
                Sẵn Sàng Nâng Tầm <br />
                <span className="bg-gradient-to-r from-[#5865F2] via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                  Trải Nghiệm Kỹ Thuật Số Của Bạn?
                </span>
              </h2>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-sans max-w-xl mx-auto leading-relaxed">
                Hơn 15,000+ game thủ và nhà sáng tạo nội dung đã tin dùng hệ thống giao dịch tự động của ChinStore. Nhận tài khoản & key tức thì trong vòng 3 đến 5 giây.
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/shop"
                  className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-sm sm:text-base text-white bg-[#5865F2] hover:bg-[#4752C4] shadow-lg shadow-[#5865F2]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  <span>Khám Phá Cửa Hàng Ngay</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>

                <button
                  onClick={() => setTrackerOpen(true)}
                  className="px-6 py-4 rounded-xl border border-[#E5E1D8] dark:border-[#27272A] bg-[#EFECE5]/60 dark:bg-[#202024] hover:bg-[#E5E0D5] dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-bold text-sm transition-all flex items-center gap-2 shadow-xs"
                >
                  <ShieldCheck className="w-4 h-4 text-[#5865F2]" />
                  <span>Tra Cứu Đơn Hàng Cũ</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Drawers & Modals */}
      <CartDrawer onProceedToCheckout={() => setCheckoutOpen(true)} />
      <QuickViewModal onQuickCheckout={handleQuickCheckout} />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onOrderCreated={handleOrderCreated}
      />
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setTrackerOpen(false)}
        onPayPendingOrder={(order) => router.push(`/order/${order.orderCode}`)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
