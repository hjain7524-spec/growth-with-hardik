import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, X, TrendingUp, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { trackGrowthAuditClick } from './analytics';

export interface CaseStudyItem {
  id: string;
  brand: string;
  clientType: string;
  categories: string[];
  resultHeadline: string;
  resultMetric: string;
  image: string;
  overview: string;
  challenge: string;
  solution: string;
  metrics: { label: string; value: string }[];
}

export const CASE_STUDIES: CaseStudyItem[] = [
  {
    id: 'tanya-saharawat',
    brand: 'Tanya Saharawat',
    clientType: 'Yoga Creator & Wellness Influencer',
    categories: ['Personal Branding', 'Instagram Growth', 'Content Strategy'],
    resultHeadline: 'Scaled to 200K+ organic followers and 45M+ views in 12 months with high-retention reel architecture.',
    resultMetric: '+200K Followers',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
    overview: 'Tanya had deep expertise in yoga and wellness instruction but struggled to convert inconsistent views into a dedicated global following.',
    challenge: 'Reels lacked structured 3-second visual hooks, audio retention pacing, and a cohesive personal brand aesthetic.',
    solution: 'Engineered a repeatable 3-pillar content framework (Form Fixes, Routine Breakdowns, and Mindset Shifts) paired with cinematic pacing and profile bio funnels.',
    metrics: [
      { label: 'Follower Growth', value: '200K+' },
      { label: 'Organic Views', value: '45M+' },
      { label: 'Engagement Rate', value: '8.4%' },
      { label: 'Course Waitlist', value: '3,200+' }
    ]
  },
  {
    id: 'himadari-foundation',
    brand: 'Himadari Foundation',
    clientType: 'Social Impact & Non-Profit Organization',
    categories: ['Social Media', 'Content Strategy', 'Performance Marketing'],
    resultHeadline: 'Tripled organic content cadence while boosting donor community engagement by 240%.',
    resultMetric: '3x Content Output',
    image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1200&q=80',
    overview: 'Himadari needed to modernize their social outreach to inspire younger volunteers and secure ongoing initiative donations.',
    challenge: 'Traditional press releases and static flyers were producing negligible reach on contemporary algorithmic platforms.',
    solution: 'Developed human-first documentary micro-reels highlighting individual ground impact stories, volunteer spotlights, and transparent donation milestones.',
    metrics: [
      { label: 'Monthly Output', value: '3x Cadence' },
      { label: 'Community Growth', value: '15K+ Advocates' },
      { label: 'Inbound Inquiries', value: '+310%' },
      { label: 'Campaign Reach', value: '1.8M' }
    ]
  },
  {
    id: 'aman-sharma',
    brand: 'Aman Sharma',
    clientType: 'Tech & Productivity Creator',
    categories: ['Personal Branding', 'Content Strategy', 'Instagram Growth'],
    resultHeadline: 'Lifted profile engagement by +180% and turned viral attention into lucrative tech brand sponsorships.',
    resultMetric: '+180% Engagement',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
    overview: 'Aman possessed deep software knowledge but was chasing transient viral sounds without building lasting authority.',
    challenge: 'High drop-off rates past the 5-second mark and an unfocused profile bio that prevented viewers from clicking follow.',
    solution: 'Refocused content on specific workflow bottlenecks and productivity frameworks, pairing fast kinetic editing with clear visual titles and carousel breakdowns.',
    metrics: [
      { label: 'Engagement Lift', value: '+180%' },
      { label: 'Sponsored Deals', value: '8 Signed' },
      { label: 'Saves / Shares', value: '42K+' },
      { label: 'Avg Watch Time', value: '82%' }
    ]
  },
  {
    id: 'kunal-verma-d2c',
    brand: 'Kunal Verma (D2C)',
    clientType: 'Consumer Goods & Lifestyle Brand',
    categories: ['Performance Marketing', 'Instagram Growth', 'Social Media'],
    resultHeadline: 'Generated 2.4M+ organic video impressions and 4.2x ROAS without increasing paid media budget.',
    resultMetric: '2.4M+ Organic Views',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
    overview: 'A fast-growing direct-to-consumer brand relying heavily on escalating Meta ad costs sought a sustainable organic acquisition flywheel.',
    challenge: 'Ad fatigue was driving up Customer Acquisition Costs (CAC), and customer trust on social channels was flatlining.',
    solution: 'Designed an organic video strategy highlighting founder behind-the-scenes, product testing stress tests, and user customer problem-solving reels.',
    metrics: [
      { label: 'Organic Views', value: '2.4M+' },
      { label: 'Organic ROAS', value: '4.2x' },
      { label: 'CAC Reduction', value: '-38%' },
      { label: 'Reel Conversion', value: '3.6%' }
    ]
  },
  {
    id: 'rohan-mehra-saas',
    brand: 'Rohan Mehra (B2B)',
    clientType: 'Enterprise B2B Software Platform',
    categories: ['Content Strategy', 'Personal Branding', 'Performance Marketing'],
    resultHeadline: 'Secured 7K+ high-intent platform leads and 45 qualified sales demos directly from executive content.',
    resultMetric: '7K+ Leads Generated',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    overview: 'B2B enterprise founder wanted to establish personal authority on Instagram and LinkedIn to drive qualified inbound demo bookings.',
    challenge: 'B2B technical topics often appear dry and unengaging on video-first feeds.',
    solution: 'Translated complex enterprise data bottlenecks into punchy whiteboard breakdowns, industry counter-intuitive perspectives, and zero-fluff case studies.',
    metrics: [
      { label: 'Qualified Leads', value: '7,000+' },
      { label: 'Enterprise Demos', value: '45 Booked' },
      { label: 'Pipeline Value', value: '$420K' },
      { label: 'Executive Reach', value: '850K+' }
    ]
  }
];

