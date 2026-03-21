"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHeroConfig } from '@/hooks/useHeroConfig';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Hero = () => {
  const { config, loading } = useHeroConfig();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = config.slides || [];

  const goNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goPrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [slides.length, goNext]);

  if (loading) {
    return (
      <div className="w-full aspect-[16/7] md:aspect-[16/6] bg-[#fafafa] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black/10 border-t-black/40 rounded-full animate-spin" />
      </div>
    );
  }

  if (slides.length === 0) return null;

  const slide = slides[currentSlide];

  return (
    <section className="relative w-full overflow-hidden bg-white mt-[72px] md:mt-[105px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="w-full"
        >
          {/* Desktop Image */}
          <img 
            src={slide.image} 
            alt={`Slide ${currentSlide + 1}`}
            className="hidden md:block w-full h-[65vh] xl:h-[75vh] max-h-[650px] object-cover object-center" 
          />
          {/* Mobile Image */}
          <img 
            src={slide.mobileImage || slide.image} 
            alt={`Slide ${currentSlide + 1}`}
            className="block md:hidden w-full h-[60vh] max-h-[500px] object-cover object-top" 
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button onClick={goPrev} className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/20 hover:bg-white/50 text-white hover:text-black rounded-full transition-all backdrop-blur-md z-20">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={goNext} className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/20 hover:bg-white/50 text-white hover:text-black rounded-full transition-all backdrop-blur-md z-20">
            <ChevronRight className="w-5 h-5" />
          </button>
          
          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentSlide(i)}
                className={`rounded-full transition-all duration-300 ${i === currentSlide ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};