
export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  features: string[];
  price?: string;
  highlighted?: boolean;
  ctaText?: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface Testimonial {
  id: string;
  content: string;
  author: string;
  role: string;
  metricTag?: string;
  rating?: number;
  category?: 'creator' | 'brand' | 'agency';
  verified?: boolean;
}
