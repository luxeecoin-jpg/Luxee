"use client";

import React, { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { User as UserIcon, Package, Clock, ShieldCheck, LogOut, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black uppercase text-[10px] tracking-widest">Loading Account...</div>;

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Header />
      
      <div className="container mx-auto px-4 py-32 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: User Card */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-2xl shadow-black/[0.02] text-center"
            >
              <div className="w-24 h-24 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-black uppercase">
                {user?.displayName?.charAt(0) || user?.email?.charAt(0)}
              </div>
              <h1 className="text-xl font-black text-[#2d3436] uppercase tracking-tight mb-1">{user?.displayName || 'Premium User'}</h1>
              <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest">{user?.email}</p>
              
              <div className="mt-8 pt-8 border-t border-black/5 flex flex-col gap-2">
                {user?.email === 'admin@gmail.com' && (
                  <button 
                    onClick={() => router.push('/admin')}
                    className="w-full bg-red-500 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-600 transition-all"
                  >
                    <ShieldCheck className="w-4 h-4" /> Admin Panel
                  </button>
                )}
                <button 
                  onClick={() => auth.signOut()}
                  className="w-full bg-black/5 text-black/60 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black/10 transition-all"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right: History & Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-black/5 flex items-center gap-4">
                <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center"><Package className="w-5 h-5" /></div>
                <div>
                  <p className="text-[20px] font-black">0</p>
                  <p className="text-[9px] font-black uppercase opacity-30 mt-1">Orders</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-black/5 flex items-center gap-4">
                <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center"><Clock className="w-5 h-5" /></div>
                <div>
                  <p className="text-[20px] font-black">1</p>
                  <p className="text-[9px] font-black uppercase opacity-30 mt-1">Months Sub</p>
                </div>
              </div>
            </div>

            <section>
              <h2 className="text-sm font-black uppercase tracking-widest mb-6 opacity-40 ml-2">Recent Activity</h2>
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-3xl border border-black/5 group hover:border-black/20 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#fcfcfc] rounded-xl flex items-center justify-center border border-black/5"><Package className="w-4 h-4 opacity-40" /></div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-tight">Account Created</p>
                      <p className="text-[10px] font-bold opacity-30 mt-0.5 uppercase tracking-widest">Successful registration</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-black opacity-20 uppercase tracking-widest">Just now</span>
                </div>
                
                {/* Placeholder for real history */}
                <div className="bg-white/40 p-12 rounded-[2.5rem] border border-dashed border-black/10 text-center">
                  <p className="text-[10px] font-black uppercase opacity-30 tracking-[0.2em]">No order history found</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
