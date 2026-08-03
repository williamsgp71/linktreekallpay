import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{3}){1,2}$/;

function isValidHexColor(value: unknown): value is string {
  return typeof value === 'string' && HEX_COLOR_REGEX.test(value);
}

export async function GET() {
  try {
    let brandProfile = await prisma.brandProfile.findFirst();

    if (!brandProfile) {
      brandProfile = await prisma.brandProfile.create({
        data: {
          title: 'Kallpay Supplements',
          bioEn: 'High-performance sports nutrition and supplementation.',
          bioEs: 'Nutrición deportiva y suplementación de alto rendimiento.',
          logoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300&h=300&fit=crop',
          whatsappNumber: '+573000000000',
          whatsappDefaultMsgEn: 'Hello! I would like more information about your products.',
          whatsappDefaultMsgEs: '¡Hola! Me gustaría más información sobre sus productos.',
          bannerTextEn: '⚡ GET 10% OFF ON YOUR FIRST PURCHASE ⚡',
          bannerTextEs: '⚡ OBTÉN 10% OFF EN TU PRIMERA COMPRA ⚡',
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
      bioEn,
      bioEs,
      logoUrl,
      whatsappNumber,
      whatsappDefaultMsg,
      whatsappDefaultMsgEn,
      whatsappDefaultMsgEs,
      bannerText,
      bannerTextEn,
      bannerTextEs,
      promoCode,
      showBanner,
      colorBackground,
      colorCard,
      colorAccent,
      colorText,
    } = body;

    const colorFields = { colorBackground, colorCard, colorAccent, colorText };
    for (const [key, value] of Object.entries(colorFields)) {
      if (value !== undefined && !isValidHexColor(value)) {
        return NextResponse.json(
          { error: 'Color inválido' },
          { status: 400 }
        );
      }
    }

    const existingProfile = await prisma.brandProfile.findFirst();

    let updatedProfile;
    if (existingProfile) {
      updatedProfile = await prisma.brandProfile.update({
        where: { id: existingProfile.id },
        data: {
          title: title !== undefined ? title : existingProfile.title,
          bioEn: bioEn !== undefined ? bioEn : (bio !== undefined ? bio : existingProfile.bioEn),
          bioEs: bioEs !== undefined ? bioEs : (bio !== undefined ? bio : existingProfile.bioEs),
          logoUrl: logoUrl !== undefined ? logoUrl : existingProfile.logoUrl,
          whatsappNumber: whatsappNumber !== undefined ? whatsappNumber : existingProfile.whatsappNumber,
          whatsappDefaultMsgEn: whatsappDefaultMsgEn !== undefined ? whatsappDefaultMsgEn : (whatsappDefaultMsg !== undefined ? whatsappDefaultMsg : existingProfile.whatsappDefaultMsgEn),
          whatsappDefaultMsgEs: whatsappDefaultMsgEs !== undefined ? whatsappDefaultMsgEs : (whatsappDefaultMsg !== undefined ? whatsappDefaultMsg : existingProfile.whatsappDefaultMsgEs),
          bannerTextEn: bannerTextEn !== undefined ? bannerTextEn : (bannerText !== undefined ? bannerText : existingProfile.bannerTextEn),
          bannerTextEs: bannerTextEs !== undefined ? bannerTextEs : (bannerText !== undefined ? bannerText : existingProfile.bannerTextEs),
          promoCode: promoCode !== undefined ? promoCode : existingProfile.promoCode,
          showBanner: showBanner !== undefined ? Boolean(showBanner) : existingProfile.showBanner,
          colorBackground: colorBackground !== undefined ? colorBackground : existingProfile.colorBackground,
          colorCard: colorCard !== undefined ? colorCard : existingProfile.colorCard,
          colorAccent: colorAccent !== undefined ? colorAccent : existingProfile.colorAccent,
          colorText: colorText !== undefined ? colorText : existingProfile.colorText,
        },
      });
    } else {
      updatedProfile = await prisma.brandProfile.create({
        data: {
          title: title || 'Kallpay Supplements',
          bioEn: bioEn || bio || 'High-performance sports nutrition and supplementation.',
          bioEs: bioEs || bio || 'Nutrición deportiva y suplementación de alto rendimiento.',
          logoUrl: logoUrl || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300&h=300&fit=crop',
          whatsappNumber: whatsappNumber || '+573000000000',
          whatsappDefaultMsgEn: whatsappDefaultMsgEn || whatsappDefaultMsg || 'Hello! I would like more information.',
          whatsappDefaultMsgEs: whatsappDefaultMsgEs || whatsappDefaultMsg || '¡Hola! Me gustaría más información.',
          bannerTextEn: bannerTextEn || bannerText || '⚡ GET 10% OFF ⚡',
          bannerTextEs: bannerTextEs || bannerText || '⚡ OBTÉN 10% OFF ⚡',
          promoCode: promoCode || 'KALLPAY10',
          showBanner: showBanner !== undefined ? Boolean(showBanner) : true,
          colorBackground: colorBackground || '#0B0F17',
          colorCard: colorCard || '#161E2E',
          colorAccent: colorAccent || '#10B981',
          colorText: colorText || '#F3F4F6',
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
