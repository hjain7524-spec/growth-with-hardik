// Google Analytics 4 & Google Tag Manager Measurement System for Growth with Hardik

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

// Safely initialize dataLayer and gtag stub if not already present
if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function () {
      window.dataLayer?.push(arguments);
    };
  }
}

/**
 * UTM & Acquisition Source Data Interface
 */
export interface UtmData {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  gclid: string;
  fbclid: string;
  traffic_source: string;
  referrer: string;
  landing_page: string;
  captured_at: string;
}

const STORAGE_KEY_UTM = 'gwh_traffic_utm_v1';

/**
 * Parses, captures, and persists UTM parameters across sessions
 */
export const initAndCaptureUtm = (): UtmData => {
  if (typeof window === 'undefined') {
    return {
      utm_source: 'direct',
      utm_medium: 'none',
      utm_campaign: '',
      utm_term: '',
      utm_content: '',
      gclid: '',
      fbclid: '',
      traffic_source: 'direct',
      referrer: '',
      landing_page: '',
      captured_at: new Date().toISOString(),
    };
  }

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const referrer = document.referrer || '';
    
    // Check if new UTMs are present in current URL
    const hasNewUtm = 
      urlParams.has('utm_source') || 
      urlParams.has('utm_medium') || 
      urlParams.has('utm_campaign') ||
      urlParams.has('gclid') ||
      urlParams.has('fbclid') ||
      urlParams.has('ref');

    // Load existing stored UTM if no new parameters are provided
    const existingRaw = sessionStorage.getItem(STORAGE_KEY_UTM) || localStorage.getItem(STORAGE_KEY_UTM);
    if (!hasNewUtm && existingRaw) {
      return JSON.parse(existingRaw);
    }

    // Infer traffic source if not explicitly provided in UTMs
    let inferredSource = urlParams.get('utm_source') || '';
    let inferredMedium = urlParams.get('utm_medium') || '';

    if (!inferredSource && referrer) {
      if (referrer.includes('instagram.com')) {
        inferredSource = 'instagram';
        inferredMedium = 'social';
      } else if (referrer.includes('linkedin.com')) {
        inferredSource = 'linkedin';
        inferredMedium = 'social';
      } else if (referrer.includes('youtube.com') || referrer.includes('youtu.be')) {
        inferredSource = 'youtube';
        inferredMedium = 'video';
      } else if (referrer.includes('whatsapp') || referrer.includes('wa.me')) {
        inferredSource = 'whatsapp';
        inferredMedium = 'chat';
      } else if (referrer.includes('google.')) {
        inferredSource = 'google';
        inferredMedium = 'organic';
      } else if (referrer.includes('facebook.com') || referrer.includes('fb.com')) {
        inferredSource = 'facebook';
        inferredMedium = 'social';
      } else if (referrer.includes('twitter.com') || referrer.includes('x.com')) {
        inferredSource = 'twitter';
        inferredMedium = 'social';
      } else {
        try {
          inferredSource = new URL(referrer).hostname;
          inferredMedium = 'referral';
        } catch {
          inferredSource = 'referral';
          inferredMedium = 'referral';
        }
      }
    }

    if (!inferredSource) {
      inferredSource = 'direct';
      inferredMedium = 'none';
    }

    const utmData: UtmData = {
      utm_source: urlParams.get('utm_source') || inferredSource,
      utm_medium: urlParams.get('utm_medium') || inferredMedium,
      utm_campaign: urlParams.get('utm_campaign') || '',
      utm_term: urlParams.get('utm_term') || '',
      utm_content: urlParams.get('utm_content') || '',
      gclid: urlParams.get('gclid') || '',
      fbclid: urlParams.get('fbclid') || '',
      traffic_source: inferredSource,
      referrer: referrer,
      landing_page: window.location.pathname + window.location.search,
      captured_at: new Date().toISOString(),
    };

    sessionStorage.setItem(STORAGE_KEY_UTM, JSON.stringify(utmData));
    localStorage.setItem(STORAGE_KEY_UTM, JSON.stringify(utmData));

    // Register user properties in GA4 if gtag is available
    if (window.gtag) {
      window.gtag('set', 'user_properties', {
        initial_traffic_source: utmData.traffic_source,
        initial_utm_source: utmData.utm_source,
        initial_utm_campaign: utmData.utm_campaign || 'none',
      });
    }

    return utmData;
  } catch (err) {
    console.debug('Error capturing UTM params:', err);
    return {
      utm_source: 'direct',
      utm_medium: 'none',
      utm_campaign: '',
      utm_term: '',
      utm_content: '',
      gclid: '',
      fbclid: '',
      traffic_source: 'direct',
      referrer: '',
      landing_page: '',
      captured_at: new Date().toISOString(),
    };
  }
};

/**
 * Returns stored UTM data for passing into form submissions and events
 */
