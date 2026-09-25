
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
export const WHATSAPP_NUMBER = "917983342005";
export const WHATSAPP_DEFAULT_MESSAGE = "Hi Hardik, I’m interested in your social media and growth services. Can we discuss?";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE)}`;
export const SPLITFORMS_ENDPOINT = "https://splitforms.com/api/submit";
export const SPLITFORMS_ACCESS_KEY = "006e8d38c63c4f17a7acfa6d396d9f49";
export const DESTINATION_EMAIL = "Growthwithhardik@gmail.com";

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
    price: '$299 / month',
    description: 'Perfect for creators and businesses who want to build a consistent online presence.',
    ctaText: 'Choose Creator Launch',
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
    name: 'Growth System',
    price: '$333 / month',
    description: 'For serious creators and businesses ready to systematically scale audience retention, authority, and inbound leads.',
    highlighted: true,
    ctaText: 'Choose Growth System',
    features: [
      'Advanced Content Strategy',
      '20 High-Retention Reels/Mo',
      'Profile Conversion Setup',
      'Custom Motion & Audio Design',
      'Weekly Algorithm Tuning',
      'Inbound DM Lead Funnel',
      'Priority Direct Communication'
    ]
  },
  {
    id: 'scale',
    name: 'Scale',
    price: '$550 / month',
    description: 'Your complete done-for-you content and distribution engine to dominate your market.',
    ctaText: 'Apply for Scale',
    features: [
      'Complete Content Ecosystem',
      '30 Cinematic Reels Every Month',
      'Multi-Platform Distribution',
      'Custom Lead Funnel Build',
      'Dedicated Creative Lead',
      'Bi-Weekly Strategic Consultation',
      'Private Dedicated Channel'
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
    metricTag: '↗ +200K Followers',
    rating: 5,
    category: 'creator',
    verified: true
  },
  {
    id: 't1',
    content: 'Hardik helped us streamline our content and improve consistency across platforms.',
    author: 'Himadari Foundation',
    role: 'Non-Profit & Foundation',
    metricTag: '↗ 3x Content Output',
    rating: 5,
    category: 'business',
    verified: true
  },
  {
    id: 't3',
    content: 'Our engagement metrics improved significantly within the first 60 days of working together.',
    author: 'Aman Sharma',
    role: 'Tech & Productivity Creator',
    metricTag: '↗ +180% Engagement',
    rating: 5,
    category: 'creator',
    verified: true
  },
  {
    id: 't5',
    content: 'Their video editing team knows exactly how to retain attention. Our Reels regularly cross 100K+ organic views now without paid ads.',
    author: 'Kunal Verma',
    role: 'E-Commerce & D2C Brand',
    metricTag: '↗ 2.4M+ Organic Views',
    rating: 5,
    category: 'business',
    verified: true
  },
  {
    id: 't6',
    content: 'Not only did our follower count grow, but we started getting direct client inquiries and inbound calls directly from our content strategy.',
    author: 'Rohan Mehra',
    role: 'B2B Software Platform',
    metricTag: '↗ Inbound Leads',
    rating: 5,
    category: 'business',
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
