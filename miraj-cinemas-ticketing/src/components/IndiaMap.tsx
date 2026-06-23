/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'framer-motion';
import { City } from '../types';

interface IndiaMapProps {
  selectedCity: City;
  hoveredCity?: City | null;
  onCityHover?: (city: City | null) => void;
  onCitySelect: (city: City) => void;
  theme?: 'dark' | 'light';
}

export default function IndiaMap({ selectedCity, hoveredCity = null, onCityHover, onCitySelect, theme = 'dark' }: IndiaMapProps) {
  const isLight = theme === 'light';

  // Geographic SVG coordinates representing key multiplex cities in India (200x200 viewBox space)
  const cityCoords: Record<City, { x: number; y: number }> = {
    Mumbai: { x: 83, y: 125 },
    Pune: { x: 90, y: 127 },
    Belagavi: { x: 91, y: 145 },
    Bengaluru: { x: 102, y: 160 }
  };

  // High-fidelity simplified vector path of India (bounds fit in 200x200 viewBox)
  const indiaPath = "M100,10 L104,13 L108,11 L112,14 L110,20 L115,22 L113,30 L118,34 L122,32 L125,40 L134,44 L138,42 L138,48 L142,50 L145,48 L147,53 L152,53 L156,58 L160,56 L160,62 L163,60 L166,64 L170,62 L172,66 L178,63 L184,65 L190,68 L192,75 L188,80 L182,82 L176,82 L174,86 L168,85 L166,90 L160,88 L158,94 L154,95 L155,102 L149,104 L148,110 L145,112 L144,118 L141,120 L138,130 L135,135 L130,145 L126,152 L122,160 L118,170 L114,178 L108,185 L104,190 L101,185 L99,178 L96,168 L94,158 L91,148 L88,138 L86,128 L84,120 L80,118 L76,115 L72,116 L65,116 L58,112 L50,110 L42,108 L34,106 L28,102 L22,98 L24,94 L29,94 L34,92 L38,88 L44,88 L50,85 L54,86 L58,82 L57,75 L61,70 L60,62 L64,55 L68,48 L73,42 L80,36 L86,28 L92,20 L98,14 Z";

  // Calculate the target viewBox to slightly zoom into the picked city (or hovered city)
  const activeCoord = cityCoords[hoveredCity || selectedCity] || cityCoords[selectedCity];
  // We zoom into a 90x90 window centered at the city coords, clamped to 200x200 space roughly
  const zoomSize = 90;
  const targetX = Math.max(10, Math.min(200 - zoomSize, activeCoord.x - zoomSize / 2));
  const targetY = Math.max(10, Math.min(200 - zoomSize, activeCoord.y - zoomSize / 2));
  
  const targetViewBox = `${targetX} ${targetY} ${zoomSize} ${zoomSize}`;

  return (
    <div className={`relative flex flex-col items-center justify-center p-1.5 rounded-xl border select-none overflow-hidden transition-all duration-300 w-44 h-44 sm:w-48 sm:h-48 ${
      isLight 
        ? 'bg-stone-50/75 border-stone-100 shadow-inner' 
        : 'bg-zinc-950/40 border-zinc-800/80 shadow-inner'
    }`}>
      <motion.svg
        viewBox={targetViewBox}
        animate={{ viewBox: targetViewBox }}
        transition={{ type: "spring", stiffness: 60, damping: 15 }}
        className="w-full h-full"
      >
        <defs>
          {/* Subtle dots pattern to overlay on the India map for tech style */}
          <pattern id="dot-pattern" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle 
              cx="2" 
              cy="2" 
              r="0.7" 
              fill={isLight ? "rgba(140, 29, 64, 0.12)" : "rgba(245, 158, 11, 0.12)"} 
            />
          </pattern>
          
          {/* Clip path to bound dot pattern inside India's borders */}
          <clipPath id="india-clip">
            <path d={indiaPath} />
          </clipPath>
        </defs>

        {/* Outer Shadowed India Path */}
        <path
          d={indiaPath}
          fill={isLight ? "rgba(140, 29, 64, 0.04)" : "rgba(245, 158, 11, 0.02)"}
          stroke={isLight ? "rgba(140, 29, 64, 0.25)" : "rgba(251, 191, 36, 0.2)"}
          strokeWidth="1.5"
          strokeLinejoin="round"
          className="transition-all duration-300"
        />

        {/* Dotted matrix inside India borders */}
        <rect
          x="0"
          y="0"
          width="200"
          height="200"
          clipPath="url(#india-clip)"
          fill="url(#dot-pattern)"
        />

        {/* Map grid overlay lines */}
        <line x1="100" y1="0" x2="100" y2="200" stroke={isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.02)"} strokeWidth="0.5" strokeDasharray="3,3" />
        <line x1="0" y1="100" x2="200" y2="100" stroke={isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.02)"} strokeWidth="0.5" strokeDasharray="3,3" />

        {/* City Beacons and Interactive Markers */}
        {Object.entries(cityCoords).map(([name, coords]) => {
          const isSelected = name === selectedCity;
          const isHovered = name === hoveredCity;
          const isHighlighted = isSelected || isHovered;
          
          const labelOffsetLeft = name === 'Mumbai' ? -26 : name === 'Pune' ? 6 : name === 'Belagavi' ? -28 : 6;
          const labelOffsetTop = name === 'Mumbai' ? -1 : name === 'Pune' ? 4 : name === 'Belagavi' ? 3 : 2;

          return (
            <g 
               key={name} 
               className="cursor-pointer group/node" 
               onClick={() => onCitySelect(name as City)}
               onMouseEnter={() => onCityHover?.(name as City)}
               onMouseLeave={() => onCityHover?.(null)}
            >
              {/* Pulsing Beacon Ripple rings: ONLY on hovered city */}
              {isHovered && (
                <>
                  <motion.circle
                    cx={coords.x}
                    cy={coords.y}
                    r={12}
                    fill={isLight ? "rgba(140, 29, 64, 0.35)" : "rgba(245, 158, 11, 0.35)"}
                    animate={{ scale: [1, 2.2], opacity: [0.8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.4, ease: "easeOut" }}
                  />
                  <motion.circle
                    cx={coords.x}
                    cy={coords.y}
                    r={12}
                    fill={isLight ? "rgba(140, 29, 64, 0.18)" : "rgba(245, 158, 11, 0.18)"}
                    animate={{ scale: [1, 3.2], opacity: [0.5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut", delay: 0.4 }}
                  />
                </>
              )}

              {/* Hover Node highlight ring */}
              <circle
                cx={coords.x}
                cy={coords.y}
                r={5}
                fill="transparent"
                stroke={isLight ? "rgba(140, 29, 64, 0.1)" : "rgba(245, 158, 11, 0.1)"}
                className="group-hover/node:scale-125 transition-transform"
              />

              {/* Central Solid Node Dot: 
                  - Hovered is largest (beacon core): r=3.2
                  - Selected but not hovered is smaller: r=1.8
                  - Default unselected is smallest: r=1.2
              */}
              <circle
                cx={coords.x}
                cy={coords.y}
                r={isHovered ? 3.2 : isSelected ? 1.8 : 1.2}
                fill={isHovered 
                  ? (isLight ? "#8C1D40" : "#F59E0B") 
                  : isSelected
                    ? (isLight ? "#8C1D40" : "#F59E0B")
                    : (isLight ? "#a8a29e" : "#52525b")
                }
                className="transition-all duration-300"
              />

              {/* City Label Tag Card */}
              <rect
                x={coords.x + labelOffsetLeft - 2}
                y={coords.y + labelOffsetTop - 5}
                width={30}
                height={7}
                rx={1.5}
                fill={isHovered
                  ? (isLight ? "#8C1D40" : "#F59E0B")
                  : isSelected
                    ? (isLight ? "rgba(140, 29, 64, 0.1)" : "rgba(245, 158, 11, 0.15)")
                    : (isLight ? "rgba(245, 245, 244, 0.9)" : "rgba(24, 24, 27, 0.8)")
                }
                stroke={isHovered 
                  ? "transparent" 
                  : isSelected
                    ? (isLight ? "rgba(140, 29, 64, 0.4)" : "rgba(245, 158, 11, 0.4)")
                    : (isLight ? "rgba(140, 29, 64, 0.15)" : "rgba(245, 158, 11, 0.15)")
                }
                strokeWidth="0.3"
                className="transition-all duration-300 pointer-events-none"
              />

              {/* City label text */}
              <text
                x={coords.x + labelOffsetLeft + 13}
                y={coords.y + labelOffsetTop}
                textAnchor="middle"
                fontSize="4"
                fontWeight={isHighlighted ? "900" : "bold"}
                fill={isHovered 
                  ? "#FFFFFF" 
                  : isSelected
                    ? (isLight ? "#8C1D40" : "#F59E0B")
                    : (isLight ? "#44403c" : "#e4e4e7")
                }
                className="font-sans tracking-wide select-none pointer-events-none"
                style={{ fontSize: '3.8px' }}
              >
                {name.toUpperCase()}
              </text>
            </g>
          );
        })}

        {/* Pointer for the currently selected city */}
        {Object.entries(cityCoords).map(([name, coords]) => {
          const isSelected = name === selectedCity;
          if (!isSelected) return null;
          
          return (
            <g key={`current-pointer-${name}`} className="pointer-events-none">
              {/* Elegant dotted connector line */}
              <line
                x1={coords.x}
                y1={coords.y - 4}
                x2={coords.x}
                y2={coords.y - 14}
                stroke={isLight ? "#8C1D40" : "#F59E0B"}
                strokeWidth="0.5"
                strokeDasharray="1,1"
              />
              {/* Tiny arrow head */}
              <polygon
                points={`${coords.x},${coords.y - 4} ${coords.x - 1.5},${coords.y - 6.5} ${coords.x + 1.5},${coords.y - 6.5}`}
                fill={isLight ? "#8C1D40" : "#F59E0B"}
              />
              {/* Small floating container for "CURRENT" label */}
              <rect
                x={coords.x - 18}
                y={coords.y - 20}
                width={36}
                height={6}
                rx="1"
                fill={isLight ? "#8C1D40" : "#F59E0B"}
                className="shadow-sm"
              />
              <text
                x={coords.x}
                y={coords.y - 15.5}
                textAnchor="middle"
                fontSize="3.5"
                fontWeight="black"
                fill="#FFFFFF"
                className="font-sans tracking-widest"
                style={{ fontSize: '3px', fontWeight: 'bold' }}
              >
                CURRENT CITY
              </text>
            </g>
          );
        })}
      </motion.svg>
    </div>
  );
}
