import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function OrderDetailsLoading() {
  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Header />
      
      <div className="container mx-auto px-4 py-32 max-w-5xl">
        <div className="w-24 h-4 bg-black/5 rounded mb-12 animate-pulse" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8 animate-pulse">
            
            {/* Header & Status Tracker */}
            <div className="bg-white border border-black/5 rounded-[2.5rem] p-10 shadow-sm h-[250px] flex flex-col justify-between">
              <div className="flex justify-between items-start w-full">
                  <div className="space-y-3">
                      <div className="w-48 h-8 bg-black/5 rounded-lg" />
                      <div className="w-32 h-4 bg-black/5 rounded" />
                  </div>
                  <div className="w-24 h-8 bg-black/5 rounded-xl" />
              </div>

              <div className="w-full h-1 bg-black/5 relative mt-auto">
                  <div className="flex justify-between absolute w-full top-1/2 -translate-y-1/2 px-4">
                      <div className="w-10 h-10 bg-black/10 rounded-full" />
                      <div className="w-10 h-10 bg-black/5 rounded-full" />
                      <div className="w-10 h-10 bg-black/5 rounded-full" />
                      <div className="w-10 h-10 bg-black/5 rounded-full" />
                  </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white border border-black/5 rounded-[2.5rem] p-10 shadow-sm">
              <div className="w-40 h-6 bg-black/10 rounded-lg mb-8" />
              <div className="space-y-4">
                {[0, 1].map((i) => (
                  <div key={i} className="flex items-center gap-6 p-6 bg-[#fcfcfc] rounded-3xl border border-black/[0.03] animate-pulse">
                    <div className="w-20 h-20 bg-black/5 rounded-2xl flex-shrink-0" />
                    <div className="flex-1 space-y-3">
                      <div className="w-32 h-4 bg-black/10 rounded" />
                      <div className="w-24 h-3 bg-black/5 rounded" />
                    </div>
                    <div className="text-right space-y-2">
                       <div className="w-16 h-5 bg-black/10 rounded ml-auto" />
                       <div className="w-12 h-3 bg-black/5 rounded ml-auto" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8 animate-pulse">
            <div className="bg-white border border-black/5 rounded-[2.5rem] p-10 shadow-sm h-[350px]">
                <div className="w-32 h-4 bg-black/5 rounded mb-8" />
                <div className="space-y-8">
                    {[0, 1, 2].map(i => (
                        <div key={i} className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-black/5 flex-shrink-0" />
                            <div className="flex-col space-y-2 w-full">
                                <div className="w-24 h-3 bg-black/10 rounded" />
                                <div className="w-full h-8 bg-black/5 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-black/5 rounded-[2.5rem] p-10 h-[250px]" />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
