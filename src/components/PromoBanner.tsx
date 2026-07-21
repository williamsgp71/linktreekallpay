'use client';

import React, { useState } from 'react';
import { Tag, Check, Copy } from 'lucide-react';
import { Language, translations } from '@/lib/i18n';

interface PromoBannerProps {
  showBanner: boolean;
  bannerTextEn?: string | null;
  bannerTextEs?: string | null;
  promoCode: string;
  lang: Language;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  showBanner,
  bannerTextEn,
  bannerTextEs,
  promoCode,
  lang,
}) => {
  const [copied, setCopied] = useState(false);

  const bannerText = lang === 'es' ? bannerTextEs : bannerTextEn;
  const t = translations[lang];

  if (!showBanner || (!bannerText && !promoCode)) {
    return null;
  }

  const handleCopy = async () => {
    if (!promoCode) return;
    try {
      await navigator.clipboard.writeText(promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy promo code', err);
    }
  };

  return (
    <div className="w-full px-4 py-2">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-darkCard via-[#1e293b] to-darkCard border border-emeraldAccent/40 p-4 shadow-lg shadow-emeraldAccent/5">
        <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-emeraldAccent/10 rounded-full blur-xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emeraldAccent/15 text-emeraldAccent border border-emeraldAccent/30 flex-shrink-0">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              {bannerText && (
                <p className="text-sm font-semibold text-gray-100 leading-tight">
                  {bannerText}
                </p>
              )}
              {promoCode && (
                <div className="mt-1 flex items-center justify-center sm:justify-start gap-1.5 text-xs text-gray-300">
                  <span>{t.code}</span>
                  <span className="font-mono font-bold text-emeraldAccent bg-emeraldAccent/10 px-2 py-0.5 rounded border border-emeraldAccent/30">
                    {promoCode}
                  </span>
                </div>
              )}
            </div>
          </div>

          {promoCode && (
            <button
              onClick={handleCopy}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg font-bold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 shadow-md ${
                copied
                  ? 'bg-emerald-500 text-darkBg border border-emerald-400'
                  : 'bg-emeraldAccent text-darkBg hover:bg-neonAccent hover:shadow-[0_0_12px_rgba(52,211,153,0.4)] active:scale-95'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t.copied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{t.copyCode}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
