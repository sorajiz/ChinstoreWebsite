import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ChinStore',
  description:
    'ChinStore - Nền tảng tài nguyên số, Minecraft, Discord Nitro & dịch vụ bản quyền thế hệ mới. Giao hàng tự động.',
  keywords: ['ChinStore', 'Minecraft', 'Discord Nitro', 'VietQR', 'SePay', 'Litecoin', 'LTC'],
  authors: [{ name: 'ChinStore' }],
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: 'ChinStore',
    description: 'ChinStore - Nền tảng tài nguyên số & dịch vụ bản quyền thế hệ mới.',
    type: 'website',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
