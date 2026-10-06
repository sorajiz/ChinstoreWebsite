'use client';

import React, { useRef, useState } from 'react';
import { Zap, ShieldCheck, Coins, Lock, Sparkles } from 'lucide-react';

interface Pillar {
  icon: React.ReactNode;
  title: string;
  tag: string;
  desc: string;
  color: string;
  borderGlow: string;
}

const PILLARS: Pillar[] = [
  {
    icon: <Zap className="w-6 h-6 text-indigo-400" />,
    title: 'Giao Dịch Tự Động 24/7',
    tag: 'TỨC THÌ < 5S',
    desc: 'Hệ thống SePay IPN và Litecoin Mempool xử lý hoàn toàn tự động, giao dữ liệu tài khoản và key ngay trên màn hình hóa đơn.',
    color: 'from-indigo-500/15 to-purple-500/5',
    borderGlow: 'hover:border-indigo-400/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]',
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
    title: 'Bảo Hành 1 Đổi 1 Uy Tín',
    tag: 'CAM KẾT 100%',
    desc: 'Mọi tài khoản Minecraft, Steam, AI đều được kiểm tra kỹ lưỡng (Live-check) trước khi bàn giao. Lỗi là đổi mới không kỳ kèo.',
    color: 'from-emerald-500/15 to-teal-500/5',
    borderGlow: 'hover:border-emerald-400/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]',
  },
  {
    icon: <Coins className="w-6 h-6 text-purple-400" />,
    title: 'VietQR & Litecoin 0-Conf',
    tag: 'ĐA CỔNG THANH TOÁN',
    desc: 'Hỗ trợ quét VietQR mọi ngân hàng Việt Nam và tiền điện tử Litecoin (LTC) ẩn danh, tốc độ 0-conf cực nhanh, phí mạng cực thấp.',
    color: 'from-purple-500/15 to-indigo-500/5',
    borderGlow: 'hover:border-purple-400/40 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]',
  },
  {
    icon: <Lock className="w-6 h-6 text-amber-400" />,
    title: 'Kho Hàng Mã Hóa AES-256',
    tag: 'BẢO MẬT QUÂN ĐỘI',
    desc: 'Dữ liệu nhạy cảm được mã hóa AES-256-GCM với khóa riêng biệt. Chỉ đơn hàng thanh toán thành công mới được giải mã trực tiếp.',
    color: 'from-amber-500/15 to-orange-500/5',
    borderGlow: 'hover:border-amber-400/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]',
  },
];

function SpotlightCard({ pillar }: { pillar: Pillar }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-3xl p-6 sm:p-7 glass-card border border-white/[0.06] transition-all duration-300 overflow-hidden group ${pillar.borderGlow}`}
    >
      {/* Dynamic Cursor Spotlight Radial Glow (Soft Indigo) */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.14), transparent 80%)`,
        }}
      />

      {/* Background Subtle Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${pillar.color} opacity-30 group-hover:opacity-60 transition-opacity`} />

      {/* Content */}
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
            {pillar.icon}
          </div>
          <span className="text-[10px] font-mono font-medium tracking-wider px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300">
            {pillar.tag}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white font-sans group-hover:text-indigo-300 transition-colors">
            {pillar.title}
          </h3>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            {pillar.desc}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CorePillars() {
  return (
    <section id="features" className="py-16 sm:py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-indigo-300 text-xs font-medium backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>NỀN TẢNG TIÊU CHUẨN QUỐC TẾ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-sans text-white tracking-tight">
            Trải Nghiệm Mua Sắm <span className="bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">Không Tì Vết</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-sans leading-relaxed">
            Kết hợp độ tin cậy của mô hình Plati.market và tốc độ giao dịch tự động của EnchantAlts, mang đến dịch vụ số cao cấp nhất cho game thủ & chuyên gia công nghệ.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((pillar, idx) => (
            <SpotlightCard key={idx} pillar={pillar} />
          ))}
        </div>
      </div>
    </section>
  );
}
