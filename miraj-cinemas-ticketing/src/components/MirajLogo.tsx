/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface MirajLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'gold' | 'white' | 'dimmed' | 'red';
  isLight?: boolean;
}

export default function MirajLogo({ className = '', size = 'md', variant = 'gold', isLight = false }: MirajLogoProps) {
  // Dimensions map
  const sizeClasses = {
    sm: 'h-6 text-sm',
    md: 'h-9 text-lg',
    lg: 'h-12 text-2xl',
    xl: 'h-16 text-3xl'
  };

  // Color theme definitions matching the corporate premium aesthetic
  const fillAccent = variant === 'gold' ? '#FFB800' : variant === 'white' ? '#FFFFFF' : variant === 'red' ? '#8C1D40' : '#9CA3AF';
  const fillSecondary = variant === 'gold' ? '#FFD066' : variant === 'white' ? '#E5E7EB' : variant === 'red' ? '#701530' : '#6B7280';

  return (
    <div className={`flex items-center gap-3 select-none ${className} ${sizeClasses[size]}`}>
      {/* Precision Engineered Miraj Gold Octagonal Crown Emblem */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-auto h-full shrink-0"
      >
        <defs>
          <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFB800" />
            <stop offset="50%" stopColor="#FFE599" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="red-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8C1D40" />
            <stop offset="50%" stopColor="#A23253" />
            <stop offset="100%" stopColor="#701530" />
          </linearGradient>
          <linearGradient id="silver-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E5E7EB" />
            <stop offset="100%" stopColor="#9CA3AF" />
          </linearGradient>
        </defs>

        {/* Polished geometric background plate representing architectural cinema design */}
        <polygon
          points="20,2 38,11 38,29 20,38 2,29 2,11"
          fill={isLight ? 'rgba(235, 235, 235, 0.95)' : variant === 'red' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(24, 24, 27, 0.9)'}
          stroke={variant === 'gold' ? 'url(#gold-grad)' : variant === 'red' ? 'url(#red-grad)' : 'url(#silver-grad)'}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Inner Golden Monogram 'M' with projection light beam aesthetic */}
        <path
          d="M10,28 L10,13 L16,21 L20,16 L24,21 L30,13 L30,28"
          stroke={variant === 'gold' ? 'url(#gold-grad)' : variant === 'red' ? 'url(#red-grad)' : variant === 'white' ? '#FFFFFF' : '#9CA3AF'}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dynamic projector aperture shutter dots to emphasize the cinematic medium */}
        <circle cx="20" cy="9" r="1.5" fill={fillSecondary} />
        <circle cx="14" cy="30" r="1.2" fill={fillSecondary} />
        <circle cx="26" cy="30" r="1.2" fill={fillSecondary} />
      </svg>

      {/* Typography with brand letter-spacing and golden film-font accents */}
      <div className="flex flex-col justify-center leading-none text-left">
        <span 
          className={`font-bold uppercase tracking-[0.22em] ${
            isLight 
              ? 'text-stone-900' 
              : variant === 'red' 
                ? 'text-stone-900' 
                : 'text-white'
          }`}
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            textShadow: variant === 'gold' && !isLight ? '0 0 15px rgba(255,184,0,0.35)' : 'none'
          }}
        >
          MIRAJ
        </span>
        <span 
          className="text-[0.52em] font-medium tracking-[0.52em] mt-0.5" 
          style={{ 
            color: isLight ? '#8C1D40' : fillAccent,
            fontFamily: '"Inter", sans-serif'
          }}
        >
          CINEMAS
        </span>
      </div>
    </div>
  );
}
