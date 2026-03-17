"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORIES = ["HIM", "HER", "ATTAR", "GIFTING"];

const PRODUCTS_HIM = [
  { id: 101, name: "Sundarban 50ml Perfume", price: 1499, oldPrice: 2199, rating: 5, reviews: 8, image: "/product_him_1.png", tag: "New Arrival", badges: ["Green", "Earthy", "Fresh"] },
  { id: 102, name: "Maritime | Eau De Parfum", price: 799, oldPrice: 1499, rating: 4, reviews: 5, image: "/product_him_2.png", tag: "Best Seller", badges: ["Woody", "Aquatic", "Aromatic"] },
  { id: 103, name: "Aristocrat | Night Edition", price: 1800, oldPrice: 2400, rating: 5, reviews: 12, image: "/product_him_1.png", tag: "Best Seller", badges: ["Spicy", "Oriental"] },
];

const PRODUCTS_HER = [
  { id: 201, name: "Alaya | Eau De Parfum", price: 799, oldPrice: 1499, rating: 5, reviews: 1, image: "/product_her_1.png", tag: "New Arrival", badges: ["Musky", "Citrus", "Floral"] },
  { id: 202, name: "Promise | Eau De Parfum", price: 799, oldPrice: 1499, rating: 4, reviews: 1, image: "/product_her_2.png", tag: "Best Seller", badges: ["Woody", "Earthy", "Amber"] },
  { id: 203, name: "Fleur | Spring Edition", price: 1200, oldPrice: 1600, rating: 5, reviews: 4, image: "/product_her_1.png", tag: "New Arrival", badges: ["Sweet", "Fruity"] },
];

export const Bestsellers = () => {
  const [mainTab, setMainTab] = useState("BESTSELLERS");
  const [subTab, setSubTab] = useState("HIM");
  const scrollRef = useRef<HTMLDivElement>(null);

  const products = subTab === "HIM" ? PRODUCTS_HIM : PRODUCTS_HER;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full py-24 bg-white">
      <div className="container mx-auto px-4 md:px-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          <div className="relative">
            <h2 className="text-5xl md:text-6xl font-serif text-[#2d3436] tracking-tight uppercase">
              Our Bestsellers
            </h2>
            {/* Curved accent line inspired by Image 1 */}
            <div className="mt-4 h-1 w-32 bg-[#c59734]/30 rounded-full mx-auto md:mx-0" />
          </div>
        </div>

        {/* Level 1: Main Toggles (BESTSELLERS | NEW ARRIVALS) */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <button 
            onClick={() => setMainTab("BESTSELLERS")}
            className={`text-sm md:text-base font-bold tracking-widest transition-colors ${mainTab === "BESTSELLERS" ? "text-black" : "text-black/20"}`}
          >
            BESTSELLERS
          </button>
          <div className="h-4 w-[1px] bg-black/10" />
          <button 
            onClick={() => setMainTab("NEW ARRIVALS")}
            className={`text-sm md:text-base font-bold tracking-widest transition-colors ${mainTab === "NEW ARRIVALS" ? "text-black" : "text-black/20"}`}
          >
            NEW ARRIVALS
          </button>
        </div>

        {/* Level 2: Sub Toggles (HIM  HER) */}
        <div className="flex items-center justify-center gap-12 mb-12">
          <button 
            onClick={() => setSubTab("HIM")}
            className={`text-xs font-serif italic tracking-[0.2em] relative pb-1 transition-all ${subTab === "HIM" ? "text-[#c59734] border-b border-[#c59734]" : "text-black/40"}`}
          >
            HIM
          </button>
          <button 
            onClick={() => setSubTab("HER")}
            className={`text-xs font-serif italic tracking-[0.2em] relative pb-1 transition-all ${subTab === "HER" ? "text-[#c59734] border-b border-[#c59734]" : "text-black/40"}`}
          >
            HER
          </button>
        </div>

        <div className="relative group">
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-12 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <AnimatePresence mode="wait">
              {products.map((product) => (
                <motion.div
                  key={`${mainTab}-${subTab}-${product.id}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="min-w-[280px] md:min-w-[320px] group snap-start"
                >
                  <div className="bg-[#fcfcfc] p-4 rounded-xl border border-black/[0.03] transition-all duration-300">
                    <div className="relative aspect-square overflow-hidden rounded-lg mb-4 bg-white">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                      />
                      <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Heart className="w-4 h-4 text-[#d81b60]" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-[#2d3436] tracking-tight line-clamp-1">{product.name}</h3>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-black">Rs. {product.price}</span>
                        <span className="text-[10px] text-black/20 line-through">Rs. {product.oldPrice}</span>
                      </div>
                      <button className="w-full border border-black/10 py-2.5 rounded text-[9px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Slider Nav */}
          <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 shadow-lg rounded-full flex items-center justify-center -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity border border-black/5">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 shadow-lg rounded-full flex items-center justify-center translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity border border-black/5">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
