
import React from 'react';
import { 
  Instagram, 
  Video, 
  Palette, 
  PenTool, 
  Layout, 
  Zap, 
  BarChart3, 
  Users, 
  TrendingUp,
  Search,
  Settings,
  Target
} from 'lucide-react';
import { Service, PricingPlan, ProcessStep, Testimonial } from './types';

export const BRAND_NAME = "Growth with Hardik";
export const BRAND_EMAIL = "growthwithhardik@gmail.com";
export const BRAND_PHONE = "7455067426";
export const INSTAGRAM_HANDLE = "@growthwithhardik";
export const FORMSPREE_ENDPOINT = "https://formspree.io/f/xnjqwnkb";

export const SERVICES: Service[] = [
  {
    id: 'smm',
    title: 'Social Media Management',
    description: 'End-to-end management of your Instagram presence to build a loyal community.',
    iconName: 'Instagram'
  },
  {
    id: 'video',
    title: 'Video Editing',
    description: 'High-retention Reels and Shorts designed to go viral and capture attention.',
    iconName: 'Video'
  },
  {
    id: 'design',
    title: 'Graphic Designing',
    description: 'Premium visual assets that align with your brand identity and aesthetic.',
    iconName: 'Palette'
  },
  {
    id: 'writing',
    title: 'Content Strategy',
    description: 'Data-driven content pillars and writing that converts followers into leads.',
    iconName: 'PenTool'
  },
  {
    id: 'web',
    title: 'Web Designing',
    description: 'High-converting landing pages built with a clean, modern approach.',
    iconName: 'Layout'
  },
  {
    id: 'ai',
    title: 'AI Automations',
    description: 'Cutting-edge AI workflows to scale your marketing and save hours of time.',
    iconName: 'Zap'
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'launch',
    name: 'Creator Launch',
    description: 'Perfect for creators and businesses who want to build a consistent online presence.',
    ctaText: 'Start Your Growth',
    features: [
      'Content Strategy',
      '12 Strategic Reels Every Month',
      'Profile Optimization',
      'Captions & Hashtags',
      'Monthly Growth Review',
      'Direct Support'
    ]
  },
  {
    id: 'grow',
    name: 'Growth Engine',
    description: 'For businesses ready to attract more leads and build a stronger online presence.',
    highlighted: true,
    ctaText: "Let's Grow Together",
    features: [
      'Everything in Creator Launch',
      '20 Strategic Reels Every Month',
      'Content Ideas Planned for You',
      'Better Hooks & Storytelling',
      'Faster Editing & Posting',
      'Weekly Growth Review',
      'Priority Support'
    ]
  },
  {
    id: 'scale',
    name: 'Market Leader',
    description: 'Your complete marketing partner for long-term business growth.',
    ctaText: 'Apply to Work Together',
    features: [
      'Everything in Growth Engine',
      '30 Strategic Reels Designed to Grow Your Brand',
      'Landing Page Design',
      'Marketing Funnel Setup',
      'AI Automation Setup',
      'Monthly Strategy Sessions',
      'Dedicated Priority Support'
    ]
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Audit',
    description: 'We dive deep into your current performance to find gaps and opportunities.'
  },
  {
    number: '02',
    title: 'Strategy',
    description: 'A custom roadmap built on data, psychology, and your unique goals.'
  },
  {
    number: '03',
    title: 'Execute',
    description: 'High-quality production and management phase where the magic happens.'
  },
  {
    number: '04',
    title: 'Optimize',
    description: 'Continuous testing and refining to maximize reach and conversion.'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't2',
    content: 'Hardik helped me build a structured content strategy that supported my growth to over 200K followers within 12 months.',
    author: 'Tanya Saharawat',
    role: 'Yoga Creator & Influencer',
    metricTag: '📈 +200K Followers',
    rating: 5,
    category: 'creator',
    verified: true
  },
  {
    id: 't1',
    content: 'Hardik helped us streamline our content and improve consistency across platforms.',
    author: 'Founder & Lead',
    role: 'The Himadari Foundation',
    metricTag: '🚀 3x Content Output',
    rating: 5,
    category: 'brand',
    verified: true
  },
  {
    id: 't3',
    content: 'Our engagement metrics improved significantly within the first 60 days of working together.',
    author: 'Lifestyle & Tech Creator',
    role: 'Digital Content Studio',
    metricTag: '🔥 +180% Engagement',
    rating: 5,
    category: 'creator',
    verified: true
  },
  {
    id: 't4',
    content: 'High-production value and a systematic approach to growth that actually delivers.',
    author: 'Agency Director',
    role: 'Apex Digital Agency',
    metricTag: '⚡ High Retention Reels',
    rating: 5,
    category: 'agency',
    verified: true
  },
  {
    id: 't5',
    content: 'Their video editing team knows exactly how to retain attention. Our Reels regularly cross 100K+ organic views now without paid ads.',
    author: 'Growth Lead',
    role: 'E-Commerce & D2C Brand',
    metricTag: '🎬 2.4M+ Organic Views',
    rating: 5,
    category: 'brand',
    verified: true
  },
  {
    id: 't6',
    content: 'Not only did our follower count grow, but we started getting direct client inquiries and inbound calls directly from our content strategy.',
    author: 'SaaS Founder',
    role: 'B2B Software Platform',
    metricTag: '🎯 Qualified Inbound Leads',
    rating: 5,
    category: 'brand',
    verified: true
  }
];

export const IconMap: Record<string, React.ElementType> = {
  Instagram,
  Video,
  Palette,
  PenTool,
  Layout,
  Zap,
  BarChart3,
  Users,
  TrendingUp,
  Search,
  Settings,
  Target
};
