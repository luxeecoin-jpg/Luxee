"use client";

import React from 'react';
import { Shield, Award, Leaf, Truck } from 'lucide-react';

const VALUES = [
  { icon: Award, title: "Premium Quality", description: "Every fragrance is crafted with the finest ingredients sourced from around the world." },
  { icon: Leaf, title: "Cruelty Free", description: "We never test on animals. Our products are 100% vegan and ethically produced." },
  { icon: Truck, title: "Fast Delivery", description: "Free express shipping on all orders. Your fragrances delivered within 2-3 business days." },
  { icon: Shield, title: "Authentic Products", description: "100% genuine products with authenticity guarantee on every purchase." },
];

export const BrandStory = () => {
  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-12">
        <div className="text-center mb-14">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600 block mb-3">Why Choose Us</span>
          <h2 className="text-3xl md:text-5xl font-serif text-[#1a1a1a] tracking-tight">
            The Luxee Promise
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {VALUES.map((val, index) => (
            <div key={index} className="text-center p-6 md:p-8 rounded-2xl bg-[#fafafa] border border-black/[0.03] hover:shadow-[0_4px_30px_rgba(0,0,0,0.04)] transition-all duration-500 group">
              <div className="w-12 h-12 bg-gold-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-gold-100 transition-colors">
                <val.icon className="w-5 h-5 text-gold-600" />
              </div>
              <h3 className="text-sm font-bold text-[#1a1a1a] mb-2 tracking-tight">{val.title}</h3>
              <p className="text-[12px] text-black/30 leading-relaxed">{val.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
