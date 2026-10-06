'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  ShieldCheck,
  ChevronDown,
  LayoutGrid,
  ExternalLink,
  ChevronRight,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { CurrencyType } from '@/types';
import ThemeToggle from '@/components/ui/ThemeToggle';

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
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { setCartOpen, currency, setCurrency, getCartItemCount } = useStore();
  const itemCount = getCartItemCount();

  const handleLanguageToggle = (newLocale: 'vi' | 'en') => {
    if (newLocale !== locale) {
      router.replace(pathname, { locale: newLocale });
    }
  };

  const currencies: CurrencyType[] = ['VND', 'USD', 'LTC'];

  // Handle direct Discord login
  const handleDiscordLogin = () => {
    signIn('discord', { callbackUrl: window.location.href });
  };

  const handleMouseEnter = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setIsHeaderHovered(true);
  };

  const handleMouseLeave = () => {
    hideTimerRef.current = setTimeout(() => {
      setIsHeaderHovered(false);
    }, 450);
  };

  return (
    <>
      {/* 1. Invisible Hover Trigger Zone at the very top of PC screen */}
      <div
        onMouseEnter={handleMouseEnter}
        className="fixed top-0 left-0 right-0 h-10 z-40 pointer-events-auto hidden md:block"
        aria-hidden="true"
      />

      {/* 2. Persistent Floating Sidebar for Header on PC (Remains visible when top header auto-hides) */}
      <aside
        aria-label="ChinStore Sidebar"
        className={`fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-3 p-2.5 rounded-2xl bg-white/95 dark:bg-[#18181B]/95 border border-[#E5E1D8] dark:border-[#27272A] shadow-2xl backdrop-blur-xl transition-all duration-300 ${
          isHeaderHovered ? 'opacity-85 translate-x-0' : 'opacity-100 translate-x-0 hover:scale-105'
        }`}
      >
        {/* Brand Logo / Trigger Hover */}
        <Link
          href="/"
          onMouseEnter={handleMouseEnter}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5865F2] to-indigo-600 p-[1.5px] transition-transform duration-200 hover:scale-110 shadow-md group relative flex items-center justify-center"
          title="CHINSTORE • Rê chuột để mở menu đầy đủ"
        >
          <div className="w-full h-full bg-white dark:bg-[#121214] rounded-xl flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#5865F2]" />
          </div>
        </Link>

        <div className="w-6 h-[1px] bg-[#E5E1D8] dark:bg-[#27272A]" />

        {/* Shop Quick Link */}
        <Link
          href="/shop"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all group relative"
          title="Cửa Hàng (Shop)"
        >
          <LayoutGrid className="w-4 h-4" />
        </Link>

        {/* Discord Server Link */}
        <a
          href="https://discord.gg"
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[#5865F2] hover:bg-[#5865F2]/10 transition-all group relative"
          title="Discord Server"
        >
          <DiscordIcon className="w-4 h-4 fill-current" />
        </a>

        {/* Order Tracker Link */}
        {onOpenTrackModal && (
          <button
            onClick={onOpenTrackModal}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-indigo-500 hover:bg-black/5 dark:hover:bg-white/5 transition-all group relative"
            title="Tra cứu đơn hàng"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        )}

        {/* Cart Drawer Trigger */}
        <button
          onClick={() => setCartOpen(true)}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-[#5865F2] hover:bg-black/5 dark:hover:bg-white/5 transition-all relative group"
          title="Giỏ hàng"
        >
          <ShoppingBag className="w-4 h-4" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 bg-[#5865F2] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow">
              {itemCount}
            </span>
          )}
        </button>

        <div className="w-6 h-[1px] bg-[#E5E1D8] dark:bg-[#27272A]" />

        {/* Pure CSS Sun/Moon Theme Toggle (From Uiverse.io) */}
        <div className="flex items-center justify-center py-1" title="Chuyển chế độ Sáng / Tối">
          <ThemeToggle id="themeToggle-sidebar" />
        </div>

        {/* Language Select Pill in Sidebar */}
        <div className="relative flex items-center" title="Chọn ngôn ngữ">
          <select
            value={locale}
            onChange={(e) => handleLanguageToggle(e.target.value as 'vi' | 'en')}
            className="appearance-none w-9 h-7 text-center rounded-lg text-[11px] font-bold bg-[#EFECE5] dark:bg-[#27272A] border border-[#E5E1D8] dark:border-white/10 text-slate-700 dark:text-slate-200 cursor-pointer outline-none hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <option value="vi" className="bg-white dark:bg-[#18181B] text-slate-900 dark:text-white">VI</option>
            <option value="en" className="bg-white dark:bg-[#18181B] text-slate-900 dark:text-white">EN</option>
          </select>
        </div>

        <div className="w-6 h-[1px] bg-[#E5E1D8] dark:bg-[#27272A]" />

        {/* Discord Login Button / Avatar in Sidebar */}
        {session?.user ? (
          <button
            onClick={() => router.push('/profile')}
            className="w-9 h-9 rounded-xl bg-[#5865F2]/10 border border-[#5865F2]/30 text-[#5865F2] flex items-center justify-center font-bold text-xs hover:scale-105 transition-transform"
            title={`Tủ đồ & Hồ sơ: ${session.user.name}`}
          >
            {session.user.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
          </button>
        ) : (
          <button
            onClick={handleDiscordLogin}
            className="w-9 h-9 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white flex items-center justify-center shadow-lg shadow-[#5865F2]/30 hover:scale-105 transition-all"
            title="Đăng nhập Discord"
          >
            <DiscordIcon className="w-4 h-4 fill-current" />
          </button>
        )}

        {/* Expand Header Hint Arrow */}
        <button
          onClick={() => setIsHeaderHovered(!isHeaderHovered)}
          onMouseEnter={handleMouseEnter}
          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-[10px] mt-1 transition-colors"
          title="Rê chuột để hiện Menu chính trên đầu trang"
        >
          <ChevronRight className="w-3.5 h-3.5 animate-pulse" />
        </button>
      </aside>

      {/* 3. Main Floating Capsule Header (Slides down when mouse hovers on PC, stays sticky on mobile) */}
      <header
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`fixed top-0 sm:top-3 left-0 right-0 z-50 transition-all duration-300 px-3 sm:px-6 max-w-7xl mx-auto w-full ${
          isHeaderHovered
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : 'md:-translate-y-28 md:opacity-0 md:pointer-events-none translate-y-0 opacity-100'
        }`}
      >
        <div className="relative w-full rounded-2xl sm:rounded-full px-4 sm:px-6 py-2.5 bg-white/95 dark:bg-[#121214]/95 border border-[#E5E1D8] dark:border-[#27272A] shadow-2xl backdrop-blur-2xl transition-colors duration-300">
          <div className="flex items-center justify-between">
            
            {/* Left: Brand Logo & Links (enchantalts style from Image 2) */}
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5865F2] via-indigo-600 to-purple-600 p-[1.5px] transition-transform duration-300 group-hover:scale-105 shadow-[0_0_15px_rgba(88,101,242,0.35)]">
                  <div className="w-full h-full bg-white dark:bg-[#121214] rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#5865F2] group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                </div>
                <span className="text-lg font-black tracking-wider text-slate-900 dark:text-white font-sans">
                  chin<span className="text-[#5865F2]">store</span>
                </span>
              </Link>

              {/* Desktop Links (Shop, Discord, Terms, Track) */}
              <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-xs font-semibold">
                <Link
                  href="/"
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                >
                  {t('home')}
                </Link>
                <Link
                  href="/shop"
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                >
                  {t('shop')}
                </Link>
                <a
                  href="https://discord.gg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-1.5"
                >
                  <DiscordIcon className="w-3.5 h-3.5 text-[#5865F2]" />
                  <span>Discord</span>
                </a>
                <a
                  href="/#features"
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                >
                  Terms
                </a>
                {onOpenTrackModal && (
                  <button
                    onClick={onOpenTrackModal}
                    className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:text-[#5865F2] rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#5865F2]" />
                    <span>{t('trackOrder')}</span>
                  </button>
                )}
              </nav>
            </div>

            {/* Right: Currency, Language Select, Theme Toggle, Cart & Discord Login Button */}
            <div className="flex items-center space-x-2.5 sm:space-x-3">
              
              {/* Currency Selector Pill */}
              <div className="hidden lg:flex items-center bg-[#EFECE5] dark:bg-[#1E1E24] border border-[#DDD8CE] dark:border-[#27272A] rounded-full px-1.5 py-0.5">
                {currencies.map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setCurrency(curr)}
                    className={`px-2 py-0.5 text-[11px] font-mono font-semibold rounded-full transition-all ${
                      currency === curr
                        ? 'bg-[#5865F2] text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>

              {/* Language Multi-Select Dropdown (like Image 2: 🌐 EN) */}
              <div className="relative flex items-center">
                <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 absolute left-2.5 pointer-events-none" />
                <select
                  value={locale}
                  onChange={(e) => handleLanguageToggle(e.target.value as 'vi' | 'en')}
                  className="appearance-none pl-7 pr-6 py-1.5 rounded-full text-xs font-semibold bg-[#EFECE5] dark:bg-[#1E1E24] border border-[#DDD8CE] dark:border-[#27272A] text-slate-700 dark:text-slate-200 hover:bg-[#E5E0D5] dark:hover:bg-white/10 cursor-pointer outline-none transition-all"
                  aria-label="Chọn ngôn ngữ"
                >
                  <option value="vi" className="bg-white dark:bg-[#121214] text-slate-900 dark:text-white">
                    VI
                  </option>
                  <option value="en" className="bg-white dark:bg-[#121214] text-slate-900 dark:text-white">
                    EN
                  </option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400 absolute right-2 pointer-events-none" />
              </div>

              {/* Sun/Moon Theme Toggle (From Uiverse.io by Type-Delta) */}
              <div className="flex items-center justify-center p-1" title="Chuyển chế độ Sáng / Tối">
                <ThemeToggle id="themeToggle-header" />
              </div>

              {/* Cart Button */}
              <button
                id="open-cart-btn"
                onClick={() => setCartOpen(true)}
                className="relative p-2 rounded-full bg-[#EFECE5] dark:bg-[#1E1E24] border border-[#DDD8CE] dark:border-[#27272A] text-slate-700 dark:text-slate-300 hover:text-[#5865F2] transition-all hover:scale-105 active:scale-95 group"
                aria-label="Open cart drawer"
              >
                <ShoppingBag className="w-4 h-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#5865F2] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Discord Login Button (Only Discord - Exact match to Image 2) */}
              {session?.user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#5865F2]/10 border border-[#5865F2]/30 text-[#5865F2] text-xs font-semibold hover:bg-[#5865F2]/20 transition-all shadow-sm"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#5865F2] text-white flex items-center justify-center font-bold text-[10px]">
                      {session.user.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="hidden sm:inline truncate max-w-[90px]">
                      {session.user.name}
                    </span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E5E1D8] dark:border-[#27272A] p-2 shadow-2xl backdrop-blur-xl z-50">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          router.push('/profile');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors text-left"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-[#5865F2]" />
                        <span>Tủ đồ & Tài khoản</span>
                      </button>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          signOut({ callbackUrl: '/' });
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleDiscordLogin}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(88,101,242,0.35)] hover:shadow-[0_0_20px_rgba(88,101,242,0.5)] active:scale-95"
                >
                  <DiscordIcon className="w-3.5 h-3.5 fill-current" />
                  <span>Login Discord</span>
                </button>
              )}

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E5E1D8] dark:border-[#27272A] p-4 space-y-3 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col space-y-2 text-sm font-semibold">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5"
              >
                {t('home')}
              </Link>
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5"
              >
                {t('shop')}
              </Link>
              <a
                href="https://discord.gg"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2"
              >
                <DiscordIcon className="w-4 h-4 text-[#5865F2]" />
                <span>Discord</span>
              </a>
              <a
                href="/#features"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5"
              >
                Terms
              </a>

              {session?.user ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push('/profile');
                  }}
                  className="text-left px-3 py-2 text-[#5865F2] hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
                >
                  Tủ Đồ & Hồ Sơ Cá Nhân
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleDiscordLogin();
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 text-white bg-[#5865F2] hover:bg-[#4752C4] rounded-xl font-bold shadow-md"
                >
                  <DiscordIcon className="w-4 h-4 fill-current" />
                  <span>Login Discord</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

