"use client";

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Plus, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ_SECTIONS = [
  {
    title: "Orders & Shipping",
    faqs: [
      { q: "How long does delivery take?", a: "Standard delivery takes 5-7 business days across India. In case of any emergency or unforeseen situations, the order might be slightly delayed." },
      { q: "Do you offer free shipping?", a: "No, we don't give free shipping." },
      { q: "Do you ship internationally?", a: "Currently, we ship only within India. We're working on expanding to international markets soon." },
    ]
  },
  {
    title: "Products & Quality",
    faqs: [
      { q: "Are your perfumes authentic?", a: "Yes, all Luxee products are 100% authentic with a genuine quality guarantee. We source our ingredients from premium suppliers worldwide." },
      { q: "How long do the fragrances last?", a: "Our Eau de Parfum formulations are designed for all-day longevity, typically lasting 8-12 hours depending on skin type and environmental conditions." },
      { q: "Are your products cruelty-free?", a: "Yes, all Luxee products are cruelty-free and never tested on animals. We are committed to ethical production practices." },
    ]
  },
  {
    title: "Returns & Refunds",
    faqs: [
      { q: "What is your return policy?", a: "We accept returns within 7 days of delivery. Products must be unused and in their original packaging. Refunds are processed within 5-7 business days." },
      { q: "Can I exchange a product?", a: "No, you cannot exchange the product." },
    ]
  },
  {
    title: "Account & Payments",
    faqs: [
      { q: "What payment methods do you accept?", a: "We only accept cash on delivery and UPI." },
      { q: "Is my payment information secure?", a: "Yes, all payments are processed through secure, encrypted gateways. We never store your card details on our servers." },
      { q: "Do I need an account to shop?", a: "While you can browse without an account, creating one allows you to track orders, save favorites, and access exclusive member-only deals." },
    ]
  },
];

const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-black/[0.05] last:border-none">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full py-5 flex items-start justify-between text-left gap-4">
        <span className="text-sm font-semibold text-[#1a1a1a]">{q}</span>
        <Plus className={`w-4 h-4 text-black/30 flex-shrink-0 mt-0.5 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <p className="pb-5 text-sm text-black/40 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 md:px-12 pt-28 md:pt-36 pb-16 max-w-4xl">
        <div className="text-center mb-14">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600 block mb-3">Help Center</span>
          <h1 className="text-3xl md:text-5xl font-serif text-[#1a1a1a] tracking-tight mb-4">Frequently Asked Questions</h1>
          <p className="text-sm text-black/40 max-w-md mx-auto">
            Everything you need to know about Luxee products, orders, and policies.
          </p>
        </div>

        <div className="space-y-8">
          {FAQ_SECTIONS.map((section, i) => (
            <div key={i} className="bg-[#fafafa] rounded-2xl p-6 md:p-8 border border-black/[0.03]">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-600 mb-4">{section.title}</h2>
              <div>
                {section.faqs.map((faq, j) => (
                  <FaqItem key={j} q={faq.q} a={faq.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="text-center mt-12 p-8 bg-black rounded-2xl text-white">
          <HelpCircle className="w-8 h-8 mx-auto mb-4 text-white/40" />
          <h3 className="text-lg font-serif mb-2">Still have questions?</h3>
          <p className="text-sm text-white/40 mb-6">Our support team is always happy to help.</p>
          <a href="/contact" className="inline-block bg-white text-black px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-white/90 transition-colors">
            Contact Support
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}
