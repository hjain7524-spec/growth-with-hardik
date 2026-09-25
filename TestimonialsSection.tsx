import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface ReviewItem {
  id: string;
  quoteTitle: string;
  content: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
}

const REVIEWS: ReviewItem[] = [
  {
    id: 'r1',
    quoteTitle: '“Exceptional Support”',
    content: 'Hardik helped me build a structured content strategy that supported my growth to over 200K followers within 12 months.',
    author: 'Tanya Saharawat',
    role: 'Yoga Creator & Influencer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&h=160&q=80',
    rating: 5
  },
  {
    id: 'r2',
    quoteTitle: '“Outstanding”',
    content: 'Hardik helped us streamline our content and improve consistency across platforms.',
    author: 'Himadari Foundation',
    role: 'Non-Profit & Foundation',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&h=160&q=80',
    rating: 5
  },
  {
    id: 'r3',
    quoteTitle: '“Value Addition”',
    content: 'Our engagement metrics improved significantly within the first 60 days of working together.',
    author: 'Aman Sharma',
    role: 'Tech & Productivity Creator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80',
    rating: 5
  }
];

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const total = REVIEWS.length;

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleSelectDot = (idx: number) => {
    if (idx === currentIndex) return;
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  const currentItem = REVIEWS[currentIndex] || REVIEWS[0];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.25,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0,
      transition: {
        duration: 0.18,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };

  return (
    <section 
      id="feedback" 
      className="relative w-full py-10 sm:py-14 md:py-16 bg-[#F7F7F5] text-[#080808] border-b border-[#D9D9D9] overflow-hidden"
      aria-label="Testimonials"
    >
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-5 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center flex flex-col items-center">
          {/* Eyebrow: exactly "Testimonials" */}
          <div className="flex items-center gap-2 mb-2 sm:mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
            <span className="text-[12px] sm:text-[13px] font-semibold tracking-[0.08em] uppercase text-[#707070]">
              TESTIMONIALS
            </span>
          </div>

          {/* Main heading: "Happy words from our valuable clients!" */}
          <div className="relative inline-flex flex-col items-center">
            <h2 className="text-[28px] sm:text-[34px] md:text-[38px] lg:text-[42px] font-bold tracking-tight text-[#080808] leading-[1.12] text-center max-w-[650px]">
              Happy words from our valuable clients!
            </h2>

            {/* Hand-drawn yellow underline directly below the heading */}
            <svg 
              className="w-[200px] sm:w-[260px] md:w-[300px] h-3.5 mt-1 sm:mt-1.5 text-amber-400" 
              viewBox="0 0 260 12" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path 
                d="M3 8.5C52 2.5 138 2 257 8.5" 
                stroke="#FBBF24" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
              />
            </svg>
          </div>

          {/* Simple circular left/right arrow controls below heading */}
          <div className="flex items-center justify-center gap-3 mt-4 sm:mt-5 mb-6 sm:mb-7">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="w-11 h-11 min-w-[44px] min-h-[44px] p-2.5 rounded-full border border-[#D9D9D9] bg-white hover:bg-zinc-50 active:scale-95 text-[#080808] flex items-center justify-center transition-all duration-150 cursor-pointer shadow-xs touch-manipulation"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next testimonial"
              className="w-11 h-11 min-w-[44px] min-h-[44px] p-2.5 rounded-full border border-[#D9D9D9] bg-white hover:bg-zinc-50 active:scale-95 text-[#080808] flex items-center justify-center transition-all duration-150 cursor-pointer shadow-xs touch-manipulation"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Compact, soft-rounded Testimonial Card */}
        <div className="relative w-full max-w-[620px] mx-auto">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentItem.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full bg-white text-[#080808] rounded-[18px] sm:rounded-[22px] p-6 sm:p-7 md:p-8 border border-[#E5E5E5] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between"
            >
              {/* Quote Title at the top */}
              <h3 className="text-[20px] sm:text-[22px] md:text-[24px] font-bold tracking-tight text-[#080808] leading-snug">
                {currentItem.quoteTitle}
              </h3>

              {/* 5 Yellow Stars below quote title */}
              <div className="flex items-center gap-1 mt-2.5 text-[#FBBF24]" aria-label="5 out of 5 stars">
                {[...Array(currentItem.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#FBBF24] text-[#FBBF24]" />
                ))}
              </div>

              {/* Review Text: readable medium size with comfortable line-height */}
              <p className="text-[15px] sm:text-[16px] text-[#404040] font-normal leading-relaxed mt-4 mb-5">
                "{currentItem.content}"
              </p>

              {/* Thin Divider before client info */}
              <div className="border-t border-[#E5E5E5] pt-4 flex items-center gap-3">
                <img 
                  src={currentItem.avatar} 
                  alt={currentItem.author} 
                  className="w-11 h-11 rounded-full object-cover border border-[#E5E5E5] shrink-0" 
                  loading="lazy"
                />
                <div className="flex flex-col">
                  <span className="text-[14.5px] sm:text-[15px] font-bold text-[#080808] tracking-tight leading-tight">
                    {currentItem.author}
                  </span>
                  <span className="text-[12.5px] sm:text-[13px] text-[#707070] font-normal mt-0.5 leading-tight">
                    {currentItem.role}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Dots */}
        <div className="flex justify-center items-center gap-1 mt-4" aria-label="Testimonial pagination">
          {REVIEWS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectDot(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer touch-manipulation group"
            >
              <span
                className={`h-1.5 rounded-full transition-all duration-200 block ${
                  idx === currentIndex
                    ? 'w-5 bg-[#080808]'
                    : 'w-1.5 bg-[#D9D9D9] group-hover:bg-zinc-400'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
