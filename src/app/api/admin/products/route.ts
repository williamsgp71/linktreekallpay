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
    const { title, titleEn, titleEs, price, imageUrl, buyUrl, badgeText, badgeTextEn, badgeTextEs, active, position } = body;

    const finalTitleEn = titleEn || title;
    const finalTitleEs = titleEs || title;
    const finalBadgeEn = badgeTextEn !== undefined ? badgeTextEn : (badgeText || null);
    const finalBadgeEs = badgeTextEs !== undefined ? badgeTextEs : (badgeText || null);

    if (!finalTitleEn || !finalTitleEs || price === undefined || !imageUrl || !buyUrl) {
      return NextResponse.json(
        { error: 'Los campos título (EN y ES), precio, URL de imagen y URL de compra son obligatorios' },
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
        titleEn: finalTitleEn,
        titleEs: finalTitleEs,
        price: parseFloat(price),
        imageUrl,
        buyUrl,
        badgeTextEn: finalBadgeEn,
        badgeTextEs: finalBadgeEs,
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
