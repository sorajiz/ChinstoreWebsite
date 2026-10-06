'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Sparkles, ShieldCheck, Heart, QrCode, Lock } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const tCommon = useTranslations('common');

  return (
    <footer className="relative border-t border-white/[0.08] bg-[#04060c] pt-16 pb-12 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 p-[1px] shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                <div className="w-full h-full bg-[#070a14] rounded-[11px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="text-xl font-black tracking-wider text-white font-display">
                CHIN<span className="gradient-text-cyan-purple">STORE</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              {t('desc')}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/10 text-[10px] font-mono text-cyan-300 flex items-center gap-1">
                <QrCode className="w-3 h-3 text-cyan-400" />
                SePay VietQR
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/10 text-[10px] font-mono text-purple-300 flex items-center gap-1">
                <span className="font-bold">Ł</span>
                Litecoin (LTC)
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/10 text-[10px] font-mono text-emerald-300 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                256-Bit SSL
              </span>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              {t('categories')}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#catalog" className="hover:text-cyan-400 transition-colors">Cyber Gear & Hardware</a></li>
              <li><a href="#catalog" className="hover:text-cyan-400 transition-colors">AI & Cloud Compute</a></li>
              <li><a href="#catalog" className="hover:text-cyan-400 transition-colors">Security & VPN Suite</a></li>
              <li><a href="#catalog" className="hover:text-cyan-400 transition-colors">Developer & Cyber Tools</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#hero" className="hover:text-cyan-400 transition-colors">{tCommon('home')}</a></li>
              <li><a href="#catalog" className="hover:text-cyan-400 transition-colors">{tCommon('shop')}</a></li>
              <li><a href="#features" className="hover:text-cyan-400 transition-colors">{tCommon('features')}</a></li>
              <li><a href="#hero" className="hover:text-cyan-400 transition-colors">API Docs</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              {t('legal')}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><span className="hover:text-cyan-400 cursor-pointer transition-colors">{t('privacy')}</span></li>
              <li><span className="hover:text-cyan-400 cursor-pointer transition-colors">{t('terms')}</span></li>
              <li><span className="hover:text-cyan-400 cursor-pointer transition-colors">{t('refund')}</span></li>
              <li><span className="hover:text-cyan-400 cursor-pointer transition-colors">AML / KYC Policy</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} CHIN STORE. {t('rights')}</p>
          <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
            <span>Powered by</span>
            <span className="text-cyan-400 font-bold">Next.js 14 & SePay IPN</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
