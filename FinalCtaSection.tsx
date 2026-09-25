import React from 'react';
import { trackGrowthAuditClick, trackWhatsAppClick } from './analytics';
import { WHATSAPP_URL } from './constants';
import { WhatsAppIcon } from './WhatsAppIcon';

interface FinalCtaSectionProps {
  onRequestAudit?: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onRequestAudit }) => {
  const handleClick = () => {
    trackGrowthAuditClick('final_cta_banner', 'Book a Consultation');
    if (onRequestAudit) {
      onRequestAudit();
    } else {
      window.dispatchEvent(new CustomEvent('open_growth_audit_modal'));
    }
  };

  return (
    <section 
      id="cta"
      className="relative w-full bg-[#E50914] text-white py-9 sm:py-11 md:py-12"
      aria-label="Let's make something great together"
    >
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-5 sm:px-6 md:px-8 text-center flex flex-col items-center justify-center">
        {/* Main Heading: bold and prominent, compact sizing */}
        <h2 className="text-[26px] sm:text-[32px] md:text-[38px] lg:text-[42px] font-bold tracking-tight text-white leading-[1.1] max-w-[700px]">
          <span className="block">Let’s make something</span>
          <span className="block">great together.</span>
        </h2>

        {/* Subtitle text: compact, readable */}
        <p className="mt-2.5 sm:mt-3 text-[14px] sm:text-[15px] md:text-[16px] text-white font-medium leading-snug max-w-[520px]">
          <span className="block">Still waiting for us to make the first move?</span>
          <span className="block">Don’t be shy - get in touch.</span>
        </p>

        {/* CTA Buttons: compact black rounded button with white text and subtle WhatsApp option */}
        <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleClick}
            className="group relative bg-[#080808] hover:bg-zinc-900 text-white rounded-full h-[46px] sm:h-[48px] min-h-[46px] min-w-[44px] py-3.5 px-7 text-[14px] sm:text-[14.5px] font-bold inline-flex items-center justify-center gap-2 transition-all duration-150 active:scale-95 cursor-pointer shadow-sm select-none touch-manipulation w-full sm:w-auto"
          >
            <span>Book a Consultation</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </button>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick('final_cta')}
            className="group relative bg-white/10 hover:bg-white/20 active:bg-white/25 text-white border border-white/25 rounded-full h-[46px] sm:h-[48px] min-h-[46px] min-w-[44px] py-3.5 px-6 text-[14px] sm:text-[14.5px] font-semibold inline-flex items-center justify-center gap-2 transition-all duration-150 active:scale-95 cursor-pointer backdrop-blur-sm select-none touch-manipulation w-full sm:w-auto"
            aria-label="Chat on WhatsApp"
          >
            <WhatsAppIcon className="w-4 h-4 fill-current text-white" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
