'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

interface FaqItem {
  id: string;
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    id: '1',
    q: 'Sau khi thanh toán VietQR hoặc Litecoin thì bao lâu tôi nhận được tài khoản/key?',
    a: 'Hệ thống của ChinStore hoạt động hoàn toàn tự động 24/7. Khi bạn quét mã VietQR SePay hoặc giao dịch Litecoin được phát hiện trên Mempool, hệ thống sẽ tự động gán key và hiển thị thông tin đăng nhập trực tiếp trên màn hình hóa đơn chỉ trong vòng 3 đến 5 giây, đồng thời lưu vào lịch sử đơn hàng của bạn.',
  },
  {
    id: '2',
    q: 'Chính sách bảo hành 1 đổi 1 và cam kết uy tín hoạt động ra sao?',
    a: 'Tất cả các sản phẩm bán ra đều được bảo hành theo thời hạn niêm yết (từ 24 giờ cho đến bảo hành trọn đời tuỳ loại sản phẩm). Nếu tài khoản bị sai mật khẩu, bị khóa hoặc không đúng mô tả ngay khi nhận hàng, bạn chỉ cần liên hệ qua Ticket hoặc Discord để được đổi mới 1:1 ngay lập tức.',
  },
  {
    id: '3',
    q: 'Tài khoản Minecraft (FA) và Steam có đổi được Email và Mật khẩu không?',
    a: 'Có. Đối với sản phẩm có ký hiệu "Full Access (FA)", bạn hoàn toàn có thể tự do đăng nhập vào trang chủ chính thức (Minecraft.net hoặc Steam) để đổi Email sở hữu, mật khẩu, tên nhân vật và skin theo ý muốn.',
  },
  {
    id: '4',
    q: 'Hệ thống bảo mật kho hàng AES-256-GCM bảo vệ người dùng như thế nào?',
    a: 'Toàn bộ kho dữ liệu tài khoản và key bản quyền tại ChinStore được mã hóa bằng thuật toán quân đội AES-256-GCM. Không ai (kể cả nhân viên kỹ thuật) có thể xem được nội dung tài khoản khi chưa được giải mã qua chu trình thanh toán hợp lệ của bạn.',
  },
  {
    id: '5',
    q: 'Làm thế nào để tra cứu lại đơn hàng cũ nếu tôi vô tình tắt trình duyệt?',
    a: 'Bạn chỉ cần bấm vào nút "Tra Cứu Đơn Hàng" ở thanh menu trên cùng, nhập Mã đơn hàng (VD: ORD-XXXXXX) để xem lại toàn bộ thông tin tài khoản, hướng dẫn kích hoạt và trạng thái bảo hành bất cứ lúc nào.',
  },
];

export default function FaqSection() {
  const [openId, setOpenId] = useState<string | null>('1');

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 relative z-10 border-t border-[#E5E1D8] dark:border-[#27272A]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5865F2]/10 border border-[#5865F2]/20 text-[#5865F2] text-xs font-semibold backdrop-blur-md">
            <HelpCircle className="w-3.5 h-3.5 text-[#5865F2]" />
            <span>GIẢI ĐÁP THẮC MẮC PHỔ BIẾN</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Câu Hỏi <span className="bg-gradient-to-r from-[#5865F2] via-indigo-500 to-purple-600 bg-clip-text text-transparent">Thường Gặp (FAQ)</span>
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-400">
            Mọi thông tin bạn cần biết về quy trình mua sắm, nhận tài nguyên và bảo hành tại ChinStore.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl transition-all duration-300 border ${
                  isOpen
                    ? 'bg-white dark:bg-[#18181B] border-[#5865F2]/50 shadow-md'
                    : 'bg-white/80 dark:bg-[#18181B]/80 hover:bg-white dark:hover:bg-[#18181B] border-[#E5E1D8] dark:border-[#27272A]'
                } backdrop-blur-xl overflow-hidden`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full py-5 px-6 flex items-center justify-between text-left gap-4"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                    {faq.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-[#5865F2] text-white rotate-180'
                        : 'bg-[#EFECE5] dark:bg-[#27272A] text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 border-t border-[#E5E1D8] dark:border-[#27272A] text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
