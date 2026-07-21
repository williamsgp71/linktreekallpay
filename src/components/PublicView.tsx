'use client';

import React, { useState, useEffect } from 'react';
import { Language, translations } from '@/lib/i18n';
import Header from '@/components/Header';
import PromoBanner from '@/components/PromoBanner';
import ProductGrid, { ProductItem } from '@/components/ProductGrid';
import LinksList, { LinkItem } from '@/components/LinksList';
import WhatsAppFloat from '@/components/WhatsAppFloat';

interface BrandProfileData {
  title: string;
  bioEn: string;
  bioEs: string;
  logoUrl: string;
  whatsappNumber: string;
  whatsappDefaultMsgEn: string;
  whatsappDefaultMsgEs: string;
  bannerTextEn: string;
  bannerTextEs: string;
  promoCode: string;
  showBanner: boolean;
}

interface PublicViewProps {
  profile: BrandProfileData;
  products: ProductItem[];
  links: LinkItem[];
}

export const PublicView: React.FC<PublicViewProps> = ({
  profile,
  products,
  links,
}) => {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('kallpay_lang');
      if (savedLang === 'es' || savedLang === 'en') {
        setLang(savedLang);
      }
    } catch (e) {
      console.error('Error reading saved language preference', e);
    }
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
  };

  const t = translations[lang];

  return (
    <main className="min-h-screen bg-[#0B0F17] text-gray-100 selection:bg-emeraldAccent selection:text-darkBg font-sans">
      <div className="max-w-md mx-auto min-h-screen flex flex-col justify-between relative px-2 py-4 pb-24 shadow-2xl bg-[#0B0F17]">
        <div className="space-y-4">
          {/* Header Component with Language Toggle */}
          <Header
            title={profile.title}
            bioEn={profile.bioEn}
            bioEs={profile.bioEs}
            logoUrl={profile.logoUrl}
            lang={lang}
            onLanguageChange={handleLanguageChange}
          />

          {/* Promo Banner Component */}
          <PromoBanner
            showBanner={profile.showBanner}
            bannerTextEn={profile.bannerTextEn}
            bannerTextEs={profile.bannerTextEs}
            promoCode={profile.promoCode}
            lang={lang}
          />

          {/* Product Grid Component */}
          <ProductGrid
            products={products}
            whatsappNumber={profile.whatsappNumber}
            lang={lang}
          />

          {/* Links List Component */}
          <LinksList links={links} lang={lang} />
        </div>

        {/* WhatsApp Floating Button */}
        <WhatsAppFloat
          whatsappNumber={profile.whatsappNumber}
          whatsappDefaultMsgEn={profile.whatsappDefaultMsgEn}
          whatsappDefaultMsgEs={profile.whatsappDefaultMsgEs}
          lang={lang}
        />

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-gray-900 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} {profile.title}. {t.allRightsReserved}</p>
          <p className="mt-1 font-semibold text-gray-600">
            Powered by <span className="text-emeraldAccent font-bold">Kallpay</span>
          </p>
        </footer>
      </div>
    </main>
  );
};

export default PublicView;
