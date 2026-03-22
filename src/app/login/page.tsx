"use client";

import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { Mail, Lock, Loader2, Phone, ShieldCheck, Chrome } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (loginMethod === 'phone' && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
  }, [loginMethod]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
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

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);
    setError('');
    try {
      const appVerifier = window.recaptchaVerifier;
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(result);
      setShowOtp(true);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !confirmationResult) return;
    setLoading(true);
    setError('');
    try {
      await confirmationResult.confirm(otp);
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
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

          <div className="flex bg-black/[0.03] p-1 rounded-2xl mb-8">
            <button 
              onClick={() => { setLoginMethod('email'); setError(''); }}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${loginMethod === 'email' ? 'bg-white shadow-sm text-black' : 'text-black/30'}`}
            >
              Email
            </button>
            <button 
              onClick={() => { setLoginMethod('phone'); setError(''); }}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${loginMethod === 'phone' ? 'bg-white shadow-sm text-black' : 'text-black/30'}`}
            >
              Phone
            </button>
          </div>

          <form onSubmit={loginMethod === 'email' ? handleLogin : (showOtp ? handleVerifyOtp : handleSendOtp)} className="space-y-6">
            <AnimatePresence mode="wait">
              {loginMethod === 'email' ? (
                <motion.div
                  key="email-fields"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
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
                </motion.div>
              ) : (
                <motion.div
                  key="phone-fields"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  {!showOtp ? (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                        <input 
                          type="tel" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-white border border-black/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-black/10 transition-all font-bold"
                          placeholder="+91 99999 99999"
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Enter OTP</label>
                      <div className="relative">
                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                        <input 
                          type="text" 
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="w-full bg-white border border-black/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-black/10 transition-all font-bold"
                          placeholder="6-digit code"
                          required
                        />
                      </div>
                      <button type="button" onClick={() => setShowOtp(false)} className="text-[9px] font-bold text-black/30 hover:text-black mt-2 ml-4 flex items-center gap-1 uppercase tracking-widest">
                        Change Number
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div id="recaptcha-container"></div>

            {error && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest text-center">{error}</p>}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transform active:scale-[0.98] transition-all hover:bg-black/90 shadow-xl shadow-black/10 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (loginMethod === 'phone' && !showOtp ? "Send OTP" : "Sign In")}
            </button>
          </form>

          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/5"></div></div>
            <span className="relative bg-[#fcfcfc] px-4 text-[9px] font-black uppercase tracking-widest text-black/20">or continue with</span>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white border border-black/10 text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transform active:scale-[0.98] transition-all hover:bg-black/[0.02] flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <Chrome className="w-4 h-4" />
            Google
          </button>

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
