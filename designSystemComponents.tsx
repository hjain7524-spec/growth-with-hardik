import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { 
  DS_COLORS, 
  DS_TYPOGRAPHY, 
  DS_RADII, 
  DS_SPACING, 
  DS_SHADOWS, 
  DS_ANIMATIONS 
} from './designSystemTokens';

/**
 * 1. SECTION CONTAINER SYSTEM
 * Guarantees strict max-width (1320px), generous whitespace, and mobile gutters (24-32px).
 */
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'narrow' | 'wide';
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  size = 'default',
  ...props
}) => {
  const sizeClasses = {
    narrow: 'max-w-[1020px]',
    default: 'max-w-[1320px]',
    wide: 'max-w-[1440px]',
  };

  return (
    <div
      className={`w-full mx-auto px-6 sm:px-8 lg:px-12 ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  id?: string;
  theme?: 'offwhite' | 'white' | 'dark';
  spacing?: 'default' | 'compact' | 'hero';
}

export const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  id,
  theme = 'offwhite',
  spacing = 'default',
  ...props
}) => {
  const themeClasses = {
    offwhite: 'bg-[#F7F7F5] text-[#111111]',
    white: 'bg-[#FFFFFF] text-[#111111]',
    dark: 'bg-[#111111] text-[#FFFFFF]',
  };

  const spacingClasses = {
    hero: 'pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-44 lg:pb-36',
    default: 'py-20 sm:py-28 lg:py-36', // 80px to 144px strict editorial
    compact: 'py-14 sm:py-20 lg:py-24',
  };

  return (
    <section
      id={id}
      className={`relative w-full ${themeClasses[theme]} ${spacingClasses[spacing]} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
};

export interface SectionHeaderProps {
  label?: string;
  title: string | React.ReactNode;
  lead?: string | React.ReactNode;
  align?: 'left' | 'center';
  theme?: 'light' | 'dark';
  badge?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  label,
  title,
  lead,
  align = 'left',
  theme = 'light',
  badge,
  action,
  className = '',
}) => {
  const isDark = theme === 'dark';

  return (
    <div className={`mb-12 sm:mb-16 md:mb-20 ${align === 'center' ? 'text-center mx-auto max-w-3xl' : 'max-w-4xl'} ${className}`}>
      {/* Top Tag or Label */}
      <div className={`flex items-center gap-3 mb-4 sm:mb-6 ${align === 'center' ? 'justify-center' : 'justify-start'}`}>
        {badge}
        {label && (
          <span className={`text-[11px] sm:text-xs uppercase tracking-[0.2em] font-bold ${isDark ? 'text-zinc-400' : 'text-[#666662]'}`}>
            {label}
          </span>
        )}
      </div>

      {/* Main Section Heading */}
      <h2 className={`${DS_TYPOGRAPHY.scales.sectionTitle} ${isDark ? 'text-white' : 'text-[#111111]'} mb-5 sm:mb-6`}>
        {title}
      </h2>

      {/* Supporting Editorial Lead */}
      {lead && (
        <p className={`${DS_TYPOGRAPHY.scales.lead} ${isDark ? 'text-zinc-400' : 'text-[#666662]'} ${align === 'center' ? 'mx-auto' : ''}`}>
          {lead}
        </p>
      )}

      {/* Optional Header Action */}
      {action && (
        <div className={`mt-6 sm:mt-8 flex ${align === 'center' ? 'justify-center' : 'justify-start'}`}>
          {action}
        </div>
      )}
    </div>
  );
};

/**
 * 2. BUTTON SYSTEM
 * Border-radius: 999px
 * Subtle hover translate: -2px
 * Active scale: 0.98
 * Arrows with 4-8px recurring interaction
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  arrow?: 'right' | 'up-right' | 'none';
  fullWidth?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  arrow = 'right',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseClasses = `group inline-flex items-center justify-center font-bold rounded-full select-none cursor-pointer whitespace-nowrap transition-all duration-200 ease-out active:scale-[0.98] ${fullWidth ? 'w-full' : ''}`;

  const variantClasses = {
    // Solid near-black
    primary: 'bg-[#111111] text-white hover:bg-[#000000] hover:-translate-y-0.5 shadow-[0_2px_10px_rgba(0,0,0,0.12)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.18)]',
    
    // Clean off-white card button
    secondary: 'bg-white text-[#111111] border border-[#E8E8E3] hover:border-[#111111] hover:bg-[#F7F7F5] hover:-translate-y-0.5 shadow-sm',
    
    // High-intention red accent
    accent: 'bg-[#E50914] text-white hover:bg-[#FF2B35] hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(229,9,20,0.3)]',
    
    // Subtle line outline
    outline: 'border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white hover:-translate-y-0.5',
    
    // Clean text button with arrow shift
    ghost: 'text-[#111111] hover:text-[#E50914] p-0 font-semibold',
  };

  const sizeClasses = {
    sm: 'text-xs px-4 py-2 gap-1.5 h-9',
    md: 'text-sm sm:text-[15px] px-6 py-3 gap-2.5 h-11 sm:h-12',
    lg: 'text-base px-8 py-4 gap-3 h-13 sm:h-14',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${variant !== 'ghost' ? sizeClasses[size] : 'gap-2'} ${className}`}
      {...props}
    >
      <span>{children}</span>
      {arrow === 'right' && (
        <ArrowRight className="w-4 h-4 transition-transform duration-250 ease-out group-hover:translate-x-1.5" />
      )}
      {arrow === 'up-right' && (
        <ArrowUpRight className="w-4 h-4 transition-transform duration-250 ease-out group-hover:translate-x-1 group-hover:-translate-y-1" />
      )}
    </button>
  );
};

/**
 * 3. CARD SYSTEM
 * Rounded 28px to 40px (default 32px)
 * Thin 1px borders (#E8E8E3 or rgba(255,255,255,0.08))
 * Minimal shadows
 * Subtle hover lift (-4px)
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'white' | 'dark' | 'offwhite' | 'borderless';
  radius?: 'default' | 'small' | 'large';
  interactive?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'white',
  radius = 'default',
  interactive = false,
  className = '',
  ...props
}) => {
  const variantClasses = {
    white: 'bg-white text-[#111111] border border-[#E8E8E3]',
    offwhite: 'bg-[#F7F7F5] text-[#111111] border border-[#E8E8E3]',
    dark: 'bg-[#161616] text-white border border-white/10',
    borderless: 'bg-transparent text-inherit',
  };

  const radiusClasses = {
    small: 'rounded-[24px]',
    default: 'rounded-[32px]', // 32px golden middle
    large: 'rounded-[40px]',
  };

  const interactiveClasses = interactive
    ? 'cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.06)]'
    : '';

  return (
    <div
      className={`p-6 sm:p-8 md:p-10 ${radiusClasses[radius]} ${variantClasses[variant]} ${interactiveClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * 4. PILL / TAG SYSTEM
 * Border-radius: 999px (full pill)
 * Single line, tight uppercase or bold small text
 */
export interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'neutral' | 'dark' | 'outline' | 'accent' | 'live';
  size?: 'sm' | 'md';
  className?: string;
}

