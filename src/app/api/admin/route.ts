import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { revalidateTag } from 'next/cache';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = user.emailAddresses?.[0]?.emailAddress === process.env.ADMIN_EMAIL || user.publicMetadata?.role === 'admin';
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { type, data } = await req.json();

    switch (type) {
      case 'UPDATE_ORDER_STATUS':
        await prisma.order.update({
          where: { id: data.id },
          data: { status: data.status.toUpperCase() },
        });
        break;

      case 'UPDATE_PRODUCT': {
        const { id, ...updateData } = data;
        await prisma.product.update({
          where: { id },
          data: updateData,
        });
        revalidateTag('products', 'default');
        break;
      }

      case 'ADD_PRODUCT':
        await prisma.product.create({
          data: {
            name: data.name || '',
            price: data.price || 0,
            oldPrice: data.oldPrice || null,
            image: data.image || '',
            images: data.images || [],
            category: data.category || 'HIM',
            section: data.section || 'BESTSELLERS',
            tag: data.tag || null,
            badges: data.badges || [],
            description: data.description || null,
            notes: data.notes || [],
            sizes: data.sizes || [],
            rating: 5,
            reviews: 0,
          },
        });
        revalidateTag('products', 'default');
        break;

      case 'DELETE_PRODUCT':
        await prisma.product.delete({
          where: { id: data.id },
        });
        revalidateTag('products', 'default');
        break;

      case 'UPDATE_HERO':
        await prisma.$transaction([
          prisma.heroSlide.deleteMany({}),
          prisma.heroSlide.createMany({
            data: data.slides.map((s: any, idx: number) => ({
              title: s.title || null,
              subtitle: s.subtitle || null,
              description: s.description || null,
              image: s.image || '',
              mobileImage: s.mobileImage || s.image || '',
              ctaText: s.ctaText || null,
              order: s.order ?? idx,
            }))
          })
        ]);
        revalidateTag('hero', 'default');
        break;

      default:
        return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Admin API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
