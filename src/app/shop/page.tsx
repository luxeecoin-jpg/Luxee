"use client";

import React, { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ArrowUpDown, LayoutGrid, List, SearchSlash } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ShopContent() {
  const { products, loading } = useProducts();
  const searchParams = useSearchParams();
  
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sectionFilter, setSectionFilter] = useState('ALL');

  // Read URL params on mount
  useEffect(() => {
    const category = searchParams.get('category');
    const section = searchParams.get('section');
    const note = searchParams.get('note');
    
    if (category) setFilter(category);
    if (section) setSectionFilter(section);
    if (note) setSearch(note);
  }, [searchParams]);

  const categories = ['ALL', 'HIM', 'HER', 'ATTAR', 'GIFTING'];
  const sections = ['ALL', 'BESTSELLERS', 'NEW ARRIVALS'];

  const filteredProducts = products
    .filter(p => {
      const matchesCategory = filter === 'ALL' || p.category === filter;
      const matchesSection = sectionFilter === 'ALL' || p.section === sectionFilter;
      const matchesSearch = search === '' || 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.notes && p.notes.some(n => n.toLowerCase().includes(search.toLowerCase()))) ||
        (p.badges && p.badges.some(b => b.toLowerCase().includes(search.toLowerCase())));
      return matchesCategory && matchesSection && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'discount') {
        const discA = a.oldPrice > 0 ? (a.oldPrice - a.price) / a.oldPrice : 0;
        const discB = b.oldPrice > 0 ? (b.oldPrice - b.price) / b.oldPrice : 0;
        return discB - discA;
      }
      return 0;
    });

  return (
    <div className="container mx-auto px-4 md:px-12 pt-28 md:pt-36 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600 block mb-2">Explore</span>
          <h1 className="text-3xl md:text-5xl font-serif text-[#1a1a1a] tracking-tight">
            {sectionFilter !== 'ALL' ? sectionFilter.charAt(0) + sectionFilter.slice(1).toLowerCase() : 'All Fragrances'}
          </h1>
        </div>
        
        <div className="w-full md:w-80 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20 group-focus-within:text-black/40 transition-colors" />
          <input 
            type="text" 
            placeholder="Search fragrances..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-black/[0.06] py-3.5 pl-11 pr-4 rounded-xl text-sm font-medium outline-none focus:border-black/15 transition-all"
          />
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-[10px] font-semibold uppercase tracking-[0.15em] transition-all ${
                filter === cat 
                  ? 'bg-black text-white' 
                  : 'bg-white text-black/40 border border-black/[0.06] hover:border-black/15'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Section Filter + Sort */}
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-2">
          {sections.map(sec => (
            <button
              key={sec}
              onClick={() => setSectionFilter(sec)}
              className={`text-[10px] font-medium uppercase tracking-wider px-3 py-1.5 rounded-md transition-all ${
                sectionFilter === sec
                  ? 'bg-gold-50 text-gold-700'
                  : 'text-black/25 hover:text-black/40'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-black/25 font-medium uppercase tracking-wider">{filteredProducts.length} items</span>
          <select 
            value={sortBy} 
            onChange={e => setSortBy(e.target.value)}
            className="bg-white border border-black/[0.06] rounded-lg px-3 py-2 text-[10px] font-semibold uppercase tracking-wider outline-none cursor-pointer"
          >
            <option value="name">Name A-Z</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="discount">Biggest Discount</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-black/10 border-t-black/40 rounded-full animate-spin mx-auto" />
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-3">
          <SearchSlash className="w-10 h-10 mx-auto text-black/10" />
          <p className="text-sm text-black/25 font-medium">No fragrances found matching your criteria</p>
          <button onClick={() => { setFilter('ALL'); setSearch(''); setSectionFilter('ALL'); }} className="text-[11px] text-gold-600 font-semibold uppercase tracking-wider hover:underline">
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Header />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-black/10 border-t-black/40 rounded-full animate-spin" />
        </div>
      }>
        <ShopContent />
      </Suspense>
      <Footer />
    </main>
  );
}
