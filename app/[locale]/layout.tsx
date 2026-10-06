import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Toaster } from 'sonner';
import AuroraBackground from '@/components/ui/AuroraBackground';
import AuthProvider from '@/components/providers/AuthProvider';
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

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale} className={`dark ${jakarta.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-[#08090E] text-slate-200 font-sans selection:bg-brand-primary/30 selection:text-white antialiased">
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <AuroraBackground>
              {children}
            </AuroraBackground>
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
