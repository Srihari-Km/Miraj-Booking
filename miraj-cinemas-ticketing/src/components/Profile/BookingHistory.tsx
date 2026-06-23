/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar, Film, MapPin, Tag, Armchair, Ticket } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

interface BookingHistoryProps {
  theme?: 'dark' | 'light';
}

export default function BookingHistory({ theme = 'dark' }: BookingHistoryProps) {
  const { bookingHistory } = useUser();
  const isLight = theme === 'light';

  if (!bookingHistory || bookingHistory.length === 0) {
    return (
      <div className={`flex flex-col items-center gap-4 py-16 text-center rounded-2xl border border-dashed ${
        isLight ? 'border-stone-200 text-stone-400 bg-white' : 'border-zinc-800 text-zinc-500 bg-zinc-950/20'
      }`}>
        <div className={`h-16 w-16 rounded-full flex items-center justify-center ${isLight ? 'bg-stone-100' : 'bg-zinc-900'}`}>
          <Ticket className={`h-8 w-8 ${isLight ? 'text-stone-300' : 'text-zinc-600'}`} />
        </div>
        <div>
          <h3 className={`font-bold text-base ${isLight ? 'text-stone-850' : 'text-zinc-200'}`}>No bookings yet</h3>
          <p className="text-xs mt-1 max-w-[280px] leading-relaxed mx-auto">
            You haven't booked any movies yet. Explore now showing films to make your first reservation!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {bookingHistory.map((booking) => {
        // Format booking date
        const formattedDate = new Date(booking.bookedAt).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        return (
          <div
            key={booking.bookingId}
            className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-md ${
              isLight
                ? 'border-stone-200 bg-white shadow-sm text-stone-800'
                : 'border-zinc-800 bg-zinc-900/30 text-zinc-200'
            }`}
          >
            <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                    isLight ? 'bg-stone-100 text-stone-600' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {booking.screenType || '2D'}
                  </span>
                  <span className={`text-[10px] font-mono tracking-wider font-semibold ${
                    isLight ? 'text-stone-400' : 'text-zinc-500'
                  }`}>
                    ID: {booking.bookingId}
                  </span>
                </div>
                
                <h3 className={`text-base font-black tracking-tight ${isLight ? 'text-stone-900' : 'text-white'}`}>
                  {booking.movieTitle}
                </h3>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-stone-500">
                  <div className="flex items-center gap-1.5">
                    <Film className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                    <span>{booking.theaterName} · {booking.city}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span>{booking.showtime}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-row md:flex-col justify-between items-center md:items-end gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-dashed border-stone-200 dark:border-zinc-800">
                <div className="flex flex-col md:items-end">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">Total Paid</span>
                  <span className={`text-lg font-black ${isLight ? 'text-[#8C1D40]' : 'text-amber-500'}`}>
                    ₹{booking.finalTotal}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs">
                  <Armchair className="h-3.5 w-3.5 shrink-0" />
                  <span className="font-bold">
                    Seats: {booking.selectedSeatIds.join(', ')}
                  </span>
                </div>
              </div>
            </div>

            <div className={`mt-4 pt-3.5 border-t border-dashed flex justify-between items-center text-[10px] ${
              isLight ? 'border-stone-100 text-stone-400' : 'border-zinc-800/80 text-zinc-500'
            }`}>
              <span>Booked on {formattedDate}</span>
              <span className="flex items-center gap-1 font-bold text-green-500">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                Confirmed & Active
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
