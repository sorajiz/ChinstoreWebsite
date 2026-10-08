'use client';

import React from 'react';

export default function ProductCardSkeleton() {
  return (
    <div className="relative rounded-2xl bg-white dark:bg-[#131316] overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 p-0 flex flex-col justify-between h-[360px] shadow-xs">
      {/* Shimmer overlay beam */}
      <div className="absolute inset-0 shimmer-effect pointer-events-none z-10" />

      {/* Image Skeleton */}
      <div className="relative w-full aspect-square bg-zinc-100 dark:bg-[#18181c]" />

      {/* Content Skeleton */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <div className="w-16 h-3 rounded bg-zinc-200/80 dark:bg-zinc-800" />
          <div className="w-4/5 h-4 rounded bg-zinc-200/90 dark:bg-zinc-700" />
        </div>

        {/* Price & Buttons Skeleton */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/60 space-y-2.5">
          <div className="w-24 h-4 rounded bg-zinc-200/80 dark:bg-zinc-800" />
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700" />
            <div className="h-8 rounded-xl bg-zinc-200 dark:bg-zinc-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
