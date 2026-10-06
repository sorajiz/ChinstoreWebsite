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
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');

  const { setCartOpen, currency, setCurrency, getCartItemCount } = useStore();
  const itemCount = getCartItemCount();

  // Scroll logic: Header remains permanently visible at top with Glassmorphism, tracks active section
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Scrollspy detection for active section
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

  // Language options matching Image 3 style
  const languageOptions: SelectOption[] = [
    { value: 'vi', label: 'VI', subLabel: 'Tiếng Việt' },
    { value: 'en', label: 'EN', subLabel: 'English' },
  ];

  const handleLanguageSelect = (newLocale: string) => {
    if (newLocale !== locale) {
      router.replace(pathname, { locale: newLocale as 'vi' | 'en' });
    }
  };

  // Currency options matching Image 3 style
  const currencyOptions: SelectOption[] = [
    { value: 'VND', label: 'VND', subLabel: 'Việt Nam Đồng (₫)' },
    { value: 'USD', label: 'USD', subLabel: 'US Dollar ($)' },
    { value: 'LTC', label: 'LTC', subLabel: 'Litecoin (Ł)' },
  ];

  const handleCurrencySelect = (newCurr: string) => {
    setCurrency(newCurr as CurrencyType);
  };

  // Handle direct Discord login
  const handleDiscordLogin = () => {
    signIn('discord', { callbackUrl: window.location.href });
  };

  return (
    <>
      {/* Permanent Fixed Glass Header (Does not hide on scroll, Pure Glassmorphism) */}
      <header className="fixed top-0 sm:top-3 left-0 right-0 z-50 px-3 sm:px-6 max-w-7xl mx-auto w-full transition-all duration-300">
        <div data-sora-opt="glass" className="relative w-full rounded-2xl sm:rounded-full px-4 sm:px-6 py-2.5 bg-white/85 dark:bg-[#09090B]/85 border border-[#E4E1D8] dark:border-[#27272A] shadow-xl backdrop-blur-2xl transition-colors duration-300">
          <div className="flex items-center justify-between">
            
            {/* Left: Brand Logo & Navigation Links */}
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
                <a
                  href="#hero"
                  className={`px-3 py-1.5 rounded-full transition-all ${
                    activeSection === 'hero'
                      ? 'bg-black/10 dark:bg-white/10 text-slate-900 dark:text-white font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {t('home')}
                </a>
                <a
                  href="#featured-products"
                  className={`px-3 py-1.5 rounded-full transition-all ${
                    activeSection === 'featured-products'
                      ? 'bg-black/10 dark:bg-white/10 text-slate-900 dark:text-white font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {t('shop')}
                </a>
                <a
                  href="#transparency"
                  className={`px-3 py-1.5 rounded-full transition-all ${
                    activeSection === 'transparency'
                      ? 'bg-black/10 dark:bg-white/10 text-slate-900 dark:text-white font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {t('transparency')}
                </a>
                <a
                  href="#faq"
                  className={`px-3 py-1.5 rounded-full transition-all ${
                    activeSection === 'faq'
                      ? 'bg-black/10 dark:bg-white/10 text-slate-900 dark:text-white font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {t('faq')}
                </a>
              </nav>
            </div>

            {/* Right: Controls & Actions */}
            <div className="flex items-center space-x-2 sm:space-x-2.5">
              
              {/* Currency Multi-Select Dropdown (Matching Image 3) - Desktop */}
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

              {/* Language Multi-Select Dropdown (Matching Image 3) - Desktop */}
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

              {/* Compact Pure Sun/Moon Theme Toggle (Turns to full circle in light mode) */}
              <div className="flex items-center justify-center p-0.5" title="Chuyển chế độ Sáng / Tối">
                <ThemeToggle id="header-theme-toggle" />
              </div>

              {/* Cart Button */}
              <button
                id="open-cart-btn"
                onClick={() => setCartOpen(true)}
                className="relative p-2 rounded-full bg-[#EFECE5] dark:bg-[#18181C] border border-[#DDD8CE] dark:border-[#27272D] text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all hover:scale-105 active:scale-95 group cursor-pointer"
                aria-label="Open cart drawer"
              >
                <ShoppingBag className="w-4 h-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-[9px] font-bold rounded-full flex items-center justify-center shadow-md">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Discord Login Button / User Avatar (Desktop) */}
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
                    className="flex items-center gap-2 px-4 py-2 text-zinc-950 dark:text-zinc-950 bg-white hover:bg-zinc-100 dark:bg-white dark:hover:bg-zinc-100 border border-zinc-300 dark:border-transparent rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <DiscordIcon className="w-4 h-4 fill-current text-zinc-950" />
                    <span>Login Discord</span>
                  </button>
                )}
              </div>

              {/* Mobile Hamburger Toggle Button (Clean & Compact) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-[#EFECE5] dark:bg-[#18181C] border border-[#DDD8CE] dark:border-[#27272D] transition-colors cursor-pointer"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Full-Width Dropdown Menu (Enhanced Responsive Multi-Selects) */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 w-full rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-[#27272A] p-4 space-y-4 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-3 duration-200">
            {/* Navigation links */}
            <div className="flex flex-col space-y-1 text-sm font-semibold border-b border-zinc-200 dark:border-[#27272A] pb-3">
              <a
                href="#hero"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5"
              >
                {t('home')}
              </a>
              <a
                href="#featured-products"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5"
              >
                {t('shop')}
              </a>
              <a
                href="#transparency"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5"
              >
                {t('transparency')}
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5"
              >
                {t('faq')}
              </a>
            </div>

            {/* Complete, Accessible Multi-Select Controls on Mobile */}
            <div className="space-y-2 pt-1">
              <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Cấu hình hiển thị</div>
              <div className="grid grid-cols-2 gap-2">
                <CustomSelectDropdown
                  options={languageOptions}
                  selectedValue={locale}
                  onSelect={handleLanguageSelect}
                  triggerPrefix={<Globe className="w-3.5 h-3.5" />}
                  widthClass="w-full"
                  title="Ngôn ngữ"
                />

                <CustomSelectDropdown
                  options={currencyOptions}
                  selectedValue={currency}
                  onSelect={handleCurrencySelect}
                  triggerPrefix={<Coins className="w-3.5 h-3.5" />}
                  widthClass="w-full"
                  title="Tiền tệ"
                />
              </div>
            </div>

            {/* Discord Login Button on Mobile */}
            <div className="pt-2">
              {session?.user ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push('/profile');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 text-zinc-950 dark:text-white bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl font-bold transition-colors"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Tài Khoản: {session.user.name}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleDiscordLogin();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 text-zinc-950 dark:text-zinc-950 bg-white hover:bg-zinc-100 border border-zinc-300 dark:border-zinc-700 rounded-xl font-bold shadow-md transition-all active:scale-95"
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