export const Pill: React.FC<PillProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  ...props
}) => {
  const variantClasses = {
    neutral: 'bg-[#EFEFEA] text-[#111111]',
    dark: 'bg-[#222222] text-[#F7F7F5]',
    outline: 'border border-[#E8E8E3] text-[#666662] bg-white',
    accent: 'bg-[#E50914]/10 text-[#E50914] border border-[#E50914]/20',
    live: 'bg-[#111111] text-white flex items-center gap-2',
  };

  const sizeClasses = {
    sm: 'text-[11px] px-3 py-1 font-semibold',
    md: 'text-xs px-4 py-1.5 font-bold tracking-tight',
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full select-none whitespace-nowrap ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {variant === 'live' && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-pulse" />
      )}
      {children}
    </span>
  );
};

/**
 * 5. STAT NUMBER SYSTEM
 * Oversized numbers for statistics and proof points
 */
export interface StatNumberProps {
  value: string;
  label: string;
  description?: string;
  theme?: 'light' | 'dark';
  className?: string;
}

export const StatNumber: React.FC<StatNumberProps> = ({
  value,
  label,
  description,
  theme = 'light',
  className = '',
}) => {
  const isDark = theme === 'dark';

  return (
    <div className={`flex flex-col ${className}`}>
      <span className={`${DS_TYPOGRAPHY.scales.statNumber} ${isDark ? 'text-white' : 'text-[#111111]'}`}>
        {value}
      </span>
      <span className={`text-xs uppercase tracking-[0.2em] font-bold mt-2 ${isDark ? 'text-zinc-400' : 'text-[#666662]'}`}>
        {label}
      </span>
      {description && (
        <p className={`text-sm mt-1 leading-normal ${isDark ? 'text-zinc-500' : 'text-[#8E8E88]'}`}>
          {description}
        </p>
      )}
    </div>
  );
};

/**
 * 6. NAVIGATION SYSTEM
 * Minimal editorial header with bold geometric wordmark, subtle links, and pill CTA.
 */
export interface NavBarProps {
  activeView?: string;
  onNavigate?: (view: string) => void;
  onRequestAudit?: () => void;
}

export const AgencyNavBar: React.FC<NavBarProps> = ({
  activeView = 'home',
  onNavigate,
  onRequestAudit,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#F7F7F5]/85 backdrop-blur-md border-b border-[#E8E8E3]">
      <Container size="wide" className="h-20 flex items-center justify-between">
        {/* Brand Wordmark */}
        <a 
          href="#home"
          onClick={(e) => {
            if (onNavigate) {
              e.preventDefault();
              onNavigate('home');
            }
          }}
          className="flex items-center gap-1.5 text-xl sm:text-2xl font-black tracking-tight text-[#111111] select-none hover:opacity-85 transition-opacity"
        >
          <span>GrowthWithHardik</span>
          <span className="w-2 h-2 rounded-full bg-[#E50914]" />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#666662]">
          <a 
            href="#work" 
            className="hover:text-[#111111] transition-colors"
          >
            Case Studies
          </a>
          <a 
            href="#process" 
            className="hover:text-[#111111] transition-colors"
          >
            Process
          </a>
          <a 
            href="#services" 
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate('services');
              }
            }}
            className="hover:text-[#111111] transition-colors"
          >
            Services
          </a>
          <a 
            href="#pricing" 
            className="hover:text-[#111111] transition-colors"
          >
            Pricing
          </a>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Button 
            variant="primary" 
            size="sm" 
            arrow="right"
            onClick={onRequestAudit}
          >
            Book Growth Plan
          </Button>
        </div>
      </Container>
    </header>
  );
};
