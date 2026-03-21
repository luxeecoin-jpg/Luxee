"use client";

import React from 'react';
import { ArrowRight } from 'lucide-react';

export const Newsletter = () => {
  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-12">
        <div className="bg-[#111] rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-gold-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
          
          <div className="relative z-10">
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-400 block mb-3">Newsletter</span>
            <h2 className="text-2xl md:text-4xl font-serif text-white tracking-tight mb-4">
              Stay in the Loop
            </h2>
            <p className="text-sm text-white/30 max-w-md mx-auto mb-8">
              Be the first to know about new launches, exclusive deals, and fragrance tips from our experts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-colors"
              />
              <button className="bg-white text-black px-6 py-4 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-white/90 transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-[10px] text-white/15 mt-4 tracking-wider">No spam, unsubscribe anytime.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
