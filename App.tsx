
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, animate, useMotionValue, useTransform, useScroll } from 'framer-motion';
import { TrustMarquee } from './TrustMarquee';
import { ProblemSection } from './ProblemSection';
import { GrowthSystem } from './GrowthSystem';
import { TestimonialsSection } from './TestimonialsSection';
import { SmartLeadCaptureModal } from './SmartLeadCaptureModal';
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

// Abstract "G" Growth Symbol: Flat vector, modern geometric with subtle electric-blue accent
const AbstractGSymbol = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg 
    viewBox="0 0 36 36" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    aria-hidden="true"
  >
    {/* Abstract Geometric "G" Growth Glyph */}
    <path 
      d="M26 10H14C9.58172 10 6 13.5817 6 18V18C6 22.4183 9.58172 26 14 26H22C26.4183 26 30 22.4183 30 18V15H18" 
      stroke="#FFFFFF" 
      strokeWidth="3.2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    {/* Subtle Electric-Blue Precision Growth Accent */}
    <circle cx="26" cy="10" r="2.2" fill="#2563EB" />
  </svg>
);

const BrandLogoImage = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-7 h-7 sm:w-8 sm:h-8",
    md: "w-8 h-8 sm:w-9 sm:h-9",
    lg: "w-14 h-14 sm:w-16 sm:h-16"
  };

  return (
    <div className={`${sizeClasses[size]} rounded-lg sm:rounded-xl bg-black overflow-hidden shrink-0 shadow-sm flex items-center justify-center p-1.5`}>
      <AbstractGSymbol />
    </div>
  );
};

const Logo = ({ onClick }: { onClick?: () => void }) => (
  <div 
    className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer select-none" 
    onClick={onClick}
    id="main-brand-logo"
  >
    <div className="transition-transform duration-300 group-hover:scale-105 active:scale-95">
      <BrandLogoImage size="md" />
    </div>
    <div className="flex items-center text-[16px] sm:text-[18px] tracking-tight leading-none text-black">
      <span className="font-extrabold tracking-tight">Growth</span>
      <span className="text-zinc-500 font-medium px-[1px]">with</span>
      <span className="font-extrabold tracking-tight">Hardik</span>
      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 ml-0.5 inline-block self-center"></span>
    </div>
  </div>
);

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

