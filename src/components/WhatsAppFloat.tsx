'use client';

import React from 'react';
import { Language, translations } from '@/lib/i18n';

interface WhatsAppFloatProps {
  whatsappNumber: string;
  whatsappDefaultMsgEn?: string | null;
  whatsappDefaultMsgEs?: string | null;
  lang: Language;
}

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.157 4.228 4.228-1.157zm11.758-6.196c-.08-.134-.294-.213-.616-.374-.322-.16-.19-.374-.617-.374s-.536.08-.751.32-.832 1.015-1.019 1.23-.375.24-.697.08c-.322-.16-1.36-.501-2.59-1.598-.957-.853-1.603-1.907-1.79-2.228-.188-.321-.02-.495.141-.655.145-.145.322-.375.483-.562.16-.188.214-.321.322-.535.107-.214.053-.401-.027-.562s-.751-1.808-1.03-2.478c-.271-.651-.546-.562-.751-.572l-.64-.01c-.214 0-.562.08-.857.401s-1.125 1.1-1.125 2.68 1.152 3.109 1.312 3.323c.16.214 2.268 3.464 5.495 4.859.768.332 1.368.531 1.836.68.772.245 1.474.21 2.03.128.618-.092 1.901-.777 2.169-1.528.268-.75.268-1.391.188-1.527z" />
  </svg>
);

export const WhatsAppFloat: React.FC<WhatsAppFloatProps> = ({
  whatsappNumber,
  whatsappDefaultMsgEn,
  whatsappDefaultMsgEs,
  lang,
}) => {
  if (!whatsappNumber) return null;

  const t = translations[lang];
  const defaultMsg = lang === 'es' ? whatsappDefaultMsgEs : whatsappDefaultMsgEn;

  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultMsg || '')}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-5 right-5 z-50 group flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-darkBg px-4 py-3 rounded-full shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all duration-300 transform hover:scale-105"
    >
      <div className="relative flex items-center justify-center">
        <WhatsAppIcon className="w-6 h-6 text-darkBg" />
        {/* Pulse Dot */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-100 border border-emerald-600"></span>
        </span>
      </div>

      <span className="hidden sm:inline-block font-extrabold text-xs tracking-wide">
        {t.online}
      </span>
    </a>
  );
};

export default WhatsAppFloat;
