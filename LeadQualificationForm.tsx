import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, 
  ChevronDown, 
  Loader2, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { SPLITFORMS_ENDPOINT, SPLITFORMS_ACCESS_KEY, DESTINATION_EMAIL } from './constants';

export interface FormState {
  fullName: string;
  phone: string;
  instagramUsername: string;
  category: string;
  challenge: string;
  supportLevel: string;
  businessDetails: string;
  hp_website: string; // Honeypot field
}

export interface TouchState {
  fullName: boolean;
  phone: boolean;
  instagramUsername: boolean;
  category: boolean;
  challenge: boolean;
  supportLevel: boolean;
  businessDetails: boolean;
}

export interface ErrorState {
  fullName?: string;
  phone?: string;
  instagramUsername?: string;
  category?: string;
  challenge?: string;
  supportLevel?: string;
  businessDetails?: string;
  general?: string;
}

const CATEGORY_OPTIONS = [
  'Creator / Personal Brand',
  'Coach / Consultant',
  'Yoga / Wellness',
  'Fitness',
  'Finance / Business',
  'Brand / Business',
  'Other'
];

const CHALLENGE_OPTIONS = [
  'Posting but not growing',
  'Getting views but not followers',
  'Growing but not getting clients',
  'Don\'t know what content to create',
  'Content isn\'t consistent',
  'Need a clear growth strategy',
  'Spending too much time creating content'
];

const SUPPORT_LEVEL_OPTIONS = [
  'Someone to manage my Instagram',
  'Strategic guidance',
  'Content creation + editing',
  'Growth & lead generation',
  'Not sure yet'
];

export interface LeadQualificationFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export const LeadQualificationForm: React.FC<LeadQualificationFormProps> = ({ onSuccess, onClose }) => {
  const [formData, setFormData] = useState<FormState>({
    fullName: '',
    phone: '',
    instagramUsername: '',
    category: '',
    challenge: '',
    supportLevel: '',
    businessDetails: '',
    hp_website: ''
  });

  const [touched, setTouched] = useState<TouchState>({
    fullName: false,
    phone: false,
    instagramUsername: false,
    category: false,
    challenge: false,
    supportLevel: false,
    businessDetails: false
  });

  const [errors, setErrors] = useState<ErrorState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Field Level Validation Logic
  const validateField = (name: keyof FormState, value: string): string | undefined => {
    const trimmed = value.trim();

    switch (name) {
      case 'fullName': {
        if (!trimmed) {
          return 'Please enter your full name.';
        }
        if (trimmed.length < 2) {
          return 'Please enter your full name.';
        }
        return undefined;
      }

      case 'phone': {
        if (!trimmed) {
          return 'Please enter your phone / WhatsApp number.';
        }
        const cleanDigits = trimmed.replace(/\D/g, '');
        if (cleanDigits.length < 8 || cleanDigits.length > 15) {
          return 'Please enter a valid phone / WhatsApp number.';
        }
        return undefined;
      }

      case 'instagramUsername': {
        if (!trimmed) {
          return 'Please enter your Instagram username.';
        }
        const cleanHandle = trimmed.replace(/^@/, '');
        if (cleanHandle.length < 1 || cleanHandle.length > 30) {
          return 'Please enter a valid Instagram username.';
        }
        return undefined;
      }

      case 'category': {
        if (!trimmed) {
          return 'Please select what best describes you.';
        }
        return undefined;
      }

      case 'challenge': {
        if (!trimmed) {
          return "Please select your biggest challenge right now.";
        }
        return undefined;
      }

      case 'supportLevel': {
        if (!trimmed) {
          return 'Please select the level of support you are looking for.';
        }
        return undefined;
      }

      default:
        return undefined;
    }
  };

  const handleChange = (field: keyof FormState, value: string) => {
    let processedValue = value;

    if (field === 'instagramUsername') {
      processedValue = value.replace(/^@/, '');
    }

    setFormData(prev => ({ ...prev, [field]: processedValue }));

    if (touched[field as keyof TouchState]) {
      const err = validateField(field, processedValue);
      setErrors(prev => ({ ...prev, [field]: err }));
    }
  };

