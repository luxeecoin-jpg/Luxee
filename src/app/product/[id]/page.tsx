"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Minus, Plus, Info, ShoppingCart, Heart, Truck, RotateCcw, Shield } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import Link from 'next/link';

const Accordion = ({ title, content, icon }: { title: string; content: string; icon?: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-black/[0.06]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left group"
      >
        <div className="flex items-center gap-3">
          {icon || <Info className="w-4 h-4 text-black/30" />}
          <span className="text-sm font-semibold tracking-tight text-[#1a1a1a]">{title}</span>
        </div>
        <Plus className={`w-4 h-4 text-black/30 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-black/50 leading-relaxed">
              {content}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ProductPage() {
  const { id } = useParams();
  const { products, loading } = useProducts();
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("50 ML");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const product = products.find(p => p.id === id);

  // Related products (same category, different product)
  const relatedProducts = products
    .filter(p => p.id !== id && product && p.category === product.category)
    .slice(0, 4);

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-black/10 border-t-black/40 rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-serif text-[#1a1a1a]">Product Not Found</h1>
          <Link href="/shop" className="text-sm text-gold-600 font-semibold hover:underline">
            Browse All Products
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  const discountPercent = product.oldPrice > 0
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 md:px-12 pt-24 md:pt-32 pb-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] font-medium text-black/30 uppercase tracking-widest mb-8">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-black/60">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          
          {/* Left: Image Gallery */}
          <div className="relative group">
            <div className="bg-[#fafafa] rounded-2xl aspect-square overflow-hidden border border-black/[0.04] relative">
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                {product.tag && (
                  <span className="bg-black text-white text-[9px] font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                    {product.tag}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="bg-red-500 text-white text-[9px] font-bold px-3 py-1 rounded-md">
                    -{discountPercent}%
                  </span>
                )}
              </div>
              
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentImage}
                  src={images[currentImage]} 
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-contain p-8 md:p-12 mix-blend-multiply"
                />
              </AnimatePresence>

              {/* Navigation */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-black/5 flex items-center justify-center bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-black/5 flex items-center justify-center bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {images.map((img, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImage === i ? 'border-black' : 'border-black/5 opacity-50 hover:opacity-80'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain p-1 bg-[#fafafa]" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col space-y-6">
            {/* Category & Name */}
            <div>
              <span className="text-[10px] font-semibold text-gold-600 uppercase tracking-[0.2em] block mb-2">{product.category}</span>
              <h1 className="text-2xl md:text-4xl font-serif text-[#1a1a1a] tracking-tight mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= product.rating ? 'fill-gold-400 text-gold-400' : 'fill-black/5 text-black/5'}`} />
                  ))}
                </div>
                <span className="text-[11px] text-black/30 font-medium">{product.rating} ({product.reviews} reviews)</span>
              </div>
            </div>

            {/* Tags */}
            {product.badges && product.badges.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.badges.map(badge => (
                  <span key={badge} className="text-[9px] font-semibold text-black/40 border border-black/[0.06] px-3 py-1 rounded-md uppercase tracking-wider">
                    {badge}
                  </span>
                ))}
              </div>
            )}

            {/* Price */}
            <div className="bg-[#fafafa] rounded-xl p-5 border border-black/[0.03]">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#1a1a1a]">₹{product.price}</span>
                {product.oldPrice > product.price && (
                  <>
                    <span className="text-lg text-black/20 line-through">₹{product.oldPrice}</span>
                    <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">Save ₹{product.oldPrice - product.price}</span>
                  </>
                )}
              </div>
              <p className="text-[10px] text-black/30 font-medium mt-1 uppercase tracking-wider">Inclusive of all taxes</p>
            </div>

            {/* Size Selector */}
            <div>
              <span className="text-[10px] font-semibold text-black/40 uppercase tracking-[0.15em] block mb-3">Select Size</span>
              <div className="flex gap-3">
                {((product as any).sizes && (product as any).sizes.length > 0 ? (product as any).sizes : ["50 ML", "15 ML"]).map((size: string) => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all border ${
                      selectedSize === size 
                        ? 'bg-black text-white border-black' 
                        : 'bg-transparent text-black/60 border-black/10 hover:border-black/20'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex gap-3 items-stretch">
              <div className="flex items-center border border-black/10 rounded-xl px-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:text-black/60 transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold text-sm">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:text-black/60 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, oldPrice: product.oldPrice, image: product.image, category: product.category, size: selectedSize }, quantity)} className="flex-1 bg-black text-white py-4 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black/90 transition-all flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Add To Cart
              </button>
              <button className="w-12 border border-black/10 rounded-xl flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-all">
                <Heart className="w-4 h-4" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Truck, text: "Free Shipping" },
                { icon: RotateCcw, text: "Easy Returns" },
                { icon: Shield, text: "Genuine Product" },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#fafafa] border border-black/[0.03]">
                  <Icon className="w-4 h-4 text-black/30" />
                  <span className="text-[8px] font-semibold text-black/30 uppercase tracking-wider text-center">{text}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            {product.description && (
              <div className="pt-4">
                <h3 className="text-sm font-semibold text-[#1a1a1a] mb-2">Description</h3>
                <p className="text-sm text-black/40 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Accordions */}
            <div className="pt-2 border-t border-black/[0.06]">
              <Accordion title="Shipping & Delivery" content="Free shipping on orders above ₹499. Standard delivery within 3-5 business days. Express delivery available for select pin codes." />
              <Accordion title="Return Policy" content="Easy 7-day return policy. If you're not satisfied with your purchase, return it within 7 days for a full refund." />
              <Accordion title="Authenticity Guarantee" content="All products sold by Luxee are 100% authentic with brand guarantee. We source directly from manufacturers." />
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-serif text-[#1a1a1a] tracking-tight">You May Also Like</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  );
}
