import React from 'react';
import { Rocket, TrendingUp, Film, Star, ShieldCheck, Globe, Zap, Target } from 'lucide-react';

interface GrowthMetric {
  id: string;
  icon: React.ReactNode;
  highlight: string;
  label: string;
  prefix?: string;
}

const GROWTH_METRICS: GrowthMetric[] = [
  {
    id: 'organic-views',
    icon: <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400 flex-shrink-0" />,
    highlight: '50M+',
    label: 'Organic Views Generated'
  },
  {
    id: 'followers-grown',
    icon: <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400 flex-shrink-0" />,
    highlight: '100K+',
    label: 'Followers Grown'
  },
  {
    id: 'videos-edited',
    icon: <Film className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400 flex-shrink-0" />,
    highlight: '1000+',
    label: 'Videos Edited'
  },
  {
    id: 'brands-worked',
    icon: <Star className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400 flex-shrink-0" />,
    highlight: '30+',
    label: 'Brands Worked With'
  },
  {
    id: 'meta-verified',
    icon: <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400 flex-shrink-0" />,
    highlight: 'Meta',
    label: 'Verified'
  },
  {
    id: 'clients-reach',
    icon: <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400 flex-shrink-0" />,
    prefix: 'Clients Across',
    highlight: 'India, UAE & USA',
    label: ''
  },
  {
    id: 'ai-growth',
    icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400 flex-shrink-0" />,
    highlight: 'AI-Powered',
    label: 'Growth Systems'
  },
  {
    id: 'results-strategy',
    icon: <Target className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400 flex-shrink-0" />,
    highlight: 'Results-Driven',
    label: 'Content Strategy'
  }
];

export const TrustMarquee: React.FC = () => {
  // Duplicate array so marquee scrolls continuously without gaps
  const marqueeItems = [...GROWTH_METRICS, ...GROWTH_METRICS];

  return (
    <div className="w-full bg-[#000000] text-white relative overflow-hidden select-none h-[56px] sm:h-[64px] md:h-[72px] flex items-center border-y border-zinc-900/60">
      {/* Left Edge Fade Mask */}
      <div className="absolute left-0 inset-y-0 w-12 sm:w-24 md:w-36 bg-gradient-to-r from-[#000000] via-[#000000]/85 to-transparent z-20 pointer-events-none" />

      {/* Right Edge Fade Mask */}
      <div className="absolute right-0 inset-y-0 w-12 sm:w-24 md:w-36 bg-gradient-to-l from-[#000000] via-[#000000]/85 to-transparent z-20 pointer-events-none" />

      {/* Marquee Track Container */}
      <div className="w-full h-full flex items-center overflow-hidden group">
        <div className="flex items-center animate-trust-marquee will-change-transform group-hover:[animation-play-state:paused] px-4">
          {marqueeItems.map((metric, index) => (
            <React.Fragment key={`${metric.id}-${index}`}>
              {/* Metric Item */}
              <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0 cursor-pointer transition-all duration-300 ease-out hover:brightness-125 hover:scale-[1.02]">
                {/* Minimal Icon */}
                <div className="p-1 sm:p-1.5 rounded-full bg-sky-500/10 border border-sky-400/20 flex items-center justify-center">
                  {metric.icon}
                </div>

                {/* Typography */}
                <div className="flex items-center gap-1.5 text-[13px] sm:text-sm lg:text-[15px] tracking-tight font-medium whitespace-nowrap">
                  {metric.prefix && (
                    <span className="text-gray-300 font-normal">{metric.prefix}</span>
                  )}
                  <span className="bg-gradient-to-r from-white via-sky-100 to-sky-300 bg-clip-text text-transparent font-bold tracking-tight">
                    {metric.highlight}
                  </span>
                  {metric.label && (
                    <span className="text-white font-medium">{metric.label}</span>
                  )}
                </div>
              </div>

              {/* Centered Separator Dot */}
              <span className="text-sky-400/50 text-xs sm:text-sm font-extrabold px-4 sm:px-6 md:px-8 select-none flex-shrink-0">
                •
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};