export const getStoredUtmParams = (): UtmData => {
  if (typeof window === 'undefined') {
    return {
      utm_source: 'direct',
      utm_medium: 'none',
      utm_campaign: '',
      utm_term: '',
      utm_content: '',
      gclid: '',
      fbclid: '',
      traffic_source: 'direct',
      referrer: '',
      landing_page: '',
      captured_at: new Date().toISOString(),
    };
  }

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY_UTM) || localStorage.getItem(STORAGE_KEY_UTM);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return initAndCaptureUtm();
};

// Click deduplication registry (prevents duplicate clicks within 800ms)
const clickCooldownMap = new Map<string, number>();

const isClickAllowed = (key: string, cooldownMs = 800): boolean => {
  const now = Date.now();
  const lastTime = clickCooldownMap.get(key) || 0;
  if (now - lastTime < cooldownMs) {
    return false;
  }
  clickCooldownMap.set(key, now);
  return true;
};

/**
 * 1. PAGE VIEW EVENT: Tracks page views and route transitions
 */
export const trackPageView = (pagePath?: string, pageTitle?: string) => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      const path = pagePath || window.location.pathname;
      const title = pageTitle || document.title;
      const utm = getStoredUtmParams();

      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title,
        page_location: window.location.href,
        traffic_source: utm.traffic_source,
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
      });

      window.dataLayer?.push({
        event: 'virtual_page_view',
        pagePath: path,
        pageTitle: title,
      });
    }
  } catch (err) {
    console.debug('GA4 trackPageView error:', err);
  }
};

/**
 * 2. GROWTH PLAN CTA CLICK: Fired whenever a button leading to the Growth Plan is clicked
 */
export const trackGrowthPlanClick = (location: string, label: string = 'Growth Plan CTA') => {
  const dedupKey = `growth_plan_${location}_${label}`;
  if (!isClickAllowed(dedupKey)) return;

  try {
    if (typeof window !== 'undefined' && window.gtag) {
      const utm = getStoredUtmParams();

      // Required exact GA4 event: growth_plan_click
      window.gtag('event', 'growth_plan_click', {
        event_category: 'engagement',
        event_label: label,
        button_location: location,
        button_text: label,
        page_path: window.location.pathname,
        traffic_source: utm.traffic_source,
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
      });

      // Backward compatible alias
      window.gtag('event', 'request_growth_audit_click', {
        event_category: 'engagement',
        event_label: label,
        button_location: location,
        button_text: label,
      });

      // Google Tag Manager dataLayer push
      window.dataLayer?.push({
        event: 'growth_plan_click',
        buttonLocation: location,
        buttonText: label,
        utmSource: utm.utm_source,
        trafficSource: utm.traffic_source,
      });
    }
  } catch (err) {
    console.debug('GA4 trackGrowthPlanClick error:', err);
  }
};

// Keep backwards-compatible export
export const trackGrowthAuditClick = trackGrowthPlanClick;

/**
 * 3. FORM OPEN EVENT: Fired when the Growth Plan form is opened and becomes visible
 */
export const trackFormOpen = (triggerSource: string = 'user_click') => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      const utm = getStoredUtmParams();

      window.gtag('event', 'form_open', {
        event_category: 'form_funnel',
        event_label: 'Growth Plan Form Opened',
        form_name: 'growth_plan_form',
        trigger_source: triggerSource,
        traffic_source: utm.traffic_source,
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
      });

      window.dataLayer?.push({
        event: 'form_open',
        formName: 'growth_plan_form',
        triggerSource,
      });
    }
  } catch (err) {
    console.debug('GA4 trackFormOpen error:', err);
  }
};

/**
 * 4. FORM START EVENT: Fired on first interaction with any form field
 */
export const trackFormStart = (firstFieldName: string = 'name') => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      const utm = getStoredUtmParams();

      window.gtag('event', 'form_start', {
        event_category: 'form_funnel',
        event_label: 'Growth Plan Form Started',
        form_name: 'growth_plan_form',
        first_field: firstFieldName,
        traffic_source: utm.traffic_source,
        utm_source: utm.utm_source,
        utm_campaign: utm.utm_campaign,
      });

      window.dataLayer?.push({
        event: 'form_start',
        formName: 'growth_plan_form',
        firstField: firstFieldName,
      });
    }
  } catch (err) {
    console.debug('GA4 trackFormStart error:', err);
  }
};

/**
 * 5. FORM SUBMIT EVENT (PRIMARY CONVERSION): Fired ONLY upon verified 200 OK submission
 */
export interface GrowthPlanSubmissionDetails {
  name?: string;
  instagramHandle?: string;
  category?: string;
  goal?: string;
  challenge?: string;
  phone?: string;
  supportLevel?: string;
}

