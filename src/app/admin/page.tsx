import React from 'react';
import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import { AdminDashboard } from '@/components/AdminDashboard';
export default async function AdminPage() {
  const user = await currentUser();

  // Basic admin check (this can be improved with Clerk roles)
  // For now, mirroring the existing logic where a specific email or role is required
  const userEmail = user?.emailAddresses?.[0]?.emailAddress;
  const adminEmails = [
    process.env.ADMIN_EMAIL,
    'luxee.co.in@gmail.com',
    'vikasparmar605@gmail.com'
  ].filter(Boolean); // Filter out any undefined values

  const isAdmin = adminEmails.includes(userEmail) || user?.publicMetadata?.role === 'admin';

  if (!user) {
    redirect('/login?redirect=/admin');
  }

  if (!isAdmin) {
    notFound();
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
