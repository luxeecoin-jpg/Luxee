"use client";

import React from 'react';

// Reusable shimmer block
const Shimmer = ({ className = '' }: { className?: string }) => (
  <div className={`skeleton-shimmer rounded-xl ${className}`} />
);

// ─── Hero Skeleton ───────────────────────────────────────────────────
export const HeroSkeleton = () => (
  <section className="relative w-full overflow-hidden bg-white mt-[72px] md:mt-[105px]">
    {/* Desktop */}
    <div className="hidden md:block w-full h-[65vh] xl:h-[75vh] max-h-[650px] skeleton-shimmer" />
    {/* Mobile */}
    <div className="block md:hidden w-full h-[60vh] max-h-[500px] skeleton-shimmer" />
    {/* Fake dots */}
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
      {[0, 1, 2].map(i => (
        <div key={i} className={`rounded-full bg-white/30 ${i === 0 ? 'w-6 h-2' : 'w-2 h-2'}`} />
      ))}
    </div>
  </section>
);

// ─── Product Card Skeleton ───────────────────────────────────────────
export const ProductCardSkeleton = () => (
  <div className="bg-white p-3 md:p-4 rounded-2xl border border-black/[0.04] flex flex-col h-full">
    {/* Image area */}
    <div className="relative aspect-[4/5] max-h-[300px] md:max-h-[380px] overflow-hidden rounded-xl mb-3">
      <Shimmer className="w-full h-full !rounded-xl" />
    </div>
    {/* Info */}
    <div className="mt-auto space-y-2.5">
      <div>
        <Shimmer className="h-2.5 w-12 mb-2" />
        <Shimmer className="h-4 w-3/4" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <Shimmer className="h-4 w-12" />
          <Shimmer className="h-3 w-10" />
        </div>
        <Shimmer className="w-8 h-8 !rounded-lg" />
      </div>
    </div>
  </div>
);

// ─── Bestsellers Section Skeleton ────────────────────────────────────
export const BestsellersSkeleton = () => (
  <section className="w-full py-6 md:py-10 bg-white">
    <div className="container mx-auto px-4 md:px-12">
      {/* Header */}
      <div className="text-center mb-3">
        <Shimmer className="h-2.5 w-24 mx-auto mb-3" />
        <Shimmer className="h-8 md:h-10 w-56 md:w-72 mx-auto" />
        <div className="mt-4 h-[2px] w-16 bg-black/5 rounded-full mx-auto" />
      </div>

      {/* Main Tabs */}
      <div className="flex items-center justify-center gap-6 mb-1">
        <Shimmer className="h-4 w-24" />
        <Shimmer className="h-4 w-24" />
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center justify-center gap-8 md:gap-12 mb-3">
        <Shimmer className="h-3 w-10" />
        <Shimmer className="h-3 w-10" />
        <Shimmer className="h-3 w-14" />
      </div>

      {/* Product Cards */}
      <div className="flex overflow-hidden gap-4 md:gap-6 pb-4">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="min-w-[calc(50%-8px)] md:min-w-[calc(33.333%-16px)] lg:min-w-[calc(25%-18px)] shrink-0">
            <ProductCardSkeleton />
          </div>
        ))}
      </div>

      {/* View All */}
      <div className="text-center mt-4">
        <Shimmer className="h-3 w-32 mx-auto" />
      </div>
    </div>
  </section>
);

