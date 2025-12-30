
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
import { Service, PricingPlan, ProcessStep } from './types';

export const BRAND_NAME = "Growth with Hardik";
export const BRAND_EMAIL = "growthwithhardik@gmail.com";
export const BRAND_PHONE = "7455067426";
export const INSTAGRAM_HANDLE = "@growthwithhardik";

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
    id: 'basic',
    name: 'Basic Plan',
    description: 'Perfect for beginners and small creators looking to start right.',
    features: [
      'Content Strategy (4 Weeks)',
      '12 Edited Reels per Month',
      'Basic Profile Optimization',
      'Engagement Strategy',
      'Monthly Progress Report'
    ]
  },
  {
    id: 'medium',
    name: 'Medium Plan',
    description: 'For growing influencers and businesses ready to scale.',
    highlighted: true,
    features: [
      'Advanced Content Strategy',
      '20 Premium Reels per Month',
      'Full Profile Branding',
      'Daily Engagement & DM Support',
      'Bi-weekly Performance Calls',
      'Basic Ad Management'
    ]
  },
  {
    id: 'advanced',
    name: 'Advanced Plan',
    description: 'The ultimate growth engine for serious brands.',
    features: [
      'Omnichannel Strategy',
      '30+ High-Production Reels',
      'Custom Landing Page Design',
      'AI Automation Setup',
      'Influencer Collab Strategy',
      '24/7 Priority Support'
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
