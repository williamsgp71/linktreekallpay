import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { position: 'asc' },
    });
    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { error: 'Error al obtener los productos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, price, imageUrl, buyUrl, badgeText, active, position } = body;

    if (!title || price === undefined || !imageUrl || !buyUrl) {
      return NextResponse.json(
        { error: 'Los campos título, precio, URL de imagen y URL de compra son obligatorios' },
        { status: 400 }
      );
    }

    let productPosition = position;
    if (productPosition === undefined || productPosition === null) {
      const count = await prisma.product.count();
      productPosition = count;
    }

    const product = await prisma.product.create({
      data: {
        title,
        price: parseFloat(price),
        imageUrl,
        buyUrl,
        badgeText: badgeText || null,
        active: active !== undefined ? Boolean(active) : true,
        position: Number(productPosition),
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Error al crear el producto' },
      { status: 500 }
    );
  }
}
