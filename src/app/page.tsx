import React from 'react';
import { prisma } from '@/lib/prisma';
import PublicView from '@/components/PublicView';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const profileData = await prisma.brandProfile.findFirst();

  const profile = profileData || {
    title: 'Kallpay Supplements',
    bioEn: 'Sports nutrition and high-performance supplementation to reach your peak potential.',
    bioEs: 'Nutrición deportiva y suplementación de alto rendimiento para alcanzar tu máximo nivel.',
    logoUrl:
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300&h=300&fit=crop',
    whatsappNumber: '+573000000000',
    whatsappDefaultMsgEn:
      'Hi! I would like more information about your products and promotions.',
    whatsappDefaultMsgEs:
      '¡Hola! Me gustaría más información sobre sus productos y promociones.',
    bannerTextEn: '⚡ GET 10% OFF ON YOUR FIRST PURCHASE ⚡',
    bannerTextEs: '⚡ OBTÉN 10% OFF EN TU PRIMERA COMPRA ⚡',
    promoCode: 'KALLPAY10',
    showBanner: true,
  };

  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { position: 'asc' },
  });

  const links = await prisma.link.findMany({
    where: { active: true },
    orderBy: { position: 'asc' },
  });

  return <PublicView profile={profile} products={products} links={links} />;
}
