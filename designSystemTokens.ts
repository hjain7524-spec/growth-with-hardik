/**
 * GrowthWithHardik Design System Tokens
 * 
 * Strict Global Design System
 * Aesthetic: Clean Editorial Premium Digital Agency
 * Palette: Black (#080808) + White (#FFFFFF) + Off-White (#F7F7F5) + Red Accent (#E50914)
 */

export const DS_COLORS = {
  // Primary monochromatic contrast
  black: '#080808',
  white: '#FFFFFF',
  offWhite: '#F7F7F5',
  
  // Red accent system
  primaryRed: '#E50914',
  secondaryRed: '#FF2B35',
  redAccent: '#E50914',
  redAccentHover: '#FF2B35',
  redAccentMuted: 'rgba(229, 9, 20, 0.08)',
  redAccentBorder: 'rgba(229, 9, 20, 0.22)',

  // Semantic aliases
  accent: '#E50914',
  accentHover: '#FF2B35',
  
  // Grays & borders
  mutedGray: '#707070',
  borderGray: '#D9D9D9',
  darkSectionBorder: '#292929',
  
  // Typographic colors
  textPrimary: '#080808',
  textSecondary: '#707070',
  textInversePrimary: '#FFFFFF',
  textInverseSecondary: '#A3A3A3',
} as const;

export const DS_TYPOGRAPHY = {
  fontFamily: {
    primary: "'Poppins', 'Manrope', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  
  // Strict typography scale:
  // H1: Desktop 64px / Mobile 38px (Font-weight 700, leading 1.02)
  // H2: Desktop 48px / Mobile 32px (Font-weight 700, leading 1.05-1.08)
  // H3: Desktop 30px / Mobile 24px (Font-weight 700)
  // Large body: 20px desktop / 18px mobile (Line-height 1.5)
  // Normal body: 17px desktop / 16px mobile (Line-height 1.55)
  // Small labels: 13-14px (Font-weight 600, tracking 0.08em, uppercase)
  scales: {
    h1: 'text-[38px] sm:text-[48px] md:text-[56px] lg:text-[64px] font-bold tracking-tight leading-[1.02]',
    h2: 'text-[32px] sm:text-[38px] md:text-[44px] lg:text-[48px] font-bold tracking-tight leading-[1.05]',
    h3: 'text-[24px] sm:text-[28px] md:text-[30px] font-bold tracking-tight leading-snug',
    largeBody: 'text-[18px] sm:text-[19px] md:text-[20px] leading-[1.5] text-[#707070]',
    normalBody: 'text-[16px] sm:text-[16.5px] md:text-[17px] leading-[1.55] text-[#707070]',
    smallBody: 'text-[14px] sm:text-[15px] leading-[1.5] text-[#707070]',
    eyebrow: 'text-[12px] sm:text-[13px] md:text-[14px] font-semibold tracking-[0.08em] uppercase',
    statNumber: 'text-[36px] sm:text-[42px] md:text-[48px] lg:text-[52px] font-bold tracking-tight',
  }
} as const;

export const DS_LAYOUT = {
  // Max width 1200px
  container: 'w-full max-w-[1200px] mx-auto px-5 sm:px-6 md:px-8',
  
  // Section heights:
  // Large desktop: py-20 (80px), mobile py-14 (56px)
  // Normal desktop: py-16 (64px), mobile py-11 (44px)
  // Compact desktop: py-12 (48px), mobile py-9 (36px)
  sectionLarge: 'py-14 md:py-20',
  sectionNormal: 'py-11 md:py-16',
  sectionCompact: 'py-9 md:py-12',
  
  // Controlled headline line lengths
  h1MaxWidth: 'max-w-[700px] lg:max-w-[850px]',
  h2MaxWidth: 'max-w-[650px] lg:max-w-[750px]',
  bodyMaxWidth: 'max-w-[600px] lg:max-w-[700px]',
  
  // Standard card specs
  cardRadius: 'rounded-[20px] sm:rounded-[24px]',
  cardPadding: 'p-5 sm:p-6 md:p-8',
  cardPaddingCompact: 'p-4 sm:p-5 md:p-6',
  cardBorderLight: 'border border-[#D9D9D9]',
  cardBorderDark: 'border border-[#292929]',
} as const;
