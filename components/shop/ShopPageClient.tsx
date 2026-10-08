'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, Link } from '@/navigation';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import ProductCard from '@/components/shop/ProductCard';
import ProductCardSkeleton from '@/components/ui/ProductCardSkeleton';
import QuickViewModal from '@/components/shop/QuickViewModal';
import CartDrawer from '@/components/shop/CartDrawer';
import CheckoutModal from '@/components/shop/CheckoutModal';
import OrderTrackerModal from '@/components/shop/OrderTrackerModal';
import Footer from '@/components/layout/Footer';
import { useStore } from '@/lib/store';
import { Category, Product } from '@/types';
import {
  Search,
  PackageSearch,
  LayoutGrid,
  KeyRound,
  Sparkles,
  Gamepad2,
  Shapes,
} from 'lucide-react';

interface ShopPageClientProps {
  initialCategories: Category[];
  initialProducts: Product[];
}

// 4 Danh mục chuẩn theo yêu cầu của bạn với Icon hiện đại, sắc nét
const FOUR_CATEGORIES = [
  {
    id: 'acc-mfa',
    name: 'Acc MFA',
    Icon: KeyRound,
    colorClass: 'text-amber-500 dark:text-amber-400',
  },
  {
    id: 'nitro-deco',
    name: 'Nitro & Deco',
    Icon: Sparkles,
    colorClass: 'text-violet-500 dark:text-violet-400',
  },
  {
    id: 'mmo',
    name: 'MMo',
    Icon: Gamepad2,
    colorClass: 'text-emerald-500 dark:text-emerald-400',
  },
  {
    id: 'misc',
    name: 'misc',
    Icon: Shapes,
    colorClass: 'text-cyan-500 dark:text-cyan-400',
  },
] as const;

type CategoryId = (typeof FOUR_CATEGORIES)[number]['id'];

// Hàm phân loại sản phẩm chuẩn theo yêu cầu của bạn:
// 1. Acc MFA: Các acc Minecraft bản quyền (FA, Hypixel, Cape)
// 2. Nitro & Deco: Discord Nitro, Deco, Avatar & Server Boosts
// 3. MMo: ChatGPT, Claude, YouTube Premium, Netflix, Spotify, CapCut & App Premium
// 4. misc: Steam CS2 Prime, Valorant và các tài nguyên khác tính sau
function categorizeProduct(product: Product): 'acc-mfa' | 'nitro-deco' | 'mmo' | 'misc' {
  const text = (
    product.name + ' ' +
    (product.category?.name || '') + ' ' +
    (product.category?.slug || '') + ' ' +
    (product.description || '')
  ).toLowerCase();

  // 1. Acc MFA: Độc quyền các tài khoản Minecraft
  if (
    text.includes('minecraft') ||
    text.includes('hypixel') ||
    text.includes('optifine') ||
    text.includes('badlion') ||
    product.category?.slug === 'minecraft-alts'
  ) {
    return 'acc-mfa';
  }

  // 2. Nitro & Deco: Dịch vụ Discord
  if (
    text.includes('nitro') ||
    text.includes('deco') ||
    text.includes('boost') ||
    text.includes('avatar') ||
    text.includes('discord') ||
    product.category?.slug === 'discord-services'
  ) {
    return 'nitro-deco';
  }

  // 3. MMo: ChatGPT, YouTube, Netflix, Spotify, CapCut, App Premium
  if (
    text.includes('chatgpt') ||
    text.includes('claude') ||
    text.includes('youtube') ||
    text.includes('netflix') ||
    text.includes('spotify') ||
    text.includes('capcut') ||
    text.includes('openai') ||
    text.includes('anthropic') ||
    product.category?.slug === 'ai-dev-tools' ||
    product.category?.slug === 'streaming-vpn'
  ) {
    return 'mmo';
  }

  // 4. misc: Steam CS2 Prime, Valorant và các tài nguyên khác
  return 'misc';
}

