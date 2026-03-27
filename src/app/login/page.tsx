"use client";

import React, { Suspense } from 'react';
import { Header } from '@/components/Header';
import { SignIn } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function LoginContent() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 flex items-center justify-center pt-28 md:pt-36 pb-16 min-h-[calc(100vh-80px)]">
        <SignIn 
          fallbackRedirectUrl={redirect}
          routing="hash"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-2xl shadow-black/[0.02] border border-black/5 rounded-[2rem]",
            }
          }}
        />
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black/20" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
