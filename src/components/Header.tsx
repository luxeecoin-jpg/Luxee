"use client";

import React, { useState } from 'react';
import { ShoppingCart, Search, Menu, User, Zap, X, Heart } from 'lucide-react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const { totalItems, setIsCartOpen } = useCart();
  const router = useRouter();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/shop?note=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-xl text-black font-sans uppercase tracking-[0.1em] text-xs transition-all duration-300 border-b border-black/[0.04] shadow-[0_1px_20px_rgba(0,0,0,0.03)]">

      {/* Main Navigation */}
      <div className="container mx-auto px-4 md:px-8 py-4 md:py-5 flex items-center justify-between">
        
        {/* Left - Menu & Search */}
        <div className="flex items-center gap-4 flex-1">
          <button 
            className="md:hidden p-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <form onSubmit={handleSearch} className="hidden md:flex items-center border-b border-black/10 pb-1 w-48 focus-within:border-black/40 transition-colors">
            <Search className="w-4 h-4 mr-2 text-black/30" />
            <input 
              type="text" 
              placeholder="SEARCH..." 
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              className="bg-transparent border-none outline-none text-[10px] w-full placeholder:text-black/25 font-semibold tracking-widest"
            />
          </form>
        </div>

        {/* Center - Brand */}
        <Link href="/" className="text-2xl md:text-3xl font-black tracking-[0.3em] flex-shrink-0 cursor-pointer text-center group font-serif">
          LUXEE
        </Link>

        {/* Right - Icons */}
        <div className="flex items-center gap-3 md:gap-5 flex-1 justify-end">
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/account" className="flex items-center gap-2 hover:text-gold-600 transition-colors">
                <span className="text-[9px] font-black hidden lg:inline-block tracking-widest">Hi, {user.displayName || 'User'}</span>
                <div className="w-8 h-8 rounded-full bg-black/[0.04] flex items-center justify-center hover:bg-black/[0.08] transition-colors">
                  <User className="w-4 h-4" />
                </div>
              </Link>
              <button 
                onClick={() => signOut(auth)}
                className="text-[9px] font-black uppercase tracking-widest text-black/40 hover:text-red-500 transition-colors border-l border-black/10 pl-4"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="w-8 h-8 rounded-full bg-black/[0.04] flex items-center justify-center hover:bg-black/[0.08] transition-colors">
              <User className="w-4 h-4" />
            </Link>
          )}

          <button onClick={() => setIsCartOpen(true)} className="relative cursor-pointer w-8 h-8 rounded-full bg-black/[0.04] flex items-center justify-center hover:bg-black/[0.08] transition-colors">
            <ShoppingCart className="w-4 h-4" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Desktop Categories */}
      <nav className="hidden md:block border-t border-black/[0.04]">
        <div className="container mx-auto px-6 py-2.5">
          <ul className="flex items-center justify-center gap-8 lg:gap-12 text-[10px] font-semibold text-black/50 tracking-[0.15em]">
            <li><Link href="/shop" className="hover:text-black transition-colors">SHOP ALL</Link></li>
            <li><Link href="/shop?section=BESTSELLERS" className="hover:text-black transition-colors">BESTSELLERS</Link></li>
            <li><Link href="/shop?category=HIM" className="hover:text-black transition-colors">FOR HIM</Link></li>
            <li><Link href="/shop?category=HER" className="hover:text-black transition-colors">FOR HER</Link></li>
            <li><Link href="/shop?category=GIFTING" className="hover:text-black transition-colors">GIFTING</Link></li>
            <li><Link href="/about" className="hover:text-black transition-colors">ABOUT</Link></li>
            <li><Link href="/contact" className="hover:text-black transition-colors">CONTACT</Link></li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-black/10 transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-[80vh] py-4 opacity-100' : 'max-h-0 opacity-0'}`}>
         <div className="px-4 pb-4 border-b border-black/5 mb-4">
            <form onSubmit={handleSearch} className="flex items-center border border-black/10 rounded-xl p-3">
                <Search className="w-4 h-4 mr-2 text-black/30" />
                <input 
                  type="text" 
                  placeholder="SEARCH..." 
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  className="bg-transparent border-none outline-none text-[10px] w-full placeholder:text-black/25 font-semibold tracking-widest"
                />
            </form>
         </div>
         <ul className="flex flex-col px-4 gap-1">
            {[
              { href: "/shop", label: "SHOP ALL" },
              { href: "/shop?section=BESTSELLERS", label: "BESTSELLERS" },
              { href: "/shop?category=HIM", label: "FOR HIM" },
              { href: "/shop?category=HER", label: "FOR HER" },
              { href: "/shop?category=GIFTING", label: "GIFTING" },
              { href: "/about", label: "ABOUT US" },
              { href: "/contact", label: "CONTACT" },
            ].map((item: any) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-3 px-4 rounded-xl text-xs font-bold tracking-widest transition-colors ${item.highlight ? 'text-red-500 bg-red-50' : 'text-black/60 hover:text-black hover:bg-black/[0.02]'}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
         </ul>
      </div>
    </header>
  );
};