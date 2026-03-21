"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useProducts } from '@/hooks/useProducts';
import { ArrowRight, Zap, Clock } from 'lucide-react';

export const CrazyDeals = () => {
  const { products, loading } = useProducts();

  const dealProducts = products.filter(p => p.section === "CRAZY DEALS");

  if (loading || dealProducts.length === 0) return null;

  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-b from-[#fef8f5] to-white">
      <div className="container mx-auto px-4 md:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-500 px-4 py-1.5 rounded-full mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Limited Time Only</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif text-[#1a1a1a] tracking-tight">
            Crazy Deals
          </h2>
          <p className="text-sm text-black/30 mt-3 max-w-md mx-auto">
            Incredible savings on premium fragrances. Don&apos;t miss out on these exclusive offers.
          </p>
        </div>

        {/* Deal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dealProducts.slice(0, 6).map((deal, index) => {
            const discountPercent = deal.oldPrice > 0
              ? Math.round(((deal.oldPrice - deal.price) / deal.oldPrice) * 100)
              : 0;

            return (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/product/${deal.id}`} className="block group">
                  <div className="relative bg-white rounded-2xl border border-black/[0.04] overflow-hidden hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-500">
                    {/* Discount Badge */}
                    {discountPercent > 0 && (
                      <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg">
                        -{discountPercent}% OFF
                      </div>
                    )}

                    {/* Image */}
                    <div className="relative aspect-[4/3] bg-[#fafafa] p-8">
                      <img 
                        src={deal.image} 
                        alt={deal.name} 
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" 
                      />
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        {deal.tag && (
                          <span className="text-[8px] font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded uppercase tracking-wider">
                            {deal.tag}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-[#1a1a1a] tracking-tight mb-2">{deal.name}</h3>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-lg font-bold text-red-500">₹{deal.price}</span>
                        {deal.oldPrice > deal.price && (
                          <span className="text-sm text-black/25 line-through">₹{deal.oldPrice}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-black/30">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-medium uppercase tracking-wider">Limited Stock</span>
                        </div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-black/40 group-hover:text-black transition-colors flex items-center gap-1">
                          Shop Now <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <Link 
            href="/deals"
            className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black/90 transition-all group"
          >
            View All Deals
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};
