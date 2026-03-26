import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getProducts } from '@/lib/data';
import { DealsContent } from './DealsContent';

export default async function DealsPage() {
  const products = await getProducts();
  const dealProducts = products.filter(p => p.section === "CRAZY DEALS");

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Header />
      <DealsContent products={dealProducts} />
      <Footer />
    </main>
  );
}
