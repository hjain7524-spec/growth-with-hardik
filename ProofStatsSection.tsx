import React, { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

interface ProofStatConfig {
  finalValue: string;
  initialValue: string;
  label: string;
  format: (progress: number) => string;
}

const PROOF_STATS: ProofStatConfig[] = [
  {
    finalValue: '1M+',
    initialValue: '0.1M+',
    label: 'Followers Generated',
    format: (p: number) => {
      if (p >= 0.98) return '1M+';
      const val = p * 1;
      if (val < 0.05) return '0.1M+';
      return `${val.toFixed(1)}M+`;
    }
  },
  {
    finalValue: '700M+',
    initialValue: '0M+',
    label: 'Views Generated',
    format: (p: number) => {
      if (p >= 1) return '700M+';
      const val = Math.round(p * 700);
      return `${val}M+`;
    }
  },
  {
    finalValue: '7K+',
    initialValue: '0.5K+',
    label: 'Leads Generated',
    format: (p: number) => {
      if (p >= 0.98) return '7K+';
      const val = p * 7;
      if (val < 0.3) return '0.5K+';
      return `${val.toFixed(1)}K+`;
    }
  },
  {
    finalValue: '150+',
    initialValue: '0+',
    label: 'Creators Worked With',
    format: (p: number) => {
      if (p >= 1) return '150+';
      const val = Math.round(p * 150);
      return `${val}+`;
    }
  }
];

interface StatNumberProps {
  finalValue: string;
  initialValue: string;
  format: (progress: number) => string;
  delay: number;
  isInView: boolean;
}

const StatNumber: React.FC<StatNumberProps> = ({ 
  finalValue, 
  initialValue, 
  format, 
  delay, 
  isInView 
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const isFinishedRef = useRef(false);

  useEffect(() => {
    const span = spanRef.current;
    if (!span) return;

    if (!isInView) {
      if (!isFinishedRef.current) {
        span.textContent = initialValue;
        span.style.opacity = '0.7';
      }
      return;
    }

    if (isFinishedRef.current) return;

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      span.textContent = finalValue;
      span.style.opacity = '1';
      isFinishedRef.current = true;
      return;
    }

    let rafId: number;
    let startTime: number | null = null;
    const duration = 1650; // 1.65 seconds

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (elapsed < delay) {
        span.textContent = initialValue;
        span.style.opacity = '0.7';
        rafId = requestAnimationFrame(animate);
        return;
      }

      const statElapsed = elapsed - delay;
      const progress = Math.min(1, statElapsed / duration);
      // Quartic ease-out: brisk rise, smooth gentle deceleration into the final value
      const easedProgress = 1 - Math.pow(1 - progress, 4);

      if (progress < 1) {
        span.textContent = format(easedProgress);
        span.style.opacity = String(Math.min(1, 0.7 + (statElapsed / 300) * 0.3));
        rafId = requestAnimationFrame(animate);
      } else {
        span.textContent = finalValue;
        span.style.opacity = '1';
        isFinishedRef.current = true;
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, delay, finalValue, initialValue, format]);

  return (
    <span 
      ref={spanRef} 
      style={{ willChange: 'contents, opacity' }}
    >
      {finalValue}
    </span>
  );
};

export const ProofStatsSection: React.FC = () => {
  const panelRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(panelRef, { once: true, amount: 0.15 });

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
        <div 
          ref={panelRef}
          className="rounded-[20px] border border-[#292929] overflow-hidden bg-[#0A0A0A]/60"
        >
          <div className="grid grid-cols-2 divide-x divide-y divide-[#292929]">
            {PROOF_STATS.map((stat, idx) => (
              <div
                key={stat.finalValue}
                className="p-5 sm:p-7 md:p-8 flex flex-col justify-center"
              >
                {/* Number: 42-52px desktop, 34-40px mobile */}
                <div className="text-[34px] sm:text-[38px] md:text-[44px] lg:text-[48px] font-bold tracking-tight text-white leading-none tabular-nums">
                  <StatNumber 
                    finalValue={stat.finalValue}
                    initialValue={stat.initialValue}
                    format={stat.format}
                    delay={idx * 130}
                    isInView={isInView}
                  />
                </div>

                {/* Label: 14-16px */}
                <div className="mt-2 text-zinc-400 text-[13px] sm:text-[14px] md:text-[15px] font-medium leading-normal">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
