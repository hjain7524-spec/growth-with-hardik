import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Audit & Research',
    description: 'We audit your account, audience demographics, competitors, and historical performance to diagnose bottlenecks.'
  },
  {
    number: '02',
    title: 'Strategy & Positioning',
    description: 'We craft your unique brand positioning, core content pillars, and profile conversion architecture.'
  },
  {
    number: '03',
    title: 'Content System',
    description: 'We build tailored high-retention frameworks, hook libraries, and predictable ideation workflows.'
  },
  {
    number: '04',
    title: 'Execution',
    description: 'Our team handles end-to-end production—from script refinement and high-pace video editing to motion design.'
  },
  {
    number: '05',
    title: 'Optimization',
    description: 'We track retention curves, profile visit conversions, and algorithmic signals weekly to compound results.'
  },
  {
    number: '06',
    title: 'Growth & Reporting',
    description: 'Transparent performance tracking, follower-to-lead reporting, and recurring strategy sessions.'
  }
];

interface GrowthSystemProps {
  onRequestAudit?: () => void;
}

export const GrowthSystem: React.FC<GrowthSystemProps> = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section 
      id="process" 
      className="relative w-full bg-[#080808] text-white py-11 md:py-16 border-b border-[#292929]"
      aria-label="How We Work: The Growth System"
    >
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-5 sm:px-6 md:px-8">
        {/* Header Block */}
        <div className="text-center mb-7 sm:mb-9 flex flex-col items-center">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
            <span className="text-[12px] sm:text-[13px] font-semibold tracking-[0.08em] uppercase text-zinc-400">
              OUR PROCESS
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-[32px] sm:text-[38px] md:text-[44px] lg:text-[48px] font-bold tracking-tight text-white leading-[1.05]">
            How We Work
          </h2>

          {/* Supporting Text */}
          <p className="mt-2.5 text-[16px] sm:text-[17px] text-[#707070] font-normal leading-normal max-w-[550px] mx-auto">
            From strategy to execution, here's the simple process we use to help your brand grow consistently.
          </p>
        </div>

        {/* Compact Expandable Component */}
        <div className="max-w-[820px] mx-auto bg-[#0D0D0D] border border-[#292929] rounded-[20px] sm:rounded-[24px] overflow-hidden">
          <div className="p-6 sm:p-8 flex flex-col items-center text-center">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              className="inline-flex items-center justify-center gap-2.5 bg-white text-[#080808] hover:bg-zinc-100 rounded-full h-[50px] sm:h-[52px] min-h-[50px] py-3.5 px-7 text-[14px] sm:text-[15px] font-bold transition-all duration-200 active:scale-95 cursor-pointer touch-manipulation select-none"
            >
              <span>{isExpanded ? 'Hide Growth System' : 'View Our Growth System'}</span>
              <ArrowDown className={`w-4 h-4 text-[#080808] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            {!isExpanded && (
              <p className="mt-3 text-[13px] text-[#707070] font-medium">
                6 structured phases designed for scalable creator brands
              </p>
            )}
          </div>

          {/* Expandable Process Steps */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="px-5 sm:px-8 pb-6 sm:pb-8 border-t border-[#292929]">
                  <div className="divide-y divide-[#292929]">
                    {PROCESS_STEPS.map((step) => (
                      <div
                        key={step.number}
                        className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-5"
                      >
                        <span className="text-xs sm:text-sm font-bold font-mono tracking-wider text-[#E50914] flex-shrink-0 mt-0.5">
                          {step.number}
                        </span>
                        <div className="flex-1">
                          <h3 className="text-[16px] sm:text-[17px] font-bold text-white tracking-tight mb-1">
                            {step.title}
                          </h3>
                          <p className="text-zinc-400 text-[14px] leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
