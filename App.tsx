
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
  MessageCircle
} from 'lucide-react';
import { 
  BRAND_NAME, 
  BRAND_EMAIL, 
  BRAND_PHONE, 
  INSTAGRAM_HANDLE, 
  SERVICES, 
  PRICING_PLANS, 
  PROCESS_STEPS,
  IconMap
} from './constants';
import { Service } from './types';

// Provided Brand Logo URL
const BRAND_LOGO_URL = "https://files.oaiusercontent.com/file-VnNsh23J9TjY4L8G9E9X5P?se=2025-01-30T10%3A58%3A23Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D73983262-e192-414e-9893-68f773347f3b.webp&sig=G06pD1y/yKkO7o2V5UvYp5/0y5P%2Bv4Kj5Y5UvYp5/0y5P%3D";

type ViewType = 'home' | 'services';

const appleTransition = { duration: 0.8, ease: [0.22, 1, 0.36, 1] };
const appleSpring = { type: "spring", stiffness: 100, damping: 20, mass: 1 };

const BrandLogoImage = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-10 h-10 p-1",
    md: "w-12 h-12 md:w-14 md:h-14 p-1.5",
    lg: "w-48 h-48 md:w-64 md:h-64 p-4 md:p-6"
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
    className="flex items-center gap-3 group cursor-pointer" 
    onClick={onClick}
  >
    <div className="transition-transform duration-500 group-hover:scale-105 active:scale-95">
      <BrandLogoImage size="md" />
    </div>
    <div className="flex flex-col justify-center">
      <span className="font-bold text-lg tracking-tight leading-none text-black">
        {BRAND_NAME}
      </span>
      <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black mt-1.5">Agency</span>
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

  const handleKitClick = () => {
    onViewChange('home');
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.querySelector('#contact');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'apple-blur border-b border-gray-200/50 py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
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
            onClick={handleKitClick}
            className="bg-black text-white px-6 py-3 rounded-full text-sm font-black hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-black/10"
          >
            Get Growth Kit
          </button>
        </div>

        <button 
          className="md:hidden p-2 text-gray-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-6 flex flex-col gap-6 md:hidden shadow-2xl"
          >
            {navLinks.map((link) => (
              <button 
                key={link.name} 
                className="text-2xl font-black text-gray-800 text-left"
                onClick={() => handleNavClick(link)}
              >
                {link.name}
              </button>
            ))}
            <button 
              className="bg-black text-white px-6 py-5 rounded-2xl text-center font-black text-xl"
              onClick={handleKitClick}
            >
              Get Growth Kit
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const ServicesPage = ({ onBack }: { onBack: () => void }) => {
  const handleServiceInquiry = () => {
    onBack();
    setTimeout(() => {
      const el = document.querySelector('#contact');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="pt-32 pb-24 px-6 min-h-screen bg-white"
    >
      <div className="max-w-7xl mx-auto">
        <motion.button 
          onClick={onBack}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="group flex items-center gap-2 text-gray-400 hover:text-black transition-colors font-bold mb-12"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Overview
        </motion.button>

        <div className="mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-blue-600 font-black tracking-[0.2em] uppercase text-xs mb-6 block"
          >
            Capabilities
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, ...appleTransition }}
            className="text-5xl md:text-8xl font-black tracking-tight mb-8 leading-[1.05]"
          >
            Premium Solutions <br /> for Modern Brands.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, ...appleTransition }}
            className="text-2xl text-gray-400 max-w-2xl font-medium"
          >
            Explore our ecosystem of high-performance growth services designed to scale your Instagram impact.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                className="group relative bg-gray-50 p-12 rounded-[3.5rem] border border-transparent hover:border-gray-100 hover:bg-white hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-default"
              >
                <motion.div 
                  className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-10 text-black group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm"
                  whileHover={{ rotate: 360, scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  <Icon size={32} />
                </motion.div>
                
                <h3 className="text-3xl font-black mb-4 tracking-tight group-hover:text-blue-600 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-500 leading-relaxed font-medium text-lg mb-8">
                  {service.description}
                </p>
                
                <div className="relative h-10 overflow-hidden">
                   <motion.button 
                    className="absolute inset-0 flex items-center gap-2 text-black font-black uppercase text-xs tracking-widest transition-all duration-300"
                    initial={{ y: 0, opacity: 1 }}
                    whileHover={{ y: -40, opacity: 0 }}
                    onClick={handleServiceInquiry}
                   >
                    Learn More <ChevronRight size={16} />
                  </motion.button>
                  
                  <motion.button 
                    onClick={handleServiceInquiry}
                    className="absolute inset-0 flex items-center justify-center bg-black text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all duration-500 transform translate-y-full group-hover:translate-y-0"
                  >
                    Get Info <ArrowUpRight size={16} className="ml-2" />
                  </motion.button>
                </div>

                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none">
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

const HomeView = ({ onViewServices }: { onViewServices: () => void }) => {
  const scrollToContact = () => {
    const el = document.querySelector('#contact');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <section className="relative pt-36 pb-20 md:pt-48 md:pb-40 overflow-hidden px-6">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-gray-50 border border-gray-100 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-10 text-gray-500"
          >
            <Sparkles size={16} className="text-blue-600" />
            <span>Scale your impact organically</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-8xl font-black tracking-tight mb-8 leading-[1.05]"
          >
            Grow your Instagram <br className="hidden md:block" />
            with <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">content & AI</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-14 leading-relaxed font-medium"
          >
            We help creators and modern brands improve their reach by <span className="text-black font-bold border-b-2 border-blue-500 pb-0.5">200%</span> using performance-driven design and strategy.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
          >
            <button 
              onClick={scrollToContact}
              className="group relative bg-black text-white px-12 py-5 rounded-full text-xl font-black overflow-hidden transition-all hover:bg-gray-900 shadow-2xl shadow-black/10 flex items-center gap-2"
            >
              Get Growth Kit
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
            </button>
            <button 
              onClick={onViewServices}
              className="px-10 py-5 rounded-full text-lg font-black text-gray-500 hover:text-black transition-colors inline-flex items-center gap-2"
            >
              Explore Services <ChevronRight size={20} />
            </button>
          </motion.div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-blue-50 rounded-full blur-[160px] opacity-40 animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-indigo-50 rounded-full blur-[160px] opacity-40 animate-pulse delay-700"></div>
        </div>
      </section>

      <section id="about" className="py-24 bg-gray-50 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 40 }} 
            whileInView={{ opacity: 1, scale: 1, y: 0 }} 
            viewport={{ once: true, margin: "-100px" }}
            transition={appleTransition}
            className="relative"
          >
            {/* Main Creative Visual */}
            <div className="relative z-10">
              <div className="absolute -inset-10 bg-blue-500/5 rounded-full blur-3xl animate-pulse -z-10"></div>
              
              <div className="relative group">
                <img 
                  src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?q=80&w=2070&auto=format&fit=crop" 
                  alt="Hardik" 
                  className="rounded-[3.5rem] shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-1000 w-full aspect-[4/5] object-cover border-8 border-white bg-white"
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
                  className="absolute -top-6 -right-6 bg-white/80 backdrop-blur-xl p-5 rounded-3xl shadow-xl border border-white/20 z-20 hidden sm:block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-600">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Reach Growth</p>
                      <p className="text-xl font-black text-gray-900">+248.5%</p>
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
                  className="absolute bottom-12 -left-8 bg-black/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/10 z-20 hidden sm:block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                      <UserCheck size={18} />
                    </div>
                    <p className="text-xs font-black text-white pr-2 uppercase tracking-widest">Verified Strategy</p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    ...appleTransition, 
                    delay: 0.9,
                    x: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                  }}
                  animate={{ x: [0, -5, 0] }}
                  className="absolute -bottom-4 right-10 bg-white p-4 rounded-2xl shadow-lg border border-gray-100 z-20 hidden sm:block"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></div>
                    <span className="text-[9px] font-black uppercase text-gray-400">Live Optimization</span>
                  </div>
                  <div className="flex items-end gap-1 h-8">
                    {[3, 6, 4, 8, 5, 9, 7].map((h, i) => (
                      <div key={i} className="w-1.5 bg-blue-600/20 rounded-t-sm" style={{ height: `${h * 10}%` }}></div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -z-10"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10"></div>
          </motion.div>
          
          <div className="space-y-8">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={appleTransition}
              className="text-blue-600 font-black tracking-[0.2em] uppercase text-xs mb-6 block"
            >
              The Person Behind The Growth
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...appleTransition, delay: 0.1 }}
              className="text-4xl md:text-6xl font-black mb-8 tracking-tight"
            >
              I bridge the gap between <br /> data and art.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...appleTransition, delay: 0.2 }}
              className="text-xl text-gray-600 mb-6 leading-relaxed font-medium"
            >
              I'm Hardik, a digital marketer obsessed with results. My approach isn't just about pretty visuals; it's about performance-driven strategy that drives real growth.
            </motion.p>
            <div className="grid grid-cols-2 gap-10 mt-12">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                whileInView={{ opacity: 1, scale: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ delay: 0.3, ...appleTransition }}
                className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100"
              >
                <div className="text-5xl font-black text-black mb-1"><Counter target={100} suffix="+" /></div>
                <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Global Brands</div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                whileInView={{ opacity: 1, scale: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ delay: 0.4, ...appleTransition }}
                className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100"
              >
                <div className="text-5xl font-black text-black mb-1"><Counter target={200} suffix="%" /></div>
                <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Avg. Reach Leap</div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section id="process" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24 text-center md:text-left">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={appleTransition}
              className="text-4xl md:text-7xl font-black tracking-tight mb-8"
            >
              Our systematic leap.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, ...appleTransition }}
              className="text-2xl text-gray-500 max-w-2xl font-medium"
            >
              From first audit to market dominance, we follow a rigorous path to success.
            </motion.p>
          </div>
          <div className="grid md:grid-cols-4 gap-16">
            {PROCESS_STEPS.map((step, idx) => (
              <div key={idx} className="relative group">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: idx * 0.1, ...appleTransition }}
                  className="text-7xl md:text-9xl font-black text-gray-50 mb-8 transition-colors group-hover:text-blue-50/50"
                >
                  {step.number}
                </motion.div>
                <motion.h3 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (idx * 0.1) + 0.2, ...appleTransition }}
                  className="text-3xl font-black mb-5 tracking-tight"
                >
                  {step.title}
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (idx * 0.1) + 0.3, ...appleTransition }}
                  className="text-gray-500 leading-relaxed font-medium text-lg"
                >
                  {step.description}
                </motion.p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={appleTransition}
              className="text-4xl md:text-6xl font-black tracking-tight mb-6"
            >
              Simple, transparent pricing.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, ...appleTransition }}
              className="text-xl text-gray-500 max-w-xl mx-auto font-medium"
            >
              Choose the plan that fits your current stage of growth
            </motion.p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {PRICING_PLANS.map((plan, idx) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, ...appleTransition }}
                whileHover={{ y: -8, scale: plan.highlighted ? 1.04 : 1.02 }}
                className={`relative flex flex-col p-10 rounded-[3.5rem] border transition-all duration-500 ${
                  plan.highlighted 
                    ? 'bg-zinc-950 border-white/10 shadow-[0_40px_80px_-15px_rgba(59,130,246,0.25)] text-white z-10 scale-[1.02] ring-1 ring-white/5' 
                    : 'bg-white border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] text-gray-900'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.2em] shadow-xl shadow-blue-500/30 whitespace-nowrap">
                    Recommended Choice
                  </div>
                )}
                <div className="mb-10">
                  <h3 className={`text-2xl font-black mb-2 tracking-tight ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                  <p className={`text-sm font-medium leading-relaxed ${plan.highlighted ? 'text-gray-400' : 'text-gray-500'}`}>{plan.description}</p>
                </div>
                
                <ul className="space-y-6 mb-12 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${plan.highlighted ? 'bg-blue-600/20 text-blue-400' : 'bg-gray-100 text-gray-500'}`}>
                        <Check size={14} strokeWidth={3} />
                      </div>
                      <span className={`text-sm font-semibold leading-relaxed ${plan.highlighted ? 'text-gray-200' : 'text-gray-600'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={scrollToContact}
                  className={`block w-full text-center py-5 rounded-2xl font-black transition-all text-sm tracking-widest uppercase active:scale-[0.98] ${
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
          <div className="mt-20 text-center">
            <p className="text-sm text-gray-400 font-medium max-w-sm mx-auto">All plans include regular performance updates and strategic refinements tailored to your brand.</p>
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 bg-black text-white px-6 overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 md:gap-24 relative z-10 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={appleTransition}
          >
            <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[0.95]">Ready to <br /> scale?</h2>
            <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-md font-medium leading-relaxed">Book your free growth audit. We'll analyze your brand and provide a 3-month roadmap for dominance.</p>
            <div className="space-y-10">
              <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-500 shadow-lg backdrop-blur-md"><Mail size={28} /></div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black mb-1">Direct Line</p>
                  <a href={`mailto:${BRAND_EMAIL}`} className="text-2xl font-bold hover:text-blue-400 transition-colors tracking-tight">{BRAND_EMAIL}</a>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-500 shadow-lg backdrop-blur-md"><Instagram size={28} /></div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black mb-1">Social Feed</p>
                  <a href={`https://instagram.com/${INSTAGRAM_HANDLE.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-2xl font-bold hover:text-blue-400 transition-colors tracking-tight">{INSTAGRAM_HANDLE}</a>
                </div>
              </div>
              {/* Added WhatsApp Direct Message Block */}
              <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-green-500 group-hover:border-green-400 transition-all duration-500 shadow-lg backdrop-blur-md"><MessageCircle size={28} /></div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black mb-1">Instant Chat</p>
                  <a href={`https://wa.me/91${BRAND_PHONE}`} target="_blank" rel="noreferrer" className="text-2xl font-bold hover:text-green-400 transition-colors tracking-tight">WhatsApp Us</a>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={appleTransition}
            className="bg-[#1c1c1e] p-8 md:p-14 rounded-[3.5rem] border border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.4)] relative overflow-hidden"
          >
            {/* Subtle light leak for depth */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]"></div>
            
            <form action="https://formspree.io/f/xnjqwnkb" method="POST" className="space-y-8 relative z-10">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Identity</label>
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Hardik Jain" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all text-lg font-bold placeholder:text-white/10" 
                    required 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="growth@example.com" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all text-lg font-bold placeholder:text-white/10" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Current Goal</label>
                <select name="service" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all text-lg font-bold text-white/40 appearance-none cursor-pointer">
                  <option value="" disabled selected>Select a service</option>
                  <option value="smm" className="bg-[#1c1c1e] text-white">Social Media Management</option>
                  <option value="video" className="bg-[#1c1c1e] text-white">Video Editing</option>
                  <option value="design" className="bg-[#1c1c1e] text-white">Graphic Designing</option>
                  <option value="ai" className="bg-[#1c1c1e] text-white">AI Automation</option>
                  <option value="content" className="bg-[#1c1c1e] text-white">Content Strategy</option>
                  <option value="web" className="bg-[#1c1c1e] text-white">Web Designing</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Project Brief</label>
                <textarea 
                  name="message"
                  rows={4} 
                  placeholder="Tell us about your brand vision..." 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all text-lg font-bold placeholder:text-white/10 resize-none" 
                  required
                ></textarea>
              </div>

              <motion.button 
                type="submit" 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white text-black hover:bg-gray-100 font-black py-6 rounded-2xl transition-all flex items-center justify-center gap-3 text-xl shadow-xl shadow-white/5"
              >
                Send Message <ArrowUpRight size={26} />
              </motion.button>
              
              <p className="text-center text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-4">Typical response time: <span className="text-white">5 mins</span></p>
            </form>
          </motion.div>
        </div>
      </section>
    </>
  );
};

const Footer = ({ onViewChange }: { onViewChange: (view: ViewType) => void }) => (
  <footer className="py-24 border-t border-gray-100 px-6 bg-white">
    <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-20">
      <div className="md:col-span-2">
        <div className="mb-12"><Logo onClick={() => { onViewChange('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} /></div>
        <p className="text-gray-500 text-xl max-w-sm leading-relaxed mb-12 font-medium">
          Premium digital solutions for standard creators. We build brands that convert followers into customers.
        </p>
        <div className="flex gap-8">
          <a href={`https://instagram.com/${INSTAGRAM_HANDLE.replace('@', '')}`} target="_blank" rel="noreferrer" className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm"><Instagram size={32} /></a>
          <a href={`mailto:${BRAND_EMAIL}`} className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm"><Mail size={32} /></a>
        </div>
      </div>
      <div>
        <h4 className="font-black mb-10 uppercase tracking-[0.2em] text-[10px] text-gray-400">Company</h4>
        <ul className="space-y-6">
          <li><button onClick={() => { onViewChange('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-xl font-bold text-gray-600 hover:text-black">Services</button></li>
          <li><a href="#pricing" className="text-xl font-bold text-gray-600 hover:text-black">Pricing</a></li>
          <li><a href="#about" className="text-xl font-bold text-gray-600 hover:text-black">About</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-black mb-10 uppercase tracking-[0.2em] text-[10px] text-gray-400">Legal</h4>
        <ul className="space-y-6">
          <li><a href="#" className="text-xl font-bold text-gray-600 hover:text-black">Privacy</a></li>
          <li><a href="#" className="text-xl font-bold text-gray-600 hover:text-black">Terms</a></li>
        </ul>
        <div className="mt-20 text-gray-400 text-sm font-black uppercase tracking-widest">© {new Date().getFullYear()} Growth Studio.</div>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [view, setView] = useState<ViewType>('home');

  const handleViewChange = (newView: ViewType) => {
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
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
      <Footer onViewChange={handleViewChange} />
    </div>
  );
}
