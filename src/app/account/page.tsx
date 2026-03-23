"use client";

import React, { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserIcon, Package, Clock, ShieldCheck, LogOut, ChevronRight, AlertCircle, ShoppingBag, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Order {
  id: string;
  createdAt: any;
  status: string;
  totalPrice: number;
  items: any[];
}

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [indexError, setIndexError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const q = query(
            collection(db, 'orders'),
            where('userId', '==', currentUser.uid),
            orderBy('createdAt', 'desc')
          );
          const querySnapshot = await getDocs(q);
          const ordersData: Order[] = [];
          querySnapshot.forEach((doc) => {
            ordersData.push({ id: doc.id, ...doc.data() } as Order);
          });
          setOrders(ordersData);
          setIndexError(false);
        } catch (error: any) {
          console.error("Error fetching orders:", error);
          if (error.message && error.message.includes("requires an index")) {
            setIndexError(true);
          }
        }
      } else {
        router.push('/login?redirect=/account');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'placed': return 'text-blue-600 bg-blue-50';
      case 'processing': return 'text-amber-600 bg-amber-50';
      case 'shipped': return 'text-purple-600 bg-purple-50';
      case 'delivered': return 'text-green-600 bg-green-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-black/40 bg-black/5';
    }
  };

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
              className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-2xl shadow-black/[0.02] text-center sticky top-24"
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
                    className="w-full bg-red-500 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
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

          {/* Right Content */}
          <div className="lg:col-span-2 space-y-8">
            {indexError && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-amber-50 border border-amber-200 p-6 rounded-[2rem] flex items-start gap-4"
              >
                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-amber-900 font-black uppercase tracking-tighter text-sm mb-1">Action Required</h3>
                  <p className="text-amber-800/60 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                    Firestore requires a composite index to display your orders. Please check your browser console and click the link to create it.
                  </p>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-black/5 flex items-center gap-4">
                <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center"><Package className="w-5 h-5" /></div>
                <div>
                  <p className="text-[20px] font-black">{orders.length}</p>
                  <p className="text-[9px] font-black uppercase opacity-30 mt-1">Total Orders</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-black/5 flex items-center gap-4">
                <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center"><ShoppingBag className="w-5 h-5" /></div>
                <div>
                  <p className="text-[20px] font-black">{orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length}</p>
                  <p className="text-[9px] font-black uppercase opacity-30 mt-1">Active</p>
                </div>
              </div>
            </div>

            <section>
              <div className="flex items-center justify-between mb-8 px-2">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] opacity-40">Order History</h2>
                <Link href="/orders" className="text-[9px] font-black border-b border-black uppercase tracking-widest hover:opacity-60 transition-opacity">View All</Link>
              </div>

              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="bg-white/40 p-16 rounded-[2.5rem] border border-dashed border-black/10 text-center">
                    <Package className="w-12 h-12 text-black/5 mx-auto mb-4" />
                    <p className="text-[10px] font-black uppercase opacity-30 tracking-[0.2em]">No order history found</p>
                  </div>
                ) : (
                  orders.slice(0, 5).map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Link 
                        href={`/orders/${order.id}`}
                        className="bg-white p-6 rounded-[2rem] border border-black/5 group hover:border-black/20 transition-all flex items-center justify-between shadow-sm hover:shadow-xl hover:shadow-black/[0.02]"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#fcfcfc] rounded-2xl flex items-center justify-center border border-black/[0.03] group-hover:bg-black group-hover:text-white transition-colors">
                            <Package className="w-5 h-5 opacity-40 group-hover:opacity-100" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-xs font-black uppercase tracking-tight">Order #{order.id.slice(-8).toUpperCase()}</p>
                              <span className={`text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-[9px] font-bold opacity-30 uppercase tracking-widest">
                              {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('en-IN') : 'Just now'} · ₹{order.totalPrice}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-black/10 group-hover:text-black group-hover:translate-x-1 transition-all" />
                      </Link>
                    </motion.div>
                  ))
                )}
                
                {orders.length > 5 && (
                  <Link 
                    href="/orders" 
                    className="flex items-center justify-center py-4 text-[9px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors"
                  >
                    And {orders.length - 5} more orders...
                  </Link>
                )}
              </div>
            </section>

            <section className="bg-black text-white p-10 rounded-[2.5rem] shadow-2xl shadow-black/20 overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-lg font-black uppercase tracking-tighter mb-2">Need Assistance?</h3>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-8 leading-relaxed">
                  Our concierge team is available 24/7 to help with your luxury fragrance experience.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/contact" className="bg-white text-black px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-[1.05] transition-transform">Contact Support</Link>
                  <Link href="/faq" className="bg-white/10 text-white px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/20 transition-colors">View FAQ</Link>
                </div>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Clock className="w-32 h-32" />
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
