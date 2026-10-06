'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/navigation';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import ProductFilter from '@/components/shop/ProductFilter';
import ProductCard from '@/components/shop/ProductCard';
import ProductCardSkeleton from '@/components/ui/ProductCardSkeleton';
import QuickViewModal from '@/components/shop/QuickViewModal';
import CartDrawer from '@/components/shop/CartDrawer';
import CheckoutModal from '@/components/shop/CheckoutModal';
import OrderTrackerModal from '@/components/shop/OrderTrackerModal';
import Footer from '@/components/layout/Footer';
import { useStore } from '@/lib/store';
import { Category, Product } from '@/types';
import { Sparkles, PackageSearch, ShieldCheck, Flame, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface ShopPageClientProps {
  initialCategories: Category[];
  initialProducts: Product[];
}

export default function ShopPageClient({
  initialCategories,
  initialProducts,
}: ShopPageClientProps) {
  const t = useTranslations('shop');
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    searchQuery,
    activeCategory,
    setActiveCategory,
    sortOption,
    inStockOnly,
    maxPrice,
  } = useStore();

  // Read URL query param ?category=xxx if present
  useEffect(() => {
    const catQuery = searchParams.get('category');
    if (catQuery) {
      setActiveCategory(catQuery);
    }
  }, [searchParams, setActiveCategory]);

  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [isTrackerOpen, setTrackerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

    // Filter by Max Price
    if (maxPrice < 50000000) {
      list = list.filter((p) => p.priceVND <= maxPrice);
    }

    // Sort
    if (sortOption === 'popular') {
      list.sort((a, b) => (b.availableCount ?? 0) - (a.availableCount ?? 0));
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
  }, [initialProducts, activeCategory, searchQuery, inStockOnly, maxPrice, sortOption]);

  const handleQuickCheckout = (product: Product) => {
    setCheckoutOpen(true);
  };

  const handleOrderCreated = (orderData: any, paymentDetails: any) => {
    // Navigate directly to Focused Checkout Cockpit
    router.push(`/order/${orderData.orderCode}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar onOpenTrackModal={() => setTrackerOpen(true)} />

      {/* Shop Header Banner */}
      <section className="relative pt-10 pb-8 sm:pt-14 sm:pb-12 border-b border-white/[0.06] bg-[#08090E]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">
              Trang Chủ
            </Link>
            <span>/</span>
            <span className="text-indigo-300 font-semibold">Cửa Hàng Số (Marketplace)</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300 text-xs font-medium">
                <span className="flex h-2 w-2 rounded-full bg-brand-emerald animate-pulse" />
                <span>KHO SẢN PHẨM SỐ CHÍNH HÃNG</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-sans text-white tracking-tight">
                Kho Tài Khoản &{' '}
                <span className="bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                  Sản Phẩm Số
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                Tự động giao hàng tức thì trong 3-5 giây sau khi thanh toán VietQR SePay hoặc Litecoin (LTC).
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 bg-white/[0.03] p-3 rounded-2xl border border-white/[0.06] backdrop-blur-md shrink-0">
              <ShieldCheck className="w-4 h-4 text-brand-emerald" />
              <span>Khóa kho hàng nguyên tử (Atomic 10m)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog View */}
      <main className="flex-1 py-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Sticky Filter Bar */}
          <div className="sticky top-20 z-30 pt-2">
            <ProductFilter
              categories={initialCategories}
              totalResults={initialProducts.length}
            />
          </div>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span>
              Hiển thị <span className="text-cyan-400 font-bold">{filteredProducts.length}</span>{' '}
              sản phẩm khả dụng
            </span>
            {activeCategory !== 'all' && (
              <button
                onClick={() => setActiveCategory('all')}
                className="text-purple-400 hover:underline"
              >
                Xóa lọc danh mục ({activeCategory})
              </button>
            )}
          </div>

          {/* Product Grid with Framer Motion AnimatePresence */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <ProductCardSkeleton key={n} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-24 text-center space-y-4 rounded-3xl glass-card border border-white/10">
              <PackageSearch className="w-14 h-14 text-slate-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-300 font-display">
                {t('noProducts')}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-sans">
                Thử thay đổi khoảng giá hoặc từ khóa tìm kiếm của bạn.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                }}
                className="px-5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-mono border border-cyan-500/30 transition-all"
              >
                Xem tất cả sản phẩm
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {filteredProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onQuickCheckout={handleQuickCheckout}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>

      {/* Global Drawers & Modals */}
      <CartDrawer onProceedToCheckout={() => setCheckoutOpen(true)} />
      <QuickViewModal onQuickCheckout={() => setCheckoutOpen(true)} />

      {/* Checkout Form Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onOrderCreated={handleOrderCreated}
      />

      {/* Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setTrackerOpen(false)}
        onPayPendingOrder={(order) => {
          router.push(`/order/${order.orderCode}`);
        }}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
