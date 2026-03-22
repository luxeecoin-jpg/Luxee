"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from './ProductCard';

export const Bestsellers = () => {
  const [mainTab, setMainTab] = useState("BESTSELLERS");
  const [subTab, setSubTab] = useState("HIM");
  const { products, loading } = useProducts();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 250 : 350;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const filteredProducts = products.filter(p => 
    p.section === mainTab && p.category === subTab
  );

  if (loading) return null;

  return (
    <section className="w-full py-6 md:py-10 bg-white">
      <div className="container mx-auto px-4 md:px-12">
        {/* Header */}
        <div className="text-center mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600 block mb-3">Curated for You</span>
          <h2 className="text-3xl md:text-5xl font-serif text-[#1a1a1a] tracking-tight">
            {mainTab === "BESTSELLERS" ? "Our Bestsellers" : "New Arrivals"}
          </h2>
          <div className="mt-4 h-[2px] w-16 bg-gold-400/40 rounded-full mx-auto" />
        </div>

        {/* Main Tabs */}
        <div className="flex items-center justify-center gap-6 mb-1">
          {["BESTSELLERS", "NEW ARRIVALS"].map(tab => (
            <button 
              key={tab}
              onClick={() => setMainTab(tab)}
              className={`text-xs md:text-sm font-semibold tracking-[0.15em] transition-all pb-2 border-b-2 ${
                mainTab === tab 
                  ? "text-black border-black" 
                  : "text-black/20 border-transparent hover:text-black/40"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Sub Tabs */}
        <div className="flex items-center justify-center gap-8 md:gap-12 mb-3">
          {["HIM", "HER", "GIFTING"].map(cat => (
            <button 
              key={cat}
              onClick={() => setSubTab(cat)}
              className={`text-[11px] font-medium tracking-[0.2em] relative pb-1.5 transition-all uppercase ${
                subTab === cat 
                  ? "text-gold-600" 
                  : "text-black/25 hover:text-black/40"
              }`}
            >
              {cat}
              {subTab === cat && (
                <motion.div layoutId="subTabIndicator" className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="relative">
          {/* Navigation Arrows (Desktop) */}
          <div className="hidden lg:block absolute top-[40%] -translate-y-1/2 left-0 z-10">
            <button 
              onClick={() => scroll('left')}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] text-black/40 hover:text-black hover:scale-110 transition-all -ml-6 border border-black/[0.04]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
          <div className="hidden lg:block absolute top-[40%] -translate-y-1/2 right-0 z-10">
            <button 
              onClick={() => scroll('right')}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] text-black/40 hover:text-black hover:scale-110 transition-all -mr-6 border border-black/[0.04]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              ref={scrollRef as any}
              key={`${mainTab}-${subTab}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 md:gap-6 pb-4 -mx-4 px-4 md:mx-0 md:px-0"
            >
              {filteredProducts.map((product, i) => (
                <div key={product.id} className="min-w-[calc(50%-8px)] md:min-w-[calc(33.333%-16px)] lg:min-w-[calc(25%-18px)] snap-start shrink-0">
                  <ProductCard product={product} index={i} />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && !loading && (
          <div className="py-20 text-center">
            <p className="text-sm text-black/20 font-medium">No items in this collection yet</p>
          </div>
        )}

        {/* View All */}
        <div className="text-center mt-4">
          <Link 
            href={`/shop?section=${mainTab}`}
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors group"
          >
            View All {mainTab}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};
