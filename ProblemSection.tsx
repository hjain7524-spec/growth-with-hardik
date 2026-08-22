import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface ProblemItem {
  id: string;
  title: string;
  content: string;
}

const PROBLEM_ITEMS: ProblemItem[] = [
  {
    id: 'posting-not-growing',
    title: 'Posting consistently but not growing?',
    content: "You're creating content regularly, but your reach, followers, or engagement aren't moving."
  },
  {
    id: 'views-not-followers',
    title: 'Getting views but not followers?',
    content: "Your content gets attention, but viewers aren't becoming part of your audience."
  },
  {
    id: 'followers-not-clients',
    title: 'Growing followers but not getting clients?',
    content: "Your audience is growing, but your Instagram isn't translating that attention into enquiries or opportunities."
  },
  {
    id: 'dont-know-content',
    title: "Don't know what content to create?",
    content: "You're constantly searching for ideas instead of having a clear content system."
  },
  {
    id: 'spending-too-much-time',
    title: 'Spending too much time creating content?',
    content: 'Content takes too much time and effort without producing consistent results.'
  }
];

export const ProblemSection: React.FC = () => {
  // First accordion open by default
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(prevIndex => (prevIndex === index ? null : index));
  };

  return (
    <section id="problem" className="py-12 sm:py-16 md:py-24 bg-black text-white relative overflow-hidden px-5 sm:px-6 md:px-8 border-t border-zinc-900">
      {/* Subtle background ambient radial lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-5 sm:mb-8 md:mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[26px] min-[360px]:text-[28px] sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-1.5 sm:mb-2.5 leading-[1.08] sm:leading-[1.12] max-w-[320px] sm:max-w-none mx-auto"
          >
            What’s Holding Your Instagram Back?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-gray-400 text-[14px] sm:text-base md:text-lg font-normal max-w-[320px] sm:max-w-xl mx-auto leading-[1.4] sm:leading-[1.5]"
          >
            Here are the biggest bottlenecks holding creators back.
          </motion.p>
        </div>

        {/* Accordion Cards Container - Clean 1-Column Layout */}
        <div className="space-y-2 sm:space-y-2.5 max-w-3xl mx-auto">
          {PROBLEM_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                className={`rounded-xl sm:rounded-2xl transition-all duration-300 border ${
                  isOpen
                    ? 'bg-zinc-900/90 border-blue-500/40 shadow-lg shadow-blue-950/20'
                    : 'bg-zinc-950/80 hover:bg-zinc-900/70 border-zinc-800/80 hover:border-zinc-700/80'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  aria-expanded={isOpen}
                  className="w-full text-left px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 sm:gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl sm:rounded-2xl cursor-pointer group min-h-[46px] sm:min-h-[52px] touch-manipulation"
                >
                  <div className="flex items-center gap-2.5 sm:gap-4 pr-2">
                    <span className={`text-xs sm:text-sm font-extrabold transition-colors ${isOpen ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-400'}`}>
                      0{index + 1}
                    </span>
                    <h3 className={`text-[14px] sm:text-base md:text-[17px] font-bold tracking-tight transition-colors ${isOpen ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>
                      {item.title}
                    </h3>
                  </div>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors ${
                      isOpen
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-800/80 text-gray-400 group-hover:bg-zinc-700 group-hover:text-white'
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-6 pb-3.5 sm:pb-5 pt-0.5 text-gray-300 font-normal text-xs sm:text-base leading-[1.5] pl-8 sm:pl-14 pr-4 sm:pr-8 border-t border-zinc-800/50 mt-0.5">
                        <p className="max-w-2xl text-gray-300">
                          {item.content}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
