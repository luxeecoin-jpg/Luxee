import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure the Clerk user exists in our local Prisma User table
    // This prevents "Foreign key constraint violated on Order_userId_fkey" errors
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.emailAddresses[0]?.emailAddress || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      },
      create: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        role: "USER"
      }
    });

    const body = await req.json();
    const { 
      paymentId, 
      customerName, 
      customerEmail, 
      customerPhone, 
      shippingAddress, 
      items, 
      totalPrice 
    } = body;

    // Create order in Prisma
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        paymentId: paymentId || 'COD',
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress: shippingAddress, // JSON field
        items: items, // JSON field
        totalPrice,
        status: 'PLACED',
      },
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error: any) {
    console.error('Checkout API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
