'use client';

import React from 'react';
import { Star, ShieldCheck, CheckCircle2, MessageSquare, ExternalLink, Users } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  avatarColor: string;
  role: string;
  product: string;
  rating: number;
  content: string;
  timeAgo: string;
  verified: boolean;
}

const REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Minh Hoàng',
    avatarColor: 'from-indigo-500 to-purple-600',
    role: 'Game Thủ Bedwars',
    product: 'Minecraft Java & Bedrock FA',
    rating: 5,
    content: 'Quét mã VietQR SePay xong chưa kịp chớp mắt là hệ thống tự động nhảy thông tin tài khoản luôn. Đổi mail với pass ngon lành, Hypixel unbanned 100%!',
    timeAgo: '14 phút trước',
    verified: true,
  },
  {
    id: '2',
    author: 'Quốc Bảo (Alex)',
    avatarColor: 'from-cyan-500 to-blue-600',
    role: 'CS2 Trader',
    product: 'Steam CS2 Prime VIP',
    rating: 5,
    content: 'Acc sạch có huy chương đẹp, hỗ trợ cấp mã Steam Guard cực kỳ nhanh. Mua bên này lần thứ 4 rồi, rất yên tâm về khoản bảo hành.',
    timeAgo: '35 phút trước',
    verified: true,
  },
  {
    id: '3',
    author: 'Thanh Hải Dev',
    avatarColor: 'from-emerald-500 to-teal-600',
    role: 'Fullstack Developer',
    product: 'Claude 3.5 Sonnet Pro',
    rating: 5,
    content: 'Dùng code qua API mượt mà không bị limit như chỗ khác. Thanh toán bằng LTC xác nhận 0-conf siêu nhanh, phí rẻ hơn chuyển khoản.',
    timeAgo: '1 giờ trước',
    verified: true,
  },
  {
    id: '4',
    author: 'Duy Anh',
    avatarColor: 'from-amber-500 to-rose-600',
    role: 'Hypixel MVP+',
    product: 'Hypixel MVP+ Account',
    rating: 5,
    content: 'Rank MVP+ vĩnh viễn đúng mô tả, level cao cày bedwars sướng. Shop uy tín số 1 Việt Nam!',
    timeAgo: '3 giờ trước',
    verified: true,
  },
  {
    id: '5',
    author: 'Linh Trần',
    avatarColor: 'from-pink-500 to-rose-600',
    role: 'Designer & Content Creator',
    product: 'ChatGPT Plus GPT-4o',
    rating: 5,
    content: 'Tài khoản cấp riêng profile dùng ổn định không bị văng phiên làm việc. Giá học sinh sinh viên nhưng chất lượng 5 sao.',
    timeAgo: '5 giờ trước',
    verified: true,
  },
  {
    id: '6',
    author: 'Tuấn Khang',
    avatarColor: 'from-purple-500 to-indigo-600',
    role: 'Movie Enthusiast',
    product: 'Netflix 4K UHD Profile',
    rating: 5,
    content: 'Xem 4K mượt mà trên TV, đúng hồ sơ riêng có mã PIN không sợ ai vào xem chung. Sẽ ủng hộ shop dài lâu.',
    timeAgo: '8 giờ trước',
    verified: true,
  },
];

export default function VouchWall() {
  return (
    <section className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>UY TÍN KIỂM CHỨNG • 15,000+ KHÁCH HÀNG</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Đánh Giá Từ <span className="bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">Cộng Đồng Game Thủ</span>
          </h2>

          <p className="text-sm text-slate-400 leading-relaxed">
            Xem những phản hồi thực tế từ các khách hàng đã giao dịch và nhận tài nguyên số tự động tại ChinStore.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="relative rounded-2xl p-6 glass-card border border-white/[0.06] hover:border-brand-primary/30 transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* User Info Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${review.avatarColor} flex items-center justify-center text-white font-bold text-sm shadow-md`}
                    >
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white">{review.author}</span>
                        {review.verified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500">{review.role}</span>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Content */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  &ldquo;{review.content}&rdquo;
                </p>
              </div>

              {/* Bottom Metadata */}
              <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between text-[11px]">
                <span className="text-indigo-400 font-mono font-medium truncate max-w-[180px]">
                  {review.product}
                </span>
                <span className="text-slate-500 font-mono shrink-0">{review.timeAgo}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Discord Community Callout */}
        <div className="relative rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-[#0E1222] via-[#141A33] to-[#0E1222] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_35px_rgba(99,102,241,0.12)]">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Gia Nhập Cộng Đồng ChinStore Discord
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Hơn 5,200+ thành viên đang hoạt động, cập nhật giveaway tài khoản và voucher mỗi tuần.
              </p>
            </div>
          </div>

          <a
            href="https://discord.gg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs sm:text-sm font-semibold transition-all shadow-lg hover:shadow-[#5865F2]/40 shrink-0"
          >
            <span>Tham Gia Discord Ngay</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}
