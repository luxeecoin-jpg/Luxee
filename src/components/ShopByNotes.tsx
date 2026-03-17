"use client";

import React from 'react';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { name: "ROSE", image: "/note_rose.png" },
  { name: "CITRUSY", image: "/note_citrus.png" },
  { name: "WHITE FLORAL", image: "/note_rose.png" },
  { name: "AQUATIC", image: "/note_citrus.png" },
  { name: "MUSK", image: "/note_musk.png" },
  { name: "SPICY", image: "/note_woody.png" },
  { name: "WOODY", image: "/note_woody.png" },
];

export const ShopByNotes = () => {
  return (
    <section className="w-full py-24 bg-white">
      <div className="container mx-auto px-4 md:px-12 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-[#2d3436] uppercase tracking-tighter mb-16">
          Shop By Notes
        </h2>
        
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {CATEGORIES.map((note, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-24 h-24 md:w-40 md:h-40 rounded-full border-2 border-transparent group-hover:border-[#d81b60]/20 p-2 transition-all duration-500">
                <div className="w-full h-full rounded-full bg-[#f8f8f8] overflow-hidden flex items-center justify-center p-4">
                  <img 
                    src={note.image} 
                    alt={note.name} 
                    className="w-full h-full object-contain group-hover:scale-125 transition-transform duration-700"
                  />
                </div>
              </div>
              <span className="mt-6 text-[10px] md:text-xs font-black tracking-[0.2em] text-[#2d3436] group-hover:text-[#d81b60] transition-colors">
                {note.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
