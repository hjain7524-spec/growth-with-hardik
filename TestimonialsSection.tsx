import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { TESTIMONIALS } from './constants';

const AUTOPLAY_INTERVAL = 6000; // 6 seconds

export const TestimonialsSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'creator' | 'business'>('all');
  const [isPaused, setIsPaused] = useState(false);

  const filteredTestimonials = TESTIMONIALS.filter(t => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'creator') return t.category === 'creator';
    if (activeFilter === 'business') return t.category === 'brand' || t.category === 'agency';
    return true;
  });

  const N = filteredTestimonials.length;

  // Responsive visible items count
  const [itemsToShow, setItemsToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(1);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(2);
      } else {
        setItemsToShow(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Duplicate items 3x for smooth infinite carousel loop
  const virtualList = N > 0 ? [...filteredTestimonials, ...filteredTestimonials, ...filteredTestimonials] : [];

  // Start index at middle set (N)
  const [currentIndex, setCurrentIndex] = useState(N);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(filteredTestimonials.length);
    setIsTransitioning(false);
  }, [filteredTestimonials.length, activeFilter]);

  const handleNext = useCallback(() => {
    if (N === 0) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => prev + 1);
  }, [N]);

  const handlePrev = useCallback(() => {
    if (N === 0) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => prev - 1);
  }, [N]);

  const handleDotClick = (index: number) => {
    setIsTransitioning(true);
    setCurrentIndex(N + index);
  };

  const handleAnimationComplete = () => {
    if (N === 0) return;
    if (currentIndex >= 2 * N) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - N);
    } else if (currentIndex < N) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + N);
    }
  };

  // Autoplay timer
  useEffect(() => {
    if (isPaused || N === 0) return;
    const timer = setInterval(() => {
      handleNext();
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, N, handleNext]);

  const activeDotIndex = N > 0 ? ((currentIndex % N) + N) % N : 0;

  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    const swipeThreshold = 40;
    const velocityThreshold = 200;
    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      handlePrev();
    }
  };

  return (
    <section id="feedback" className="py-12 sm:py-16 md:py-20 bg-white text-zinc-900 relative overflow-hidden px-4 sm:px-6 md:px-8 border-t border-zinc-100">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 mb-2 sm:mb-3"
          >
            What Our Clients Say
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-zinc-500 text-sm sm:text-base font-normal max-w-[560px] mx-auto leading-relaxed"
          >
            Real stories from creators and brands we've helped grow.
          </motion.p>
        </div>

        {/* Minimal Category Filter Tabs & Navigation Controls */}
        <div className="flex items-center justify-between gap-4 mb-5 sm:mb-7">
          {/* Minimal Text Tabs: All | Creators | Businesses */}
          <div className="inline-flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium text-zinc-400">
            <button
              onClick={() => setActiveFilter('all')}
              className={`transition-colors cursor-pointer py-1 ${
                activeFilter === 'all'
                  ? 'text-zinc-900 font-bold'
                  : 'text-zinc-400 hover:text-zinc-700'
              }`}
            >
              All
            </button>
            <span className="text-zinc-300 select-none">|</span>
            <button
              onClick={() => setActiveFilter('creator')}
              className={`transition-colors cursor-pointer py-1 ${
                activeFilter === 'creator'
                  ? 'text-zinc-900 font-bold'
                  : 'text-zinc-400 hover:text-zinc-700'
              }`}
            >
              Creators
            </button>
            <span className="text-zinc-300 select-none">|</span>
            <button
              onClick={() => setActiveFilter('business')}
              className={`transition-colors cursor-pointer py-1 ${
                activeFilter === 'business'
                  ? 'text-zinc-900 font-bold'
                  : 'text-zinc-400 hover:text-zinc-700'
              }`}
            >
              Businesses
            </button>
          </div>

          {/* Minimalist Navigation Arrows */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-600 hover:text-zinc-900 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next testimonial"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-600 hover:text-zinc-900 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Outer Window */}
        <div 
          className="relative overflow-hidden py-1 sm:py-2"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Sliding Track */}
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={handleDragEnd}
            animate={{
              x: `calc(-${currentIndex} * ((100% + 20px) / ${itemsToShow}))`
            }}
            transition={
              isTransitioning
                ? { duration: 0.45, ease: [0.25, 1, 0.5, 1] }
                : { duration: 0 }
            }
            onAnimationComplete={handleAnimationComplete}
            className="flex gap-5 cursor-grab active:cursor-grabbing touch-pan-y"
          >
            {virtualList.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                style={{
                  flex: `0 0 calc((100% - ${(itemsToShow - 1) * 20}px) / ${itemsToShow})`,
                  maxWidth: `calc((100% - ${(itemsToShow - 1) * 20}px) / ${itemsToShow})`
                }}
                className="shrink-0 h-auto"
              >
                {/* Soft Gray Card (#F8F8F8) with Subtle Border & 22px Rounded Corners */}
                <div className="bg-[#F8F8F8] border border-zinc-200/80 rounded-[22px] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-zinc-900/5 relative h-full min-h-[220px] select-none">
                  <div>
                    {/* Stars ⭐⭐⭐⭐⭐ */}
                    <div className="flex text-amber-400 mb-4 sm:mb-5">
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    {/* Review Quote */}
                    <p className="text-zinc-700 font-normal text-sm sm:text-[15px] leading-relaxed mb-6">
                      "{item.content}"
                    </p>
                  </div>

                  {/* Client Info */}
                  <div className="pt-4 border-t border-zinc-200/60 mt-auto">
                    <h3 className="font-bold text-zinc-900 text-sm sm:text-base tracking-tight">
                      {item.author}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-500 font-normal mt-0.5">
                      {item.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Simple & Subtle Pagination Dots */}
        {N > 0 && (
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-5 sm:mt-7">
            {filteredTestimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeDotIndex
                    ? 'w-5 sm:w-6 bg-zinc-800'
                    : 'w-1.5 sm:w-2 bg-zinc-300 hover:bg-zinc-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
