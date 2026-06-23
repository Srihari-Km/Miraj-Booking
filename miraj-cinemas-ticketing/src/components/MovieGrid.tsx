/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Film, Clock, Star, Sparkles, Search, RotateCcw, X, SlidersHorizontal } from 'lucide-react';
import { Movie, City } from '../types';

interface MovieGridProps {
  movies: Movie[];
  currentCity: City;
  onSelectMovie: (movie: Movie) => void;
  theme?: 'dark' | 'light';
}

export default function MovieGrid({
  movies,
  currentCity,
  onSelectMovie,
  theme = 'dark'
}: MovieGridProps) {
  const isLight = theme === 'light';

  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedRating, setSelectedRating] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('default');

  const filteredMovies = useMemo(() => {
    let result = [...movies];

    // Search query filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.director.toLowerCase().includes(q) ||
        m.starring.some(actor => actor.toLowerCase().includes(q)) ||
        m.genre.some(g => g.toLowerCase().includes(q))
      );
    }

    // Genre filter
    if (selectedGenre !== 'All') {
      result = result.filter(m => m.genre.includes(selectedGenre));
    }

    // Rating (Certification) filter
    if (selectedRating !== 'All') {
      result = result.filter(m => m.rating === selectedRating);
    }

    // Sorting
    if (sortBy === 'rating') {
      result.sort((a, b) => b.ratingScore - a.ratingScore);
    } else if (sortBy === 'duration') {
      const parseDuration = (dStr: string) => {
        const hMatch = dStr.match(/(\d+)h/);
        const mMatch = dStr.match(/(\d+)m/);
        const hrs = hMatch ? parseInt(hMatch[1], 10) : 0;
        const mins = mMatch ? parseInt(mMatch[1], 10) : 0;
        return (hrs * 60) + mins;
      };
      result.sort((a, b) => parseDuration(b.duration) - parseDuration(a.duration));
    }

    return result;
  }, [movies, searchQuery, selectedGenre, selectedRating, sortBy]);

  const getMovieVisualAccent = (rating: Movie['rating']) => {
    if (isLight) {
      if (rating === 'U') return 'border-emerald-300 text-emerald-700 bg-emerald-50';
      if (rating === 'UA') return 'border-amber-300 text-amber-700 bg-amber-50';
      return 'border-rose-300 text-rose-700 bg-rose-50';
    } else {
      if (rating === 'U') return 'border-green-500 text-green-400 bg-green-500/10';
      if (rating === 'UA') return 'border-amber-500 text-amber-400 bg-amber-500/10';
      return 'border-red-500 text-red-500 bg-red-500/10';
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" id="now-showing-section">

      {/* Dynamic Grid Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-left">
          <h2 className={`text-2xl font-black uppercase tracking-tight flex items-center gap-2 ${isLight ? 'text-stone-900' : 'text-white'
            }`} style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
            <Film className={`h-5 w-5 ${isLight ? 'text-[#8C1D40]' : 'text-amber-500'}`} />
            <span>Now Showing</span>
          </h2>
          <p className={`text-xs font-semibold mt-0.5 ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
            Screening across {currentCity} multiplexes • Active ticketing counters open
          </p>
        </div>

        <div className={`text-xs font-mono uppercase flex items-center gap-1.5 self-start sm:self-auto ${isLight ? 'text-stone-400' : 'text-zinc-500'
          }`}>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Ticket Engine Secured</span>
        </div>
      </div>

      <div className={`mb-8 p-5 rounded-2xl border transition-all duration-300 ${isLight
          ? 'bg-white/40 border-stone-200/60 shadow-sm backdrop-blur-md'
          : 'bg-zinc-900/40 border-zinc-900'
        }`}>
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">

          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${isLight ? 'text-stone-400' : 'text-zinc-550'
              }`} />
            <input
              type="text"
              placeholder="Search movie title, director, cast..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-10 py-2.5 text-xs font-semibold rounded-xl border outline-none transition-all duration-300 backdrop-blur-xs ${isLight
                  ? 'bg-white/60 border-stone-200/80 text-stone-900 placeholder-stone-500 focus:border-[#8C1D40]/50 focus:bg-white/90 focus:ring-2 focus:ring-[#8C1D40]/10'
                  : 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10'
                }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors ${isLight ? 'hover:bg-stone-150 text-stone-400' : 'hover:bg-zinc-800 text-zinc-500'
                  }`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Filters controls */}
          <div className="flex flex-wrap items-center gap-4">

            {/* Genre Filter Select */}
            <div className="flex flex-col items-start gap-1">
              <span className={`text-[9px] font-mono font-bold uppercase tracking-wider ${isLight ? 'text-stone-400' : 'text-zinc-550'}`}>Genre</span>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border outline-none transition-colors cursor-pointer backdrop-blur-xs ${isLight
                    ? 'bg-white/60 border-stone-200 text-stone-850 hover:bg-stone-100/80'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-200 hover:bg-zinc-900'
                  }`}
              >
                <option value="All">All Genres</option>
                <option value="Action">Action</option>
                <option value="Adventure">Adventure</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Drama">Drama</option>
                <option value="Thriller">Thriller</option>
                <option value="Comedy">Comedy</option>
                <option value="Horror">Horror</option>
              </select>
            </div>

            {/* Certification / Rating Filter */}
            <div className="flex flex-col items-start gap-1">
              <span className={`text-[9px] font-mono font-bold uppercase tracking-wider ${isLight ? 'text-stone-400' : 'text-zinc-555'}`}>Certification</span>
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border outline-none transition-colors cursor-pointer backdrop-blur-xs ${isLight
                    ? 'bg-white/60 border-stone-200 text-stone-850 hover:bg-stone-100/80'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-200 hover:bg-zinc-900'
                  }`}
              >
                <option value="All">All Ratings</option>
                <option value="U">U (Universal)</option>
                <option value="UA">UA (Parental Guidance)</option>
                <option value="A">A (Adults Only)</option>
              </select>
            </div>

            {/* Sort By Filter */}
            <div className="flex flex-col items-start gap-1">
              <span className={`text-[9px] font-mono font-bold uppercase tracking-wider ${isLight ? 'text-stone-400' : 'text-zinc-550'}`}>Sort By</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border outline-none transition-colors cursor-pointer ${isLight
                    ? 'bg-white border-stone-200 text-stone-850 hover:bg-stone-100'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-200 hover:bg-zinc-900'
                  }`}
              >
                <option value="default">Release Relevance</option>
                <option value="rating">Rating (High to Low)</option>
                <option value="duration">Duration (Long to Short)</option>
              </select>
            </div>

            {/* Reset Filters button */}
            {(selectedGenre !== 'All' || selectedRating !== 'All' || searchQuery !== '' || sortBy !== 'default') && (
              <button
                onClick={() => {
                  setSelectedGenre('All');
                  setSelectedRating('All');
                  setSearchQuery('');
                  setSortBy('default');
                }}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer self-end ${isLight
                    ? 'bg-stone-200 hover:bg-stone-300 border-stone-300 text-stone-700'
                    : 'bg-zinc-800 hover:bg-zinc-750 border-zinc-700 text-zinc-200'
                  }`}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            )}

          </div>
        </div>

        {/* Quick Horizontal Scrollable Genre Tag Pills */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-dashed overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap border-stone-200 dark:border-zinc-800">
          <span className={`text-[10px] font-mono uppercase tracking-wider select-none mr-2 ${isLight ? 'text-stone-400' : 'text-zinc-550'}`}>Quick Genre Tags:</span>
          {['All', 'Action', 'Sci-Fi', 'Drama', 'Adventure', 'Thriller', 'Comedy'].map((genre) => {
            const isActive = selectedGenre === genre;
            return (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`text-[10px] font-bold px-3 py-1 rounded-full transition-all border cursor-pointer select-none ${isActive
                    ? isLight
                      ? 'bg-[#8C1D40] text-white border-[#8C1D40]'
                      : 'bg-amber-500 text-black border-amber-500'
                    : isLight
                      ? 'bg-white/50 hover:bg-stone-100 border-stone-200 text-stone-600 backdrop-blur-xs'
                      : 'bg-zinc-950 hover:bg-zinc-900 border-zinc-850 text-zinc-400'
                  }`}
              >
                {genre === 'All' ? 'All Genres' : genre}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Movie Cards */}
      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {filteredMovies.map((movie) => {
            return (
              <div
                key={movie.id}
                onClick={() => onSelectMovie(movie)}
                className={`group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer select-none border ${isLight
                    ? 'border-stone-200 bg-white/60 hover:bg-white/85 hover:border-[#8C1D40]/30 hover:shadow-xl shadow-md backdrop-blur-md'
                    : 'border-zinc-900 bg-zinc-905 hover:border-zinc-700/80 shadow-2xl'
                  }`}

                id={`movie-card-${movie.id}`}
              >

                {/* Poster Container */}
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950 flex flex-col justify-end">
                  {movie.posterUrl ? (
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-700" style={{ background: movie.backdrop }}>
                      <Film className="h-10 w-10 opacity-45" />
                    </div>
                  )}
                  {/* Immersive overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent z-10" />

                  {/* Rating score overlay */}
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-1 rounded bg-black/80 backdrop-blur-md px-2 py-0.5 border border-zinc-800 text-[10px] font-bold text-amber-400">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500 shrink-0" />
                    <span className="font-extrabold">{movie.ratingScore}</span>
                  </div>

                  {/* Duration and rating certifications */}
                  <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between">
                    <span className={`rounded px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border ${getMovieVisualAccent(movie.rating)}`}>
                      {movie.rating}
                    </span>
                    <span className="text-[10px] font-semibold text-zinc-200 bg-black/50 backdrop-blur px-1.5 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider">
                      <Clock className="h-3 w-3 text-zinc-400" />
                      {movie.duration}
                    </span>
                  </div>
                </div>

                {/* Title & Genres */}
                <div className={`p-4 flex flex-col flex-1 items-start justify-between text-left gap-1 border-t w-full transition-colors duration-300 ${isLight
                    ? 'bg-stone-50/90 border-stone-100'
                    : 'bg-zinc-900/60 border-zinc-900/40'
                  }`}>
                  <div className="w-full">
                    <h3
                      className={`text-base font-black uppercase transition-colors line-clamp-1 leading-snug ${isLight
                          ? 'text-stone-900 group-hover:text-[#8C1D40]'
                          : 'text-white group-hover:text-amber-400'
                        }`}
                      style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                    >
                      {movie.title}
                    </h3>
                    <p className={`text-[10px] font-bold truncate mt-0.5 ${isLight ? 'text-stone-500' : 'text-zinc-500'
                      }`}>
                      {movie.genre.slice(0, 3).join(' / ')}
                    </p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className={`text-center py-16 px-4 rounded-2xl border border-dashed transition-colors ${isLight ? 'border-stone-200 bg-stone-50' : 'border-zinc-800 bg-zinc-900/20'
          }`}>
          <SlidersHorizontal className={`mx-auto h-10 w-10 mb-4 ${isLight ? 'text-stone-450' : 'text-zinc-550'
            }`} />
          <h3 className={`text-base font-bold uppercase tracking-tight ${isLight ? 'text-stone-900' : 'text-white'
            }`} style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
            No Matching Screenings Found
          </h3>
          <p className={`text-xs mt-1.5 mb-5 max-w-sm mx-auto ${isLight ? 'text-stone-500' : 'text-zinc-400'
            }`}>
            We couldn't find any movies that match your search query or active filter combination.
          </p>
          <button
            onClick={() => {
              setSelectedGenre('All');
              setSelectedRating('All');
              setSearchQuery('');
              setSortBy('default');
            }}
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all border cursor-pointer ${isLight
                ? 'bg-[#8C1D40] text-white border-[#8C1D40] hover:bg-[#8C1D40]/90'
                : 'bg-amber-500 text-black border-amber-500 hover:bg-amber-400'
              }`}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Clear All Filters</span>
          </button>
        </div>
      )}

    </section>
  );
}
