import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function OrdersLoading() {
  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Header />
      
      <div className="container mx-auto px-4 py-32 max-w-4xl">
        <div className="flex items-center justify-between mb-12 animate-pulse">
          <div>
            <div className="h-10 w-48 bg-black/10 rounded-lg mb-3" />
            <div className="h-4 w-64 bg-black/5 rounded" />
          </div>
          <div className="w-12 h-12 bg-black/5 rounded-xl" />
        </div>

        <div className="space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-black/5 rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row gap-6 animate-pulse">
               <div className="flex items-center gap-6 w-full">
                  <div className="w-16 h-16 bg-black/5 rounded-2xl flex-shrink-0" />
                  <div className="flex-col space-y-3 w-full max-w-[200px]">
                      <div className="h-4 bg-black/10 rounded w-full" />
                      <div className="h-3 bg-black/5 rounded w-3/4" />
                  </div>
               </div>
               
               <div className="flex items-center gap-4 w-full md:w-auto md:ml-auto">
                    <div className="flex -space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-black/5 border-2 border-white" />
                        <div className="w-10 h-10 rounded-xl bg-black/5 border-2 border-white" />
                        <div className="w-10 h-10 rounded-xl bg-black/5 border-2 border-white" />
                    </div>
                    <div className="w-5 h-5 bg-black/5 rounded-full ml-4" />
               </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
