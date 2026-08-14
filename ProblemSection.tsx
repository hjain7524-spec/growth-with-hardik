import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, AlertCircle, HelpCircle } from 'lucide-react';

interface ProblemItem {
  id: string;
  title: string;
  content: string;
}

const PROBLEM_ITEMS: ProblemItem[] = [
  {
    id: 'consistency-growth',
    title: 'Posting consistently but not growing?',
    content: "You're putting in the effort, but your content isn't reaching the right audience or creating momentum."
  },
  {
    id: 'low-reach',
    title: 'Reels getting low reach?',
    content: 'Without strong hooks, retention, and a clear strategy, even good videos can get buried.'
  },
  {
    id: 'views-no-followers',
    title: 'Views but no followers?',
    content: 'Getting views is only half the battle. Your content needs to give people a reason to stick around.'
  },
  {
    id: 'followers-no-clients',
    title: 'Followers but no clients?',
    content: "An audience means little if it doesn't convert into inquiries, sales, or opportunities."
  },
  {
    id: 'confused-posting',
    title: 'Always confused about what to post?',
    content: 'Creating content without a strategy leads to inconsistency and creative burnout.'
  },
  {
    id: 'editing-time-return',
    title: 'Spending hours editing with little return?',
    content: 'Better systems and smarter workflows help you create faster without sacrificing quality.'
  }
];

export const ProblemSection: React.FC = () => {
  // First accordion open by default
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(prevIndex => (prevIndex === index ? null : index));
  };

  return (
    <section id="problem" className="py-20 md:py-32 bg-black text-white relative overflow-hidden px-5 md:px-8 border-t border-zinc-900">
      {/* Subtle background ambient radial lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-blue-600/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full text-blue-400 font-extrabold text-xs tracking-widest uppercase mb-4"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            COMMON CREATOR CHALLENGES
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-4 sm:mb-6"
          >
            Is Your Growth Stuck?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-gray-400 text-base sm:text-xl font-medium max-w-[700px] mx-auto leading-relaxed"
          >
            If you've been feeling this way, you're not alone. These are the biggest challenges creators face before they build a real growth system.
          </motion.p>
        </div>

        {/* Accordion Cards Container */}
        <div className="space-y-4 sm:space-y-5 max-w-3xl mx-auto">
          {PROBLEM_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className={`rounded-[18px] transition-all duration-300 border ${
                  isOpen
                    ? 'bg-zinc-900/90 border-blue-500/40 shadow-xl shadow-blue-950/20'
                    : 'bg-zinc-950/80 hover:bg-zinc-900/70 border-zinc-800/80 hover:border-zinc-700/80'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  aria-expanded={isOpen}
                  className="w-full text-left px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-[18px] cursor-pointer group"
                >
                  <div className="flex items-center gap-3 sm:gap-4 pr-2">
                    <span className={`text-sm sm:text-base font-extrabold transition-colors ${isOpen ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-400'}`}>
                      0{index + 1}
                    </span>
                    <h3 className={`text-base sm:text-lg md:text-xl font-extrabold tracking-tight transition-colors ${isOpen ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>
                      {item.title}
                    </h3>
                  </div>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isOpen
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-800/80 text-gray-400 group-hover:bg-zinc-700 group-hover:text-white'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 sm:px-8 pb-6 pt-1 text-gray-400 font-medium text-sm sm:text-base leading-relaxed pl-12 sm:pl-16 pr-6 sm:pr-12 border-t border-zinc-800/50 mt-1">
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