  const handleBlur = (field: keyof FormState) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const err = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: err }));
  };

  const validateAll = (): boolean => {
    const newErrors: ErrorState = {};
    let isValid = true;

    const fieldsToValidate: Array<keyof FormState> = [
      'fullName',
      'phone',
      'instagramUsername',
      'category',
      'challenge',
      'supportLevel'
    ];

    fieldsToValidate.forEach(key => {
      const err = validateField(key, formData[key]);
      if (err) {
        newErrors[key as keyof ErrorState] = err;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({
      fullName: true,
      phone: true,
      instagramUsername: true,
      category: true,
      challenge: true,
      supportLevel: true,
      businessDetails: true
    });

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (formData.hp_website) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 800);
      return;
    }

    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);
    setErrors(prev => ({ ...prev, general: undefined }));

    try {
      const cleanHandle = formData.instagramUsername.trim().replace(/^@/, '');
      const cleanName = formData.fullName.trim();
      const response = await fetch(SPLITFORMS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: SPLITFORMS_ACCESS_KEY,
          fullName: cleanName,
          name: cleanName,
          phone: formData.phone.trim(),
          instagramUsername: `@${cleanHandle}`,
          category: formData.category,
          roleCategory: formData.category,
          challenge: formData.challenge,
          growthChallenge: formData.challenge,
          supportLevel: formData.supportLevel,
          businessDetails: formData.businessDetails?.trim() || 'None',
          businessDescription: formData.businessDetails?.trim() || 'None',
          destination_email: DESTINATION_EMAIL,
          from_name: cleanName,
          _subject: `New Growth Audit Request: ${cleanName} (@${cleanHandle})`
        })
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok || (responseData && responseData.success === false)) {
        throw new Error(responseData?.message || responseData?.error || 'Failed to submit form. Please try again.');
      }

      setIsSubmitted(true);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setErrors(prev => ({
        ...prev,
        general: err?.message || 'Something went wrong submitting your request. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <form
            onSubmit={handleSubmit}
            className="space-y-3 sm:space-y-3.5"
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
              <div
                className="bg-red-500/10 border border-red-500/30 text-red-400 p-2.5 rounded-xl text-xs font-medium flex items-center gap-2"
                role="alert"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.general}</span>
              </div>
            )}

            {/* GROUP 1: CONTACT (Name + Phone) */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-0.5">
                Contact
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {/* Full Name */}
                <div className="space-y-1">
                  <label htmlFor="fullName" className="block text-[11px] sm:text-xs font-medium text-zinc-300 truncate">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={e => handleChange('fullName', e.target.value)}
                    onBlur={() => handleBlur('fullName')}
                    placeholder="Your name"
                    aria-required="true"
                    aria-invalid={!!errors.fullName}
                    aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                    className={`w-full bg-zinc-900/90 border rounded-xl px-2.5 sm:px-3 text-xs sm:text-sm font-medium text-white placeholder:text-zinc-500 transition-colors focus:outline-none h-[46px] min-h-[46px] sm:h-[48px] sm:min-h-[48px] ${
                      touched.fullName && errors.fullName
                        ? 'border-red-500/80 focus:border-red-500'
                        : 'border-zinc-800 focus:border-zinc-400'
                    }`}
                  />
                  {touched.fullName && errors.fullName && (
                    <p id="fullName-error" className="text-red-400 text-[10px] sm:text-xs font-medium mt-0.5 flex items-center gap-1" role="alert">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span className="truncate">{errors.fullName}</span>
                    </p>
                  )}
                </div>

                {/* Phone / WhatsApp */}
                <div className="space-y-1">
                  <label htmlFor="phone" className="block text-[11px] sm:text-xs font-medium text-zinc-300 truncate">
                    Phone / WhatsApp <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={e => handleChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    placeholder="WhatsApp No."
                    aria-required="true"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                    className={`w-full bg-zinc-900/90 border rounded-xl px-2.5 sm:px-3 text-xs sm:text-sm font-medium text-white placeholder:text-zinc-500 transition-colors focus:outline-none h-[46px] min-h-[46px] sm:h-[48px] sm:min-h-[48px] ${
                      touched.phone && errors.phone
                        ? 'border-red-500/80 focus:border-red-500'
                        : 'border-zinc-800 focus:border-zinc-400'
                    }`}
                  />
                  {touched.phone && errors.phone && (
                    <p id="phone-error" className="text-red-400 text-[10px] sm:text-xs font-medium mt-0.5 flex items-center gap-1" role="alert">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span className="truncate">{errors.phone}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* GROUP 2: PROFILE (Instagram + Who are you?) */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-0.5">
                Profile
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {/* Instagram Username */}
                <div className="space-y-1">
                  <label htmlFor="instagramUsername" className="block text-[11px] sm:text-xs font-medium text-zinc-300 truncate">
                    Instagram <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 font-medium text-xs sm:text-sm select-none pointer-events-none">
                      @
                    </span>
                    <input
                      id="instagramUsername"
                      type="text"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      name="instagramUsername"
                      value={formData.instagramUsername}
                      onChange={e => handleChange('instagramUsername', e.target.value)}
                      onBlur={() => handleBlur('instagramUsername')}
                      placeholder="username"
                      aria-required="true"
                      aria-invalid={!!errors.instagramUsername}
                      aria-describedby={errors.instagramUsername ? 'instagramUsername-error' : undefined}
                      className={`w-full bg-zinc-900/90 border rounded-xl pl-6 sm:pl-7 pr-2.5 text-xs sm:text-sm font-medium text-white placeholder:text-zinc-500 transition-colors focus:outline-none h-[46px] min-h-[46px] sm:h-[48px] sm:min-h-[48px] ${
                        touched.instagramUsername && errors.instagramUsername
                          ? 'border-red-500/80 focus:border-red-500'
                          : 'border-zinc-800 focus:border-zinc-400'
                      }`}
                    />
                  </div>
                  {touched.instagramUsername && errors.instagramUsername && (
                    <p id="instagramUsername-error" className="text-red-400 text-[10px] sm:text-xs font-medium mt-0.5 flex items-center gap-1" role="alert">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span className="truncate">{errors.instagramUsername}</span>
                    </p>
                  )}
                </div>

                {/* Who are you? / Category */}
                <div className="space-y-1">
                  <label htmlFor="category" className="block text-[11px] sm:text-xs font-medium text-zinc-300 truncate">
                    Who are you? <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={e => handleChange('category', e.target.value)}
                      onBlur={() => handleBlur('category')}
                      aria-required="true"
                      aria-invalid={!!errors.category}
                      aria-describedby={errors.category ? 'category-error' : undefined}
                      className={`w-full bg-zinc-900/90 border rounded-xl pl-2.5 sm:pl-3 pr-7 text-xs sm:text-sm font-medium appearance-none cursor-pointer transition-colors focus:outline-none h-[46px] min-h-[46px] sm:h-[48px] sm:min-h-[48px] truncate ${
                        formData.category ? 'text-white' : 'text-zinc-500'
                      } ${
                        touched.category && errors.category
                          ? 'border-red-500/80 focus:border-red-500'
                          : 'border-zinc-800 focus:border-zinc-400'
                      }`}
                    >
                      <option value="" disabled className="text-zinc-500 bg-zinc-950">
                        Select role
                      </option>
                      {CATEGORY_OPTIONS.map(opt => (
                        <option key={opt} value={opt} className="bg-zinc-950 text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 w-3.5 h-3.5 pointer-events-none" />
                  </div>
                  {touched.category && errors.category && (
                    <p id="category-error" className="text-red-400 text-[10px] sm:text-xs font-medium mt-0.5 flex items-center gap-1" role="alert">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span className="truncate">{errors.category}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* GROUP 3: GROWTH (Challenge + Support Needed) */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-0.5">
                Growth Focus
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {/* Biggest Challenge */}
                <div className="space-y-1">
                  <label htmlFor="challenge" className="block text-[11px] sm:text-xs font-medium text-zinc-300 truncate">
                    Biggest challenge <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="challenge"
                      name="challenge"
                      value={formData.challenge}
                      onChange={e => handleChange('challenge', e.target.value)}
                      onBlur={() => handleBlur('challenge')}
                      aria-required="true"
                      aria-invalid={!!errors.challenge}
                      aria-describedby={errors.challenge ? 'challenge-error' : undefined}
                      className={`w-full bg-zinc-900/90 border rounded-xl pl-2.5 sm:pl-3 pr-7 text-xs sm:text-sm font-medium appearance-none cursor-pointer transition-colors focus:outline-none h-[46px] min-h-[46px] sm:h-[48px] sm:min-h-[48px] truncate ${
                        formData.challenge ? 'text-white' : 'text-zinc-500'
                      } ${
                        touched.challenge && errors.challenge
                          ? 'border-red-500/80 focus:border-red-500'
                          : 'border-zinc-800 focus:border-zinc-400'
                      }`}
                    >
                      <option value="" disabled className="text-zinc-500 bg-zinc-950">
                        Select challenge
                      </option>
                      {CHALLENGE_OPTIONS.map(opt => (
                        <option key={opt} value={opt} className="bg-zinc-950 text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 w-3.5 h-3.5 pointer-events-none" />
                  </div>
                  {touched.challenge && errors.challenge && (
                    <p id="challenge-error" className="text-red-400 text-[10px] sm:text-xs font-medium mt-0.5 flex items-center gap-1" role="alert">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span className="truncate">{errors.challenge}</span>
                    </p>
                  )}
                </div>

                {/* Level of Support */}
                <div className="space-y-1">
                  <label htmlFor="supportLevel" className="block text-[11px] sm:text-xs font-medium text-zinc-300 truncate">
                    Support needed <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="supportLevel"
                      name="supportLevel"
                      value={formData.supportLevel}
                      onChange={e => handleChange('supportLevel', e.target.value)}
                      onBlur={() => handleBlur('supportLevel')}
                      aria-required="true"
                      aria-invalid={!!errors.supportLevel}
                      aria-describedby={errors.supportLevel ? 'supportLevel-error' : undefined}
                      className={`w-full bg-zinc-900/90 border rounded-xl pl-2.5 sm:pl-3 pr-7 text-xs sm:text-sm font-medium appearance-none cursor-pointer transition-colors focus:outline-none h-[46px] min-h-[46px] sm:h-[48px] sm:min-h-[48px] truncate ${
                        formData.supportLevel ? 'text-white' : 'text-zinc-500'
                      } ${
                        touched.supportLevel && errors.supportLevel
                          ? 'border-red-500/80 focus:border-red-500'
                          : 'border-zinc-800 focus:border-zinc-400'
                      }`}
                    >
                      <option value="" disabled className="text-zinc-500 bg-zinc-950">
                        Select support
                      </option>
                      {SUPPORT_LEVEL_OPTIONS.map(opt => (
                        <option key={opt} value={opt} className="bg-zinc-950 text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 w-3.5 h-3.5 pointer-events-none" />
                  </div>
                  {touched.supportLevel && errors.supportLevel && (
                    <p id="supportLevel-error" className="text-red-400 text-[10px] sm:text-xs font-medium mt-0.5 flex items-center gap-1" role="alert">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span className="truncate">{errors.supportLevel}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* GROUP 4: OPTIONAL (Tell us about your business) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between px-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Optional
                </span>
                <span className="text-[10px] text-zinc-500">About your business</span>
              </div>
              <textarea
                id="businessDetails"
                name="businessDetails"
                rows={2}
                value={formData.businessDetails}
                onChange={e => handleChange('businessDetails', e.target.value)}
                placeholder="Important details about your business or audience..."
                className="w-full bg-zinc-900/90 border border-zinc-800 focus:border-zinc-400 rounded-xl p-2.5 text-xs sm:text-sm font-medium text-white placeholder:text-zinc-500 transition-colors focus:outline-none resize-none h-[58px] min-h-[58px]"
              />
            </div>

            {/* CTA Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full h-[46px] sm:h-[48px] min-h-[46px] rounded-xl font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer touch-manipulation select-none ${
                  isSubmitting
                    ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
                    : 'bg-white hover:bg-zinc-200 text-black active:scale-[0.99]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-600" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Request My Growth Audit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Success Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-8 sm:py-12 space-y-4"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white">
                Your Growth Audit Request Is In.
              </h3>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                Thanks. We'll review your Instagram and get back to you within 24 hours.
              </p>
            </div>

            {onClose && (
              <div className="pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer touch-manipulation"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
