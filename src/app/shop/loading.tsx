import { BestsellersSkeleton } from '@/components/Skeletons';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function ShopLoading() {
  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Header />
      <div className="pt-28 md:pt-36 min-h-screen flex flex-col">
        <div className="container mx-auto px-4 md:px-12 mb-8 text-center">
            <h1 className="text-3xl md:text-5xl font-serif text-[#1a1a1a] tracking-tight mb-2 opacity-50 animate-pulse">The Collection</h1>
            <div className="h-1 w-16 bg-black/10 mx-auto rounded-full animate-pulse"/>
        </div>
        <BestsellersSkeleton />
      </div>
      <Footer />
    </main>
  );
}
