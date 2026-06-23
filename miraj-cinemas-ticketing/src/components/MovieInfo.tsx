/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Star, Clock, Calendar, MapPin, Film, ShieldAlert, Sparkles, Check, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Movie, Showtime, TheaterShowtimes } from '../types';
import { getShowtimesForCityAndMovie } from '../data/mockData';
import TrailerModal from './Shared/TrailerModal';

interface MovieInfoProps {
  movie: Movie;
  city: string;
  onBack: () => void;
  onSelectShowtime: (movie: Movie, showtime: Showtime, date: string) => void;
  initialBookingStep?: 'info' | 'times';
  theme?: 'dark' | 'light';
}

export default function MovieInfo({ movie, city, onBack, onSelectShowtime, initialBookingStep = 'info', theme = 'dark' }: MovieInfoProps) {
  // Booking flow inner steps
  const [bookingStep, setBookingStep] = useState<'info' | 'dates' | 'times'>(initialBookingStep);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [trailerOpen, setTrailerOpen] = useState(false);

  const isLight = theme === 'light';

  // Generate 5 consecutive booking dates starting from today
  const generateDates = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const datesList = [];
    const baseDate = new Date(); // 2026-06-23 state or current system date
    
    for (let i = 0; i < 5; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      
      datesList.push({
        id: `date-${i}`,
        dayName: i === 0 ? 'Today' : days[d.getDay()].substring(0, 3),
        dayNum: d.getDate().toString().padStart(2, '0'),
        monthName: months[d.getMonth()],
        fullString: `${days[d.getDay()]} , ${months[d.getMonth()]} ${d.getDate()}`
      });
    }
    return datesList;
  };

  const dates = generateDates();
  const showtimesData = getShowtimesForCityAndMovie(city, movie.id);

  React.useEffect(() => {
    setBookingStep(initialBookingStep);
    if (initialBookingStep === 'times' && !selectedDate && dates.length > 0) {
      setSelectedDate(dates[0].fullString);
    }
  }, [initialBookingStep]);

  const handleBookingStart = () => {
    setBookingStep('times');
    if (!selectedDate && dates.length > 0) {
      setSelectedDate(dates[0].fullString);
    }
  };

  return (
    <div className={`relative w-full min-h-screen font-sans transition-colors duration-300 ${
      isLight ? 'bg-stone-50 text-stone-900' : 'bg-zinc-950 text-zinc-100'
    }`}>
      <TrailerModal movie={movie} isOpen={trailerOpen} onClose={() => setTrailerOpen(false)} />
      
      {/* Blurred Cinematic Backdrop Header */}
      <div className="absolute top-0 inset-x-0 h-[380px] overflow-hidden select-none pointer-events-none z-0">
        <div className={`absolute inset-0 z-10 bg-gradient-to-b from-transparent ${
          isLight ? 'via-stone-50/80 to-stone-50' : 'via-zinc-950/80 to-zinc-950'
        }`} />
        {movie.backdropUrl ? (
          <img 
            src={movie.backdropUrl} 
            alt="" 
            className={`w-full h-full object-cover filter blur-[6px] saturate-[1.1] scale-105 ${
              isLight ? 'opacity-20' : 'opacity-35'
            }`}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full" style={{ background: movie.backdrop, opacity: isLight ? 0.1 : 0.2 }} />
        )}
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 z-10">
        
        {/* Back Button with Glow hover */}
        <button
          onClick={bookingStep === 'info' ? onBack : () => setBookingStep('info')}
          className={`group mb-8 inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-all active:scale-95 cursor-pointer ${
            isLight 
              ? 'border-stone-200 bg-white/90 text-stone-600 hover:text-[#8C1D40] hover:border-[#8C1D40]/30 shadow-sm' 
              : 'border-zinc-850 bg-zinc-900/80 text-zinc-450 hover:text-white hover:border-zinc-700'
          }`}
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>{bookingStep === 'info' ? 'Back to Cinemas' : 'Back to Details'}</span>
        </button>

        <AnimatePresence mode="wait">
          
          {/* STEP 1: DETAILED MOVIE INFORMATION */}
          {bookingStep === 'info' && (
            <motion.div
              key="info-pane"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
            >
              
              {/* Left Column: Poster with fallback */}
              <div className="md:col-span-4 flex flex-col gap-4">
                <div 
                  className={`relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-2xl group flex flex-col justify-end border ${
                    isLight ? 'border-stone-200' : 'border-zinc-800'
                  }`}
                  style={{
                    boxShadow: isLight ? '0 10px 25px -5px rgba(0,0,0,0.08)' : `0 20px 48px -12px ${movie.accentColor}12`
                  }}
                >
                  {movie.posterUrl ? (
                    <img 
                      src={movie.posterUrl} 
                      alt={movie.title}
                      className="absolute inset-0 h-full w-full object-cover z-0 transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                  
                  {/* Dynamic Gradient Badge */}
                  <div className="absolute top-4 left-4 z-20 rounded bg-black/85 backdrop-blur px-2.5 py-0.5 text-xs font-bold border border-zinc-800 text-white">
                    {movie.rating}
                  </div>
                </div>

                {/* Highly structured quick facts */}
                <div className={`rounded-xl border p-4 font-mono text-[11px] uppercase space-y-1.5 ${
                  isLight 
                    ? 'border-stone-200 bg-stone-100/50 text-stone-650' 
                    : 'border-zinc-900 bg-zinc-900/40 text-zinc-450'
                }`}>
                  <div className="flex justify-between">
                    <span>Audio track</span>
                    <span className={`${isLight ? 'text-stone-800' : 'text-zinc-350'} font-bold`}>ATMOS 7.1 / DD 5.1</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtitles</span>
                    <span className={`${isLight ? 'text-stone-800' : 'text-zinc-350'} font-bold`}>English / Hindi (HC)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Run Type</span>
                    <span className={`${isLight ? 'text-stone-800' : 'text-zinc-350'} font-bold`}>Active theatrical</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Descriptions, Bios, Cast and Buttons */}
              <div className="md:col-span-8 flex flex-col items-start text-left gap-6">
                
                {/* Headers & Ratings */}
                <div className="flex flex-col items-start gap-2 w-full">
                  <div className="flex flex-wrap items-center gap-2">
                    {movie.genre.map((g, idx) => (
                      <span 
                        key={idx} 
                        className="text-[10px] uppercase font-mono font-bold tracking-widest px-2.5 py-0.5 rounded border"
                        style={isLight ? {
                          borderColor: '#8C1D4030',
                          color: '#8C1D40',
                          backgroundColor: '#8C1D4008'
                        } : { 
                          borderColor: `${movie.accentColor}25`,
                          color: movie.accentColor,
                          backgroundColor: `${movie.accentColor}08`
                        }}
                      >
                        {g}
                      </span>
                    ))}
                  </div>

                  <h1 className={`text-3xl sm:text-4xl font-black uppercase tracking-tight mt-1 ${
                    isLight ? 'text-stone-900' : 'text-white'
                  }`} style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                    {movie.title}
                  </h1>

                  <div className={`flex flex-wrap items-center gap-3 mt-1.5 text-xs sm:text-sm font-semibold ${
                    isLight ? 'text-stone-600' : 'text-zinc-300'
                  }`}>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-stone-400" />
                      {movie.duration}
                    </span>
                    <span className="text-stone-300">•</span>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                      <span className="font-extrabold">{movie.ratingScore}</span>
                      <span className="text-[10px] text-stone-400 font-normal">/10 BookMyShow</span>
                    </div>
                  </div>
                </div>

                {/* Synopsis */}
                <div className={`border-b pb-5 w-full ${isLight ? 'border-stone-200' : 'border-zinc-900'}`}>
                  <h3 className="text-xs font-mono font-bold text-stone-400 uppercase tracking-widest mb-2">Synopsis</h3>
                  <p className={`text-sm leading-relaxed font-semibold ${isLight ? 'text-stone-750' : 'text-zinc-300'}`}>
                    {movie.synopsis}
                  </p>
                </div>

                {/* Director details */}
                <div className="w-full">
                  <h3 className="text-xs font-mono font-bold text-stone-400 uppercase tracking-widest mb-3">Director</h3>
                  <div className={`flex items-center gap-3 border rounded-xl p-3 max-w-sm ${
                    isLight ? 'border-stone-200 bg-white/60 shadow-sm backdrop-blur-sm' : 'bg-zinc-900/35 border-zinc-900/60'
                  }`}>
                    <img 
                      src={movie.directorPhotoUrl || 'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=150&h=150&fit=crop&q=80'} 
                      alt={movie.director}
                      className="w-11 h-11 rounded-full object-cover border border-zinc-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex flex-col">
                      <span className={`font-bold text-sm ${isLight ? 'text-stone-900' : 'text-zinc-200'}`}>{movie.director}</span>
                      <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Supervising Director</span>
                    </div>
                  </div>
                </div>

                {/* Cast Members detailing with Photos */}
                {movie.cast && movie.cast.length > 0 && (
                  <div className="w-full">
                    <h3 className="text-xs font-mono font-bold text-stone-400 uppercase tracking-widest mb-4">Cast & Characters</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 w-full">
                      {movie.cast.map((c, idx) => (
                        <div 
                          key={idx}
                          className={`flex flex-col items-center border rounded-xl p-3 text-center gap-2 transition-all ${
                            isLight 
                              ? 'border-stone-200 bg-white/60 hover:bg-white/80 hover:border-[#8C1D40]/30 shadow-sm backdrop-blur-sm' 
                              : 'bg-zinc-900/25 border-zinc-900 hover:border-zinc-800'
                          }`}
                        >
                          <img 
                            src={c.photoUrl} 
                            alt={c.name}
                            className="w-14 h-14 rounded-full object-cover border border-zinc-200"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex flex-col items-center gap-0.5">
                            <span className={`font-black text-xs line-clamp-1 leading-tight ${isLight ? 'text-stone-900' : 'text-white'}`}>{c.name}</span>
                            <span className="text-[9px] text-stone-400 line-clamp-1 font-semibold">{c.character}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* BOOK TICKET BUTTON AND INTERACTIVE MOVIE STICKER */}
                <div className={`mt-6 pt-5 border-t w-full flex flex-col sm:flex-row items-center gap-5 ${
                  isLight ? 'border-stone-200' : 'border-zinc-900'
                }`}>
                  <button
                    onClick={handleBookingStart}
                    className="group relative flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto rounded-xl font-bold uppercase tracking-widest text-xs text-white transition-all active:scale-95 cursor-pointer overflow-hidden shadow-lg select-none"
                    style={{
                      background: isLight 
                        ? 'linear-gradient(135deg, #8C1D40 0%, #6b1430 100%)'
                        : `linear-gradient(135deg, ${movie.accentColor} 0%, ${movie.accentColor}dd 100%)`
                    }}
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Calendar className="h-4 w-4 text-white group-hover:rotate-6 transition-transform" />
                    <span>Book Showtimes</span>
                  </button>

                  {(movie.trailerYoutubeId || movie.localVideoUrl) && (
                    <button
                      onClick={() => setTrailerOpen(true)}
                      className={`group flex items-center justify-center gap-2 px-5 py-3.5 w-full sm:w-auto rounded-xl font-bold uppercase tracking-widest text-xs transition-all active:scale-95 cursor-pointer select-none border ${
                        isLight
                          ? 'border-stone-200 bg-white text-stone-700 hover:border-[#8C1D40]/40 hover:bg-[#8C1D40]/5 shadow-sm'
                          : 'border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-amber-500/40 hover:bg-zinc-800'
                      }`}
                      id="watch-trailer-button"
                    >
                      <Play className={`h-4 w-4 fill-current ${isLight ? 'text-[#8C1D40]' : 'text-amber-500'}`} />
                      <span>Watch Trailer</span>
                    </button>
                  )}

                  {/* CUSTOM HOVERABLE CINEMATIC RECTANGULAR MOVIE STICKER */}
                  <div className={`relative group w-full sm:w-56 overflow-hidden rounded-xl p-3 flex items-center gap-3 shadow-md select-none border transition-colors ${
                    isLight 
                      ? 'bg-white border-stone-200 hover:border-[#8C1D40]/30 shadow-sm' 
                      : 'bg-zinc-900/80 border-zinc-800/80 hover:border-amber-500/35'
                  }`}>
                    {/* Retro ticket glowing dash line */}
                    <div className="absolute left-0 inset-y-0 w-1 flex flex-col justify-around text-stone-300">
                      <span>•</span><span>•</span><span>•</span><span>•</span>
                    </div>
                    
                    {/* Animated Holographic Shimmer Reflection */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-[#8C1D40]/5 to-transparent pointer-events-none" />

                    <div className={`rounded p-2 border ${
                      isLight 
                        ? 'bg-[#8C1D40]/5 border-[#8C1D40]/20 text-[#8C1D40]' 
                        : 'bg-amber-500/10 to-amber-500/20 border-amber-500/20 text-amber-500'
                    }`}>
                      <Film className="h-4 w-4 animate-pulse" />
                    </div>

                    <div className="flex flex-col items-start">
                      <div className="flex items-center gap-1">
                        <span className={`text-[8px] font-mono font-black uppercase tracking-widest px-1 py-0.2 rounded border ${
                          isLight 
                            ? 'text-[#8C1D40] bg-[#8C1D40]/5 border-[#8C1D40]/20' 
                            : 'text-amber-500 bg-amber-500/10 border-amber-500/20'
                        }`}>
                          STSTICKER
                        </span>
                        <Sparkles className={`h-2.5 w-2.5 ${isLight ? 'text-[#8C1D40]' : 'text-amber-400'}`} />
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wide mt-1 line-clamp-1 ${isLight ? 'text-stone-800' : 'text-zinc-300'}`}>
                        {movie.title}
                      </span>
                      <span className="text-[8px] text-stone-400 uppercase font-bold tracking-wider font-mono">
                        LIMITED RUN DESK
                      </span>
                    </div>
                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {/* STEP 2: CHOOSE SHOW DATE & SHOWTIME UNIFIED */}
          {bookingStep === 'times' && (
            <motion.div
              key="times-pane"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6 w-full text-left"
            >
              
              {/* Integrated Header and Date Selection Carousel */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <span className={`text-[9px] font-mono font-black uppercase tracking-widest ${
                    isLight ? 'text-[#8C1D40]' : 'text-amber-500'
                  }`}>
                    Reservation Portal • Select Date & Showtime Slot
                  </span>
                  <h3 className={`text-2xl font-black uppercase mt-1 ${isLight ? 'text-stone-900' : 'text-white'}`}>
                    Available Screenings
                  </h3>
                </div>

                {/* Horizontal Date Selection Grid */}
                <div className={`grid grid-cols-5 gap-2.5 pb-4 border-b w-full ${isLight ? 'border-stone-200' : 'border-zinc-900'}`}>
                  {dates.map((d) => {
                    const isSelected = selectedDate === d.fullString;
                    return (
                      <button
                        key={d.id}
                        onClick={() => setSelectedDate(d.fullString)}
                        className={`relative group p-2 sm:p-3 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer ${
                          isSelected
                            ? isLight 
                              ? 'bg-[#8C1D40]/10 border-[#8C1D40] text-[#8C1D40] shadow-sm'
                              : 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                            : isLight
                              ? 'bg-white border-stone-200 text-stone-600 hover:border-[#8C1D40]/60 hover:bg-[#8C1D40]/5'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-amber-500/60 hover:bg-zinc-850'
                        }`}
                      >
                        <span className={`text-[8px] sm:text-[9px] uppercase font-mono font-bold ${
                          isSelected 
                            ? isLight ? 'text-[#8C1D40]' : 'text-amber-400'
                            : 'text-stone-400'
                        }`}>
                          {d.dayName}
                        </span>
                        
                        <span className={`text-base sm:text-2xl font-black font-mono leading-none mt-1 ${
                          isSelected 
                            ? isLight ? 'text-[#8C1D40]' : 'text-amber-300'
                            : isLight ? 'text-stone-850' : 'text-white'
                        }`}>
                          {d.dayNum}
                        </span>
                        
                        <span className="text-[8px] sm:text-[9px] uppercase font-bold text-stone-400 font-mono mt-0.5">
                          {d.monthName}
                        </span>
                        
                        {isSelected && (
                          <div 
                            className="absolute bottom-1 h-1 w-6 rounded-full"
                            style={{ backgroundColor: isLight ? '#8C1D40' : movie.accentColor }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Showtimes lists per multiplex */}
              {showtimesData.length === 0 ? (
                <div className={`py-12 text-center text-sm rounded-2xl border border-dashed ${
                  isLight ? 'border-stone-300 text-stone-500' : 'border-zinc-800 text-zinc-500'
                }`}>
                  No theater listings scheduled for {movie.title} in {city} for {selectedDate}.
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {showtimesData.map((theaterGroup) => (
                    <div 
                      key={theaterGroup.theaterId}
                      className={`rounded-xl border p-5 flex flex-col md:grid md:grid-cols-12 gap-4 items-start ${
                        isLight ? 'border-stone-200/80 bg-white/60 shadow-sm backdrop-blur-sm' : 'border-zinc-900/60 bg-zinc-900/10'
                      }`}
                    >
                      {/* Left: Theater Info */}
                      <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-1.5">
                        <div className={`flex items-center gap-1.5 ${isLight ? 'text-[#8C1D40]' : 'text-amber-500'}`}>
                          <MapPin className="h-4 w-4 shrink-0" />
                          <h4 className={`font-bold text-sm leading-tight ${isLight ? 'text-stone-900' : 'text-zinc-100'}`}>
                            {theaterGroup.theaterName}
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider pl-5">
                          {theaterGroup.distance} from location
                        </span>
                      </div>

                      {/* Right: Showtime pills list */}
                      <div className="md:col-span-8 lg:col-span-9 w-full flex flex-wrap gap-2.5">
                        {theaterGroup.showtimes.map((showtime) => {
                          const isVip = showtime.screenType === 'GOLD VIP';
                          const isImax = showtime.screenType === 'IMAX 3D';
                          
                          let screenStyle = isLight ? 'bg-stone-200 text-stone-700' : 'bg-zinc-900 text-zinc-450';
                          if (isVip) {
                            screenStyle = isLight 
                              ? 'bg-amber-100 text-amber-800 border border-amber-200/40' 
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/20';
                          }
                          if (isImax) {
                            screenStyle = isLight 
                              ? 'bg-sky-100 text-sky-800 border border-sky-200/40' 
                              : 'bg-blue-600/15 text-blue-300 border border-blue-600/20';
                          }

                          return (
                            <button
                              key={showtime.id}
                              onClick={() => {
                                if (selectedDate) {
                                  onSelectShowtime(movie, showtime, selectedDate);
                                }
                              }}
                              className={`group/btn relative rounded-xl border p-3 text-left transition-all duration-300 active:scale-95 cursor-pointer min-w-[125px] flex flex-col gap-0.5 ${
                                isLight 
                                  ? 'border-stone-200 bg-stone-50 hover:border-[#8C1D40] hover:bg-[#8C1D40]/5 shadow-sm' 
                                  : 'border-zinc-800 bg-zinc-900/40 hover:border-amber-500 hover:bg-zinc-850'
                              }`}
                            >
                              <span className={`px-1 rounded text-[8px] font-bold tracking-widest uppercase self-start ${screenStyle}`}>
                                {showtime.screenType}
                              </span>
                              
                              <span className={`text-sm font-black mt-1 font-mono ${
                                isLight 
                                  ? 'text-stone-850 group-hover/btn:text-[#8C1D40]' 
                                  : 'text-white group-hover/btn:text-amber-400'
                              }`}>
                                {showtime.time}
                              </span>
                              
                              <div className="text-[9px] font-bold text-stone-400 font-mono flex items-center justify-between w-full mt-0.5">
                                <span>₹{showtime.priceStandard}</span>
                                <span>•</span>
                                <span>₹{showtime.priceVIP} VIP</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
}
