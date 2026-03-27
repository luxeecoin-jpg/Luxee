import React, { Suspense } from 'react';
import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import * as motion from 'framer-motion/client';
import { Header } from '@/components/Header';
import { 
  Package, 
  ChevronRight, 
  Calendar, 
  CreditCard, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ShoppingBag,
  ArrowLeft
} from 'lucide-react';
import { Footer } from '@/components/Footer';
import { redirect } from 'next/navigation';
import Link from 'next/link';

// --- Streamed async component for order list ---
async function OrderList({ userId }: { userId: string }) {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

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

  if (orders.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-black/5 rounded-[2.5rem] p-16 text-center shadow-sm"
      >
        <div className="w-20 h-20 bg-black/[0.02] rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="w-8 h-8 text-black/10" />
        </div>
        <h2 className="text-xl font-black uppercase tracking-tight mb-2">No Orders Yet</h2>
        <p className="text-sm text-black/40 mb-8 uppercase tracking-widest font-bold">Your collection is waiting for its first addition.</p>
        <Link 
          href="/shop" 
          className="inline-block bg-black text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10"
        >
          Explore Shop
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order: any, idx: number) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
        >
          <Link 
            href={`/orders/${order.id}`}
            className="group block bg-white border border-black/5 rounded-[2rem] p-6 hover:border-black/20 transition-all hover:shadow-xl hover:shadow-black/[0.02]"
          >
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-[#fcfcfc] border border-black/[0.03] rounded-2xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                  <Package className="w-6 h-6 opacity-40 group-hover:opacity-100" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-black uppercase tracking-tight">Order #{order.id.slice(-8).toUpperCase()}</span>
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-black/40">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">
                        {order.createdAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CreditCard className="w-3 h-3" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">₹{order.totalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:flex -space-x-3">
                  {order.items.slice(0, 3).map((item: any, i: number) => (
                    <img 
                      key={i}
                      src={item.image} 
                      alt="" 
                      className="w-10 h-10 rounded-xl border-2 border-white bg-white object-contain p-1.5 shadow-sm"
                    />
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-10 h-10 rounded-xl border-2 border-white bg-black text-white flex items-center justify-center text-[8px] font-black shadow-sm">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-black/10 group-hover:text-black group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

// --- Skeleton fallback for order list ---
function OrderListSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-black/5 rounded-[2rem] p-6 h-[100px] skeleton-shimmer shadow-sm" />
      ))}
    </div>
  );
}

export default async function OrdersPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/login?redirect=/orders');
  }

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Header />
      
      <div className="container mx-auto px-4 py-32 max-w-4xl">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black text-black uppercase tracking-tighter mb-2">My Orders</h1>
            <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em]">Track and manage your premium purchases</p>
          </div>
          <Package className="w-12 h-12 text-black/5" />
        </div>

        <Suspense fallback={<OrderListSkeleton />}>
          <OrderList userId={user.id} />
        </Suspense>
      </div>
    </main>
  );
}

