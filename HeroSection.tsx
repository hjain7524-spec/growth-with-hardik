import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onRequestAudit: () => void;
  onViewServices: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onRequestAudit,
  onViewServices,
}) => {
  return (
    <section 
      id="hero" 
      className="relative w-full bg-white text-[#080808] flex flex-col justify-center overflow-hidden pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 border-b border-[#E5E5E5]"
    >
      {/* Subtle atmospheric depth: very faint red glow & low-opacity geometry */}
      <div 
        className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-20"
        aria-hidden="true"
      >
        <svg 
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[520px] sm:w-[680px] lg:w-[840px] h-[520px] sm:h-[680px] lg:h-[840px] text-black/[0.06]" 
          viewBox="0 0 800 800" 
          fill="none"
        >
          <circle cx="500" cy="400" r="160" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="500" cy="400" r="280" stroke="currentColor" strokeWidth="1" />
        </svg>

        {/* Faint Red Ambient Glow */}
        <div className="absolute top-1/4 -right-16 w-[320px] sm:w-[420px] h-[320px] sm:h-[420px] bg-[#E50914]/[0.05] rounded-full blur-[100px] pointer-events-none" />
      </div>

      {/* Main Hero Container */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-5 sm:px-6 md:px-8">
        <div className="max-w-[850px]">
          
          {/* Eyebrow Label */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 mb-3.5 sm:mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
            <span className="text-[12px] sm:text-[13px] font-semibold tracking-[0.08em] uppercase text-[#707070]">
              SOCIAL MEDIA · CONTENT · GROWTH
            </span>
          </motion.div>

          {/* H1 Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="text-[38px] sm:text-[48px] md:text-[56px] lg:text-[64px] font-bold tracking-tight leading-[1.02] text-[#080808] mb-3.5 sm:mb-4 text-left max-w-[850px]"
          >
            <span className="block text-[#080808]">Grow Your Instagram.</span>
            <span className="block text-[#E50914]">
              Build a Personal Brand.
            </span>
          </motion.h1>

          {/* Supporting Copy */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[16px] sm:text-[17px] md:text-[18px] text-[#52525B] font-normal leading-[1.55] max-w-[620px] mb-6 sm:mb-7 text-left"
          >
            Turn your content into consistent growth, stronger positioning, and qualified leads.
          </motion.p>

          {/* CTA Area */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-start w-full"
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              {/* Primary CTA */}
              <button
                onClick={onRequestAudit}
                className="group relative bg-[#080808] text-white hover:bg-zinc-800 rounded-full h-[52px] sm:h-[54px] min-h-[52px] py-3.5 px-7 text-[15px] font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] cursor-pointer touch-manipulation w-full sm:w-auto select-none"
              >
                <span>Free Growth Audit</span>
                <ArrowRight className="w-4 h-4 text-white transition-transform duration-200 ease-out group-hover:translate-x-1" />
              </button>

              {/* Secondary CTA */}
              <button
                onClick={onViewServices}
                className="group relative border border-[#080808] hover:border-black bg-white hover:bg-zinc-50 text-[#080808] rounded-full h-[52px] sm:h-[54px] min-h-[52px] py-3.5 px-7 text-[15px] font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] cursor-pointer touch-manipulation w-full sm:w-auto select-none"
              >
                <span>Explore Services</span>
                <ArrowRight className="w-4 h-4 text-[#080808] transition-transform duration-200 ease-out group-hover:translate-x-1" />
              </button>
            </div>

            {/* Credibility line */}
            <div className="mt-3.5 sm:mt-4 flex items-center gap-2 text-[#707070] text-[13px] font-medium tracking-tight select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
              <span>65,000+ creators analyzed</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
