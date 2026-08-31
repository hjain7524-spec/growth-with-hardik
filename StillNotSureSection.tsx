import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
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
    answer: "We don't just post content. We build your strategy around your audience, positioning, content and growth goals."
  },
  {
    number: '02',
    question: 'Do I need a big following to start?',
    answer: 'No. We work with creators at different stages. Your strategy is built around where you are now and where you want to go.'
  },
  {
    number: '03',
    question: 'Do I have to create everything myself?',
    answer: 'No. We guide you through what to create, how to create it and what to improve.'
  },
  {
    number: '04',
    question: 'How long before I see results?',
    answer: 'There is no fixed timeline. Growth depends on your starting point, content and consistency. Our goal is to build a system that compounds over time.'
  },
  {
    number: '05',
    question: 'Which plan is right for me?',
    answer: "Not sure? Tell us about your account and goals. We'll recommend the right starting point."
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
    <section className="py-16 sm:py-20 md:py-24 bg-black text-white px-4 sm:px-6 md:px-8 border-t border-zinc-900 selection:bg-blue-600/30 selection:text-white">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[26px] min-[360px]:text-[30px] sm:text-4xl md:text-5xl font-black tracking-tight uppercase text-white mb-2.5 sm:mb-3 leading-tight"
          >
            STILL NOT SURE?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-zinc-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-md mx-auto font-normal"
          >
            Answers to what creators usually ask before getting started.
          </motion.p>
        </div>

        {/* Numbered Accordion FAQ Cards */}
        <div className="space-y-3 sm:space-y-3.5">
          {FAQ_DATA.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                className={`border rounded-2xl sm:rounded-2xl transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-zinc-900/90 border-zinc-700 shadow-[0_8px_30px_rgba(0,0,0,0.35)]'
                    : 'bg-zinc-950/70 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/50'
                }`}
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer select-none touch-manipulation"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5 sm:gap-4.5 pr-2">
                    <span className="text-xs sm:text-sm font-bold text-zinc-500 font-mono shrink-0 tracking-wider">
                      {item.number}.
                    </span>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-white leading-snug">
                      {item.question}
                    </h3>
                  </div>

                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? 'bg-white text-black border-white rotate-180'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" strokeWidth={2.5} />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-0 sm:px-6 sm:pb-6 sm:pt-0 pl-11 sm:pl-14">
                        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Final CTA After FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 sm:mt-12 text-center"
        >
          <button
            onClick={handleCtaClick}
            className="inline-flex items-center justify-center gap-2.5 bg-white hover:bg-zinc-200 text-zinc-950 font-black text-sm sm:text-base px-8 sm:px-10 py-4 sm:py-4.5 rounded-full transition-all duration-200 active:scale-95 shadow-xl shadow-black/40 cursor-pointer touch-manipulation min-h-[50px] tracking-wide"
          >
            <span>BUILD MY GROWTH PLAN</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
