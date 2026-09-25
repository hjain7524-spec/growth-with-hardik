import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { PRICING_PLANS } from './constants';
import { trackPricingCtaClick, trackGrowthPlanClick } from './analytics';

interface PricingSectionProps {
  onRequestAudit: (planName?: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onRequestAudit }) => {
  const [activeMobileIdx, setActiveMobileIdx] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollPosition = target.scrollLeft;
    const cardWidth = target.offsetWidth * 0.85;
    if (cardWidth > 0) {
      const newIndex = Math.min(
        Math.max(Math.round(scrollPosition / cardWidth), 0),
        PRICING_PLANS.length - 1
      );
      if (newIndex !== activeMobileIdx) {
        setActiveMobileIdx(newIndex);
      }
    }
  };

  const handleSelectPlan = (planName: string, ctaText: string) => {
    trackPricingCtaClick(planName, ctaText);
    trackGrowthPlanClick(`pricing_plan_${planName.toLowerCase().replace(/\s+/g, '_')}`, ctaText);
    onRequestAudit(planName);
  };

  return (
    <section 
      id="pricing" 
      className="relative w-full bg-[#F7F7F5] py-11 md:py-16 border-b border-[#D9D9D9] overflow-hidden"
      aria-label="Pricing and Growth Plans"
    >
      <div className="w-full max-w-[1200px] mx-auto px-5 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
            <span className="text-[12px] sm:text-[13px] font-semibold tracking-[0.08em] uppercase text-[#707070]">
              GROWTH INVESTMENT
            </span>
          </div>

          <h2 className="text-[32px] sm:text-[38px] md:text-[44px] lg:text-[48px] font-bold tracking-tight text-[#080808] leading-[1.05]">
            Choose Your Growth Plan
          </h2>

          <p className="mt-2.5 text-[16px] sm:text-[17px] text-[#707070] font-normal leading-normal max-w-[550px] mx-auto">
            Choose the plan that fits your growth stage.
          </p>
        </div>

        {/* Compact Pricing Layout: Desktop 3-col Grid, Mobile Swipe Carousel */}
        <div className="relative">
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex md:grid md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 items-stretch overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none no-scrollbar -mx-5 px-5 md:mx-0 md:px-0 pb-3 md:pb-0"
          >
            {PRICING_PLANS.map((plan) => {
              const isEmphasized = plan.highlighted;

              return (
                <div
                  key={plan.id}
                  className={`
                    relative flex flex-col justify-between
                    rounded-[20px] sm:rounded-[24px]
                    p-5 sm:p-6 md:p-7
                    flex-shrink-0 w-[84vw] max-w-[340px] sm:w-[360px] md:w-auto snap-center
                    transition-all duration-200
                    ${
                      isEmphasized
                        ? 'bg-[#080808] text-white border border-[#E50914] shadow-[0_4px_25px_rgba(229,9,20,0.12)]'
                        : 'bg-white text-[#080808] border border-[#D9D9D9] shadow-[0_2px_12px_rgba(0,0,0,0.02)]'
                    }
                  `}
                >
                  {/* Top Header Information */}
                  <div>
                    {/* Badge / Pill area */}
                    <div className="flex items-center justify-between gap-2 min-h-[24px] mb-2.5">
                      {isEmphasized ? (
                        <span className="inline-block bg-[#E50914] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          RECOMMENDED
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#707070]">
                          {plan.id === 'launch' ? 'STARTER' : 'ENTERPRISE'}
                        </span>
                      )}
                    </div>

                    {/* Plan Name */}
                    <h3
                      className={`text-[20px] sm:text-[22px] font-bold tracking-tight mb-1 ${
                        isEmphasized ? 'text-white' : 'text-[#080808]'
                      }`}
                    >
                      {plan.name}
                    </h3>

                    {/* Price */}
                    <div className="my-2">
                      <span className={`text-[24px] sm:text-[26px] font-bold tracking-tight ${isEmphasized ? 'text-white' : 'text-[#080808]'}`}>
                        {plan.price || 'Custom'}
                      </span>
                    </div>

                    {/* Plan Description */}
                    <p
                      className={`text-[13px] sm:text-[14px] font-normal leading-relaxed mb-4 min-h-0 sm:min-h-[38px] ${
                        isEmphasized ? 'text-zinc-400' : 'text-[#707070]'
                      }`}
                    >
                      {plan.description}
                    </p>

                    {/* Subtle Divider */}
                    <div
                      className={`w-full h-px mb-4 ${
                        isEmphasized ? 'bg-white/10' : 'bg-[#D9D9D9]'
                      }`}
                    />

                    {/* Feature Checklist */}
                    <div className="mb-5">
                      <p
                        className={`text-[11px] font-bold uppercase tracking-[0.1em] mb-2.5 ${
                          isEmphasized ? 'text-[#E50914]' : 'text-[#707070]'
                        }`}
                      >
                        WHAT'S INCLUDED
                      </p>
                      <ul className="space-y-2">
                        {plan.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2">
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                isEmphasized
                                  ? 'bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/50'
                                  : 'bg-zinc-100 text-[#080808] border border-[#D9D9D9]'
                              }`}
                            >
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                            <span
                              className={`text-[13px] sm:text-[13.5px] font-medium leading-snug ${
                                isEmphasized ? 'text-zinc-300' : 'text-zinc-700'
                              }`}
                            >
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className={`pt-3.5 border-t ${isEmphasized ? 'border-white/10' : 'border-[#D9D9D9]'}`}>
                    <button
                      type="button"
                      onClick={() => handleSelectPlan(plan.name, plan.ctaText || 'Get Started')}
                      className={`
                        w-full h-[46px] sm:h-[48px] min-h-[46px] sm:min-h-[48px] py-3.5 px-6 rounded-full font-bold text-[13.5px] tracking-tight
                        transition-all duration-200 active:scale-95 cursor-pointer touch-manipulation
                        flex items-center justify-center gap-2 select-none
                        ${
                          isEmphasized
                            ? 'bg-[#E50914] hover:bg-[#FF2B35] text-white shadow-sm'
                            : 'bg-[#080808] hover:bg-zinc-800 text-white'
                        }
                      `}
                    >
                      <span>{plan.ctaText || 'Get Started'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Carousel Swipe Indicator Dots */}
          <div className="flex md:hidden justify-center items-center gap-1.5 mt-3" aria-hidden="true">
            {PRICING_PLANS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  activeMobileIdx === i ? 'w-4 bg-[#E50914]' : 'w-1.5 bg-[#D9D9D9]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Transparent Reassurance */}
        <div className="mt-7 sm:mt-9 text-center">
          <p className="text-[13px] text-[#707070] font-medium">
            All plans include transparent delivery roadmaps, dedicated account strategy, and ongoing review calls.
          </p>
        </div>
      </div>
    </section>
  );
};
