'use client';

import React from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from '@/navigation';
import { useLocale } from 'next-intl';
import { X, ExternalLink, Zap, ShieldCheck } from 'lucide-react';
import { useStore } from '@/lib/store';
import Image from 'next/image';

interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  defaultTab?: 'login' | 'register';
  onSuccess?: () => void;
}

export default function AuthModal({
  isOpen: propIsOpen,
  onClose: propOnClose,
}: AuthModalProps) {
  const { isAuthModalOpen, setAuthModalOpen } = useStore();
  const router = useRouter();
  const locale = useLocale();
  const isEn = locale === 'en';

  const isOpen = propIsOpen !== undefined ? propIsOpen : isAuthModalOpen;
  const onClose = propOnClose || (() => setAuthModalOpen(false));

  if (!isOpen) return null;

  const handleDiscordLogin = () => {
    signIn('discord', { callbackUrl: window.location.href });
  };

  const handleGoToLoginPage = () => {
    onClose();
    router.push('/login');
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
      />

      {/* Modal Card - ONLY Discord theo yêu cầu */}
      <div className="relative w-full max-w-md bg-[#0D0D12] border border-zinc-800/90 rounded-3xl overflow-hidden shadow-2xl z-10 my-8 text-white p-7 sm:p-9 space-y-6 text-center animate-in zoom-in-95 duration-200">
        
        {/* Nút đóng */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer z-20 border border-zinc-800"
          title={isEn ? 'Close' : 'Đóng'}
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Branding */}
        <div className="space-y-3 pt-2">
          <div className="w-14 h-14 rounded-2xl mx-auto overflow-hidden border border-zinc-800 shadow-xl bg-zinc-950 flex items-center justify-center p-1.5 relative">
            <Image
              src="/images/logo/logo-rounded.png"
              alt="ChinStore"
              width={48}
              height={48}
              className="object-contain rounded-xl"
            />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">
              {isEn ? 'Sign in to ChinStore' : 'Đăng nhập ChinStore'}
            </h2>
            <p className="text-xs text-zinc-400 font-sans max-w-xs mx-auto leading-relaxed">
              {isEn
                ? 'Continue with your Discord account for instant key delivery and automated warranty.'
                : 'Tiếp tục với tài khoản Discord của bạn để nhận key tức thì và kích hoạt bảo hành tự động.'}
            </p>
          </div>
        </div>

        {/* ONLY Discord Action Button */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleDiscordLogin}
            className="w-full py-4 px-6 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-sm font-black flex items-center justify-center gap-3 transition-all cursor-pointer shadow-[0_8px_30px_rgba(88,101,242,0.4)] active:scale-98 hover:shadow-[0_12px_40px_rgba(88,101,242,0.6)] group"
          >
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
              ? 'Exclusively via Discord OAuth2 • 100% Instant & Secure'
              : 'Chỉ hỗ trợ đăng nhập qua Discord • Nhanh & An toàn 100%'}
          </div>
        </div>

        {/* Quick Highlights */}
        <div className="grid grid-cols-2 gap-2 text-left pt-2 border-t border-zinc-800/80">
          <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/60 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-[11px] text-zinc-300 font-medium">
              {isEn ? 'Instant Key Delivery' : 'Giao key tự động'}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/60 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="text-[11px] text-zinc-300 font-medium">
              {isEn ? 'Secure OAuth2' : 'OAuth2 Bảo mật'}
            </span>
          </div>
        </div>

        {/* Link to dedicated page */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleGoToLoginPage}
            className="text-xs text-zinc-400 hover:text-white inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>{isEn ? 'Open dedicated login page' : 'Mở trang đăng nhập riêng biệt'}</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

      </div>
    </div>
  );
}
