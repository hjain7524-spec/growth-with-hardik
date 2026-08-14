import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertCircle, 
  Smartphone, 
  ChevronDown, 
  AtSign, 
  User, 
  Loader2, 
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { FORMSPREE_ENDPOINT } from './constants';

interface FormState {
  fullName: string;
  whatsapp: string;
  category: string;
  goal: string;
  instagramUsername: string;
  additionalDetails: string;
  hp_website: string; // Honeypot field
}

interface TouchState {
  fullName: boolean;
  whatsapp: boolean;
  category: boolean;
  goal: boolean;
  instagramUsername: boolean;
  additionalDetails: boolean;
}

interface ErrorState {
  fullName?: string;
  whatsapp?: string;
  category?: string;
  goal?: string;
  instagramUsername?: string;
  additionalDetails?: string;
  general?: string;
}

const CATEGORY_OPTIONS = [
  'Creator / Influencer',
  'Coach / Consultant',
  'Local Business',
  'E-commerce Brand',
  'Restaurant / Café',
  'Hotel / Resort',
  'Startup / Company',
  'Other'
];

const GOAL_OPTIONS = [
  'Grow My Followers',
  'Get More Leads',
  'Increase Sales',
  'Build My Brand',
  'Improve My Content',
  'Save Time with Marketing',
  'Not Sure (Need Guidance)'
];

// Spam words list to block in additional details
const SPAM_WORDS = ['test', 'asdf', 'qwerty', 'hello', 'hi', 'nothing', 'xyz', 'lorem', 'ipsum', 'abcd', '1234'];

// Helper to sanitize text input
const sanitizeInput = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Helper to auto-capitalize words
const autoCapitalizeWords = (str: string): string => {
  return str.replace(/\b[a-zA-Z]/g, letter => letter.toUpperCase());
};

export interface LeadQualificationFormProps {
  onSuccess?: () => void;
  isModal?: boolean;
}

