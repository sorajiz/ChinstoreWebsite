'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/shop/HeroSection';
import TrustBadges from '@/components/shop/TrustBadges';
import ProductFilter from '@/components/shop/ProductFilter';
import ProductCard from '@/components/shop/ProductCard';
import QuickViewModal from '@/components/shop/QuickViewModal';
import CartDrawer from '@/components/shop/CartDrawer';
import CheckoutModal from '@/components/shop/CheckoutModal';
import SepayPaymentView from '@/components/payment/SepayPaymentView';
import LitecoinPaymentView from '@/components/payment/LitecoinPaymentView';
import OrderTrackerModal from '@/components/shop/OrderTrackerModal';
import Footer from '@/components/layout/Footer';
import { useStore } from '@/lib/store';
import { Category, Product } from '@/types';
import { Sparkles, PackageSearch } from 'lucide-react';

interface StorePageClientProps {
  initialCategories: Category[];
  initialProducts: Product[];
}

export default function StorePageClient({
  initialCategories,
  initialProducts,
}: StorePageClientProps) {
  const t = useTranslations('shop');
  const {
    searchQuery,
    activeCategory,
    sortOption,
    inStockOnly,
  } = useStore();

  // Modals state
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [isTrackerOpen, setTrackerOpen] = useState(false);
  const [activePaymentOrder, setActivePaymentOrder] = useState<any>(null);
  const [activePaymentDetails, setActivePaymentDetails] = useState<any>(null);

  // Filtered & Sorted products computation
  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    // Filter by Category
    if (activeCategory && activeCategory !== 'all') {
      list = list.filter((p) => p.category?.slug === activeCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Filter by In-Stock
    if (inStockOnly) {
      list = list.filter((p) => (p.availableCount ?? 1) > 0);
    }

    // Sort
    if (sortOption === 'popular') {
      list.sort((a, b) => ((b.availableCount ?? 0) - (a.availableCount ?? 0)));
    } else if (sortOption === 'newest') {
      list.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
    } else if (sortOption === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [initialProducts, activeCategory, searchQuery, inStockOnly, sortOption]);

  // Handlers
  const handleQuickCheckout = (product: Product) => {
    setCheckoutOpen(true);
  };

  const handleOrderCreated = (orderData: any, paymentDetails: any) => {
    setActivePaymentOrder(orderData);
    setActivePaymentDetails(paymentDetails);
  };

  const handlePayPendingFromTracker = (order: any, paymentDetails: any) => {
    setActivePaymentOrder(order);
    setActivePaymentDetails(paymentDetails);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar onOpenTrackModal={() => setTrackerOpen(true)} />

      {/* Hero Section */}
      <HeroSection />

      {/* Trust Badges */}
      <TrustBadges />

      {/* Main Catalog Section */}
      <main id="catalog" className="flex-1 py-16 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Section Header */}
          <div className="text-center sm:text-left space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>COLLECTION 2026</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight">
              {t('title')}
            </h2>
            <p className="text-sm text-slate-400 max-w-xl">
              {t('subtitle')}
            </p>
          </div>

          {/* Filter Bar */}
          <ProductFilter
            categories={initialCategories}
            totalResults={initialProducts.length}
          />

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4 rounded-3xl glass-card border border-white/5">
              <PackageSearch className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-300 font-display">
                {t('noProducts')}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-sans">
                Thử đổi từ khóa tìm kiếm hoặc chọn danh mục khác.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onQuickCheckout={handleQuickCheckout}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Drawers & Modals */}
      <CartDrawer onProceedToCheckout={() => setCheckoutOpen(true)} />
      <QuickViewModal onQuickCheckout={() => setCheckoutOpen(true)} />

      {/* Checkout Form Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onOrderCreated={handleOrderCreated}
      />

      {/* SePay VietQR Payment View */}
      {activePaymentOrder &&
        activePaymentOrder.paymentMethod === 'SEPAY' &&
        activePaymentDetails && (
          <SepayPaymentView
            order={activePaymentOrder}
            paymentDetails={activePaymentDetails}
            onClose={() => {
              setActivePaymentOrder(null);
              setActivePaymentDetails(null);
            }}
          />
        )}

      {/* Litecoin Crypto Payment View */}
      {activePaymentOrder &&
        activePaymentOrder.paymentMethod === 'LITECOIN' &&
        activePaymentDetails && (
          <LitecoinPaymentView
            order={activePaymentOrder}
            paymentDetails={activePaymentDetails}
            onClose={() => {
              setActivePaymentOrder(null);
              setActivePaymentDetails(null);
            }}
          />
        )}

      {/* Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setTrackerOpen(false)}
        onPayPendingOrder={handlePayPendingFromTracker}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
