/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, Bell, BellOff, Star, Film, Sparkles } from 'lucide-react';

interface UpcomingShowsProps {
  theme?: 'dark' | 'light';
}

interface UpcomingMovie {
  id: string;
  title: string;
  genre: string[];
  duration: string;
  expectedRating: string;
  releaseDate: string;
  director: string;
  starring: string[];
  posterUrl: string;
  languages: string[];
  color: string;
}

export default function UpcomingShows({ theme = 'dark' }: UpcomingShowsProps) {
  const isLight = theme === 'light';
  const [notifiedIds, setNotifiedIds] = useState<string[]>([]);
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [toastMovieTitle, setToastMovieTitle] = useState('');

  const upcomingMovies: UpcomingMovie[] = [
    {
      id: 'up-1',
      title: 'Avatar: Fire and Ash',
      genre: ['Sci-Fi', 'Adventure', 'Action'],
      duration: '3h 10m',
      expectedRating: '9.6',
      releaseDate: '18 Dec 2026',
      director: 'James Cameron',
      starring: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver'],
      posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&h=750&fit=crop&q=80',
      languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
      color: '#0EA5E9' // Sky blue
    },
    {
      id: 'up-2',
      title: 'Avengers: Doomsday',
      genre: ['Action', 'Sci-Fi', 'Fantasy'],
      duration: '2h 45m',
      expectedRating: '9.8',
      releaseDate: '01 May 2026',
      director: 'Russo Brothers',
      starring: ['Robert Downey Jr.', 'Pedro Pascal', 'Benedict Cumberbatch'],
      posterUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&h=750&fit=crop&q=80',
      languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
      color: '#DC2626' // Red
    },
    {
      id: 'up-3',
      title: 'Superman',
      genre: ['Action', 'Adventure', 'Sci-Fi'],
      duration: '2h 30m',
      expectedRating: '9.3',
      releaseDate: '11 Jul 2025',
      director: 'James Gunn',
      starring: ['David Corenswet', 'Rachel Brosnahan', 'Nicholas Hoult'],
      posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&h=750&fit=crop&q=80',
      languages: ['English', 'Hindi'],
      color: '#0052B4' // Royal blue
    },
    {
      id: 'up-4',
      title: 'Spider-Man: Beyond the Spider-Verse',
      genre: ['Animation', 'Action', 'Sci-Fi'],
      duration: '2h 20m',
      expectedRating: '9.7',
      releaseDate: 'TBA 2026',
      director: 'Joaquim Dos Santos',
      starring: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac'],
      posterUrl: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=500&h=750&fit=crop&q=80',
      languages: ['English', 'Hindi', 'Tamil'],
      color: '#E11D48' // Rose
    }
  ];

  const handleNotifyToggle = (id: string, title: string) => {
    if (notifiedIds.includes(id)) {
      setNotifiedIds(prev => prev.filter(item => item !== id));
    } else {
      setNotifiedIds(prev => [...prev, id]);
      setToastMovieTitle(title);
      setShowNotificationToast(true);
      setTimeout(() => {
        setShowNotificationToast(false);
      }, 5000);
    }
  };

  return (
    <div className={`mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-left relative ${
      isLight ? 'text-stone-900' : 'text-zinc-100'
    }`} id="upcoming-shows-container">
      
      {/* Toast Notification Alert */}
      {showNotificationToast && (
        <div 
          className={`fixed top-20 right-4 sm:right-8 z-50 max-w-md border-2 rounded-2xl p-4 shadow-xl animate-in slide-in-from-right duration-300 text-left ${
            isLight
              ? 'bg-white border-[#8C1D40] text-stone-900 shadow-[#8C1D40]/10'
              : 'bg-zinc-950 border-amber-500 text-white shadow-amber-500/10'
          }`}
          id="toast-notification-bell"
        >
          <div className="flex gap-3 items-center">
            <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 border ${
              isLight 
                ? 'bg-[#8C1D40]/10 border-[#8C1D40]/30 text-[#8C1D40]'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-500'
            }`}>
              <Bell className="h-5 w-5 animate-bounce" />
            </div>
            <div>
              <h5 className="font-bold text-xs uppercase tracking-widest font-mono">Notification Saved</h5>
              <p className="text-xs leading-normal mt-0.5">
                You will be notified as soon as advanced ticket booking opens for **{toastMovieTitle}**!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* View Header */}
      <div className="mb-8 border-b pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-zinc-900">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className={`h-5 w-5 ${isLight ? 'text-[#8C1D40]' : 'text-amber-500'}`} />
            <span className={`text-[10px] font-bold tracking-widest uppercase font-mono ${
              isLight ? 'text-[#8C1D40]' : 'text-amber-500'
            }`}>
              COMING SOON TO SCREENS
            </span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight mt-1" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
            Upcoming Blockbusters
          </h1>
          <p className={`text-xs mt-1 ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
            Explore highly anticipated releases scheduled for the local Miraj Cinemas multiplex. Set alerts to catch tickets on release day.
          </p>
        </div>
      </div>

      {/* Upcoming Movies Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {upcomingMovies.map((movie) => {
          const isNotified = notifiedIds.includes(movie.id);
          return (
            <div
              key={movie.id}
              className={`relative rounded-2xl border flex flex-col overflow-hidden transition-all duration-300 group hover:-translate-y-1 ${
                isLight 
                  ? 'bg-white border-stone-200 shadow-sm hover:shadow-md'
                  : 'bg-zinc-950 border-zinc-900 shadow-xl'
              }`}
            >
              {/* Image Container */}
              <div className="relative aspect-[2/3] w-full overflow-hidden flex flex-col justify-end border-b border-zinc-900">
                <img 
                  src={movie.posterUrl} 
                  alt={movie.title}
                  className="absolute inset-0 h-full w-full object-cover z-0 transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent z-10" />

                {/* Release date top tag */}
                <div className="absolute top-4 left-4 z-20 rounded bg-black/85 backdrop-blur px-2.5 py-1 text-[9px] font-black border border-zinc-800 text-amber-500 uppercase tracking-widest font-mono">
                  {movie.releaseDate}
                </div>

                {/* Details overlays */}
                <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col items-start text-left pointer-events-none">
                  <div className="flex items-center gap-1">
                    {movie.genre.slice(0, 2).map((g, idx) => (
                      <span key={idx} className="text-[8px] font-mono font-black uppercase tracking-widest text-zinc-400 border border-zinc-700/50 bg-black/60 rounded px-1.5 py-0.2">
                        {g}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-white font-black text-sm uppercase leading-tight font-sans mt-1.5 line-clamp-1">
                    {movie.title}
                  </h3>
                  
                  <div className="flex items-center gap-1.5 mt-1 text-[9px] text-zinc-350 font-bold">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <span>{movie.expectedRating} Expected</span>
                    <span className="text-zinc-600">•</span>
                    <span>{movie.duration}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Section: Info & Actions */}
              <div className="p-4 flex flex-col justify-between flex-1 gap-4 text-left">
                {/* Starring list */}
                <div className="flex flex-col gap-0.5">
                  <span className={`text-[9px] font-bold uppercase tracking-wider ${
                    isLight ? 'text-stone-400' : 'text-zinc-500'
                  }`}>
                    STARRING
                  </span>
                  <p className={`text-xs font-semibold line-clamp-1 ${
                    isLight ? 'text-stone-700' : 'text-zinc-300'
                  }`}>
                    {movie.starring.join(', ')}
                  </p>
                </div>

                {/* Notify Bell Button */}
                <button
                  onClick={() => handleNotifyToggle(movie.id, movie.title)}
                  className={`w-full rounded-xl py-3 text-xs font-black uppercase tracking-widest transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border ${
                    isNotified
                      ? isLight
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm'
                        : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
                      : isLight
                        ? 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-[#8C1D40]/5 hover:border-[#8C1D40]/30 hover:text-[#8C1D40]'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:border-amber-500/30 hover:text-amber-500'
                  }`}
                  id={`btn-notify-movie-${movie.id}`}
                >
                  {isNotified ? (
                    <>
                      <BellOff className="h-3.5 w-3.5" />
                      <span>Disable Alert</span>
                    </>
                  ) : (
                    <>
                      <Bell className="h-3.5 w-3.5 animate-pulse" />
                      <span>Set Booking Alert</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
