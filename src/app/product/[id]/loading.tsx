import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCardSkeleton } from '@/components/Skeletons';

export default function ProductLoading() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 md:px-12 pt-28 md:pt-36 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image skeleton */}
          <div className="bg-[#fafafa] rounded-2xl aspect-square overflow-hidden border border-black/[0.04] skeleton-shimmer" />
          
          {/* Details skeleton */}
          <div className="flex flex-col space-y-6 pt-4">
            <div className="h-4 bg-black/5 w-24 rounded animate-pulse" />
            <div className="h-10 bg-black/5 w-3/4 rounded-lg animate-pulse" />
            <div className="h-4 bg-black/5 w-32 rounded animate-pulse" />
            
            <div className="h-24 bg-[#fafafa] rounded-xl border border-black/[0.03] mt-6 skeleton-shimmer" />
            
            <div className="space-y-4 mt-8">
              <div className="h-12 bg-black/5 rounded-xl skeleton-shimmer w-full" />
              <div className="h-12 bg-black/5 rounded-xl skeleton-shimmer w-full" />
            </div>
          </div>
        </div>

        <div className="mt-20">
          <div className="h-8 bg-black/5 w-48 mx-auto rounded-lg animate-pulse mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[0, 1, 2, 3].map(i => <ProductCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
