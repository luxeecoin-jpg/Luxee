import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getProducts, getReviews } from '@/lib/data';
import { ProductDetailContent } from './ProductDetailContent';
import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const [products, reviews] = await Promise.all([
    getProducts(),
    getReviews(id),
  ]);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-serif text-[#1a1a1a]">Product Not Found</h1>
          <Link href="/shop" className="text-sm text-gold-600 font-semibold hover:underline">
            Browse All Products
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const relatedProducts = products
    .filter(p => p.id !== id && p.category === product.category)
    .slice(0, 4);

  const user = await currentUser();
  let canReview = false;

  if (user) {
    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
        status: { equals: 'DELIVERED', mode: 'insensitive' }
      }
    });
    canReview = orders.some(order => {
      const items = order.items as any[];
      return items?.some((item: any) => item.id === id);
    });
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <ProductDetailContent 
        product={product} 
        relatedProducts={relatedProducts} 
        reviews={reviews}
        canReview={canReview}
      />
      <Footer />
    </main>
  );
}
