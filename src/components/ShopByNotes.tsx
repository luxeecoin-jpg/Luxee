"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const NOTES = [
  { name: "ROSE", description: "Romantic & Timeless", image: "/note_rose.png", color: "from-pink-50 to-rose-50" },
  { name: "CITRUSY", description: "Fresh & Zesty", image: "/note_citrus.png", color: "from-yellow-50 to-amber-50" },
  { name: "WHITE FLORAL", description: "Elegant & Pure", image: "/note_rose.png", color: "from-violet-50 to-purple-50" },
  { name: "AQUATIC", description: "Cool & Refreshing", image: "/note_citrus.png", color: "from-cyan-50 to-sky-50" },
  { name: "MUSK", description: "Deep & Sensual", image: "/note_musk.png", color: "from-stone-100 to-neutral-50" },
  { name: "SPICY", description: "Bold & Warm", image: "/note_woody.png", color: "from-orange-50 to-red-50" },
];

export const ShopByNotes = () => {
  return (
    <section className="w-full py-10 md:py-16 bg-[#fafafa]">
      <div className="container mx-auto px-4 md:px-12 text-center">
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600 block mb-3">Discover Your Scent</span>
        <h2 className="text-3xl md:text-5xl font-serif text-[#1a1a1a] tracking-tight mb-4">
          Shop by Notes
        </h2>
        <p className="text-sm text-black/30 max-w-md mx-auto mb-14">
          Find your perfect fragrance by exploring scent families that match your personality.
        </p>
        
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-6 md:gap-8 max-w-4xl mx-auto">
          {NOTES.map((note, index) => (
            <Link key={index} href={`/shop?note=${note.name}`}>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className={`w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br ${note.color} p-1 transition-all duration-500 group-hover:shadow-lg group-hover:scale-105`}>
                  <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center p-3 md:p-4">
                    <img 
                      src={note.image} 
                      alt={note.name} 
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
                <span className="mt-3 text-[9px] md:text-[10px] font-bold tracking-[0.15em] text-[#1a1a1a] group-hover:text-gold-600 transition-colors uppercase">
                  {note.name}
                </span>
                <span className="text-[8px] md:text-[9px] text-black/25 font-medium mt-0.5 hidden md:block">
                  {note.description}
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
