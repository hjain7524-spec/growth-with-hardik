import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Check, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { SPLITFORMS_ENDPOINT, SPLITFORMS_ACCESS_KEY, DESTINATION_EMAIL } from './constants';

export interface GrowthAuditData {
  name: string;
  instagramUsername: string;
  category: string;
  challenge: string;
  supportLevel: string;
  businessDescription: string;
  hp_website?: string;
}

interface GrowthAuditExperienceProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CATEGORIES = [
  'Creator',
  'Personal Brand',
  'Business',
  'Coach / Consultant',
  'Brand',
  'Other'
];

const CHALLENGES = [
  'Not getting enough reach',
  'Content isn’t converting',
  'Don’t know what to post',
  'Struggling with consistency',
  'Getting leads but not enough clients',
  'Need a complete content system'
];

const SUPPORT_LEVELS = [
  'Strategy & guidance',
  'Content creation',
  'Full social media management',
  'I’m exploring my options'
];

const TOTAL_STEPS = 5;

export const GrowthAuditExperience: React.FC<GrowthAuditExperienceProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<GrowthAuditData>({
    name: '',
    instagramUsername: '',
    category: '',
    challenge: '',
    supportLevel: '',
    businessDescription: '',
    hp_website: ''
  });

  const [stepError, setStepError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [direction, setDirection] = useState<number>(1); // 1 = forward, -1 = back

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // Auto-focus input when step changes
  useEffect(() => {
    if (isOpen && !isSubmitted) {
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isOpen, isSubmitted]);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      // Don't reset if already submitted in the same session
      if (!isSubmitted) {
        setStepError(null);
      }
    }
  }, [isOpen, isSubmitted]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    onClose();
    // After animation, if submitted, reset for next time
    if (isSubmitted) {
      setTimeout(() => {
        setIsSubmitted(false);
        setCurrentStep(1);
        setFormData({
          name: '',
          instagramUsername: '',
          category: '',
          challenge: '',
          supportLevel: '',
          businessDescription: '',
          hp_website: ''
        });
      }, 300);
    }
  };

  const validateCurrentStep = (): boolean => {
    setStepError(null);

    if (currentStep === 1) {
      const name = formData.name.trim();
      if (!name) {
        setStepError('Please enter your name.');
        return false;
      }
      if (name.length < 2) {
        setStepError('Please enter your full name.');
        return false;
      }
      return true;
    }

    if (currentStep === 2) {
      const handle = formData.instagramUsername.trim().replace(/^@/, '');
      if (!handle) {
        setStepError('Please enter your Instagram username.');
        return false;
      }
      if (handle.length < 1 || handle.length > 30) {
        setStepError('Please enter a valid Instagram username.');
        return false;
      }
      return true;
    }

    if (currentStep === 3) {
      if (!formData.category) {
        setStepError('Please select what best describes you.');
        return false;
      }
      return true;
    }

    if (currentStep === 4) {
      if (!formData.challenge) {
        setStepError('Please choose your biggest growth challenge.');
        return false;
      }
      return true;
    }

    if (currentStep === 5) {
      if (!formData.supportLevel) {
        setStepError('Please choose the level of support you are looking for.');
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) return;

    if (currentStep < TOTAL_STEPS) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
      setStepError(null);
    } else {
      // Final submit
      await submitForm();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
      setStepError(null);
    }
  };

  const handleKeyDownInput = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  };

  const submitForm = async () => {
    if (isSubmitting) return;

    // Honeypot check
    if (formData.hp_website) {
      setIsSubmitted(true);
      if (onSuccess) onSuccess();
      return;
    }

    setIsSubmitting(true);
    setStepError(null);

    const cleanHandle = formData.instagramUsername.trim().replace(/^@/, '');
    const cleanName = formData.name.trim();

    try {
      const response = await fetch(SPLITFORMS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: SPLITFORMS_ACCESS_KEY,
          name: cleanName,
          instagramUsername: `@${cleanHandle}`,
          roleCategory: formData.category,
          growthChallenge: formData.challenge,
          supportLevel: formData.supportLevel,
          businessDescription: formData.businessDescription.trim() || 'None provided',
          destination_email: DESTINATION_EMAIL,
          from_name: cleanName,
          _subject: `New Growth Audit Request: ${cleanName} (@${cleanHandle})`
        })
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok || (responseData && responseData.success === false)) {
        throw new Error(responseData?.message || responseData?.error || 'Failed to submit request. Please try again.');
      }

      setIsSubmitted(true);
      if (onSuccess) {
        onSuccess();
      }
      try {
        localStorage.setItem('lead_capture_submitted', 'true');
      } catch {
        // Fallback
      }
    } catch (err: any) {
      setStepError(err?.message || 'Something went wrong. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = (currentStep / TOTAL_STEPS) * 100;

  const slideVariants = {
    enter: (d: number) => ({
      x: d > 0 ? 24 : -24,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (d: number) => ({
      x: d > 0 ? -24 : 24,
      opacity: 0
    })
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[#070709] text-white flex flex-col justify-between overflow-hidden selection:bg-blue-600/30 selection:text-white">
          {/* Subtle Ambient Background Gradient */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-blue-600/10 rounded-full blur-[140px]" />
            <div className="absolute -bottom-40 right-1/4 w-[400px] h-[350px] bg-indigo-600/8 rounded-full blur-[140px]" />
          </div>

          {/* Top Header: Step Tracker & Thin Progress Bar */}
          <header className="relative z-20 w-full max-w-xl mx-auto px-5 sm:px-8 pt-4 sm:pt-6 pb-2 shrink-0">
            <div className="flex items-center justify-between gap-4 mb-3">
              {/* Step indicator */}
              {!isSubmitted ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] sm:text-xs font-bold tracking-wider text-zinc-400 uppercase">
                    STEP <span className="text-white">0{currentStep}</span> OF 0{TOTAL_STEPS}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-blue-400 text-xs sm:text-sm font-semibold tracking-wide uppercase">
                  <Sparkles className="w-4 h-4" />
                  <span>Audit Diagnostics</span>
                </div>
              )}

              {/* Close Button */}
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close growth audit"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/20 border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer touch-manipulation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thin 2px Progress Bar */}
            {!isSubmitted && (
              <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            )}
          </header>

          {/* Main Question / Form Container - Consistent top-aligned offset */}
          <main className="relative z-10 w-full max-w-xl mx-auto px-5 sm:px-8 pt-4 pb-6 flex-1 overflow-y-auto flex flex-col justify-start">
            {/* Honeypot hidden input */}
            <div style={{ display: 'none' }} aria-hidden="true">
              <input
                type="text"
                name="hp_website"
                tabIndex={-1}
                value={formData.hp_website}
                onChange={e => setFormData(prev => ({ ...prev, hp_website: e.target.value }))}
              />
            </div>

            <AnimatePresence mode="wait" custom={direction}>
              {/* SUCCESS STATE */}
              {isSubmitted ? (
                <motion.div
                  key="success-state"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center py-8 sm:py-12 max-w-md mx-auto my-auto"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                    <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3 leading-tight">
                    Your Growth Audit Request is in.
                  </h2>

                  <p className="text-zinc-400 text-sm sm:text-base font-normal leading-relaxed mb-8">
                    We’ll review your Instagram and identify your biggest growth opportunity. If we’re a good fit, we’ll reach out with the next steps.
                  </p>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-lg transition-all active:scale-95 cursor-pointer touch-manipulation min-h-[48px]"
                  >
                    <span>Done</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={`step-${currentStep}`}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full"
                >
                  {/* STEP 01: Name */}
                  {currentStep === 1 && (
                    <div>
                      {/* Consistent Question Block */}
                      <div className="mb-4 sm:mb-5">
                        <span className="text-[11px] sm:text-xs font-bold tracking-wider text-blue-400 uppercase block mb-1">
                          Step 01
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight mb-1.5">
                          What’s your name?
                        </h1>
                        <p className="text-zinc-400 text-xs sm:text-sm font-normal">
                          Let’s start with who we’re speaking with.
                        </p>
                      </div>

                      {/* Input directly below */}
                      <div>
                        <input
                          ref={inputRef as React.RefObject<HTMLInputElement>}
                          type="text"
                          autoComplete="name"
                          value={formData.name}
                          onChange={e => {
                            setFormData(prev => ({ ...prev, name: e.target.value }));
                            if (stepError) setStepError(null);
                          }}
                          onKeyDown={handleKeyDownInput}
                          placeholder="Your name"
                          className="w-full bg-white/[0.04] border border-white/10 hover:border-white/20 focus:border-blue-500/80 rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 text-base sm:text-lg font-medium text-white placeholder:text-zinc-600 focus:outline-none transition-all shadow-inner"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 02: Instagram Username */}
                  {currentStep === 2 && (
                    <div>
                      {/* Consistent Question Block */}
                      <div className="mb-4 sm:mb-5">
                        <span className="text-[11px] sm:text-xs font-bold tracking-wider text-blue-400 uppercase block mb-1">
                          Step 02
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight mb-1.5">
                          What’s your Instagram username?
                        </h1>
                        <p className="text-zinc-400 text-xs sm:text-sm font-normal">
                          We’ll audit your profile, content pillars, and reach bottlenecks.
                        </p>
                      </div>

                      {/* Input directly below */}
                      <div>
                        <div className="relative flex items-center">
                          <span className="absolute left-4 sm:left-5 text-base sm:text-lg font-semibold text-zinc-500 select-none">
                            @
                          </span>
                          <input
                            ref={inputRef as React.RefObject<HTMLInputElement>}
                            type="text"
                            autoComplete="username"
                            value={formData.instagramUsername.replace(/^@/, '')}
                            onChange={e => {
                              const val = e.target.value.replace(/^@/, '').trim();
                              setFormData(prev => ({ ...prev, instagramUsername: val }));
                              if (stepError) setStepError(null);
                            }}
                            onKeyDown={handleKeyDownInput}
                            placeholder="yourusername"
                            className="w-full bg-white/[0.04] border border-white/10 hover:border-white/20 focus:border-blue-500/80 rounded-2xl pl-9 sm:pl-11 pr-4 sm:pr-5 py-3.5 sm:py-4 text-base sm:text-lg font-medium text-white placeholder:text-zinc-600 focus:outline-none transition-all shadow-inner"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 03: Category / Role */}
                  {currentStep === 3 && (
                    <div>
                      {/* Consistent Question Block */}
                      <div className="mb-3.5 sm:mb-4">
                        <span className="text-[11px] sm:text-xs font-bold tracking-wider text-blue-400 uppercase block mb-1">
                          Step 03
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight mb-1.5">
                          What best describes you?
                        </h1>
                        <p className="text-zinc-400 text-xs sm:text-sm font-normal">
                          Select the category that best matches your presence.
                        </p>
                      </div>

                      {/* Compact full-width / 2-col option cards */}
                      <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                        {CATEGORIES.map(cat => {
                          const isSelected = formData.category === cat;
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, category: cat }));
                                if (stepError) setStepError(null);
                              }}
                              className={`text-left px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-xl sm:rounded-2xl border transition-all duration-200 flex items-center justify-between cursor-pointer touch-manipulation min-h-[46px] sm:min-h-[50px] ${
                                isSelected
                                  ? 'bg-blue-600/15 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/40'
                                  : 'bg-white/[0.03] border-white/10 hover:border-white/20 text-zinc-300 hover:text-white hover:bg-white/[0.06]'
                              }`}
                            >
                              <span className="text-xs sm:text-sm font-semibold tracking-tight leading-snug">
                                {cat}
                              </span>
                              <div
                                className={`w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 ml-1.5 rounded-full border flex items-center justify-center transition-all ${
                                  isSelected
                                    ? 'border-blue-500 bg-blue-600 text-white'
                                    : 'border-white/20 bg-white/5'
                                }`}
                              >
                                {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* STEP 04: Biggest Growth Challenge */}
                  {currentStep === 4 && (
                    <div>
                      {/* Consistent Question Block */}
                      <div className="mb-3.5 sm:mb-4">
                        <span className="text-[11px] sm:text-xs font-bold tracking-wider text-blue-400 uppercase block mb-1">
                          Step 04
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight mb-1.5">
                          What’s your biggest growth challenge?
                        </h1>
                        <p className="text-zinc-400 text-xs sm:text-sm font-normal">
                          Choose the challenge that best describes where you’re stuck.
                        </p>
                      </div>

                      {/* Compact full-width cards with clear selected states */}
                      <div className="space-y-2 sm:space-y-2.5">
                        {CHALLENGES.map(item => {
                          const isSelected = formData.challenge === item;
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, challenge: item }));
                                if (stepError) setStepError(null);
                              }}
                              className={`w-full text-left px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl border transition-all duration-200 flex items-center justify-between cursor-pointer touch-manipulation min-h-[44px] sm:min-h-[48px] ${
                                isSelected
                                  ? 'bg-blue-600/15 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/40'
                                  : 'bg-white/[0.03] border-white/10 hover:border-white/20 text-zinc-300 hover:text-white hover:bg-white/[0.06]'
                              }`}
                            >
                              <span className="text-xs sm:text-sm font-medium tracking-tight pr-2 leading-snug">
                                {item}
                              </span>
                              <div
                                className={`w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 rounded-full border flex items-center justify-center transition-all ${
                                  isSelected
                                    ? 'border-blue-500 bg-blue-600 text-white'
                                    : 'border-white/20 bg-white/5'
                                }`}
                              >
                                {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* STEP 05: Support Level & Optional Business Description */}
                  {currentStep === 5 && (
                    <div>
                      {/* Consistent Question Block */}
                      <div className="mb-3.5 sm:mb-4">
                        <span className="text-[11px] sm:text-xs font-bold tracking-wider text-blue-400 uppercase block mb-1">
                          Step 05
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight mb-1.5">
                          What level of support are you looking for?
                        </h1>
                        <p className="text-zinc-400 text-xs sm:text-sm font-normal">
                          This helps us personalize our diagnostic strategy for your scale.
                        </p>
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-2 gap-2 sm:gap-2.5 mb-3 sm:mb-4">
                        {SUPPORT_LEVELS.map(item => {
                          const isSelected = formData.supportLevel === item;
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, supportLevel: item }));
                                if (stepError) setStepError(null);
                              }}
                              className={`text-left px-3 py-2.5 sm:px-4 sm:py-3.5 rounded-xl sm:rounded-2xl border transition-all duration-200 flex items-center justify-between cursor-pointer touch-manipulation min-h-[46px] sm:min-h-[50px] ${
                                isSelected
                                  ? 'bg-blue-600/15 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/40'
                                  : 'bg-white/[0.03] border-white/10 hover:border-white/20 text-zinc-300 hover:text-white hover:bg-white/[0.06]'
                              }`}
                            >
                              <span className="text-[11px] sm:text-sm font-semibold tracking-tight leading-snug">
                                {item}
                              </span>
                              <div
                                className={`w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 ml-1 rounded-full border flex items-center justify-center transition-all ${
                                  isSelected
                                    ? 'border-blue-500 bg-blue-600 text-white'
                                    : 'border-white/20 bg-white/5'
                                }`}
                              >
                                {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Optional textarea */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor="businessDescription"
                            className="text-[11px] sm:text-xs font-medium text-zinc-400"
                          >
                            Tell us about your business
                          </label>
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                            Optional
                          </span>
                        </div>
                        <textarea
                          id="businessDescription"
                          rows={2}
                          value={formData.businessDescription}
                          onChange={e =>
                            setFormData(prev => ({ ...prev, businessDescription: e.target.value }))
                          }
                          placeholder="Anything we should know about your business, audience, or current situation…"
                          className="w-full bg-white/[0.04] border border-white/10 hover:border-white/20 focus:border-blue-500/80 rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm font-normal text-white placeholder:text-zinc-600 focus:outline-none transition-all resize-none shadow-inner leading-relaxed min-h-[48px] sm:min-h-[56px] max-h-[64px]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Inline Error Notice */}
                  {stepError && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 text-xs sm:text-sm font-medium text-red-400 flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3.5 py-2 rounded-xl"
                      role="alert"
                    >
                      <span>{stepError}</span>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Fixed Bottom Action Bar: 56px height, Back on left, Next on right, above iPhone safe area */}
          {!isSubmitted && (
            <footer className="relative z-30 w-full max-w-xl mx-auto px-5 sm:px-8 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] shrink-0 border-t border-white/[0.08] bg-[#070709]/95 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                {/* Back Button on Left */}
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    aria-label="Previous step"
                    className="h-[56px] min-h-[56px] px-5 sm:px-6 rounded-2xl bg-white/[0.05] hover:bg-white/10 active:bg-white/15 border border-white/10 text-zinc-300 hover:text-white font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer touch-manipulation disabled:opacity-40 shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                )}

                {/* Next / Submit Button on Right */}
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className={`h-[56px] min-h-[56px] flex-1 px-6 sm:px-8 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 shadow-lg shadow-white/5 active:scale-[0.98] transition-all cursor-pointer touch-manipulation disabled:opacity-60`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : currentStep === TOTAL_STEPS ? (
                    <>
                      <span>Request My Growth Audit</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Next</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </footer>
          )}
        </div>
      )}
    </AnimatePresence>
  );
};