export const trackFormSubmit = (details: GrowthPlanSubmissionDetails = {}) => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      const utm = getStoredUtmParams();

      // 1. Primary requested conversion event: form_submit
      window.gtag('event', 'form_submit', {
        event_category: 'conversion',
        event_label: `Growth Plan - ${details.category || 'General'}`,
        form_name: 'growth_plan_form',
        role_category: details.category || 'Not specified',
        growth_goal: details.goal || 'Not specified',
        growth_challenge: details.challenge || 'Not specified',
        traffic_source: utm.traffic_source,
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
        utm_term: utm.utm_term,
        utm_content: utm.utm_content,
        value: 1,
        currency: 'USD',
      });

      // 2. GA4 Standard Recommended Lead Generation Event: generate_lead
      window.gtag('event', 'generate_lead', {
        event_category: 'conversion',
        lead_type: 'growth_plan',
        role_category: details.category || 'Not specified',
        growth_goal: details.goal || 'Not specified',
        growth_challenge: details.challenge || 'Not specified',
        traffic_source: utm.traffic_source,
        utm_source: utm.utm_source,
        utm_campaign: utm.utm_campaign,
        value: 1,
        currency: 'USD',
      });

      // 3. Google Tag Manager dataLayer push
      window.dataLayer?.push({
        event: 'form_submit',
        formName: 'growth_plan_form',
        leadCategory: details.category,
        growthGoal: details.goal,
        growthChallenge: details.challenge,
        utmSource: utm.utm_source,
        utmMedium: utm.utm_medium,
        utmCampaign: utm.utm_campaign,
        trafficSource: utm.traffic_source,
      });
    }
  } catch (err) {
    console.debug('GA4 trackFormSubmit error:', err);
  }
};

// Keep backwards-compatible export
export const trackGrowthAuditSubmit = trackFormSubmit;

/**
 * 6. PHONE CLICK EVENT: Fired when phone number links or call CTAs are clicked
 */
export const trackPhoneClick = (location: string = 'header', phoneNumber: string = '7455067426') => {
  const dedupKey = `phone_click_${location}`;
  if (!isClickAllowed(dedupKey)) return;

  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'phone_click', {
        event_category: 'contact',
        event_label: `Phone Call - ${location}`,
        phone_number: phoneNumber,
        button_location: location,
      });

      window.dataLayer?.push({
        event: 'phone_click',
        buttonLocation: location,
        phoneNumber,
      });
    }
  } catch (err) {
    console.debug('GA4 trackPhoneClick error:', err);
  }
};

/**
 * 7. WHATSAPP CLICK EVENT: Fired when WhatsApp chat or direct links are clicked
 */
export const trackWhatsAppClick = (location: string = 'cta') => {
  const dedupKey = `whatsapp_click_${location}`;
  if (!isClickAllowed(dedupKey)) return;

  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'whatsapp_click', {
        event_category: 'contact',
        event_label: `WhatsApp Chat - ${location}`,
        button_location: location,
      });

      window.dataLayer?.push({
        event: 'whatsapp_click',
        buttonLocation: location,
      });
    }
  } catch (err) {
    console.debug('GA4 trackWhatsAppClick error:', err);
  }
};

/**
 * 8. CASE STUDY / TESTIMONIAL CLICK EVENT: Fired when case studies or testimonial cards/tabs are clicked
 */
export const trackCaseStudyClick = (caseStudyId: string, caseStudyName: string, category?: string) => {
  const dedupKey = `case_study_${caseStudyId}`;
  if (!isClickAllowed(dedupKey, 500)) return;

  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'case_study_click', {
        event_category: 'social_proof',
        event_label: `Case Study - ${caseStudyName}`,
        case_study_id: caseStudyId,
        case_study_name: caseStudyName,
        case_study_category: category || 'all',
      });

      window.dataLayer?.push({
        event: 'case_study_click',
        caseStudyId,
        caseStudyName,
        caseStudyCategory: category,
      });
    }
  } catch (err) {
    console.debug('GA4 trackCaseStudyClick error:', err);
  }
};

/**
 * 9. PRICING CTA CLICK EVENT: Fired when pricing card CTAs are clicked
 */
export const trackPricingCtaClick = (planName: string, ctaText: string) => {
  const dedupKey = `pricing_cta_${planName}`;
  if (!isClickAllowed(dedupKey)) return;

  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'pricing_cta_click', {
        event_category: 'engagement',
        event_label: `Pricing - ${planName} (${ctaText})`,
        plan_name: planName,
        cta_text: ctaText,
      });

      window.dataLayer?.push({
        event: 'pricing_cta_click',
        planName,
        ctaText,
      });
    }
  } catch (err) {
    console.debug('GA4 trackPricingCtaClick error:', err);
  }
};

/**
 * 10. FINAL CTA CLICK EVENT: Fired when the bottom / final CTA is clicked
 */
export const trackFinalCtaClick = (location: string = 'still_not_sure_bottom', label: string = 'BUILD MY GROWTH PLAN') => {
  const dedupKey = `final_cta_${location}`;
  if (!isClickAllowed(dedupKey)) return;

  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'final_cta_click', {
        event_category: 'engagement',
        event_label: label,
        button_location: location,
        button_text: label,
      });

      window.dataLayer?.push({
        event: 'final_cta_click',
        buttonLocation: location,
        buttonText: label,
      });
    }
  } catch (err) {
    console.debug('GA4 trackFinalCtaClick error:', err);
  }
};
