import React from 'react';
import { ArrowRight } from 'lucide-react';
import { trackGrowthAuditClick } from './analytics';

interface ServiceCardData {
  title: string;
  description: string;
  tags: string[];
  cta: string;
  analyticsKey: string;
}

const SERVICE_CARDS: ServiceCardData[] = [
  {
    title: 'Social Media Management',
    description: 'Content, strategy and execution designed to turn attention into consistent growth.',
    tags: [
      'Content Strategy',
      'Reels & Content',
      'Community Management',
      'Growth Strategy'
    ],
    cta: 'Explore Social Media',
    analyticsKey: 'service_card_smm'
  },
  {
    title: 'Personal Branding',
    description: 'Build a recognizable personal brand that attracts attention, authority and opportunities.',
    tags: [
      'Brand Strategy',
      'Content Positioning',
      'Personal Brand Content',
      'Audience Growth'
    ],
    cta: 'Explore Personal Branding',
    analyticsKey: 'service_card_personal_branding'
  }
];

interface CoreServicesSectionProps {
  onRequestAudit?: () => void;
}

export const CoreServicesSection: React.FC<CoreServicesSectionProps> = ({ onRequestAudit }) => {
  const handleCtaClick = (title: string, cta: string, analyticsKey: string) => {
    trackGrowthAuditClick(analyticsKey, `${cta} - ${title}`);
    if (onRequestAudit) {
      onRequestAudit();
    } else {
      window.dispatchEvent(new CustomEvent('open_growth_audit_modal'));
    }
  };

  return (
    <section 
      id="services-overview"
      className="relative w-full bg-white text-[#080808] py-10 sm:py-12 md:py-14 border-b border-[#E5E5E5]"
      aria-label="Core Services: Social Media Management and Personal Branding"
    >
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-5 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 max-w-[760px] mx-auto">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-2 mb-2.5 sm:mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
            <span className="text-[12px] sm:text-[13px] font-semibold tracking-[0.08em] uppercase text-[#707070]">
              CORE SERVICES
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="text-[30px] sm:text-[36px] md:text-[42px] lg:text-[46px] font-bold tracking-tight text-[#080808] leading-[1.08]">
            What We Can Build Together
          </h2>

          {/* Short Supporting Line */}
          <p className="mt-2.5 sm:mt-3 text-[15px] sm:text-[16px] md:text-[17px] text-[#707070] font-normal leading-relaxed max-w-[620px] mx-auto">
            Two focused services designed to turn your content into consistent growth, stronger positioning, and real opportunities.
          </p>
        </div>

        {/* 2 Large Service Cards: Side-by-side on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-7 max-w-[1100px] mx-auto">
          {SERVICE_CARDS.map((card) => (
            <div
              key={card.title}
              className="bg-[#E50914] text-white rounded-[24px] sm:rounded-[28px] p-6 sm:p-8 md:p-9 flex flex-col justify-between shadow-[0_4px_20px_rgba(229,9,20,0.15)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(229,9,20,0.22)]"
            >
              {/* Top: Title, Description, Tags */}
              <div>
                <h3 className="text-[26px] sm:text-[30px] md:text-[34px] font-bold tracking-tight text-white leading-[1.12]">
                  {card.title}
                </h3>
                <p className="text-[14.5px] sm:text-[15.5px] text-white font-medium leading-relaxed mt-2.5 max-w-[440px]">
                  {card.description}
                </p>

                {/* Pill-shaped Tags */}
                <div className="flex flex-wrap gap-2 pt-5 sm:pt-6">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-[12px] sm:text-[12.5px] font-semibold bg-white/10 border border-white text-white tracking-tight select-none"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom: Black rounded CTA button */}
              <div className="pt-6 sm:pt-8 mt-auto">
                <button
                  onClick={() => handleCtaClick(card.title, card.cta, card.analyticsKey)}
                  className="group/btn inline-flex items-center justify-center gap-2 bg-[#080808] hover:bg-zinc-900 text-white font-bold text-[14px] sm:text-[15px] h-[48px] min-h-[48px] py-3.5 px-6.5 rounded-full transition-all duration-150 active:scale-[0.98] cursor-pointer shadow-sm w-full sm:w-auto touch-manipulation"
                >
                  <span>{card.cta}</span>
                  <ArrowRight className="w-4 h-4 text-white transition-transform duration-200 group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
