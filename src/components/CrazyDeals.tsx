"use client";

import React from 'react';
import { motion } from 'framer-motion';

const DEALS = [
  { id: 1, title: "Self Love Kit", sub: "Buy Any 6 for ₹1298", image: "/deal_1.png", color: "bg-pink-50" },
  { id: 2, title: "Ultimate Perfume Box", sub: "Buy Any 3 for ₹1298", image: "/product_him_1.png", color: "bg-orange-50" },
  { id: 3, title: "Bade Miya Chhote Miya", sub: "Buy Any 2 for ₹649", image: "/product_him_2.png", color: "bg-blue-50" },
];

export const CrazyDeals = () => {
  return (
    <section className="w-full py-24 bg-[#fafafa]">
      <div className="container mx-auto px-4 md:px-12">
        <h2 className="text-4xl md:text-5xl font-black text-[#2d3436] uppercase tracking-tighter mb-16 text-center">
          Crazy Deals
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {DEALS.map((deal, index) => (
            <motion.div
              key={deal.id}
              className={`${deal.color} p-8 rounded-[3rem] text-center border border-black/[0.03] group hover:shadow-2xl transition-all duration-500`}
            >
              <span className="text-[10px] font-black tracking-widest text-black/40 uppercase mb-4 block">Limited Time</span>
              <h3 className="text-2xl font-black text-[#2d3436] mb-2">{deal.sub}</h3>
              <p className="text-sm font-bold opacity-40 uppercase mb-8 tracking-tighter">Only Today</p>
              
              <div className="relative aspect-square mb-8 p-8">
                <img src={deal.image} alt={deal.title} className="w-full h-full object-contain drop-shadow-2xl group-hover:rotate-6 transition-transform duration-500" />
              </div>

              <h4 className="text-xs font-black tracking-[0.2em] uppercase text-[#2d3436] mb-6">{deal.title}</h4>
              <button className="bg-white text-black px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest border border-black/5 hover:bg-black hover:text-white transition-all">
                Shop Deal
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
