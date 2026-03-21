"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addToCart } = useCart();
  const discountPercent = product.oldPrice > 0
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.image,
      category: product.category,
      size: '50 ML',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <Link href={`/product/${product.id}`} className="block h-full">
        <div className="bg-white p-3 md:p-4 rounded-2xl border border-black/[0.04] hover:border-black/[0.08] transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.06)] flex flex-col h-full relative overflow-hidden">
          
          {/* Badges */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
            {product.tag && (
              <span className="bg-black text-white text-[8px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                {product.tag}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="bg-red-500 text-white text-[8px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button 
            className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 border border-black/[0.04]"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          >
            <Heart className="w-3.5 h-3.5 text-black/40 hover:text-red-500 transition-colors" />
          </button>

          {/* Image */}
          <div className="relative aspect-[4/5] max-h-[300px] md:max-h-[380px] overflow-hidden rounded-xl mb-3 bg-[#fafafa]">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-contain mix-blend-multiply p-3 group-hover:scale-110 transition-transform duration-700"
            />
          </div>

          {/* Info */}
          <div className="mt-auto space-y-2.5">
            <div>
              <span className="text-[9px] font-semibold text-black/30 uppercase tracking-[0.15em]">{product.category}</span>
              <h3 className="text-sm font-bold text-[#1a1a1a] tracking-tight line-clamp-1 mt-0.5">{product.name}</h3>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold text-[#1a1a1a]">₹{product.price}</span>
                {product.oldPrice > product.price && (
                  <span className="text-[11px] text-black/25 line-through font-medium">₹{product.oldPrice}</span>
                )}
              </div>
              <button
                className="w-8 h-8 rounded-lg bg-black/[0.04] flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
