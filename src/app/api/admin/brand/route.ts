import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let brandProfile = await prisma.brandProfile.findFirst();

    if (!brandProfile) {
      brandProfile = await prisma.brandProfile.create({
        data: {
          title: 'Kallpay Supplements',
          bio: 'Nutrición deportiva y suplementación de alto rendimiento.',
          logoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300&h=300&fit=crop',
          whatsappNumber: '+573000000000',
          whatsappDefaultMsg: '¡Hola! Me gustaría más información sobre sus productos.',
          bannerText: '⚡ OBTÉN 10% OFF EN TU PRIMERA COMPRA ⚡',
          promoCode: 'KALLPAY10',
          showBanner: true,
        },
      });
    }

    return NextResponse.json(brandProfile);
  } catch {
    return NextResponse.json(
      { error: 'Error al obtener la configuración de la marca' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      bio,
      logoUrl,
      whatsappNumber,
      whatsappDefaultMsg,
      bannerText,
      promoCode,
      showBanner,
    } = body;

    const existingProfile = await prisma.brandProfile.findFirst();

    let updatedProfile;
    if (existingProfile) {
      updatedProfile = await prisma.brandProfile.update({
        where: { id: existingProfile.id },
        data: {
          title: title !== undefined ? title : existingProfile.title,
          bio: bio !== undefined ? bio : existingProfile.bio,
          logoUrl: logoUrl !== undefined ? logoUrl : existingProfile.logoUrl,
          whatsappNumber: whatsappNumber !== undefined ? whatsappNumber : existingProfile.whatsappNumber,
          whatsappDefaultMsg: whatsappDefaultMsg !== undefined ? whatsappDefaultMsg : existingProfile.whatsappDefaultMsg,
          bannerText: bannerText !== undefined ? bannerText : existingProfile.bannerText,
          promoCode: promoCode !== undefined ? promoCode : existingProfile.promoCode,
          showBanner: showBanner !== undefined ? Boolean(showBanner) : existingProfile.showBanner,
        },
      });
    } else {
      updatedProfile = await prisma.brandProfile.create({
        data: {
          title: title || 'Kallpay Supplements',
          bio: bio || 'Nutrición deportiva y suplementación de alto rendimiento.',
          logoUrl: logoUrl || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300&h=300&fit=crop',
          whatsappNumber: whatsappNumber || '+573000000000',
          whatsappDefaultMsg: whatsappDefaultMsg || '¡Hola! Me gustaría más información.',
          bannerText: bannerText || '⚡ OBTÉN 10% OFF ⚡',
          promoCode: promoCode || 'KALLPAY10',
          showBanner: showBanner !== undefined ? Boolean(showBanner) : true,
        },
      });
    }

    return NextResponse.json(updatedProfile);
  } catch {
    return NextResponse.json(
      { error: 'Error al actualizar la configuración de la marca' },
      { status: 500 }
    );
  }
}
