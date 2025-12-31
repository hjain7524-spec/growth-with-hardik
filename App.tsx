import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, animate, useMotionValue, useTransform } from 'framer-motion';
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
  TrendingUp,
  BarChart3,
  UserCheck,
  MessageCircle,
  Smartphone,
  AtSign,
  MoveHorizontal,
  Users
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

// Provided Brand Logo URL
const BRAND_LOGO_URL = "https://files.oaiusercontent.com/file-VnNsh23J9TjY4L8G9E9X5P?se=2025-01-30T10%3A58%3A23Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D73983262-e192-414e-9893-68f773347f3b.webp&sig=G06pD1y/yKkO7o2V5UvYp5/0y5P%2Bv4Kj5Y5UvYp5/0y5P%3D";

type ViewType = 'home' | 'services';

// Fixed cubic-bezier easing type by casting to explicit tuple of 4 numbers
const appleTransition = { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };
const appleSpring = { type: "spring", stiffness: 100, damping: 20, mass: 1 };

const BrandLogoImage = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-8 h-8 md:w-10 md:h-10 p-1",
    md: "w-10 h-10 md:w-14 md:h-14 p-1.5",
    lg: "w-32 h-32 md:w-64 md:h-64 p-4 md:p-6"
  };

  return (
    <div className={`${sizeClasses[size]} relative rounded-full border border-gray-100 bg-white overflow-hidden shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center`}>
      <img 
        src={BRAND_LOGO_URL} 
        alt={BRAND_NAME} 
        className="relative z-10 w-full h-full object-contain"
        onError={(e) => {
          e.currentTarget.src = `https://ui-avatars.com/api/?name=H&background=000&color=fff&size=512`;
        }}
      />
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
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
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
    { name: 'About', href: '#about', view: 'home' as ViewType },
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'apple-blur border-b border-gray-200/50 py-2 md:py-2' : 'bg-transparent py-4 md:py-4'}`}>
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
                whileHover={{ y: -8 }}
                className="group relative bg-gray-50 p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border border-transparent hover:border-gray-100 hover:bg-white hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-default flex flex-col"
              >
                <motion.div 
                  className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-10 text-black group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm"
                  whileHover={{ rotate: 360, scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
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

                <div className="absolute top-0 right-0 p-6 md:p-8 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none hidden md:block">
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
  
  const handleAuditClick = () => {
    const message = encodeURIComponent("Hi, I’m interested in a free growth audit for my brand.");
    window.open(`https://wa.me/91${BRAND_PHONE}?text=${message}`, '_blank');
  };

  const scrollToContact = () => {
    const el = document.querySelector('#contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      // Focus the first input after a short delay to allow scroll to complete
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
    const gap = 24; // Updated mobile gap
    const index = Math.round(scrollPosition / (itemWidth + gap));
    setter(index);
  };

  return (
    <>
      <section className="relative pt-24 pb-12 md:pt-48 md:pb-40 overflow-hidden px-5 md:px-6">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 md:px-5 py-2 rounded-full text-[9px] md:text-xs font-black uppercase tracking-widest mb-6 md:mb-10 text-gray-500"
          >
            <Sparkles size={14} className="text-blue-600" />
            <span>Scale your impact organically</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-8xl font-black tracking-tight mb-5 md:mb-8 leading-[1.1] md:leading-[1.05]"
          >
            Grow your Instagram <br className="hidden md:block" />
            with <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">content & AI</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm md:text-2xl text-gray-400 max-w-2xl mx-auto mb-8 md:mb-14 leading-relaxed font-medium px-2 md:px-0"
          >
            We help creators and modern brands improve their reach by <span className="text-black font-bold border-b-2 border-blue-500 pb-0.5">200%</span> using performance-driven strategy.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-5 justify-center items-center"
          >
            <button 
              onClick={handleAuditClick}
              className="w-full sm:w-auto group relative bg-black text-white px-8 md:px-12 py-4 md:py-5 rounded-full text-base md:text-xl font-black overflow-hidden transition-all hover:bg-gray-900 shadow-xl shadow-black/10 flex items-center justify-center gap-2 active:scale-95 touch-manipulation"
            >
              Free Growth Audit
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            <button 
              onClick={onViewServices}
              className="w-full sm:w-auto px-8 py-3 md:py-5 rounded-full text-sm md:text-lg font-black text-gray-500 hover:text-black transition-colors inline-flex items-center justify-center gap-2 active:scale-95 touch-manipulation"
            >
              Explore Services <ChevronRight size={16} />
            </button>
          </motion.div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[200px] md:w-[700px] h-[200px] md:h-[700px] bg-blue-50 rounded-full blur-[60px] md:blur-[160px] opacity-40 animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-[200px] md:w-[700px] h-[200px] md:h-[700px] bg-indigo-50 rounded-full blur-[60px] md:blur-[160px] opacity-40 animate-pulse delay-700"></div>
        </div>
      </section>

      <section id="about" className="py-12 md:py-24 bg-gray-50 px-5 md:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 md:gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 40 }} 
            whileInView={{ opacity: 1, scale: 1, y: 0 }} 
            viewport={{ once: true, margin: "-100px" }}
            transition={appleTransition}
            className="relative"
          >
            <div className="relative z-10">
              <div className="absolute -inset-10 bg-blue-500/5 rounded-full blur-3xl animate-pulse -z-10"></div>
              
              <div className="relative group">
                <img 
                  src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?q=80&w=2070&auto=format&fit=crop" 
                  alt="Hardik" 
                  className="rounded-[2rem] md:rounded-[3.5rem] shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-1000 w-full aspect-[4/5] object-cover border-4 md:border-8 border-white bg-white"
                />
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, x: 20 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    ...appleTransition, 
                    delay: 0.5,
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }}
                  animate={{ y: [0, -10, 0] }}
                  className="absolute -top-3 -right-1 md:-top-6 md:-right-6 bg-white/80 backdrop-blur-xl p-3 md:p-5 rounded-xl md:rounded-3xl shadow-xl border border-white/20 z-20"
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-7 h-7 md:w-10 md:h-10 bg-green-500/10 rounded-lg md:rounded-xl flex items-center justify-center text-green-600">
                      <TrendingUp size={16} />
                    </div>
                    <div>
                      <p className="text-[7px] md:text-[10px] text-gray-500 uppercase tracking-widest font-black leading-none">Reach Growth</p>
                      <p className="text-base md:text-xl font-black text-gray-900">+248.5%</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, x: -20 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    ...appleTransition, 
                    delay: 0.7,
                    y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }
                  }}
                  animate={{ y: [0, 10, 0] }}
                  className="absolute bottom-6 -left-3 md:bottom-12 md:-left-8 bg-black/90 backdrop-blur-xl p-2.5 md:p-4 rounded-lg md:rounded-2xl shadow-2xl border border-white/10 z-20"
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                      <UserCheck size={14} />
                    </div>
                    <p className="text-[8px] md:text-xs font-black text-white pr-1 md:pr-2 uppercase tracking-widest">Verified Strategy</p>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="absolute top-0 right-0 -mr-8 md:-mr-16 -mt-8 md:-mt-16 w-24 md:w-64 h-24 md:h-64 bg-blue-50 rounded-full blur-2xl md:blur-3xl opacity-50 -z-10"></div>
            <div className="absolute bottom-0 left-0 -ml-8 md:-ml-16 -mb-8 md:-mb-16 w-24 md:w-64 h-24 md:h-64 bg-indigo-50 rounded-full blur-2xl md:blur-3xl opacity-50 -z-10"></div>
          </motion.div>
          
          <div className="space-y-5 md:space-y-8 mt-2 md:mt-0">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={appleTransition}
              className="text-blue-600 font-black tracking-[0.2em] uppercase text-[9px] md:text-xs block"
            >
              The Philosophy
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...appleTransition, delay: 0.1 }}
              className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]"
            >
              We turn attention into revenue.
            </motion.h2>
            <div className="space-y-4 md:space-y-6">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...appleTransition, delay: 0.2 }}
                className="text-base md:text-xl text-gray-700 leading-relaxed font-medium"
              >
                <strong>Growth with Hardik</strong> is a digital growth studio helping creators, founders, and online brands turn attention into revenue. We focus on building clear positioning, conversion-focused content, and systems that scale.
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...appleTransition, delay: 0.3 }}
                className="text-base md:text-xl text-gray-500 leading-relaxed font-medium"
              >
                Every project starts with understanding your goals. Then we design digital assets that don’t just look premium, but perform. Built for creators who want clarity, consistency, and real outcomes.
              </motion.p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:gap-10 mt-6 md:mt-12">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                whileInView={{ opacity: 1, scale: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ delay: 0.4, ...appleTransition }}
                className="group bg-white p-5 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Users size={80} />
                </div>
                <div className="relative z-10">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                    <Users size={24} />
                  </div>
                  <div className="text-3xl md:text-6xl font-black text-black mb-1 leading-none tracking-tighter">
                    <Counter target={100} suffix="+" />
                  </div>
                  <div className="text-gray-400 text-[8px] md:text-[11px] font-black uppercase tracking-[0.2em]">Global Brands</div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                whileInView={{ opacity: 1, scale: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ delay: 0.5, ...appleTransition }}
                className="group bg-white p-5 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <BarChart3 size={80} />
                </div>
                <div className="relative z-10">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
                    <BarChart3 size={24} />
                  </div>
                  <div className="text-3xl md:text-6xl font-black text-black mb-1 leading-none tracking-tighter">
                    <Counter target={200} suffix="%" />
                  </div>
                  <div className="text-gray-400 text-[8px] md:text-[11px] font-black uppercase tracking-[0.2em]">Avg. Reach Leap</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section id="process" className="py-12 md:py-24 px-5 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 md:mb-24 text-center md:text-left">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={appleTransition}
              className="text-3xl md:text-7xl font-black tracking-tight mb-3 md:mb-8"
            >
              Our systematic leap.
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, ...appleTransition }}
              className="flex items-center justify-center md:justify-start gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest md:hidden mb-2"
            >
              <MoveHorizontal size={14} /> <span>Swipe to explore</span>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, ...appleTransition }}
              className="hidden md:block text-lg md:text-2xl text-gray-500 max-w-2xl font-medium"
            >
              From first audit to market dominance, we follow a rigorous path to success.
            </motion.p>
          </div>
          <div className="relative">
            <CarouselFadeOverlay />
            <div 
              className="flex md:grid md:grid-cols-4 gap-6 md:gap-16 overflow-x-auto snap-x snap-mandatory md:snap-none no-scrollbar -mx-5 px-5 md:mx-0 md:px-0 pb-4 md:pb-0"
              onScroll={(e) => handleScrollProgress(e, setActiveProcessIdx)}
            >
              {PROCESS_STEPS.map((step, idx) => (
                <div key={idx} className="relative group flex-shrink-0 w-[75vw] md:w-auto snap-center">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: idx * 0.1, ...appleTransition }}
                    className="text-5xl md:text-9xl font-black text-black/[0.05] mb-3 md:mb-8 transition-colors group-hover:text-blue-50/50 leading-none"
                  >
                    {step.number}
                  </motion.div>
                  <motion.h3 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (idx * 0.1) + 0.2, ...appleTransition }}
                    className="text-xl md:text-3xl font-black mb-2 md:mb-5 tracking-tight"
                  >
                    {step.title}
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (idx * 0.1) + 0.3, ...appleTransition }}
                    className="text-gray-500 leading-relaxed font-medium text-sm md:text-lg"
                  >
                    {step.description}
                  </motion.p>
                </div>
              ))}
            </div>
          </div>
          {/* Mobile Dot Indicators */}
          <div className="flex justify-center gap-1.5 mt-6 md:hidden">
            {PROCESS_STEPS.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-300 ${activeProcessIdx === i ? 'w-5 bg-blue-600' : 'w-1 bg-gray-200'}`} />
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-12 md:py-24 bg-white px-5 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={appleTransition}
              className="text-3xl md:text-6xl font-black tracking-tight mb-3 md:mb-6"
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
              Choose the plan that fits your current growth stage.
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
                  className={`relative flex flex-col p-7 md:p-10 rounded-[2rem] md:rounded-[3.5rem] border transition-all duration-500 flex-shrink-0 w-[82vw] md:w-auto snap-center ${
                    plan.highlighted 
                      ? 'bg-zinc-950 border-white/10 shadow-[0_40px_80px_-15px_rgba(59,130,246,0.25)] text-white z-10 md:scale-[1.02] ring-1 ring-white/5' 
                      : 'bg-white border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] text-gray-900'
                  }`}
                >
                  {/* Desktop/Tablet Floating Pill */}
                  {plan.highlighted && (
                    <div className="hidden md:block absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] md:text-[10px] font-black px-4 md:px-5 py-1.5 md:py-2 rounded-full uppercase tracking-[0.2em] shadow-xl shadow-blue-500/30 whitespace-nowrap">
                      Recommended Choice
                    </div>
                  )}
                  <div className="mb-6 md:mb-10">
                    {/* Mobile Inline Pill */}
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
                        <span className={`text-xs md:text-base font-semibold leading-relaxed ${plan.highlighted ? 'text-gray-200' : 'text-gray-600'}`}>{feature}</span>
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
                    Start Growing
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
          {/* Mobile Dot Indicators */}
          <div className="flex justify-center gap-1.5 mt-2 md:hidden">
            {PRICING_PLANS.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-300 ${activePricingIdx === i ? 'w-5 bg-blue-600' : 'w-1 bg-gray-200'}`} />
            ))}
          </div>
          <div className="mt-8 md:mt-20 text-center">
            <p className="text-[10px] md:text-sm text-gray-400 font-medium max-w-[240px] md:max-w-sm mx-auto">All plans include regular performance updates and strategy refinements.</p>
          </div>
        </div>
      </section>

      <section id="feedback" className="py-12 md:py-24 bg-gray-50 px-5 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 md:mb-20 text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={appleTransition}
              className="text-3xl md:text-6xl font-black tracking-tight mb-3"
            >
              Client Feedback.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, ...appleTransition }}
              className="text-base md:text-xl text-gray-500 font-medium"
            >
              Direct outcomes from modern brands and creators.
            </motion.p>
          </div>
          <div className="relative">
            <CarouselFadeOverlay />
            <div 
              className="flex md:grid md:grid-cols-2 gap-5 md:gap-8 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none no-scrollbar -mx-5 px-5 md:mx-0 md:px-0 pb-6 md:pb-0"
              onScroll={(e) => handleScrollProgress(e, setActiveFeedbackIdx)}
            >
              {TESTIMONIALS.map((testimonial, idx) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, ...appleTransition }}
                  className="bg-white p-7 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-gray-100 shadow-sm flex flex-col justify-between flex-shrink-0 w-[85vw] md:w-auto snap-center"
                >
                  <p className="text-base md:text-2xl font-semibold text-gray-900 leading-relaxed mb-6 md:mb-8 italic">
                    “{testimonial.content}”
                  </p>
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-9 h-9 md:w-12 md:h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                      <UserCheck size={18} />
                    </div>
                    <div>
                      <h4 className="font-black text-xs md:text-base tracking-tight">{testimonial.author}</h4>
                      <p className="text-[9px] md:text-sm text-gray-400 font-bold uppercase tracking-widest mt-0.5">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          {/* Mobile Dot Indicators */}
          <div className="flex justify-center gap-1.5 mt-3 md:hidden">
            {TESTIMONIALS.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-300 ${activeFeedbackIdx === i ? 'w-5 bg-blue-600' : 'w-1 bg-gray-200'}`} />
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 md:py-32 bg-black text-white px-5 md:px-6 overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 lg:gap-32 relative z-10 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={appleTransition}
            className="md:sticky md:top-32 mb-16 lg:mb-0"
          >
            <h2 className="text-4xl md:text-7xl font-black tracking-tight mb-6 md:mb-10 leading-[1.1] md:leading-[0.95]">Ready to <br className="hidden md:block" /> scale?</h2>
            <p className="text-base md:text-xl text-gray-400 mb-10 md:mb-16 max-w-md font-medium leading-relaxed">Book your free growth audit. We'll provide a 3-month roadmap for dominance.</p>
            <div className="grid grid-cols-1 gap-8 md:gap-10">
              <div className="flex items-center gap-4 md:gap-8 group">
                <div className="w-12 h-12 md:w-20 md:h-20 bg-white/5 border border-white/10 rounded-xl md:rounded-3xl flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-500 shadow-2xl backdrop-blur-md shrink-0"><Mail size={24} className="md:w-8 md:h-8" /></div>
                <div>
                  <p className="text-[8px] md:text-[11px] text-gray-500 uppercase tracking-[0.25em] font-black mb-1 md:mb-2">Direct Line</p>
                  <a href={`mailto:${BRAND_EMAIL}`} className="text-base md:text-3xl font-bold hover:text-blue-400 transition-colors tracking-tight truncate max-w-[220px] md:max-w-none block">{BRAND_EMAIL}</a>
                </div>
              </div>
              <div className="flex items-center gap-4 md:gap-8 group">
                <div className="w-12 h-12 md:w-20 md:h-20 bg-white/5 border border-white/10 rounded-xl md:rounded-3xl flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-500 shadow-2xl backdrop-blur-md shrink-0"><Instagram size={24} className="md:w-8 md:h-8" /></div>
                <div>
                  <p className="text-[8px] md:text-[11px] text-gray-500 uppercase tracking-[0.25em] font-black mb-1 md:mb-2">Social Feed</p>
                  <a href={`https://instagram.com/${INSTAGRAM_HANDLE.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-base md:text-3xl font-bold hover:text-blue-400 transition-colors tracking-tight">{INSTAGRAM_HANDLE}</a>
                </div>
              </div>
              <div className="flex items-center gap-4 md:gap-8 group">
                <div className="w-12 h-12 md:w-20 md:h-20 bg-white/5 border border-white/10 rounded-xl md:rounded-3xl flex items-center justify-center group-hover:bg-green-500 group-hover:border-green-400 transition-all duration-500 shadow-2xl backdrop-blur-md shrink-0"><MessageCircle size={24} className="md:w-8 md:h-8" /></div>
                <div>
                  <p className="text-[8px] md:text-[11px] text-gray-500 uppercase tracking-[0.25em] font-black mb-1 md:mb-2">Instant Chat</p>
                  <a href={`https://wa.me/91${BRAND_PHONE}`} target="_blank" rel="noreferrer" className="text-base md:text-3xl font-bold hover:text-green-400 transition-colors tracking-tight">WhatsApp Us</a>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={appleTransition}
            className="bg-[#0e0e10] p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] border border-white/5 shadow-[0_50px_120px_rgba(0,0,0,0.6)] relative overflow-hidden mt-6 lg:mt-0 flex flex-col justify-center"
          >
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]"></div>
            
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form 
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-8 md:space-y-10 relative z-10 w-full"
                >
                  <div className="grid md:grid-cols-2 gap-8 md:gap-10">
                    <div className="space-y-3 md:space-y-4">
                      <label className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.25em] text-zinc-500 ml-1">Full Name</label>
                      <input 
                        type="text" 
                        name="name"
                        placeholder="Hardik Jain" 
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl md:rounded-[1.5rem] px-6 md:px-8 py-4 md:py-5 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/20 transition-all text-sm md:text-lg font-bold placeholder:text-zinc-700" 
                        required 
                      />
                    </div>
                    <div className="space-y-3 md:space-y-4">
                      <label className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.25em] text-zinc-500 ml-1">Phone Number</label>
                      <div className="relative">
                        <Smartphone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" />
                        <input 
                          type="tel" 
                          name="phone"
                          placeholder="74550 67426" 
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl md:rounded-[1.5rem] pl-14 md:pl-16 pr-6 md:pr-8 py-4 md:py-5 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/20 transition-all text-sm md:text-lg font-bold placeholder:text-zinc-700" 
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 md:gap-10">
                    <div className="space-y-3 md:space-y-4">
                      <label className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.25em] text-zinc-500 ml-1">Instagram Handle</label>
                      <div className="relative">
                        <AtSign size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" />
                        <input 
                          type="text" 
                          name="instagram"
                          placeholder="growthwithhardik" 
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl md:rounded-[1.5rem] pl-14 md:pl-16 pr-6 md:pr-8 py-4 md:py-5 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/20 transition-all text-sm md:text-lg font-bold placeholder:text-zinc-700" 
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-3 md:space-y-4">
                      <label className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.25em] text-zinc-500 ml-1">Current Goal</label>
                      <div className="relative">
                        <select 
                          name="goal" 
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl md:rounded-[1.5rem] px-6 md:px-8 py-4 md:py-5 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/20 transition-all text-sm md:text-lg font-bold text-white appearance-none cursor-pointer"
                          required
                        >
                          <option value="" disabled selected className="text-zinc-600">Select objective</option>
                          <option value="organic" className="bg-[#0e0e10] text-white">Organic Reach Growth</option>
                          <option value="content" className="bg-[#0e0e10] text-white">High-Level Content Production</option>
                          <option value="brand" className="bg-[#0e0e10] text-white">Full Brand Refinement</option>
                          <option value="sales" className="bg-[#0e0e10] text-white">Direct Sales & Conversion</option>
                          <option value="automation" className="bg-[#0e0e10] text-white">AI Scale & Automation</option>
                        </select>
                        <ChevronRight size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600 rotate-90 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 md:pt-8">
                    <motion.button 
                      type="submit" 
                      whileHover={{ scale: 1.02, backgroundColor: '#f1f5f9' }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-white text-black font-black py-5 md:py-7 rounded-2xl md:rounded-[2rem] transition-all flex items-center justify-center gap-3 text-lg md:text-2xl shadow-2xl shadow-white/5 tracking-tight touch-manipulation"
                    >
                      Send Message <ArrowUpRight size={22} className="md:w-7 md:h-7" />
                    </motion.button>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Typical response: <span className="text-white">5 mins</span></p>
                  </div>
                </motion.form>
              ) : (
                <motion.div 
                  key="thank-you"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={appleTransition}
                  className="text-center space-y-8 md:space-y-12 py-10"
                >
                  <div className="relative mx-auto w-24 h-24 md:w-32 md:h-32">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                      className="w-full h-full bg-blue-600 rounded-full flex items-center justify-center shadow-[0_20px_60px_rgba(37,99,235,0.4)]"
                    >
                      <Check size={48} className="text-white md:w-16 md:h-16" strokeWidth={3} />
                    </motion.div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-3xl md:text-5xl font-black tracking-tight text-white">Success.</h3>
                    <p className="text-zinc-400 text-lg md:text-2xl max-w-xs mx-auto font-medium">We'll be in touch shortly.</p>
                  </div>
                  
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="text-blue-500 font-black uppercase text-xs md:text-sm tracking-widest hover:text-blue-400 transition-colors flex items-center gap-2 mx-auto touch-manipulation"
                  >
                    Send another inquiry <ArrowRight size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </>
  );
};

