"use client";

import React, { useState } from 'react';
import { ShoppingCart, Search, Menu, User, Zap, X } from 'lucide-react';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md text-black font-sans uppercase tracking-[0.1em] text-xs transition-all duration-300 border-b border-black/5">

      {/* Main Navigation */}
      <div className="container mx-auto px-4 md:px-8 py-4 md:py-5 flex items-center justify-between">
        
        {/* Left - Menu & Search */}
        <div className="flex items-center gap-4 flex-1">
          <button 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="hidden md:flex items-center border-b border-black/20 pb-1 w-48 focus-within:border-black transition-colors">
            <Search className="w-4 h-4 mr-2 text-black/50" />
            <input 
              type="text" 
              placeholder="SEARCH CATALOG..." 
              className="bg-transparent border-none outline-none text-[10px] w-full placeholder:text-black/30 font-semibold"
            />
          </div>
        </div>

        {/* Center - Brand */}
        <div className="text-2xl md:text-3xl font-black tracking-[0.25em] flex-shrink-0 cursor-pointer text-center">
          Nilesh<span className="text-[10px] align-top relative -top-1">®</span>
        </div>

        {/* Right - Icons */}
        <div className="flex items-center gap-4 md:gap-6 flex-1 justify-end">
          <div className="hidden md:flex items-center gap-1 cursor-pointer hover:text-orange-500 transition-colors">
             <Zap className="w-4 h-4" />
             <span className="text-[10px] font-bold">Offers</span>
          </div>
          <User className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform" />
          <div className="relative cursor-pointer hover:scale-110 transition-transform">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 bg-[#c59734] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
              0
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Categories */}
      <nav className="hidden md:block border-t border-black/5 bg-white/50">
        <div className="container mx-auto px-6 py-3">
          <ul className="flex items-center justify-center gap-10 text-[10px] font-bold text-black/60">
            <li><a href="#" className="text-red-600 hover:text-red-800 transition-colors">CRAZY DEALS</a></li>
            <li><a href="#" className="hover:text-black transition-colors">SHOP ALL</a></li>
            <li><a href="#" className="hover:text-black transition-colors">BESTSELLERS</a></li>
            <li><a href="#" className="text-black transition-colors border-b border-black pb-0.5">PERFUMES</a></li>
            <li><a href="#" className="hover:text-black transition-colors">BATH & BODY</a></li>
            <li><a href="#" className="hover:text-black transition-colors">SKINCARE</a></li>
            <li><a href="#" className="hover:text-black transition-colors">GIFTING</a></li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-black/10 transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-screen py-4 opacity-100' : 'max-h-0 opacity-0'}`}>
         <div className="px-4 pb-4 border-b border-black/10 mb-4">
            <div className="flex items-center border border-black/20 rounded p-2">
                <Search className="w-4 h-4 mr-2 text-black/50" />
                <input 
                  type="text" 
                  placeholder="SEARCH CATALOG..." 
                  className="bg-transparent border-none outline-none text-[10px] w-full placeholder:text-black/30 font-semibold"
                />
            </div>
         </div>
         <ul className="flex flex-col px-4 gap-4 text-xs font-bold text-black/70">
            <li><a href="#" className="text-red-600 block">CRAZY DEALS</a></li>
            <li><a href="#" className="block hover:text-black">SHOP ALL</a></li>
            <li><a href="#" className="block hover:text-black">BESTSELLERS</a></li>
            <li><a href="#" className="block text-black">PERFUMES</a></li>
            <li><a href="#" className="block hover:text-black">BATH & BODY</a></li>
            <li><a href="#" className="block hover:text-black">SKINCARE</a></li>
         </ul>
      </div>
    </header>
  );
};