interface CaseStudiesSectionProps {
  onRequestAudit?: () => void;
}

export const CaseStudiesSection: React.FC<CaseStudiesSectionProps> = ({ onRequestAudit }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudyItem | null>(null);

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 20);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      checkScroll();
      return () => el.removeEventListener('scroll', checkScroll);
    }
  }, []);

  const scrollByAmount = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const offset = direction === 'left' ? -480 : 480;
    scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const handleOpenStudy = (study: CaseStudyItem) => {
    setSelectedCaseStudy(study);
  };

  const handleCtaClick = () => {
    trackGrowthAuditClick('case_studies_section', 'View All Case Studies');
    if (onRequestAudit) {
      onRequestAudit();
    } else {
      window.dispatchEvent(new CustomEvent('open_growth_audit_modal'));
    }
  };

  return (
    <section 
      id="case-studies"
      className="relative w-full bg-[#FAFAFA] text-[#080808] py-11 md:py-16 border-b border-[#D9D9D9] overflow-hidden"
      aria-label="Case Studies Section"
    >
      {/* Container Header */}
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 md:px-8 mb-8 sm:mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
              <span className="text-[12px] sm:text-[13px] font-semibold tracking-[0.08em] uppercase text-[#707070]">
                FEATURED CASE STUDIES
              </span>
            </div>

            {/* Section Heading */}
            <h2 className="text-[32px] sm:text-[38px] md:text-[44px] lg:text-[48px] font-bold tracking-tight text-[#080808] leading-[1.05] mb-2 sm:mb-2.5">
              Proof, not promises.
            </h2>

            {/* Supporting Text */}
            <p className="text-[16px] sm:text-[17px] text-[#707070] font-normal leading-normal">
              Real briefs, real outcomes across creators, businesses and brands.
            </p>
          </div>

          {/* Desktop Carousel Controls */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scrollByAmount('left')}
              disabled={!canScrollLeft}
              className="w-10 h-10 rounded-full border border-[#D9D9D9] bg-white hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-[#080808] transition-all shadow-sm cursor-pointer"
              aria-label="Previous case study"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount('right')}
              disabled={!canScrollRight}
              className="w-10 h-10 rounded-full border border-[#D9D9D9] bg-white hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-[#080808] transition-all shadow-sm cursor-pointer"
              aria-label="Next case study"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontally Scrollable Carousel */}
      <div 
        ref={scrollContainerRef}
        className="w-full overflow-x-auto no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing px-5 sm:px-6 md:px-8 flex gap-4 sm:gap-6 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {CASE_STUDIES.map((study, idx) => (
          <div
            key={study.id}
            className="snap-start shrink-0 w-[82vw] sm:w-[440px] md:w-[500px] lg:w-[540px] bg-white rounded-[20px] sm:rounded-[24px] border border-[#D9D9D9] shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group select-none"
          >
            {/* Image at Top */}
            <div className="relative w-full aspect-[16/10] overflow-hidden bg-zinc-100">
              <img
                src={study.image}
                alt={`${study.brand} case study preview`}
                referrerPolicy="no-referrer"
                loading={idx < 2 ? "eager" : "lazy"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              
              {/* Metric Badge Overlay */}
              <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-white/40 shadow-xs flex items-center gap-1.5 text-xs font-bold text-[#080808]">
                <TrendingUp className="w-3.5 h-3.5 text-[#E50914]" />
                <span>{study.resultMetric}</span>
              </div>

              {/* Client Name on Image */}
              <div className="absolute bottom-3.5 left-4 right-4 text-white">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-300 block mb-0.5">
                  {study.clientType}
                </span>
                <h3 className="text-[18px] sm:text-[20px] font-bold tracking-tight text-white drop-shadow-sm">
                  {study.brand}
                </h3>
              </div>
            </div>

            {/* Content Underneath */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
              <div>
                {/* Category Pills */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {study.categories.map(cat => (
                    <span
                      key={cat}
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-[#080808] border border-[#D9D9D9]"
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                {/* Short Result Statement */}
                <p className="text-[14px] sm:text-[15px] text-[#080808] font-medium leading-snug line-clamp-3 mb-4">
                  "{study.resultHeadline}"
                </p>
              </div>

              {/* Action Button: "Read case study →" */}
              <div className="pt-3.5 border-t border-[#D9D9D9] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleOpenStudy(study)}
                  className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-[#080808] hover:text-[#E50914] transition-colors cursor-pointer group/btn"
                >
                  <span>Read case study</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                </button>

                <span className="text-xs font-mono text-[#707070]">
                  Case 0{idx + 1}
                </span>
              </div>
            </div>
          </div>
        ))}

        <div className="shrink-0 w-4 sm:w-6" aria-hidden="true" />
      </div>

      {/* Bottom Conversion CTA */}
      <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center px-5 text-center">
        <button
          type="button"
          onClick={handleCtaClick}
          className="inline-flex items-center justify-center gap-2 bg-[#080808] hover:bg-zinc-800 active:scale-95 text-white font-bold text-[14px] sm:text-[15px] px-7 h-[50px] sm:h-[52px] rounded-full transition-all duration-200 shadow-sm cursor-pointer select-none group"
        >
          <span>View All Case Studies</span>
          <ArrowRight className="w-4 h-4 text-[#E50914] transition-transform duration-200 group-hover:translate-x-1" />
        </button>
        <p className="text-[13px] text-[#707070] font-medium mt-3">
          Real creator briefs, documented deliverables, verified client metrics.
        </p>
      </div>

      {/* Detailed Case Study Modal */}
      <AnimatePresence>
        {selectedCaseStudy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-text">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCaseStudy(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10 border border-black/10"
            >
              {/* Header Image with Close */}
              <div className="relative aspect-[16/9] w-full bg-zinc-100 overflow-hidden shrink-0">
                <img
                  src={selectedCaseStudy.image}
                  alt={selectedCaseStudy.brand}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                <button
                  type="button"
                  onClick={() => setSelectedCaseStudy(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close case study details"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <span className="text-xs uppercase tracking-widest font-mono text-zinc-300 block mb-1">
                    {selectedCaseStudy.clientType}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {selectedCaseStudy.brand}
                  </h3>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                  {selectedCaseStudy.categories.map(c => (
                    <span key={c} className="px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-800">
                      {c}
                    </span>
                  ))}
                </div>

                {/* Headline */}
                <h4 className="text-lg sm:text-xl font-bold text-zinc-900 leading-snug">
                  {selectedCaseStudy.resultHeadline}
                </h4>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-200/60">
                  {selectedCaseStudy.metrics.map(m => (
                    <div key={m.label} className="text-center sm:text-left">
                      <p className="text-lg sm:text-xl font-extrabold text-black font-mono">
                        {m.value}
                      </p>
                      <p className="text-[11px] text-zinc-500 font-medium">
                        {m.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Brief Breakdown */}
                <div className="space-y-4 text-sm sm:text-base text-zinc-700 leading-relaxed">
                  <div>
                    <h5 className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-400 mb-1">
                      The Challenge
                    </h5>
                    <p>{selectedCaseStudy.challenge}</p>
                  </div>

                  <div>
                    <h5 className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-400 mb-1">
                      Our Strategic Solution
                    </h5>
                    <p>{selectedCaseStudy.solution}</p>
                  </div>
                </div>

                {/* Action in Modal */}
                <div className="pt-4 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-zinc-500 font-medium">
                    Want to achieve a similar outcome for your brand?
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCaseStudy(null);
                      handleCtaClick();
                    }}
                    className="w-full sm:w-auto bg-[#E50914] hover:bg-[#FF2B35] text-white text-sm font-bold px-6 py-3 rounded-full transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Build My Growth Plan</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
