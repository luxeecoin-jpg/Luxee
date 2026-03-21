"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const CATEGORIES = [
  { 
    name: "For Him", 
    description: "Bold, masculine fragrances", 
    href: "/shop?category=HIM", 
    image: "/product_him_1.png",
    bg: "from-slate-100 to-zinc-50" 
  },
  { 
    name: "For Her", 
    description: "Elegant, feminine scents", 
    href: "/shop?category=HER", 
    image: "/product_her_1.png",
    bg: "from-rose-50 to-pink-50" 
  },
  { 
    name: "Premium Attars", 
    description: "Traditional & luxurious", 
    href: "/shop?category=ATTAR", 
    image: "/product_him_2.png",
    bg: "from-amber-50 to-yellow-50" 
  },
  { 
    name: "Gift Sets", 
    description: "Curated for gifting", 
    href: "/shop?category=GIFTING", 
    image: "/product_her_2.png",
    bg: "from-violet-50 to-indigo-50" 
  },
];

export const FeaturedCategories = () => {
  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-12">
        <div className="text-center mb-12">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600 block mb-3">Collections</span>
          <h2 className="text-3xl md:text-5xl font-serif text-[#1a1a1a] tracking-tight">
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {CATEGORIES.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={cat.href} className="block group">
                <div className={`relative bg-gradient-to-br ${cat.bg} rounded-2xl overflow-hidden aspect-[3/4] md:aspect-[4/5] border border-black/[0.03]`}>
                  {/* Image */}
                  <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12">
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 mix-blend-multiply"
                    />
                  </div>
                  
                  {/* Bottom Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-white/90 to-transparent">
                    <h3 className="text-sm md:text-base font-bold text-[#1a1a1a] tracking-tight">{cat.name}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-black/30 font-medium">{cat.description}</span>
                      <ArrowRight className="w-4 h-4 text-black/20 group-hover:text-black group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
