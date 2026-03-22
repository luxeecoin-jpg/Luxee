"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, Send } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp, where } from 'firebase/firestore';

interface Review {
  id: string;
  name: string;
  text: string;
  rating: number;
  createdAt: any;
  productId?: string;
}

export const Testimonials = ({ productId }: { productId?: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [current, setCurrent] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', text: '', rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hasOrdered, setHasOrdered] = useState(false);

  useEffect(() => {
    if (productId && typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('completedOrders') || '[]');
      if (existing.includes(productId)) {
        setHasOrdered(true);
      }
    } else if (!productId) {
      setHasOrdered(true); // Allow general reviews if not on product page
    }
  }, [productId]);

  // Load reviews from Firestore
  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      let r = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Review[];
      if (productId) {
        r = r.filter(rev => rev.productId === productId);
      }
      setReviews(r);
    });
    return () => unsub();
  }, []);

  // Auto-rotate
  useEffect(() => {
    if (reviews.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.text.trim()) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        name: formData.name.trim(),
        text: formData.text.trim(),
        rating: formData.rating,
        createdAt: Timestamp.now(),
        productId: productId || 'general'
      });
      setSubmitted(true);
      setFormData({ name: '', text: '', rating: 5 });
      setTimeout(() => { setSubmitted(false); setShowForm(false); }, 2000);
    } catch (err) {
      console.error('Error submitting review:', err);
    }
    setSubmitting(false);
  };

  return (
    <section className="w-full py-16 md:py-28 bg-[#fafafa]">
      <div className="container mx-auto px-4 md:px-12">
        <div className="text-center mb-14">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600 block mb-3">Testimonials</span>
          <h2 className="text-3xl md:text-5xl font-serif text-[#1a1a1a] tracking-tight">
            What Our Customers Say
          </h2>
        </div>

        {reviews.length > 0 && (
          <div className="max-w-3xl mx-auto relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-gold-50 rounded-full flex items-center justify-center z-10">
              <Quote className="w-5 h-5 text-gold-400" />
            </div>

            <div className="bg-white rounded-3xl border border-black/[0.04] p-8 md:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.03)] relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="text-center"
                >
                  <div className="flex justify-center gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`w-4 h-4 ${s <= reviews[current].rating ? 'fill-gold-400 text-gold-400' : 'fill-black/5 text-black/5'}`} />
                    ))}
                  </div>
                  <p className="text-base md:text-lg text-[#2d3436]/70 leading-relaxed max-w-xl mx-auto mb-8 font-medium italic">
                    &ldquo;{reviews[current].text}&rdquo;
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold-50 flex items-center justify-center text-gold-600 font-bold text-sm">
                      {reviews[current].name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-bold text-[#1a1a1a]">{reviews[current].name}</span>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-center gap-2 mt-8">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-gold-400' : 'bg-black/10'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {reviews.length === 0 && (
          <div className="max-w-3xl mx-auto text-center py-12">
            <p className="text-sm text-black/25">No reviews yet. Be the first to share your experience!</p>
          </div>
        )}

        {/* Review Button & Form */}
        <div className="max-w-lg mx-auto mt-10">
          {!showForm ? (
            <div className="text-center">
              {productId && !hasOrdered ? (
                <p className="text-sm font-semibold text-red-500 bg-red-50 py-3 px-6 rounded-xl border border-red-100 inline-block">
                  Only verified buyers can review this product. Checkout from the cart to unlock reviews!
                </p>
              ) : (
                <button onClick={() => setShowForm(true)} className="bg-black text-white px-8 py-4 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black/90 transition-all">
                  Write a Review
                </button>
              )}
            </div>
          ) : submitted ? (
            <div className="bg-white rounded-2xl border border-black/[0.04] p-8 text-center">
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-sm font-bold text-[#1a1a1a] mb-1">Thank you!</p>
              <p className="text-[11px] text-black/30">Your review has been submitted.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-black/[0.04] p-6 md:p-8 space-y-5">
              <h3 className="text-base font-bold text-[#1a1a1a] text-center">Share Your Experience</h3>
              
              {/* Rating */}
              <div className="text-center">
                <label className="text-[10px] font-semibold text-black/40 uppercase tracking-wider block mb-2">Rating</label>
                <div className="flex justify-center gap-1.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button type="button" key={s} onClick={() => setFormData({...formData, rating: s})} className="p-1">
                      <Star className={`w-6 h-6 transition-colors ${s <= formData.rating ? 'fill-gold-400 text-gold-400' : 'fill-black/5 text-black/10'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-black/40 uppercase tracking-wider block mb-1.5">Your Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#fafafa] border border-black/[0.06] rounded-xl px-4 py-3 text-sm outline-none focus:border-black/15 transition-colors" placeholder="Enter your name" required />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-black/40 uppercase tracking-wider block mb-1.5">Your Review</label>
                <textarea value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} rows={3} className="w-full bg-[#fafafa] border border-black/[0.06] rounded-xl px-4 py-3 text-sm outline-none focus:border-black/15 transition-colors resize-none" placeholder="Tell us about your experience..." required />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-black/10 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-black/[0.02] transition-colors">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 bg-black text-white py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-black/90 transition-all disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
