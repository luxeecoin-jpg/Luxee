import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function PrivacyPage() {
  const sections = [
    { title: "1. Information We Collect", content: "We collect personal information you voluntarily provide when you register, make a purchase, subscribe to our newsletter, or contact us. This includes your name, email, phone number, shipping address, and payment information." },
    { title: "2. How We Use Your Information", content: "We use information to process orders, manage accounts, send order confirmations and shipping updates, provide customer support, send promotional communications (with consent), improve our website, and comply with legal obligations." },
    { title: "3. Information Sharing", content: "We do not sell or transfer your information to outside parties, except trusted third parties who assist in operating our store, processing payments, and delivering orders." },
    { title: "4. Data Security", content: "We implement security measures to protect your personal information. All payment transactions are processed through secure, encrypted gateways with SSL encryption." },
    { title: "5. Your Rights", content: "You have the right to access, correct, or delete your personal information at any time. Contact us at hello@luxee.in." },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 md:px-12 pt-28 md:pt-36 pb-16 max-w-3xl">
        <div className="text-center mb-12">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600 block mb-3">Legal</span>
          <h1 className="text-3xl md:text-5xl font-serif text-[#1a1a1a] tracking-tight">Privacy Policy</h1>
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
