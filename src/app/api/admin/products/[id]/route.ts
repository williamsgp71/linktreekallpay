import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    const dataToUpdate: Record<string, string | number | boolean | null> = {};
    if (body.title !== undefined) dataToUpdate.title = body.title;
    if (body.price !== undefined) dataToUpdate.price = parseFloat(body.price);
    if (body.imageUrl !== undefined) dataToUpdate.imageUrl = body.imageUrl;
    if (body.buyUrl !== undefined) dataToUpdate.buyUrl = body.buyUrl;
    if (body.badgeText !== undefined) dataToUpdate.badgeText = body.badgeText;
    if (body.active !== undefined) dataToUpdate.active = Boolean(body.active);
    if (body.position !== undefined) dataToUpdate.position = Number(body.position);
    if (body.clicks !== undefined) dataToUpdate.clicks = Number(body.clicks);

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedProduct);
  } catch {
    return NextResponse.json(
      { error: 'Error al actualizar el producto' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Producto eliminado correctamente' });
  } catch {
    return NextResponse.json(
      { error: 'Error al eliminar el producto' },
      { status: 500 }
    );
  }
}
