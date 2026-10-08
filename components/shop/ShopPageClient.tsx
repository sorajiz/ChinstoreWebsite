'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, Link } from '@/navigation';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import ProductCard from '@/components/shop/ProductCard';
import ProductCardSkeleton from '@/components/ui/ProductCardSkeleton';
import QuickViewModal from '@/components/shop/QuickViewModal';
import MfaAccountDetailModal from '@/components/shop/MfaAccountDetailModal';
import AuthModal from '@/components/auth/AuthModal';
import CartDrawer from '@/components/shop/CartDrawer';
import CheckoutModal from '@/components/shop/CheckoutModal';
import OrderTrackerModal from '@/components/shop/OrderTrackerModal';
import Footer from '@/components/layout/Footer';
import { useStore } from '@/lib/store';
import { Category, Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { MFA_ACCOUNTS_DATA, MfaAccount } from '@/lib/mfa-data';
import {
  Search,
  PackageSearch,
  LayoutGrid,
  KeyRound,
  Sparkles,
  Gamepad2,
  Shapes,
  X,
  Star,
  BarChart2,
  Heart,
  ExternalLink,
  ShoppingCart,
  ChevronDown,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';

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

// Hàm phân loại sản phẩm
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

  // 2. Nitro & Deco: Discord Nitro, Deco, Avatar & Server Boosts
  if (
    text.includes('discord') ||
    text.includes('nitro') ||
    text.includes('deco') ||
    text.includes('avatar') ||
    text.includes('boost') ||
    product.category?.slug === 'discord-services'
  ) {
    return 'nitro-deco';
  }

  // 3. MMo: ChatGPT, Claude, YouTube, Netflix, Spotify, CapCut, App Premium & Streaming
  if (
    text.includes('netflix') ||
    text.includes('spotify') ||
    text.includes('youtube') ||
    text.includes('chatgpt') ||
    text.includes('claude') ||
    text.includes('capcut') ||
    text.includes('stream') ||
    text.includes('ai') ||
    product.category?.slug === 'streaming-vpn' ||
    product.category?.slug === 'ai-dev-tools'
  ) {
    return 'mmo';
  }

  // 4. misc: Game & ứng dụng khác (Steam CS2 Prime, Valorant,...)
  return 'misc';
}

export default function ShopPageClient({
  initialCategories,
  initialProducts,
}: ShopPageClientProps) {
  const t = useTranslations('shop');
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    currency,
    addItem,
    setViewMfaProduct,
    setAuthModalOpen,
  } = useStore();

  const locale = useLocale();
  const isEn = locale === 'en';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('acc-mfa');
  const [isLoading, setIsLoading] = useState(false);
  const [isTrackerOpen, setTrackerOpen] = useState(false);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  // MFA Marketplace Specific Filters (Chuẩn Ảnh 3, 4, 5)
  const [mfaUsernameSearch, setMfaUsernameSearch] = useState('');
  const [mfaMinPrice, setMfaMinPrice] = useState('0.00');
  const [mfaMaxPrice, setMfaMaxPrice] = useState('120');
  const [mfaFilterTab, setMfaFilterTab] = useState<string>('all');
  const [mfaSort, setMfaSort] = useState<'default' | 'newest' | 'oldest' | 'price-asc' | 'price-desc'>('default');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Close sort dropdown when click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) {
        setIsSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Tính toán Dynamic Stats cho MFA (Chuẩn Ảnh 3: Dựa theo MFA thực tế, không cố định)
  const mfaStats = useMemo(() => {
    const total = MFA_ACCOUNTS_DATA.length;
    const avgUSD = (MFA_ACCOUNTS_DATA.reduce((acc, a) => acc + a.priceUSD, 0) / (total || 1)).toFixed(2);
    const avgVND = Math.round(MFA_ACCOUNTS_DATA.reduce((acc, a) => acc + a.priceVND, 0) / (total || 1));
    const available = MFA_ACCOUNTS_DATA.filter((a) => a.status === 'AVAILABLE').length;
    return { total, avgUSD, avgVND, available };
  }, []);

  // Lọc và Sắp xếp Tài khoản MFA theo Bộ Lọc (Chuẩn Ảnh 4 & 5)
  const filteredMfaAccounts = useMemo(() => {
    let list = [...MFA_ACCOUNTS_DATA];

    // 1. Tìm theo tên tài khoản / nickname (Ảnh 4)
    if (mfaUsernameSearch.trim()) {
      const q = mfaUsernameSearch.toLowerCase().trim();
      list = list.filter((a) =>
        a.maskedName.toLowerCase().includes(q) || a.slug.toLowerCase().includes(q)
      );
    }

    // 2. Lọc theo khoảng giá Price Min — Max (Ảnh 4)
    const min = parseFloat(mfaMinPrice) || 0;
    const max = parseFloat(mfaMaxPrice) || 999999;
    list = list.filter((a) => a.priceUSD >= min && a.priceUSD <= max);

    // 3. Phân chia giá tiền và danh mục/trạng thái MFA theo yêu cầu
    if (mfaFilterTab === '1-7') {
      list = list.filter((a) => a.priceUSD >= 1 && a.priceUSD <= 7);
    } else if (mfaFilterTab === '8-30') {
      list = list.filter((a) => a.priceUSD >= 8 && a.priceUSD <= 30);
    } else if (mfaFilterTab === '30-60') {
      list = list.filter((a) => a.priceUSD >= 30 && a.priceUSD <= 60);
    } else if (mfaFilterTab === '60-120') {
      list = list.filter((a) => a.priceUSD >= 60 && a.priceUSD <= 120);
    } else if (mfaFilterTab === 'gamepass') {
      list = list.filter((a) => a.accountType === 'GAMEPASS');
    } else if (mfaFilterTab === 'family') {
      list = list.filter((a) => a.accountType === 'FAMILY');
    } else if (mfaFilterTab === 'reserved') {
      list = list.filter((a) => a.status === 'RESERVED');
    } else if (mfaFilterTab === 'incoming') {
      list = list.filter((a) => a.status === 'IN_COMING');
    } else if (mfaFilterTab === 'sold') {
      list = list.filter((a) => a.status === 'SOLD');
    }

    // 4. Sắp xếp theo Sort Option (Chuẩn Ảnh 5)
    if (mfaSort === 'price-asc') {
      list.sort((a, b) => a.priceUSD - b.priceUSD);
    } else if (mfaSort === 'price-desc') {
      list.sort((a, b) => b.priceUSD - a.priceUSD);
    } else if (mfaSort === 'newest') {
      list.sort((a, b) => b.id.localeCompare(a.id));
    } else if (mfaSort === 'oldest') {
      list.sort((a, b) => a.id.localeCompare(b.id));
    } else {
      // Default: Ưu tiên Available -> Reserved -> In Coming -> Sold
      list.sort((a, b) => {
        const order: Record<string, number> = { AVAILABLE: 1, RESERVED: 2, IN_COMING: 3, SOLD: 4 };
        return (order[a.status] || 9) - (order[b.status] || 9);
      });
    }

    return list;
  }, [mfaUsernameSearch, mfaMinPrice, mfaMaxPrice, mfaFilterTab, mfaSort]);

  useEffect(() => {
    const cat = searchParams.get('category') || searchParams.get('cat');
    if (cat) {
      if (cat === 'acc-mfa' || cat === 'minecraft-alts') {
        setSelectedCategory('acc-mfa');
      } else if (cat === 'nitro-deco' || cat === 'discord-services') {
        setSelectedCategory('nitro-deco');
      } else if (cat === 'mmo' || cat === 'streaming-vpn' || cat === 'ai-dev-tools') {
        setSelectedCategory('mmo');
      } else if (cat === 'misc' || cat === 'gaming-accounts') {
        setSelectedCategory('misc');
      }
    }
  }, [searchParams]);

  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = categoryScrollRef.current;
    if (!el) return;
    setIsMouseDown(true);
    setHasDragged(false);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeftPos(el.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown) return;
    const el = categoryScrollRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 4) {
      setHasDragged(true);
    }
    el.scrollLeft = scrollLeftPos - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsMouseDown(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const el = categoryScrollRef.current;
    if (!el) return;
    if (e.deltaY !== 0) {
      el.scrollLeft += e.deltaY;
    }
  };

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

    if (selectedCategory === 'acc-mfa') {
      if (mfaSort === 'price-asc') {
        list = [...list].sort((a, b) => (a.priceVND || 0) - (b.priceVND || 0));
      } else if (mfaSort === 'price-desc') {
        list = [...list].sort((a, b) => (b.priceVND || 0) - (a.priceVND || 0));
      }
    }

    return list;
  }, [initialProducts, selectedCategory, searchQuery, mfaSort]);

  const handleAddMfaToCart = (account: MfaAccount) => {
    if (account.status !== 'AVAILABLE') {
      toast.error(
        account.status === 'SOLD'
          ? (isEn ? 'This account has already been sold' : 'Tài khoản này đã bán')
          : (isEn ? 'Account is not available right now' : 'Tài khoản hiện không khả dụng để mua')
      );
      return;
    }

    const prod: Product = {
      id: account.id,
      name: `Minecraft MFA (${account.maskedName})`,
      slug: account.slug,
      description: account.description.join(' • '),
      priceVND: account.priceVND,
      price: account.priceVND,
      images: [account.skinImage],
      warrantyPolicy: 'Bảo hành đầy đủ email/mật khẩu, giao ngay lập tức.',
      categoryId: 'acc-mfa',
      availableCount: 1,
    };

    addItem(prod, 1);
    toast.success(
      isEn ? `Added ${account.maskedName} to cart` : `Đã thêm ${account.maskedName} vào giỏ hàng`
    );
  };

  const handleQuickCheckout = (product: Product) => {
    setCheckoutOpen(true);
  };

  const handleOrderCreated = (orderData: any) => {
    router.push(`/order/${orderData.orderCode}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-zinc-900 dark:text-white transition-colors duration-200">
      {/* Navbar */}
      <Navbar onOpenTrackModal={() => setTrackerOpen(true)} />

      {/* Main Catalog View */}
      <main className="flex-1 py-4 sm:py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* 1. THANH TÌM KIẾM & DANH MỤC HIỆN ĐẠI (NÂNG CẤP ĐẸP HƠN ẢNH 1) */}
          <div className="sticky top-[68px] sm:top-[74px] z-40 p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-white/90 dark:bg-[#111115]/95 backdrop-blur-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-lg dark:shadow-2xl space-y-3 transition-all">
            
            {/* Ô Tìm Kiếm - Giao diện Obsidian sang trọng, bo cong mượt, rõ nét */}
            <div className="relative w-full">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 dark:text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEn ? "Search products..." : "Tìm sản phẩm..."}
                className="w-full bg-zinc-100/90 dark:bg-[#18181D] border border-zinc-200/80 dark:border-zinc-800 rounded-xl sm:rounded-2xl pl-11 sm:pl-12 pr-10 py-3 sm:py-3.5 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all shadow-inner font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                  title={isEn ? "Clear search" : "Xóa tìm kiếm"}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Hàng Button Danh Mục - Vuốt chạm mượt mà, không bị nút mũi tên che mất chữ */}
            <div className="relative w-full overflow-hidden">
              <div
                ref={categoryScrollRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                onWheel={handleWheel}
                className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-none scroll-smooth touch-pan-x cursor-grab active:cursor-grabbing select-none w-full px-0.5"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {FOUR_CATEGORIES.map((cat) => {
                  const count = counts[cat.id] || 0;
                  const isActive = selectedCategory === cat.id;
                  const CatIcon = cat.Icon;

                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => {
                        if (!hasDragged) {
                          setSelectedCategory(cat.id);
                        }
                      }}
                      className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 active:scale-98 ${
                        isActive
                          ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-md border border-transparent'
                          : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-950 border border-zinc-200/90 dark:bg-[#18181D] dark:hover:bg-[#222228] dark:text-zinc-300 dark:hover:text-white dark:border-zinc-800'
                      }`}
                    >
                      <CatIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isActive ? 'text-inherit' : cat.colorClass}`} />
                      <span>{cat.name}</span>
                      <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-mono font-bold ${
                        isActive 
                          ? 'bg-white/20 dark:bg-zinc-950/20 text-white dark:text-zinc-950' 
                          : 'bg-zinc-200/90 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* =========================================================================
              2. GIAO DIỆN RIÊNG BIỆT DÀNH CHO MFA (CHUẨN ẢNH 3, 4, 5)
              ========================================================================= */}
          {selectedCategory === 'acc-mfa' ? (
            <div className="space-y-6 pt-2">
              {/* Header "Chợ" chuẩn Ảnh 5 */}
              <div className="space-y-1">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-sans text-zinc-950 dark:text-white tracking-tight">
                  {isEn ? 'Marketplace' : 'Chợ MFA'}
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-sans">
                  {isEn
                    ? 'Browse all accounts. Click View to open dedicated page, or Buy to hold for 30 minutes.'
                    : 'Duyệt mọi tài khoản Minecraft MFA. Bấm vào tài khoản để xem chi tiết trên trang riêng.'}
                </p>
              </div>

              {/* 3 Bento Stat Cards (Chuẩn Ảnh 3: Dựa theo MFA thực tế, Cập nhật liên tục, Không cố định) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {/* 1. TOTAL LISTINGS */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111115] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs flex flex-col justify-center">
                  <div className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white font-mono">
                    {mfaStats.total}
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-mono font-bold tracking-wider text-zinc-400 uppercase mt-1">
                    {isEn ? 'TOTAL LISTINGS' : 'TỔNG TÀI KHOẢN'}
                  </div>
                </div>

                {/* 2. AVG. PRICE */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111115] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs flex flex-col justify-center">
                  <div className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white font-mono">
                    {currency === 'USD' ? `$${mfaStats.avgUSD}` : formatPrice(mfaStats.avgVND, currency)}
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-mono font-bold tracking-wider text-zinc-400 uppercase mt-1">
                    {isEn ? 'AVG. PRICE' : 'GIÁ TRUNG BÌNH'}
                  </div>
                </div>

                {/* 3. AVAILABLE NOW */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111115] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs flex flex-col justify-center">
                  <div className="text-2xl sm:text-3xl font-black text-emerald-500 dark:text-emerald-400 font-mono">
                    {mfaStats.available}
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-mono font-bold tracking-wider text-zinc-400 uppercase mt-1">
                    {isEn ? 'AVAILABLE NOW' : 'CÒN HÀNG NGAY'}
                  </div>
                </div>
              </div>

              {/* Hàng Tabs Phân Chia Giá Tiền & Danh Mục MFA Theo Yêu Cầu */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
                {[
                  { id: 'all', label: isEn ? 'All' : 'Tất cả' },
                  { id: '1-7', label: '$1 – $7' },
                  { id: '8-30', label: '$8 – $30' },
                  { id: '30-60', label: '$30 – $60' },
                  { id: '60-120', label: '$60 – $120' },
                  { id: 'gamepass', label: isEn ? 'GamePass Account' : 'Tài khoản GamePass' },
                  { id: 'family', label: isEn ? 'Family Account' : 'Tài khoản Family' },
                  { id: 'reserved', label: isEn ? 'Reserved' : 'Đã đặt chỗ' },
                  { id: 'incoming', label: isEn ? 'In Coming' : 'Đang về' },
                  { id: 'sold', label: isEn ? 'Sold' : 'Đã bán' },
                ].map((tab) => {
                  const isActive = mfaFilterTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setMfaFilterTab(tab.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                          : 'bg-white/80 dark:bg-[#121215] text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-800 hover:text-black dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Hàng Bộ Lọc MFA Chuẩn Ảnh 4: Search by username + SORT Dropdown (Ảnh 5) + PRICE Min-Max */}
              <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-[#111115] border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-3">
                {/* Hàng 1: Search by username + SORT button */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={mfaUsernameSearch}
                      onChange={(e) => setMfaUsernameSearch(e.target.value)}
                      placeholder={isEn ? 'Search by username...' : 'Tìm theo username...'}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-[#16161B] border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm text-zinc-950 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 font-mono shadow-inner"
                    />
                  </div>

                  {/* SORT Dropdown Chuẩn Ảnh 5 */}
                  <div className="relative" ref={sortDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                      className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-[#16161B] border border-zinc-200 dark:border-zinc-800 text-xs font-mono font-bold text-zinc-900 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer"
                    >
                      <span className="text-zinc-500 uppercase text-[10px]">{isEn ? 'SORT' : 'SẮP XẾP'}</span>
                      <span className="capitalize">
                        {mfaSort === 'default'
                          ? (isEn ? 'Default' : 'Mặc định')
                          : mfaSort === 'newest'
                          ? (isEn ? 'Newest' : 'Mới nhất')
                          : mfaSort === 'oldest'
                          ? (isEn ? 'Oldest' : 'Cũ nhất')
                          : mfaSort === 'price-asc'
                          ? (isEn ? 'Price — low to high' : 'Giá — Thấp đến cao')
                          : (isEn ? 'Price — high to low' : 'Giá — Cao đến thấp')}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${
                          isSortDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Menu Dropdown Chuẩn Ảnh 5 */}
                    {isSortDropdownOpen && (
                      <div className="absolute right-0 top-full mt-1.5 z-50 w-52 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 shadow-2xl p-1.5 text-xs font-sans animate-in fade-in zoom-in-95 duration-150">
                        {[
                          { id: 'default', label: isEn ? 'Default' : 'Mặc định' },
                          { id: 'newest', label: isEn ? 'Newest' : 'Mới nhất' },
                          { id: 'oldest', label: isEn ? 'Oldest' : 'Cũ nhất' },
                          { id: 'price-asc', label: isEn ? 'Price — low to high' : 'Giá — Thấp đến cao' },
                          { id: 'price-desc', label: isEn ? 'Price — high to low' : 'Giá — Cao đến thấp' },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setMfaSort(opt.id as any);
                              setIsSortDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                              mfaSort === opt.id
                                ? 'bg-zinc-100 dark:bg-[#1d1d24] text-zinc-950 dark:text-white font-bold'
                                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-[#18181e]'
                            }`}
                          >
                            <span>{opt.label}</span>
                            {mfaSort === opt.id && <Check className="w-3.5 h-3.5 text-zinc-950 dark:text-white" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Hàng 2: PRICE Min — Max (Chuẩn Ảnh 4) */}
                <div className="flex items-center gap-3 pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
                  <span className="text-zinc-400 font-mono font-bold text-[10px] uppercase tracking-wider shrink-0">
                    {isEn ? 'PRICE' : 'GIÁ TIỀN'}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs">
                        $
                      </span>
                      <input
                        type="number"
                        value={mfaMinPrice}
                        onChange={(e) => setMfaMinPrice(e.target.value)}
                        placeholder="0.00"
                        className="w-20 pl-6 pr-2 py-1.5 rounded-lg bg-zinc-50 dark:bg-[#16161B] border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                      />
                    </div>
                    <span className="text-zinc-400 font-mono">—</span>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs">
                        $
                      </span>
                      <input
                        type="number"
                        value={mfaMaxPrice}
                        onChange={(e) => setMfaMaxPrice(e.target.value)}
                        placeholder="120"
                        className="w-20 pl-6 pr-2 py-1.5 rounded-lg bg-zinc-50 dark:bg-[#16161B] border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Hiển Thị Danh Sách Tài Khoản Phân Chia Theo Mức Giá & Tab */}
              {filteredMfaAccounts.length === 0 ? (
                <div className="py-20 text-center space-y-2 rounded-2xl bg-white dark:bg-[#111115] border border-zinc-200/80 dark:border-zinc-800/80">
                  <PackageSearch className="w-10 h-10 text-zinc-400 mx-auto" />
                  <div className="text-sm font-bold text-zinc-700 dark:text-zinc-300 font-mono">
                    {isEn ? 'No matching Minecraft MFA accounts found.' : 'Không tìm thấy tài khoản Minecraft MFA nào phù hợp.'}
                  </div>
                  <p className="text-xs text-zinc-500">
                    {isEn ? 'Try expanding the price range or selecting another tab.' : 'Hãy thử nới rộng khoảng giá hoặc chọn tab khác.'}
                  </p>
                </div>
              ) : mfaFilterTab === 'all' ? (
                /* Chế độ Tất cả: Phân chia thành các mức giá 1-7$, 8-30$, 30-60$, 60-120$ theo yêu cầu */
                <div className="space-y-8">
                  {[
                    { tier: '1-7', label: '$1 – $7', min: 1, max: 7 },
                    { tier: '8-30', label: '$8 – $30', min: 8, max: 30 },
                    { tier: '30-60', label: '$30 – $60', min: 30, max: 60 },
                    { tier: '60-120', label: '$60 – $120', min: 60, max: 120 },
                  ].map((group) => {
                    const groupAccounts = filteredMfaAccounts.filter(
                      (a) => a.priceUSD >= group.min && a.priceUSD <= group.max
                    );
                    if (groupAccounts.length === 0) return null;

                    return (
                      <div key={group.tier} className="space-y-4">
                        <div className="flex items-baseline gap-2 pt-2 border-t border-zinc-200/80 dark:border-zinc-800/80">
                          <h3 className="text-xl sm:text-2xl font-black font-mono text-zinc-950 dark:text-white tracking-tight">
                            {group.label}
                          </h3>
                          <span className="text-xs font-mono text-zinc-500">
                            {groupAccounts.length} {isEn ? 'accounts' : 'tài khoản'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                          {groupAccounts.map((acc) => (
                            <MfaMarketCard
                              key={acc.id}
                              account={acc}
                              currency={currency}
                              onView={() => router.push(`/shop/mfa/${acc.slug}`)}
                              onAddToCart={() => {
                                handleAddMfaToCart(acc);
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Chế độ Lọc Riêng Từng Tab (1-7$, 8-30$, GamePassAccount, Family, Reserved, In Coming, Sold) */
                <div className="space-y-4">
                  <div className="flex items-baseline gap-2 pt-2 border-t border-zinc-200/80 dark:border-zinc-800/80">
                    <h3 className="text-xl sm:text-2xl font-black font-mono text-zinc-950 dark:text-white tracking-tight">
                      {mfaFilterTab === '1-7'
                        ? '$1 – $7'
                        : mfaFilterTab === '8-30'
                        ? '$8 – $30'
                        : mfaFilterTab === '30-60'
                        ? '$30 – $60'
                        : mfaFilterTab === '60-120'
                        ? '$60 – $120'
                        : mfaFilterTab === 'gamepass'
                        ? (isEn ? 'GamePass Account' : 'Tài khoản GamePass')
                        : mfaFilterTab === 'family'
                        ? (isEn ? 'Family Account' : 'Tài khoản Family')
                        : mfaFilterTab === 'reserved'
                        ? (isEn ? 'Reserved' : 'Đã đặt chỗ')
                        : mfaFilterTab === 'incoming'
                        ? (isEn ? 'In Coming' : 'Đang về')
                        : (isEn ? 'Sold' : 'Đã bán')}
                    </h3>
                    <span className="text-xs font-mono text-zinc-500">
                      {filteredMfaAccounts.length} {isEn ? 'accounts' : 'tài khoản'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                    {filteredMfaAccounts.map((acc) => (
                      <MfaMarketCard
                        key={acc.id}
                        account={acc}
                        currency={currency}
                        onView={() => router.push(`/shop/mfa/${acc.slug}`)}
                        onAddToCart={() => {
                          handleAddMfaToCart(acc);
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* =========================================================================
               3. GIAO DIỆN CÁC DANH MỤC KHÁC (NITRO & DECO, MMO, MISC)
               ========================================================================= */
            <div>
              {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
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
                    {isEn ? 'No products match your current filters.' : 'Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.'}
                  </p>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 font-bold text-xs transition-all cursor-pointer shadow-xs"
                    >
                      {isEn ? 'Clear search filter' : 'Xóa từ khóa tìm kiếm'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
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
          )}

        </div>
      </main>

      {/* Global Drawers & Modals */}
      <CartDrawer onProceedToCheckout={() => setCheckoutOpen(true)} />
      <QuickViewModal onQuickCheckout={() => setCheckoutOpen(true)} />
      <MfaAccountDetailModal onQuickCheckout={handleQuickCheckout} />
      <AuthModal />

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

// Component Thẻ Tài Khoản Minecraft Chuyên Biệt Cho "Chợ MFA" Chuẩn Ảnh 5
function MfaMarketCard({
  account,
  currency,
  onView,
  onAddToCart,
}: {
  account: MfaAccount;
  currency: any;
  onView: () => void;
  onAddToCart: () => void;
}) {
  const locale = useLocale();
  const isEn = locale === 'en';
  const [isFavorited, setIsFavorited] = useState(false);

  // Status color & badge
  const statusConfig = {
    AVAILABLE: {
      text: isEn ? 'AVAILABLE' : 'CÒN HÀNG',
      dot: 'bg-emerald-500',
      badge: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/60',
    },
    RESERVED: {
      text: isEn ? 'RESERVED' : 'ĐÃ ĐẶT CHỖ',
      dot: 'bg-amber-500',
      badge: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/60 dark:border-amber-900/60',
    },
    IN_COMING: {
      text: isEn ? 'IN COMING' : 'ĐANG VỀ',
      dot: 'bg-cyan-500',
      badge: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400 border-cyan-200/60 dark:border-cyan-900/60',
    },
    SOLD: {
      text: isEn ? 'SOLD' : 'ĐÃ BÁN',
      dot: 'bg-rose-500',
      badge: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400 border-zinc-200/60 dark:border-zinc-800/60',
    },
  }[account.status] || {
    text: account.status,
    dot: 'bg-zinc-400',
    badge: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800',
  };

  return (
    <div
      onClick={onView}
      className={`group rounded-2xl sm:rounded-3xl bg-white dark:bg-[#111116] border border-zinc-200/90 dark:border-zinc-800/80 p-3 sm:p-3.5 shadow-xs hover:shadow-xl dark:shadow-none hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
        account.status === 'SOLD' ? 'opacity-70 grayscale-[30%]' : ''
      }`}
    >
      <div>
        {/* Top Header: • CÒN HÀNG / STATUS, Rating, Stats Icon, Favorite Heart chuẩn Ảnh 5 */}
        <div className="flex items-center justify-between gap-1 pb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono border flex items-center gap-1 ${statusConfig.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full inline-block ${statusConfig.dot}`} />
              {statusConfig.text}
            </span>
            <span className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-600 dark:bg-[#1C1814] dark:text-amber-400 text-[10px] font-bold font-mono border border-amber-200/60 dark:border-amber-900/60 flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
              {account.rating.toFixed(1)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <div className="p-1 text-zinc-400 dark:text-zinc-500" title="Stats">
              <BarChart2 className="w-3.5 h-3.5" />
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorited(!isFavorited);
              }}
              className="p-1 text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
            >
              <Heart
                className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Khung ảnh Skin Minecraft 3D + Rank Badge + Server Tag + Price Pill chuẩn Ảnh 5 */}
        <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl bg-zinc-100 dark:bg-[#16161B] border border-zinc-200/70 dark:border-zinc-800/80 overflow-hidden flex items-center justify-center mb-3">
          <Image
            src={account.skinImage}
            alt={account.maskedName}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
          />

          {/* Rank Tag góc dưới bên trái (NON / VIP / MVP+) */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1 pointer-events-none">
            {account.server && (
              <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[9px] font-bold text-amber-400 font-mono border border-white/10">
                {account.server}
              </span>
            )}
            <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[9px] font-bold text-white font-mono border border-white/10">
              {account.rank}
            </span>
          </div>

          {/* Giá tiền Pill góc dưới bên phải chuẩn Ảnh 5 */}
          <div className="absolute bottom-2 right-2 pointer-events-none">
            <span className="px-2 py-0.5 rounded-lg bg-white dark:bg-white text-zinc-950 font-black text-[11px] font-mono shadow-md border border-black/5">
              {currency === 'USD' ? `$${account.priceUSD.toFixed(2)}` : formatPrice(account.priceVND, currency)}
            </span>
          </div>
        </div>

        {/* Thông tin tài khoản: Masked Nickname + Age + Cape Badges chuẩn Ảnh 5 */}
        <div className="space-y-1.5 pb-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-black text-zinc-950 dark:text-white font-mono truncate">
              {account.maskedName}
            </h4>
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
              {isEn
                ? account.timeAgo
                : account.timeAgo
                    .replace('m ago', ' phút trước')
                    .replace('h ago', ' giờ trước')
                    .replace('d ago', ' ngày trước')}
            </span>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {account.badges.map((b, idx) => {
              const bgDot =
                b.color === 'amber'
                  ? 'bg-amber-500'
                  : b.color === 'emerald'
                  ? 'bg-emerald-500'
                  : b.color === 'indigo'
                  ? 'bg-indigo-500'
                  : b.color === 'rose'
                  ? 'bg-rose-500'
                  : 'bg-cyan-500';

              return (
                <div
                  key={idx}
                  className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 flex items-center gap-1 text-[10px] font-mono text-zinc-600 dark:text-zinc-400"
                >
                  <span className={`w-2 h-2.5 ${bgDot} rounded-2xs inline-block`} />
                  <span>{b.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2 Nút hành động: [ ↗ View ] và [ 🛒 ] icon chuẩn Ảnh 5 */}
      <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onView();
          }}
          className="flex-1 py-2 sm:py-2.5 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 dark:bg-[#18181D] dark:hover:bg-[#222228] dark:text-zinc-200 text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-zinc-200 dark:border-zinc-800 shadow-2xs active:scale-98"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>{isEn ? 'View' : 'Xem'}</span>
        </button>

        <button
          type="button"
          disabled={account.status !== 'AVAILABLE'}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all border border-zinc-200 dark:border-zinc-800 shadow-2xs active:scale-95 shrink-0 ${
            account.status === 'AVAILABLE'
              ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-[#18181D] dark:hover:bg-[#222228] dark:text-zinc-300 dark:hover:text-white cursor-pointer'
              : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400 cursor-not-allowed opacity-50'
          }`}
          title={account.status === 'AVAILABLE' ? (isEn ? 'Add to cart' : 'Thêm vào giỏ') : (isEn ? 'Unavailable' : 'Không khả dụng')}
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
