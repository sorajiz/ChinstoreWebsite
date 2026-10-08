'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLocale } from 'next-intl';

export default function RefundPolicyPage() {
  const locale = useLocale();
  const isEn = locale === 'en';

  return (
    <div className="min-h-screen bg-[#F7F5F0] dark:bg-[#09090b] text-zinc-900 dark:text-white flex flex-col font-sans transition-colors duration-200">
      {/* Header */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 w-full">
        
        {/* Top Header Block matching Image 2 */}
        <div className="space-y-3">
          <p className="text-xs font-mono font-bold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
            {isEn ? 'REFUND & WARRANTY POLICY' : 'CHÍNH SÁCH HOÀN TIỀN & BẢO HÀNH'}
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-950 dark:text-white font-sans">
            {isEn ? 'Refund & Warranty Policy' : 'Chính sách hoàn tiền & Bảo hành'}
          </h1>
        </div>

        {/* Callout Box matching Image 2 (Light & Dark Theme Adaptive) */}
        <div className="rounded-2xl bg-white dark:bg-[#141418] border border-zinc-200/90 dark:border-zinc-800/90 p-5 sm:p-6 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans shadow-xs dark:shadow-xl">
          {isEn
            ? 'ChinStore implements a clear and transparent warranty and refund policy. Please review our exact criteria for replacements, full refunds, partial refunds, and non-refundable circumstances below.'
            : 'Chính sách hoàn tiền và bảo hành tại ChinStore được công khai minh bạch. Quý khách vui lòng nắm rõ các điều kiện về bảo hành 1 đổi 1, các trường hợp được hoàn tiền và các tình huống từ chối bảo hành dưới đây.'}
        </div>

        {/* Numbered Sections: 1. ... 2. ... 3. ... (Xuống dòng đầy đủ ý) */}
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* 1. Chứng từ bắt buộc khi yêu cầu Hoàn tiền / Bảo hành */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
              {isEn ? '1. Mandatory Documentation for Claims' : '1. Chứng từ bắt buộc khi yêu cầu Hoàn tiền / Bảo hành'}
            </h2>
            <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans space-y-1.5">
              <p>
                {isEn
                  ? 'All refund and warranty requests strictly require providing full proof: transaction history, bot confirmation DMs, and ticket history. Requests lacking these will not be processed.'
                  : 'Yêu cầu hoàn tiền hoặc bảo hành bắt buộc phải có đầy đủ: Lịch sử giao dịch (biên lai thanh toán), tin nhắn (DMs) bot xác nhận, và lịch sử ticket hỗ trợ trên Discord.'}
              </p>
            </div>
          </section>

          {/* 2. Không hoàn tiền trong các tình huống */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
              {isEn ? '2. Non-Refundable Circumstances' : '2. Các tình huống không hoàn tiền'}
            </h2>
            <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans space-y-1.5">
              <p>
                {isEn
                  ? 'ChinStore does not issue refunds under the following conditions:'
                  : 'ChinStore không hoàn tiền trong các tình huống sau:'}
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>{isEn ? 'Customer violates warranty guidelines.' : 'Khách hàng làm sai quy định bảo hành.'}</li>
                <li>{isEn ? 'Third-party platform unilaterally alters policies (Microsoft, Discord, Mojang, Netflix...).' : 'Nền tảng bên thứ ba đơn phương đổi chính sách (Microsoft, Discord, Netflix...).'}</li>
                <li>{isEn ? 'Error originated from the buyer side (incorrect credential changes, virus, shared access).' : 'Lỗi phát sinh do bên người mua (tự ý đổi thông tin sai cách, share tài khoản, nhiễm mã độc).'}</li>
              </ul>
            </div>
          </section>

          {/* 3. Hoàn tiền 100% trong các tình huống */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
              {isEn ? '3. 100% Full Refund Conditions' : '3. Các tình huống được hoàn tiền 100%'}
            </h2>
            <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans space-y-1.5">
              <p>
                {isEn
                  ? 'Customers are entitled to a full 100% refund in the following cases:'
                  : 'Khách hàng được hoàn tiền 100% trong các tình huống sau:'}
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>{isEn ? 'You do not want to wait or change your mind to purchase a different item before dispatch.' : 'Bạn không muốn chờ đợi hoặc đổi ý mua mặt hàng khác trước khi hàng được giao.'}</li>
                <li>{isEn ? 'Defective item or incorrect delivery and the store has no replacement stock.' : 'Hàng bị lỗi hoặc sai sản phẩm mà shop không có hàng thay thế.'}</li>
                <li>{isEn ? 'Order delivery exceeds 48 hours without prior mutual agreement.' : 'Đơn hàng quá 48 giờ chưa hoàn thành mà không có thỏa thuận trước.'}</li>
              </ul>
            </div>
          </section>

          {/* 4. Hoàn tiền 40% */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
              {isEn ? '4. 40% Partial Refund Conditions' : '4. Tình huống hoàn tiền 40%'}
            </h2>
            <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans space-y-1.5">
              <p>
                {isEn
                  ? 'A 40% partial refund applies when a cancellation request is made after only 24 hours have elapsed since ordering, while the order is in the preparation queue.'
                  : 'Hoàn tiền 40% khi khách hàng yêu cầu hủy đơn khi mới chỉ trôi qua 24 giờ kể từ thời điểm đặt hàng trong lúc đơn đang được chuẩn bị.'}
              </p>
            </div>
          </section>

          {/* 5. Bảo hành theo các mặt hàng có bảo hành */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
              {isEn ? '5. Item-Specific Warranty Coverage' : '5. Quy định bảo hành theo từng mặt hàng'}
            </h2>
            <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans space-y-1.5">
              <p>
                {isEn
                  ? 'Warranty is strictly executed according to the documented warranty commitment of each specific item. Accounts with technical defects will be replaced 1-to-1 within the active warranty window.'
                  : 'Bảo hành 1 đổi 1 theo đúng thời gian cam kết của các mặt hàng có bảo hành. Mua hàng đồng nghĩa với việc bạn đã đọc và chấp nhận các điều kiện bảo hành được niêm yết.'}
              </p>
            </div>
          </section>

          {/* 6. Quy định Legit sau khi mua hàng */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
              {isEn ? '6. Mandatory Legit / Vouch Requirement' : '6. Quy định bắt buộc Legit / Vouch sau khi mua hàng'}
            </h2>
            <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans space-y-1.5">
              <p>
                {isEn
                  ? 'No warranty will be provided if the buyer has not left a Legit review after purchasing and receiving the item. After delivery, the shop will remind you to leave a Legit review up to 5 times; if you refuse to cooperate, the shop will close the ticket and permanently void warranty for that item.'
                  : 'Không bảo hành nếu chưa Legit (đánh giá uy tín) sau khi mua hàng và nhận tài khoản thành công. Sau khi mua, shop sẽ nhắc legit lại tối đa 5 lần; nếu không chịu hợp tác, shop sẽ đóng ticket và không bảo hành vĩnh viễn cho mặt hàng đã mua.'}
              </p>
            </div>
          </section>

          {/* 7. Hủy bảo hành khi Out Server Discord */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
              {isEn ? '7. Voiding Warranty by Leaving Discord Server' : '7. Hủy quyền bảo hành khi Out Server Discord'}
            </h2>
            <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans space-y-1.5">
              <p>
                {isEn
                  ? 'Warranty is immediately voided if the buyer leaves the ChinStore Discord server and rejoins during the warranty period.'
                  : 'Không bảo hành khi khách hàng tự ý Out Server Discord Và Join Vào Lại Server trong thời gian bảo hành.'}
              </p>
            </div>
          </section>

        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
