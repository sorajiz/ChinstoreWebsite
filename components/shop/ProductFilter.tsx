'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useStore } from '@/lib/store';
import { Search, SlidersHorizontal, X, ArrowUpDown, Check, RotateCcw, DollarSign } from 'lucide-react';
import { Category } from '@/types';
import { formatPrice } from '@/lib/utils';

interface ProductFilterProps {
  categories: Category[];
  totalResults: number;
}

export default function ProductFilter({ categories, totalResults }: ProductFilterProps) {
  const t = useTranslations('shop');
  const {
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    sortOption,
    setSortOption,
    inStockOnly,
    setInStockOnly,
    maxPrice,
    setMaxPrice,
    currency,
  } = useStore();

  const [isPriceFilterOpen, setIsPriceFilterOpen] = useState(false);

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setSortOption('popular');
    setInStockOnly(false);
    setMaxPrice(50000000);
  };

  const isFiltered =
    searchQuery.trim() !== '' ||
    activeCategory !== 'all' ||
    inStockOnly ||
    maxPrice < 50000000;

  return (
    <div className="space-y-4 bg-white dark:bg-[#18181B] p-5 rounded-3xl border border-[#E5E1D8] dark:border-[#27272A] shadow-sm">
      {/* Category Pills Bar & Primary Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-1">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
              activeCategory === 'all'
                ? 'bg-[#18181B] text-white dark:bg-white dark:text-[#18181B]'
                : 'bg-white dark:bg-[#18181B] text-slate-600 dark:text-slate-400 border border-[#E5E1D8] dark:border-[#27272A] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t('categoryAll')} ({totalResults})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                activeCategory === cat.slug
                  ? 'bg-[#18181B] text-white dark:bg-white dark:text-[#18181B]'
                  : 'bg-white dark:bg-[#18181B] text-slate-600 dark:text-slate-400 border border-[#E5E1D8] dark:border-[#27272A] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Filter Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Price Range Popover Toggle */}
          <button
            onClick={() => setIsPriceFilterOpen(!isPriceFilterOpen)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all ${
              maxPrice < 50000000 || isPriceFilterOpen
                ? 'bg-[#5865F2]/10 border-[#5865F2]/40 text-[#5865F2]'
                : 'bg-[#EFECE5]/60 dark:bg-[#202024] border-[#E5E1D8] dark:border-[#27272A] text-slate-700 dark:text-slate-300'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#5865F2]" />
            <span>
              {maxPrice < 50000000 ? `Dưới ${formatPrice(maxPrice, currency)}` : 'Khoảng giá'}
            </span>
          </button>

          {/* In-Stock Toggle */}
          <button
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all ${
              inStockOnly
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-[#EFECE5]/60 dark:bg-[#202024] border-[#E5E1D8] dark:border-[#27272A] text-slate-700 dark:text-slate-300'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                inStockOnly
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : 'border-slate-400 dark:border-slate-600'
              }`}
            >
              {inStockOnly && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span>{t('filterInStock')}</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative flex items-center bg-[#EFECE5]/60 dark:bg-[#202024] border border-[#E5E1D8] dark:border-[#27272A] rounded-xl px-3 py-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#5865F2] mr-2" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="bg-transparent text-slate-800 dark:text-white text-xs font-medium focus:outline-none cursor-pointer py-1 font-sans"
            >
              <option value="popular" className="bg-white dark:bg-[#18181B] text-slate-900 dark:text-white">
                {t('sortPopular')}
              </option>
              <option value="newest" className="bg-white dark:bg-[#18181B] text-slate-900 dark:text-white">
                {t('sortNewest')}
              </option>
              <option value="price-asc" className="bg-white dark:bg-[#18181B] text-slate-900 dark:text-white">
                {t('sortPriceAsc')}
              </option>
              <option value="price-desc" className="bg-white dark:bg-[#18181B] text-slate-900 dark:text-white">
                {t('sortPriceDesc')}
              </option>
            </select>
          </div>

          {/* Reset Filters Button */}
          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="p-2 rounded-xl bg-[#EFECE5] dark:bg-[#202024] border border-[#E5E1D8] dark:border-[#27272A] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
              title="Đặt lại bộ lọc"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Expandable Price Range Slider */}
      {isPriceFilterOpen && (
        <div className="p-4 rounded-2xl bg-[#EFECE5]/50 dark:bg-[#202024] border border-[#E5E1D8] dark:border-[#27272A] space-y-3 animate-fade-in">
          <div className="flex items-center justify-between text-xs font-sans">
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-[#5865F2]" />
              <span>Giá tối đa:</span>
            </span>
            <span className="text-[#5865F2] font-bold text-sm">
              {maxPrice >= 50000000 ? 'Không giới hạn' : formatPrice(maxPrice, currency)}
            </span>
          </div>
          <input
            type="range"
            min={50000}
            max={2000000}
            step={50000}
            value={maxPrice > 2000000 ? 2000000 : maxPrice}
            onChange={(e) => {
              const val = Number(e.target.value);
              setMaxPrice(val >= 2000000 ? 50000000 : val);
            }}
            className="w-full accent-[#5865F2] cursor-pointer h-1.5 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>50.000₫</span>
            <span>500.000₫</span>
            <span>1.000.000₫</span>
            <span>2.000.000₫+</span>
          </div>
        </div>
      )}
    </div>
  );
}
