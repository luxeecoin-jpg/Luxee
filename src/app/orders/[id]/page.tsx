import React from 'react';
import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import * as motion from 'framer-motion/client';
import { Header } from '@/components/Header';
import { 
  Package, 
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

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
}

interface ShippingAddress {
  street: string;
  apartment: string;
  city: string;
  state: string;
  pincode: string;
}

const statusSteps = [
  { id: 'placed', label: 'Order Placed', icon: ShoppingBag },
  { id: 'processing', label: 'Processing', icon: Clock },
  { id: 'shipped', label: 'Shipped', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const user = await currentUser();

  if (!user) {
    redirect('/login?redirect=/orders/' + id);
  }

  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order || order.userId !== user.id) {
    redirect('/orders');
  }

  const items = order.items as unknown as OrderItem[];
  const shippingAddress = order.shippingAddress as unknown as ShippingAddress || {
    street: 'Not specified',
    apartment: '',
    city: '',
    state: '',
    pincode: ''
  };

  const currentStatusIndex = statusSteps.findIndex(s => s.id === order.status.toLowerCase());

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Header />
      
      <div className="container mx-auto px-4 py-32 max-w-5xl">
        <Link 
          href="/orders" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors mb-12"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Orders
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header & Status Tracker */}
            <div className="bg-white border border-black/5 rounded-[2.5rem] p-10 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
                <div>
                  <h1 className="text-3xl font-black text-black uppercase tracking-tighter mb-2">Order Summary</h1>
                  <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em]">Order #{order.id.slice(-8).toUpperCase()}</p>
                </div>
                <div className="bg-black text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                  {order.status}
                </div>
              </div>

              {/* Status Tracker UI */}
              <div className="relative pt-10">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/5 -translate-y-[20px]" />
                <div 
                  className="absolute top-1/2 left-0 h-[1.5px] bg-black -translate-y-[20px] transition-all duration-1000" 
                  style={{ width: `${(Math.max(0, currentStatusIndex) / (statusSteps.length - 1)) * 100}%` }}
                />
                
                <div className="relative flex justify-between">
                  {statusSteps.map((step, idx) => {
                    const isCompleted = idx <= currentStatusIndex;
                    const isCurrent = idx === currentStatusIndex;
                    const Icon = step.icon;

                    return (
                      <div key={step.id} className="flex flex-col items-center gap-3 relative z-10 w-1/4">
                        <div 
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                            isCompleted ? 'bg-black text-white' : 'bg-[#fafafa] text-black/20'
                          } ${isCurrent ? 'ring-8 ring-black/5 scale-110' : ''}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest text-center ${
                          isCompleted ? 'text-black' : 'text-black/20'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white border border-black/5 rounded-[2.5rem] p-10 shadow-sm">
              <h2 className="text-xl font-black uppercase tracking-tighter mb-8">Items Ordered</h2>
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <div 
                    key={`${item.id}-${idx}`} 
                    className="flex items-center gap-6 p-6 bg-[#fcfcfc] rounded-3xl border border-black/[0.03] hover:border-black/10 transition-colors"
                  >
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-3 border border-black/[0.03]">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xs font-black uppercase tracking-tight mb-1">{item.name}</h3>
                      <p className="text-[9px] font-black text-black/40 uppercase tracking-widest leading-loose">
                        Size: {item.size} · Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black">₹{item.price * item.quantity}</p>
                      <p className="text-[9px] font-bold text-black/20 uppercase tracking-widest mt-1">₹{item.price} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Delivery Details */}
            <div className="bg-white border border-black/5 rounded-[2.5rem] p-10 shadow-sm">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-black/40 mb-8 border-b border-black/5 pb-4">Delivery Details</h3>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-black/[0.02] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-black/30" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-2">Shipping Address</h4>
                    <p className="text-[11px] font-bold text-black leading-relaxed">
                      {user.firstName} {user.lastName}<br />
                      {shippingAddress.apartment}, {shippingAddress.street}<br />
                      {shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-black/[0.02] flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-black/30" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-2">Order Date</h4>
                    <p className="text-[11px] font-bold text-black">
                      {order.createdAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-black/[0.02] flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-4 h-4 text-black/30" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-2">Payment Info</h4>
                    <p className="text-[11px] font-bold text-black uppercase tracking-widest">
                       {order.totalPrice > 0 ? 'Verified' : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-black text-white rounded-[2.5rem] p-10 shadow-xl shadow-black/20">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-8 border-b border-white/10 pb-4">Total Amount</h3>
              
              <div className="space-y-4 mb-10">
                <div className="flex justify-between text-[11px] font-bold text-white/60 tracking-widest uppercase">
                  <span>Subtotal</span>
                  <span>₹{order.totalPrice}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-white/60 tracking-widest uppercase">
                  <span>Shipping</span>
                  <span className="text-green-400">FREE</span>
                </div>
                <div className="pt-6 border-t border-white/10 flex justify-between items-baseline">
                  <span className="text-xs font-black uppercase tracking-widest">Total</span>
                  <span className="text-3xl font-black">₹{order.totalPrice}</span>
                </div>
              </div>

              <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/80 leading-relaxed">
                    Premium Fragrance Guarantee Included
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
