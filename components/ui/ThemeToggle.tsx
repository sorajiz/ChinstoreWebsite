'use client';

import React, { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';

export default function ThemeToggle({ id = "themeToggle" }: { id?: string }) {
  const locale = useLocale();
  const isEn = locale === 'en';
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    // Default to dark mode unless user previously chose light
    const initialDark = savedTheme ? savedTheme === 'dark' : true;
    setIsDark(initialDark);
    if (initialDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, []);

  const handleToggle = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  };

  if (!mounted) {
    return <div className="w-7 h-7" />;
  }

    const maskId = `moon-mask-${id.replace(/[^a-zA-Z0-9]/g, '_')}`;

    return (
      <label
        htmlFor={id}
        className="themeToggle st-sunMoonThemeToggleBtn text-slate-400 hover:text-slate-700 dark:hover:text-white"
        title={
          isDark
            ? (isEn ? 'Switch to Light Mode' : 'Chuyển sang Giao diện Sáng')
            : (isEn ? 'Switch to Dark Mode' : 'Chuyển sang Giao diện Tối')
        }
      >
        <input
          type="checkbox"
          id={id}
          className="themeToggleInput"
          checked={!isDark} // Checked = Sun (Light), Unchecked = Moon (Dark)
          onChange={handleToggle}
        />
        <svg
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="currentColor"
          stroke="none"
        >
          <mask id={maskId}>
            <rect x="0" y="0" width="20" height="20" fill="white"></rect>
            <circle cx="11" cy="3" r="8" fill="black"></circle>
          </mask>
          <circle
            className="sunMoon"
            cx="10"
            cy="10"
            r="8"
            mask={`url(#${maskId})`}
          ></circle>
          <g>
            <circle className="sunRay sunRay1" cx="18" cy="10" r="1.5"></circle>
            <circle className="sunRay sunRay2" cx="14" cy="16.928" r="1.5"></circle>
            <circle className="sunRay sunRay3" cx="6" cy="16.928" r="1.5"></circle>
            <circle className="sunRay sunRay4" cx="2" cy="10" r="1.5"></circle>
            <circle className="sunRay sunRay5" cx="6" cy="3.1718" r="1.5"></circle>
            <circle className="sunRay sunRay6" cx="14" cy="3.1718" r="1.5"></circle>
          </g>
        </svg>
      </label>
    );
}
