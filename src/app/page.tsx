import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Bestsellers } from "@/components/Bestsellers";
import { BrandStory } from "@/components/BrandStory";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Bestsellers />
      <BrandStory />
      <Footer />
    </main>
  );
}
