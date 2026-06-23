/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Star, Sparkles, Clock, Calendar, ChevronLeft, ChevronRight, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Movie } from '../types';

interface HeroBannerProps {
  movies: Movie[];
  onBookNow: (movie: Movie) => void;
  onSelectMovie?: (movie: Movie) => void;
  theme?: 'dark' | 'light';
}

export default function HeroBanner({ movies, onBookNow, onSelectMovie, theme = 'dark' }: HeroBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeMovie = movies[activeIndex] || movies[0];

  const [origin, setOrigin] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  // Drag tracking state to show swipe cue overlay (like Tinder "LIKE" / "DISMISS")
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);
  const dragOccurred = useRef(false);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
    setDragDirection(null);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
    setDragDirection(null);
  };

  // Drag handler calculations
  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 220;
    const swipeDistance = info.offset.x;

    if (swipeDistance > swipeThreshold) {
      // Swiped right -> previous card
      handlePrev();
    } else if (swipeDistance < -swipeThreshold) {
      // Swiped left -> next card
      handleNext();
    } else {
      setDragDirection(null);
    }

    // Set a very small timeout to clear the drag flag after click events process
    setTimeout(() => {
      dragOccurred.current = false;
    }, 150);
  };

  const handleDragUpdate = (event: any, info: any) => {
    if (Math.abs(info.offset.x) > 10) {
      dragOccurred.current = true;
    }
    const x = info.offset.x;
    if (x > 110) {
      setDragDirection('right');
    } else if (x < -110) {
      setDragDirection('left');
    } else {
      setDragDirection(null);
    }
  };

  const isLight = theme === 'light';

  return (
    <div
      className={`relative w-full overflow-hidden border-b transition-all duration-750 ${isLight ? 'border-stone-200/50 bg-white/30 backdrop-blur-md shadow-sm' : 'border-zinc-900 bg-zinc-950'
        }`}
      id="hero-banner-container"
    >
      {/* Background Cinematic Atmosphere */}

      <div className={`select-none pointer-events-none z-0 ${isLight ? 'fixed inset-0' : 'absolute inset-0 overflow-hidden'}`}>
        {/* Dynamic transition background trailer video & fallback */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMovie.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className={`absolute inset-0 w-full h-full ${isLight ? 'bg-stone-50/10' : 'bg-black'}`}
          >
            {activeMovie.localVideoUrl ? (
              <div className={`absolute inset-0 w-full h-full ${isLight ? 'opacity-[0.25] md:opacity-[0.32]' : 'opacity-[0.10] md:opacity-[0.12]'} transition-opacity duration-1000 overflow-hidden`}>
                <video
                  src={activeMovie.localVideoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover pointer-events-none border-0"
                />
              </div>
            ) : activeMovie.trailerYoutubeId ? (
              <div className={`absolute inset-0 w-full h-full ${isLight ? 'opacity-[0.25] md:opacity-[0.32]' : 'opacity-[0.10] md:opacity-[0.12]'} transition-opacity duration-1000 overflow-hidden`}>
                <iframe
                  src={`https://www.youtube.com/embed/${activeMovie.trailerYoutubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${activeMovie.trailerYoutubeId}&modestbranding=1&playsinline=1&rel=0&enablejsapi=1`}
                  title={`${activeMovie.title} Trailer`}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[135%] h-[135%] md:w-[125%] md:h-[125%] object-cover pointer-events-none border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            ) : null}

            {/* Backdrop image overlay (acts as fallback and blending layer) */}
            <div className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${(activeMovie.localVideoUrl || activeMovie.trailerYoutubeId) ? (isLight ? 'opacity-20' : 'opacity-20') : (isLight ? 'opacity-[0.35]' : 'opacity-38')}`}>
              {activeMovie.backdropUrl ? (
                <img
                  src={activeMovie.backdropUrl}
                  alt=""
                  className={`w-full h-full object-cover scale-[1.03] filter blur-[4px] ${isLight ? 'saturate-[0.5]' : 'saturate-[0.8]'}`}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{ background: activeMovie.backdrop }}
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Ambient Overlay Color to fuse with theme */}
        <div
          className="absolute inset-0 mix-blend-color transition-colors duration-1000 z-10"
          style={{ backgroundColor: `${activeMovie.accentColor}12` }}
        />

        {/* Dynamic atmospheric radial glow centering on activeMovie accentColor */}
        <div
          className="absolute inset-0 transition-opacity duration-1000 z-10"
          style={{
            background: isLight
              ? `radial-gradient(circle at 40% 50%, ${activeMovie.accentColor}08 0%, transparent 65%)`
              : `radial-gradient(circle at 40% 50%, ${activeMovie.accentColor}12 0%, transparent 65%)`
          }}
        />

        {/* Vignette Gradients for superb typographic legibility and layout containment */}
        <div className={`absolute inset-0 bg-gradient-to-r ${isLight ? 'from-white/60 via-white/40 to-transparent' : 'from-zinc-950 via-zinc-950/80 to-transparent'} z-15`} />
        <div className={`absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t ${isLight ? 'from-white/60' : 'from-zinc-950'} to-transparent z-15`} />
        <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${isLight ? 'from-white/40' : 'from-zinc-950'} to-transparent z-15`} />
      </div>



      {/* Hero Content Grid Container */}
      <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-20 sm:px-6 lg:px-8 z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[480px]">

          {/* Left Column: Movie Information (Interactive & Animated) */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-start text-left min-h-[380px] justify-center">

            <AnimatePresence mode="wait">
              <motion.div
                key={activeMovie.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="flex flex-col items-start gap-4"
              >
                {/* Blockbuster Badge */}
                <div
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest border transition-all duration-300"
                  style={{
                    borderColor: `${activeMovie.accentColor}30`,
                    color: activeMovie.accentColor,
                    backgroundColor: `${activeMovie.accentColor}08`
                  }}
                >
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                  <span>Blockbuster Spotlight</span>
                </div>

                {/* Real Movie Logo Image with fallback */}
                <div className="h-16 md:h-22 min-h-[64px] flex items-center mb-1">
                  {activeMovie.logoUrl ? (
                    <img
                      src={activeMovie.logoUrl}
                      alt={`${activeMovie.title} Logo`}
                      className={`max-h-full max-w-[280px] sm:max-w-[380px] object-contain select-none filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]`}
                      style={{
                        filter: activeMovie.id === 'm1'
                          ? 'drop-shadow(0 0 16px rgba(255,184,0,0.25)) brightness(1.2)'
                          : activeMovie.id === 'm4'
                            ? 'brightness(0) invert(1) drop-shadow(0 0 16px rgba(245,158,11,0.2))'
                            : 'brightness(0) invert(1) drop-shadow(0 0 16px rgba(255,255,255,0.15))'
                      }}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallbackText = document.getElementById(`logo-fallback-${activeMovie.id}`);
                        if (fallbackText) fallbackText.style.display = 'block';
                      }}
                    />
                  ) : null}

                  <h1
                    id={`logo-fallback-${activeMovie.id}`}
                    className={`text-4xl sm:text-5xl lg:text-5xl font-black tracking-tight uppercase ${isLight ? 'text-stone-900' : 'text-white'}`}
                    style={{
                      fontFamily: '"Space Grotesk", sans-serif',
                      display: activeMovie.logoUrl ? 'none' : 'block'
                    }}
                  >
                    {activeMovie.title}
                  </h1>
                </div>

                {/* Movie metadata indices */}
                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold">
                  <span className={`rounded px-2.5 py-0.5 text-xs font-bold border ${isLight ? 'bg-stone-200 text-stone-850 border-stone-300/60' : 'bg-zinc-900 text-zinc-300 border-zinc-800'
                    }`}>
                    {activeMovie.rating}
                  </span>
                  <span className={`flex items-center gap-1 ${isLight ? 'text-stone-700' : 'text-zinc-300'}`}>
                    <Clock className="h-4 w-4 text-stone-400" />
                    {activeMovie.duration}
                  </span>
                  <span className={isLight ? 'text-stone-300' : 'text-zinc-700'}>•</span>
                  <span className={`${isLight ? 'text-stone-700 font-semibold' : 'text-zinc-300 font-medium'}`}>{activeMovie.genre.join(', ')}</span>
                  <span className={isLight ? 'text-stone-300' : 'text-zinc-700'}>•</span>
                  <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 border backdrop-blur-md ${isLight ? 'bg-stone-100/80 border-stone-200 text-[#8C1D40]' : 'bg-zinc-900/80 border-zinc-800 text-amber-500'
                    }`}>
                    <Star className={`h-3.5 w-3.5 ${isLight ? 'fill-[#8C1D40] text-[#8C1D40]' : 'fill-amber-500 text-amber-500'}`} />
                    <span className="font-extrabold">{activeMovie.ratingScore}</span>
                    <span className={`text-[10px] font-normal ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>/10 BMS</span>
                  </div>
                </div>

                {/* Synopsis paragraph */}
                <p className={`max-w-xl text-sm sm:text-base leading-relaxed ${isLight ? 'text-stone-750 font-medium' : 'text-zinc-300 font-medium'}`}>
                  {activeMovie.synopsis}
                </p>

                {/* Actor & Director with movie accent decoration */}
                <div
                  className="flex flex-col gap-1.5 border-l-2 pl-4 py-0.5 text-[11px] sm:text-xs tracking-wide transition-colors duration-500"
                  style={{ borderColor: activeMovie.accentColor }}
                >
                  <div className={`text-left ${isLight ? 'text-stone-600' : 'text-zinc-400'}`}>
                    <span className={`font-bold uppercase text-[10px] tracking-wider mr-1 ${isLight ? 'text-stone-900' : 'text-zinc-100'}`}>Starring:</span>
                    {activeMovie.starring.slice(0, 3).join(', ')}
                  </div>
                  <div className={`text-left ${isLight ? 'text-stone-600' : 'text-zinc-400'}`}>
                    <span className={`font-bold uppercase text-[10px] tracking-wider mr-1 ${isLight ? 'text-stone-900' : 'text-zinc-100'}`}>Director:</span>
                    {activeMovie.director}
                  </div>
                </div>

                {/* Instant Ticket Showtimes reservation callback button */}
                <button
                  onClick={() => onBookNow(activeMovie)}
                  className="mt-3 group relative inline-flex items-center gap-2.5 rounded-xl px-6 py-4 text-xs sm:text-sm font-black uppercase tracking-widest text-black shadow-lg transition-all duration-300 active:scale-95 cursor-pointer overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${activeMovie.accentColor} 0%, ${activeMovie.accentColor}dd 100%)`
                  }}
                  id="hero-book-now-button"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Calendar className="h-4 w-4 transition-transform group-hover:rotate-12 duration-300" />
                  <span>Instant Showtimes Reservation</span>
                </button>
              </motion.div>
            </AnimatePresence>

          </div>

          {/* Right Column: 3D Swipeable Stacked Movie Deck */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-6 relative">

            {/* Header for Card Deck with Drag Indicators and Control Nav */}
            <div className="flex items-center justify-between px-2">
              <span className={`text-xs uppercase tracking-widest font-bold font-mono flex items-center gap-2 ${isLight ? 'text-stone-600' : 'text-zinc-400'}`}>
                <Film className={`h-4 w-4 ${isLight ? 'text-[#8C1D40]' : 'text-amber-500'} animate-pulse`} />
                <span>Interlocking Card Deck</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className={`p-2 rounded-lg border backdrop-blur-md transition-all active:scale-90 ${isLight
                      ? 'border-stone-200 bg-white/90 text-stone-600 hover:text-stone-950 hover:border-stone-300'
                      : 'border-zinc-900 bg-zinc-950/80 text-zinc-400 hover:text-white hover:border-zinc-800'
                    }`}
                  aria-label="Previous Spotlight Film"
                  id="btn-spotlight-prev"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className={`text-xs font-mono font-bold select-none ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
                  {(activeIndex + 1).toString().padStart(2, '0')} / {movies.length.toString().padStart(2, '0')}
                </span>
                <button
                  onClick={handleNext}
                  className={`p-2 rounded-lg border backdrop-blur-md transition-all active:scale-90 ${isLight
                      ? 'border-stone-200 bg-white/90 text-stone-600 hover:text-stone-950 hover:border-stone-300'
                      : 'border-zinc-900 bg-zinc-950/80 text-zinc-400 hover:text-white hover:border-zinc-800'
                    }`}
                  aria-label="Next Spotlight Film"
                  id="btn-spotlight-next"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Interactive 3D Stack Area */}
            <div
              className="relative w-full h-[400px] flex items-center justify-center select-none"
              style={{ perspective: '1000px' }}
            >
              <AnimatePresence initial={false}>
                {movies.map((movie, idx) => {
                  // Calculate its place in stack rotation
                  // How far is it from active card?
                  const diff = (idx - activeIndex + movies.length) % movies.length;
                  const isTop = diff === 0;

                  // Only render the top 3 cards for clean performance and realistic appearance
                  if (diff >= 3) return null;

                  // Styling layers for cards stacked behind - fanned out beautifully like a card game
                  const scale = 1 - diff * 0.045;
                  const xOffset = diff * 32; // Fan out horizontally to stick out on the right
                  const yOffset = -diff * 8; // Elevate slightly for a layered physical fan out
                  const zOffset = -diff * 35;
                  const rotate = diff * 7; // Rotate progressively to complete the realistic fan-out feel

                  // Calculate dynamic depth style attributes
                  const zIndex = movies.length - diff;
                  const opacity = 1 - diff * 0.15; // Higher opacity for back cards so they are visible

                  return (
                    <motion.div
                      key={movie.id}
                      style={{
                        zIndex,
                        transformOrigin: 'bottom left', // pivots from bottom-left for realistic fanning rotation
                        touchAction: 'none'
                      }}
                      animate={{
                        scale,
                        x: isTop ? 0 : xOffset,
                        y: isTop ? 0 : yOffset,
                        z: zOffset,
                        rotate: isTop ? 0 : rotate,
                        opacity,
                        filter: isTop ? 'blur(0px)' : 'blur(0.2px)'
                      }}
                      initial={false}
                      transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 24
                      }}
                      // Handlers to support intuitive swipe-dragging on top card
                      drag={isTop ? 'x' : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.35}
                      onDragStart={() => {
                        dragOccurred.current = false;
                      }}
                      onDrag={(e, info) => isTop && handleDragUpdate(e, info)}
                      onDragEnd={(e, info) => isTop && handleDragEnd(e, info)}
                      onTap={() => {
                        if (isTop) {
                          if (onSelectMovie) {
                            onSelectMovie(movie);
                          } else {
                            onBookNow(movie);
                          }
                        } else {
                          setActiveIndex(idx);
                        }
                      }}
                      className={`absolute w-60 sm:w-64 aspect-[2/3] max-w-full rounded-2xl cursor-pointer shadow-2xl overflow-hidden transition-shadow duration-500 ${isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-auto'
                        }`}
                    >
                      {/* Interactive physical border highlight reflecting movie's personal vibe */}
                      <div
                        className="absolute inset-0 border rounded-2xl pointer-events-none z-30 transition-all duration-500"
                        style={{
                          borderColor: isTop ? movie.accentColor : (isLight ? '#e5e7eb' : '#18181b'),
                          boxShadow: isTop ? `inset 0 0 20px ${movie.accentColor}1c` : 'none'
                        }}
                      />

                      {/* Poster Image (Bypassing CORS on iframe sandbox environment via direct img and no-referrer policy) */}
                      {movie.posterUrl ? (
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="absolute inset-0 w-full h-full object-cover z-10 select-none pointer-events-none"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            // On the offchance TMDB doesn't load, use an aesthetic vector card
                            e.currentTarget.style.display = 'none';
                            const replacement = document.getElementById(`backup-card-${movie.id}`);
                            if (replacement) replacement.style.display = 'flex';
                          }}
                        />
                      ) : null}

                      {/* Dynamic Gradient Backup Display */}
                      <div
                        id={`backup-card-${movie.id}`}
                        className="absolute inset-0 z-10 flex flex-col justify-between p-5 bg-gradient-to-br from-zinc-850 to-zinc-950 text-left select-none pointer-events-none"
                        style={{ display: movie.posterUrl ? 'none' : 'flex' }}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`text-[10px] font-black tracking-widest border border-zinc-700/50 rounded px-2 py-0.5 text-zinc-300`}>
                            {movie.rating}
                          </span>
                          <Film className="h-4 w-4 text-zinc-650" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500">
                            {movie.genre[0]}
                          </span>
                          <h4 className="font-black text-white text-md uppercase leading-tight">
                            {movie.title}
                          </h4>
                        </div>
                      </div>

                      {/* Content Dark Contrast Vignette inside Poster Card */}
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-25 pointer-events-none" />

                      {/* Tactical Swipe cue banner overlays on top card */}
                      {isTop && dragDirection === 'left' && (
                        <div className="absolute inset-0 bg-red-600/30 z-20 flex items-center justify-center backdrop-blur-[1px] transition-all">
                          <span className="border-4 border-red-500 text-red-500 font-black tracking-widest text-xs uppercase px-4 py-2 rounded-xl rotate-[-12deg]">
                            NEXT SPOTLIGHT
                          </span>
                        </div>
                      )}

                      {isTop && dragDirection === 'right' && (
                        <div className="absolute inset-0 bg-green-500/20 z-20 flex items-center justify-center backdrop-blur-[1px] transition-all">
                          <span className="border-4 border-green-500 text-green-500 font-black tracking-widest text-xs uppercase px-4 py-2 rounded-xl rotate-[12deg]">
                            PREV SPOTLIGHT
                          </span>
                        </div>
                      )}

                      {/* Details overlay inside the Card itself */}
                      <div className="absolute bottom-4 left-4 right-4 z-25 flex flex-col items-start text-left pointer-events-none">
                        <span
                          className="text-[9px] uppercase font-black tracking-widest mb-0.5"
                          style={{ color: movie.accentColor }}
                        >
                          {movie.genre[0]}
                        </span>
                        <h4 className="text-white font-black text-sm uppercase leading-tight font-sans line-clamp-1">
                          {movie.title}
                        </h4>

                        <div className="flex items-center gap-1.5 mt-1 text-[10px] text-zinc-300 font-bold">
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                          <span>{movie.ratingScore}</span>
                          <span className="text-zinc-600">•</span>
                          <span>{movie.duration}</span>
                        </div>
                      </div>

                      {/* Overlay card highlight hover reflection */}
                      <div
                        className="absolute inset-0 opacity-0 hover:opacity-10 transition-opacity duration-300 z-15 pointer-events-none"
                        style={{ backgroundColor: movie.accentColor }}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Micro instructions beneath card stack */}
            <div className={`flex items-center justify-center gap-2 text-[11px] font-bold select-none ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
              <span className="animate-pulse">Swipe Stack Card Left / Right or Click to Cycle Cards</span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
