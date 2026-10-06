import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CHIN STORE | Nền Tảng Thương Mại Số Cyber & Gear Tương Lai',
  description:
    'Cửa hàng công nghệ Cyber Gear và tài nguyên số thế hệ mới. Tự động hóa thanh toán 24/7 qua VietQR SePay & tiền ảo Litecoin (LTC).',
  keywords: ['ChinStore', 'Cyber Gear', 'VietQR', 'SePay', 'Litecoin', 'LTC', 'Thương mại điện tử'],
  authors: [{ name: 'ChinStore Team' }],
  openGraph: {
    title: 'CHIN STORE | Next-Gen Cyber & Digital Commerce',
    description: 'Thanh toán tự động VietQR SePay & Litecoin (LTC) kích hoạt tức thì trong vài giây.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