// ─── Brand Story Skeleton ────────────────────────────────────────────
export const BrandStorySkeleton = () => (
  <section className="w-full py-16 md:py-24 bg-white">
    <div className="container mx-auto px-4 md:px-12">
      <div className="text-center mb-14">
        <Shimmer className="h-2.5 w-24 mx-auto mb-3" />
        <Shimmer className="h-8 md:h-10 w-48 md:w-64 mx-auto" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="text-center p-6 md:p-8 rounded-2xl bg-[#fafafa] border border-black/[0.03]">
            <Shimmer className="w-12 h-12 !rounded-2xl mx-auto mb-5" />
            <Shimmer className="h-4 w-24 mx-auto mb-2" />
            <Shimmer className="h-2.5 w-full mb-1" />
            <Shimmer className="h-2.5 w-3/4 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Admin Dashboard Skeleton ────────────────────────────────────────
export const AdminDashboardSkeleton = () => (
  <div className="animate-pulse">
    <Shimmer className="h-8 w-40 mb-8" />
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[0, 1, 2, 3].map(i => (
        <div key={i} className="bg-white p-5 rounded-xl border border-black/[0.04]">
          <Shimmer className="h-4 w-20 mb-3" />
          <Shimmer className="h-8 w-24" />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[0, 1].map(i => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-black/[0.04]">
          <Shimmer className="h-4 w-32 mb-2" />
          <Shimmer className="h-3 w-48" />
        </div>
      ))}
    </div>
  </div>
);

// ─── Admin Products Table Skeleton ───────────────────────────────────
export const AdminProductsTableSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex justify-between items-center mb-6">
      <Shimmer className="h-7 w-28" />
      <Shimmer className="h-10 w-36 !rounded-xl" />
    </div>
    <div className="flex gap-3 mb-6">
      <Shimmer className="h-10 flex-1 !rounded-xl" />
      <Shimmer className="h-10 w-36 !rounded-xl" />
    </div>
    <div className="bg-white rounded-xl border border-black/[0.04] overflow-hidden">
      <div className="p-4 border-b border-black/[0.04] flex gap-4">
        <Shimmer className="h-3 w-12" />
        <Shimmer className="h-3 w-20" />
        <Shimmer className="h-3 w-16" />
        <Shimmer className="h-3 w-12 ml-auto" />
        <Shimmer className="h-3 w-16" />
      </div>
      {[0, 1, 2, 3, 4].map(i => (
        <div key={i} className="p-4 border-b border-black/[0.03] flex items-center gap-4">
          <Shimmer className="w-12 h-12 !rounded-lg flex-shrink-0" />
          <div className="flex-1">
            <Shimmer className="h-4 w-36 mb-1.5" />
            <Shimmer className="h-2.5 w-16" />
          </div>
          <Shimmer className="h-5 w-20 !rounded-full" />
          <Shimmer className="h-4 w-12 ml-auto" />
          <div className="flex gap-2">
            <Shimmer className="w-8 h-8 !rounded-lg" />
            <Shimmer className="w-8 h-8 !rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Admin Orders Table Skeleton ─────────────────────────────────────
export const AdminOrdersTableSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex justify-between items-center mb-8">
      <div>
        <Shimmer className="h-7 w-40 mb-2" />
        <Shimmer className="h-3 w-48" />
      </div>
      <Shimmer className="w-10 h-10 !rounded-xl" />
    </div>
    <Shimmer className="h-12 w-full mb-8 !rounded-2xl" />
    <div className="bg-white rounded-[2rem] border border-black/[0.04] overflow-hidden">
      <div className="p-6 border-b border-black/[0.03] flex gap-6">
        <Shimmer className="h-3 w-16" />
        <Shimmer className="h-3 w-20" />
        <Shimmer className="h-3 w-12" />
        <Shimmer className="h-3 w-16 ml-auto" />
        <Shimmer className="h-3 w-14" />
        <Shimmer className="h-3 w-12" />
      </div>
      {[0, 1, 2, 3, 4].map(i => (
        <div key={i} className="p-6 border-b border-black/[0.02] flex items-center gap-6">
          <div>
            <Shimmer className="h-3.5 w-20 mb-1.5" />
            <Shimmer className="h-2.5 w-16" />
          </div>
          <div>
            <Shimmer className="h-3.5 w-28 mb-1.5" />
            <Shimmer className="h-2.5 w-24" />
          </div>
          <Shimmer className="h-3 w-20" />
          <Shimmer className="h-3.5 w-12 ml-auto" />
          <Shimmer className="h-5 w-20 !rounded-full" />
          <Shimmer className="w-8 h-8 !rounded-xl ml-auto" />
        </div>
      ))}
    </div>
  </div>
);
