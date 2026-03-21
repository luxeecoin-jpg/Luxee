import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function TermsPage() {
  const sections = [
    { title: "1. Acceptance of Terms", content: "By accessing and using the Luxee website, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services." },
    { title: "2. Products & Pricing", content: "All product descriptions and pricing are subject to change without notice. We strive to display accurate information, but errors may occur. We reserve the right to correct any errors and cancel orders if necessary." },
    { title: "3. Orders & Payment", content: "When you place an order, you agree to provide accurate and complete information. We reserve the right to refuse or cancel any order. Payment must be made at the time of purchase through our accepted payment methods." },
    { title: "4. Shipping & Delivery", content: "We aim to deliver all orders within the estimated timeframe. Delivery times are estimates and not guaranteed. We are not responsible for delays caused by shipping carriers or customs." },
    { title: "5. Returns & Refunds", content: "Products may be returned within 7 days of delivery if unused and in original packaging. Refunds will be processed within 5-7 business days of receiving the returned item." },
    { title: "6. Intellectual Property", content: "All content on the Luxee website, including images, logos, text, and design, is the property of Luxee and protected by intellectual property laws. Unauthorized use is prohibited." },
    { title: "7. Limitation of Liability", content: "Luxee shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services. Our total liability shall not exceed the purchase price of the product." },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 md:px-12 pt-28 md:pt-36 pb-16 max-w-3xl">
        <div className="text-center mb-12">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600 block mb-3">Legal</span>
          <h1 className="text-3xl md:text-5xl font-serif text-[#1a1a1a] tracking-tight">Terms of Service</h1>
          <p className="text-[11px] text-black/30 mt-3 uppercase tracking-wider">Last updated: March 2025</p>
        </div>
        <div className="space-y-6">
          {sections.map((s, i) => (
            <div key={i} className="bg-[#fafafa] rounded-xl p-6 border border-black/[0.03]">
              <h2 className="text-sm font-bold text-[#1a1a1a] mb-3">{s.title}</h2>
              <p className="text-sm text-black/40 leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
