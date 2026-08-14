
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, animate, useMotionValue, useTransform, useScroll } from 'framer-motion';
import { TrustMarquee } from './TrustMarquee';
import { ProblemSection } from './ProblemSection';
import { GrowthSystem } from './GrowthSystem';
import { TestimonialsSection } from './TestimonialsSection';
import { LeadQualificationForm } from './LeadQualificationForm';
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
  BRAND_PHONE, 
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

const GrowthLogoSVG = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-1.5">
    {/* Bar Chart Section */}
    <rect x="38" y="52" width="6.5" height="15" rx="1" fill="#0EA5E9"/>
    <rect x="47.5" y="42" width="6.5" height="25" rx="1" fill="white"/>
    <rect x="57" y="32" width="6.5" height="35" rx="1" fill="#0EA5E9"/>
    
    {/* Sweeping Growth Arrow Swoosh */}
    <path 
      d="M30 63.5C35 73 46 76 69.5 62" 
      stroke="white" 
      strokeWidth="4" 
      strokeLinecap="round" 
    />
    <path 
      d="M69.5 62L64.5 57.5L71.5 63.5L69.5 62Z" 
      fill="white" 
      stroke="white" 
      strokeWidth="1.5" 
      strokeLinejoin="round" 
    />

    {/* Rocket - Refined to match the provided inspiration */}
    <g transform="translate(32, 25) rotate(-35)">
      {/* Exhaust plume */}
      <path 
        d="M4 14L0 22L8 22L4 14Z" 
        fill="white" 
        fillOpacity="0.7"
      />
      {/* Body */}
      <path 
        d="M4 0C4 0 8 1.5 8 6L7 14H1L0 6C0 1.5 4 0 4 0Z" 
        fill="#0EA5E9" 
      />
      {/* Tail Fins */}
      <path d="M1 12L-2 15V17H1L2 14" fill="#0EA5E9" />
      <path d="M7 12L10 15V17H7L6 14" fill="#0EA5E9" />
      {/* Small details */}
      <circle cx="4" cy="5" r="0.8" fill="white" fillOpacity="0.5" />
    </g>
  </svg>
);

const BrandLogoImage = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-8 h-8 md:w-10 md:h-10",
    md: "w-10 h-10 md:w-14 md:h-14",
    lg: "w-32 h-32 md:w-64 md:h-64"
  };

  return (
    <div className={`${sizeClasses[size]} relative rounded-full bg-black overflow-hidden shrink-0 shadow-sm flex items-center justify-center`}>
      <GrowthLogoSVG />
    </div>
  );
};

