import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function AccountLoading() {
  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Header />
      
      <div className="container mx-auto px-4 py-32 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: User Card Skeleton */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-2xl shadow-black/[0.02] text-center sticky top-24">
              <div className="w-24 h-24 bg-black/5 rounded-full mx-auto mb-6 skeleton-shimmer" />
              <div className="h-6 w-3/4 mx-auto bg-black/5 rounded-lg mb-2 skeleton-shimmer" />
              <div className="h-3 w-1/2 mx-auto bg-black/5 rounded flex-col mt-4 skeleton-shimmer" />
              
              <div className="mt-8 pt-8 border-t border-black/5 flex flex-col gap-4">
                <div className="w-full h-12 bg-black/5 rounded-2xl skeleton-shimmer" />
              </div>
            </div>
          </div>

          {/* Right Content Skeleton */}
          <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-3xl border border-black/5 flex items-center gap-4 h-[100px] skeleton-shimmer shadow-sm" />
                <div className="bg-white p-6 rounded-3xl border border-black/5 flex items-center gap-4 h-[100px] skeleton-shimmer shadow-sm" />
              </div>

              <section>
                <div className="flex items-center justify-between mb-8 px-2 animate-pulse">
                  <div className="h-4 w-32 bg-black/5 rounded" />
                  <div className="h-3 w-16 bg-black/5 rounded" />
                </div>

                <div className="space-y-4">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-black/5 h-[100px] skeleton-shimmer shadow-sm" />
                  ))}
              </div>
            </section>

            <section className="bg-[#f0f0f0] p-10 rounded-[2.5rem] shadow-sm animate-pulse h-[200px]" />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
