"use client";

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 md:px-12 pt-28 md:pt-36 pb-16">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600 block mb-3">Get in Touch</span>
          <h1 className="text-3xl md:text-5xl font-serif text-[#1a1a1a] tracking-tight mb-4">Contact Us</h1>
          <p className="text-sm text-black/40">
            Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-4">
            {[
              { icon: Mail, title: "Email Us", info: "hello@luxee.in", sub: "We reply within 24 hours" },
              { icon: Phone, title: "Call Us", info: "+91 98765 43210", sub: "Mon-Sat, 10am-6pm IST" },
              { icon: MapPin, title: "Visit Us", info: "Mumbai, Maharashtra", sub: "India" },
              { icon: Clock, title: "Business Hours", info: "Mon - Sat: 10am - 6pm", sub: "Sunday: Closed" },
            ].map(({ icon: Icon, title, info, sub }, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-[#fafafa] border border-black/[0.03]">
                <div className="w-10 h-10 bg-gold-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-gold-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1a1a1a] mb-0.5">{title}</h3>
                  <p className="text-sm text-black/60 font-medium">{info}</p>
                  <p className="text-[11px] text-black/25">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-[#fafafa] rounded-2xl p-6 md:p-10 border border-black/[0.03]">
            {submitted ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="text-xl font-serif text-[#1a1a1a] mb-2">Message Sent!</h3>
                <p className="text-sm text-black/40">Thank you for reaching out. We&apos;ll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-semibold text-black/40 uppercase tracking-[0.15em] block mb-2">Your Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white border border-black/[0.06] rounded-xl px-4 py-3.5 text-sm outline-none focus:border-black/15 transition-colors"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-black/40 uppercase tracking-[0.15em] block mb-2">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-white border border-black/[0.06] rounded-xl px-4 py-3.5 text-sm outline-none focus:border-black/15 transition-colors"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-black/40 uppercase tracking-[0.15em] block mb-2">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-white border border-black/[0.06] rounded-xl px-4 py-3.5 text-sm outline-none focus:border-black/15 transition-colors"
                    placeholder="How can we help?"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-black/40 uppercase tracking-[0.15em] block mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    rows={5}
                    className="w-full bg-white border border-black/[0.06] rounded-xl px-4 py-3.5 text-sm outline-none focus:border-black/15 transition-colors resize-none"
                    placeholder="Write your message..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-4 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black/90 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