export const LeadQualificationForm: React.FC<LeadQualificationFormProps> = ({ onSuccess, isModal = false }) => {
  const [formData, setFormData] = useState<FormState>({
    fullName: '',
    whatsapp: '',
    category: '',
    goal: '',
    instagramUsername: '',
    additionalDetails: '',
    hp_website: ''
  });

  const [touched, setTouched] = useState<TouchState>({
    fullName: false,
    whatsapp: false,
    category: false,
    goal: false,
    instagramUsername: false,
    additionalDetails: false
  });

  const [errors, setErrors] = useState<ErrorState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedFirstName, setSubmittedFirstName] = useState('');

  // Refs for seamless mobile field navigation
  const fullNameRef = useRef<HTMLInputElement>(null);
  const whatsappRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const goalRef = useRef<HTMLSelectElement>(null);
  const instagramRef = useRef<HTMLInputElement>(null);
  const additionalDetailsRef = useRef<HTMLTextAreaElement>(null);

  // Rate Limiting & Duplicate Phone Check in localStorage
  const checkRateLimitAndDuplicate = (phone: string): { allowed: boolean; reason?: string } => {
    try {
      const now = Date.now();
      const submissionHistoryRaw = localStorage.getItem('growth_audit_submissions');
      const submissions: { timestamp: number; phone: string }[] = submissionHistoryRaw
        ? JSON.parse(submissionHistoryRaw)
        : [];

      // Filter entries within last 24 hours
      const recentSubmissions = submissions.filter(s => now - s.timestamp < 24 * 60 * 60 * 1000);

      if (recentSubmissions.length >= 3) {
        return {
          allowed: false,
          reason: 'Maximum 3 submission attempts reached for today. Please try again tomorrow.'
        };
      }

      const duplicatePhone = recentSubmissions.find(s => s.phone === phone);
      if (duplicatePhone) {
        return {
          allowed: false,
          reason: 'A request with this WhatsApp number has already been submitted within the last 24 hours.'
        };
      }

      return { allowed: true };
    } catch {
      return { allowed: true };
    }
  };

  const saveSubmissionRecord = (phone: string) => {
    try {
      const now = Date.now();
      const submissionHistoryRaw = localStorage.getItem('growth_audit_submissions');
      const submissions: { timestamp: number; phone: string }[] = submissionHistoryRaw
        ? JSON.parse(submissionHistoryRaw)
        : [];

      const recentSubmissions = submissions.filter(s => now - s.timestamp < 24 * 60 * 60 * 1000);
      recentSubmissions.push({ timestamp: now, phone });

      localStorage.setItem('growth_audit_submissions', JSON.stringify(recentSubmissions));
    } catch {
      // Storage access disabled or quota exceeded
    }
  };

  // Field Level Validation Logic
  const validateField = (name: keyof FormState, value: string): string | undefined => {
    const trimmed = value.trim();

    switch (name) {
      case 'fullName': {
        if (!trimmed) {
          return 'Please enter your full name using letters only.';
        }
        // Letters only (A-Z, a-z), spaces allowed, 3 to 50 chars, no numbers, emojis or special chars
        const letterAndSpaceRegex = /^[A-Za-z\s]+$/;
        if (!letterAndSpaceRegex.test(trimmed) || trimmed.length < 3 || trimmed.length > 50) {
          return 'Please enter your full name using letters only.';
        }
        return undefined;
      }

      case 'whatsapp': {
        if (!trimmed) {
          return 'Please enter a valid WhatsApp number.';
        }
        // Must be exactly 10 digits and start with 6, 7, 8, or 9
        const indianPhoneRegex = /^[6-9]\d{9}$/;
        if (!indianPhoneRegex.test(trimmed)) {
          return 'Please enter a valid WhatsApp number.';
        }
        return undefined;
      }

      case 'category': {
        if (!trimmed) {
          return 'Please select your business category.';
        }
        return undefined;
      }

      case 'goal': {
        if (!trimmed) {
          return 'Please select your primary goal.';
        }
        return undefined;
      }

      case 'instagramUsername': {
        if (!trimmed) return undefined; // Optional field

        // Allowed: Letters, Numbers, Underscores (_), Periods (.), Max 30 chars, No spaces or symbols or URLs
        const instaUserRegex = /^[a-zA-Z0-9_.]+$/;
        if (!instaUserRegex.test(trimmed) || trimmed.length > 30) {
          return 'Please enter a valid Instagram username.';
        }
        return undefined;
      }

      case 'additionalDetails': {
        if (!trimmed) return undefined; // Optional field

        // Min 20, Max 500
        if (trimmed.length < 20 || trimmed.length > 500) {
          return 'Please provide meaningful information or leave this field empty.';
        }

        // Check for repeated characters like "aaaaaa", ".....", "11111"
        const repeatedCharRegex = /(.)\1{5,}/;
        if (repeatedCharRegex.test(trimmed)) {
          return 'Please provide meaningful information or leave this field empty.';
        }

        // Check for common spam words or meaningless single-word inputs
        const lower = trimmed.toLowerCase();
        const words = lower.split(/\s+/);
        const hasSpamWord = words.some(w => SPAM_WORDS.includes(w));
        
        if (hasSpamWord && words.length < 4) {
          return 'Please provide meaningful information or leave this field empty.';
        }

        return undefined;
      }

      default:
        return undefined;
    }
  };

  // Run real-time validation on field changes
  const handleChange = (field: keyof FormState, value: string) => {
    let processedValue = value;

    if (field === 'fullName') {
      // Filter out numbers and special symbols on type, allow letters and spaces
      processedValue = value.replace(/[^a-zA-Z\s]/g, '');
      processedValue = autoCapitalizeWords(processedValue);
    } else if (field === 'whatsapp') {
      // Filter out non-numeric characters
      processedValue = value.replace(/\D/g, '').slice(0, 10);
    } else if (field === 'instagramUsername') {
      // Automatically remove leading '@' if typed, and remove invalid characters
      processedValue = value.replace(/^@/, '');
      processedValue = processedValue.replace(/[^a-zA-Z0-9_.]/g, '').slice(0, 30);
    }

    setFormData(prev => ({ ...prev, [field]: processedValue }));

    if (touched[field as keyof TouchState]) {
      const err = validateField(field, processedValue);
      setErrors(prev => ({ ...prev, [field]: err }));
    }

    // Auto-advance logic for high conversion on mobile
    if (field === 'whatsapp' && processedValue.length === 10) {
      const phoneErr = validateField('whatsapp', processedValue);
      if (!phoneErr) {
        setTimeout(() => categoryRef.current?.focus(), 150);
      }
    } else if (field === 'category' && processedValue) {
      setTimeout(() => goalRef.current?.focus(), 150);
    } else if (field === 'goal' && processedValue) {
      setTimeout(() => instagramRef.current?.focus(), 150);
    }
  };

  const handleBlur = (field: keyof FormState) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const err = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: err }));
  };

  // Validate entire form before submission
  const validateAll = (): boolean => {
    const newErrors: ErrorState = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof FormState>).forEach(key => {
      if (key === 'hp_website') return;
      const err = validateField(key, formData[key]);
      if (err) {
        newErrors[key as keyof ErrorState] = err;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({
      fullName: true,
      whatsapp: true,
      category: true,
      goal: true,
      instagramUsername: true,
      additionalDetails: true
    });

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check for bots
    if (formData.hp_website) {
      // Silently pretend to submit to defeat bots
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 1000);
      return;
    }

    if (!validateAll()) {
      return;
    }

    // Rate Limit & Duplicate Phone Check
    const rateCheck = checkRateLimitAndDuplicate(formData.whatsapp.trim());
    if (!rateCheck.allowed) {
      setErrors(prev => ({ ...prev, general: rateCheck.reason }));
      return;
    }

    setIsSubmitting(true);
    setErrors(prev => ({ ...prev, general: undefined }));

    try {
      // Send form data directly to Formspree
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          whatsapp: formData.whatsapp.trim(),
          category: formData.category,
          goal: formData.goal,
          instagramUsername: formData.instagramUsername.trim(),
          additionalDetails: formData.additionalDetails?.trim() || 'None',
          _subject: `New Instagram Growth Audit Lead: ${formData.fullName.trim()} (@${formData.instagramUsername.trim().replace('@', '')})`
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit form to Formspree');
      }

      // Save submission record
      saveSubmissionRecord(formData.whatsapp.trim());

      try {
        localStorage.setItem('lead_capture_submitted', 'true');
        window.dispatchEvent(new CustomEvent('lead_capture_submitted'));
      } catch (e) {
        // ignore localStorage errors
      }

      const firstName = formData.fullName.trim().split(' ')[0] || 'Friend';
      setSubmittedFirstName(sanitizeInput(firstName));
      setIsSubmitted(true);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setErrors(prev => ({
        ...prev,
        general: err?.message || 'Something went wrong submitting your request. Please try again or reach out on WhatsApp.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      whatsapp: '',
      category: '',
      goal: '',
      instagramUsername: '',
      additionalDetails: '',
      hp_website: ''
    });
    setTouched({
      fullName: false,
      whatsapp: false,
      category: false,
      goal: false,
      instagramUsername: false,
      additionalDetails: false
    });
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <div className="w-full max-w-full">
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.form
            key="lead-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4 md:space-y-7 relative z-10 w-full"
            noValidate
          >
            {/* Honeypot Hidden Bot Field */}
            <div style={{ display: 'none', position: 'absolute', left: '-9999px' }} aria-hidden="true">
              <input
                type="text"
                name="hp_website"
                tabIndex={-1}
                autoComplete="off"
                value={formData.hp_website}
                onChange={e => handleChange('hp_website', e.target.value)}
              />
            </div>

            {/* General Global Error Message */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-3"
                role="alert"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errors.general}</span>
              </motion.div>
            )}

            {/* Row 1: Name & WhatsApp */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-7">
              {/* Full Name */}
              <div className="space-y-1.5 md:space-y-2 w-full">
                <div className="flex justify-between items-center">
                  <label htmlFor="fullName" className="text-[12px] sm:text-[13px] md:text-xs font-black uppercase tracking-[0.18em] text-zinc-400 ml-0.5">
                    Full Name <span className="text-blue-400">*</span>
                  </label>
                  {touched.fullName && !errors.fullName && formData.fullName && (
                    <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                    </span>
                  )}
                </div>
                <div className="relative w-full">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4 pointer-events-none" />
                  <input
                    ref={fullNameRef}
                    id="fullName"
                    type="text"
                    name="fullName"
                    autoComplete="name"
                    autoCapitalize="words"
                    autoCorrect="off"
                    spellCheck={false}
                    value={formData.fullName}
                    onChange={e => handleChange('fullName', e.target.value)}
                    onBlur={() => handleBlur('fullName')}
                    placeholder="Hardik Jain"
                    maxLength={50}
                    aria-required="true"
                    aria-invalid={!!errors.fullName}
                    aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                    className={`w-full bg-zinc-900/90 border rounded-xl md:rounded-[1.25rem] pl-11 pr-4 py-3.5 md:py-4 text-[16px] md:text-base font-bold placeholder:text-zinc-600 text-white transition-all focus:outline-none min-h-[52px] ${
                      touched.fullName && errors.fullName
                        ? 'border-red-500/80 focus:ring-2 focus:ring-red-500/30'
                        : touched.fullName && formData.fullName
                        ? 'border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/30'
                        : 'border-zinc-800 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20'
                    }`}
                  />
                </div>
                {touched.fullName && errors.fullName && (
                  <p id="fullName-error" className="text-red-400 text-xs font-semibold mt-1 flex items-center gap-1" role="alert">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* WhatsApp Number */}
              <div className="space-y-1.5 md:space-y-2 w-full">
                <div className="flex justify-between items-center">
                  <label htmlFor="whatsapp" className="text-[12px] sm:text-[13px] md:text-xs font-black uppercase tracking-[0.18em] text-zinc-400 ml-0.5">
                    WhatsApp Number <span className="text-blue-400">*</span>
                  </label>
                  {touched.whatsapp && !errors.whatsapp && formData.whatsapp && (
                    <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                    </span>
                  )}
                </div>
                <div className="relative w-full">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-zinc-400 font-extrabold text-sm pointer-events-none">
                    <Smartphone className="w-4 h-4 text-zinc-500" />
                    <span className="text-white bg-zinc-800 px-1.5 py-0.5 rounded text-xs">+91</span>
                  </div>
                  <input
                    ref={whatsappRef}
                    id="whatsapp"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={e => handleChange('whatsapp', e.target.value)}
                    onBlur={() => handleBlur('whatsapp')}
                    onPaste={e => e.preventDefault()}
                    placeholder="98765 43210"
                    maxLength={10}
                    aria-required="true"
                    aria-invalid={!!errors.whatsapp}
                    aria-describedby={errors.whatsapp ? 'whatsapp-error' : undefined}
                    className={`w-full bg-zinc-900/90 border rounded-xl md:rounded-[1.25rem] pl-20 pr-4 py-3.5 md:py-4 text-[16px] md:text-base font-bold placeholder:text-zinc-600 text-white transition-all focus:outline-none min-h-[52px] ${
                      touched.whatsapp && errors.whatsapp
                        ? 'border-red-500/80 focus:ring-2 focus:ring-red-500/30'
                        : touched.whatsapp && formData.whatsapp
                        ? 'border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/30'
                        : 'border-zinc-800 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20'
                    }`}
                  />
                </div>
                {touched.whatsapp && errors.whatsapp && (
                  <p id="whatsapp-error" className="text-red-400 text-xs font-semibold mt-1 flex items-center gap-1" role="alert">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.whatsapp}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: I am a... & My Goal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-7">
              {/* Category Dropdown */}
              <div className="space-y-1.5 md:space-y-2 w-full">
                <div className="flex justify-between items-center">
                  <label htmlFor="category" className="text-[12px] sm:text-[13px] md:text-xs font-black uppercase tracking-[0.18em] text-zinc-400 ml-0.5">
                    I am a... <span className="text-blue-400">*</span>
                  </label>
                  {touched.category && !errors.category && formData.category && (
                    <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                    </span>
                  )}
                </div>
                <div className="relative w-full">
                  <select
                    ref={categoryRef}
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={e => handleChange('category', e.target.value)}
                    onBlur={() => handleBlur('category')}
                    aria-required="true"
                    aria-invalid={!!errors.category}
                    aria-describedby={errors.category ? 'category-error' : undefined}
                    className={`w-full bg-zinc-900 border rounded-xl md:rounded-[1.25rem] px-4 py-3.5 md:py-4 text-[16px] md:text-base font-bold text-white appearance-none cursor-pointer transition-all focus:outline-none min-h-[52px] ${
                      touched.category && errors.category
                        ? 'border-red-500/80 focus:ring-2 focus:ring-red-500/30'
                        : touched.category && formData.category
                        ? 'border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/30'
                        : 'border-zinc-800 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20'
                    }`}
                  >
                    <option value="" disabled className="text-zinc-500 bg-[#0e0e10]">
                      Select your business category
                    </option>
                    {CATEGORY_OPTIONS.map(opt => (
                      <option key={opt} value={opt} className="bg-[#0e0e10] text-white py-1">
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4 pointer-events-none" />
                </div>
                {touched.category && errors.category && (
                  <p id="category-error" className="text-red-400 text-xs font-semibold mt-1 flex items-center gap-1" role="alert">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.category}
                  </p>
                )}
              </div>

              {/* Goal Dropdown */}
              <div className="space-y-1.5 md:space-y-2 w-full">
                <div className="flex justify-between items-center">
                  <label htmlFor="goal" className="text-[12px] sm:text-[13px] md:text-xs font-black uppercase tracking-[0.18em] text-zinc-400 ml-0.5">
                    My Goal <span className="text-blue-400">*</span>
                  </label>
                  {touched.goal && !errors.goal && formData.goal && (
                    <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                    </span>
                  )}
                </div>
                <div className="relative w-full">
                  <select
                    ref={goalRef}
                    id="goal"
                    name="goal"
                    value={formData.goal}
                    onChange={e => handleChange('goal', e.target.value)}
                    onBlur={() => handleBlur('goal')}
                    aria-required="true"
                    aria-invalid={!!errors.goal}
                    aria-describedby={errors.goal ? 'goal-error' : undefined}
                    className={`w-full bg-zinc-900 border rounded-xl md:rounded-[1.25rem] px-4 py-3.5 md:py-4 text-[16px] md:text-base font-bold text-white appearance-none cursor-pointer transition-all focus:outline-none min-h-[52px] ${
                      touched.goal && errors.goal
                        ? 'border-red-500/80 focus:ring-2 focus:ring-red-500/30'
                        : touched.goal && formData.goal
                        ? 'border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/30'
                        : 'border-zinc-800 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20'
                    }`}
                  >
                    <option value="" disabled className="text-zinc-500 bg-[#0e0e10]">
                      Select your primary goal
                    </option>
                    {GOAL_OPTIONS.map(g => (
                      <option key={g} value={g} className="bg-[#0e0e10] text-white py-1">
                        {g}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4 pointer-events-none" />
                </div>
                {touched.goal && errors.goal && (
                  <p id="goal-error" className="text-red-400 text-xs font-semibold mt-1 flex items-center gap-1" role="alert">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.goal}
                  </p>
                )}
              </div>
            </div>

            {/* Instagram Username (Optional) */}
            <div className="space-y-1.5 md:space-y-2 w-full">
              <div className="flex justify-between items-center">
                <label htmlFor="instagramUsername" className="text-[12px] sm:text-[13px] md:text-xs font-black uppercase tracking-[0.18em] text-zinc-400 ml-0.5">
                  Instagram Username <span className="text-zinc-600 font-normal normal-case text-xs">(Optional)</span>
                </label>
                {touched.instagramUsername && !errors.instagramUsername && formData.instagramUsername && (
                  <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                  </span>
                )}
              </div>
              <div className="relative w-full">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-zinc-400 font-extrabold text-sm pointer-events-none">
                  <AtSign className="w-4 h-4 text-zinc-500" />
                </div>
                <input
                  ref={instagramRef}
                  id="instagramUsername"
                  type="text"
                  inputMode="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  autoComplete="off"
                  name="instagramUsername"
                  value={formData.instagramUsername}
                  onChange={e => handleChange('instagramUsername', e.target.value)}
                  onBlur={() => handleBlur('instagramUsername')}
                  placeholder="growthwithhardik"
                  maxLength={30}
                  aria-invalid={!!errors.instagramUsername}
                  aria-describedby={errors.instagramUsername ? 'instagramUsername-error' : undefined}
                  className={`w-full bg-zinc-900/90 border rounded-xl md:rounded-[1.25rem] pl-11 pr-4 py-3.5 md:py-4 text-[16px] md:text-base font-bold placeholder:text-zinc-600 text-white transition-all focus:outline-none min-h-[52px] ${
                    touched.instagramUsername && errors.instagramUsername
                      ? 'border-red-500/80 focus:ring-2 focus:ring-red-500/30'
                      : touched.instagramUsername && formData.instagramUsername
                      ? 'border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/30'
                      : 'border-zinc-800 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20'
                  }`}
                />
              </div>
              {touched.instagramUsername && errors.instagramUsername && (
                <p id="instagramUsername-error" className="text-red-400 text-xs font-semibold mt-1 flex items-center gap-1" role="alert">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.instagramUsername}
                </p>
              )}
            </div>

            {/* Tell me about your business (Optional) */}
            <div className="space-y-1.5 md:space-y-2 w-full">
              <div className="flex justify-between items-center">
                <label htmlFor="additionalDetails" className="text-[12px] sm:text-[13px] md:text-xs font-black uppercase tracking-[0.18em] text-zinc-400 ml-0.5">
                  Tell me about your business <span className="text-zinc-600 font-normal normal-case text-xs">(Optional)</span>
                </label>
                <div className="flex items-center gap-2">
                  {touched.additionalDetails && !errors.additionalDetails && formData.additionalDetails && (
                    <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                    </span>
                  )}
                  {formData.additionalDetails && (
                    <span className="text-xs text-zinc-500 font-semibold">
                      {formData.additionalDetails.trim().length}/500
                    </span>
                  )}
                </div>
              </div>
              <div className="relative w-full">
                <textarea
                  ref={additionalDetailsRef}
                  id="additionalDetails"
                  name="additionalDetails"
                  rows={3}
                  autoCapitalize="sentences"
                  autoCorrect="on"
                  spellCheck={true}
                  value={formData.additionalDetails}
                  onChange={e => handleChange('additionalDetails', e.target.value)}
                  onBlur={() => handleBlur('additionalDetails')}
                  placeholder="Tell us about your business or what you'd like help with..."
                  maxLength={500}
                  aria-invalid={!!errors.additionalDetails}
                  aria-describedby={errors.additionalDetails ? 'additionalDetails-error' : undefined}
                  className={`w-full bg-zinc-900/90 border rounded-xl md:rounded-[1.25rem] p-3.5 sm:p-4 text-[16px] md:text-base font-bold placeholder:text-zinc-600 text-white transition-all focus:outline-none resize-none min-h-[90px] ${
                    touched.additionalDetails && errors.additionalDetails
                      ? 'border-red-500/80 focus:ring-2 focus:ring-red-500/30'
                      : touched.additionalDetails && formData.additionalDetails
                      ? 'border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/30'
                      : 'border-zinc-800 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20'
                  }`}
                />
              </div>
              {touched.additionalDetails && errors.additionalDetails && (
                <p id="additionalDetails-error" className="text-red-400 text-xs font-semibold mt-1 flex items-center gap-1" role="alert">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.additionalDetails}
                </p>
              )}
            </div>

            {/* Full-width CTA Button */}
            <div className="pt-2 md:pt-4 w-full">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                className={`w-full font-black py-4 md:py-5 min-h-[52px] rounded-full transition-all flex items-center justify-center gap-2.5 sm:gap-3 text-[17px] sm:text-lg md:text-xl shadow-2xl tracking-tight cursor-pointer touch-manipulation select-none ${
                  isSubmitting
                    ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed opacity-85'
                    : 'bg-white hover:bg-zinc-100 text-black shadow-white/10 active:bg-zinc-200'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    <span>Submitting your request...</span>
                  </>
                ) : (
                  <>
                    <span>Book My Free Growth Audit</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </div>

            {/* Trust Footer Indicator */}
            <div className="flex items-center justify-center gap-2 pt-0.5 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <p className="text-zinc-400 text-[11px] md:text-xs font-bold uppercase tracking-wider">
                100% Confidential <span className="text-zinc-600">•</span> Response within <span className="text-white">24 hours</span>
              </p>
            </div>
          </motion.form>
        ) : (
          /* Success Screen */
          <motion.div
            key="success-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-center py-6 sm:py-12 space-y-5 sm:space-y-8"
          >
            <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 220, delay: 0.15 }}
                className="w-full h-full bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.5)] text-white"
              >
                <Check className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 stroke-[3]" />
              </motion.div>
            </div>

            <div className="space-y-2 sm:space-y-3 max-w-lg mx-auto px-2">
              <h3 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
                Thanks, {submittedFirstName}!
              </h3>
              <p className="text-blue-400 font-extrabold text-base sm:text-lg">
                Your request has been received.
              </p>
              <p className="text-zinc-300 text-sm sm:text-base font-medium leading-relaxed pt-1">
                We'll contact you within 24 hours to schedule your free growth audit.
              </p>
            </div>

            <div className="pt-2 sm:pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="text-blue-400 hover:text-blue-300 font-extrabold uppercase text-xs sm:text-sm tracking-widest transition-colors inline-flex items-center gap-2 cursor-pointer touch-manipulation min-h-[44px] px-4 py-2 rounded-full hover:bg-white/5"
              >
                <span>Submit Another Request</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

