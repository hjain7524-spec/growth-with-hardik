import React from 'react';

export const MasterGrowthLogo = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg 
    viewBox="0 0 36 36" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    aria-hidden="true"
  >
    {/* Upper Apex Plane - Red */}
    <path 
      d="M18 4L28.8 10.3L18 16.6L7.2 10.3Z" 
      fill="#E50914" 
    />
    
    {/* Left Foundation Monolith - Solid White */}
    <path 
      d="M6.5 13.2L16.5 19V31.8L6.5 26V13.2Z" 
      fill="#FFFFFF" 
    />
    
    {/* Right Scaling Monolith - Solid White */}
    <path 
      d="M19.5 19L29.5 13.2V26L19.5 31.8V19Z" 
      fill="#FFFFFF" 
    />
  </svg>
);

export const BrandLogoImage = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-7 h-7 p-1 rounded-[8px]",
    md: "w-8 h-8 sm:w-9 sm:h-9 p-1.5 rounded-[10px] sm:rounded-xl",
    lg: "w-12 h-12 p-2 rounded-2xl"
  };

  return (
    <div className={`${sizeClasses[size]} bg-black overflow-hidden shrink-0 flex items-center justify-center select-none`}>
      <MasterGrowthLogo />
    </div>
  );
};

export const Logo = ({ 
  onClick, 
  isDark = false,
  className = ""
}: { 
  onClick?: () => void; 
  isDark?: boolean;
  className?: string;
}) => (
  <div 
    className={`inline-flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none ${className}`} 
    onClick={onClick}
    id="main-brand-logo"
    aria-label="GrowthwithHardik"
  >
    <div className="shrink-0 flex items-center justify-center">
      <BrandLogoImage size="md" />
    </div>
    <div className={`flex items-center text-[17px] sm:text-[18px] tracking-tight leading-none ${isDark ? 'text-white' : 'text-black'}`}>
      <span className={`font-bold tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>Growth</span>
      <span className={`${isDark ? 'text-zinc-400' : 'text-[#8E8E93]'} font-normal px-[1px]`}>with</span>
      <span className={`font-bold tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>Hardik</span>
      <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] ml-0.5 inline-block self-center"></span>
    </div>
  </div>
);
