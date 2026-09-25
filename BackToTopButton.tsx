import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export const BackToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after user scrolls past 350px
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial position
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.75, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.75, y: 10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-40 w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] p-2.5 rounded-full bg-black border border-[#E50914]/80 hover:border-[#FF2B35] text-white flex items-center justify-center shadow-[0_6px_20px_rgba(0,0,0,0.5),0_0_12px_rgba(229,9,20,0.25)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.6),0_0_18px_rgba(229,9,20,0.4)] transition-colors duration-200 cursor-pointer touch-manipulation select-none"
          aria-label="Scroll to top of page"
        >
          <ArrowUp className="w-5 h-5 text-white stroke-[2.2]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
