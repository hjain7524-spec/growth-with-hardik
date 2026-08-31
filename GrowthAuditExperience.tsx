import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle2, ArrowRight, AlertCircle, ChevronDown } from 'lucide-react';
import { SPLITFORMS_ENDPOINT, SPLITFORMS_ACCESS_KEY, DESTINATION_EMAIL } from './constants';
import { trackFormOpen, trackFormStart, trackFormSubmit, getStoredUtmParams } from './analytics';

export interface GrowthPlanFormData {
  name: string;
  instagramUsername: string;
  category: string;
  goal: string;
  challenge: string;
  countryCode: string;
  phoneNumber: string;
  hp_website?: string;
}

interface FormErrors {
  name?: string;
  instagramUsername?: string;
  category?: string;
  goal?: string;
  challenge?: string;
  phoneNumber?: string;
  general?: string;
}

interface GrowthAuditExperienceProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'US / Canada', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
  { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
  { code: '+46', country: 'Sweden', flag: '🇸🇪' },
  { code: '+64', country: 'New Zealand', flag: '🇳🇿' },
  { code: '+353', country: 'Ireland', flag: '🇮🇪' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+974', country: 'Qatar', flag: '🇶🇦' },
  { code: '+965', country: 'Kuwait', flag: '🇰🇼' },
  { code: '+968', country: 'Oman', flag: '🇴🇲' },
  { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+63', country: 'Philippines', flag: '🇵🇭' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+52', country: 'Mexico', flag: '🇲🇽' },
  { code: '+90', country: 'Turkey', flag: '🇹🇷' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷' },
  { code: '+92', country: 'Pakistan', flag: '🇵🇰' },
  { code: '+880', country: 'Bangladesh', flag: '🇧🇩' },
  { code: '+977', country: 'Nepal', flag: '🇳🇵' },
  { code: '+94', country: 'Sri Lanka', flag: '🇱🇰' }
];

const CATEGORIES = [
  'Creator',
  'Coach / Consultant',
  'Personal Brand',
  'Business / Brand',
  'Agency / Freelancer',
  'Other'
];

const GOALS = [
  'Grow my followers',
  'Get more leads',
  'Get more clients',
  'Build my personal brand',
  'Improve my content',
  'Other'
];

const CHALLENGES = [
  "I'm not growing",
  "I'm getting views but no leads",
  "I don't know what content to create",
  "I can't stay consistent",
  "My content isn't converting",
  "I need a clear strategy",
  "Other"
];

export const GrowthAuditExperience: React.FC<GrowthAuditExperienceProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState<GrowthPlanFormData>({
    name: '',
    instagramUsername: '',
    category: '',
    goal: '',
    challenge: '',
    countryCode: '+91',
    phoneNumber: '',
    hp_website: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const hasStartedRef = useRef<boolean>(false);

  // Track form_open event when modal opens
  useEffect(() => {
    if (isOpen) {
      hasStartedRef.current = false;
      trackFormOpen('user_click');

      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Focus name input on open
  useEffect(() => {
    if (isOpen && !isSubmitted) {
      const timer = setTimeout(() => {
        if (nameInputRef.current) {
          nameInputRef.current.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isSubmitted]);

  // Handle tracking form_start on first interaction
  const handleFirstInteraction = (fieldName: string) => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      trackFormStart(fieldName);
    }
  };

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
    if (isSubmitted) {
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          instagramUsername: '',
          category: '',
          goal: '',
          challenge: '',
          countryCode: '+91',
          phoneNumber: '',
          hp_website: ''
        });
        setErrors({});
      }, 250);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const cleanName = formData.name.trim();
    if (!cleanName) {
      newErrors.name = 'Please enter your name.';
    } else if (cleanName.length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    const cleanHandle = formData.instagramUsername.trim().replace(/^@/, '');
    if (!cleanHandle) {
      newErrors.instagramUsername = 'Please enter your Instagram username.';
    } else if (cleanHandle.length < 1 || cleanHandle.length > 30) {
      newErrors.instagramUsername = 'Please enter a valid Instagram username.';
    }

    if (!formData.category) {
      newErrors.category = 'Please select what best describes you.';
    }

    if (!formData.goal) {
      newErrors.goal = "Please select your main goal.";
    }

    if (!formData.challenge) {
      newErrors.challenge = "Please select what's holding your account back.";
    }

    const cleanPhone = formData.phoneNumber.replace(/[\s\-\(\)]/g, '');
    if (!cleanPhone) {
      newErrors.phoneNumber = 'Please enter your phone number.';
    } else if (cleanPhone.length < 6 || cleanPhone.length > 15 || !/^\d+$/.test(cleanPhone)) {
      newErrors.phoneNumber = 'Please enter a valid phone number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateForm()) return;

    // Honeypot spam protection
    if (formData.hp_website) {
      setIsSubmitted(true);
      if (onSuccess) onSuccess();
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    const cleanHandle = formData.instagramUsername.trim().replace(/^@/, '');
    const cleanName = formData.name.trim();
    const fullPhone = `${formData.countryCode} ${formData.phoneNumber.trim()}`;
    const utm = getStoredUtmParams();

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
          growthGoal: formData.goal,
          growthChallenge: formData.challenge,
          phoneNumber: fullPhone,
          utm_source: utm.utm_source || 'direct',
          utm_medium: utm.utm_medium || 'none',
          utm_campaign: utm.utm_campaign || '',
          utm_term: utm.utm_term || '',
          utm_content: utm.utm_content || '',
          traffic_source: utm.traffic_source || 'direct',
          landing_page: utm.landing_page || window.location.pathname,
          referrer: utm.referrer || document.referrer || '',
          destination_email: DESTINATION_EMAIL,
          from_name: cleanName,
          _subject: `Growth Plan Request: ${cleanName} (@${cleanHandle}) ${utm.utm_source !== 'direct' ? `[${utm.utm_source}]` : ''}`
        })
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok || (responseData && responseData.success === false)) {
        throw new Error(responseData?.message || responseData?.error || 'Failed to submit request. Please try again.');
      }

      // Mark submitted state
      setIsSubmitted(true);

      // Track primary conversion event in GA4 / GTM
      trackFormSubmit({
        category: formData.category,
        goal: formData.goal,
        challenge: formData.challenge,
        instagramHandle: cleanHandle,
        name: cleanName,
        phone: fullPhone
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrors({
        general: err?.message || 'Something went wrong submitting your form. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="growth-plan-title"
      >
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-h-[90vh] max-w-[430px] bg-[#09090b] text-white rounded-2xl border border-zinc-800/90 shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-start justify-between px-4 sm:px-5 pt-4 pb-2 shrink-0">
            <div>
              <h2 id="growth-plan-title" className="text-lg sm:text-xl font-black tracking-tight text-white leading-tight">
                {isSubmitted ? 'REQUEST RECEIVED' : 'Build Your Growth Plan'}
              </h2>
              {!isSubmitted && (
                <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                  Tell us a few quick details about your Instagram and goals.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-7 h-7 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 flex items-center justify-center transition-colors cursor-pointer touch-manipulation active:scale-95 shrink-0 ml-2"
              aria-label="Close dialog"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Form / Success Body */}
          <div 
            className="flex-1 overflow-y-auto px-4 sm:px-5 py-2 space-y-3 overscroll-contain"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {isSubmitted ? (
              /* Success Confirmation */
              <div className="py-8 sm:py-10 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg sm:text-xl font-black tracking-tight uppercase text-white">
                    YOUR GROWTH PLAN REQUEST IS IN.
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xs mx-auto">
                    We've received your details and will get back to you shortly.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full sm:w-auto px-7 py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer touch-manipulation"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* Compact Single-Page Form */
              <form onSubmit={handleSubmit} noValidate className="space-y-2.5 pb-1">
                
                {/* Honeypot */}
                <input
                  type="text"
                  name="hp_website"
                  value={formData.hp_website}
                  onChange={e => setFormData(prev => ({ ...prev, hp_website: e.target.value }))}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden pointer-events-none opacity-0 h-0 w-0 absolute"
                  aria-hidden="true"
                />

                {/* 1. Full Name */}
                <div className="space-y-1">
                  <label htmlFor="field-name" className="text-[11px] font-semibold text-zinc-300 block">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    ref={nameInputRef}
                    id="field-name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onFocus={() => handleFirstInteraction('name')}
                    onChange={e => {
                      handleFirstInteraction('name');
                      setFormData(prev => ({ ...prev, name: e.target.value }));
                      if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                    }}
                    placeholder="Your name"
                    className={`w-full bg-zinc-900/90 border ${
                      errors.name ? 'border-red-500' : 'border-zinc-800 focus:border-zinc-400'
                    } rounded-lg px-3 py-2 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none transition-colors touch-manipulation`}
                  />
                  {errors.name && (
                    <p className="text-[11px] text-red-400 flex items-center gap-1 pt-0.5" role="alert">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                {/* 2. Instagram Username */}
                <div className="space-y-1">
                  <label htmlFor="field-instagram" className="text-[11px] font-semibold text-zinc-300 block">
                    Instagram Username <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="field-instagram"
                      type="text"
                      name="instagramUsername"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck="false"
                      value={formData.instagramUsername}
                      onFocus={() => handleFirstInteraction('instagramUsername')}
                      onChange={e => {
                        handleFirstInteraction('instagramUsername');
                        let val = e.target.value;
                        if (val && !val.startsWith('@')) {
                          val = `@${val}`;
                        }
                        setFormData(prev => ({ ...prev, instagramUsername: val }));
                        if (errors.instagramUsername) setErrors(prev => ({ ...prev, instagramUsername: undefined }));
                      }}
                      placeholder="@username"
                      className={`w-full bg-zinc-900/90 border ${
                        errors.instagramUsername ? 'border-red-500' : 'border-zinc-800 focus:border-zinc-400'
                      } rounded-lg px-3 py-2 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none transition-colors touch-manipulation font-medium`}
                    />
                  </div>
                  {errors.instagramUsername && (
                    <p className="text-[11px] text-red-400 flex items-center gap-1 pt-0.5" role="alert">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.instagramUsername}</span>
                    </p>
                  )}
                </div>

                {/* 3. What best describes you? */}
                <div className="space-y-1">
                  <label htmlFor="field-category" className="text-[11px] font-semibold text-zinc-300 block">
                    What best describes you? <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="field-category"
                      value={formData.category}
                      onFocus={() => handleFirstInteraction('category')}
                      onChange={e => {
                        handleFirstInteraction('category');
                        setFormData(prev => ({ ...prev, category: e.target.value }));
                        if (errors.category) setErrors(prev => ({ ...prev, category: undefined }));
                      }}
                      className={`w-full appearance-none bg-zinc-900/90 border ${
                        errors.category ? 'border-red-500' : 'border-zinc-800 focus:border-zinc-400'
                      } rounded-lg px-3 py-2 pr-8 text-xs sm:text-sm ${
                        formData.category ? 'text-white' : 'text-zinc-500'
                      } focus:outline-none transition-colors cursor-pointer touch-manipulation`}
                    >
                      <option value="" disabled className="bg-zinc-900 text-zinc-500">
                        Select an option
                      </option>
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat} className="bg-zinc-900 text-white">
                          {cat}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {errors.category && (
                    <p className="text-[11px] text-red-400 flex items-center gap-1 pt-0.5" role="alert">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.category}</span>
                    </p>
                  )}
                </div>

                {/* 4. What's your main goal? */}
                <div className="space-y-1">
                  <label htmlFor="field-goal" className="text-[11px] font-semibold text-zinc-300 block">
                    What's your main goal? <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="field-goal"
                      value={formData.goal}
                      onFocus={() => handleFirstInteraction('goal')}
                      onChange={e => {
                        handleFirstInteraction('goal');
                        setFormData(prev => ({ ...prev, goal: e.target.value }));
                        if (errors.goal) setErrors(prev => ({ ...prev, goal: undefined }));
                      }}
                      className={`w-full appearance-none bg-zinc-900/90 border ${
                        errors.goal ? 'border-red-500' : 'border-zinc-800 focus:border-zinc-400'
                      } rounded-lg px-3 py-2 pr-8 text-xs sm:text-sm ${
                        formData.goal ? 'text-white' : 'text-zinc-500'
                      } focus:outline-none transition-colors cursor-pointer touch-manipulation`}
                    >
                      <option value="" disabled className="bg-zinc-900 text-zinc-500">
                        Select your main goal
                      </option>
                      {GOALS.map(g => (
                        <option key={g} value={g} className="bg-zinc-900 text-white">
                          {g}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {errors.goal && (
                    <p className="text-[11px] text-red-400 flex items-center gap-1 pt-0.5" role="alert">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.goal}</span>
                    </p>
                  )}
                </div>

                {/* 5. What's holding your Instagram back? */}
                <div className="space-y-1">
                  <label htmlFor="field-challenge" className="text-[11px] font-semibold text-zinc-300 block">
                    What's holding your Instagram back? <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="field-challenge"
                      value={formData.challenge}
                      onFocus={() => handleFirstInteraction('challenge')}
                      onChange={e => {
                        handleFirstInteraction('challenge');
                        setFormData(prev => ({ ...prev, challenge: e.target.value }));
                        if (errors.challenge) setErrors(prev => ({ ...prev, challenge: undefined }));
                      }}
                      className={`w-full appearance-none bg-zinc-900/90 border ${
                        errors.challenge ? 'border-red-500' : 'border-zinc-800 focus:border-zinc-400'
                      } rounded-lg px-3 py-2 pr-8 text-xs sm:text-sm ${
                        formData.challenge ? 'text-white' : 'text-zinc-500'
                      } focus:outline-none transition-colors cursor-pointer touch-manipulation`}
                    >
                      <option value="" disabled className="bg-zinc-900 text-zinc-500">
                        Select what's holding you back
                      </option>
                      {CHALLENGES.map(ch => (
                        <option key={ch} value={ch} className="bg-zinc-900 text-white">
                          {ch}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {errors.challenge && (
                    <p className="text-[11px] text-red-400 flex items-center gap-1 pt-0.5" role="alert">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.challenge}</span>
                    </p>
                  )}
                </div>

                {/* 6. Phone Number with Country Code */}
                <div className="space-y-1">
                  <label htmlFor="field-phone" className="text-[11px] font-semibold text-zinc-300 block">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-1.5">
                    {/* Country Code Select */}
                    <div className="relative w-[100px] sm:w-[110px] shrink-0">
                      <select
                        aria-label="Country Code"
                        value={formData.countryCode}
                        onFocus={() => handleFirstInteraction('countryCode')}
                        onChange={e => {
                          handleFirstInteraction('countryCode');
                          setFormData(prev => ({ ...prev, countryCode: e.target.value }));
                        }}
                        className="w-full appearance-none bg-zinc-900/90 border border-zinc-800 focus:border-zinc-400 rounded-lg px-2 py-2 pr-6 text-xs text-white focus:outline-none transition-colors cursor-pointer touch-manipulation"
                      >
                        {COUNTRY_CODES.map(item => (
                          <option key={`${item.code}-${item.country}`} value={item.code} className="bg-zinc-900 text-white">
                            {item.flag} {item.code}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* Phone Input */}
                    <input
                      id="field-phone"
                      type="tel"
                      name="phoneNumber"
                      autoComplete="tel-national"
                      value={formData.phoneNumber}
                      onFocus={() => handleFirstInteraction('phoneNumber')}
                      onChange={e => {
                        handleFirstInteraction('phoneNumber');
                        setFormData(prev => ({ ...prev, phoneNumber: e.target.value }));
                        if (errors.phoneNumber) setErrors(prev => ({ ...prev, phoneNumber: undefined }));
                      }}
                      placeholder="Enter your phone number"
                      className={`flex-1 min-w-0 bg-zinc-900/90 border ${
                        errors.phoneNumber ? 'border-red-500' : 'border-zinc-800 focus:border-zinc-400'
                      } rounded-lg px-3 py-2 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none transition-colors touch-manipulation`}
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-[11px] text-red-400 flex items-center gap-1 pt-0.5" role="alert">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.phoneNumber}</span>
                    </p>
                  )}
                </div>

                {/* General Error Banner */}
                {errors.general && (
                  <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-medium flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.general}</span>
                  </div>
                )}

                {/* CTA Button & Note */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-[42px] sm:h-[46px] rounded-lg bg-white hover:bg-zinc-200 active:bg-zinc-300 text-zinc-950 font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-1.5 shadow-lg shadow-white/5 active:scale-[0.98] transition-all cursor-pointer touch-manipulation disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending Request...</span>
                      </>
                    ) : (
                      <>
                        <span>BUILD MY GROWTH PLAN</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-zinc-400 text-center font-normal mt-1.5">
                    We'll review your details and get back to you.
                  </p>
                </div>

              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
