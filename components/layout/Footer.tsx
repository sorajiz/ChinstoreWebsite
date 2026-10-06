'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Sparkles, QrCode, Lock, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="relative border-t border-[#E5E1D8] dark:border-[#27272A] bg-[#F7F5F0] dark:bg-[#09090B] pt-16 pb-12 overflow-hidden text-zinc-700 dark:text-zinc-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-zinc-800 border border-zinc-700/50 p-[1px] shadow-sm">
                <div className="w-full h-full bg-zinc-900 dark:bg-[#121214] rounded-[11px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-wider text-zinc-900 dark:text-white font-sans">
                CHIN<span className="text-zinc-500 dark:text-zinc-400">STORE</span>
                <span className="text-[10px] ml-1.5 uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-bold">
                  2.0
                </span>
              </span>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm leading-relaxed">
              {t('desc')}
            </p>

            {/* Payment & Security Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-md bg-white dark:bg-[#121215] border border-[#E5E1D8] dark:border-[#27272A] text-[11px] font-mono text-zinc-800 dark:text-zinc-300 flex items-center gap-1.5 shadow-xs">
                <QrCode className="w-3.5 h-3.5" />
                VietQR SePay
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white dark:bg-[#121215] border border-[#E5E1D8] dark:border-[#27272A] text-[11px] font-mono text-zinc-800 dark:text-zinc-300 flex items-center gap-1.5 shadow-xs">
                <span className="font-bold">Ł</span>
                Litecoin 0-Conf
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white dark:bg-[#121215] border border-[#E5E1D8] dark:border-[#27272A] text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 shadow-xs">
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                AES-256
              </span>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-900 dark:text-white font-bold">
              {t('categories')}
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/shop?category=minecraft-alts" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Minecraft Alts & Ranks
                </Link>
              </li>
              <li>
                <Link href="/shop?category=gaming-accounts" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Steam & CS2 Prime VIP
                </Link>
              </li>
              <li>
                <Link href="/shop?category=ai-software" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  AI ChatGPT & Claude 3.5
                </Link>
              </li>
              <li>
                <Link href="/shop?category=entertainment" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Netflix 4K & Spotify
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-900 dark:text-white font-bold">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  {t('allStore')}
                </Link>
              </li>
              <li>
                <a href="#featured-products" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  {t('hotDeals')}
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  {t('autoFeatures')}
                </a>
              </li>
            </ul>
          </div>

          {/* Support & Community */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-900 dark:text-white font-bold">
              {t('support')}
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {t('support247')}
                </span>
              </li>
              <li>
                <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  {t('community')}
                </a>
              </li>
              <li>
                <span className="hover:text-zinc-950 dark:hover:text-white cursor-pointer transition-colors">
                  {t('warrantyPolicy')}
                </span>
              </li>
              <li>
                <span className="hover:text-zinc-950 dark:hover:text-white cursor-pointer transition-colors">
                  {t('terms')}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#E5E1D8] dark:border-[#27272A] flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 gap-4">
          <p>© {new Date().getFullYear()} CHIN STORE. {t('rights')}</p>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('systemOnline')}</span>
            </div>
            <span>•</span>
            <span>Next.js 14 App Router</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
