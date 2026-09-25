import React from 'react';
import { Instagram, Mail } from 'lucide-react';
import { Logo } from './BrandLogo';
import { BRAND_EMAIL, INSTAGRAM_HANDLE, WHATSAPP_URL } from './constants';
import { WhatsAppIcon } from './WhatsAppIcon';
import { trackWhatsAppClick } from './analytics';
import { ViewType } from './types';

interface FooterProps {
  onViewChange: (view: ViewType) => void;
  onShowPrivacy: () => void;
  onShowTerms: () => void;
  onRequestAudit?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onViewChange,
  onShowPrivacy,
  onShowTerms,
  onRequestAudit
}) => {
  const scrollToSection = (id: string) => {
    onViewChange('home');
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleContactClick = () => {
    if (onRequestAudit) {
      onRequestAudit();
    } else {
      window.dispatchEvent(new CustomEvent('open_growth_audit_modal'));
    }
  };

  return (
    <footer 
      className="relative w-full bg-[#080808] text-white pt-10 sm:pt-12 pb-20 sm:pb-10 border-t border-[#292929]"
      aria-label="Site Footer"
    >
      <div className="w-full max-w-[1200px] mx-auto px-5 sm:px-6 md:px-8">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#292929]">
          {/* Brand & Description */}
          <div className="max-w-md">
            <div className="mb-2.5">
              <Logo 
                isDark={true} 
                onClick={() => { 
                  onViewChange('home'); 
                  window.scrollTo({ top: 0, behavior: 'smooth' }); 
                }} 
              />
            </div>
            <p className="text-[14px] text-zinc-400 font-normal leading-relaxed">
              Strategic content and social media growth for creators, founders, and personal brands.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-6 text-[14px] font-medium text-zinc-300">
            <button
              type="button"
              onClick={() => onViewChange('services')}
              className="py-3 px-2.5 min-h-[44px] inline-flex items-center hover:text-white transition-colors cursor-pointer touch-manipulation"
            >
              Services
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('proof-results')}
              className="py-3 px-2.5 min-h-[44px] inline-flex items-center hover:text-white transition-colors cursor-pointer touch-manipulation"
            >
              Results
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('process')}
              className="py-3 px-2.5 min-h-[44px] inline-flex items-center hover:text-white transition-colors cursor-pointer touch-manipulation"
            >
              Process
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('pricing')}
              className="py-3 px-2.5 min-h-[44px] inline-flex items-center hover:text-white transition-colors cursor-pointer touch-manipulation"
            >
              Pricing
            </button>
            <button
              type="button"
              onClick={handleContactClick}
              className="py-3 px-2.5 min-h-[44px] inline-flex items-center hover:text-white transition-colors cursor-pointer touch-manipulation"
            >
              Contact
            </button>
          </div>

          {/* Social & Contact Icons */}
          <div className="flex items-center gap-2">
            <a
              href={`https://instagram.com/${INSTAGRAM_HANDLE.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-11 h-11 min-w-[44px] min-h-[44px] p-2.5 rounded-full border border-[#292929] bg-white/[0.04] hover:bg-white/[0.1] hover:border-white/30 flex items-center justify-center text-zinc-400 hover:text-white transition-all touch-manipulation"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('footer_icon')}
              aria-label="Chat on WhatsApp"
              className="w-11 h-11 min-w-[44px] min-h-[44px] p-2.5 rounded-full border border-[#292929] bg-white/[0.04] hover:bg-white/[0.1] hover:border-white/30 hover:text-[#25D366] flex items-center justify-center text-zinc-400 transition-all touch-manipulation"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current" />
            </a>
            <a
              href={`mailto:${BRAND_EMAIL}`}
              aria-label="Email"
              className="w-11 h-11 min-w-[44px] min-h-[44px] p-2.5 rounded-full border border-[#292929] bg-white/[0.04] hover:bg-white/[0.1] hover:border-white/30 flex items-center justify-center text-zinc-400 hover:text-white transition-all touch-manipulation"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[13px] text-zinc-500">
          <p>© 2026 GrowthWithHardik. All rights reserved.</p>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={onShowPrivacy}
              className="py-3 px-2.5 min-h-[44px] inline-flex items-center hover:text-zinc-300 transition-colors cursor-pointer touch-manipulation"
            >
              Privacy Policy
            </button>
            <span className="text-[#292929] select-none">•</span>
            <button
              type="button"
              onClick={onShowTerms}
              className="py-3 px-2.5 min-h-[44px] inline-flex items-center hover:text-zinc-300 transition-colors cursor-pointer touch-manipulation"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
