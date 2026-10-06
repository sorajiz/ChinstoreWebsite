'use client';

import React, { useState, useEffect } from 'react';
import { Link } from '@/navigation';
import { Flame, Clock, Copy, Check, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { toast } from 'sonner';

export default function FlashDealBanner() {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText('CHIN2026');
    setCopied(true);
    toast.success('Đã sao chép mã giảm giá: CHIN2026 (-20K)', {
      icon: <Tag className="w-4 h-4 text-emerald-400" />,
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const padZero = (n: number) => n.toString().padStart(2, '0');

  return (
    <section className="py-10 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-[1px] bg-gradient-to-r from-brand-primary via-purple-500 to-cyan-500 shadow-[0_0_50px_rgba(99,102,241,0.2)] overflow-hidden">
          
          {/* Inner Content Container */}
          <div className="relative rounded-[23px] bg-[#0A0D18]/95 backdrop-blur-2xl p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Ambient Background glow */}
            <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-brand-primary/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

            {/* Left Content */}
            <div className="space-y-4 max-w-2xl text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
                <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>CHƯƠNG TRÌNH CYBER FLASH SALE TRONG NGÀY</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                Ưu Đãi Đặc Quyền Giảm Đến{' '}
                <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-300 bg-clip-text text-transparent">
                  35% Toàn Bộ Kho Key
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Áp dụng cho tất cả tài khoản Minecraft Alts FA, Steam CS2 Prime và các gói AI Chatbot Pro. Số lượng key có hạn theo từng khung giờ!
              </p>

              {/* Voucher Code Box */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <span className="text-xs text-slate-400 font-medium">Mã giảm thêm:</span>
                <button
                  onClick={handleCopyCode}
                  className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.12] hover:border-brand-primary/50 text-white font-mono font-bold text-xs transition-all shadow-inner"
                >
                  <Tag className="w-3.5 h-3.5 text-brand-primary" />
                  <span className="tracking-widest">CHIN2026</span>
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                  )}
                </button>
                <span className="text-[11px] text-emerald-400 font-medium">
                  • Giảm trực tiếp 20.000đ khi thanh toán
                </span>
              </div>
            </div>

            {/* Right Timer & CTA */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-6 z-10 shrink-0">
              
              {/* Countdown Digits */}
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-center p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] min-w-[64px]">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                    {padZero(timeLeft.hours)}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-medium mt-0.5">Giờ</span>
                </div>
                <span className="text-xl font-bold text-indigo-400 font-mono">:</span>
                <div className="flex flex-col items-center p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] min-w-[64px]">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                    {padZero(timeLeft.minutes)}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-medium mt-0.5">Phút</span>
                </div>
                <span className="text-xl font-bold text-indigo-400 font-mono">:</span>
                <div className="flex flex-col items-center p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] min-w-[64px]">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-cyan-400">
                    {padZero(timeLeft.seconds)}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-medium mt-0.5">Giây</span>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href="/shop"
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-brand-primary via-indigo-600 to-cyan-500 shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:shadow-[0_0_35px_rgba(99,102,241,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all w-full sm:w-auto"
              >
                <span>Săn Deal Hot Ngay</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
