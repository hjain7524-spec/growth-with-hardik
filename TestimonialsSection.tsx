import React, { useState, useEffect, useCallback, useRef } from 'react';
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

  // Responsive container width measurement for pixel-perfect card positioning
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateWidth();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateWidth();
      });
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', updateWidth);
    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // Determine items to show based on measured width
  const isMobile = containerWidth < 640;
  const isTablet = containerWidth >= 640 && containerWidth < 1024;
  const itemsToShow = isMobile ? 1 : isTablet ? 2 : 3;
  const gap = isMobile ? 16 : 20;

  // Card width calculation
  const cardWidth = containerWidth > 0
    ? itemsToShow === 1
      ? containerWidth
      : Math.floor((containerWidth - (itemsToShow - 1) * gap) / itemsToShow)
    : 320;

  // Duplicate items 3x for smooth infinite loop
  const virtualList = N > 0 ? [...filteredTestimonials, ...filteredTestimonials, ...filteredTestimonials] : [];

  // Start index at middle set (N)
  const [currentIndex, setCurrentIndex] = useState(N);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Reset index when filter or list length changes
  useEffect(() => {
    if (N > 0) {
      setCurrentIndex(N);
      setIsTransitioning(false);
    }
  }, [N, activeFilter]);

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
    const swipeThreshold = 35;
    const velocityThreshold = 200;
    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      handlePrev();
    }
  };

  // Target X transform position in pixels
  const targetX = containerWidth > 0 ? -currentIndex * (cardWidth + gap) : 0;

  return (
    <section id="feedback" className="py-12 sm:py-16 md:py-24 bg-white text-zinc-900 relative overflow-hidden px-4 sm:px-6 md:px-8 border-t border-zinc-100">
      <div className="max-w-7xl mx-auto relative z-10 w-full">
        {/* Section Header */}
        <div className="text-center mb-5 sm:mb-8 md:mb-10 px-2">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-[24px] min-[360px]:text-[26px] min-[390px]:text-[28px] sm:text-4xl md:text-5xl lg:text-[50px] font-black tracking-tight text-zinc-900 mb-1 sm:mb-2 leading-tight"
          >
            What Our Clients Say
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-zinc-500 text-[14px] sm:text-base md:text-lg font-normal max-w-[330px] sm:max-w-lg mx-auto leading-[1.4] sm:leading-[1.5]"
          >
            Real results from creators and brands we've helped.
          </motion.p>
        </div>

        {/* Minimal Category Filter Tabs & Navigation Controls */}
        <div className="max-w-[420px] sm:max-w-none mx-auto flex items-center justify-between gap-4 mb-3.5 sm:mb-5 px-0.5">
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
            <span className="text-zinc-300 select-none">•</span>
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
            <span className="text-zinc-300 select-none">•</span>
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
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-600 hover:text-zinc-900 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs active:scale-95 touch-manipulation"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next testimonial"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-600 hover:text-zinc-900 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs active:scale-95 touch-manipulation"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Window Container (Bounded to max 420px on mobile, full width on desktop) */}
        <motion.div 
          ref={containerRef}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[420px] sm:max-w-none mx-auto relative overflow-hidden py-1"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Sliding Track */}
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            dragTransition={{ bounceStiffness: 350, bounceDamping: 32 }}
            onDragEnd={handleDragEnd}
            animate={{ x: targetX }}
            transition={
              isTransitioning
                ? { type: "spring", stiffness: 240, damping: 28, mass: 0.85 }
                : { duration: 0 }
            }
            onAnimationComplete={handleAnimationComplete}
            className="flex cursor-grab active:cursor-grabbing touch-pan-y will-change-transform"
            style={{ width: 'max-content' }}
          >
            {virtualList.map((item, idx) => {
              const textLength = item.content ? item.content.length : 0;
              // Exceptionally short testimonials (< 90 chars) receive slightly more vertical inner padding and margin to balance card height
              const isShort = textLength < 90;

              return (
                <div
                  key={`${item.id}-${idx}`}
                  style={{
                    width: `${cardWidth}px`,
                    minWidth: `${cardWidth}px`,
                    maxWidth: `${cardWidth}px`,
                    marginRight: `${gap}px`
                  }}
                  className="shrink-0 h-auto transition-transform duration-300 ease-out"
                >
                  {/* Premium Black / Zinc-950 Card with dynamic padding balance */}
                  <div className={`bg-zinc-950 border border-zinc-800/90 rounded-[1.5rem] ${isShort ? 'p-7 sm:p-8 md:p-9' : 'p-6 sm:p-7 md:p-8'} flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 relative h-full min-h-[220px] sm:min-h-[240px] select-none box-border`}>
                    <div>
                      {/* Top Row: Stars + Metric Tag if available */}
                      <div className={`flex items-center justify-between gap-2 ${isShort ? 'mb-5 sm:mb-6' : 'mb-4'}`}>
                        <div className="flex text-amber-400" aria-label={`${item.rating || 5} out of 5 stars`}>
                          {[...Array(item.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        {item.metricTag && (
                          <span className="text-[11px] font-semibold text-zinc-300 bg-zinc-800/90 border border-zinc-700/60 px-2 py-0.5 rounded-md">
                            {item.metricTag}
                          </span>
                        )}
                      </div>

                      {/* Review Quote with Natural Word Wrap */}
                      <p className={`text-zinc-200 font-normal ${isShort ? 'text-sm sm:text-base leading-[1.65] mb-6' : 'text-sm sm:text-[15px] leading-[1.6] mb-5'} break-words whitespace-normal`}>
                        "{item.content}"
                      </p>
                    </div>

                    {/* Client Info */}
                    <div className={`${isShort ? 'pt-4 sm:pt-5' : 'pt-3.5'} border-t border-zinc-800/80 mt-auto`}>
                      <h3 className="font-bold text-white text-sm sm:text-base tracking-tight truncate">
                        {item.author}
                      </h3>
                      <p className="text-xs sm:text-[13px] text-zinc-400 font-medium mt-0.5 truncate">
                        {item.role}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Centered Pagination Dots Below Card */}
        {N > 0 && (
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-5 sm:mt-6">
            {filteredTestimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeDotIndex
                    ? 'w-5 sm:w-6 bg-zinc-800'
                    : 'w-1.5 bg-zinc-300 hover:bg-zinc-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

