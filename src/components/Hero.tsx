"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { HeroSlide } from '@/lib/data';

interface HeroProps {
  slides: HeroSlide[];
}

export const Hero = ({ slides }: HeroProps) => {
  // Filter out any slides that don't have an image set to avoid empty src errors
  const validSlides = slides.filter(s => s.image && s.image.trim() !== "");
  const [currentSlide, setCurrentSlide] = useState(0);

  const goNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % validSlides.length);
  }, [validSlides.length]);

  const goPrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + validSlides.length) % validSlides.length);
  }, [validSlides.length]);

  useEffect(() => {
    if (validSlides.length <= 1) return;
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [validSlides.length, goNext]);

  // Make sure we never try to render an empty slide list or go out of bounds
  if (validSlides.length === 0 || currentSlide >= validSlides.length) return null;

  const slide = validSlides[currentSlide];
  const isDataUrl = slide.image?.startsWith('data:');

  return (
    <section className="relative w-full overflow-hidden bg-white mt-[72px] md:mt-[105px]">
      <AnimatePresence mode="wait">
        <motion.div
  // ... rest of the code is the same
          key={currentSlide}
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1.05 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full"
        >
          {/* Desktop Image */}
          {isDataUrl ? (
            <img
              src={slide.image}
              alt={`Slide ${currentSlide + 1}`}
              className="hidden md:block w-full h-[65vh] xl:h-[75vh] max-h-[650px] object-cover object-center"
            />
          ) : (
            <div className="hidden md:block relative w-full h-[65vh] xl:h-[75vh] max-h-[650px]">
              <Image
                src={slide.image}
                alt={`Slide ${currentSlide + 1}`}
                fill
                className="object-cover object-center"
                priority={currentSlide === 0}
                sizes="100vw"
              />
            </div>
          )}
          {/* Mobile Image */}
          {isDataUrl ? (
            <img
              src={slide.mobileImage || slide.image}
              alt={slide.title}
              className="block md:hidden w-full h-[85vh] max-h-[700px] object-cover object-center"
            />
          ) : (
            <div className="block md:hidden relative w-full h-[85vh] max-h-[700px]">
              <Image
                src={slide.mobileImage || slide.image}
                alt={slide.title}
                fill
                className="object-cover object-center"
                priority={currentSlide === 0}
                sizes="100vw"
              />
            </div>
          )}

          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-end justify-center text-center p-6 pb-16 md:pb-20 bg-black/10">
            <div className="max-w-xl">
              {slide.subtitle && (
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-white block mb-4 drop-shadow-lg"
                >
                  {slide.subtitle}
                </motion.span>
              )}
              {slide.title && (
                <motion.h1 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-7xl font-serif text-white tracking-tighter mb-4 drop-shadow-2xl leading-[0.9]"
                >
                  {slide.title}
                </motion.h1>
              )}
              {slide.description && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="text-xs md:text-sm text-white/80 mb-8 drop-shadow-lg max-w-sm mx-auto"
                >
                  {slide.description}
                </motion.p>
              )}
              {slide.ctaText && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link 
                    href="/shop"
                    className="inline-block bg-white text-black px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-2xl shadow-black/20"
                  >
                    {slide.ctaText}
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* New Pagination Layout: 01 / 02 with Arrows */}
      {validSlides.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-8 z-20">
          <button 
            onClick={goPrev} 
            className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white text-white hover:text-black rounded-full transition-all backdrop-blur-md"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest drop-shadow-md">
            <span>{String(currentSlide + 1).padStart(2, '0')}</span>
            <span className="opacity-40">/</span>
            <span className="opacity-40">{String(validSlides.length).padStart(2, '0')}</span>
          </div>

          <button 
            onClick={goNext} 
            className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white text-white hover:text-black rounded-full transition-all backdrop-blur-md"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
};