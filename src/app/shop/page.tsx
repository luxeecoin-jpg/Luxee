import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getProducts } from '@/lib/data';
import { ShopContent } from './ShopContent';

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Header />
      <ShopContent products={products} />
      <Footer />
    </main>
  );
}
