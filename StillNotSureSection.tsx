import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { trackGrowthPlanClick, trackFinalCtaClick } from './analytics';

interface FAQItem {
  number: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    number: '01',
    question: 'Will this actually help me grow?',
    answer: "Yes. We don't just post content randomly. We build a structured growth engine centered around your target audience, high-retention storytelling, profile conversion architecture, and algorithmic signals designed to turn views into genuine authority and opportunities."
  },
  {
    number: '02',
    question: 'Do I need a big following to start?',
    answer: "No, absolutely not. We work with creators and businesses starting from scratch as well as those with established audiences. Your roadmap is tailored specifically to where you are right now and where you want to go."
  },
  {
    number: '03',
    question: 'Do I have to create everything myself?',
    answer: "No. Our team handles the heavy lifting—from audience research, hook strategy, and script refinement to professional video editing, motion design, and scheduling. You simply record with our guidance or approve deliverables."
  },
  {
    number: '04',
    question: 'How long before I see results?',
    answer: "Most creators experience significant improvements in engagement and watch time within the first 30 to 60 days. Our core objective is building a predictable, high-retention content system that compounds continuously month after month."
  },
  {
    number: '05',
    question: 'Which plan is right for me?',
    answer: "If you want to build a consistent presence, Creator Launch gives you the foundational engine. If you want aggressive audience scaling and inbound client acquisition, Growth System is our recommended tier. If you want full-scale multi-platform dominance, Scale provides dedicated end-to-end production."
  }
];

interface StillNotSureSectionProps {
  onRequestAudit?: () => void;
}

export const StillNotSureSection: React.FC<StillNotSureSectionProps> = ({ onRequestAudit }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  const handleCtaClick = () => {
    trackFinalCtaClick('still_not_sure_section', 'BUILD MY GROWTH PLAN');
    trackGrowthPlanClick('still_not_sure_section', 'BUILD MY GROWTH PLAN');
    if (onRequestAudit) {
      onRequestAudit();
    } else {
      window.dispatchEvent(new CustomEvent('open_growth_audit_modal'));
    }
  };

  return (
    <section 
      id="faq"
      className="relative w-full py-11 md:py-16 bg-[#080808] text-white border-b border-[#292929] overflow-hidden"
      aria-label="Frequently Asked Questions"
    >
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-5 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
            <span className="text-[12px] sm:text-[13px] font-semibold tracking-[0.08em] uppercase text-zinc-400">
              FREQUENTLY ASKED
            </span>
          </div>

          <h2 className="text-[32px] sm:text-[38px] md:text-[44px] lg:text-[48px] font-bold tracking-tight text-white uppercase leading-[1.05]">
            STILL NOT SURE?
          </h2>

          <p className="mt-2.5 text-[16px] sm:text-[17px] text-[#707070] font-normal leading-normal max-w-[550px] mx-auto">
            Answers to what creators usually ask before getting started.
          </p>
        </div>

        {/* Accordion Cards (compact 72-84px height) */}
        <div className="max-w-[820px] mx-auto space-y-2.5 sm:space-y-3">
          {FAQ_DATA.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.number}
                className={`
                  rounded-[18px] sm:rounded-[20px]
                  border transition-all duration-200 overflow-hidden
                  ${
                    isOpen
                      ? 'bg-[#111111] border-[#E50914] shadow-[0_4px_20px_rgba(229,9,20,0.12)]'
                      : 'bg-[#0D0D0D] border-[#292929] hover:bg-[#121212]'
                  }
                `}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="w-full text-left px-4 py-3.5 sm:px-6 sm:py-4 flex items-center justify-between gap-3 sm:gap-4 cursor-pointer select-none touch-manipulation min-h-[64px] sm:min-h-[72px]"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 pr-2">
                    <span 
                      className={`text-xs sm:text-sm font-bold font-mono tracking-wider shrink-0 transition-colors duration-200 ${
                        isOpen ? 'text-[#E50914]' : 'text-zinc-500'
                      }`}
                    >
                      {item.number}
                    </span>

                    <h3 className="text-[15px] sm:text-[17px] font-bold tracking-tight text-white leading-snug truncate sm:whitespace-normal">
                      {item.question}
                    </h3>
                  </div>

                  <div
                    className={`
                      w-8 h-8 rounded-full border flex items-center justify-center shrink-0
                      transition-all duration-200
                      ${
                        isOpen
                          ? 'bg-[#E50914] border-[#E50914] text-white'
                          : 'bg-white/[0.04] border-[#292929] text-zinc-400 group-hover:text-white'
                      }
                    `}
                  >
                    <ArrowDown className={`w-3.5 h-3.5 stroke-[2.2] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="faq-answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-6 pb-4 pt-1">
                        <div className="pt-2.5 border-t border-white/[0.08] ml-7 sm:ml-8">
                          <p className="text-[14px] sm:text-[15px] text-zinc-300 leading-relaxed font-normal">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* CTA Button Underneath */}
        <div className="mt-8 sm:mt-10 text-center flex flex-col items-center">
          <button
            type="button"
            onClick={handleCtaClick}
            className="group relative bg-white hover:bg-zinc-100 text-[#080808] px-7 h-[50px] sm:h-[52px] min-h-[50px] py-3.5 rounded-full font-bold text-[14px] sm:text-[15px] tracking-tight transition-all duration-200 active:scale-95 cursor-pointer touch-manipulation flex items-center justify-center gap-2 select-none w-full sm:w-auto"
          >
            <span>BUILD MY GROWTH PLAN</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
