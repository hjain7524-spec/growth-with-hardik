
import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { motion, AnimatePresence, useInView, animate, useMotionValue, useTransform, useScroll } from 'framer-motion';
import { TrustMarquee } from './TrustMarquee';
import { ProofStatsSection } from './ProofStatsSection';
import { TrustedBySection } from './TrustedBySection';
import { ProblemSection } from './ProblemSection';
import { CreatorComparisonSection } from './CreatorComparisonSection';
import { CoreServicesSection } from './CoreServicesSection';
import { GrowthSystem } from './GrowthSystem';
import { StillNotSureSection } from './StillNotSureSection';
import { FinalCtaSection } from './FinalCtaSection';
import { PricingSection } from './PricingSection';
import { Footer } from './Footer';
import { MobileConversionBar } from './MobileConversionBar';
import { ChatAssistant } from './ChatAssistant';
import { BackToTopButton } from './BackToTopButton';
import { Header } from './Header';
import { HeroSection } from './HeroSection';
import { trackGrowthPlanClick, trackGrowthAuditClick, trackPricingCtaClick, trackPageView } from './analytics';

// Code-split heavy below-the-fold and modal components for faster initial load
const TestimonialsSection = lazy(() => 
  import('./TestimonialsSection').then(module => ({ default: module.TestimonialsSection }))
);
const SmartLeadCaptureModal = lazy(() => 
  import('./SmartLeadCaptureModal').then(module => ({ default: module.SmartLeadCaptureModal }))
);
import { 
  ArrowRight, 
  Menu, 
  X, 
  CheckCircle2, 
  Mail, 
  Instagram,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  ArrowLeft,
  Check,
  UserCheck,
  MessageCircle,
  Smartphone,
  AtSign,
  MoveHorizontal,
  TrendingUp,
  BarChart3,
  Users,
  Zap,
  Star,
  Eye,
  Globe,
  Activity,
  ArrowUp,
  Play
} from 'lucide-react';
import { 
  BRAND_NAME, 
  BRAND_EMAIL, 
  INSTAGRAM_HANDLE, 
  SERVICES, 
  PRICING_PLANS, 
  PROCESS_STEPS,
  TESTIMONIALS,
  IconMap
} from './constants';
import { Service } from './types';

// The logo is now rendered as a clean SVG component for maximum quality
const BRAND_LOGO_URL = "logo.png";

type ViewType = 'home' | 'services';

// Fixed cubic-bezier easing type by casting to explicit tuple of 4 numbers
const appleTransition = { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };
const appleSpring = { type: "spring", stiffness: 100, damping: 20, mass: 1 };

import { BrandLogoImage, Logo } from './BrandLogo';

const Counter = ({ target, suffix = "", duration = 2 }: { target: number, suffix?: string, duration?: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView || window.innerWidth < 768) {
      const controls = animate(count, target, { duration });
      return controls.stop;
    }
  }, [isInView, target, count, duration]);

  useEffect(() => {
    return rounded.on("change", (latest) => setDisplayValue(latest));
  }, [rounded]);

  return <span ref={ref}>{displayValue}{suffix}</span>;
};

