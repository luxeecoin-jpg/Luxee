"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { 
      id: 1, 
      image: "/summer_hero_1.png",
      mobileImage: "/summer_hero_3.png",
      position: "left"
    },
    { 
      id: 2, 
      image: "/summer_hero_2.png",
      mobileImage: "/summer_hero_4.png",
      position: "left" 
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative w-full h-[75vh] md:h-[85vh] bg-[#fafafa] overflow-hidden flex items-center pt-16 mt-4">
      <div className="container mx-auto px-4 md:px-12 h-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full flex items-center"
          >
            {/* Background Image Container */}
            <div className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center bg-[#fafafa]">
              {/* Desktop Image */}
              <img 
                src={slides[currentSlide].image} 
                alt={`Slide ${slides[currentSlide].id}`} 
                className="hidden md:block w-full h-full object-contain p-4 drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
              />
              {/* Mobile Image - Using desktop image as fallback if mobile is missing */}
              <img 
                src={slides[currentSlide].mobileImage} 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = slides[currentSlide].image;
                }}
                alt={`Slide ${slides[currentSlide].id}`} 
                className="block md:hidden w-full h-full object-cover rounded-3xl overflow-hidden shadow-2xl scale-[0.95]"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 flex items-center gap-6 z-20">
          <button 
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="w-10 h-10 border border-[#2d3436]/10 flex items-center justify-center hover:bg-[#2d3436] hover:text-white transition-all rounded-full bg-white/80 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="text-[11px] font-bold tracking-[0.2em] text-[#2d3436]">
            {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </div>
          <button 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="w-10 h-10 border border-[#2d3436]/10 flex items-center justify-center hover:bg-[#2d3436] hover:text-white transition-all rounded-full bg-white/80 backdrop-blur-sm"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};