const Footer = ({ onViewChange, onShowPrivacy, onShowTerms }: { onViewChange: (view: ViewType) => void, onShowPrivacy: () => void, onShowTerms: () => void }) => {
  const handleNavClick = (view: ViewType, href?: string) => {
    onViewChange(view);
    if (href) {
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          if (href === '#contact') {
            setTimeout(() => {
              const input = document.querySelector('input[name="name"]') as HTMLInputElement;
              input?.focus({ preventScroll: true });
            }, 800);
          }
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="py-12 md:py-24 border-t border-gray-100 px-5 md:px-6 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-20">
        <div className="md:col-span-2">
          <div className="mb-6 md:mb-12"><Logo onClick={() => { onViewChange('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} /></div>
          <p className="text-gray-500 text-base md:text-xl max-w-sm leading-relaxed mb-8 md:mb-12 font-medium">
            Premium digital solutions for standard creators. Building brands that convert followers into customers.
          </p>
          <div className="flex gap-4 md:gap-8">
            <a href={`https://instagram.com/${INSTAGRAM_HANDLE.replace('@', '')}`} target="_blank" rel="noreferrer" className="w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm touch-manipulation"><Instagram size={22} className="md:w-8 md:h-8" /></a>
            <a href={`mailto:${BRAND_EMAIL}`} className="w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm touch-manipulation"><Mail size={22} className="md:w-8 md:h-8" /></a>
          </div>
        </div>
        <div className="grid grid-cols-2 md:block gap-8">
          <div>
            <h4 className="font-black mb-5 md:mb-10 uppercase tracking-[0.2em] text-[8px] md:text-[10px] text-gray-400">Company</h4>
            <ul className="space-y-3 md:space-y-6">
              <li><button onClick={() => handleNavClick('services')} className="text-base md:text-xl font-bold text-gray-600 hover:text-black text-left touch-manipulation">Services</button></li>
              <li><button onClick={() => handleNavClick('home', '#pricing')} className="text-base md:text-xl font-bold text-gray-600 hover:text-black text-left touch-manipulation">Pricing</button></li>
              <li><button onClick={() => handleNavClick('home', '#about')} className="text-base md:text-xl font-bold text-gray-600 hover:text-black text-left touch-manipulation">About</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-5 md:mb-10 uppercase tracking-[0.2em] text-[8px] md:text-[10px] text-gray-400">Legal</h4>
            <ul className="space-y-3 md:space-y-6">
              <li><button onClick={onShowPrivacy} className="text-base md:text-xl font-bold text-gray-600 hover:text-black text-left touch-manipulation">Privacy Policy</button></li>
              <li><button onClick={onShowTerms} className="text-base md:text-xl font-bold text-gray-600 hover:text-black text-left touch-manipulation">Terms & Conditions</button></li>
            </ul>
          </div>
        </div>
        <div className="pt-6 md:pt-0 border-t md:border-t-0 border-gray-100 flex flex-col justify-end">
          <div className="text-gray-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest">© {new Date().getFullYear()} Growth Studio.</div>
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
    </div>
  );
}
