import React from 'react';
import { Sparkles, Zap, ArrowUpRight, Flame } from 'lucide-react';

interface MarqueeStatement {
  highlight: string;
  label: string;
  icon?: React.ReactNode;
}

const STATEMENTS: MarqueeStatement[] = [
  {
    highlight: '700M+',
    label: 'Organic Views Generated',
    icon: <Sparkles className="w-3.5 h-3.5 text-[#E50914]" />
  },
  {
    highlight: '100K+',
    label: 'Followers Grown',
    icon: <ArrowUpRight className="w-3.5 h-3.5 text-[#E50914]" />
  },
  {
    highlight: '7K+',
    label: 'Leads Generated',
    icon: <Zap className="w-3.5 h-3.5 text-[#E50914]" />
  },
  {
    highlight: '150+',
    label: 'Creators Worked With',
    icon: <Flame className="w-3.5 h-3.5 text-[#E50914]" />
  }
];

export const TrustMarquee: React.FC = () => {
  const fullTrack = [...STATEMENTS, ...STATEMENTS, ...STATEMENTS, ...STATEMENTS];

  return (
    <div 
      className="w-full bg-[#080808] text-white relative overflow-hidden select-none py-3.5 sm:py-4 border-b border-[#292929]"
      aria-label="Credibility and proof highlights"
    >
      {/* Left Edge Editorial Fade Mask */}
      <div 
        className="absolute left-0 inset-y-0 w-16 sm:w-28 md:w-36 bg-gradient-to-r from-[#080808] via-[#080808]/90 to-transparent z-20 pointer-events-none" 
        aria-hidden="true" 
      />

      {/* Right Edge Editorial Fade Mask */}
      <div 
        className="absolute right-0 inset-y-0 w-16 sm:w-28 md:w-36 bg-gradient-to-l from-[#080808] via-[#080808]/90 to-transparent z-20 pointer-events-none" 
        aria-hidden="true" 
      />

      {/* Marquee Track Container */}
      <div className="w-full flex items-center overflow-hidden">
        <div className="flex items-center animate-trust-marquee will-change-transform py-0.5">
          {fullTrack.map((item, index) => (
            <div 
              key={`marquee-item-${index}`}
              className="flex items-center flex-shrink-0"
            >
              {/* Credibility Statement */}
              <div className="flex items-center gap-2 px-3.5 sm:px-5">
                <span className="text-sm sm:text-base font-bold tracking-tight text-white whitespace-nowrap">
                  {item.highlight}
                </span>
                <span className="text-xs sm:text-sm font-medium text-zinc-400 tracking-tight whitespace-nowrap">
                  {item.label}
                </span>
              </div>

              {/* Small Icon / Separator between statements */}
              <div 
                className="flex items-center justify-center px-3.5 sm:px-5 flex-shrink-0" 
                aria-hidden="true"
              >
                <div className="w-5 h-5 rounded-full bg-white/[0.04] border border-[#292929] flex items-center justify-center">
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
