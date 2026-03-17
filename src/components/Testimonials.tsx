"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const REVIEWS = [
  { id: 1, name: "Vikas Parmar", handle: "@Vikas", text: "BELLAVITA has raised the bar for the perfume industry, Such good quality at very affordable price", image: "/user_1.png", rating: 5 },
  { id: 2, name: "Nilesh Rathord", handle: "@Nilesh", text: "Truly amazed by the longevity of these scents. The Summer Collection is just breathtaking.", image: "/user_2.png", rating: 5 },
];

export const Testimonials = () => {
  return (
    <section className="w-full py-32 bg-white">
      <div className="container mx-auto px-4 md:px-12 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-[#2d3436] uppercase tracking-tighter mb-20">
          What our customers have to say
        </h2>

        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center gap-12 mb-16 overflow-x-auto pb-4">
             {REVIEWS.map((rev) => (
               <div key={rev.id} className="relative flex-shrink-0">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] overflow-hidden border-2 border-[#d81b60]/20 p-1">
                    <img src={rev.image} alt={rev.name} className="w-full h-full object-cover rounded-[1.8rem]" />
                  </div>
               </div>
             ))}
          </div>

          <div className="space-y-8">
             <div className="flex justify-center gap-1">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 fill-[#ffb400] text-[#ffb400]" />)}
             </div>
             <p className="text-xl md:text-2xl font-medium text-[#2d3436] leading-relaxed italic max-w-2xl mx-auto">
               "{REVIEWS[0].text}"
             </p>
             <div className="pt-4">
                <span className="block text-sm font-black text-[#2d3436] uppercase tracking-widest">{REVIEWS[0].name}</span>
                <span className="text-xs font-bold text-black/30">{REVIEWS[0].handle}</span>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};
