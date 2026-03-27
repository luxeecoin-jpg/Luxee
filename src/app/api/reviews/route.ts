import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'You must be logged in to leave a review.' }, { status: 401 });
    }

    const body = await request.json();
    const { name, text, rating, productId } = body;

    if (!name?.trim() || !text?.trim()) {
      return NextResponse.json({ error: 'Name and text are required' }, { status: 400 });
    }

    if (!productId || productId === 'general') {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    // Verify user actually purchased the item and it was delivered
    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
        status: { equals: 'DELIVERED', mode: 'insensitive' }
      }
    });

    const hasPurchased = orders.some(order => {
      const items = order.items as any[];
      return items?.some(item => item.id === productId);
    });

    if (!hasPurchased) {
      return NextResponse.json({ error: 'You must have a delivered order of this product to leave a review.' }, { status: 403 });
    }

    const review = await prisma.review.create({
      data: {
        name: name.trim(),
        text: text.trim(),
        rating: rating || 5,
        productId: productId || 'general',
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
