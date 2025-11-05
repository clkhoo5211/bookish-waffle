import React from 'react';

interface BNBLogoProps {
  className?: string;
  size?: number;
}

export const BNBLogo: React.FC<BNBLogoProps> = ({ className = '', size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* BNB Diamond Logo - Proper 5-diamond structure */}
      {/* Top diamond */}
      <path d="M16 4L19 7L16 10L13 7L16 4Z" fill="currentColor"/>
      
      {/* Left diamond */}
      <path d="M8 12L11 15L8 18L5 15L8 12Z" fill="currentColor"/>
      
      {/* Center diamond */}
      <path d="M16 12L19 15L16 18L13 15L16 12Z" fill="currentColor"/>
      
      {/* Right diamond */}
      <path d="M24 12L27 15L24 18L21 15L24 12Z" fill="currentColor"/>
      
      {/* Bottom diamond */}
      <path d="M16 20L19 23L16 26L13 23L16 20Z" fill="currentColor"/>
    </svg>
  );
};

