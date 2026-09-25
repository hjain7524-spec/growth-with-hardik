import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { BRAND_EMAIL, WHATSAPP_URL } from './constants';
import { trackGrowthAuditClick, trackWhatsAppClick } from './analytics';
import { WhatsAppIcon } from './WhatsAppIcon';

interface MobileConversionBarProps {
  onRequestAudit: () => void;
}

export const MobileConversionBar: React.FC<MobileConversionBarProps> = ({ onRequestAudit }) => {
  const handleTalkClick = () => {
    trackGrowthAuditClick('mobile_sticky_bar', "Let's Talk");
    onRequestAudit();
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-[#292929] bg-[#080808] shadow-[0_-8px_30px_rgba(0,0,0,0.6)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="Quick Action Bar"
    >
      <div className="flex w-full h-[58px] items-stretch">
        {/* WhatsApp */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick('mobile_sticky_bar')}
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#080808] active:bg-zinc-900 text-zinc-300 font-semibold text-[13px] tracking-tight transition-colors duration-150 select-none border-r border-[#292929] touch-manipulation min-h-[44px]"
          aria-label="WhatsApp"
        >
          <WhatsAppIcon className="w-4 h-4 fill-current text-[#25D366]" />
          <span>WhatsApp</span>
        </a>

        {/* Email */}
        <a
          href={`mailto:${BRAND_EMAIL}`}
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#080808] active:bg-zinc-900 text-zinc-300 font-semibold text-[13px] tracking-tight transition-colors duration-150 select-none border-r border-[#292929] touch-manipulation min-h-[44px]"
          aria-label="Send Email"
        >
          <Mail className="w-4 h-4 text-zinc-400" />
          <span>Email</span>
        </a>

        {/* Let's Talk */}
        <button
          type="button"
          onClick={handleTalkClick}
          className="flex-[1.15] flex items-center justify-center gap-1.5 bg-[#E50914] active:bg-[#C20810] hover:bg-[#FF2B35] text-white font-bold text-[13px] tracking-tight transition-colors duration-150 cursor-pointer select-none touch-manipulation min-h-[44px]"
          aria-label="Let's Talk"
        >
          <span>Let's Talk</span>
          <ArrowRight className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
    </div>
  );
};
