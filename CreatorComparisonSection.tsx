import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Minus } from 'lucide-react';
import { trackGrowthAuditClick } from './analytics';

interface CreatorComparisonSectionProps {
  onRequestAudit?: () => void;
}

export const CreatorComparisonSection: React.FC<CreatorComparisonSectionProps> = ({ onRequestAudit }) => {
  const handleOpenAudit = () => {
    trackGrowthAuditClick('creator_comparison_section', 'Build My Growth Plan');
    if (onRequestAudit) {
      onRequestAudit();
    } else {
      window.dispatchEvent(new CustomEvent('open_growth_audit_modal'));
    }
  };

  return (
    <section 
      id="comparison" 
      className="relative w-full py-11 md:py-16 bg-[#F7F7F5] text-[#080808] border-b border-[#D9D9D9]"
      aria-label="Creator Approach Comparison"
    >
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-5 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
            <span className="text-[12px] sm:text-[13px] font-semibold tracking-[0.08em] uppercase text-[#707070]">
              STRATEGIC PERSPECTIVE
            </span>
          </div>

          <h2 className="text-[32px] sm:text-[38px] md:text-[44px] lg:text-[48px] font-bold tracking-tight text-[#080808] leading-[1.05]">
            Which Creator Are You?
          </h2>

          <p className="mt-2.5 text-[16px] sm:text-[17px] text-[#707070] font-normal leading-normal max-w-[550px] mx-auto">
            Your growth depends on how you approach your content.
          </p>
        </div>

        {/* Two Compact Side-by-Side Cards on Desktop, Stacked on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-[960px] mx-auto">
          
          {/* CARD A: THE CONTENT GRINDER */}
          <div className="bg-white border border-[#D9D9D9] rounded-[20px] sm:rounded-[24px] p-6 sm:p-7 md:p-8 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div>
              <span className="text-[11px] sm:text-[12px] font-bold tracking-[0.12em] uppercase text-[#707070] block mb-1">
                APPROACH A
              </span>
              <h3 className="text-[20px] sm:text-[22px] md:text-[24px] font-bold tracking-tight text-[#080808]">
                THE CONTENT GRINDER
              </h3>
              <p className="text-[#707070] text-[14px] sm:text-[15px] mt-1 font-medium">
                Posts whenever they can.
              </p>

              <div className="pt-4 sm:pt-5 mt-4 sm:mt-5 border-t border-[#D9D9D9]">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2.5 text-[#080808] text-[14px] sm:text-[15px] font-medium leading-tight">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#707070] flex-shrink-0" />
                    <span>Posts without a clear plan</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-[#080808] text-[14px] sm:text-[15px] font-medium leading-tight">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#707070] flex-shrink-0" />
                    <span>Chases trends</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-[#080808] text-[14px] sm:text-[15px] font-medium leading-tight">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#707070] flex-shrink-0" />
                    <span>Gets random results</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-[#080808] text-[14px] sm:text-[15px] font-medium leading-tight">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#707070] flex-shrink-0" />
                    <span>Struggles to turn attention into opportunities</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* CARD B: THE GROWTH CREATOR */}
          <div className="bg-[#080808] text-white border border-[#E50914] rounded-[20px] sm:rounded-[24px] p-6 sm:p-7 md:p-8 flex flex-col justify-between shadow-[0_4px_25px_rgba(229,9,20,0.12)] relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[11px] sm:text-[12px] font-bold tracking-[0.12em] uppercase text-[#E50914] block">
                  APPROACH B
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-white bg-[#E50914] px-2.5 py-0.5 rounded-full">
                  Recommended System
                </span>
              </div>
              <h3 className="text-[20px] sm:text-[22px] md:text-[24px] font-bold tracking-tight text-white">
                THE GROWTH CREATOR
              </h3>
              <p className="text-zinc-400 text-[14px] sm:text-[15px] mt-1 font-medium">
                Creates with a clear system.
              </p>

              <div className="pt-4 sm:pt-5 mt-4 sm:mt-5 border-t border-white/10">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2.5 text-zinc-100 text-[14px] sm:text-[15px] font-medium leading-tight">
                    <div className="w-4 h-4 rounded-full bg-[#E50914]/20 border border-[#E50914]/50 flex items-center justify-center flex-shrink-0 text-[#E50914]">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Knows what their audience wants</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-zinc-100 text-[14px] sm:text-[15px] font-medium leading-tight">
                    <div className="w-4 h-4 rounded-full bg-[#E50914]/20 border border-[#E50914]/50 flex items-center justify-center flex-shrink-0 text-[#E50914]">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Creates with purpose</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-zinc-100 text-[14px] sm:text-[15px] font-medium leading-tight">
                    <div className="w-4 h-4 rounded-full bg-[#E50914]/20 border border-[#E50914]/50 flex items-center justify-center flex-shrink-0 text-[#E50914]">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Builds authority consistently</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-zinc-100 text-[14px] sm:text-[15px] font-medium leading-tight">
                    <div className="w-4 h-4 rounded-full bg-[#E50914]/20 border border-[#E50914]/50 flex items-center justify-center flex-shrink-0 text-[#E50914]">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Turns attention into opportunities</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>

        {/* CTA Underneath */}
        <div className="text-center mt-7 sm:mt-8">
          <button
            onClick={handleOpenAudit}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#080808] text-white hover:bg-zinc-800 px-7 h-[50px] sm:h-[52px] min-h-[50px] py-3.5 rounded-full text-[14px] sm:text-[15px] font-bold transition-all duration-200 cursor-pointer active:scale-95 touch-manipulation shadow-sm"
          >
            <span>Build My Growth Plan</span>
            <ArrowRight className="w-4 h-4 text-[#E50914]" />
          </button>
        </div>
      </div>
    </section>
  );
};
