import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, text, rating, productId } = body;

    if (!name?.trim() || !text?.trim()) {
      return NextResponse.json({ error: 'Name and text are required' }, { status: 400 });
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
