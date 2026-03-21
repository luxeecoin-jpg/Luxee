"use client";

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Award, Leaf, Heart, Sparkles } from 'lucide-react';

const VALUES = [
  { icon: Award, title: "Premium Ingredients", description: "We source the finest raw materials from around the globe to craft each unique fragrance." },
  { icon: Leaf, title: "Ethically Made", description: "Our perfumes are cruelty-free, vegan, and produced with sustainable practices." },
  { icon: Heart, title: "Made with Love", description: "Every bottle is crafted with passion by our master perfumers who live and breathe fragrance." },
  { icon: Sparkles, title: "For Everyone", description: "We believe luxury should be accessible. Premium fragrances at honest prices." },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 md:px-12 pt-28 md:pt-36 pb-16">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600 block mb-3">Our Story</span>
          <h1 className="text-3xl md:text-5xl font-serif text-[#1a1a1a] tracking-tight mb-6">About Luxee</h1>
          <p className="text-base text-black/40 leading-relaxed">
            Born from a passion for exceptional fragrances, Luxee was founded with a simple vision — 
            to make luxury perfumery accessible to everyone. We believe that a great fragrance has the 
            power to transform your day, boost your confidence, and leave a lasting impression.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-[#fafafa] rounded-3xl p-8 md:p-14 mb-16 border border-black/[0.03]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600 block mb-3">Our Mission</span>
              <h2 className="text-2xl md:text-3xl font-serif text-[#1a1a1a] tracking-tight mb-4">
                Luxury Redefined
              </h2>
              <p className="text-sm text-black/40 leading-relaxed mb-4">
                At Luxee, we challenge the notion that luxury must come with an exorbitant price tag. 
                Our master perfumers work tirelessly to create scents that rival the world&apos;s most 
                prestigious fragrance houses — at a fraction of the cost.
              </p>
              <p className="text-sm text-black/40 leading-relaxed">
                Every fragrance in our collection undergoes rigorous quality testing to ensure exceptional 
                longevity, projection, and complexity. From the first spritz to the final dry-down, 
                a Luxee fragrance is designed to captivate.
              </p>
            </div>
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-gold-50 to-luxe-50 flex items-center justify-center">
              <img src="/product_him_1.png" alt="Luxee Product" className="w-3/4 h-3/4 object-contain drop-shadow-2xl" />
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600 block mb-3">What Drives Us</span>
            <h2 className="text-2xl md:text-3xl font-serif text-[#1a1a1a] tracking-tight">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((val, i) => (
              <div key={i} className="text-center p-8 rounded-2xl bg-[#fafafa] border border-black/[0.03] hover:shadow-lg transition-all duration-500">
                <div className="w-14 h-14 bg-gold-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <val.icon className="w-6 h-6 text-gold-600" />
                </div>
                <h3 className="text-sm font-bold text-[#1a1a1a] mb-2">{val.title}</h3>
                <p className="text-[12px] text-black/30 leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { number: "50+", label: "Unique Fragrances" },
            { number: "10K+", label: "Happy Customers" },
            { number: "4.8★", label: "Average Rating" },
            { number: "100%", label: "Authentic Products" },
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 md:p-8 rounded-2xl bg-black text-white">
              <span className="text-2xl md:text-4xl font-serif font-bold block mb-1">{stat.number}</span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-white/40">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
