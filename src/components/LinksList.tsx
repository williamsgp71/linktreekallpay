'use client';

import React from 'react';
import {
  Globe,
  FileText,
  ShoppingBag,
  MessageCircle,
  Mail,
  Phone,
  Calendar,
  Link as LinkIcon,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon: string;
}

interface LinksListProps {
  links: LinkItem[];
}

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .56.04.82.11V9.3a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.57a6.34 6.34 0 0 0 10.83 4.47V11.2a8.27 8.27 0 0 0 5.76 2.14v-3.46a4.85 4.85 0 0 1-3.77-3.19z" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const getIconComponent = (iconName: string) => {
  const normalized = (iconName || '').toLowerCase().trim();

  switch (normalized) {
    case 'instagram':
      return <InstagramIcon className="w-5 h-5 text-pink-400" />;
    case 'tiktok':
      return <TikTokIcon className="w-5 h-5 text-cyan-400" />;
    case 'globe':
    case 'website':
    case 'web':
      return <Globe className="w-5 h-5 text-blue-400" />;
    case 'pdf':
    case 'file':
    case 'document':
      return <FileText className="w-5 h-5 text-red-400" />;
    case 'shopping-bag':
    case 'store':
    case 'shop':
      return <ShoppingBag className="w-5 h-5 text-emeraldAccent" />;
    case 'calendar':
    case 'book':
    case 'schedule':
      return <Calendar className="w-5 h-5 text-purple-400" />;
    case 'message-circle':
    case 'chat':
    case 'whatsapp':
      return <MessageCircle className="w-5 h-5 text-emerald-400" />;
    case 'youtube':
      return <YoutubeIcon className="w-5 h-5 text-red-500" />;
    case 'facebook':
      return <FacebookIcon className="w-5 h-5 text-blue-500" />;
    case 'twitter':
    case 'x':
      return <TwitterIcon className="w-5 h-5 text-sky-400" />;
    case 'mail':
    case 'email':
      return <Mail className="w-5 h-5 text-amber-400" />;
    case 'phone':
      return <Phone className="w-5 h-5 text-emerald-300" />;
    default:
      return <LinkIcon className="w-5 h-5 text-neonAccent" />;
  }
};

export const LinksList: React.FC<LinksListProps> = ({ links }) => {
  if (!links || links.length === 0) {
    return null;
  }

  const handleLinkClick = (id: string, url: string) => {
    fetch('/api/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'link', id }),
    }).catch((err) => console.error('Failed to record click', err));

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="w-full px-4 py-3 space-y-3">
      <div className="flex items-center gap-2">
        <ExternalLink className="w-4 h-4 text-neonAccent" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Enlaces Directos
        </h2>
      </div>

      <div className="flex flex-col space-y-2.5">
        {links.map((link) => (
          <button
            key={link.id}
            onClick={() => handleLinkClick(link.id, link.url)}
            className="w-full group p-4 rounded-xl bg-darkCard border border-emeraldAccent/30 hover:border-neonAccent text-white font-semibold flex items-center justify-between transition-all duration-300 hover:shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2 rounded-lg bg-gray-900/80 border border-gray-700/50 group-hover:border-emeraldAccent/50 transition-colors">
                {getIconComponent(link.icon)}
              </div>
              <span className="text-sm font-medium text-gray-100 group-hover:text-white transition-colors">
                {link.title}
              </span>
            </div>

            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-neonAccent group-hover:translate-x-1 transition-all duration-200" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default LinksList;
