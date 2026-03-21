import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Bestsellers } from "@/components/Bestsellers";
import { FeaturedCategories } from "@/components/FeaturedCategories";
import { CrazyDeals } from "@/components/CrazyDeals";
import { ShopByNotes } from "@/components/ShopByNotes";
import { BrandStory } from "@/components/BrandStory";
import { Testimonials } from "@/components/Testimonials";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <FeaturedCategories />
      <Bestsellers />
      <CrazyDeals />
      <ShopByNotes />
      <BrandStory />
      <Testimonials />
      <Newsletter />
      <Footer />
    </main>
  );
}
