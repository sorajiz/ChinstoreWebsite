'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/shop/HeroSection';
import LiveActivityTicker from '@/components/shop/LiveActivityTicker';
import CorePillars from '@/components/shop/CorePillars';
import FeaturedCategories from '@/components/shop/FeaturedCategories';
import TrustBadges from '@/components/shop/TrustBadges';
import CartDrawer from '@/components/shop/CartDrawer';
import OrderTrackerModal from '@/components/shop/OrderTrackerModal';
import Footer from '@/components/layout/Footer';
import { ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react';

import CheckoutModal from '@/components/shop/CheckoutModal';
import { useRouter } from '@/navigation';

export default function LandingPageClient() {
  const router = useRouter();
  const [isTrackerOpen, setTrackerOpen] = useState(false);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  const handleOrderCreated = (orderData: any) => {
    router.push(`/order/${orderData.orderCode}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <Navbar onOpenTrackModal={() => setTrackerOpen(true)} />

      {/* Hero Section */}
      <HeroSection />

      {/* Live Activity Social Proof Bar */}
      <LiveActivityTicker />

      {/* Core Pillars with Cursor Spotlight Effect */}
      <CorePillars />

      {/* Featured Categories Niches */}
      <FeaturedCategories />

      {/* Trust Badges */}
      <TrustBadges />

      {/* Webflow / Linear Call-to-Action Banner */}
      <section className="py-20 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl p-8 sm:p-14 overflow-hidden border border-white/[0.08] bg-gradient-to-r from-[#0C0E17] via-[#101426] to-[#0C0E17] shadow-[0_0_50px_rgba(99,102,241,0.12)] text-center space-y-6">
            {/* Ambient Aurora Glow */}
            <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-brand-primary/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-brand-secondary/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300 text-xs font-medium backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-brand-emerald animate-pulse" />
                <span>KHO HÀNG TỰ ĐỘNG CẬP NHẬT 24/7</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-sans text-white tracking-tight leading-tight">
                Sẵn Sàng Nâng Tầm <br />
                <span className="bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                  Trải Nghiệm Kỹ Thuật Số Của Bạn?
                </span>
              </h2>

              <p className="text-sm sm:text-base text-slate-400 font-sans max-w-xl mx-auto leading-relaxed">
                Hơn 15,000+ game thủ và nhà sáng tạo nội dung đã tin dùng hệ thống giao dịch tự động của ChinStore. Nhận tài khoản & key tức thì trong vòng 5 giây.
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/shop"
                  className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-sm sm:text-base text-white bg-gradient-to-r from-brand-primary via-indigo-500 to-brand-secondary shadow-[0_0_30px_rgba(99,102,241,0.35)] hover:shadow-[0_0_45px_rgba(99,102,241,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  <span>Khám Phá Cửa Hàng Ngay</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>

                <button
                  onClick={() => setTrackerOpen(true)}
                  className="px-6 py-4 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] text-slate-200 hover:text-white font-semibold text-sm transition-all flex items-center gap-2 backdrop-blur-md btn-haptic"
                >
                  <ShieldCheck className="w-4 h-4 text-brand-secondary" />
                  <span>Tra Cứu Đơn Hàng Cũ</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Drawers & Modals */}
      <CartDrawer onProceedToCheckout={() => setCheckoutOpen(true)} />
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
