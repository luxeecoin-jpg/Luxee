import React from 'react';
import { Header } from '@/components/Header';

export default function Loading() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 pt-28 md:pt-36 pb-16">
        {/* Hero skeleton */}
        <div className="w-full h-[60vh] bg-black/[0.03] rounded-2xl skeleton-shimmer mb-12" />
        {/* Product grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="aspect-[3/4] bg-black/[0.03] rounded-xl skeleton-shimmer" />
          ))}
        </div>
      </div>
    </main>
  );
}

