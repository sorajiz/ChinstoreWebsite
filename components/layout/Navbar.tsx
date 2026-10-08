'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname, Link } from '@/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useStore } from '@/lib/store';
import {
  ShoppingBag,
  Sparkles,
  Menu,
  X,
  Globe,
  Coins,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Home,
  ShieldCheck,
  HelpCircle,
  Store,
  Wallet,
  LayoutGrid,
  Ticket,
  FileText,
} from 'lucide-react';
import { CurrencyType } from '@/types';
import ThemeToggle from '@/components/ui/ThemeToggle';
import CustomSelectDropdown, { SelectOption } from '@/components/ui/CustomSelectDropdown';

interface NavbarProps {
  onOpenTrackModal?: () => void;
}

function DiscordIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export default function Navbar({ onOpenTrackModal }: NavbarProps) {
  const t = useTranslations('common');
  const locale = useLocale();
  const isEn = locale === 'en';
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const isHome = pathname === '/' || pathname === '';
  const isShop = pathname.startsWith('/shop');

  const {
    currency,
    setCurrency,
    getCartItemCount,
    setCartOpen,
    isMobileMenuOpen,
    setMobileMenuOpen,
    setAuthModalOpen,
  } = useStore();
  const itemCount = getCartItemCount();

  // Scroll logic: Header remains permanently visible at top with Glassmorphism, tracks active section
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sections = ['hero', 'featured-products', 'transparency', 'faq'];
          for (const sectionId of sections) {
            const el = document.getElementById(sectionId);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= 200 && rect.bottom >= 150) {
                setActiveSection(sectionId);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Language options matching select style
  const languageOptions: SelectOption[] = [
    { value: 'vi', label: 'VI', subLabel: 'Tiếng Việt' },
    { value: 'en', label: 'EN', subLabel: 'English' },
  ];

  const handleLanguageSelect = (newLocale: string) => {
    if (newLocale !== locale) {
      router.replace(pathname, { locale: newLocale as 'vi' | 'en' });
    }
  };

  // Currency options matching select style
  const currencyOptions: SelectOption[] = [
    { value: 'VND', label: 'VND', subLabel: 'Việt Nam Đồng (₫)' },
    { value: 'USD', label: 'USD', subLabel: 'US Dollar ($)' },
    { value: 'LTC', label: 'LTC', subLabel: 'Litecoin (Ł)' },
  ];

  const handleCurrencySelect = (newCurr: string) => {
    setCurrency(newCurr as CurrencyType);
  };

  // Handle login: Chuyển thẳng sang trang /login riêng biệt chỉ có Discord
  const handleDiscordLogin = () => {
    router.push('/login');
  };

  return (
    <>
      {/* Header Cao Cấp & Thanh Lịch (Sticky - Đi theo khi cuộn trang) */}
      <header className="sticky top-2 sm:top-3 z-50 px-3 sm:px-6 max-w-7xl mx-auto w-full transition-all duration-300">
        <div data-sora-opt="glass" className="relative w-full rounded-2xl sm:rounded-full px-4 sm:px-6 py-2.5 bg-white/75 dark:bg-[#09090b]/80 border border-zinc-200/90 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-300">
          <div className="flex items-center justify-between">
            
            {/* Left: Brand Logo & Navigation Links (PC Header Giữ Nguyên) */}
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-2.5 group">
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700/80 transition-transform duration-300 group-hover:scale-105 shadow-xs shrink-0">
                  <Image
                    src="/logo.png"
                    alt="ChinStore"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                <span className="text-lg font-black tracking-tight text-zinc-950 dark:text-white font-sans">
                  ChinStore
                </span>
              </Link>

              {/* Desktop Scrollspy Navigation Links */}
              <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 text-xs font-semibold">
                <Link
                  href="/"
                  onClick={(e) => {
                    if (isHome) {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full transition-all ${
                    isHome && activeSection === 'hero'
                      ? 'bg-black/10 dark:bg-white/10 text-slate-900 dark:text-white font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {t('home')}
                </Link>
                <Link
                  href="/#featured-products"
                  onClick={(e) => {
                    if (isHome) {
                      e.preventDefault();
                      const el = document.getElementById('featured-products');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full transition-all ${
                    isHome && activeSection === 'featured-products'
                      ? 'bg-black/10 dark:bg-white/10 text-slate-900 dark:text-white font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {t('shop')}
                </Link>
                <Link
                  href="/#transparency"
                  onClick={(e) => {
                    if (isHome) {
                      e.preventDefault();
                      const el = document.getElementById('transparency');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full transition-all ${
                    isHome && activeSection === 'transparency'
                      ? 'bg-black/10 dark:bg-white/10 text-slate-900 dark:text-white font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {t('transparency')}
                </Link>
                <Link
                  href="/#faq"
                  onClick={(e) => {
                    if (isHome) {
                      e.preventDefault();
                      const el = document.getElementById('faq');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full transition-all ${
                    isHome && activeSection === 'faq'
                      ? 'bg-black/10 dark:bg-white/10 text-slate-900 dark:text-white font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {t('faq')}
                </Link>
                <Link
                  href="/shop"
                  className={`px-3 py-1.5 rounded-full transition-all ${
                    isShop
                      ? 'bg-black/10 dark:bg-white/10 text-slate-900 dark:text-white font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {t('store')}
                </Link>
              </nav>
            </div>

            {/* Right: Controls & Actions */}
            <div className="flex items-center space-x-2 sm:space-x-2.5">
              
              {/* Currency Multi-Select Dropdown - Desktop */}
              <div className="hidden lg:block">
                <CustomSelectDropdown
                  options={currencyOptions}
                  selectedValue={currency}
                  onSelect={handleCurrencySelect}
                  triggerPrefix={<Coins className="w-3.5 h-3.5" />}
                  widthClass="w-52"
                  title="Chọn đơn vị tiền tệ"
                />
              </div>

              {/* Language Multi-Select Dropdown - Desktop */}
              <div className="hidden sm:block">
                <CustomSelectDropdown
                  options={languageOptions}
                  selectedValue={locale}
                  onSelect={handleLanguageSelect}
                  triggerPrefix={<Globe className="w-3.5 h-3.5" />}
                  widthClass="w-44"
                  title="Chọn ngôn ngữ"
                />
              </div>

              {/* Compact Sun/Moon Theme Toggle */}
              <div className="flex items-center justify-center p-0.5" title="Chuyển chế độ Sáng / Tối">
                <ThemeToggle id="header-theme-toggle" />
              </div>

              {/* Cart Button: Mở giỏ hàng popup (PC: Drawer phải như cũ; Mobile: Bottom Sheet Ảnh 2) */}
              <button
                id="open-cart-btn"
                onClick={() => setCartOpen(true)}
                className="relative p-2 rounded-full bg-[#EFECE5] dark:bg-[#18181C] border border-[#DDD8CE] dark:border-[#27272D] text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all hover:scale-105 active:scale-95 group cursor-pointer"
                aria-label="Mở giỏ hàng"
                title="Giỏ hàng"
              >
                <ShoppingBag className="w-4 h-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-[9px] font-bold rounded-full flex items-center justify-center shadow-md">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Discord Login Button / User Avatar (Desktop PC) */}
              <div className="hidden md:block">
                {session?.user ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-[#18181C] border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all shadow-sm"
                    >
                      <div className="w-5 h-5 rounded-full bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-[10px]">
                        {session.user.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className="truncate max-w-[80px]">
                        {session.user.name}
                      </span>
                      <ChevronDown className="w-3 h-3" />
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 p-2 shadow-2xl backdrop-blur-xl z-50">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            router.push('/profile');
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 rounded-xl transition-colors text-left"
                        >
                          <UserIcon className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                          <span>{t('myProfile')}</span>
                        </button>
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            signOut({ callbackUrl: '/' });
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors text-left"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>{t('logout')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={handleDiscordLogin}
                    className="flex items-center gap-2 px-4 py-2 text-white dark:text-zinc-950 bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 rounded-full font-bold text-xs shadow-sm transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    <DiscordIcon className="w-4 h-4 fill-current text-white dark:text-zinc-950" />
                    <span>Login Discord</span>
                  </button>
                )}
              </div>


              {/* Mobile Hamburger Toggle Button -> Mở Side Drawer Menu */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-[#EFECE5] dark:bg-[#18181C] border border-[#DDD8CE] dark:border-[#27272D] transition-colors cursor-pointer"
                aria-label="Open mobile menu"
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MOBILE MENU DRAWER: Đồng bộ các mục với Header PC                          */}
      {/* ========================================================================= */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[120] overflow-hidden">
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Drawer Panel: Slide in from right */}
          <aside
            className="fixed top-0 bottom-0 right-0 z-10 w-[84%] max-w-[340px] sm:max-w-[360px] h-[100dvh] max-h-[100dvh] bg-white dark:bg-[#121215] text-zinc-900 dark:text-white shadow-2xl flex flex-col border-l border-zinc-200/90 dark:border-white/10 transition-colors duration-200 animate-in slide-in-from-right duration-300 ease-out"
          >
            {/* Top Bar: [Menu] ... [✕] */}
            <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between shrink-0">
              <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white font-sans tracking-tight">
                Menu
              </h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 stroke-[2]" />
              </button>
            </div>

            {/* Scrollable Content (Lướt lên lướt xuống mượt mà trên mọi thiết bị mobile) */}
            <div
              className="flex-1 overflow-y-auto overscroll-contain touch-pan-y px-4 py-4 pb-36 space-y-4 scrollbar-thin"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {/* User Account Card */}
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-[#18181C] border border-zinc-200/80 dark:border-zinc-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-700/80 flex items-center justify-center font-bold text-sm text-zinc-800 dark:text-zinc-200 shadow-2xs shrink-0">
                  {session?.user?.name ? (
                    session.user.name.charAt(0).toUpperCase()
                  ) : (
                    <UserIcon className="w-5 h-5 text-zinc-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-zinc-950 dark:text-white truncate">
                    {session?.user?.name || (isEn ? 'Guest' : 'Khách')}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    {session?.user?.email || (isEn ? 'Not signed in' : 'Chưa đăng nhập')}
                  </div>
                </div>
              </div>

              {/* SECTION 1: Điều hướng (Đồng bộ chuẩn 100% với Header PC) */}
              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-2 py-1">
                  {isEn ? 'Navigation' : 'Điều hướng'}
                </div>

                {/* 1. Trang chủ */}
                <Link
                  href="/"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (isHome) {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isHome && activeSection === 'hero'
                      ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-950 dark:text-white font-bold'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  <Home className="w-4 h-4 text-zinc-600 dark:text-zinc-400 stroke-[2]" />
                  <span>{t('home')}</span>
                </Link>

                {/* 2. Sản phẩm */}
                <Link
                  href="/#featured-products"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    const el = document.getElementById('featured-products');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isHome && activeSection === 'featured-products'
                      ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-950 dark:text-white font-bold'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-zinc-600 dark:text-zinc-400 stroke-[2]" />
                  <span>{t('shop')}</span>
                </Link>

                {/* 3. Cam kết */}
                <Link
                  href="/#transparency"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    const el = document.getElementById('transparency');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isHome && activeSection === 'transparency'
                      ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-950 dark:text-white font-bold'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-zinc-600 dark:text-zinc-400 stroke-[2]" />
                  <span>{t('transparency')}</span>
                </Link>

                {/* 4. Hỏi đáp */}
                <Link
                  href="/#faq"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    const el = document.getElementById('faq');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isHome && activeSection === 'faq'
                      ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-950 dark:text-white font-bold'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-zinc-600 dark:text-zinc-400 stroke-[2]" />
                  <span>{t('faq')}</span>
                </Link>

                {/* 5. Cửa hàng */}
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isShop
                      ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-950 dark:text-white font-bold'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  <Store className="w-4 h-4 text-zinc-600 dark:text-zinc-400 stroke-[2]" />
                  <span>{t('store')}</span>
                </Link>
              </div>

              {/* Divider */}
              <div className="border-t border-zinc-200/80 dark:border-zinc-800 my-2" />

              {/* SECTION 2: Tài khoản (Đã xóa nạp tiền và voucher theo yêu cầu) */}
              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-2 py-1">
                  {isEn ? 'Account' : 'Tài khoản'}
                </div>

                {/* Dashboard */}
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                >
                  <LayoutGrid className="w-4 h-4 text-zinc-600 dark:text-zinc-400 stroke-[2]" />
                  <span>Dashboard</span>
                </Link>
              </div>

              {/* Cài đặt Ngôn ngữ & Tiền tệ */}
              <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-800">
                <div className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-2 py-1">
                  {isEn ? 'Preferences' : 'Cấu hình hiển thị'}
                </div>
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <CustomSelectDropdown
                    options={languageOptions}
                    selectedValue={locale}
                    onSelect={handleLanguageSelect}
                    triggerPrefix={<Globe className="w-3.5 h-3.5" />}
                    widthClass="w-full"
                    title={isEn ? 'Language' : 'Ngôn ngữ'}
                    align="left"
                    className="w-full"
                  />
                  <CustomSelectDropdown
                    options={currencyOptions}
                    selectedValue={currency}
                    onSelect={handleCurrencySelect}
                    triggerPrefix={<Coins className="w-3.5 h-3.5" />}
                    widthClass="w-full"
                    title={isEn ? 'Currency' : 'Tiền tệ'}
                    align="right"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Pinned Button: Đăng xuất hoặc Login */}
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-[#151518]/50 shrink-0">
              {session?.user ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-sm flex items-center justify-center gap-2 border border-zinc-200/80 dark:border-zinc-700/80 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 stroke-[2]" />
                  <span>{t('logout')}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleDiscordLogin();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <DiscordIcon className="w-4 h-4 fill-current" />
                  <span>{isEn ? 'Sign in with Discord' : 'Login Discord'}</span>
                </button>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
