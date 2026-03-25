"use client";

import React from 'react';
import Link from 'next/link';
import { Mail, Instagram, ArrowRight } from 'lucide-react';

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
              {[Instagram].map((Icon, i) => (
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
                { label: "Refund Policy", href: "/refund-policy" },
                { label: "Shipping Policy", href: "/shipping-policy" },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/40 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service & Contact Info */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 mb-6">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-white/30">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">luxee.co.in@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/[0.06]">
        <div className="container mx-auto px-4 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-white/20 tracking-widest">© 2026 LUXEE. All rights reserved.</p>
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
