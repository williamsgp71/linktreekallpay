'use client';

import React from 'react';
import { Language } from '@/lib/i18n';

interface LanguageToggleProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  currentLang,
  onLanguageChange,
}) => {
  const handleSelect = (lang: Language) => {
    try {
      localStorage.setItem('kallpay_lang', lang);
    } catch (e) {
      console.error('Failed to save language preference', e);
    }
    onLanguageChange(lang);
  };

  return (
    <div className="flex items-center gap-1 bg-darkCard/90 p-1 rounded-lg border border-gray-800 shadow-inner">
      <button
        type="button"
        onClick={() => handleSelect('en')}
        className={`px-2.5 py-1 text-xs rounded-md transition-all duration-200 ${
          currentLang === 'en'
            ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
            : 'text-gray-400 hover:text-white font-medium'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => handleSelect('es')}
        className={`px-2.5 py-1 text-xs rounded-md transition-all duration-200 ${
          currentLang === 'es'
            ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
            : 'text-gray-400 hover:text-white font-medium'
        }`}
      >
        ES
      </button>
    </div>
  );
};

export default LanguageToggle;
