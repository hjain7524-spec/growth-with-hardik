import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowDown, ArrowRight, MessageSquare, Sparkles, CheckCircle } from 'lucide-react';
import { trackGrowthAuditClick } from './analytics';

interface Step {
  stepNumber: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    stepNumber: '01',
    title: 'Discovery Call',
    description: 'We understand your business, audience, goals, competitors, and current challenges.'
  },
  {
    stepNumber: '02',
    title: 'Growth Audit',
    description: 'We audit your content, branding, competitors, and identify growth opportunities.'
  },
  {
    stepNumber: '03',
    title: 'Custom Strategy',
    description: 'We build a tailored content and growth strategy designed specifically for your brand.'
  },
  {
    stepNumber: '04',
    title: 'Content Production',
    description: 'Our team creates high-quality content optimized for attention, engagement, and conversions.'
  },
  {
    stepNumber: '05',
    title: 'Publishing & Optimization',
    description: 'We publish strategically, monitor performance, and optimize continuously using data.'
  },
  {
    stepNumber: '06',
    title: 'Scale & Growth',
    description: 'As your audience grows, we refine the strategy to generate more leads, authority, and revenue.'
  }
];

interface GrowthSystemProps {
  onRequestAudit?: () => void;
}

export const GrowthSystem: React.FC<GrowthSystemProps> = ({ onRequestAudit }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleRequestAudit = () => {
    trackGrowthAuditClick('growth_system_process', 'Free Growth Audit');
    if (onRequestAudit) {
      onRequestAudit();
    } else {
      window.dispatchEvent(new CustomEvent('open_growth_audit_modal'));
    }
  };

  return (
    <section id="process" className="py-14 sm:py-20 md:py-28 bg-black text-white relative overflow-hidden px-5 sm:px-6 md:px-8 border-t border-zinc-900">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[600px] h-[500px] sm:h-[600px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-blue-400 font-bold text-[12px] sm:text-xs tracking-[0.14em] uppercase mb-2.5 sm:mb-3.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OUR PROCESS</span>
          </div>
          <h2 className="text-[32px] sm:text-4xl md:text-5xl lg:text-[50px] font-black tracking-tight text-white mb-2 sm:mb-3.5 leading-[1.1]">
            How We Work
          </h2>
          <p className="text-gray-400 text-[13.5px] sm:text-base font-normal max-w-[310px] sm:max-w-xl mx-auto leading-[1.38] sm:leading-[1.5]">
            From strategy to execution, here's the simple process we use to help your brand grow consistently.
          </p>
        </motion.div>

        {/* Outer Premium Glassmorphic Container Card */}
        <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-[1.5rem] sm:rounded-[2.25rem] p-5 sm:p-8 md:p-10 shadow-2xl backdrop-blur-2xl">
          {/* Single Expandable Toggle Button */}
          <div className="flex justify-center">
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center gap-2.5 sm:gap-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-blue-500/50 text-white font-bold text-[15px] sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-xl shadow-black/40 active:scale-95 touch-manipulation cursor-pointer min-h-[48px] sm:min-h-[52px]"
            >
              <span>{isExpanded ? 'Hide Growth System' : 'View Our Growth System'}</span>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-blue-600 transition-colors"
              >
                <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </motion.div>
            </motion.button>
          </div>

          {/* Accordion Expandable Vertical Timeline */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-8 sm:pt-12 pb-2">
                  {/* Vertical Timeline Container */}
                  <div className="relative max-w-2xl mx-auto flex flex-col items-center">
                    {/* Background Vertical Connecting Line */}
                    <div className="absolute top-6 bottom-20 w-0.5 bg-gradient-to-b from-blue-600 via-indigo-500/50 to-blue-600/10 z-0" />

                    {/* Steps List */}
                    {STEPS.map((step, idx) => (
                      <React.Fragment key={step.stepNumber}>
                        {/* Step Card */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, delay: idx * 0.05 }}
                          className="relative z-10 w-full bg-zinc-900/90 hover:bg-zinc-900 border border-zinc-800 hover:border-blue-500/40 p-5 sm:p-6 md:p-7 rounded-2xl shadow-xl transition-all duration-300 group text-left backdrop-blur-xl"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5">
                            <span className="inline-flex items-center gap-1.5 text-blue-400 font-bold text-[11px] sm:text-xs tracking-[0.14em] uppercase bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full w-fit">
                              <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              STEP {step.stepNumber}
                            </span>
                          </div>

                          <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white mb-1 tracking-tight group-hover:text-blue-400 transition-colors">
                            {step.title}
                          </h3>

                          <p className="text-gray-400 font-normal text-xs sm:text-sm md:text-[15px] leading-[1.5]">
                            {step.description}
                          </p>
                        </motion.div>

                        {/* Down Arrow Connecting Icon between steps */}
                        {idx < STEPS.length - 1 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.25, delay: idx * 0.05 + 0.04 }}
                            className="my-3 sm:my-3.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-zinc-900 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10"
                          >
                            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                          </motion.div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Bottom CTA Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.35 }}
                    className="mt-8 sm:mt-12 p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-blue-500/30 text-center relative overflow-hidden shadow-2xl shadow-blue-900/20"
                  >
                    {/* Ambient Glow */}
                    <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10">
                      <h3 className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mb-2 sm:mb-3">
                        Ready to Grow Your Brand?
                      </h3>
                      <p className="text-gray-400 font-normal text-xs sm:text-sm md:text-base mb-6 max-w-lg mx-auto leading-[1.5]">
                        Let's discuss your goals and build a growth strategy tailored to your business.
                      </p>

                      <motion.button
                        onClick={handleRequestAudit}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center justify-center gap-2.5 sm:gap-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-600 text-white font-black text-[15px] sm:text-base md:text-[17px] px-7 sm:px-8 py-3.5 sm:py-4.5 rounded-full shadow-[0_0_25px_rgba(37,99,235,0.4)] hover:shadow-[0_0_35px_rgba(37,99,235,0.6)] transition-all duration-300 cursor-pointer touch-manipulation min-h-[48px] sm:min-h-[52px]"
                      >
                        <span>Free Growth Audit</span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
