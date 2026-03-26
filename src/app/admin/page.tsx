import React from 'react';
import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { AdminDashboard } from '@/components/AdminDashboard';
export default async function AdminPage() {
  const user = await currentUser();

  // Basic admin check (this can be improved with Clerk roles)
  // For now, mirroring the existing logic where a specific email or role is required
  const isAdmin = user?.emailAddresses?.[0]?.emailAddress === process.env.ADMIN_EMAIL || user?.publicMetadata?.role === 'admin';

  if (!user || !isAdmin) {
    redirect('/login?redirect=/admin');
  }

  // Fetch initial data on server
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const heroSlides = await prisma.heroSlide.findMany({
    orderBy: { id: 'asc' }
  });

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <AdminDashboard 
        initialProducts={products} 
        initialOrders={orders} 
        initialHero={{ slides: heroSlides }} 
        userEmail={user.emailAddresses[0].emailAddress} 
      />
    </div>
  );
}
