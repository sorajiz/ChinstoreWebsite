'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FaqSection() {
  const t = useTranslations('faq');
  const [openId, setOpenId] = useState<string | null>('1');

  const faqs = [
    { id: '1', q: t('q1'), a: t('a1') },
    { id: '2', q: t('q2'), a: t('a2') },
    { id: '3', q: t('q3'), a: t('a3') },
    { id: '4', q: t('q4'), a: t('a4') },
    { id: '5', q: t('q5'), a: t('a5') },
  ];

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 relative z-10 border-t border-zinc-200 dark:border-zinc-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-200/80 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700/80 text-zinc-800 dark:text-zinc-200 text-xs font-semibold backdrop-blur-md">
            <HelpCircle className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span>{t('badge')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-white tracking-tight">
            {t('title')}<span className="text-zinc-600 dark:text-zinc-400 font-extrabold">{t('titleHighlight')}</span>
          </h2>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-zinc-900 dark:text-white' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/60 mt-1">
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
