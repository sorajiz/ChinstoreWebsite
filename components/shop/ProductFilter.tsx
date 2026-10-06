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
    <div className="space-y-5 bg-[#0C0E17]/90 p-5 rounded-3xl border border-white/[0.08] backdrop-blur-xl shadow-2xl">
      {/* Search Bar & Primary Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-indigo-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#08090E] border border-white/[0.08] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/40 transition-all shadow-inner font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Badges & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Price Range Popover Toggle */}
          <button
            onClick={() => setIsPriceFilterOpen(!isPriceFilterOpen)}
            className={`px-3.5 py-2.5 rounded-2xl border text-xs font-medium flex items-center gap-2 transition-all ${
              maxPrice < 50000000 || isPriceFilterOpen
                ? 'bg-brand-primary/10 border-brand-primary/40 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.2)]'
                : 'bg-[#08090E] border-white/[0.08] text-slate-300 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            <span>
              {maxPrice < 50000000 ? `Dưới ${formatPrice(maxPrice, currency)}` : 'Khoảng giá'}
            </span>
          </button>

          {/* In-Stock Toggle */}
          <button
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`px-3.5 py-2.5 rounded-2xl border text-xs font-medium flex items-center gap-2 transition-all ${
              inStockOnly
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                : 'bg-[#08090E] border-white/[0.08] text-slate-300 hover:text-white'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                inStockOnly
                  ? 'border-emerald-400 bg-emerald-500/30'
                  : 'border-slate-600'
              }`}
            >
              {inStockOnly && <Check className="w-3 h-3 text-emerald-300" />}
            </div>
            <span>{t('filterInStock')}</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative flex items-center bg-[#08090E] border border-white/[0.08] rounded-2xl px-3 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400 mr-2" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="bg-transparent text-white text-xs font-medium focus:outline-none cursor-pointer py-1.5 font-sans"
            >
              <option value="popular" className="bg-[#0C0E17] text-white">
                {t('sortPopular')}
              </option>
              <option value="newest" className="bg-[#0C0E17] text-white">
                {t('sortNewest')}
              </option>
              <option value="price-asc" className="bg-[#0C0E17] text-white">
                {t('sortPriceAsc')}
              </option>
              <option value="price-desc" className="bg-[#0C0E17] text-white">
                {t('sortPriceDesc')}
              </option>
            </select>
          </div>

          {/* Reset Filters Button */}
          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-400 hover:text-white transition-all"
              title="Đặt lại bộ lọc"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Expandable Price Range Slider */}
      {isPriceFilterOpen && (
        <div className="p-4 rounded-2xl bg-[#08090E] border border-brand-primary/20 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between text-xs font-sans">
            <span className="text-slate-400 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
              <span>Giá tối đa:</span>
            </span>
            <span className="text-indigo-300 font-bold text-sm">
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
            className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>50.000₫</span>
            <span>500.000₫</span>
            <span>1.000.000₫</span>
            <span>2.000.000₫+</span>
          </div>
        </div>
      )}

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
            activeCategory === 'all'
              ? 'bg-brand-primary text-white shadow-[0_0_20px_rgba(99,102,241,0.35)]'
              : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
          }`}
        >
          {t('categoryAll')} ({totalResults})
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.slug
                ? 'bg-brand-primary text-white shadow-[0_0_20px_rgba(99,102,241,0.35)]'
                : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
