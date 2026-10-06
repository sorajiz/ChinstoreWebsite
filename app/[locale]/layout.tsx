import React from 'react';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Toaster } from 'sonner';
import AuroraBackground from '@/components/ui/AuroraBackground';
import AuthProvider from '@/components/providers/AuthProvider';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-jakarta',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ChinStore',
  description: 'ChinStore - Nền tảng tài nguyên số & dịch vụ bản quyền thế hệ mới.',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale} className={`dark ${jakarta.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/icon.png" />
        <link rel="shortcut icon" href="/icon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <title>ChinStore</title>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('theme');
                  if (t === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  } else {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#F8F7F4] dark:bg-[#09090B] text-[#121214] dark:text-[#F4F4F5] font-sans selection:bg-brand-primary/30 selection:text-white antialiased transition-colors duration-300">
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <SmoothScrollProvider>
              <AuroraBackground>
                {children}
              </AuroraBackground>
            </SmoothScrollProvider>
            <BottomNavigation />
            <Toaster
              position="top-right"
              richColors
              theme="dark"
              toastOptions={{
                style: {
                  background: 'rgba(12, 14, 23, 0.9)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 20px rgba(99, 102, 241, 0.15)',
                  color: '#fff',
                  fontFamily: 'var(--font-jakarta)',
                  borderRadius: '1rem',
                },
              }}
            />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
