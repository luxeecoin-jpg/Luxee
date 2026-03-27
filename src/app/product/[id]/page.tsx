import React, { Suspense } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getProductById, getRelatedProducts, getReviews } from '@/lib/data';
import { ProductDetailContent } from './ProductDetailContent';
import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

interface Props {
  params: Promise<{ id: string }>;
}

// Async component that streams in after auth resolves
async function ReviewPermission({ productId, product, relatedProducts, reviews }: {
  productId: string;
  product: any;
  relatedProducts: any[];
  reviews: any[];
}) {
  const user = await currentUser();
  let canReview = false;

  if (user) {
    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
        status: { equals: 'DELIVERED', mode: 'insensitive' }
      },
      select: { items: true }, // Only fetch what we need
    });
    canReview = orders.some(order => {
      const items = order.items as any[];
      return items?.some((item: any) => item.id === productId);
    });
  }

  return (
    <ProductDetailContent 
      product={product} 
      relatedProducts={relatedProducts} 
      reviews={reviews}
      canReview={canReview}
    />
  );
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  
  // Direct fetch by ID + reviews in parallel (no auth needed for this)
  const [product, reviews] = await Promise.all([
    getProductById(id),
    getReviews(id),
  ]);

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

  // Fetch related products (can be parallel but needs product.category)
  const relatedProducts = await getRelatedProducts(product.category, id);

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Suspense fallback={
        <ProductDetailContent 
          product={product} 
          relatedProducts={relatedProducts} 
          reviews={reviews}
          canReview={false}
        />
      }>
        <ReviewPermission 
          productId={id} 
          product={product} 
          relatedProducts={relatedProducts} 
          reviews={reviews} 
        />
      </Suspense>
      <Footer />
    </main>
  );
}

