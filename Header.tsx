import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';
import { trackGrowthAuditClick, trackWhatsAppClick } from './analytics';
import { Logo } from './BrandLogo';
import { WHATSAPP_URL } from './constants';
import { WhatsAppIcon } from './WhatsAppIcon';

export type ViewType = 'home' | 'services';

interface HeaderProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  onRequestAudit: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onViewChange,
  onRequestAudit,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { label: 'Services', view: 'services' as ViewType, href: undefined },
    { label: 'Pricing', view: 'home' as ViewType, href: '#pricing' },
    { label: 'Process', view: 'home' as ViewType, href: '#process' },
  ];

  const handleNavItemClick = (item: typeof navItems[0]) => {
    setIsMobileMenuOpen(false);

    if (item.view === 'services') {
      onViewChange('services');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (item.view === 'home') {
      if (activeView !== 'home') {
        onViewChange('home');
      }

      if (item.href) {
        setTimeout(() => {
          const target = document.querySelector(item.href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }, 120);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleAuditClick = (source: string) => {
    setIsMobileMenuOpen(false);
    trackGrowthAuditClick(source, 'Free Growth Audit');
    onRequestAudit();
  };

  const handleLogoClick = () => {
    setIsMobileMenuOpen(false);
    onViewChange('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 bg-[#080808]/95 backdrop-blur-md text-white transition-all duration-200 border-b ${
          isScrolled ? 'border-[#292929] shadow-xs' : 'border-[#292929]/80'
        }`}
      >
        <div className="max-w-[1200px] w-full mx-auto px-5 sm:px-6 md:px-8 h-[64px] sm:h-[72px] flex items-center justify-between">
          {/* Left: Original Brand Logo Asset */}
          <Logo onClick={handleLogoClick} isDark={true} />

          {/* Navigation Links: Centered/Right */}
          <div className="hidden md:flex items-center gap-7 lg:gap-8">
            <nav className="flex items-center gap-6 lg:gap-7" aria-label="Main Navigation">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavItemClick(item)}
                  className={`text-[14px] font-medium tracking-tight transition-colors cursor-pointer select-none ${
                    activeView === item.view && !item.href
                      ? 'text-white font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* CTA on Far Right */}
            <button
              onClick={() => handleAuditClick('desktop_header_cta')}
              className="group inline-flex items-center gap-2 h-[42px] px-5 rounded-full bg-white text-[#080808] hover:bg-zinc-100 font-bold text-[13.5px] tracking-tight transition-all duration-200 active:scale-95 select-none cursor-pointer"
            >
              <span>Free Growth Audit</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>

          {/* Mobile: Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-white hover:text-zinc-300 transition-colors cursor-pointer touch-manipulation"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-50 bg-[#080808] text-white flex flex-col justify-between p-6 md:hidden"
          >
            <div className="flex items-center justify-between h-[56px] border-b border-[#292929] pb-3">
              <Logo onClick={handleLogoClick} isDark={true} />

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer touch-manipulation"
                aria-label="Close navigation menu"
              >
                <X className="w-6 h-6" strokeWidth={2} />
              </button>
            </div>

            <nav className="flex flex-col space-y-3 my-auto py-4">
              {navItems.map((item, idx) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * idx, duration: 0.2 }}
                  onClick={() => handleNavItemClick(item)}
                  className="text-left text-2xl font-bold tracking-tight text-white hover:text-[#E50914] transition-colors cursor-pointer select-none py-3 px-2 min-h-[44px] flex items-center touch-manipulation"
                >
                  {item.label}
                </motion.button>
              ))}
            </nav>

            <div className="pt-4 border-t border-[#292929]">
              <button
                onClick={() => handleAuditClick('mobile_overlay_cta')}
                className="w-full h-12 min-h-[48px] py-3.5 px-6 rounded-full bg-white text-[#080808] hover:bg-zinc-100 font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 cursor-pointer touch-manipulation"
              >
                <span>Free Growth Audit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackWhatsAppClick('mobile_menu');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full h-11 min-h-[44px] mt-2.5 rounded-full border border-zinc-800 bg-zinc-900/70 text-zinc-300 hover:text-white font-medium text-xs flex items-center justify-center gap-2 transition-all duration-150 touch-manipulation"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 fill-current text-[#25D366]" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
