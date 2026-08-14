import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, CheckCircle2, Sparkles, Shield, Rocket, ArrowLeft, Clock } from 'lucide-react';
import { LeadQualificationForm } from './LeadQualificationForm';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const STORAGE_KEY_DISMISSED = 'growth_audit_modal_dismissed_time';
const STORAGE_KEY_SUBMITTED = 'lead_capture_submitted';

export const SmartLeadCaptureModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalView, setModalView] = useState<'overview' | 'form'>('overview');
  const [hasSubmitted, setHasSubmitted] = useState(false);

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
      setIsOpen(false);
    };

    window.addEventListener('lead_capture_submitted', handleSubmittedEvent);
    return () => window.removeEventListener('lead_capture_submitted', handleSubmittedEvent);
  }, []);

  // Check if dismissed within last 7 days
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

  const handleDismiss = () => {
    setIsOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY_DISMISSED, Date.now().toString());
    } catch {
      // Safe fallback
    }
  };

  const handleOpenFromFloating = () => {
    setModalView('overview');
    setIsOpen(true);
  };

  // Keyboard navigation - Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // ==========================================
  // INTELLIGENT TRIGGERS
  // ==========================================
  useEffect(() => {
    if (hasSubmitted) return;

    let hasTriggered = false;
    const isMobileDevice = window.innerWidth < 768 || 'ontouchstart' in window;

    // --- DESKTOP EXIT INTENT TRIGGER ---
    const handleMouseLeave = (e: MouseEvent) => {
      if (hasTriggered || hasSubmitted || isDismissedRecently() || isMobileDevice) return;

      // Trigger if mouse moves toward the browser close/tab/address bar area (top)
      if (e.clientY <= 15 || (e.relatedTarget === null && e.clientY < 60)) {
        hasTriggered = true;
        setModalView('overview');
        setIsOpen(true);
      }
    };

    if (!isMobileDevice) {
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    // --- MOBILE TIME + SCROLL TRIGGER ---
    let timeSpentSeconds = 0;
    let mobileTimer: NodeJS.Timeout | null = null;

    if (isMobileDevice) {
      mobileTimer = setInterval(() => {
        timeSpentSeconds += 1;
        checkMobileTrigger();
      }, 1000);
    }

    const checkMobileTrigger = () => {
      if (hasTriggered || hasSubmitted || isDismissedRecently()) return;

      // Condition 1: Spent >= 45 seconds
      if (timeSpentSeconds < 45) return;

      // Condition 2: Scrolled >= 60% of the page
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

      if (scrollPercent >= 60) {
        hasTriggered = true;
        setModalView('overview');
        setIsOpen(true);
      }
    };

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
  }, [hasSubmitted, isDismissedRecently]);

  return (
    <>
      {/* Floating "Free Growth Audit" Button at bottom-right */}
      {!hasSubmitted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40"
        >
          <motion.button
            onClick={handleOpenFromFloating}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group relative flex items-center gap-2.5 bg-[#0e0e10]/95 hover:bg-black text-white px-4 py-3 sm:px-5 sm:py-3.5 rounded-full border border-blue-500/40 hover:border-blue-400 shadow-[0_10px_30px_rgba(37,99,235,0.35)] backdrop-blur-xl transition-all duration-300 cursor-pointer select-none"
            aria-label="Open Free Instagram Growth Audit Form"
          >
            {/* Glowing ambient ring */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-300 -z-10" />

            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm shadow-blue-500">
              <Rocket className="w-3.5 h-3.5" />
            </div>

            <div className="flex flex-col text-left">
              <span className="text-xs sm:text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5">
                Free Growth Audit
                <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400 animate-pulse" />
              </span>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
          </motion.button>
        </motion.div>
      )}

      {/* Glassmorphism Popup Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-6 overflow-y-auto">
            {/* Soft Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={handleDismiss}
              className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
              aria-hidden="true"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-[#0e0e10] border border-white/15 rounded-[1.75rem] sm:rounded-[2.5rem] p-5 sm:p-8 md:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.85)] z-10 overflow-hidden my-auto max-h-[92vh] flex flex-col justify-start"
              role="dialog"
              aria-modal="true"
              aria-labelledby="audit-modal-heading"
            >
              {/* Background ambient lighting */}
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-600/15 rounded-full blur-[90px] pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-600/15 rounded-full blur-[90px] pointer-events-none" />

              {/* Close Button Top-Right */}
              <button
                onClick={handleDismiss}
                aria-label="Close modal"
                className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer z-20"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="overflow-y-auto no-scrollbar pr-0.5">
                <AnimatePresence mode="wait">
                  {modalView === 'overview' ? (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-5 sm:space-y-6 pt-1"
                    >
                      {/* Badge */}
                      <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-blue-500/10 border border-blue-500/30 px-3.5 py-1.5 rounded-full text-blue-400 font-extrabold text-[11px] sm:text-xs tracking-widest uppercase shadow-sm">
                        <Rocket className="w-3.5 h-3.5 text-blue-400" />
                        <span>FREE INSTAGRAM GROWTH AUDIT</span>
                      </div>

                      {/* Heading */}
                      <h2
                        id="audit-modal-heading"
                        className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight"
                      >
                        Let's Find What's Stopping Your Growth.
                      </h2>

                      {/* Description */}
                      <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-medium">
                        Get a free personalized Instagram Growth Audit with actionable recommendations to help you attract more followers, improve your content strategy, and generate more leads.
                      </p>

                      {/* Secondary Value Points */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 py-1">
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-zinc-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Free Strategy Call</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-zinc-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>No Obligation</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-zinc-200">
                          <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                          <span>Response in 24 Hrs</span>
                        </div>
                      </div>

                      {/* Primary CTA Button */}
                      <div className="pt-2">
                        <motion.button
                          onClick={() => setModalView('form')}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-base sm:text-lg py-4 min-h-[52px] rounded-full shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer select-none"
                        >
                          <span>Book My Free Growth Audit</span>
                          <ArrowRight className="w-5 h-5" />
                        </motion.button>
                      </div>

                      {/* Micro Footer Guarantee */}
                      <div className="flex items-center justify-center gap-2 pt-1 text-center">
                        <Shield className="w-4 h-4 text-emerald-400" />
                        <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider">
                          100% Free • No Spam • Private Strategy Session
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4 pt-1"
                    >
                      {/* Back link & Title */}
                      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-2">
                        <button
                          onClick={() => setModalView('overview')}
                          className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white text-xs font-bold transition-colors cursor-pointer py-1"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Back to Overview</span>
                        </button>
                        <span className="text-[11px] font-extrabold text-blue-400 uppercase tracking-widest">
                          Step 2 of 2
                        </span>
                      </div>

                      <div className="mb-2">
                        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                          Claim Your Free Audit
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                          Fill out the details below so we can inspect your profile before our call.
                        </p>
                      </div>

                      {/* Reused Production Lead Qualification Form */}
                      <LeadQualificationForm
                        isModal={true}
                        onSuccess={() => {
                          setTimeout(() => {
                            setHasSubmitted(true);
                          }, 2500);
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
