import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

interface ProblemItem {
  number: string;
  title: string;
  description: string;
}

const PROBLEMS: ProblemItem[] = [
  {
    number: '01',
    title: 'Posting consistently but not growing?',
    description: "You're creating content regularly, but your reach, followers, or engagement aren't moving."
  },
  {
    number: '02',
    title: 'Getting views but not followers?',
    description: "Your reels catch attention, but profile visitors swipe away without following because your positioning, profile authority, and hook-to-follow payoff aren't dialed in."
  },
  {
    number: '03',
    title: 'Growing followers but not getting clients?',
    description: "You have an audience that watches and likes, but without a clear conversion engine and DM qualification funnel, your attention fails to turn into qualified pipeline and paying clients."
  },
  {
    number: '04',
    title: "Don't know what content to create?",
    description: "You are stuck in perpetual guesswork every morning without a predictable content matrix, repeatable high-retention formats, or audience-validated content pillars."
  },
  {
    number: '05',
    title: 'Spending too much time creating content?',
    description: "You are burning 20+ hours a week scripting, filming, and editing from scratch instead of running your core business and letting a dedicated growth system handle execution."
  }
];

export const ProblemSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <section 
      id="problem" 
      className="relative w-full bg-[#080808] text-white py-11 md:py-16 border-b border-[#292929]"
      aria-label="Core bottlenecks and challenges in Instagram growth"
    >
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-5 sm:px-6 md:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
            <span className="text-[12px] sm:text-[13px] font-semibold tracking-[0.08em] uppercase text-zinc-400">
              BOTTLENECK DIAGNOSIS
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-[32px] sm:text-[38px] md:text-[44px] lg:text-[48px] font-bold tracking-tight text-white leading-[1.05] max-w-[700px]">
            <span className="block">Why Isn't Your</span>
            <span className="block text-zinc-200">Instagram Growing?</span>
          </h2>

          {/* Subtitle */}
          <p className="mt-2.5 text-[16px] sm:text-[17px] text-[#707070] font-normal leading-normal max-w-[550px]">
            Here are the biggest bottlenecks holding creators back.
          </p>
        </div>

        {/* Compact Accordion List (70-90px collapsed height) */}
        <div className="max-w-[820px] mx-auto space-y-2.5 sm:space-y-3">
          {PROBLEMS.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={item.number}
                className={`
                  rounded-[18px] sm:rounded-[20px]
                  transition-all duration-200 ease-out
                  border overflow-hidden
                  ${isOpen 
                    ? 'bg-[#111111] border-[#E50914] shadow-[0_4px_20px_rgba(229,9,20,0.12)]' 
                    : 'bg-[#0D0D0D] hover:bg-[#121212] border-[#292929]'
                  }
                `}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  aria-expanded={isOpen}
                  className="w-full text-left px-4 py-3.5 sm:px-6 sm:py-4 flex items-center justify-between gap-3 sm:gap-4 cursor-pointer select-none touch-manipulation group min-h-[64px] sm:min-h-[72px]"
                >
                  {/* Left: Number + Title */}
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 pr-2">
                    <span 
                      className={`
                        text-xs sm:text-sm font-bold font-mono tracking-wider transition-colors duration-200 flex-shrink-0
                        ${isOpen ? 'text-[#E50914]' : 'text-zinc-500 group-hover:text-zinc-400'}
                      `}
                    >
                      {item.number}
                    </span>

                    <h3 
                      className={`
                        text-[15px] sm:text-[17px] font-bold tracking-tight leading-snug transition-colors duration-200 truncate sm:whitespace-normal
                        ${isOpen ? 'text-white' : 'text-zinc-200 group-hover:text-white'}
                      `}
                    >
                      {item.title}
                    </h3>
                  </div>

                  {/* Right: Compact Icon Button */}
                  <div 
                    className={`
                      w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border transition-all duration-200
                      ${isOpen
                        ? 'bg-[#E50914] border-[#E50914] text-white'
                        : 'bg-white/[0.04] border-[#292929] text-zinc-400 group-hover:text-white'
                      }
                    `}
                  >
                    <ArrowDown className={`w-3.5 h-3.5 stroke-[2.2] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Open State Body */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-6 pb-4 pt-1">
                        <div className="pt-2.5 border-t border-white/[0.08] ml-7 sm:ml-8">
                          <p className="text-zinc-300 text-[14px] sm:text-[15px] font-normal leading-relaxed">
                            {item.description}
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
      </div>
    </section>
  );
};