const Navbar = ({ 
  activeView, 
  onViewChange, 
  onRequestAudit 
}: { 
  activeView: ViewType, 
  onViewChange: (view: ViewType) => void, 
  onRequestAudit: () => void 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', view: 'services' as ViewType },
    { name: 'Pricing', href: '#pricing', view: 'home' as ViewType },
    { name: 'Process', href: '#process', view: 'home' as ViewType },
  ];

  const handleNavClick = (link: typeof navLinks[0]) => {
    onViewChange(link.view);
    setIsMobileMenuOpen(false);
    if (link.href) {
      setTimeout(() => {
        const el = document.querySelector(link.href!);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAuditClick = () => {
    setIsMobileMenuOpen(false);
    onRequestAudit();
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'apple-blur border-b border-gray-200/50 py-2 md:py-2' : 'bg-transparent py-3 md:py-4'}`}>
      <div className="max-w-7xl mx-auto px-5 md:px-6 flex justify-between items-center">
        <Logo onClick={() => { onViewChange('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
        
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <button 
              key={link.name} 
              onClick={() => handleNavClick(link)}
              className={`text-sm font-bold transition-colors cursor-pointer ${activeView === link.view && !link.href ? 'text-blue-600' : 'text-gray-500 hover:text-black'}`}
            >
              {link.name}
            </button>
          ))}
          <button 
            onClick={handleAuditClick}
            className="bg-black text-white px-6 py-3 rounded-full text-sm font-black hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-black/10 cursor-pointer touch-manipulation flex items-center gap-2"
          >
            <span>Request a Growth Audit</span>
            <ArrowRight size={15} />
          </button>
        </div>

        <button 
          className="md:hidden p-2 -mr-2 text-gray-900 touch-manipulation"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-2xl border-b border-gray-100 overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <button 
                  key={link.name} 
                  className="text-3xl font-black text-gray-900 text-left tracking-tight py-1"
                  onClick={() => handleNavClick(link)}
                >
                  {link.name}
                </button>
              ))}
              <button 
                className="bg-black text-white px-6 py-4 rounded-2xl text-center font-black text-lg active:scale-[0.98] transition-transform mt-2 flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
                onClick={handleAuditClick}
              >
                <span>Request a Growth Audit</span>
                <ArrowRight size={18} />
              </button>
              <div className="flex justify-center gap-8 pt-4 border-t border-gray-100">
                <a href={`https://instagram.com/${INSTAGRAM_HANDLE.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-gray-400 p-2 hover:text-black transition-colors"><Instagram size={24} /></a>
                <a href={`mailto:${BRAND_EMAIL}`} className="text-gray-400 p-2 hover:text-black transition-colors"><Mail size={24} /></a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const LegalModal = ({ isOpen, onClose, title, content }: { isOpen: boolean, onClose: () => void, title: string, content: React.ReactNode }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={appleTransition}
            className="relative w-full max-w-2xl bg-white rounded-[2rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="p-6 md:p-12 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h2 className="text-xl md:text-3xl font-black tracking-tight">{title}</h2>
              <button 
                onClick={onClose}
                className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-black transition-all active:scale-95 touch-manipulation"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 md:p-12 overflow-y-auto font-medium text-gray-600 leading-relaxed space-y-4 md:space-y-6 text-sm md:text-lg">
              {content}
            </div>
            <div className="p-6 md:p-10 bg-gray-50 flex justify-end shrink-0">
              <button 
                onClick={onClose}
                className="bg-black text-white px-8 py-3 rounded-full font-black text-xs md:text-sm active:scale-95 transition-transform"
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

const ServicesPage = ({ onBack, onRequestAudit }: ServicesPageProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="pt-20 md:pt-32 pb-12 md:pb-24 px-5 md:px-6 min-h-screen bg-white"
    >
      <div className="max-w-7xl mx-auto">
        <motion.button 
          onClick={onBack}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="group flex items-center gap-2 text-gray-400 hover:text-black transition-colors font-bold mb-6 sm:mb-8 md:mb-12 touch-manipulation cursor-pointer"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Overview</span>
        </motion.button>

        <div className="mb-8 sm:mb-12 md:mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-blue-600 font-bold tracking-[0.14em] uppercase text-[12px] sm:text-xs mb-2 sm:mb-2.5 block"
          >
            Capabilities
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, ...appleTransition }}
            className="text-[32px] sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-2.5 sm:mb-4 leading-[1.08]"
          >
            Premium Solutions <br className="hidden md:block" /> for Modern Brands.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, ...appleTransition }}
            className="text-[16px] sm:text-lg md:text-xl text-gray-500 max-w-[340px] sm:max-w-2xl font-normal sm:font-medium leading-[1.48] sm:leading-[1.55]"
          >
            Explore our ecosystem of high-performance growth services designed to scale your Instagram impact.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {SERVICES.map((service, idx) => {
            const Icon = IconMap[service.iconName];
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ ...appleTransition, delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.01 }}
                className="group relative bg-gray-50 p-5 sm:p-7 md:p-8 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] border border-transparent hover:border-blue-500/20 hover:bg-white hover:shadow-[0_30px_60px_-15px_rgba(59,130,246,0.12)] transition-all duration-300 overflow-hidden cursor-default flex flex-col"
              >
                <div className="transition-transform duration-500 group-hover:scale-[1.01] flex flex-col h-full">
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0, y: 15 }}
                    whileInView={{ scale: 1, opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 15, 
                      delay: (idx * 0.1) + 0.3 
                    }}
                    className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white rounded-xl md:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 text-black group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                  >
                    <Icon size={22} className="md:w-6 md:h-6" />
                  </motion.div>
                  
                  <h3 className="text-lg sm:text-xl md:text-2xl font-black mb-1.5 sm:mb-2 tracking-tight group-hover:text-blue-600 transition-colors duration-200">
                    {service.title}
                  </h3>
                  <p className="text-gray-500 leading-[1.55] font-medium text-xs sm:text-sm md:text-[15px] mb-5 sm:mb-6 flex-grow">
                    {service.description}
                  </p>
                  
                  <div className="mt-auto">
                    <button 
                      onClick={onRequestAudit}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-white font-black uppercase text-[10px] md:text-xs tracking-widest px-6 py-3.5 rounded-xl hover:bg-blue-600 transition-all active:scale-95 shadow-md shadow-black/5 touch-manipulation cursor-pointer min-h-[44px]"
                    >
                      <span>Request a Growth Audit</span>
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>

                <div className="absolute top-0 right-0 p-6 md:p-8 opacity-0 group-hover:opacity-5 transition-all duration-500 pointer-events-none hidden md:block">
                   <Icon size={110} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

const CarouselFadeOverlay = () => (
  <div className="md:hidden absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
);

const HomeView = ({ 
  onViewServices,
  onRequestAudit 
}: { 
  onViewServices: () => void,
  onRequestAudit: () => void
}) => {
  const [activePricingIdx, setActivePricingIdx] = useState(0);
  
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Subtle Apple-style multi-plane parallax transforms
  const backgroundY1 = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const backgroundY2 = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const backgroundScale1 = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const backgroundScale2 = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.2]);

  const handleScrollProgress = (e: React.UIEvent<HTMLDivElement>, setter: (idx: number) => void) => {
    const container = e.currentTarget;
    const scrollPosition = container.scrollLeft;
    const itemWidth = container.children[0].clientWidth;
    const gap = 24;
    const index = Math.round(scrollPosition / (itemWidth + gap));
    setter(index);
  };

  return (
    <>
      <section ref={heroRef} className="relative pt-24 sm:pt-28 md:pt-32 pb-10 sm:pb-12 md:pb-14 overflow-hidden px-4 sm:px-6 md:px-8 w-full max-w-full box-border">
        {/* Soft glowing background elements with subtle multi-layer parallax */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none overflow-hidden">
          <motion.div 
            style={{ y: backgroundY1, scale: backgroundScale1 }}
            className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-blue-100/60 rounded-full blur-[140px] opacity-60 will-change-transform" 
          />
          <motion.div 
            style={{ y: backgroundY2, scale: backgroundScale2 }}
            className="absolute top-40 right-10 w-[450px] h-[450px] bg-indigo-100/50 rounded-full blur-[140px] opacity-50 will-change-transform" 
          />
          <motion.div 
            style={{ y: backgroundY1 }}
            className="absolute top-1/2 left-10 w-[300px] h-[300px] bg-purple-100/40 rounded-full blur-[120px] opacity-40 will-change-transform" 
          />
        </div>

        <motion.div 
          style={{ y: contentY, opacity: contentOpacity }}
          className="w-full max-w-4xl mx-auto flex flex-col items-center text-center relative z-10 will-change-transform"
        >
          {/* Main Headline - Exactly 3 clean lines on mobile, 2 lines on desktop */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="w-full text-[27px] min-[375px]:text-[30px] min-[414px]:text-[34px] sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight sm:tracking-[-0.025em] leading-[1.08] sm:leading-[1.05] text-gray-950 text-center"
          >
            <span className="block">Grow Your Instagram.</span>
            <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mt-1 sm:mt-1.5">
              <span className="block sm:inline">Build a Personal</span>{' '}
              <span className="block sm:inline">Brand.</span>
            </span>
          </motion.h1>

          {/* Subheadline - Compact supporting copy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-[14px] sm:text-base md:text-lg text-gray-500 font-normal leading-[1.4] sm:leading-[1.5] mt-4 sm:mt-6 mb-6 sm:mb-7 max-w-[330px] sm:max-w-xl mx-auto text-center"
          >
            Turn your content into consistent growth, stronger positioning, and qualified leads.
          </motion.p>

          {/* Primary CTA & Proof Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center w-full"
          >
            <button
              onClick={onRequestAudit}
              className="group relative bg-gray-950 text-white px-7 sm:px-9 h-[54px] sm:h-[58px] rounded-full text-[15px] sm:text-base md:text-[17px] font-black transition-all duration-300 hover:bg-black hover:shadow-xl hover:shadow-blue-500/15 flex items-center justify-center gap-2.5 sm:gap-3 active:scale-95 touch-manipulation cursor-pointer w-full max-w-[360px] sm:w-auto"
            >
              <span>Request a Growth Audit</span>
              <ArrowRight className="group-hover:translate-x-1.5 transition-transform w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Subtle Proof Statement Underneath CTA */}
            <p className="mt-3 sm:mt-3.5 text-xs sm:text-[13px] font-medium text-gray-400 sm:text-gray-500 tracking-normal text-center select-none">
              65,000+ creators analyzed
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Moving Trust Strip Section */}
      <TrustMarquee />

      {/* Problem Identification FAQ-style Section */}
      <ProblemSection />

      {/* Interactive Growth System Section */}
      <GrowthSystem onRequestAudit={onRequestAudit} />

      <section id="pricing" className="py-12 sm:py-16 md:py-24 bg-white px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-10 md:mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={appleTransition}
              className="text-[30px] sm:text-4xl md:text-5xl lg:text-[50px] font-black tracking-tight mb-1.5 sm:mb-2.5 leading-[1.1]"
            >
              Transparent pricing.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, ...appleTransition }}
              className="text-[14px] sm:text-base md:text-lg text-gray-500 max-w-none sm:max-w-lg mx-auto font-normal leading-[1.4] sm:leading-[1.5] tracking-tight"
            >
              Choose the plan that fits your growth stage.
            </motion.p>
          </div>
          <div className="relative">
            <CarouselFadeOverlay />
            <div 
              className="flex md:grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-7 items-stretch overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none no-scrollbar -mx-5 px-5 md:mx-0 md:px-0 pb-4 md:pb-0"
              onScroll={(e) => handleScrollProgress(e, setActivePricingIdx)}
            >
              {PRICING_PLANS.map((plan, idx) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, ...appleTransition }}
                  whileHover={{ y: -6, scale: plan.highlighted ? 1.03 : 1.01 }}
                  className={`relative flex flex-col p-5 sm:p-7 md:p-8 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] border transition-all duration-300 flex-shrink-0 w-[84vw] max-w-[340px] sm:w-[360px] md:w-auto snap-center ${
                    plan.highlighted 
                      ? 'bg-zinc-950 border-white/10 shadow-[0_30px_60px_-15px_rgba(59,130,246,0.25)] text-white z-10 md:scale-[1.02] ring-1 ring-white/5' 
                      : 'bg-white border-gray-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] text-gray-900'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="hidden md:block absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-blue-500/30 whitespace-nowrap">
                      Recommended Choice
                    </div>
                  )}
                  <div className="mb-4 sm:mb-6">
                    {plan.highlighted && (
                      <div className="inline-block md:hidden bg-blue-600 text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest mb-2.5 leading-none">
                        Recommended
                      </div>
                    )}
                    <h3 className={`text-lg sm:text-xl md:text-2xl font-black mb-1 tracking-tight ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                    <p className={`text-xs sm:text-[13px] font-medium leading-relaxed ${plan.highlighted ? 'text-gray-400' : 'text-gray-500'}`}>{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-2.5 sm:space-y-3.5 mb-6 sm:mb-8 flex-grow">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 sm:gap-3">
                        <div className={`mt-0.5 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center ${plan.highlighted ? 'bg-blue-600/20 text-blue-400' : 'bg-gray-100 text-gray-500'}`}>
                          <Check size={10} className="sm:w-3 sm:h-3" strokeWidth={3} />
                        </div>
                        <span className={`text-[13px] sm:text-sm md:text-[15px] font-semibold leading-snug ${plan.highlighted ? 'text-gray-200' : 'text-gray-600'}`}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={onRequestAudit}
                    className={`block w-full text-center py-3 sm:py-3.5 md:py-4 rounded-xl sm:rounded-2xl font-black transition-all text-xs sm:text-sm tracking-wider uppercase active:scale-[0.98] min-h-[46px] sm:min-h-[50px] touch-manipulation cursor-pointer ${
                      plan.highlighted 
                        ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-600/20' 
                        : 'bg-zinc-950 text-white hover:bg-black shadow-xs'
                    }`}
                  >
                    {plan.ctaText || 'Start Growing'}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-1.5 mt-4 md:hidden">
            {PRICING_PLANS.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${activePricingIdx === i ? 'w-5 bg-blue-600' : 'w-1.5 bg-gray-200'}`} />
            ))}
          </div>
          <div className="mt-5 sm:mt-8 md:mt-10 text-center">
            <p className="text-xs sm:text-sm text-gray-400 font-medium max-w-sm mx-auto">All plans include regular performance updates and strategy refinements.</p>
          </div>
        </div>
      </section>

      {/* Modern Testimonials Section */}
      <TestimonialsSection />
    </>
  );
};

// Premium Editorial Black Footer Section
const Footer = ({ 
  onViewChange: _onViewChange, 
  onShowPrivacy, 
  onShowTerms 
}: { 
  onViewChange: (view: ViewType) => void, 
  onShowPrivacy: () => void, 
  onShowTerms: () => void 
}) => {
  return (
    <footer className="bg-black text-white pt-12 sm:pt-16 pb-14 sm:pb-16 px-5 sm:px-8 md:px-12 border-t border-white/10">
      <div className="max-w-4xl mx-auto flex flex-col text-left items-start">
        {/* Editorial Statement Quote */}
        <h2 className="text-[24px] min-[360px]:text-[26px] sm:text-[28px] md:text-[32px] font-medium tracking-tight text-white leading-[1.2] sm:leading-[1.25] max-w-2xl mb-8 sm:mb-10">
          The biggest cost of growing without a strategy is the growth you never see
        </h2>

        {/* Brand & Contact Information */}
        <div className="mb-8 sm:mb-10">
          <p className="text-sm sm:text-base font-medium text-zinc-200 tracking-tight">
            Growth with Hardik
          </p>
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-normal text-zinc-400 mt-1">
            <a 
              href={`https://instagram.com/${INSTAGRAM_HANDLE.replace('@', '')}`} 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-white transition-colors"
            >
              Instagram
            </a>
            <span className="text-zinc-600 select-none">·</span>
            <a 
              href={`mailto:${BRAND_EMAIL}`} 
              className="hover:text-white transition-colors"
            >
              Email
            </a>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="space-y-1 pt-6 border-t border-white/10 w-full">
          <div className="flex items-center gap-2.5 text-xs text-zinc-400">
            <button 
              onClick={onShowPrivacy} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-zinc-600 select-none">·</span>
            <button 
              onClick={onShowTerms} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
          </div>
          <p className="text-xs text-zinc-500 font-normal">
            © 2025 GrowthWithHardik
          </p>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [view, setView] = useState<ViewType>('home');
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  const handleViewChange = (newView: ViewType) => {
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuditModal = () => {
    setIsAuditModalOpen(true);
  };

  const handleCloseAuditModal = () => {
    setIsAuditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      <Navbar 
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

      {/* Full-Screen / Modal Lead Qualification Form with Intelligent Triggers */}
      <SmartLeadCaptureModal 
        isOpen={isAuditModalOpen} 
        onClose={handleCloseAuditModal} 
        onOpen={handleOpenAuditModal} 
      />
    </div>
  );
}
