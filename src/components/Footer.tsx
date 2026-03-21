"use client";

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Youtube, ArrowRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full bg-[#111] text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <h3 className="font-serif text-2xl font-bold tracking-[0.3em] mb-6">LUXEE</h3>
            <p className="text-sm text-white/40 leading-relaxed mb-8 max-w-xs">
              Crafting premium fragrances that define elegance. Every scent tells a story of luxury and sophistication.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all">
                  <Icon className="w-4 h-4 text-white/50" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: "Shop All", href: "/shop" },
                { label: "Bestsellers", href: "/shop?section=BESTSELLERS" },
                { label: "New Arrivals", href: "/shop?section=NEW ARRIVALS" },
                { label: "Crazy Deals", href: "/deals" },
                { label: "For Him", href: "/shop?category=HIM" },
                { label: "For Her", href: "/shop?category=HER" },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/40 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 mb-6">Customer Service</h4>
            <ul className="space-y-3">
              {[
                { label: "About Us", href: "/about" },
                { label: "Contact Us", href: "/contact" },
                { label: "FAQ", href: "/faq" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "My Account", href: "/account" },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/40 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 mb-6">Stay Updated</h4>
            <p className="text-sm text-white/30 mb-6">Subscribe for exclusive deals, new launches, and fragrance tips.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="your@email.com" 
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-colors"
              />
              <button className="bg-white text-black px-4 py-3 rounded-xl hover:bg-white/90 transition-colors flex-shrink-0">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-white/30">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-white/30">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">hello@luxee.in</span>
              </div>
              <div className="flex items-center gap-3 text-white/30">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">Mumbai, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/[0.06]">
        <div className="container mx-auto px-4 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-white/20 tracking-widest">© 2025 LUXEE. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-[11px] text-white/20 hover:text-white/50 tracking-widest transition-colors">PRIVACY</Link>
            <Link href="/terms" className="text-[11px] text-white/20 hover:text-white/50 tracking-widest transition-colors">TERMS</Link>
            <Link href="/faq" className="text-[11px] text-white/20 hover:text-white/50 tracking-widest transition-colors">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
