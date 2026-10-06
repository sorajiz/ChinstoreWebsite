'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Minus } from 'lucide-react';

export default function FaqSection() {
  const t = useTranslations('faq');
  const [openId, setOpenId] = useState<string | null>('1');

  const steps = [
    {
      num: 1,
      title: t('step1_title'),
      desc: t('step1_desc'),
    },
    {
      num: 2,
      title: t('step2_title'),
      desc: t('step2_desc'),
    },
    {
      num: 3,
      title: t('step3_title'),
      desc: t('step3_desc'),
    },
  ];

  const faqs = [
    { id: '1', q: t('q1'), a: t('a1') },
    { id: '2', q: t('q2'), a: t('a2') },
    { id: '3', q: t('q3'), a: t('a3') },
    { id: '4', q: t('q4'), a: t('a4') },
  ];

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 relative z-10 border-t border-zinc-200 dark:border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
        
        {/* Onboarding 3 Steps matching Image 4 */}
        <div className="space-y-8">
          <h2 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-[#F4F4F5] tracking-tight font-sans">
            {t('onboardingTitle')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {steps.map((step) => (
              <div key={step.num} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-mono font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                  {step.num}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-zinc-950 dark:text-[#F4F4F5]">
                    {step.title}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-[#94949E] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section 2 Columns matching Image 4 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 pt-8 border-t border-zinc-200 dark:border-zinc-800/80">
          
          {/* Left Column: Heading Info */}
          <div className="lg:col-span-5 space-y-3 text-left">
            <span className="text-xs font-mono font-bold tracking-wider text-zinc-500 uppercase">
              {t('faqCategory')}
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-[#F4F4F5] tracking-tight font-sans">
              {t('faqTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-[#94949E] leading-relaxed pt-2">
              {t('faqSubtitle')}
            </p>
          </div>

          {/* Right Column: Clean Accordion */}
          <div className="lg:col-span-7 divide-y divide-zinc-200 dark:divide-zinc-800/80">
            {faqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div key={faq.id} className="py-4 sm:py-5">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-zinc-900 dark:text-[#F4F4F5] hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="text-zinc-400 shrink-0">
                      {isOpen ? <Minus className="w-4 h-4 stroke-[2]" /> : <Plus className="w-4 h-4 stroke-[2]" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="pt-3 text-xs sm:text-sm text-zinc-600 dark:text-[#94949E] leading-relaxed pr-6">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
