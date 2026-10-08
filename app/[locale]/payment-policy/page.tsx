'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLocale } from 'next-intl';

export default function PaymentPolicyPage() {
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
            {isEn ? 'PAYMENT REGULATIONS' : 'QUY ĐỊNH THANH TOÁN'}
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-950 dark:text-white font-sans">
            {isEn ? 'Payment Regulations' : 'Quy định thanh toán'}
          </h1>
        </div>

        {/* Callout Box matching Image 2 (Light & Dark Theme Adaptive) */}
        <div className="rounded-2xl bg-white dark:bg-[#141418] border border-zinc-200/90 dark:border-zinc-800/90 p-5 sm:p-6 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans shadow-xs dark:shadow-xl">
          {isEn
            ? 'ChinStore supports fast, automated, and secure payment methods including domestic bank VietQR via SePay and decentralized cryptocurrency Litecoin (LTC). Please read our transaction regulations carefully to ensure 3-second instant delivery.'
            : 'ChinStore hỗ trợ các phương thức thanh toán tự động, bảo mật và ẩn danh qua ngân hàng nội địa VietQR (SePay) và tiền điện tử Litecoin (LTC). Nhằm đảm bảo đơn hàng được kích hoạt ngay trong 5–30 giây, quý khách vui lòng đọc kỹ hướng dẫn dưới đây.'}
        </div>

        {/* Numbered Sections: 1. ... 2. ... 3. ... (Xuống dòng đầy đủ ý) */}
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* 1. Cổng thanh toán chuyển khoản VietQR (SePay) */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
              {isEn ? '1. Automated Domestic Banking via VietQR (SePay)' : '1. Cổng chuyển khoản ngân hàng tự động VietQR (SePay)'}
            </h2>
            <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans space-y-1.5">
              <p>
                {isEn
                  ? 'Scan the auto-generated VietQR code displayed on the checkout modal using any banking application. The transfer amount and transfer content (memo) must match the invoice exactly.'
                  : 'Quét mã VietQR tự động xuất hiện trên màn hình thanh toán bằng bất kỳ app Ngân hàng nào. Số tiền và nội dung chuyển khoản (memo) phải khớp 100% với thông tin hiển thị trên hóa đơn.'}
              </p>
              <p>
                {isEn
                  ? 'Verification speed: Under normal banking conditions, orders are automatically recognized and dispatched within 5 to 30 seconds after payment is completed.'
                  : 'Tốc độ xử lý: Thông thường, tiền sẽ được ghi nhận và đơn hàng tự động kích hoạt trong vòng 5 đến 30 giây kể từ khi ngân hàng trừ tiền thành công.'}
              </p>
            </div>
          </section>

          {/* 2. Cổng thanh toán tiền điện tử (Litecoin LTC) */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
              {isEn ? '2. Cryptocurrency Payments (Litecoin LTC)' : '2. Cổng thanh toán tiền điện tử (Litecoin LTC)'}
            </h2>
            <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans space-y-1.5">
              <p>
                {isEn
                  ? 'ChinStore accepts direct Litecoin (LTC) transfers. LTC offers microscopic transaction fees and rapid block confirmations. Ensure you transfer through the native Litecoin network to the exact wallet address on your invoice.'
                  : 'ChinStore chấp nhận thanh toán trực tiếp bằng Litecoin (LTC). Mạng LTC có ưu điểm phí mạng siêu rẻ và tốc độ xác nhận khối cực nhanh. Quý khách vui lòng chuyển đúng địa chỉ ví Litecoin và số lượng coin hiển thị trên hóa đơn.'}
              </p>
              <p>
                {isEn
                  ? 'Orders are credited as soon as transaction broadcasts are detected on the network.'
                  : 'Hệ thống tự động kích hoạt ngay khi giao dịch được phát lên mạng lưới blockchain.'}
              </p>
            </div>
          </section>

          {/* 3. Xử lý sự cố sai nội dung chuyển khoản */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
              {isEn ? '3. Incorrect Transfer Memo & Manual Reconciliation' : '3. Xử lý sự cố sai nội dung chuyển khoản'}
            </h2>
            <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans space-y-1.5">
              <p>
                {isEn
                  ? 'If you transfer with an incorrect memo, underpay, or overpay, automated detection is temporarily placed on hold for security.'
                  : 'Trường hợp chuyển sai nội dung chuyển khoản, chuyển thiếu tiền hoặc quên ghi mã đơn: Hệ thống sẽ tạm giữ giao dịch để đối soát an toàn.'}
              </p>
              <p>
                {isEn
                  ? 'Resolution: Open a ticket on the ChinStore Discord server, provide your bank transfer receipt screenshot, and support staff will verify and manually approve your order within 5 to 15 minutes.'
                  : 'Cách giải quyết: Bạn chỉ cần mở Ticket trên Discord của ChinStore, gửi ảnh chụp biên lai ngân hàng có mã giao dịch. Kỹ thuật viên sẽ kiểm tra và cộng tiền/giao hàng thủ công cho bạn trong vòng 5–15 phút.'}
              </p>
            </div>
          </section>

          {/* 4. Quy định về số dư ví & Hạn mức thanh toán */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
              {isEn ? '4. Wallet Balance & Checkout Policies' : '4. Quy định về số dư ví & Hạn mức thanh toán'}
            </h2>
            <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans space-y-1.5">
              <p>
                {isEn
                  ? 'Funds deposited into your ChinStore wallet can be used immediately across all store items. ChinStore does not facilitate cash withdrawals from website wallet balances to external banks unless an insurmountable delivery failure occurs.'
                  : 'Tiền đã nạp vào ví tài khoản ChinStore có thể dùng để thanh toán mọi mặt hàng trên web. ChinStore không hỗ trợ rút tiền mặt từ ví website về lại tài khoản ngân hàng trừ trường hợp đơn hàng gặp sự cố kỹ thuật không thể khắc phục.'}
              </p>
            </div>
          </section>

          {/* 5. Bảo mật giao dịch & Mã hóa chuẩn SSL AES-256 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
              {isEn ? '5. Payment Security & Encryption Standards' : '5. Bảo mật giao dịch & Mã hóa thanh toán'}
            </h2>
            <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans space-y-1.5">
              <p>
                {isEn
                  ? 'All transaction flows are protected with TLS 1.3 / SSL 256-bit encryption. ChinStore does not collect or store credit card credentials, bank account passwords, or personal banking data.'
                  : 'Toàn bộ luồng giao dịch được bảo vệ bằng tiêu chuẩn mã hóa SSL 256-bit. ChinStore tuyệt đối không lưu trữ thông tin thẻ, mật khẩu ngân hàng hay dữ liệu thanh toán nhạy cảm của khách hàng.'}
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