export default function ShopPageClient({
  initialCategories,
  initialProducts,
}: ShopPageClientProps) {
  const t = useTranslations('shop');
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  // Mặc định chọn ngay chuyên mục "Acc MFA" (Minecraft) theo yêu cầu (đã xóa nút Tất cả)
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('acc-mfa');
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [isTrackerOpen, setTrackerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Tính số lượng sản phẩm cho 4 danh mục
  const counts = useMemo(() => {
    const res: Record<string, number> = {
      'acc-mfa': 0,
      'nitro-deco': 0,
      'mmo': 0,
      'misc': 0,
    };
    initialProducts.forEach((p) => {
      const group = categorizeProduct(p);
      res[group] = (res[group] || 0) + 1;
    });
    return res;
  }, [initialProducts]);

  // Lọc sản phẩm theo danh mục đang chọn
  const filteredProducts = useMemo(() => {
    let list = initialProducts.filter((p) => categorizeProduct(p) === selectedCategory);

    // Lọc theo từ khóa tìm kiếm nếu có nhập
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    return list;
  }, [initialProducts, selectedCategory, searchQuery]);

  const handleQuickCheckout = (product: Product) => {
    setCheckoutOpen(true);
  };

  const handleOrderCreated = (orderData: any) => {
    router.push(`/order/${orderData.orderCode}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-zinc-900 dark:text-white transition-colors duration-200">
      {/* Navbar (Đã gỡ cố định, trôi tự nhiên theo trang) */}
      <Navbar onOpenTrackModal={() => setTrackerOpen(true)} />

      {/* Shop Header Banner (Trong suốt hoàn toàn - Không còn khối đen cộm làm mờ caro) */}
      <section className="relative pt-6 pb-4 sm:pt-8 sm:pb-6 bg-transparent text-zinc-900 dark:text-white transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                <span className="w-3.5 h-[1.5px] bg-zinc-400 dark:bg-zinc-500 inline-block" />
                <span>Cửa hàng</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-sans text-zinc-950 dark:text-white tracking-tight">
                Bảng giá sản phẩm
              </h1>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl font-normal leading-relaxed">
                Tìm món cần mua, xem giá và chọn gói phù hợp. Hàng tự động sẽ hiện trong tài khoản ngay sau khi thanh toán.
              </p>
            </div>

            <div className="self-start md:self-end">
              <div className="px-3.5 py-1.5 rounded-xl bg-white/80 dark:bg-[#141417]/80 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800 text-xs font-mono text-zinc-600 dark:text-zinc-400 shadow-xs">
                <span className="font-bold text-zinc-950 dark:text-white">{filteredProducts.length}</span> sản phẩm
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog View */}
      <main className="flex-1 py-4 sm:py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Thanh Tìm Kiếm & 4 Danh Mục Chuẩn (Acc MFA | Nitro & Deco | MMo | misc) - Sticky đi theo khi cuộn trang (Ảnh 2) */}
          <div className="sticky top-[68px] sm:top-[74px] z-40 p-2 sm:p-2.5 rounded-2xl bg-white/90 dark:bg-[#141417]/95 backdrop-blur-2xl border border-zinc-200/90 dark:border-zinc-800/90 flex flex-col md:flex-row items-stretch md:items-center gap-3 shadow-md dark:shadow-xl transition-all">
            {/* Input Tìm sản phẩm */}
            <div className="relative min-w-[200px] sm:min-w-[240px] md:w-72 shrink-0">
              <Search className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm sản phẩm"
                className="w-full bg-zinc-100/90 dark:bg-[#0e0e11]/90 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl pl-9 pr-3.5 py-2 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
              />
            </div>

            {/* Đúng 4 Danh Mục Chuẩn (Acc MFA | Nitro & Deco | MMo | misc) - Đã xóa nút Tất Cả theo yêu cầu */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none flex-1">
              {FOUR_CATEGORIES.map((cat) => {
                const count = counts[cat.id] || 0;
                const isActive = selectedCategory === cat.id;
                const CatIcon = cat.Icon;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-md scale-102'
                        : 'bg-zinc-100/90 hover:bg-zinc-200/90 text-zinc-600 hover:text-zinc-900 border border-zinc-200/80 dark:bg-[#18181b]/80 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-white dark:border-zinc-800/80'
                    }`}
                  >
                    <CatIcon className={`w-4 h-4 shrink-0 ${isActive ? 'text-inherit' : cat.colorClass}`} />
                    <span>{cat.name}</span>
                    <span className={`text-[11px] px-1.5 py-0.2 rounded-md ${
                      isActive 
                        ? 'bg-white/20 dark:bg-zinc-900/20 text-white dark:text-zinc-950' 
                        : 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Grid: To, bự, rộng rãi & rõ nét theo yêu cầu (1-4 cột rộng thay vì 6 cột ép nhỏ) */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <ProductCardSkeleton key={n} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-24 text-center space-y-4 rounded-3xl bg-white/80 dark:bg-[#141417]/80 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
              <PackageSearch className="w-14 h-14 text-zinc-400 dark:text-zinc-600 mx-auto" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white font-sans">
                {t('noProducts')}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto font-sans">
                Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 font-bold text-xs transition-all cursor-pointer shadow-xs"
                >
                  Xóa từ khóa tìm kiếm
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
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
