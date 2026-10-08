'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLocale } from 'next-intl';

export default function TermsPage() {
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
            {isEn ? 'TERMS OF SERVICE' : 'ĐIỀU KHOẢN DỊCH VỤ'}
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-950 dark:text-white font-sans">
            {isEn ? 'Terms of Service' : 'Điều khoản dịch vụ'}
          </h1>
        </div>

        {/* Callout Box matching Image 2 (Light & Dark Theme Adaptive) */}
        <div className="rounded-2xl bg-white dark:bg-[#141418] border border-zinc-200/90 dark:border-zinc-800/90 p-5 sm:p-6 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans shadow-xs dark:shadow-xl">
          {isEn
            ? 'Welcome to ChinStore — next-generation digital commerce platform integrated with Discord. Please read the terms below carefully before using our services. These terms apply to all users, including customers, technical partners, and staff.'
            : 'Chào mừng đến với ChinStore — nền tảng thương mại điện tử tích hợp Discord. Vui lòng đọc kỹ các điều khoản dưới đây trước khi sử dụng dịch vụ. Điều khoản này áp dụng cho tất cả người dùng, bao gồm khách hàng, đối tác kỹ thuật và nhân sự.'}
        </div>

        {/* Numbered Sections: 1. ... 2. ... 3. ... (Xuống dòng đầy đủ ý) */}
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* 1. Chấp nhận điều khoản */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
              {isEn ? '1. Acceptance of Terms' : '1. Chấp nhận điều khoản'}
            </h2>
            <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans space-y-1.5">
              <p>
                {isEn
                  ? 'If you have purchased items from ChinStore, you have accepted these Terms of Service. Purchasing means you are strictly required to read and agree to all terms prior to purchasing. ChinStore is not responsible if customers do not read the TOS before buying.'
                  : 'Nếu bạn đã mua hàng thì bạn đã chấp nhận TOS này. Mua hàng thì phải đọc TOS trước khi mua; ChinStore không chịu trách nhiệm nếu khách hàng không đọc TOS trước khi mua.'}
              </p>
            </div>
          </section>

          {/* 2. 1 Tiếng kiểm tra hàng & Trách nhiệm đổi thông tin */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
              {isEn ? '2. 1-Hour Inspection Window & Credential Responsibility' : '2. Thời gian kiểm tra tài khoản & Đổi thông tin'}
            </h2>
            <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans space-y-1.5">
              <p>
                {isEn
                  ? 'You have exactly 1 hour to inspect your delivered account. In the event that you have changed account details and it gets pulled back after a while, we take no responsibility. Change credentials immediately when the shop sends the account; if more than 1 hour passes without logging in and credentials are lost, the buyer assumes full responsibility, and the shop will not care or provide warranty.'
                  : 'Bạn có đúng 1 tiếng để kiểm tra hàng. Trong trường hợp bạn đã đổi thông tin account mà một thời gian sau bị back chúng tôi không chịu trách nhiệm. Đổi thông tin liền khi shop đưa account; nếu quá 1 tiếng chưa log thì mất account ráng chịu, shop không quan tâm và không bảo hành.'}
              </p>
            </div>
          </section>

          {/* 3. Bắt buộc Vouch khi log thành công */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
              {isEn ? '3. Mandatory Vouching upon Successful Login' : '3. Bắt buộc Vouch khi đăng nhập thành công'}
            </h2>
            <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans space-y-1.5">
              <p>
                {isEn
                  ? 'Once you have successfully logged into the account, leaving a Vouch in our Discord vouch channel is mandatory. If you do not vouch within the following 1 hour = Forfeiture of all future support and voiding of account warranty.'
                  : 'Nếu đã log hoàn toàn vào được thì bắt buộc phải Vouch. Nếu không vouch trong 1 tiếng tới = Không hỗ trợ và không bảo hành tài khoản.'}
              </p>
            </div>
          </section>

          {/* 4. Tài khoản dính Family hay GamePass */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
              {isEn ? '4. Family or GamePass Account Handling' : '4. Tài khoản dính Family hoặc GamePass'}
            </h2>
            <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans space-y-1.5">
              <p>
                {isEn
                  ? 'When you receive an account that happens to be restricted with Family or GamePass: Please provide video/screenshots/account details so the store can support, replace, or refund your money. Specifically, GamePass issues are supported for up to 7 days.'
                  : 'Khi đã nhận được account mà trúng account Family hay GamePass,... Hãy đưa video / hình ảnh / đưa lại thông tin account để Store có thể tiến hành hỗ trợ và support refund lại tiền nhé. Riêng trường hợp bị dính GamePass sẽ được hỗ trợ trong 7 ngày.'}
              </p>
            </div>
          </section>

          {/* 5. Xử lý khi bị Lock Account */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
              {isEn ? '5. Account Lock Policy & Microsoft Sweeps' : '5. Xử lý khi bị Lock Account'}
            </h2>
            <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans space-y-1.5">
              <p>
                {isEn
                  ? 'If the newly delivered account gets locked while you are changing information, submit it immediately to the store for joint resolution. As for receiving the full account and it getting locked after a period of time due to Microsoft automated sweeps for unusual activity: We strictly offer a 1-hour warranty only.'
                  : 'Nếu account vừa đưa mà bị lock ngay lúc đang đổi thông tin thì hãy đưa cho Store giải quyết cùng nhé. Còn về việc bạn đã nhận account đầy đủ mà nếu trong một thời gian bị lock là do Microsoft quét hàng loạt khi có hành vi bất thường: Chúng tôi CHỈ BẢO HÀNH 1 GIỜ.'}
              </p>
            </div>
          </section>

          {/* 6. Hỗ trợ Server Ban DonutSMP & Kiểm tra All Game */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
              {isEn ? '6. Server Ban DonutSMP & All Game Inspection' : '6. Hỗ trợ Server Ban DonutSMP & Kiểm tra All Game'}
            </h2>
            <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans space-y-1.5">
              <p>
                {isEn
                  ? 'We support DonutSMP server bans. For freshly delivered accounts, please check all account details thoroughly: check all games, family restrictions, Cosmic Games, etc. If anything goes wrong, open a Ticket to exchange and request warranty. You only have 3 hours to report this issue; exceeding this window will void support and warranty.'
                  : 'Chúng tôi hỗ trợ server ban DonutSMP. Chỉ hỗ trợ account mới giao: Hãy check kĩ thông tin account, check all game, family, các Cosmic Game,... Khi trục trặc hay bị gì hãy mở Ticket để đổi và bảo hành, chỉ có 3 giờ để báo cáo về vụ việc này, quá giờ sẽ không hỗ trợ và không bảo hành.'}
              </p>
            </div>
          </section>

          {/* 7. Quy định mã Redeem Cape */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
              {isEn ? '7. Cape Redeem Code Policy (10-Minute Limit)' : '7. Quy định mã Redeem Cape'}
            </h2>
            <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans space-y-1.5">
              <p>
                {isEn
                  ? 'If you have received a Cape redeem code and leave it unredeemed into your account for more than 10 minutes, and the code later errors out, the shop will not support or assume responsibility. We only support within 1 hour upon success and require a Vouch; failure to vouch results in forfeiture of support as stated above.'
                  : 'Nếu đã nhận được code redeem Cape mà để đó không redeem vào account trong vòng 10 phút dẫn đến redeem bị lỗi hay gì thì shop không hỗ trợ chịu trách nhiệm. Chỉ hỗ trợ 1 giờ khi thành công và bắt buộc Vouch; nếu không vouch thì sẽ bị mất quyền hỗ trợ như ở trên.'}
              </p>
            </div>
          </section>

          {/* 8. Đơn hàng Nitro & Deco */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
              {isEn ? '8. Discord Nitro & Avatar Decos Delivery' : '8. Đơn hàng Discord Nitro & Deco'}
            </h2>
            <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans space-y-1.5">
              <p>
                {isEn
                  ? 'Orders for Nitro and Decos will be completed within 48 hours. Please refrain from spam pinging or rushing staff, because once completed, staff will ping you immediately. Refund or warranty requests strictly require providing full proof: transaction history, bot confirmation DMs, and ticket history.'
                  : 'Các đơn hàng Nitro và Deco sẽ hoàn thành trong vòng tối đa 48 giờ. Hạn chế spam ping và hối thúc nhân viên vì ngay khi đơn hàng hoàn tất kỹ thuật viên sẽ ping thông báo cho bạn ngay lập tức. Yêu cầu hoàn tiền hoặc bảo hành bắt buộc phải có đầy đủ chứng từ: lịch sử giao dịch, DMs bot xác nhận và lịch sử ticket.'}
              </p>
            </div>
          </section>

          {/* 9. Quyền thay đổi điều khoản */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
              {isEn ? '9. Amendments & Immediate Enforcement' : '9. Quyền thay đổi TOS & Hiệu lực tức thì'}
            </h2>
            <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans space-y-1.5">
              <p>
                {isEn
                  ? 'CHINSTORE RESERVES THE RIGHT TO AMEND THIS TOS AT ANY TIME WITHOUT PRIOR NOTICE. WHEN A NEW TOS IS RELEASED, IT WILL BE APPLIED IMMEDIATELY TO ALL TRANSACTIONS.'
                  : 'CHÚNG TÔI CÓ QUYỀN THAY ĐỔI TOS BẤT KÌ LÚC NÀO MÀ KHÔNG CẦN THÔNG BÁO TRƯỚC | KHI TOS MỚI RA THÌ SẼ ĐƯỢC ÁP DỤNG NGAY LẬP TỨC CHO TOÀN BỘ CÁC GIAO DỊCH.'}
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
