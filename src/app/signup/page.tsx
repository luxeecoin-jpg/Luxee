"use client";

import React, { useState } from 'react';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Mail, Lock, User, Loader2, Chrome } from 'lucide-react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || "Google Sign-In failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 flex items-center justify-center min-h-[calc(100vh-80px)] py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full p-8 border border-black/5 rounded-[2rem] bg-[#fcfcfc] shadow-2xl shadow-black/[0.02]"
        >
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-[#2d3436] uppercase tracking-tighter mb-2">Create Account</h1>
            <p className="text-xs font-bold text-black/40 uppercase tracking-widest">Join our premium store</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-black/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-black/10 transition-all font-bold"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

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
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign Up"}
            </button>
          </form>

          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/5"></div></div>
            <span className="relative bg-[#fcfcfc] px-4 text-[9px] font-black uppercase tracking-widest text-black/20">or continue with</span>
          </div>

          <button 
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full bg-white border border-black/10 text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transform active:scale-[0.98] transition-all hover:bg-black/[0.02] flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <Chrome className="w-4 h-4" />
            Google
          </button>

          <div className="mt-8 text-center bg-black/5 py-4 rounded-2xl">
            <p className="text-[10px] font-black text-black/40 uppercase tracking-widest">
              Already have an account? {' '}
              <Link href="/login" className="text-black hover:underline ml-1">Log In</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
