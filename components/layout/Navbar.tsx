'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname, Link } from '@/navigation';
import { useSession } from 'next-auth/react';
import { useStore } from '@/lib/store';
import {
  ShoppingBag,
  Sparkles,
  Menu,
  X,
  Coins,
  Globe,
  ShieldCheck,
  User as UserIcon,
  Search,
} from 'lucide-react';
import { CurrencyType } from '@/types';
import AuthModal from '@/components/auth/AuthModal';

interface NavbarProps {
  onOpenTrackModal?: () => void;
}

export default function Navbar({ onOpenTrackModal }: NavbarProps) {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const { setCartOpen, currency, setCurrency, getCartItemCount } = useStore();
  const itemCount = getCartItemCount();

  const handleLanguageToggle = (newLocale: 'vi' | 'en') => {
    if (newLocale !== locale) {
      router.replace(pathname, { locale: newLocale });
    }
  };

  const currencies: CurrencyType[] = ['VND', 'USD', 'LTC'];

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#08090E]/85 border-b border-white/[0.06] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo & Live Status */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary via-indigo-600 to-brand-secondary p-[1.5px] transition-transform duration-300 group-hover:scale-105 shadow-[0_0_20px_rgba(99,102,241,0.35)]">
                  <div className="w-full h-full bg-[#0C0E17] rounded-[10px] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold tracking-wider text-white flex items-center gap-1.5 font-sans">
                    CHIN<span className="bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">STORE</span>
                    <span className="text-[10px] uppercase tracking-widest font-mono bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-1.5 py-0.5 rounded">
                      2.0
                    </span>
                  </span>
                  <span className="text-[11px] text-slate-400 hidden sm:block tracking-wide font-sans">
                    ALTS & DIGITAL COMMERCE
                  </span>
                </div>
              </Link>

              {/* Status Badge */}
              <div className="hidden xl:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Tự Động 24/7 • 12ms</span>
              </div>
            </div>

            {/* Desktop Nav Links & Quick Search */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              <Link
                href="/shop"
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-xs text-slate-400 hover:text-white transition-all mr-2"
              >
                <Search className="w-3.5 h-3.5 text-indigo-400" />
                <span>Tìm kiếm...</span>
                <kbd className="text-[10px] bg-white/[0.08] px-1.5 py-0.5 rounded text-slate-400 font-mono">⌘K</kbd>
              </Link>

              <Link
                href="/"
                className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg transition-colors hover:bg-white/[0.04]"
              >
                {t('home')}
              </Link>
              <Link
                href="/shop"
                className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg transition-colors hover:bg-white/[0.04]"
              >
                {t('shop')}
              </Link>
              <a
                href="/#featured-products"
                className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg transition-colors hover:bg-white/[0.04]"
              >
                Hot Deals
              </a>
              <a
                href="/#features"
                className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg transition-colors hover:bg-white/[0.04]"
              >
                {t('features')}
              </a>
              {onOpenTrackModal && (
                <button
                  onClick={onOpenTrackModal}
                  className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-indigo-300 rounded-lg transition-colors hover:bg-white/[0.04] flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  {t('trackOrder')}
                </button>
              )}
            </nav>

            {/* Right Action Bar */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Currency Selector Pill */}
              <div className="hidden lg:flex items-center bg-[#0C0E17] border border-white/[0.08] rounded-full p-1 shadow-inner">
                <span className="text-xs text-slate-400 px-2 flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                </span>
                {currencies.map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setCurrency(curr)}
                    className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-full transition-all ${
                      currency === curr
                        ? 'bg-gradient-to-r from-brand-primary to-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.35)]'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>

              {/* Language Switcher Pill */}
              <div className="flex items-center bg-[#0C0E17] border border-white/[0.08] rounded-full p-1">
                <span className="text-xs text-slate-400 px-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-400" />
                </span>
                <button
                  onClick={() => handleLanguageToggle('vi')}
                  className={`px-2 py-0.5 text-xs font-bold rounded-full transition-all ${
                    locale === 'vi'
                      ? 'bg-brand-primary text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  VI
                </button>
                <button
                  onClick={() => handleLanguageToggle('en')}
                  className={`px-2 py-0.5 text-xs font-bold rounded-full transition-all ${
                    locale === 'en'
                      ? 'bg-brand-primary text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* User Account / Login Button */}
              {session?.user ? (
                <button
                  onClick={() => router.push('/profile')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/20 transition-all shadow-sm"
                  title="Hồ sơ cá nhân & Tủ đồ"
                >
                  <div className="w-5 h-5 rounded-full bg-cyan-400 text-black flex items-center justify-center font-bold text-[10px]">
                    {session.user.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline truncate max-w-[100px]">
                    {session.user.name}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-all"
                >
                  <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Đăng Nhập</span>
                </button>
              )}

              {/* Cart Button */}
              <button
                id="open-cart-btn"
                onClick={() => setCartOpen(true)}
                className="relative p-2.5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/15 hover:border-cyan-400/50 transition-all hover:scale-105 active:scale-95 group shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                aria-label="Open cart drawer"
              >
                <ShoppingBag className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center border border-black shadow-[0_0_10px_rgba(236,72,153,0.8)] animate-pulse">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/5"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0e1c] border-b border-white/10 px-4 pt-3 pb-6 space-y-3">
            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-base font-medium text-slate-300 hover:text-cyan-400 rounded-lg hover:bg-white/5"
              >
                {t('home')}
              </Link>
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-base font-medium text-slate-300 hover:text-cyan-400 rounded-lg hover:bg-white/5"
              >
                {t('shop')}
              </Link>
              <a
                href="/#features"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-base font-medium text-slate-300 hover:text-cyan-400 rounded-lg hover:bg-white/5"
              >
                {t('features')}
              </a>
              {session?.user ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push('/profile');
                  }}
                  className="text-left px-3 py-2 text-base font-medium text-cyan-400 hover:bg-white/5 rounded-lg"
                >
                  Tủ Đồ & Hồ Sơ Cá Nhân
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="text-left px-3 py-2 text-base font-medium text-cyan-400 hover:bg-white/5 rounded-lg"
                >
                  Đăng Nhập / Tạo Tài Khoản
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}
