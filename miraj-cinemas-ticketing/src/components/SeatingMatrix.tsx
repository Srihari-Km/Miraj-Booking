/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Info, HelpCircle, Armchair, Sparkles, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Movie, Showtime, Seat } from '../types';
import { generateSeatingLayout } from '../data/mockData';
import { useZoom } from '../hooks/useZoom';

interface SeatingMatrixProps {
  movie: Movie;
  showtime: Showtime;
  onBack: () => void;
  onProceedToCheckout: (selectedSeats: Seat[]) => void;
  initialSelectedSeats: Seat[];
  theme?: 'dark' | 'light';
}

export default function SeatingMatrix({
  movie,
  showtime,
  onBack,
  onProceedToCheckout,
  initialSelectedSeats,
  theme = 'dark'
}: SeatingMatrixProps) {
  // Initialize seats using layout generator
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>(
    initialSelectedSeats.map(s => s.id)
  );
  const [cryingSeatIds, setCryingSeatIds] = useState<string[]>([]);

  const isLight = theme === 'light';
  const { scale, zoomIn, zoomOut, resetZoom, handleWheel } = useZoom();

  useEffect(() => {
    // Generate fresh structural layout based on this showtime instance
    const initialLayout = generateSeatingLayout(showtime.id);

    // Support restoring previous selections if the user returns from checkout
    if (initialSelectedSeats.length > 0) {
      const selectedIds = initialSelectedSeats.map(s => s.id);
      const updatedLayout = initialLayout.map(seat => {
        if (selectedIds.includes(seat.id)) {
          return { ...seat, status: 'selected' as const };
        }
        return seat;
      });
      setSeats(updatedLayout);
    } else {
      setSeats(initialLayout);
    }
  }, [showtime, initialSelectedSeats]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.type === 'aisle' || seat.status === 'booked' || cryingSeatIds.includes(seat.id)) return;

    let updatedSeatStatus: 'available' | 'selected';
    let newSelectedSeatIds = [...selectedSeatIds];

    if (selectedSeatIds.includes(seat.id)) {
      updatedSeatStatus = 'available';
      newSelectedSeatIds = newSelectedSeatIds.filter(id => id !== seat.id);

      // Add to cryingSeatIds
      setCryingSeatIds(prev => [...prev, seat.id]);
      setTimeout(() => {
        setCryingSeatIds(prev => prev.filter(id => id !== seat.id));
      }, 1000);
    } else {
      updatedSeatStatus = 'selected';
      newSelectedSeatIds.push(seat.id);
    }

    setSeats(prev =>
      prev.map(s => (s.id === seat.id ? { ...s, status: updatedSeatStatus } : s))
    );
    setSelectedSeatIds(newSelectedSeatIds);
  };

  // Get current active selection seat objects
  const selectedSeatObjects = seats.filter(s => selectedSeatIds.includes(s.id));

  // Running total calculation in real-time based on seat rows
  const totalAmount = selectedSeatObjects.reduce((acc, seat) => {
    const price = seat.type === 'vip'
      ? showtime.priceVIP
      : seat.type === 'premium'
        ? showtime.priceStandard + 150
        : showtime.priceStandard;
    return acc + price;
  }, 0);

  const handleConfirmSelection = () => {
    if (selectedSeatObjects.length === 0) return;
    onProceedToCheckout(selectedSeatObjects);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="seating-matrix-container">

      {/* Back button and quick movie synopsis summary */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between text-left gap-4" id="seating-view-header">
        <button
          onClick={onBack}
          className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors self-start py-2 cursor-pointer ${isLight ? 'text-stone-500 hover:text-[#8C1D40]' : 'text-zinc-400 hover:text-amber-500'
            }`}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Showtimes</span>
        </button>

        <div className="flex flex-col sm:items-end text-left sm:text-right">
          <h3 className={`text-sm font-bold uppercase tracking-wider ${isLight ? 'text-stone-400' : 'text-zinc-450'}`}>Active Reservation</h3>
          <h4 className={`text-xl font-black uppercase mt-0.5 ${isLight ? 'text-stone-900' : 'text-white'}`} style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
            {movie.title}
          </h4>
          <p className={`text-xs font-semibold mt-1 ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>
            {showtime.theaterName} • <span className={isLight ? 'text-[#8C1D40]' : 'text-amber-500'}>{showtime.time}</span> • {showtime.screenType}
          </p>
        </div>
      </div>

      {/* Main interactive area with map and visual anchors */}
      <div className={`rounded-2xl border p-6 sm:p-10 text-center flex flex-col items-center transition-all ${isLight ? 'border-stone-200/60 bg-white/70 shadow-xl text-stone-850 backdrop-blur-md' : 'border-zinc-900 bg-zinc-950 shadow-2xl text-zinc-100'
        }`}>

        {/* Zoom Controls */}
        <div className="flex items-center justify-end w-full mb-4 gap-1.5">
          <span className={`text-[10px] font-mono font-bold mr-1 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>ZOOM</span>
          {[{ icon: ZoomOut, action: zoomOut, id: 'zoom-out', label: 'Zoom out' }, { icon: ZoomIn, action: zoomIn, id: 'zoom-in', label: 'Zoom in' }, { icon: Maximize2, action: resetZoom, id: 'zoom-reset', label: 'Reset zoom' }].map(({ icon: Icon, action, id, label }) => (
            <button
              key={id}
              id={id}
              onClick={action}
              title={label}
              className={`h-7 w-7 rounded-lg border flex items-center justify-center text-xs transition-all hover:scale-110 active:scale-95 cursor-pointer ${isLight ? 'border-stone-200 bg-white text-stone-600 hover:border-[#8C1D40]/40 shadow-sm' : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-amber-500/40'
                }`}
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
          <span className={`text-[10px] font-mono ml-1 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>{Math.round(scale * 100)}%</span>
        </div>

        {/* Curved Glowing Projection Screen */}
        <div className="w-full max-w-2xl mb-12 relative flex flex-col items-center" id="screen-projection-arc">
          {/* Glowing Arc Line */}
          <div className={`w-full h-3 rounded-[50%] bg-gradient-to-b transition-all ${isLight
              ? 'from-[#8C1D40]/55 to-[#8C1D40]/10 shadow-[0_-5px_25px_rgba(140,29,64,0.3)]'
              : 'from-amber-500/50 to-amber-500/5 shadow-[0_-5px_25px_rgba(245,158,11,0.35)]'
            }`} />

          {/* Screen label text */}
          <div className={`text-[10px] font-black tracking-[0.45em] uppercase font-mono mt-4 ${isLight ? 'text-[#8C1D40]/80' : 'text-amber-500/80'
            }`}>
            SCREEN THIS WAY
          </div>

          {/* Faint Projection Light Gradient Overlay */}
          <div className={`absolute top-3 w-[80%] h-24 bg-gradient-to-b pointer-events-none rounded-b-full filter blur-xl ${isLight ? 'from-[#8C1D40]/[0.05]' : 'from-amber-500/[0.04]'
            } to-transparent`} />
        </div>

        {/* Dynamic Auditorium Grid Seating View */}
        <div
          className="w-full overflow-hidden pb-4"
          id="seating-plan-wrapper"
          onWheel={handleWheel}
        >
          <div
            style={{ transform: `scale(${scale})`, transformOrigin: 'top center', transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)' }}
          >
            <div className="min-w-[650px] mx-auto flex flex-col gap-3 py-6 px-4">

              {/* Columns labeling headers */}
              <div className="flex items-center gap-2 mb-2 justify-center pl-8 pr-2">
                <span className={`w-6 text-[10px] font-bold uppercase font-mono ${isLight ? 'text-stone-400' : 'text-zinc-650'}`}>Row</span>
                <div className={`flex-1 grid grid-cols-14 gap-2 text-[10px] font-bold font-mono ${isLight ? 'text-stone-400' : 'text-zinc-650'}`}>
                  {[...Array(14)].map((_, i) => (
                    <div key={i} className="text-center">{i + 1}</div>
                  ))}
                </div>
              </div>

              {/* Structured Rows */}
              {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((rowChar) => {
                const remains = seats.filter(s => s.row === rowChar);
                const isVipRow = rowChar === 'F' || rowChar === 'G';
                const isPremiumRow = rowChar === 'D' || rowChar === 'E';

                return (
                  <div key={rowChar} className="flex items-center gap-2 justify-center pr-2">

                    {/* Left row labels */}
                    <span className={`w-6 text-xs font-black font-mono text-left uppercase ${isLight ? 'text-stone-400' : 'text-zinc-550'}`}>
                      {rowChar}
                    </span>

                    {/* Seat Grid Segment mapping blank AISLE objects */}
                    <div className="flex-1 grid grid-cols-14 gap-2">
                      {remains.map((seat) => {
                        const isAisle = seat.type === 'aisle';
                        const isBooked = seat.status === 'booked';
                        const isSelected = seat.status === 'selected';

                        // Aisle Spacer Block
                        if (isAisle) {
                          return (
                            <div
                              key={seat.id}
                              className={`h-7 w-7 flex items-center justify-center pointer-events-none opacity-20 text-[8px] font-mono font-bold ${isLight ? 'text-stone-300' : 'text-zinc-800'
                                }`}
                              title="Aisle Space"
                            >
                              ••
                            </div>
                          );
                        }

                        // Dynamic styles based on seat state and category
                        let seatColorClass = isLight
                          ? 'border-stone-200 hover:border-[#8C1D40] hover:bg-[#8C1D40]/5 bg-white text-stone-700'
                          : 'border-zinc-700 hover:border-amber-500 hover:bg-zinc-900 bg-zinc-950 text-zinc-400';

                        if (isPremiumRow) {
                          seatColorClass = isLight
                            ? 'border-purple-400/40 hover:border-purple-600 bg-purple-50/40 hover:bg-purple-100/40 text-purple-900'
                            : 'border-purple-500/50 hover:border-purple-400 bg-purple-950/20 hover:bg-purple-950/40 text-purple-300';
                        }

                        if (isVipRow) {
                          seatColorClass = isLight
                            ? 'border-amber-500/40 hover:border-amber-600 bg-amber-50/40 hover:bg-amber-100/40 text-amber-900'
                            : 'border-amber-600/50 hover:border-amber-400 bg-amber-950/20 hover:bg-amber-950/40 text-amber-300';
                        }

                        if (isBooked) {
                          seatColorClass = isLight
                            ? 'border-stone-300 bg-stone-200 text-stone-500 cursor-not-allowed opacity-85 font-medium'
                            : 'border-zinc-850 bg-zinc-900 text-zinc-700 cursor-not-allowed opacity-35';
                        }

                        const isCrying = cryingSeatIds.includes(seat.id);

                        if (isCrying) {
                          seatColorClass = 'animate-crying-shake bg-red-100/10 border-red-500 text-red-500';
                        } else if (isSelected) {
                          if (isPremiumRow) {
                            seatColorClass = 'ticket-shape bg-purple-600 border-purple-400 text-white shadow-purple-500/20 shadow-md animate-ticket-morph';
                          } else {
                            seatColorClass = isLight
                              ? 'ticket-shape ticket-shape-selected-light text-white shadow-[#8C1D40]/20 shadow-md animate-ticket-morph'
                              : 'ticket-shape ticket-shape-selected-dark text-black shadow-glow animate-ticket-morph';
                          }
                        }

                        return (
                          <button
                            key={seat.id}
                            disabled={isBooked || isCrying}
                            onClick={() => handleSeatClick(seat)}
                            className={`group/seat h-7 w-7 sm:h-8 sm:w-8 rounded-lg border text-[10px] font-black font-mono transition-all duration-200 flex flex-col items-center justify-center relative focus:outline-none focus:ring-0 ${seatColorClass}`}
                            id={`seat-${seat.id}`}
                            title={`${isVipRow ? 'Golden VIP' : isPremiumRow ? 'Premium' : 'Classic Std'} ${seat.id} (${isBooked ? 'Booked' : 'Available'}) ₹${isVipRow ? showtime.priceVIP : isPremiumRow ? showtime.priceStandard + 150 : showtime.priceStandard}`}
                          >
                            {/* Premium recliners receive a tiny armrest decoration when available */}
                            {isVipRow && !isSelected && !isBooked && !isCrying ? (
                              <div className="absolute -top-0.5 h-1 w-2 rounded-full bg-amber-500 opacity-60 group-hover/seat:scale-125 transition-transform" />
                            ) : isPremiumRow && !isSelected && !isBooked && !isCrying ? (
                              <div className="absolute -top-0.5 h-1 w-1.5 rounded-full bg-purple-400 opacity-60 group-hover/seat:scale-125 transition-transform" />
                            ) : null}

                            <span className="leading-none">{isCrying ? '😢' : seat.id}</span>
                          </button>
                        );
                      })}
                    </div>

                  </div>
                );
              })}

            </div>
          </div>
        </div>

        {/* Legend / Status Definitions block */}
        <div className={`mt-8 flex flex-wrap items-center justify-center gap-4 border-t pt-6 w-full ${isLight ? 'border-stone-100' : 'border-zinc-900'}`}>
          <div className="flex items-center gap-2">
            <div className={`h-4 w-4 rounded border ${isLight ? 'border-stone-200 bg-white' : 'border-zinc-700 bg-zinc-950'}`} />
            <span className={`text-xs font-semibold ${isLight ? 'text-stone-550' : 'text-zinc-450'}`}>Standard (₹{showtime.priceStandard})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-4 w-4 rounded border ${isLight ? 'border-purple-400/40 bg-purple-50/40' : 'border-purple-500/50 bg-purple-950/20'}`} />
            <span className={`text-xs font-semibold ${isLight ? 'text-purple-700' : 'text-purple-400'}`}>Premium (₹{showtime.priceStandard + 150})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-4 w-4 rounded border ${isLight ? 'border-amber-500/30 bg-amber-50/40' : 'border-amber-600/60 bg-amber-950/30'}`} />
            <span className="text-xs font-semibold text-amber-600">VIP Recliner (₹{showtime.priceVIP})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-4 w-4 rounded border ${isLight ? 'border-[#8C1D40] bg-[#8C1D40]' : 'border-amber-400 bg-amber-500'}`} />
            <span className={`text-xs font-semibold ${isLight ? 'text-[#8C1D40]' : 'text-zinc-200'}`}>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-4 w-4 rounded border ${isLight ? 'border-stone-300 bg-stone-200 opacity-85' : 'border-zinc-850 bg-zinc-900 opacity-35'}`} />
            <span className={`text-xs font-semibold ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>Booked</span>
          </div>
        </div>

      </div>

      {/* Floating Seating Reservation Details Bar */}
      {selectedSeatIds.length > 0 && (
        <div
          className={`fixed bottom-0 left-0 right-0 z-40 border-t py-4 px-6 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom duration-300 transition-colors ${isLight ? 'bg-white/70 border-stone-200/80' : 'bg-zinc-950/95 border-zinc-800'
            }`}
          id="seating-running-footer"
        >
          <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Selections breakdown */}
            <div className="flex items-center gap-4 text-left">
              <div className={`rounded-xl p-2.5 border ${isLight ? 'bg-[#8C1D40]/5 text-[#8C1D40] border-[#8C1D40]/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                }`}>
                <Armchair className="h-5 w-5" />
              </div>
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-widest font-mono ${isLight ? 'text-stone-400' : 'text-zinc-550'}`}>Seats Selected ({selectedSeatIds.length})</span>
                <p className="text-sm font-black flex gap-1 items-center max-w-md flex-wrap mt-0.5">
                  {selectedSeatObjects.map((s) => (
                    <span
                      key={s.id}
                      className={`inline-block px-2 py-0.5 rounded text-xs leading-none font-extrabold ${s.type === 'vip'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : s.type === 'premium'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : isLight
                              ? 'bg-stone-100 text-stone-700'
                              : 'bg-zinc-800 text-zinc-300'
                        }`}
                    >
                      {s.id}{s.type === 'vip' ? ' ★VIP' : s.type === 'premium' ? ' ◆' : ''}
                    </span>
                  ))}
                </p>
              </div>
            </div>

            {/* Calculations and Booking Transition */}
            <div className="flex items-center gap-6 justify-end w-full md:w-auto">
              {/* Total Summary */}
              <div className="text-right">
                <span className={`text-[10px] font-bold uppercase tracking-widest font-mono ${isLight ? 'text-stone-400' : 'text-zinc-550'}`}>Running POS Bill</span>
                <p className={`text-2xl font-black font-mono ${isLight ? 'text-[#8C1D40]' : 'text-amber-400'}`}>
                  ₹{totalAmount}
                  <span className={`text-xs font-semibold ml-1 ${isLight ? 'text-stone-400' : 'text-zinc-450'}`}>GST Inc.</span>
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={handleConfirmSelection}
                className={`rounded-xl px-6 py-3.5 text-sm font-black uppercase tracking-wider shadow-lg transition-all duration-300 active:scale-95 flex items-center gap-2 cursor-pointer text-white ${isLight
                    ? 'bg-[#8C1D40] hover:bg-[#701530]'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black'
                  }`}
                id="seating-matrix-proceed-button"
              >
                <span>Lock & Pay Checkout</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
