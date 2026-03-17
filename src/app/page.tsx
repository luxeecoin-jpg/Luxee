import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Bestsellers } from "@/components/Bestsellers";
import { ShopByNotes } from "@/components/ShopByNotes";
import { CrazyDeals } from "@/components/CrazyDeals";
import { Testimonials } from "@/components/Testimonials";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Header />
      <Hero />
      <Bestsellers />
      <CrazyDeals />
      <ShopByNotes />
      <Testimonials />
    </main>
  );
}
