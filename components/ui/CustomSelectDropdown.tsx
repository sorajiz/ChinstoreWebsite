'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  subLabel?: string;
  icon?: React.ReactNode;
}

interface CustomSelectDropdownProps {
  id?: string;
  options: SelectOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  triggerPrefix?: React.ReactNode;
  widthClass?: string;
  title?: string;
  align?: 'left' | 'right';
  className?: string;
}

export default function CustomSelectDropdown({
  options,
  selectedValue,
  onSelect,
  triggerPrefix,
  widthClass = 'w-44',
  title,
  align = 'right',
  className = '',
}: CustomSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentOption = options.find((opt) => opt.value === selectedValue) || options[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Khi mở dropdown trên mobile, đảm bảo cuộn nhẹ để nội dung hiển thị trọn vẹn
  useEffect(() => {
    if (isOpen && containerRef.current) {
      setTimeout(() => {
        containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    }
  }, [isOpen]);

  const alignmentClass = align === 'left' ? 'left-0' : 'right-0';

  return (
    <div
      ref={containerRef}
      className={`relative select-none text-left ${className ? className : 'inline-block'}`}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 h-9 sm:h-10 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-zinc-100 dark:bg-[#16161A] border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all shadow-xs active:scale-95 cursor-pointer"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        title={title}
      >
        <div className="flex items-center gap-2 truncate">
          {triggerPrefix && <span className="text-zinc-500 dark:text-zinc-400 shrink-0">{triggerPrefix}</span>}
          <span className="font-mono font-bold tracking-tight truncate">{currentOption?.label || selectedValue}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-zinc-900 dark:text-white' : ''
          }`}
        />
      </button>

      {/* Floating Dropdown Card (Bật xuống dưới rõ ràng, không bị che trên mobile) */}
      {isOpen && (
        <div
          className={`absolute ${alignmentClass} mt-2 min-w-[175px] sm:${widthClass} z-[90] rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150`}
          role="listbox"
        >
          {/* Inner Options Container */}
          <div className="rounded-xl bg-zinc-50 dark:bg-[#18181D] border border-zinc-200 dark:border-zinc-800 p-1.5 space-y-1">
            {options.map((opt) => {
              const isSelected = opt.value === selectedValue;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onSelect(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-bold transition-all text-left active:scale-[0.98] group ${
                    isSelected
                      ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white'
                      : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  {/* Custom Checkbox */}
                  <div
                    className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#2563EB] text-white shadow-xs'
                        : 'border border-zinc-400 dark:border-zinc-600 bg-transparent group-hover:border-zinc-500'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>

                  {/* Option Label */}
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono text-zinc-900 dark:text-zinc-100 leading-tight">
                      {opt.label}
                    </span>
                    {opt.subLabel && (
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-normal truncate">
                        {opt.subLabel}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
