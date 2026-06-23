/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, ChevronDown, Sun, Moon, Film, Tag, Calendar, HelpCircle, LogIn } from 'lucide-react';
import { City } from '../types';
import MirajLogo from './MirajLogo';
import IndiaMap from './IndiaMap';
import UserAvatarMenu from './Shared/UserAvatarMenu';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  currentCity: City;
  onCityChange: (city: City) => void;
  activeView: string;
  onNavigate: (view: 'booking-hub' | 'offers' | 'upcoming-shows' | 'seating-matrix' | 'checkout' | 'receipt' | 'login' | 'register' | 'profile' | 'help-center' | 'forgot-password') => void;
  selectedMovie: any;
  selectedSeatsCount: number;
  theme?: 'dark' | 'light';
  onThemeToggle?: () => void;
}

export default function Header({
  currentCity,
  onCityChange,
  activeView,
  onNavigate,
  selectedMovie,
  selectedSeatsCount,
  theme = 'dark',
  onThemeToggle
}: HeaderProps) {
  const { isAuthenticated } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredCity, setHoveredCity] = useState<City | null>(null);
  const cities: City[] = ['Mumbai', 'Pune', 'Bengaluru', 'Belagavi'];
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleCitySelect = (city: City) => {
    onCityChange(city);
    setDropdownOpen(false);
  };

  const isLight = theme === 'light';
  const isSeatingView = activeView === 'seating-matrix';

  return (
    <header className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 backdrop-blur-md ${isLight ? 'border-stone-200/60 bg-white/70 text-stone-900 shadow-sm' : 'border-zinc-800 bg-zinc-950/90 text-zinc-100'
      }`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 relative">

        {isSeatingView ? (
          <>
            {/* Left side spacer to balance layout */}
            <div className="w-12 sm:w-20" />

            {/* Centered Brand Text & Selected Location */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center">
              <div
                onClick={() => onNavigate('booking-hub')}
                className="cursor-pointer transition-transform duration-200 active:scale-95 flex items-center justify-center gap-2"
              >
                <MirajLogo size="md" variant="gold" isLight={isLight} />
                <span className={`text-[11px] font-mono font-bold tracking-wider uppercase border-l pl-3 py-1 ${isLight ? 'border-stone-200 text-stone-600' : 'border-zinc-800 text-zinc-400'
                  }`}>
                  {currentCity}
                </span>
              </div>
            </div>

            {/* Right side Actions (Sliding Theme Switch) */}
            <div className="flex items-center gap-2">
              {onThemeToggle && (
                <button
                  onClick={onThemeToggle}
                  className={`relative flex h-7 w-14 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none ${isLight ? 'bg-stone-200' : 'bg-zinc-850 border border-zinc-800'
                    }`}
                  title={isLight ? 'Switch to Night Mode (Dark)' : 'Switch to Ticket Booking Mode (Light)'}
                  aria-label="Toggle visual theme"
                  id="sliding-theme-toggle"
                >
                  <div className="absolute left-1 flex items-center justify-center w-5 h-5 text-amber-500">
                    <Sun className="h-3.5 w-3.5" />
                  </div>
                  <div className="absolute right-1 flex items-center justify-center w-5 h-5 text-zinc-400">
                    <Moon className="h-3 w-3" />
                  </div>
                  <div
                    className="h-5 w-5 rounded-full shadow-md transition-transform duration-300 ease-out transform"
                    style={{
                      transform: isLight ? 'translateX(0)' : 'translateX(26px)',
                      backgroundColor: isLight ? '#ffffff' : '#f59e0b'
                    }}
                  />
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Brand Identity / Logo - clickable to take user to home */}
            <div
              onClick={() => onNavigate('booking-hub')}
              className="cursor-pointer transition-transform duration-200 active:scale-95"
              id="header-brand-logo"
            >
              <MirajLogo size="md" variant="gold" isLight={isLight} />
            </div>

            {/* Navigation & Location Actions */}
            <div className="flex items-center gap-2 sm:gap-4">

              {/* Dynamic City Selector Dropdown */}
              <div className="relative" id="city-selector-container" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-300 ${isLight
                      ? 'border-stone-200 bg-stone-50 text-stone-700 hover:border-[#8C1D40]/40 hover:bg-stone-100'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-amber-500/40 hover:bg-zinc-850'
                    }`}
                  id="city-selector-button"
                >
                  <MapPin className={`h-3.5 w-3.5 ${isLight ? 'text-[#8C1D40]' : 'text-amber-500'}`} />
                  <span>{currentCity}</span>
                  <ChevronDown className={`h-3 w-3 text-stone-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div
                    className={`absolute right-0 mt-2 origin-top-right rounded-2xl border p-3.5 z-20 focus:outline-none animate-in fade-in slide-in-from-top-2 duration-150 flex flex-col sm:flex-row gap-4 w-[280px] sm:w-[450px] ${isLight ? 'border-stone-200 bg-white shadow-xl text-stone-850' : 'border-zinc-800 bg-zinc-900 shadow-2xl text-zinc-100'
                      }`}
                    id="city-selector-dropdown"
                  >
                    {/* Left Column: Cities List */}
                    <div className="flex-1 flex flex-col gap-1 text-left">
                      <div className={`px-2 py-1 text-[10px] font-bold tracking-wider uppercase ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
                        Select Location
                      </div>
                      {cities.map((city) => (
                        <button
                          key={city}
                          onClick={() => handleCitySelect(city)}
                          onMouseEnter={() => setHoveredCity(city)}
                          onMouseLeave={() => setHoveredCity(null)}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${currentCity === city
                              ? isLight
                                ? 'bg-[#8C1D40]/10 text-[#8C1D40]'
                                : 'bg-amber-500/10 text-amber-500'
                              : isLight
                                ? 'text-stone-600 hover:bg-stone-50 hover:text-black'
                                : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                            }`}
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className={`h-3.5 w-3.5 ${currentCity === city ? (isLight ? 'text-[#8C1D40]' : 'text-amber-500') : 'text-stone-400'}`} />
                            <span>{city}</span>
                          </div>
                          {currentCity === city && (
                            <div className={`h-1.5 w-1.5 rounded-full ${isLight ? 'bg-[#8C1D40]' : 'bg-amber-500'}`} />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Right Column: India Mini Map */}
                    <div className={`flex items-center justify-center border-t sm:border-t-0 sm:border-l pt-3 sm:pt-0 sm:pl-3.5 ${isLight ? 'border-stone-100' : 'border-zinc-800'
                      }`}>
                      <IndiaMap
                        selectedCity={currentCity}
                        hoveredCity={hoveredCity}
                        onCityHover={setHoveredCity}
                        onCitySelect={handleCitySelect}
                        theme={theme}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Nav Items */}
              <nav className="hidden md:flex items-center gap-1">
                <button
                  onClick={() => onNavigate('booking-hub')}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${activeView === 'booking-hub'
                      ? isLight
                        ? 'bg-stone-100 text-[#8C1D40] font-semibold'
                        : 'bg-zinc-800 text-amber-500'
                      : isLight
                        ? 'text-stone-500 hover:text-stone-900'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                >
                  <Film className="h-3.5 w-3.5" />
                  <span>Movies</span>
                </button>

                <button
                  onClick={() => onNavigate('offers')}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${activeView === 'offers'
                      ? isLight
                        ? 'bg-stone-100 text-[#8C1D40] font-semibold'
                        : 'bg-zinc-800 text-amber-500'
                      : isLight
                        ? 'text-stone-500 hover:text-stone-900'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  id="nav-offers-button"
                >
                  <Tag className="h-3.5 w-3.5" />
                  <span>Offers</span>
                </button>

                <button
                  onClick={() => onNavigate('upcoming-shows')}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${activeView === 'upcoming-shows'
                      ? isLight
                        ? 'bg-stone-100 text-[#8C1D40] font-semibold'
                        : 'bg-zinc-800 text-amber-500'
                      : isLight
                        ? 'text-stone-500 hover:text-stone-900'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  id="nav-upcoming-shows-button"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Upcoming</span>
                </button>
                <button
                  onClick={() => onNavigate('help-center')}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${activeView === 'help-center'
                      ? isLight
                        ? 'bg-stone-100 text-[#8C1D40] font-semibold'
                        : 'bg-zinc-800 text-amber-500'
                      : isLight
                        ? 'text-stone-500 hover:text-stone-900'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  id="nav-help-button"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>Help</span>
                </button>
              </nav>

              {/* Divider */}
              <div className={`hidden sm:block h-6 w-px ${isLight ? 'bg-stone-200' : 'bg-zinc-800'}`} />

              {/* Auth: Login button or User avatar menu */}
              {isAuthenticated ? (
                <UserAvatarMenu theme={theme} />
              ) : (
                <button
                  onClick={() => onNavigate('login')}
                  className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer ${isLight
                      ? 'border-[#8C1D40]/30 bg-[#8C1D40]/5 text-[#8C1D40] hover:bg-[#8C1D40] hover:text-white'
                      : 'border-amber-500/30 bg-amber-500/5 text-amber-400 hover:bg-amber-500 hover:text-black'
                    }`}
                  id="header-login-button"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Login</span>
                </button>
              )}

              {/* Elegant Sliding Theme Toggle Switch */}
              {onThemeToggle && (
                <button
                  onClick={onThemeToggle}
                  className={`relative flex h-7 w-14 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none ${isLight ? 'bg-stone-200' : 'bg-zinc-850 border border-zinc-800'
                    }`}
                  title={isLight ? 'Switch to Night Mode (Dark)' : 'Switch to Ticket Booking Mode (Light)'}
                  aria-label="Toggle visual theme"
                  id="sliding-theme-toggle"
                >
                  <div className="absolute left-1 flex items-center justify-center w-5 h-5 text-amber-500">
                    <Sun className="h-3.5 w-3.5" />
                  </div>
                  <div className="absolute right-1 flex items-center justify-center w-5 h-5 text-zinc-400">
                    <Moon className="h-3 w-3" />
                  </div>
                  <div
                    className="h-5 w-5 rounded-full shadow-md transition-transform duration-300 ease-out transform"
                    style={{
                      transform: isLight ? 'translateX(0)' : 'translateX(26px)',
                      backgroundColor: isLight ? '#ffffff' : '#f59e0b'
                    }}
                  />
                </button>
              )}



            </div>
          </>
        )}
      </div>
    </header>
  );
}
