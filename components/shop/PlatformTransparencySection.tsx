'use client';

import React from 'react';
import { Zap, Clock, MessageSquare, QrCode, ShieldCheck, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from '@/navigation';

export function PlatformTransparencySection() {
  return (
    <section className="py-14 sm:py-20 relative max-w-7xl mx-auto px-4 sm:px-6 w-full">
      {/* Header */}
      <div className="space-y-2 mb-8 sm:mb-10 text-left">
        <span className="text-xs font-mono font-bold tracking-wider text-zinc-500 uppercase">
          NỀN TẢNG CHINSTORE
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 dark:text-[#F4F4F5] tracking-tight font-sans">
          Giao ngay hay 24–48h, ghi rõ từng món.
        </h2>
      </div>

      {/* Grid 5 Cards matching Image 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Card 1: Giao hàng (Chiếm 7 cột) */}
        <div className="lg:col-span-7 rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-[#27272A] shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-[#18181C] border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200">
              <Zap className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
              <span>Giao hàng</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-[#F4F4F5]">
              Món nào cũng biết trước bao lâu có hàng
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-[#94949E] leading-relaxed">
              Trang sản phẩm ghi rõ món đó giao tự động hay làm thủ công. Không có chuyện trả tiền xong mới biết phải chờ.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#18181C] border border-zinc-200 dark:border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-white">
                <Zap className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Có sẵn — giao ngay</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Thanh toán xong, hàng hiện ngay trong chi tiết đơn của bạn.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#18181C] border border-zinc-200 dark:border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-white">
                <Clock className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />
                <span>Làm thủ công — 24 đến 48 giờ</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Nhân viên làm tay và báo tiến độ ngay trong đơn. Nhiều mặt hàng thuộc nhóm này.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Discord Support 1-1 (Chiếm 5 cột) */}
        <div className="lg:col-span-5 rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-[#27272A] shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-[#18181C] border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200">
              <MessageSquare className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
              <span>Discord</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-[#F4F4F5]">
              Có người thật hỗ trợ 1-1
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-[#94949E] leading-relaxed">
              Gặp vấn đề? Mở ticket trong máy chủ Discord, nhân viên xem đúng đơn của bạn và trả lời trực tiếp — không qua trung gian bot tự động.
            </p>
          </div>

          <a
            href="https://discord.gg"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-[#18181C] dark:hover:bg-[#202025] text-white border border-zinc-800 dark:border-zinc-700 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xs"
          >
            <span>Gia nhập máy chủ Discord</span>
            <ArrowRight className="w-4 h-4 stroke-[2]" />
          </a>
        </div>

        {/* Card 3: Thanh toán QR (4 cột) */}
        <div className="lg:col-span-4 rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-[#27272A] shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-[#18181C] border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200">
              <QrCode className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
              <span>Thanh toán</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-[#F4F4F5]">
              Nạp ví bằng mã QR
            </h3>
            <p className="text-xs text-zinc-600 dark:text-[#94949E] leading-relaxed">
              Quét mã bằng app ngân hàng bất kỳ, tiền vào ví ngay. Lỡ ghi sai nội dung chuyển khoản thì nhân viên kiểm tra và cộng tay cho bạn.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px] text-zinc-600 dark:text-zinc-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Quét QR bằng mọi app ngân hàng, mọi lúc</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Nhận cả thẻ cào & crypto Litecoin 0-conf</span>
            </div>
          </div>
        </div>

        {/* Card 4: Bảo hành (4 cột) */}
        <div className="lg:col-span-4 rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-[#27272A] shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-[#18181C] border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
              <span>Bảo hành</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-[#F4F4F5]">
              Lỗi được xử lý rõ ràng 1-1
            </h3>
            <p className="text-xs text-zinc-600 dark:text-[#94949E] leading-relaxed">
              Mỗi món ghi rõ bảo hành bao lâu. Trong thời hạn đó, hàng lỗi được đổi mới hoặc hoàn tiền — kết quả hiện ngay trong tài khoản của bạn.
            </p>
          </div>

          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Xem ngay: ngày hết hạn bảo hành hiện trong chi tiết từng đơn.
            </span>
          </div>
        </div>

        {/* Card 5: Trang trí Decao (4 cột) */}
        <div className="lg:col-span-4 rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-[#27272A] shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-[#18181C] border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200">
              <Sparkles className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
              <span>Trang trí</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-[#F4F4F5]">
              Góc Discord Decao & Boost
            </h3>
            <p className="text-xs text-zinc-600 dark:text-[#94949E] leading-relaxed">
              Mẫu trang trí avatar, hiệu ứng hồ sơ profile effect và Discord Nitro. Xem trước trên hồ sơ mẫu trước khi quyết định mua.
            </p>
          </div>

          <Link
            href="/shop?category=discord-services"
            className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-[#18181C] dark:hover:bg-[#202025] text-white border border-zinc-800 dark:border-zinc-700 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xs"
          >
            <span>Xem kho Decao</span>
            <ArrowRight className="w-4 h-4 stroke-[2]" />
          </Link>
        </div>

      </div>
    </section>
  );
}

export default PlatformTransparencySection;
