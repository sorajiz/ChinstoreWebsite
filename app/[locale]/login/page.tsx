'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useSession, signIn } from 'next-auth/react';
import { useRouter, Link } from '@/navigation';
import { useLocale } from 'next-intl';
import {
  ArrowLeft,
  ShieldCheck,
  Zap,
  Sparkles,
  Lock,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const isEn = locale === 'en';

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/profile');
    }
  }, [status, router]);

  const handleDiscordSignIn = () => {
    signIn('discord', { callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col justify-between selection:bg-[#5865F2]/30 selection:text-white relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#5865F2]/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Bar with Back Link */}
      <header className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-8 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>&lt; {isEn ? 'Back to shop' : 'Quay lại cửa hàng'}</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono text-zinc-400">
            {isEn ? 'Discord OAuth2 Active' : 'Cổng Discord OAuth2 Trực Tuyến'}
          </span>
        </div>
      </header>

      {/* Main Login Card - Dedicated Clean Obsidian Aesthetic */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-3xl bg-[#0d0d12]/90 border border-zinc-800/80 p-6 sm:p-9 shadow-2xl backdrop-blur-2xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
          
          {/* Logo & Branding */}
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-2xl mx-auto overflow-hidden border border-zinc-800 shadow-xl bg-zinc-950 flex items-center justify-center p-2 relative group">
              <Image
                src="/images/logo/logo-rounded.png"
                alt="ChinStore"
                width={56}
                height={56}
                className="object-contain rounded-xl group-hover:scale-105 transition-transform"
                priority
              />
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-white">
                {isEn ? 'Sign in to ChinStore' : 'Đăng nhập ChinStore'}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-xs mx-auto leading-relaxed">
                {isEn
                  ? 'Connect with your Discord account for instant order delivery and automated 24/7 support.'
                  : 'Đăng nhập nhanh bằng tài khoản Discord của bạn để nhận key tức thì và kích hoạt bảo hành tự động.'}
              </p>
            </div>
          </div>

          {/* Discord Single-Click Action Button */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleDiscordSignIn}
              className="w-full py-4 px-6 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-sm sm:text-base font-black flex items-center justify-center gap-3 transition-all cursor-pointer shadow-[0_8px_30px_rgba(88,101,242,0.4)] active:scale-98 hover:shadow-[0_12px_40px_rgba(88,101,242,0.6)] group"
            >
              {/* Discord SVG Icon */}
              <svg
                className="w-5 h-5 fill-current shrink-0 group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
              >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.894c-.041.015-.06.066-.04.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              <span>{isEn ? 'CONTINUE WITH DISCORD' : 'TIẾP TỤC VỚI DISCORD'}</span>
            </button>

            <div className="text-[11px] font-mono text-zinc-500">
              {isEn
                ? 'Only Discord login supported • No password required'
                : 'Chỉ hỗ trợ đăng nhập qua Discord • Không cần nhớ mật khẩu'}
            </div>
          </div>

          {/* Bento Feature Badges */}
          <div className="pt-4 border-t border-zinc-800/80 grid grid-cols-1 gap-2.5 text-left text-xs">
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white text-[12px]">
                  {isEn ? 'Instant Automatic Delivery' : 'Giao nhận tức thì'}
                </div>
                <div className="text-[11px] text-zinc-400">
                  {isEn ? 'Key & credentials sent to DM & Profile' : 'Đơn hàng tự động lưu vào trang cá nhân'}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white text-[12px]">
                  {isEn ? '100% Safe OAuth2' : 'Bảo mật tuyệt đối'}
                </div>
                <div className="text-[11px] text-zinc-400">
                  {isEn ? 'Authorized directly through Discord Inc.' : 'Xác thực chuẩn qua Discord API'}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Discord Support link */}
          <div className="pt-2">
            <a
              href="https://discord.gg/mSG6dR4JMv"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <span>{isEn ? 'Need help? Join Discord Server' : 'Cần trợ giúp? Tham gia Discord ChinStore'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>
      </main>

      {/* Footer copyright */}
      <footer className="relative z-10 py-4 text-center text-xs font-mono text-zinc-600">
        &copy; {new Date().getFullYear()} ChinStore. All rights reserved.
      </footer>
    </div>
  );
}
