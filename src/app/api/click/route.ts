import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, id } = body;

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid ID parameter' },
        { status: 400 }
      );
    }

    if (type === 'product') {
      await prisma.product.update({
        where: { id },
        data: {
          clicks: {
            increment: 1,
          },
        },
      });
      return NextResponse.json({ success: true });
    }

    if (type === 'link') {
      await prisma.link.update({
        where: { id },
        data: {
          clicks: {
            increment: 1,
          },
        },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid click type. Must be "product" or "link"' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error incrementing click count:', error);
    return NextResponse.json(
      { error: 'Failed to record click' },
      { status: 500 }
    );
  }
}
