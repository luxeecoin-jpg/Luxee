"use client";

import React, { useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Zap, Clock, ArrowUpDown } from 'lucide-react';
import type { Product } from '@/lib/data';

interface DealsContentProps {
  products: Product[];
}

export function DealsContent({ products }: DealsContentProps) {
  const [sortBy, setSortBy] = useState('discount');

  const dealProducts = [...products].sort((a, b) => {
    if (sortBy === 'discount') {
      const discA = (a.oldPrice ?? 0) > 0 ? ((a.oldPrice ?? 0) - a.price) / (a.oldPrice ?? 1) : 0;
      const discB = (b.oldPrice ?? 0) > 0 ? ((b.oldPrice ?? 0) - b.price) / (b.oldPrice ?? 1) : 0;
      return discB - discA;
    }
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  return (
    <div className="container mx-auto px-4 md:px-12 pt-28 md:pt-36 pb-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-8 md:p-14 mb-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Limited Time Offers</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight mb-3">Crazy Deals</h1>
          <p className="text-sm text-white/70 max-w-md">
            Grab premium fragrances at unbelievable prices. These deals won&apos;t last long!
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-black/30 uppercase tracking-wider">
          <Clock className="w-4 h-4" />
          {dealProducts.length} deals available
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-black/20" />
          <select 
            value={sortBy} 
            onChange={e => setSortBy(e.target.value)}
            className="bg-white border border-black/5 rounded-xl px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider outline-none cursor-pointer"
          >
            <option value="discount">Biggest Discount</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {dealProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {dealProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <Zap className="w-12 h-12 mx-auto text-black/10 mb-4" />
          <p className="text-sm text-black/30 font-medium">No deals available right now. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
