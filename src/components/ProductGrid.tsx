'use client';

import React, { useState } from 'react';
import { ShoppingCart, ExternalLink, Package } from 'lucide-react';
import { Language, translations } from '@/lib/i18n';

export interface ProductItem {
  id: string;
  titleEn: string;
  titleEs: string;
  price: number;
  imageUrl: string;
  buyUrl: string;
  badgeTextEn?: string | null;
  badgeTextEs?: string | null;
}

interface ProductGridProps {
  products: ProductItem[];
  whatsappNumber?: string;
  lang: Language;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  whatsappNumber = '16193622288',
  lang,
}) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const t = translations[lang];

  if (!products || products.length === 0) {
    return null;
  }

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const handleBuy = (product: ProductItem) => {
    fetch('/api/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'product', id: product.id }),
    }).catch((err) => console.error('Failed to record click', err));

    const title = lang === 'es' ? product.titleEs : product.titleEn;
    const formattedPrice = `$${product.price.toLocaleString(lang === 'es' ? 'es-CO' : 'en-US', { minimumFractionDigits: 0 })}`;

    const isWhatsappBuyUrl =
      !product.buyUrl ||
      product.buyUrl === '#' ||
      product.buyUrl.includes('wa.me') ||
      product.buyUrl.includes('whatsapp');

    let targetUrl = product.buyUrl;
    if (isWhatsappBuyUrl) {
      const cleanPhone = (whatsappNumber || '16193622288').replace(/[^0-9]/g, '');
      const msgText = t.productInquiryMsg(title, formattedPrice);
      const msg = encodeURIComponent(msgText);
      targetUrl = `https://wa.me/${cleanPhone}?text=${msg}`;
    }

    if (targetUrl) {
      window.open(targetUrl, '_blank');
    }
  };

  return (
    <div className="w-full px-4 py-3 space-y-3">
      <div className="flex items-center gap-2">
        <Package className="w-4 h-4 text-emeraldAccent" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
          {t.featuredSupplements}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {products.map((product) => {
          const hasImageError = imageErrors[product.id];
          const title = lang === 'es' ? product.titleEs : product.titleEn;
          const badgeText = lang === 'es' ? product.badgeTextEs : product.badgeTextEn;

          return (
            <div
              key={product.id}
              className="group relative flex flex-col justify-between rounded-xl bg-darkCard border border-gray-800 hover:border-emeraldAccent/50 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-emeraldAccent/15"
            >
              {/* Product Badge */}
              {badgeText && (
                <div className="absolute top-2 left-2 z-10">
                  <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-darkBg font-black text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-md shadow-md">
                    {badgeText}
                  </span>
                </div>
              )}

              {/* Product Image */}
              <div className="relative w-full aspect-square bg-gray-900 overflow-hidden flex items-center justify-center p-2">
                {!hasImageError && product.imageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={product.imageUrl}
                    alt={title}
                    onError={() => handleImageError(product.id)}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-500 p-4 text-center">
                    <Package className="w-10 h-10 stroke-1 mb-1 text-emeraldAccent/40" />
                    <span className="text-[10px]">{t.noImage}</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3 flex flex-col flex-grow justify-between space-y-2">
                <div>
                  <h3 className="text-xs font-semibold text-gray-200 line-clamp-2 leading-snug group-hover:text-emeraldAccent transition-colors">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm font-extrabold text-white">
                    ${product.price.toLocaleString(lang === 'es' ? 'es-CO' : 'en-US', { minimumFractionDigits: 0 })}
                  </p>
                </div>

                {/* Buy Button */}
                <button
                  onClick={() => handleBuy(product)}
                  className="w-full mt-2 py-2 px-2 rounded-lg bg-emeraldAccent/15 hover:bg-emeraldAccent text-emeraldAccent hover:text-darkBg border border-emeraldAccent/40 transition-all duration-200 flex items-center justify-center gap-1.5 text-xs font-bold shadow-sm active:scale-95"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{t.buy}</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductGrid;
