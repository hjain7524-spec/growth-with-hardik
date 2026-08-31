import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { trackGrowthAuditClick } from './analytics';

const GrowthAuditExperience = lazy(() => 
  import('./GrowthAuditExperience').then(module => ({ default: module.GrowthAuditExperience }))
);

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const STORAGE_KEY_DISMISSED = 'growth_audit_modal_dismissed_time';
const STORAGE_KEY_SUBMITTED = 'lead_capture_submitted';

export interface SmartLeadCaptureModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
}

export const SmartLeadCaptureModal: React.FC<SmartLeadCaptureModalProps> = ({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  onOpen: controlledOnOpen
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const isControlled = controlledIsOpen !== undefined;
  const isModalOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const openModal = useCallback(() => {
    if (isControlled && controlledOnOpen) {
      controlledOnOpen();
    } else {
      setInternalIsOpen(true);
    }
  }, [isControlled, controlledOnOpen]);

  const closeModal = useCallback(() => {
    if (isControlled && controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(false);
    }
    try {
      localStorage.setItem(STORAGE_KEY_DISMISSED, Date.now().toString());
    } catch {
      // Safe fallback
    }
  }, [isControlled, controlledOnClose]);

  // Check initial submission state from localStorage
  useEffect(() => {
    try {
      const isSub = localStorage.getItem(STORAGE_KEY_SUBMITTED) === 'true';
      if (isSub) {
        setHasSubmitted(true);
      }
    } catch {
      // Safe fallback
    }

    const handleSubmittedEvent = () => {
      setHasSubmitted(true);
    };

    const handleOpenEvent = () => {
      openModal();
    };

    window.addEventListener('lead_capture_submitted', handleSubmittedEvent);
    window.addEventListener('open_growth_audit_modal', handleOpenEvent);
    return () => {
      window.removeEventListener('lead_capture_submitted', handleSubmittedEvent);
      window.removeEventListener('open_growth_audit_modal', handleOpenEvent);
    };
  }, [openModal]);

  // Check if dismissed within last 7 days for automatic triggers
  const isDismissedRecently = useCallback(() => {
    try {
      const dismissedTime = localStorage.getItem(STORAGE_KEY_DISMISSED);
      if (dismissedTime) {
        const timeDiff = Date.now() - parseInt(dismissedTime, 10);
        if (timeDiff < SEVEN_DAYS_MS) {
          return true;
        }
      }
    } catch {
      return false;
    }
    return false;
  }, []);

  // ==========================================
  // INTELLIGENT TRIGGERS (Auto-prompts)
  // ==========================================
  useEffect(() => {
    if (hasSubmitted) return;

    let hasTriggered = false;
    const isMobileDevice = typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window);

    // Desktop Exit Intent
    const handleMouseLeave = (e: MouseEvent) => {
      if (hasTriggered || hasSubmitted || isDismissedRecently() || isMobileDevice) return;
      if (e.clientY <= 15 || (e.relatedTarget === null && e.clientY < 60)) {
        hasTriggered = true;
        openModal();
      }
    };

    if (!isMobileDevice) {
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    // Mobile Time + Scroll Trigger (>= 45s and >= 60% scroll)
    let timeSpentSeconds = 0;
    let mobileTimer: NodeJS.Timeout | null = null;

    const checkMobileTrigger = () => {
      if (hasTriggered || hasSubmitted || isDismissedRecently()) return;
      if (timeSpentSeconds < 45) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

      if (scrollPercent >= 60) {
        hasTriggered = true;
        openModal();
      }
    };

    if (isMobileDevice) {
      mobileTimer = setInterval(() => {
        timeSpentSeconds += 1;
        checkMobileTrigger();
      }, 1000);
    }

    const handleScroll = () => {
      if (isMobileDevice) {
        checkMobileTrigger();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      if (mobileTimer) clearInterval(mobileTimer);
    };
  }, [hasSubmitted, isDismissedRecently, openModal]);

  return (
    <>
      {/* Clean Sticky "Free Growth Audit" CTAs */}
      {!hasSubmitted && !isModalOpen && (
        <>
          {/* Desktop Sticky CTA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.5 }}
            className="fixed bottom-6 right-6 z-40 hidden sm:block"
          >
            <button
              onClick={() => {
                trackGrowthAuditClick('sticky_cta_desktop', 'Free Growth Audit');
                openModal();
              }}
              className="group inline-flex items-center gap-2.5 bg-zinc-950/95 hover:bg-black text-white px-5 py-3 rounded-full border border-zinc-800/80 hover:border-zinc-700 shadow-[0_8px_25px_rgba(0,0,0,0.18)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.28)] backdrop-blur-md transition-all duration-200 cursor-pointer select-none text-xs md:text-sm font-bold tracking-tight active:scale-95 touch-manipulation"
              aria-label="Free Growth Audit"
            >
              <span>Free Growth Audit</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </button>
          </motion.div>

          {/* Mobile Slim Sticky Bottom Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.5 }}
            className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/90 px-4 py-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
          >
            <button
              onClick={() => {
                trackGrowthAuditClick('sticky_cta_mobile', 'Free Growth Audit');
                openModal();
              }}
              className="w-full bg-zinc-950 active:bg-black text-white text-sm font-black py-3 px-5 rounded-xl flex items-center justify-center gap-2 shadow-sm touch-manipulation min-h-[46px] cursor-pointer"
              aria-label="Free Growth Audit"
            >
              <span>Free Growth Audit</span>
              <ArrowRight className="w-4 h-4 text-zinc-300" />
            </button>
          </motion.div>
        </>
      )}

      {/* Full-Screen Step-by-Step Growth Audit Experience */}
      {isModalOpen && (
        <Suspense fallback={null}>
          <GrowthAuditExperience
            isOpen={isModalOpen}
            onClose={closeModal}
            onSuccess={() => {
              setHasSubmitted(true);
            }}
          />
        </Suspense>
      )}
    </>
  );
};

