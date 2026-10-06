'use client';

import React from 'react';

export default function ProductCardSkeleton() {
  return (
    <div className="relative rounded-3xl glass-card overflow-hidden border border-white/10 p-0 flex flex-col justify-between h-[420px]">
      {/* Shimmer overlay beam */}
      <div className="absolute inset-0 shimmer-effect pointer-events-none z-10" />

      {/* Image Skeleton */}
      <div className="relative w-full aspect-[4/3] bg-white/[0.04]">
        <div className="absolute top-3 left-3 w-20 h-5 rounded-lg bg-white/10" />
        <div className="absolute top-3 right-3 w-16 h-5 rounded-lg bg-white/10" />
      </div>

      {/* Content Skeleton */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between">
            <div className="w-24 h-3.5 rounded bg-white/10" />
            <div className="w-16 h-3.5 rounded bg-white/10" />
          </div>
          <div className="w-4/5 h-5 rounded bg-white/15" />
          <div className="space-y-1.5 pt-1">
            <div className="w-full h-3 rounded bg-white/5" />
            <div className="w-2/3 h-3 rounded bg-white/5" />
          </div>
        </div>

        {/* Price & Buttons Skeleton */}
        <div className="pt-3 border-t border-white/[0.06] space-y-3">
          <div className="w-32 h-6 rounded bg-white/15" />
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="h-9 rounded-xl bg-white/10" />
            <div className="h-9 rounded-xl bg-white/15" />
          </div>
        </div>
      </div>
    </div>
  );
}
