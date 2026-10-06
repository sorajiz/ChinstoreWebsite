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
  const tCta = useTranslations('cta');
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
          <div className="relative rounded-3xl p-8 sm:p-14 overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#121215]/95 shadow-xl text-center space-y-6">
            {/* Ambient Glow */}
            <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-zinc-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-zinc-700/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-200/80 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700/80 text-zinc-800 dark:text-zinc-200 text-xs font-semibold backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{tCta('badge')}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-sans text-zinc-950 dark:text-white tracking-tight leading-tight">
                {tCta('titlePart1')} <br />
                <span className="text-zinc-600 dark:text-zinc-400 font-extrabold">
                  {tCta('titlePart2')}
                </span>
              </h2>

              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans max-w-xl mx-auto leading-relaxed">
                {tCta('subtitle')}
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/shop"
                  className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-sm sm:text-base text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  <span>{tCta('exploreStore')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>

                <button
                  onClick={() => setTrackerOpen(true)}
                  className="px-6 py-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-sm transition-all flex items-center gap-2 shadow-xs active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4 text-zinc-500" />
                  <span>{tCta('trackOldOrder')}</span>
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
