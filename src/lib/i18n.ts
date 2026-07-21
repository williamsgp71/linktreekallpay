export type Language = 'en' | 'es';

export interface Translations {
  Verified: string;
  copyCode: string;
  copied: string;
  buyInquiry: string;
  online: string;
  productInquiryMsg: (title: string, price: string | number) => string;
  featuredSupplements: string;
  directLinks: string;
  buy: string;
  code: string;
  noImage: string;
  allRightsReserved: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    Verified: 'Official Store',
    copyCode: 'Copy Code',
    copied: 'Copied! ✓',
    buyInquiry: 'Buy / Inquiry',
    online: 'Online',
    productInquiryMsg: (title: string, price: string | number) =>
      `Hi! I came from your Linktree and I'm interested in purchasing: ${title} (${price}).`,
    featuredSupplements: 'Featured Supplements',
    directLinks: 'Direct Links',
    buy: 'Buy',
    code: 'Code:',
    noImage: 'No image',
    allRightsReserved: 'All rights reserved.',
  },
  es: {
    Verified: 'Tienda Oficial',
    copyCode: 'Copiar Código',
    copied: '¡Copiado! ✓',
    buyInquiry: 'Comprar / Consultar',
    online: 'En Línea',
    productInquiryMsg: (title: string, price: string | number) =>
      `Hola! Vengo de su Linktree y deseo información / comprar el producto: ${title} (${price}).`,
    featuredSupplements: 'Suplementos Destacados',
    directLinks: 'Enlaces Directos',
    buy: 'Comprar',
    code: 'Código:',
    noImage: 'Sin imagen',
    allRightsReserved: 'Todos los derechos reservados.',
  },
};
