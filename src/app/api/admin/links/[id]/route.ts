import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const existingLink = await prisma.link.findUnique({
      where: { id },
    });

    if (!existingLink) {
      return NextResponse.json(
        { error: 'Enlace no encontrado' },
        { status: 404 }
      );
    }

    const dataToUpdate: Record<string, string | number | boolean> = {};
    if (body.titleEn !== undefined) dataToUpdate.titleEn = body.titleEn;
    if (body.titleEs !== undefined) dataToUpdate.titleEs = body.titleEs;
    if (body.title !== undefined && body.titleEn === undefined && body.titleEs === undefined) {
      dataToUpdate.titleEn = body.title;
      dataToUpdate.titleEs = body.title;
    }
    if (body.url !== undefined) dataToUpdate.url = body.url;
    if (body.icon !== undefined) dataToUpdate.icon = body.icon;
    if (body.active !== undefined) dataToUpdate.active = Boolean(body.active);
    if (body.position !== undefined) dataToUpdate.position = Number(body.position);
    if (body.clicks !== undefined) dataToUpdate.clicks = Number(body.clicks);

    const updatedLink = await prisma.link.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedLink);
  } catch {
    return NextResponse.json(
      { error: 'Error al actualizar el enlace' },
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

    const existingLink = await prisma.link.findUnique({
      where: { id },
    });

    if (!existingLink) {
      return NextResponse.json(
        { error: 'Enlace no encontrado' },
        { status: 404 }
      );
    }

    await prisma.link.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Enlace eliminado correctamente' });
  } catch {
    return NextResponse.json(
      { error: 'Error al eliminar el enlace' },
      { status: 500 }
    );
  }
}
