import React from 'react';
import { prisma } from '@/lib/prisma';
import Header from '@/components/Header';
import PromoBanner from '@/components/PromoBanner';
import ProductGrid from '@/components/ProductGrid';
import LinksList from '@/components/LinksList';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const profileData = await prisma.brandProfile.findFirst();

  const profile = profileData || {
    title: 'Kallpay Supplements',
    bio: 'Nutrición deportiva y suplementación de alto rendimiento para alcanzar tu máximo nivel.',
    logoUrl:
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300&h=300&fit=crop',
    whatsappNumber: '+573000000000',
    whatsappDefaultMsg:
      '¡Hola! Me gustaría más información sobre sus productos y promociones.',
    bannerText: '⚡ OBTÉN 10% OFF EN TU PRIMERA COMPRA ⚡',
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

  return (
    <main className="min-h-screen bg-[#0B0F17] text-gray-100 selection:bg-emeraldAccent selection:text-darkBg font-sans">
      <div className="max-w-md mx-auto min-h-screen flex flex-col justify-between relative px-2 py-4 pb-24 shadow-2xl bg-[#0B0F17]">
        <div className="space-y-4">
          {/* Header Component */}
          <Header
            title={profile.title}
            bio={profile.bio}
            logoUrl={profile.logoUrl}
          />

          {/* Promo Banner Component */}
          <PromoBanner
            showBanner={profile.showBanner}
            bannerText={profile.bannerText}
            promoCode={profile.promoCode}
          />

          {/* Product Grid Component */}
          <ProductGrid products={products} />

          {/* Links List Component */}
          <LinksList links={links} />
        </div>

        {/* WhatsApp Floating Button */}
        <WhatsAppFloat
          whatsappNumber={profile.whatsappNumber}
          whatsappDefaultMsg={profile.whatsappDefaultMsg}
        />

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-gray-900 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} {profile.title}. Todos los derechos reservados.</p>
          <p className="mt-1 font-semibold text-gray-600">
            Powered by <span className="text-emeraldAccent font-bold">Kallpay</span>
          </p>
        </footer>
      </div>
    </main>
  );
}
