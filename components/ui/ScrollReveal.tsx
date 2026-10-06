'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}

export function ScrollReveal({ children, className = '', delayMs = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsRevealed(true);
            }, delayMs);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [delayMs]);

  return (
    <div
      ref={ref}
      style={{
        transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`${className} ${
        isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
      }`}
    >
      {children}
    </div>
  );
}

export default ScrollReveal;
