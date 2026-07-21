import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const links = await prisma.link.findMany({
      orderBy: { position: 'asc' },
    });
    return NextResponse.json(links);
  } catch {
    return NextResponse.json(
      { error: 'Error al obtener los enlaces' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, url, icon, active, position } = body;

    if (!title || !url) {
      return NextResponse.json(
        { error: 'El título y la URL son obligatorios' },
        { status: 400 }
      );
    }

    let linkPosition = position;
    if (linkPosition === undefined || linkPosition === null) {
      const count = await prisma.link.count();
      linkPosition = count;
    }

    const link = await prisma.link.create({
      data: {
        title,
        url,
        icon: icon || 'Link',
        active: active !== undefined ? Boolean(active) : true,
        position: Number(linkPosition),
      },
    });

    return NextResponse.json(link, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Error al crear el enlace' },
      { status: 500 }
    );
  }
}
