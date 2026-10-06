'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/navigation';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/shop/HeroSection';
import QuickCategoryPills from '@/components/shop/QuickCategoryPills';
import LiveActivityTicker from '@/components/shop/LiveActivityTicker';
import FeaturedProductsSection from '@/components/shop/FeaturedProductsSection';
import FlashDealBanner from '@/components/shop/FlashDealBanner';
import PlatformTransparencySection from '@/components/shop/PlatformTransparencySection';
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
import ScrollReveal from '@/components/ui/ScrollReveal';
import { ArrowRight } from 'lucide-react';
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

  const handleSelectQuickCategory = (categorySlug: string) => {
    const el = document.getElementById('featured-products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(`/shop?category=${categorySlug}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB] dark:bg-[#09090B] text-zinc-900 dark:text-[#F4F4F5] transition-colors">
      {/* 1. Header Navigation (Fixed Glass, Permanent) */}
      <Navbar onOpenTrackModal={() => setTrackerOpen(true)} />

      {/* 2. Cyber Hero Section */}
      <HeroSection onQuickCheckout={handleQuickCheckout} />

      {/* 3. Image 1: Quick Category Horizontal Strip */}
      <ScrollReveal delayMs={100}>
        <QuickCategoryPills onSelectCategory={handleSelectQuickCategory} />
      </ScrollReveal>

      {/* 4. Live Social Proof Marquee Ticker */}
      <LiveActivityTicker />

      {/* 5. Image 3: Trending & Featured Products Section */}
      <ScrollReveal delayMs={150}>
        <FeaturedProductsSection
          products={initialProducts}
          categories={initialCategories}
          onQuickCheckout={handleQuickCheckout}
        />
      </ScrollReveal>

      {/* 6. Cyber Flash Deal & Voucher Banner */}
      <ScrollReveal delayMs={150}>
        <FlashDealBanner />
      </ScrollReveal>

      {/* 7. Image 2: Platform Transparency Bento Grid (Giao ngay hay 24-48h) */}
      <ScrollReveal delayMs={150}>
        <PlatformTransparencySection />
      </ScrollReveal>

      {/* 8. Core Pillars */}
      <ScrollReveal delayMs={150}>
        <CorePillars />
      </ScrollReveal>

      {/* 9. Featured Category Niches (Minecraft, Discord, Streaming, AI) */}
      <ScrollReveal delayMs={150}>
        <FeaturedCategories />
      </ScrollReveal>

      {/* 10. Verified Gamer Reviews & Discord Wall */}
      <ScrollReveal delayMs={150}>
        <VouchWall />
      </ScrollReveal>

      {/* 11. Security & Trust Badges */}
      <ScrollReveal delayMs={150}>
        <TrustBadges />
      </ScrollReveal>

      {/* 12. Image 4: Onboarding 3 Steps + FAQ Accordion */}
      <ScrollReveal delayMs={150}>
        <FaqSection />
      </ScrollReveal>

      {/* 13. Image 5: Minimalist High-Impact CTA Banner */}
      <ScrollReveal delayMs={150}>
        <section className="py-20 relative z-10 border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-[#09090B]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 py-4">
              <div className="max-w-2xl space-y-3">
                <span className="text-xs font-mono font-bold tracking-wider text-zinc-500 uppercase">
                  {tCta('badge')}
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 dark:text-[#F4F4F5] tracking-tight leading-tight font-sans">
                  {tCta('titlePart1')} <br className="hidden sm:inline" />
                  {tCta('titlePart2')}
                </h2>
                <p className="text-sm sm:text-base text-zinc-600 dark:text-[#94949E] font-normal leading-relaxed">
                  {tCta('subtitle')}
                </p>
              </div>

              <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 shadow-sm transition-all hover:scale-[1.02] active:scale-95"
                >
                  <span>{tCta('exploreStore')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="https://discord.gg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 px-2 py-1 transition-colors"
                >
                  {tCta('trackOldOrder')}
                </a>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

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

      {/* 14. Image 5: Comprehensive Dark & Grey Footer */}
      <Footer />
    </div>
  );
}
