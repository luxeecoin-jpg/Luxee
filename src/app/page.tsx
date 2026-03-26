import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Bestsellers } from "@/components/Bestsellers";
import { BrandStory } from "@/components/BrandStory";
import { Footer } from "@/components/Footer";
import { getProducts, getHeroConfig } from "@/lib/data";

export default async function Home() {
  const [products, heroConfig] = await Promise.all([
    getProducts(),
    getHeroConfig(),
  ]);

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero slides={heroConfig.slides} />
      <Bestsellers products={products} />
      <BrandStory />
      <Footer />
    </main>
  );
}
