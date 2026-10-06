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
}

export default function CustomSelectDropdown({
  options,
  selectedValue,
  onSelect,
  triggerPrefix,
  widthClass = 'w-44',
  title,
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

  return (
    <div ref={containerRef} className="relative inline-block text-left select-none">
      {/* Trigger Button (Sleek Dark Pill matching Image 3) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-[#EFECE5] dark:bg-[#18181C] border border-[#DDD8CE] dark:border-[#27272D] text-slate-800 dark:text-slate-200 hover:border-[#5865F2]/50 hover:bg-black/5 dark:hover:bg-white/5 transition-all shadow-xs"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        title={title}
      >
        {triggerPrefix && <span className="text-slate-500 dark:text-slate-400">{triggerPrefix}</span>}
        <span className="font-mono font-bold tracking-tight">{currentOption?.label || selectedValue}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#5865F2]' : ''
          }`}
        />
      </button>

      {/* Floating Dropdown Card (Matches Image 3 Visual Design) */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 ${widthClass} z-50 rounded-2xl bg-white dark:bg-[#151518] border border-[#DDD8CE] dark:border-[#282830] p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150`}
          role="listbox"
        >
          {/* Inner Options Container */}
          <div className="rounded-xl bg-[#F6F4EE]/60 dark:bg-[#1C1C22]/80 border border-[#E5E1D8] dark:border-[#2E2E38] p-1.5 space-y-1">
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
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-bold transition-all text-left group ${
                    isSelected
                      ? 'bg-black/5 dark:bg-white/10 text-slate-900 dark:text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  {/* Custom Checkbox (Matching Image 3: Blue square with checkmark) */}
                  <div
                    className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#2563EB] text-white shadow-xs'
                        : 'border border-slate-400 dark:border-slate-600 bg-transparent group-hover:border-slate-500'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>

                  {/* Option Label */}
                  <div className="flex flex-col flex-1 truncate">
                    <span className="truncate">{opt.label}</span>
                    {opt.subLabel && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal truncate">
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
