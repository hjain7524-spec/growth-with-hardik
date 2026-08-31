import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, X } from 'lucide-react';
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
    <section className="py-14 sm:py-20 md:py-24 bg-white text-zinc-950 relative overflow-hidden px-4 sm:px-6 md:px-8 border-t border-gray-100 selection:bg-blue-600/20 selection:text-zinc-950">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xl min-[360px]:text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-zinc-950 mb-2 sm:mb-3 leading-tight whitespace-nowrap"
          >
            Which Creator Are You?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-zinc-600 text-[14.5px] sm:text-base md:text-lg font-normal max-w-xl mx-auto leading-relaxed"
          >
            Your growth depends on how you approach your content.
          </motion.p>
        </div>

        {/* Two Side-by-Side Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-14 items-stretch">
          {/* Card 1: THE CONTENT GRINDER */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            className="bg-white border border-zinc-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-7 md:p-8 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.09)] ring-1 ring-black/[0.04] transition-shadow duration-300"
          >
            <div>
              <div className="mb-4 sm:mb-5">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-zinc-400 block mb-1">
                  Approach A
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-800">
                  THE CONTENT GRINDER
                </h3>
                <p className="text-zinc-500 text-sm sm:text-[15px] mt-1 font-medium">
                  Posts whenever they can.
                </p>
              </div>

              <ul className="space-y-3 sm:space-y-3.5 pt-4 border-t border-zinc-200">
                <li className="flex items-start gap-2.5 text-zinc-700 text-sm sm:text-[15px] leading-snug">
                  <div className="w-5 h-5 rounded-full bg-zinc-200/70 border border-zinc-300 flex items-center justify-center shrink-0 mt-0.5 text-zinc-600">
                    <span className="text-xs font-bold leading-none">•</span>
                  </div>
                  <span>Posts without a clear plan</span>
                </li>
                <li className="flex items-start gap-2.5 text-zinc-700 text-sm sm:text-[15px] leading-snug">
                  <div className="w-5 h-5 rounded-full bg-zinc-200/70 border border-zinc-300 flex items-center justify-center shrink-0 mt-0.5 text-zinc-600">
                    <span className="text-xs font-bold leading-none">•</span>
                  </div>
                  <span>Chases trends</span>
                </li>
                <li className="flex items-start gap-2.5 text-zinc-700 text-sm sm:text-[15px] leading-snug">
                  <div className="w-5 h-5 rounded-full bg-zinc-200/70 border border-zinc-300 flex items-center justify-center shrink-0 mt-0.5 text-zinc-600">
                    <span className="text-xs font-bold leading-none">•</span>
                  </div>
                  <span>Gets random results</span>
                </li>
                <li className="flex items-start gap-2.5 text-zinc-700 text-sm sm:text-[15px] leading-snug">
                  <div className="w-5 h-5 rounded-full bg-zinc-200/70 border border-zinc-300 flex items-center justify-center shrink-0 mt-0.5 text-zinc-600">
                    <span className="text-xs font-bold leading-none">•</span>
                  </div>
                  <span>Struggles to turn attention into opportunities</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Card 2: THE GROWTH CREATOR */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
            className="bg-black text-white border border-zinc-800 rounded-2xl sm:rounded-3xl p-6 sm:p-7 md:p-8 flex flex-col justify-between relative shadow-xl shadow-black/10 ring-1 ring-black/5"
          >
            <div>
              <div className="mb-4 sm:mb-5">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-blue-400 block mb-1">
                  Approach B
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  THE GROWTH CREATOR
                </h3>
                <p className="text-zinc-300 text-sm sm:text-[15px] mt-1 font-medium">
                  Creates with a clear system.
                </p>
              </div>

              <ul className="space-y-3 sm:space-y-3.5 pt-4 border-t border-zinc-800">
                <li className="flex items-start gap-2.5 text-zinc-100 text-sm sm:text-[15px] leading-snug">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center shrink-0 mt-0.5 text-blue-400">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </div>
                  <span>Knows what their audience wants</span>
                </li>
                <li className="flex items-start gap-2.5 text-zinc-100 text-sm sm:text-[15px] leading-snug">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center shrink-0 mt-0.5 text-blue-400">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </div>
                  <span>Creates with purpose</span>
                </li>
                <li className="flex items-start gap-2.5 text-zinc-100 text-sm sm:text-[15px] leading-snug">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center shrink-0 mt-0.5 text-blue-400">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </div>
                  <span>Builds authority consistently</span>
                </li>
                <li className="flex items-start gap-2.5 text-zinc-100 text-sm sm:text-[15px] leading-snug">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center shrink-0 mt-0.5 text-blue-400">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </div>
                  <span>Turns attention into opportunities</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Below Cards: Question & CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-center"
        >
          <p className="text-base sm:text-lg md:text-xl font-bold text-zinc-950 mb-4 sm:mb-5">
            Which one do you want to be?
          </p>

          <button
            onClick={handleOpenAudit}
            className="inline-flex items-center justify-center gap-2.5 bg-black hover:bg-zinc-800 text-white font-black text-sm sm:text-base px-7 sm:px-9 py-3.5 sm:py-4 rounded-full transition-all duration-200 active:scale-95 shadow-xl shadow-black/10 cursor-pointer touch-manipulation min-h-[48px]"
          >
            <span>Build My Growth Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
