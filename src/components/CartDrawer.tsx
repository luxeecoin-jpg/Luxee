"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import Link from 'next/link';

export const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 w-full max-w-md h-full bg-white z-[201] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/[0.05]">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5" />
                <h2 className="text-base font-bold tracking-tight">Your Bag</h2>
                <span className="text-[10px] font-bold bg-black text-white w-5 h-5 rounded-full flex items-center justify-center">{totalItems}</span>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-black/5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                  <ShoppingBag className="w-12 h-12 text-black/10" />
                  <div>
                    <p className="text-sm font-semibold text-[#1a1a1a] mb-1">Your bag is empty</p>
                    <p className="text-[11px] text-black/30">Add some fragrances to get started</p>
                  </div>
                  <button onClick={() => setIsCartOpen(false)} className="text-[11px] font-bold uppercase tracking-wider text-gold-600 hover:underline">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={`${item.id}-${item.size}`} className="flex gap-4 p-3 bg-[#fafafa] rounded-xl border border-black/[0.03]">
                      <div className="w-20 h-20 bg-white rounded-lg p-2 flex-shrink-0 border border-black/[0.03]">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#1a1a1a] truncate">{item.name}</p>
                        <p className="text-[10px] text-black/30 font-medium uppercase tracking-wider mt-0.5">{item.size}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-black/10 rounded-lg">
                            <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} className="p-1.5"><Minus className="w-3 h-3" /></button>
                            <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} className="p-1.5"><Plus className="w-3 h-3" /></button>
                          </div>
                          <span className="text-sm font-bold">₹{item.price * item.quantity}</span>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id, item.size)} className="p-1 h-fit text-black/20 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-black/[0.05] px-6 py-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-black/50">Subtotal</span>
                  <span className="text-xl font-bold text-[#1a1a1a]">₹{totalPrice}</span>
                </div>
                <p className="text-[10px] text-black/25 text-center">Shipping and taxes calculated at checkout</p>
                <button className="w-full bg-black text-white py-4 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black/90 transition-all flex items-center justify-center gap-2">
                  Checkout <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={clearCart} className="w-full text-[10px] text-black/30 font-semibold uppercase tracking-wider hover:text-red-500 transition-colors py-1">
                  Clear Bag
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
