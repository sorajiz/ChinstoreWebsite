'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/navigation';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/shop/HeroSection';
import QuickCategoryPills from '@/components/shop/QuickCategoryPills';
import FeaturedProductsSection from '@/components/shop/FeaturedProductsSection';
import PlatformTransparencySection from '@/components/shop/PlatformTransparencySection';
import FaqSection from '@/components/shop/FaqSection';
import CartDrawer from '@/components/shop/CartDrawer';
import OrderTrackerModal from '@/components/shop/OrderTrackerModal';
import CheckoutModal from '@/components/shop/CheckoutModal';
import QuickViewModal from '@/components/shop/QuickViewModal';
import MfaAccountDetailModal from '@/components/shop/MfaAccountDetailModal';
import AuthModal from '@/components/auth/AuthModal';
import Footer from '@/components/layout/Footer';
import ScrollReveal from '@/components/ui/ScrollReveal';
import RollingArrowButton from '@/components/ui/RollingArrowButton';
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

  const [selectedQuickCategory, setSelectedQuickCategory] = useState<string>('all');

  const handleOrderCreated = (orderData: any) => {
    router.push(`/order/${orderData.orderCode}`);
  };

  const handleQuickCheckout = () => {
    setCheckoutOpen(true);
  };

  const handleSelectQuickCategory = (categorySlug: string) => {
    router.push(`/shop?category=${categorySlug}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB] dark:bg-[#09090B] text-zinc-900 dark:text-[#F4F4F5] transition-colors">
      {/* 1. Header Navigation (Không cố định, lướt tự nhiên theo trang) */}
      <Navbar onOpenTrackModal={() => setTrackerOpen(true)} />

      {/* 2. Cyber Hero Section */}
      <HeroSection onQuickCheckout={handleQuickCheckout} />

      {/* 3. Quick Category Horizontal Strip - Bấm chuyển sang trang shop */}
      <ScrollReveal delayMs={100}>
        <QuickCategoryPills
          onSelectCategory={handleSelectQuickCategory}
        />
      </ScrollReveal>

      {/* 4. Trending & Featured Products Section (Clean 4 Cards + 'Khám phá sản phẩm →') */}
      <ScrollReveal delayMs={150}>
        <FeaturedProductsSection
          products={initialProducts}
          categories={initialCategories}
          onQuickCheckout={handleQuickCheckout}
        />
      </ScrollReveal>

      {/* 5. Platform Transparency Bento Grid (Bilingual ChinStore Guarantee) */}
      <ScrollReveal delayMs={150}>
        <PlatformTransparencySection />
      </ScrollReveal>

      {/* 6. Onboarding 3 Steps + FAQ Accordion */}
      <ScrollReveal delayMs={150}>
        <FaqSection />
      </ScrollReveal>

      {/* 7. Minimalist High-Impact CTA Banner (Refined Authentic Copy) */}
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
                <RollingArrowButton href="/shop">
                  {tCta('exploreStore')}
                </RollingArrowButton>

                <a
                  href="https://discord.gg/mSG6dR4JMv"
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
      <MfaAccountDetailModal onQuickCheckout={handleQuickCheckout} />
      <AuthModal />
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

      {/* 8. Comprehensive Dark & Grey Footer with Jump Links */}
      <Footer />
    </div>
  );
}
