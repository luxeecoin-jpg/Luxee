"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { MapPin, Phone, User, Package, ChevronRight, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

type CheckoutStep = 'address' | 'summary' | 'success';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>('address');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    email: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u && !authLoading) {
        router.push('/login?redirect=/checkout');
      }
      setUser(u);
      if (u) {
        setAddress(prev => ({ 
          ...prev, 
          email: u.email || '', 
          fullName: u.displayName || '',
          phone: u.phoneNumber || ''
        }));
      }
      setAuthLoading(false);
    });
    return () => unsub();
  }, [authLoading, router]);

  const handleRazorpayPayment = async () => {
    if (!user) return;
    setLoading(true);

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY_HERE",
      amount: totalPrice * 100, // Razorpay expects amount in paise
      currency: "INR",
      name: "LUXEE",
      description: "Premium Fragrance Purchase",
      image: "/logo.png",
      handler: function (response: any) {
        // Payment successful
        handlePlaceOrder(response.razorpay_payment_id);
      },
      prefill: {
        name: address.fullName,
        email: address.email,
        contact: address.phone
      },
      theme: {
        color: "#000000"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    setLoading(false);
  };

  const handlePlaceOrder = async (paymentId?: string) => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Save order to Firestore
      const orderData = {
        userId: user.uid,
        paymentId: paymentId || 'COD',
        customerName: address.fullName,
        customerEmail: address.email,
        customerPhone: address.phone,
        shippingAddress: {
          street: address.street,
          apartment: address.apartment,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        },
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          image: item.image
        })),
        totalPrice,
        status: 'placed',
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'orders'), orderData);

      // 2. Mock: Also update completedOrders in localStorage for the review system
      const purchasedIds = items.map(item => item.id);
      const existing = JSON.parse(localStorage.getItem('completedOrders') || '[]');
      const newOrders = Array.from(new Set([...existing, ...purchasedIds]));
      localStorage.setItem('completedOrders', JSON.stringify(newOrders));

      // 3. Success steps
      setStep('success');
      clearCart();
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black/20" />
      </div>
    );
  }

  if (items.length === 0 && step !== 'success') {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <Package className="w-16 h-16 mx-auto text-black/10 mb-6" />
          <h1 className="text-2xl font-bold mb-2">Your Bag is Empty</h1>
          <p className="text-black/40 mb-8">Add components to your bag before checking out.</p>
          <button onClick={() => router.push('/shop')} className="bg-black text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">
            Start Shopping
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {step !== 'success' && (
          <div className="flex items-center gap-4 mb-12 overflow-x-auto pb-4 no-scrollbar">
            {[
              { id: 'address', label: 'Shipping' },
              { id: 'summary', label: 'Review' },
              { id: 'success', label: 'Done' }
            ].map((s, i) => (
              <React.Fragment key={s.id}>
                <div className={`flex items-center gap-2 whitespace-nowrap ${step === s.id ? 'text-black' : 'text-black/20'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${step === s.id ? 'bg-black text-white' : 'bg-black/5 text-black/40'}`}>
                    {i + 1}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest">{s.label}</span>
                </div>
                {i < 2 && <div className="w-8 h-[1px] bg-black/5" />}
              </React.Fragment>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 'address' && (
            <motion.div 
              key="address"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm">
                  <h2 className="text-xl font-black uppercase tracking-tighter mb-8 bg-black text-white w-fit px-4 py-1 rounded-lg">Shipping Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                        <input 
                          type="text" 
                          value={address.fullName}
                          onChange={e => setAddress({...address, fullName: e.target.value})}
                          className="w-full bg-[#fcfcfc] border border-black/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-black/20 transition-all"
                          placeholder="Your Name"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Phone Number</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                          <Phone className="w-4 h-4 text-black/20" />
                          <span className="text-sm font-bold text-black/40 border-r border-black/5 pr-2">+91</span>
                        </div>
                        <input 
                          type="tel" 
                          value={address.phone}
                          onChange={e => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setAddress({...address, phone: val});
                          }}
                          className="w-full bg-[#fcfcfc] border border-black/5 rounded-2xl py-4 pl-24 pr-4 text-sm font-bold focus:outline-none focus:border-black/20 transition-all"
                          placeholder="99999 99999"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Flat / Plot / Room No</label>
                      <input 
                        type="text" 
                        value={address.apartment}
                        onChange={e => setAddress({...address, apartment: e.target.value})}
                        className="w-full bg-[#fcfcfc] border border-black/5 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-black/20 transition-all"
                        placeholder="e.g., Plot 42, Room 101"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Street Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                        <input 
                          type="text" 
                          value={address.street}
                          onChange={e => setAddress({...address, street: e.target.value})}
                          className="w-full bg-[#fcfcfc] border border-black/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-black/20 transition-all"
                          placeholder="Building, Street Name, Area"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">City</label>
                      <input 
                        type="text" 
                        value={address.city}
                        onChange={e => setAddress({...address, city: e.target.value})}
                        className="w-full bg-[#fcfcfc] border border-black/5 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-black/20 transition-all"
                        placeholder="City"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">State</label>
                      <input 
                        type="text" 
                        value={address.state}
                        onChange={e => setAddress({...address, state: e.target.value})}
                        className="w-full bg-[#fcfcfc] border border-black/5 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-black/20 transition-all"
                        placeholder="State"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Pincode</label>
                      <input 
                        type="text" 
                        value={address.pincode}
                        onChange={e => setAddress({...address, pincode: e.target.value})}
                        className="w-full bg-[#fcfcfc] border border-black/5 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-black/20 transition-all"
                        placeholder="400001"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-[2rem] border border-black/5 sticky top-24">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-black/40 mb-6">Order Summary</h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-black/40 uppercase tracking-widest text-[10px]">Subtotal</span>
                      <span>₹{totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-black/40 uppercase tracking-widest text-[10px]">Shipping</span>
                      <span className="text-green-600">FREE</span>
                    </div>
                    <div className="pt-4 border-t border-black/5 flex justify-between items-baseline">
                      <span className="text-[11px] font-black uppercase tracking-widest">Total</span>
                      <span className="text-2xl font-black">₹{totalPrice}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                        if (address.fullName && address.phone && address.street && address.city && address.pincode && address.apartment && address.state) {
                            setStep('summary');
                        } else {
                            alert("Please fill all shipping details");
                        }
                    }}
                    className="w-full bg-black text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transform active:scale-[0.98] transition-all hover:bg-black/90 shadow-xl shadow-black/10"
                  >
                    Continue to Review
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'summary' && (
            <motion.div 
              key="summary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-8 rounded-[2rem] border border-black/5">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black uppercase tracking-tighter bg-black text-white px-4 py-1 rounded-lg">Review Order</h2>
                    <button onClick={() => setStep('address')} className="text-[9px] font-black border-b border-black uppercase tracking-widest">Edit Shipping</button>
                  </div>

                  <div className="bg-[#fcfcfc] p-6 rounded-2xl border border-black/[0.03] mb-8">
                    <div className="flex items-start gap-4">
                      <MapPin className="w-5 h-5 text-black/20 mt-1" />
                      <div>
                        <p className="text-sm font-bold text-black mb-1">{address.fullName} · {address.phone}</p>
                        <p className="text-[11px] font-medium text-black/40 leading-relaxed uppercase tracking-wider">
                          {address.apartment}, {address.street}, {address.city}, {address.state} {address.pincode}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {items.map(item => (
                      <div key={`${item.id}-${item.size}`} className="flex items-center gap-4 p-4 bg-[#fcfcfc] rounded-2xl border border-black/[0.03]">
                        <img src={item.image} className="w-16 h-16 object-contain bg-white rounded-xl p-2 border border-black/[0.03]" alt={item.name} />
                        <div className="flex-1">
                          <p className="text-xs font-black uppercase tracking-tight">{item.name}</p>
                          <p className="text-[9px] font-bold text-black/30 uppercase tracking-widest mt-0.5">{item.size} × {item.quantity}</p>
                        </div>
                        <p className="text-sm font-black">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-[2rem] border border-black/5 sticky top-24">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-black/40 mb-6">Payment Method</h3>
                  <div className="space-y-3 mb-8">
                    <button 
                        onClick={handleRazorpayPayment}
                        disabled={loading}
                        className="w-full bg-white border border-black text-black py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transform active:scale-[0.98] transition-all hover:bg-black hover:text-white flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Pay Online (Razorpay)"}
                    </button>
                    <button 
                        onClick={() => handlePlaceOrder()}
                        disabled={loading}
                        className="w-full bg-black/5 text-black/40 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transform active:scale-[0.98] transition-all hover:bg-black/10 hover:text-black flex items-center justify-center gap-2"
                    >
                        Cash On Delivery
                    </button>
                  </div>
                  <div className="pt-4 border-t border-black/5 flex justify-between items-baseline">
                    <span className="text-[11px] font-black uppercase tracking-widest">Total to Pay</span>
                    <span className="text-2xl font-black">₹{totalPrice}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto py-12 text-center"
            >
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/20">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-black text-black uppercase tracking-tighter mb-4">Order Placed!</h1>
              <p className="text-sm font-medium text-black/40 mb-12 uppercase tracking-widest leading-loose">
                Thank you for your purchase. Your premium fragrance will be on its way soon.
              </p>
              <button 
                onClick={() => router.push('/')}
                className="w-full bg-black text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transform active:scale-[0.98] transition-all"
              >
                Return Home
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
