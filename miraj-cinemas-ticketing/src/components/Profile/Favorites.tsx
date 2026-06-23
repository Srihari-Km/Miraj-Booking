/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, Star, Clock, Play } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { useBooking } from '../../contexts/BookingContext';
import { MOCK_MOVIES } from '../../data/mockData';

interface FavoritesProps {
  theme?: 'dark' | 'light';
}

export default function Favorites({ theme = 'dark' }: FavoritesProps) {
  const { profile, removeFavorite } = useUser();
  const { handleSelectMovie } = useBooking();
  const isLight = theme === 'light';

  const favoriteMovies = MOCK_MOVIES.filter(movie =>
    profile?.favoriteMovieIds?.includes(movie.id)
  );

  if (favoriteMovies.length === 0) {
    return (
      <div className={`flex flex-col items-center gap-4 py-16 text-center rounded-2xl border border-dashed ${
        isLight ? 'border-stone-200 text-stone-400 bg-white' : 'border-zinc-800 text-zinc-500 bg-zinc-950/20'
      }`}>
        <div className={`h-16 w-16 rounded-full flex items-center justify-center ${isLight ? 'bg-stone-100' : 'bg-zinc-900'}`}>
          <Heart className={`h-8 w-8 ${isLight ? 'text-stone-300' : 'text-zinc-600'}`} />
        </div>
        <div>
          <h3 className={`font-bold text-base ${isLight ? 'text-stone-850' : 'text-zinc-200'}`}>No favorites yet</h3>
          <p className="text-xs mt-1 max-w-[280px] leading-relaxed mx-auto">
            Explore our movie catalog and tap the heart icon on any movie to build your personalized watchlist!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {favoriteMovies.map(movie => (
        <div
          key={movie.id}
          onClick={() => handleSelectMovie(movie)}
          className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer ${
            isLight
              ? 'border-stone-200 bg-white text-stone-800'
              : 'border-zinc-800 bg-zinc-900/30 text-zinc-200 hover:border-zinc-700'
          }`}
        >
          {/* Movie Poster Background */}
          <div className="relative aspect-[16/10] overflow-hidden">
            {movie.backdropUrl ? (
              <img
                src={movie.backdropUrl}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-zinc-850 flex items-center justify-center">
                <Play className="h-8 w-8 text-zinc-600" />
              </div>
            )}
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Floating Badges */}
            <div className="absolute top-3 left-3 flex gap-1.5 z-10">
              <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-md border border-white/10">
                {movie.rating}
              </span>
              <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded bg-amber-500 text-black backdrop-blur-md flex items-center gap-1 font-bold">
                <Star className="h-3 w-3 fill-black shrink-0" />
                {movie.ratingScore}
              </span>
            </div>

            {/* Heart Button */}
            <button
              onClick={e => {
                e.stopPropagation();
                removeFavorite(movie.id);
              }}
              title="Remove from favorites"
              className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/60 text-red-500 border border-white/10 flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-pointer hover:bg-red-500 hover:text-white"
            >
              <Heart className="h-4 w-4 fill-current" />
            </button>
          </div>

          {/* Details */}
          <div className="p-4 flex flex-col gap-2">
            <h3 className={`text-sm font-black tracking-tight line-clamp-1 group-hover:text-amber-500 transition-colors ${
              isLight ? 'text-stone-900' : 'text-white'
            }`}>
              {movie.title}
            </h3>

            <div className="flex items-center gap-2 text-[10px] font-semibold text-stone-500 dark:text-zinc-500">
              <Clock className="h-3 w-3" />
              <span>{movie.duration}</span>
              <span>·</span>
              <span className="truncate">{movie.genre.join(', ')}</span>
            </div>

            <p className="text-[11px] leading-relaxed line-clamp-2 text-stone-400 dark:text-zinc-400 mt-1">
              {movie.synopsis}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
