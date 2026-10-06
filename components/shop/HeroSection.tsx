'use client';

import React from 'react';
import { Zap, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from '@/navigation';

export function HeroSection() {
  return (
    <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 px-4 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* CỘT TRÁI: TIÊU ĐỀ & KÊU GỌI HÀNH ĐỘNG */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Badge Thông Báo Chuẩn Linear */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md text-xs font-medium text-slate-300 hover:border-brand-primary/40 transition-colors mb-6">
            <span className="flex h-2 w-2 rounded-full bg-brand-emerald animate-pulse" />
            <span>Hệ Thống Tự Động 24/7 • Giao Dịch Tức Thì</span>
            <Sparkles className="w-3.5 h-3.5 text-brand-secondary ml-1"/>
          </div>

          {/* Headline Typography Cấp Cao */}
          <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Nền Tảng Giao Dịch <br />
            <span className="bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              Tài Nguyên Số Tự Động
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-xl font-normal leading-relaxed">
            Hỗ trợ Minecraft Alts, Steam, AI Keys & Subscription bản quyền. Tích hợp chuyển khoản quét mã VietQR SePay và tiền mã hóa Litecoin On-Chain với tốc độ giao hàng chỉ 3 giây.
          </p>

          {/* Nút Bấm Uiverse Gradient & Secondary */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link 
              href="/shop"
              className="group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-brand-primary via-indigo-500 to-brand-secondary shadow-[0_0_30px_rgba(99,102,241,0.35)] hover:shadow-[0_0_45px_rgba(99,102,241,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300" 
            >
              <span>Khám Phá Cửa Hàng</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
            </Link>

            <a 
              href="#features"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-300 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:text-white transition-all backdrop-blur-md" 
            >
              Tìm Hiểu Tính Năng
            </a>
          </div>

          {/* Metrics / Số Liệu Uy Tín */}
          <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-white/[0.06] w-full max-w-lg">
            <div>
              <div className="text-2xl font-bold text-white tracking-tight">99.9%</div>
              <div className="text-xs text-slate-500 mt-0.5">Uptime Hệ Thống</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white tracking-tight">&lt; 5s</div>
              <div className="text-xs text-slate-500 mt-0.5">Thời Gian Giao Hàng</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white tracking-tight">24/7</div>
              <div className="text-xs text-slate-500 mt-0.5">Bảo Hành 1 Đổi 1</div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: INTERACTIVE BENTO CARD (THAY THẾ HOÀN TOÀN TERMINAL CŨ) */}
        <div className="lg:col-span-5 relative">
          {/* Vầng sáng phía sau thẻ Showcase */}
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/20 via-brand-secondary/20 to-transparent blur-3xl rounded-3xl" />
          
          <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-white/[0.15] via-white/[0.05] to-transparent shadow-2xl animate-float">
            <div className="rounded-[23px] bg-[#0C0E17]/90 backdrop-blur-2xl p-6 border border-white/[0.05]">
              
              {/* Header Showcase */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-brand-emerald animate-ping" />
                  <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">Giao Dịch Gần Nhất</span>
                </div>
                <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                  Instant Fulfill
                </span>
              </div>

              {/* Sản phẩm Demo tiêu biểu */}
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">
                      MC
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Minecraft Java Full Access</div>
                      <div className="text-xs text-slate-500">Đã đổi mail • Bảo hành trọn đời</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">180.000 đ</div>
                    <div className="text-[10px] text-brand-emerald">Đã giao • 10s trước</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm">
                      AI
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Claude 3.5 Sonnet Key</div>
                      <div className="text-xs text-slate-500">Gói Developer • API Riêng</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">0.038 LTC</div>
                    <div className="text-[10px] text-brand-emerald">Đã giao • 42s trước</div>
                  </div>
                </div>
              </div>

              {/* Box cam kết bảo mật */}
              <div className="mt-5 p-3 rounded-xl bg-gradient-to-r from-brand-primary/10 to-transparent border border-brand-primary/20 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-indigo-400 flex-shrink-0"/>
                <p className="text-xs text-slate-300">
                  Mọi tài khoản & key được mã hóa <strong>AES-256</strong>, chỉ giải mã trực tiếp sau khi hoàn tất giao dịch.
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default HeroSection;