const LegalModal = ({ isOpen, onClose, title, content }: { isOpen: boolean, onClose: () => void, title: string, content: React.ReactNode }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-xl bg-white rounded-[20px] sm:rounded-[24px] border border-[#D9D9D9] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
          >
            <div className="p-5 sm:p-6 border-b border-[#D9D9D9] flex justify-between items-center shrink-0">
              <h2 className="text-[20px] sm:text-[22px] font-bold tracking-tight text-[#080808]">{title}</h2>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-[#080808] transition-all cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5 sm:p-6 overflow-y-auto text-[14px] sm:text-[15px] text-[#707070] leading-relaxed space-y-3 font-normal">
              {content}
            </div>
            <div className="p-4 sm:p-5 border-t border-[#D9D9D9] bg-zinc-50 flex justify-end shrink-0">
              <button 
                onClick={onClose}
                className="bg-[#080808] hover:bg-zinc-800 text-white px-6 h-[40px] rounded-full font-bold text-[13px] active:scale-95 transition-transform cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface ServicesPageProps {
  onBack: () => void;
  onRequestAudit: () => void;
}

interface CoreServiceItem {
  title: string;
  description: string;
  includes: string;
}

const CORE_SERVICES: CoreServiceItem[] = [
  {
    title: "Social Media Management",
    description:
      "End-to-end Instagram management covering content planning, publishing, profile optimization, community engagement, and consistent execution.",
    includes: "Content Calendar • Publishing • Community Management • Profile Optimization",
  },
  {
    title: "Content Strategy",
    description:
      "Build a clear content system around your audience, positioning, and goals with strong content pillars, hooks, formats, and scripts.",
    includes: "Content Pillars • Hooks • Scripts • Content Planning",
  },
  {
    title: "Reels Editing",
    description:
      "High-retention short-form editing designed to make your content more engaging, watchable, and aligned with your brand.",
    includes: "Reels Editing • Captions • Pacing • Visual Storytelling",
  },
  {
    title: "Instagram Growth & Optimization",
    description:
      "Turn your Instagram profile into a stronger growth channel through positioning, SEO, profile optimization, audience insights, and content optimization.",
    includes: "Profile Optimization • Instagram SEO • Growth Strategy • Analytics",
  },
];

const ServicesPage = ({ onBack, onRequestAudit }: ServicesPageProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="pt-24 sm:pt-28 pb-14 sm:pb-16 px-5 sm:px-6 md:px-8 min-h-screen bg-white"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Back Link */}
        <button 
          onClick={onBack}
          className="group inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#707070] hover:text-[#080808] transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Home</span>
        </button>

        {/* Minimal Header */}
        <div className="mb-8 text-left">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
            <span className="text-[12px] sm:text-[13px] font-semibold tracking-[0.08em] uppercase text-[#707070]">
              OUR SERVICES
            </span>
          </div>
          <h1 className="text-[32px] sm:text-[38px] md:text-[44px] font-bold tracking-tight text-[#080808] mb-2 leading-[1.05]">
            Services & Deliverables
          </h1>
          <p className="text-[#707070] text-[16px] sm:text-[17px] font-normal leading-normal max-w-[600px]">
            Simple, high-impact systems built to grow your Instagram and build authority.
          </p>
        </div>

        {/* 4 Core Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-8 sm:mb-10 items-stretch">
          {CORE_SERVICES.map((service) => (
            <div
              key={service.title}
              className="bg-[#080808] border border-[#292929] rounded-[20px] sm:rounded-[24px] p-6 sm:p-7 flex flex-col justify-between h-full transition-all duration-200 hover:border-zinc-700 min-h-[220px] sm:min-h-[240px]"
            >
              <div className="flex flex-col flex-1">
                <h2 className="text-[19px] sm:text-[21px] font-bold text-white tracking-tight mb-2.5 leading-[1.2]">
                  {service.title}
                </h2>
                <p className="text-zinc-400 text-[13.5px] sm:text-[14.5px] leading-relaxed mb-4 font-normal">
                  {service.description}
                </p>
                <div className="pt-3 border-t border-zinc-800/80 mb-5 mt-auto">
                  <p className="text-[12px] sm:text-[12.5px] text-zinc-400 font-normal leading-relaxed">
                    <span className="text-zinc-300 font-medium">Includes:</span> {service.includes.replace(/^Includes:\s*/i, '')}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  trackGrowthAuditClick(`services_card_${service.title.toLowerCase().replace(/\s+/g, '_')}`, `Learn More - ${service.title}`);
                  onRequestAudit();
                }}
                className="text-[13.5px] font-semibold text-zinc-300 hover:text-white transition-colors inline-flex items-center gap-1.5 self-start cursor-pointer group/link pt-1"
              >
                <span>Learn More</span>
                <span className="text-[#E50914] font-bold transition-transform duration-200 group-hover/link:translate-x-0.5">→</span>
              </button>
            </div>
          ))}
        </div>

        {/* Single Primary CTA */}
        <div className="text-center pt-2 sm:pt-4">
          <button
            onClick={() => {
              trackGrowthAuditClick('services_page_bottom_cta', 'Free Growth Audit');
              onRequestAudit();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#080808] text-white hover:bg-zinc-800 px-7 h-[50px] sm:h-[52px] rounded-full text-[14px] sm:text-[15px] font-bold transition-all duration-200 active:scale-95 shadow-sm cursor-pointer"
          >
            <span>Free Growth Audit</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const HomeView = ({ 
  onViewServices,
  onRequestAudit 
}: { 
  onViewServices: () => void,
  onRequestAudit: () => void
}) => {
  return (
    <>
      {/* High-Impact Editorial Dark Hero Section */}
      <HeroSection 
        onRequestAudit={() => {
          trackGrowthAuditClick('hero_primary_cta', 'Free Growth Audit');
          onRequestAudit();
        }}
        onViewServices={onViewServices}
      />

      {/* Moving Trust Strip Section */}
      <TrustMarquee />

      {/* Proof Statistics Section: Big Numbers Credibility */}
      <ProofStatsSection />

      {/* Trusted By Section: Client Credibility */}
      <TrustedBySection />

      {/* Problem Identification FAQ-style Section */}
      <ProblemSection />

      {/* Creator Comparison Section: Which Creator Are You? */}
      <CreatorComparisonSection onRequestAudit={onRequestAudit} />

      {/* Core Services Section: Social Media Management & Personal Branding */}
      <CoreServicesSection onRequestAudit={onRequestAudit} />

      {/* Interactive Growth System Section */}
      <GrowthSystem onRequestAudit={onRequestAudit} />

      {/* Editorial Pricing Section with Mobile Horizontal Carousel */}
      <PricingSection onRequestAudit={onRequestAudit} />

      {/* Modern Testimonials Section */}
      <Suspense fallback={<div className="min-h-[360px] bg-white" />}>
        <TestimonialsSection />
      </Suspense>

      {/* Still Not Sure? FAQ & Confidence Section */}
      <StillNotSureSection onRequestAudit={onRequestAudit} />

      {/* Final Call to Action Section */}
      <FinalCtaSection onRequestAudit={onRequestAudit} />
    </>
  );
};

export default function App() {
  const [view, setView] = useState<ViewType>('home');
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  useEffect(() => {
    trackPageView(window.location.pathname, document.title);
  }, []);

  const handleViewChange = (newView: ViewType) => {
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackPageView(newView === 'home' ? '/' : '/services', newView === 'home' ? 'Growth with Hardik' : 'Services - Growth with Hardik');
  };

  const handleOpenAuditModal = () => {
    setIsAuditModalOpen(true);
  };

  const handleCloseAuditModal = () => {
    setIsAuditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] selection:bg-[#111111] selection:text-white overflow-x-hidden">
      <Header 
        activeView={view} 
        onViewChange={handleViewChange} 
        onRequestAudit={handleOpenAuditModal} 
      />
      <main>
        <AnimatePresence mode="wait">
          {view === 'home' ? (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <HomeView 
                onViewServices={() => handleViewChange('services')} 
                onRequestAudit={handleOpenAuditModal} 
              />
            </motion.div>
          ) : (
            <motion.div key="services" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ServicesPage 
                onBack={() => handleViewChange('home')} 
                onRequestAudit={handleOpenAuditModal} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer 
        onViewChange={handleViewChange} 
        onShowPrivacy={() => setShowPrivacy(true)} 
        onShowTerms={() => setShowTerms(true)}
        onRequestAudit={handleOpenAuditModal}
      />
      
      <LegalModal 
        isOpen={showPrivacy} 
        onClose={() => setShowPrivacy(false)} 
        title="Privacy Policy"
        content={
          <>
            <p>Your privacy matters to us. We only collect information you voluntarily provide, such as your name, email address, or project details submitted through our forms.</p>
            <p>This information is used solely to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Communicate with you</li>
              <li>Provide our services</li>
              <li>Improve our website and offerings</li>
            </ul>
            <p>We do not sell, rent, or share your personal data with third parties. If you have any questions about your data or wish to have it removed, you can contact us anytime.</p>
          </>
        }
      />

      <LegalModal 
        isOpen={showTerms} 
        onClose={() => setShowTerms(false)} 
        title="Terms & Conditions"
        content={
          <>
            <p>By using this website, you agree to the following terms:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>All content on this site is owned by Growth with Hardik and may not be copied or reused without permission.</li>
              <li>Services are provided based on agreed scope and timelines discussed before starting a project.</li>
              <li>Results may vary depending on multiple factors, and no guaranteed outcomes are promised.</li>
              <li>We reserve the right to update these terms at any time.</li>
            </ul>
            <p>If you have questions regarding services or usage, feel free to reach out before proceeding.</p>
          </>
        }
      />

      {/* Fixed Bottom Conversion Bar on Mobile */}
      <MobileConversionBar onRequestAudit={handleOpenAuditModal} />

      {/* Floating Interface Elements */}
      <BackToTopButton />
      <ChatAssistant onRequestAudit={handleOpenAuditModal} />

      {/* Full-Screen / Modal Lead Qualification Form with Intelligent Triggers */}
      <Suspense fallback={null}>
        <SmartLeadCaptureModal 
          isOpen={isAuditModalOpen} 
          onClose={handleCloseAuditModal} 
          onOpen={handleOpenAuditModal} 
        />
      </Suspense>
    </div>
  );
}
