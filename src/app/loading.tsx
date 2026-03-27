import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center">
      <h1 className="text-2xl font-black tracking-[0.3em] font-serif mb-6 text-black animate-pulse">LUXEE</h1>
      <Loader2 className="w-8 h-8 animate-spin text-black/30" />
    </div>
  );
}
