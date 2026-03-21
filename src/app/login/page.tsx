"use client";

import React, { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Mail, Lock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full p-8 border border-black/5 rounded-[2rem] bg-[#fcfcfc] shadow-2xl shadow-black/[0.02]"
        >
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-[#2d3436] uppercase tracking-tighter mb-2">Welcome Back</h1>
            <p className="text-xs font-bold text-black/40 uppercase tracking-widest">Login to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-black/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-black/10 transition-all font-bold"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-black/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-black/10 transition-all font-bold"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest text-center">{error}</p>}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transform active:scale-[0.98] transition-all hover:bg-black/90 shadow-xl shadow-black/10 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center bg-black/5 py-4 rounded-2xl">
            <p className="text-[10px] font-black text-black/40 uppercase tracking-widest">
              Don&apos;t have an account? {' '}
              <Link href="/signup" className="text-black hover:underline ml-1">Create One</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
