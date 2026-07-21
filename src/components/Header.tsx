import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  title: string;
  bio: string;
  logoUrl: string;
}

export const Header: React.FC<HeaderProps> = ({ title, bio, logoUrl }) => {
  return (
    <header className="flex flex-col items-center text-center space-y-4 pt-6 pb-2 px-4">
      {/* Avatar with Emerald Glow */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-emeraldAccent to-neonAccent rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
        <img
          src={logoUrl || '/placeholder-logo.png'}
          alt={title}
          className="relative w-24 h-24 rounded-full object-cover border-2 border-emeraldAccent shadow-[0_0_20px_rgba(16,185,129,0.4)] bg-darkCard"
        />
      </div>

      {/* Title & Verified Badge */}
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {title}
          </h1>
          <span
            className="inline-flex items-center justify-center p-0.5 rounded-full bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
            title="Cuenta Oficial Verificada"
          >
            <span className="bg-darkBg rounded-full p-0.5 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emeraldAccent fill-emeraldAccent/20" />
            </span>
          </span>
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-300 max-w-sm leading-relaxed px-2 font-medium">
          {bio}
        </p>
      </div>
    </header>
  );
};

export default Header;
