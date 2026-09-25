import React from 'react';
import { motion } from 'framer-motion';

interface ProofStat {
  value: string;
  label: string;
}

const PROOF_STATS: ProofStat[] = [
  {
    value: '1M+',
    label: 'Followers Generated',
  },
  {
    value: '700M+',
    label: 'Views Generated',
  },
  {
    value: '7K+',
    label: 'Leads Generated',
  },
  {
    value: '150+',
    label: 'Creators Worked With',
  }
];

export const ProofStatsSection: React.FC = () => {
  return (
    <section 
      id="proof-results"
      className="relative w-full bg-[#080808] text-white py-11 md:py-16 border-b border-[#292929]"
      aria-label="Verified results and credibility metrics"
    >
      <div className="w-full max-w-[1200px] mx-auto px-5 sm:px-6 md:px-8">
        {/* Eyebrow Header */}
        <div className="flex items-center gap-2 mb-6 sm:mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
          <span className="text-[12px] sm:text-[13px] font-semibold tracking-[0.08em] uppercase text-zinc-400">
            PROVEN TRACK RECORD · VERIFIED IMPACT
          </span>
        </div>

        {/* Elegant Compact 2x2 Data Panel with Thin Borders */}
        <div className="rounded-[20px] border border-[#292929] overflow-hidden bg-[#0A0A0A]/60">
          <div className="grid grid-cols-2 divide-x divide-y divide-[#292929]">
            {PROOF_STATS.map((stat, idx) => (
              <motion.div
                key={stat.value}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.4, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="p-5 sm:p-7 md:p-8 flex flex-col justify-center"
              >
                {/* Number: 42-52px desktop, 34-40px mobile */}
                <div className="text-[34px] sm:text-[38px] md:text-[44px] lg:text-[48px] font-bold tracking-tight text-white leading-none">
                  {stat.value}
                </div>

                {/* Label: 14-16px */}
                <div className="mt-2 text-zinc-400 text-[13px] sm:text-[14px] md:text-[15px] font-medium leading-normal">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
