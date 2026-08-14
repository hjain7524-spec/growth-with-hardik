import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowDown, ArrowRight, MessageSquare, Sparkles, CheckCircle } from 'lucide-react';

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

export const GrowthSystem: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleBookDiscoveryCall = () => {
    const whatsappUrl = 'https://wa.me/917455067426?text=Hey%2C%20I%20want%20to%20do%20a%20discovery%20call%20with%20you%20to%20discuss%20my%20brand%20and%20social%20media%20management.';
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="process" className="py-20 md:py-32 bg-black text-white relative overflow-hidden px-5 md:px-8 border-t border-zinc-900">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full text-blue-400 font-extrabold text-xs tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            OUR PROCESS
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-4 sm:mb-6">
            How We Work
          </h2>
          <p className="text-gray-400 text-base sm:text-xl font-medium max-w-[700px] mx-auto leading-relaxed">
            From strategy to execution, here's the simple process we use to help your brand grow consistently.
          </p>
        </motion.div>

        {/* Outer Premium Glassmorphic Container Card */}
        <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
          {/* Single Expandable Toggle Button */}
          <div className="flex justify-center">
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center gap-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-blue-500/50 text-white font-bold text-base sm:text-lg px-8 py-4 sm:py-5 rounded-[16px] transition-all duration-300 shadow-xl shadow-black/40 active:scale-95 touch-manipulation cursor-pointer"
            >
              <span>{isExpanded ? 'Hide Growth System' : 'View Our Growth System'}</span>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-blue-600 transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
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
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-12 sm:pt-16 pb-4">
                  {/* Vertical Timeline Container */}
                  <div className="relative max-w-2xl mx-auto flex flex-col items-center">
                    {/* Background Vertical Connecting Line */}
                    <div className="absolute top-8 bottom-24 w-0.5 bg-gradient-to-b from-blue-600 via-indigo-500/50 to-blue-600/10 z-0" />

                    {/* Steps List */}
                    {STEPS.map((step, idx) => (
                      <React.Fragment key={step.stepNumber}>
                        {/* Step Card */}
                        <motion.div
                          initial={{ opacity: 0, y: 25 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: idx * 0.08 }}
                          className="relative z-10 w-full bg-zinc-900/90 hover:bg-zinc-900 border border-zinc-800 hover:border-blue-500/40 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl transition-all duration-300 group text-left backdrop-blur-xl"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                            <span className="inline-flex items-center gap-1.5 text-blue-400 font-extrabold text-xs tracking-widest uppercase bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full w-fit">
                              <CheckCircle className="w-3.5 h-3.5" />
                              STEP {step.stepNumber}
                            </span>
                          </div>

                          <h3 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight group-hover:text-blue-400 transition-colors">
                            {step.title}
                          </h3>

                          <p className="text-gray-400 font-medium text-sm sm:text-base leading-relaxed">
                            {step.description}
                          </p>
                        </motion.div>

                        {/* Down Arrow Connecting Icon between steps */}
                        {idx < STEPS.length - 1 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: idx * 0.08 + 0.05 }}
                            className="my-4 sm:my-5 z-10 w-9 h-9 rounded-full bg-zinc-900 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10"
                          >
                            <ArrowDown className="w-4 h-4 animate-bounce" />
                          </motion.div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Bottom CTA Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-12 sm:mt-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-blue-500/30 text-center relative overflow-hidden shadow-2xl shadow-blue-900/20"
                  >
                    {/* Ambient Glow */}
                    <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10">
                      <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
                        Ready to Grow Your Brand?
                      </h3>
                      <p className="text-gray-400 font-medium text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                        Let's discuss your goals and build a growth strategy tailored to your business.
                      </p>

                      <motion.button
                        onClick={handleBookDiscoveryCall}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-600 text-white font-black text-base sm:text-lg px-9 py-4 sm:py-5 rounded-full shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.6)] transition-all duration-300 cursor-pointer touch-manipulation"
                      >
                        <MessageSquare className="w-5 h-5 fill-current" />
                        <span>Book Discovery Call</span>
                        <ArrowRight className="w-5 h-5" />
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