const Logo = ({ onClick }: { onClick?: () => void }) => (
  <div 
    className="flex items-center gap-2.5 md:gap-3 group cursor-pointer" 
    onClick={onClick}
  >
    <div className="transition-transform duration-500 group-hover:scale-105 active:scale-95">
      <BrandLogoImage size="md" />
    </div>
    <div className="flex flex-col justify-center">
      <span className="font-bold text-base md:text-lg tracking-tight leading-none text-black">
        {BRAND_NAME}
      </span>
      <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black mt-1 md:mt-1.5">Agency</span>
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

const Navbar = ({ activeView, onViewChange }: { activeView: ViewType, onViewChange: (view: ViewType) => void }) => {
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
    const message = encodeURIComponent("Hi, I’m interested in a free growth audit for my brand.");
    window.open(`https://wa.me/91${BRAND_PHONE}?text=${message}`, '_blank');
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
              className={`text-sm font-bold transition-colors ${activeView === link.view && !link.href ? 'text-blue-600' : 'text-gray-500 hover:text-black'}`}
            >
              {link.name}
            </button>
          ))}
          <button 
            onClick={handleAuditClick}
            className="bg-black text-white px-6 py-3 rounded-full text-sm font-black hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-black/10"
          >
            Free Growth Audit
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
                className="bg-black text-white px-6 py-5 rounded-2xl text-center font-black text-xl active:scale-[0.98] transition-transform mt-2"
                onClick={handleAuditClick}
              >
                Free Growth Audit
              </button>
              <div className="flex justify-center gap-8 pt-4 border-t border-gray-100">
                <a href={`https://instagram.com/${INSTAGRAM_HANDLE.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-gray-400 p-2"><Instagram size={24} /></a>
                <a href={`mailto:${BRAND_EMAIL}`} className="text-gray-400 p-2"><Mail size={24} /></a>
                <a href={`https://wa.me/91${BRAND_PHONE}`} target="_blank" rel="noreferrer" className="text-gray-400 p-2"><MessageCircle size={24} /></a>
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

const ServicesPage = ({ onBack }: { onBack: () => void }) => {
  const handleServiceInquiry = () => {
    const message = encodeURIComponent("Hi, I’d like to know more about your services.");
    window.open(`https://wa.me/91${BRAND_PHONE}?text=${message}`, '_blank');
  };

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
          className="group flex items-center gap-2 text-gray-400 hover:text-black transition-colors font-bold mb-6 md:mb-12 touch-manipulation"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Overview
        </motion.button>

        <div className="mb-10 md:mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-blue-600 font-black tracking-[0.2em] uppercase text-[10px] md:text-xs mb-3 md:mb-6 block"
          >
            Capabilities
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, ...appleTransition }}
            className="text-3xl md:text-8xl font-black tracking-tight mb-4 md:mb-8 leading-[1.1] md:leading-[1.05]"
          >
            Premium Solutions <br className="hidden md:block" /> for Modern Brands.
          </motion.h1>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, ...appleTransition }}
            className="text-base md:text-2xl text-gray-400 max-w-2xl font-medium leading-relaxed"
          >
            Explore our ecosystem of high-performance growth services designed to scale your Instagram impact.
          </motion.h3>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
          {SERVICES.map((service, idx) => {
            const Icon = IconMap[service.iconName];
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ ...appleTransition, delay: idx * 0.1 }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="group relative bg-gray-50 p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border border-transparent hover:border-blue-500/20 hover:bg-white hover:shadow-[0_40px_80px_-15px_rgba(59,130,246,0.15)] transition-all duration-500 overflow-hidden cursor-default flex flex-col"
              >
                <div className="transition-transform duration-700 group-hover:scale-[1.02] flex flex-col h-full">
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
                    className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-10 text-black group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm"
                    whileHover={{ rotate: 360, scale: 1.15 }}
                  >
                    <Icon size={24} className="md:w-8 md:h-8" />
                  </motion.div>
                  
                  <h3 className="text-xl md:text-3xl font-black mb-2 md:mb-4 tracking-tight group-hover:text-blue-600 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed font-medium text-sm md:text-lg mb-6 md:mb-10 flex-grow">
                    {service.description}
                  </p>
                  
                  <div className="mt-auto">
                    <button 
                      onClick={handleServiceInquiry}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-white font-black uppercase text-[10px] md:text-xs tracking-widest px-8 py-4 rounded-xl hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-black/5 touch-manipulation"
                    >
                      Get Info <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>

                <div className="absolute top-0 right-0 p-6 md:p-8 opacity-0 group-hover:opacity-5 transition-all duration-700 group-hover:scale-110 pointer-events-none hidden md:block">
                   <Icon size={120} />
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

const HomeView = ({ onViewServices }: { onViewServices: () => void }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeProcessIdx, setActiveProcessIdx] = useState(0);
  const [activePricingIdx, setActivePricingIdx] = useState(0);
  const [activeFeedbackIdx, setActiveFeedbackIdx] = useState(0);
  
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
  
  const handleAuditClick = () => {
    const message = encodeURIComponent("Hi, I’m interested in a free growth audit for my brand.");
    window.open(`https://wa.me/91${BRAND_PHONE}?text=${message}`, '_blank');
  };

  const scrollToContact = () => {
    const el = document.querySelector('#contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const input = document.querySelector('input[name="name"]') as HTMLInputElement;
        input?.focus({ preventScroll: true });
      }, 800);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    
    try {
      const response = await fetch("https://formspree.io/f/xnjqwnkb", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        setIsSubmitted(true);
        form.reset();
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

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
      <section ref={heroRef} className="relative pt-20 sm:pt-24 lg:pt-28 pb-8 lg:pb-12 overflow-hidden px-5 sm:px-6 md:px-8">
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
          className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10 will-change-transform"
        >
          {/* Social Proof Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-3 bg-gray-900/5 border border-gray-900/10 backdrop-blur-xl px-4 py-1.5 rounded-full mb-4 sm:mb-5"
          >
            <div className="flex -space-x-2 overflow-hidden">
              <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Client 1" />
              <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Client 2" />
              <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Client 3" />
              <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="Client 4" />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
              <span className="flex text-amber-400">★★★★★</span>
              <span>Trusted by 30+ Brands & Creators</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[1.05] text-gray-950 mb-4 sm:mb-5"
          >
            Grow on Instagram. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Build a Brand People Remember.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg sm:text-xl lg:text-2xl text-gray-500 font-medium leading-relaxed mb-6 sm:mb-8 max-w-2xl"
          >
            We help creators and modern brands improve their reach by <span className="text-gray-950 font-extrabold border-b-2 border-blue-600 pb-0.5">200%</span> using well tested strategies.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto items-stretch sm:items-center justify-center"
          >
            <button
              onClick={handleAuditClick}
              className="group relative bg-gray-950 text-white px-9 py-4 sm:py-5 rounded-full text-base sm:text-lg font-black transition-all duration-300 hover:bg-black hover:shadow-2xl hover:shadow-blue-500/15 flex items-center justify-center gap-3 active:scale-95 touch-manipulation"
            >
              Book a Free Growth Audit
              <ArrowRight className="group-hover:translate-x-1.5 transition-transform" size={20} />
            </button>

            <button
              onClick={() => {
                const el = document.querySelector('#process') || document.querySelector('#pricing');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  onViewServices();
                }
              }}
              className="px-8 py-4 sm:py-5 rounded-full text-base sm:text-lg font-bold text-gray-600 hover:text-gray-950 hover:bg-gray-100/80 border border-gray-200/80 transition-all flex items-center justify-center gap-2 active:scale-95 touch-manipulation"
            >
              See Our Work <ChevronRight size={20} />
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Moving Trust Strip Section */}
      <TrustMarquee />

      {/* Problem Identification FAQ-style Section */}
      <ProblemSection />

      {/* Interactive Growth System Section */}
      <GrowthSystem />

      <section id="pricing" className="py-10 md:py-24 bg-white px-5 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={appleTransition}
              className="text-3xl md:text-6xl font-black tracking-tight mb-2 md:mb-6"
            >
              Transparent pricing.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, ...appleTransition }}
              className="text-base md:text-xl text-gray-500 max-w-xl mx-auto font-medium"
            >
              Choose the plan that fits your growth stage.
            </motion.p>
          </div>
          <div className="relative">
            <CarouselFadeOverlay />
            <div 
              className="flex md:grid md:grid-cols-3 gap-5 md:gap-8 items-stretch overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none no-scrollbar -mx-5 px-5 md:mx-0 md:px-0 pb-6 md:pb-0"
              onScroll={(e) => handleScrollProgress(e, setActivePricingIdx)}
            >
              {PRICING_PLANS.map((plan, idx) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, ...appleTransition }}
                  whileHover={{ y: -8, scale: plan.highlighted ? 1.04 : 1.02 }}
                  className={`relative flex flex-col p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] border transition-all duration-500 flex-shrink-0 w-[88vw] md:w-auto snap-center ${
                    plan.highlighted 
                      ? 'bg-zinc-950 border-white/10 shadow-[0_40px_80px_-15px_rgba(59,130,246,0.25)] text-white z-10 md:scale-[1.02] ring-1 ring-white/5' 
                      : 'bg-white border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] text-gray-900'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="hidden md:block absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] md:text-[10px] font-black px-4 md:px-5 py-1.5 md:py-2 rounded-full uppercase tracking-[0.2em] shadow-xl shadow-blue-500/30 whitespace-nowrap">
                      Recommended Choice
                    </div>
                  )}
                  <div className="mb-5 md:mb-10">
                    {plan.highlighted && (
                      <div className="inline-block md:hidden bg-blue-600 text-white text-[7px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-3 leading-none">
                        Recommended
                      </div>
                    )}
                    <h3 className={`text-lg md:text-2xl font-black mb-1 md:mb-2 tracking-tight ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                    <p className={`text-xs md:text-sm font-medium leading-relaxed ${plan.highlighted ? 'text-gray-400' : 'text-gray-500'}`}>{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-4 md:space-y-6 mb-8 md:mb-12 flex-grow">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 md:gap-4">
                        <div className={`mt-0.5 flex-shrink-0 w-4 h-4 md:w-6 md:h-6 rounded-full flex items-center justify-center ${plan.highlighted ? 'bg-blue-600/20 text-blue-400' : 'bg-gray-100 text-gray-500'}`}>
                          <Check size={10} className="md:w-3.5 md:h-3.5" strokeWidth={3} />
                        </div>
                        <span className={`text-[13px] md:text-base font-semibold leading-relaxed ${plan.highlighted ? 'text-gray-200' : 'text-gray-600'}`}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={scrollToContact}
                    className={`block w-full text-center py-4 md:py-5 rounded-2xl font-black transition-all text-[10px] md:text-sm tracking-widest uppercase active:scale-[0.98] touch-manipulation ${
                      plan.highlighted 
                        ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20' 
                        : 'bg-zinc-950 text-white hover:bg-black shadow-sm'
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
              <div key={i} className={`h-1 rounded-full transition-all duration-300 ${activePricingIdx === i ? 'w-5 bg-blue-600' : 'w-1 bg-gray-200'}`} />
            ))}
          </div>
          <div className="mt-6 md:mt-20 text-center">
            <p className="text-[10px] md:text-sm text-gray-400 font-medium max-w-[240px] md:max-w-sm mx-auto">All plans include regular performance updates and strategy refinements.</p>
          </div>
        </div>
      </section>

      {/* Modern Testimonials Section */}
      <TestimonialsSection />

      <section id="contact" className="py-12 sm:py-16 md:py-32 bg-black text-white px-4 sm:px-6 md:px-8 overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-32 relative z-10 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={appleTransition}
            className="md:sticky md:top-32 mb-6 sm:mb-10 lg:mb-0"
          >
            <h2 className="text-4xl md:text-7xl font-black tracking-tight mb-4 sm:mb-5 md:mb-10 leading-[1.1] md:leading-[0.95]">Ready to <br className="hidden md:block" /> scale?</h2>
            <p className="text-sm sm:text-base md:text-xl text-gray-400 mb-6 sm:mb-8 md:mb-16 max-w-md font-medium leading-relaxed">Book your free growth audit. We'll provide a 3-month roadmap for dominance.</p>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-10">
              <div className="flex items-center gap-3.5 sm:gap-4 md:gap-8 group">
                <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-20 md:h-20 bg-white/5 border border-white/10 rounded-xl md:rounded-3xl flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-500 shadow-2xl backdrop-blur-md shrink-0"><Mail size={20} className="sm:w-[22px] sm:h-[22px] md:w-8 md:h-8" /></div>
                <div>
                  <p className="text-[8px] md:text-[11px] text-zinc-500 uppercase tracking-[0.25em] font-black mb-0.5 sm:mb-1 md:mb-2">Direct Line</p>
                  <a href={`mailto:${BRAND_EMAIL}`} className="text-sm sm:text-base md:text-3xl font-bold hover:text-blue-400 transition-colors tracking-tight truncate max-w-[240px] md:max-w-none block">{BRAND_EMAIL}</a>
                </div>
              </div>
              <div className="flex items-center gap-3.5 sm:gap-4 md:gap-8 group">
                <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-20 md:h-20 bg-white/5 border border-white/10 rounded-xl md:rounded-3xl flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-500 shadow-2xl backdrop-blur-md shrink-0"><Instagram size={20} className="sm:w-[22px] sm:h-[22px] md:w-8 md:h-8" /></div>
                <div>
                  <p className="text-[8px] md:text-[11px] text-zinc-500 uppercase tracking-[0.25em] font-black mb-0.5 sm:mb-1 md:mb-2">Social Feed</p>
                  <a href={`https://instagram.com/${INSTAGRAM_HANDLE.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-sm sm:text-base md:text-3xl font-bold hover:text-blue-400 transition-colors tracking-tight">{INSTAGRAM_HANDLE}</a>
                </div>
              </div>
              <div className="flex items-center gap-3.5 sm:gap-4 md:gap-8 group">
                <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-20 md:h-20 bg-white/5 border border-white/10 rounded-xl md:rounded-3xl flex items-center justify-center group-hover:bg-green-500 group-hover:border-green-400 transition-all duration-500 shadow-2xl backdrop-blur-md shrink-0"><MessageCircle size={20} className="sm:w-[22px] sm:h-[22px] md:w-8 md:h-8" /></div>
                <div>
                  <p className="text-[8px] md:text-[11px] text-zinc-500 uppercase tracking-[0.25em] font-black mb-0.5 sm:mb-1 md:mb-2">Instant Chat</p>
                  <a href={`https://wa.me/91${BRAND_PHONE}?text=${encodeURIComponent("Hi, I came across your website and would like to know more about your services.")}`} target="_blank" rel="noreferrer" className="text-sm sm:text-base md:text-3xl font-bold hover:text-green-400 transition-colors tracking-tight">WhatsApp Us</a>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={appleTransition}
            className="bg-[#0e0e10] p-5 sm:p-8 md:p-12 rounded-[1.75rem] md:rounded-[3.5rem] border border-white/10 shadow-[0_50px_120px_rgba(0,0,0,0.6)] relative overflow-hidden mt-2 lg:mt-0 flex flex-col justify-center w-full"
          >
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            <LeadQualificationForm />
          </motion.div>
        </div>
      </section>
    </>
  );
};

// Footer component provides essential branding and navigation links at the bottom of the page
const Footer = ({ 
  onViewChange, 
  onShowPrivacy, 
  onShowTerms 
}: { 
  onViewChange: (view: ViewType) => void, 
  onShowPrivacy: () => void, 
  onShowTerms: () => void 
}) => {
  return (
    <footer className="bg-white py-8 md:py-10 border-t border-gray-100 px-5 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Row: Logo on left, Large inline Social links on right */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 pb-6 md:pb-8">
          <Logo onClick={() => { onViewChange('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
          
          {/* Prominent Inline Social Links */}
          <div className="flex items-center gap-3 sm:gap-5 text-sm sm:text-base font-bold text-gray-800">
            <a 
              href={`https://instagram.com/${INSTAGRAM_HANDLE.replace('@', '')}`} 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex items-center gap-2 hover:text-blue-600 transition-all duration-200 hover:-translate-y-0.5 group"
            >
              <Instagram className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
              <span>Instagram</span>
            </a>
            <span className="text-gray-300 font-normal select-none">•</span>
            <a 
              href={`mailto:${BRAND_EMAIL}`} 
              className="inline-flex items-center gap-2 hover:text-blue-600 transition-all duration-200 hover:-translate-y-0.5 group"
            >
              <Mail className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
              <span>Email</span>
            </a>
            <span className="text-gray-300 font-normal select-none">•</span>
            <a 
              href={`https://wa.me/91${BRAND_PHONE}?text=${encodeURIComponent("Hi, I came across your website and would like to know more about your services.")}`} 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex items-center gap-2 hover:text-emerald-600 transition-all duration-200 hover:-translate-y-0.5 group"
            >
              <MessageCircle className="w-4 h-4 text-gray-500 group-hover:text-emerald-600 transition-colors" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
        
        {/* Thin Divider & Bottom Copyright / Legal Links Row */}
        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-gray-500 font-medium">
          <p className="text-gray-500 text-center sm:text-left">
            © 2026 GrowthWithHardik. Built with strategy, driven by results.
          </p>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={onShowPrivacy} 
              className="hover:text-black transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button 
              onClick={onShowTerms} 
              className="hover:text-black transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [view, setView] = useState<ViewType>('home');
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleViewChange = (newView: ViewType) => {
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      <Navbar activeView={view} onViewChange={handleViewChange} />
      <main>
        <AnimatePresence mode="wait">
          {view === 'home' ? (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <HomeView onViewServices={() => handleViewChange('services')} />
            </motion.div>
          ) : (
            <motion.div key="services" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ServicesPage onBack={() => handleViewChange('home')} />
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

      {/* Intelligent Lead Capture System with Exit Intent & Scroll/Time Triggers */}
      <SmartLeadCaptureModal />
    </div>
  );
}
