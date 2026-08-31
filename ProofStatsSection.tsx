import React from 'react';
import { motion } from 'framer-motion';

interface StatItem {
  id: string;
  value: string;
  labelLine1: string;
  labelLine2?: string;
}

const STATS_DATA: StatItem[] = [
  {
    id: 'followers',
    value: '1M+',
    labelLine1: 'Followers',
    labelLine2: 'Generated'
  },
  {
    id: 'views',
    value: '700M+',
    labelLine1: 'Views',
    labelLine2: 'Generated'
  },
  {
    id: 'leads',
    value: '7K+',
    labelLine1: 'Leads',
    labelLine2: 'Generated'
  },
  {
    id: 'creators',
    value: '150+',
    labelLine1: 'Creators',
    labelLine2: 'Worked With'
  }
];

export const ProofStatsSection: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-black text-white relative overflow-hidden border-t border-zinc-900/80 selection:bg-blue-600/30 selection:text-white">
      {/* Subtle radial ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-blue-600/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        {/* 2x2 Grid on Mobile, 4-Column on Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4 sm:gap-x-8 sm:gap-y-10 text-center">
          {STATS_DATA.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex flex-col items-center justify-center"
            >
              {/* Big dominant bold number */}
              <div className="text-[34px] min-[360px]:text-[40px] min-[400px]:text-[44px] sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-black tracking-tight text-white leading-none whitespace-nowrap">
                <span className="bg-gradient-to-b from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                  {stat.value}
                </span>
              </div>

              {/* Smaller clean label */}
              <div className="mt-2 sm:mt-2.5 text-xs sm:text-sm md:text-base font-medium text-gray-400 tracking-tight leading-snug">
                <span>{stat.labelLine1}</span>
                {stat.labelLine2 && (
                  <span className="block">{stat.labelLine2}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
