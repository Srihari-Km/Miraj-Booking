/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar, Ticket, CheckCircle2, MapPin, Printer, RefreshCw, Star, QrCode } from 'lucide-react';
import { TransactionDetails } from '../types';
import MirajLogo from './MirajLogo';

interface ReceiptProps {
  details: TransactionDetails;
  onRestart: () => void;
  theme?: 'dark' | 'light';
}

export default function Receipt({ details, onRestart, theme = 'dark' }: ReceiptProps) {
  const isLight = theme === 'light';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-center" id="receipt-screen-wrapper">
      
      {/* Celebration animation indicator */}
      <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 text-emerald-400">
        <CheckCircle2 className="h-9 w-9" />
      </div>

      <h2 className={`text-3xl font-black uppercase tracking-tight ${isLight ? 'text-stone-900' : 'text-white'}`} style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
        Purchase Confirmed!
      </h2>
      <p className={`text-xs mt-2 font-medium ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
        Seat allocations locked under ID: <span className="font-mono text-emerald-600 font-extrabold">{details.bookingId}</span>
      </p>

      {/* Printable Receipt Card Body */}
      <div 
        className={`mt-8 rounded-2xl border p-6 sm:p-8 text-left shadow-2xl relative overflow-hidden backdrop-blur-sm print:bg-white print:text-black print:border-none print:shadow-none transition-all ${
          isLight ? 'border-stone-200 bg-white text-stone-850' : 'border-zinc-800 bg-zinc-950 text-zinc-100'
        }`}
        id="printable-ticket-card"
      >
        
        {/* Top Print-Ready Professional Brand Header */}
        <div className={`border-b pb-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:border-black ${
          isLight ? 'border-stone-150' : 'border-zinc-850'
        }`}>
          <div className="print:hidden">
            <MirajLogo size="md" variant={isLight ? 'red' : 'gold'} isLight={isLight} />
          </div>
          {/* Black & White brand backup for print fallback */}
          <div className="hidden print:block text-black">
            <div className="font-black text-xl tracking-widest">MIRAJ CINEMAS</div>
            <div className="text-[9px] font-bold uppercase tracking-[0.4em] text-zinc-700">POS RESERVE SYSTEM</div>
          </div>

          <div className="text-right flex flex-col sm:items-end">
            <span className={`text-[8px] font-mono font-bold tracking-widest uppercase block ${isLight ? 'text-[#8C1D40]' : 'text-[#E5A93B]'}`}>TAX RECEIPT CONFIRMATION</span>
            <span className={`text-xs font-mono font-bold mt-0.5 print:text-black ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>REF: {details.bookingId}</span>
          </div>
        </div>

        {/* Movie Particulars section */}
        <div className="flex justify-between items-start mb-6">
          <div className="text-left">
            <h3 className={`text-2xl font-black uppercase print:text-black ${isLight ? 'text-stone-900' : 'text-white'}`} style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              {details.movie.title}
            </h3>
            <div className={`flex items-center gap-2 text-xs font-semibold mt-1 print:text-black ${isLight ? 'text-stone-550' : 'text-zinc-400'}`}>
              <span className={`rounded border px-1.5 py-0.5 text-[10px] print:border-black print:text-black ${
                isLight ? 'bg-stone-50 border-stone-200 text-stone-700' : 'bg-zinc-800 border-zinc-700 text-zinc-300'
              }`}>
                {details.movie.rating}
              </span>
              <span>•</span>
              <span>{details.movie.duration}</span>
              <span>•</span>
              <span className="truncate max-w-[150px]">{details.movie.genre.join(', ')}</span>
            </div>
          </div>

          <div className={`rounded-xl border px-3 py-1.5 text-center font-mono text-[10px] font-extrabold tracking-wider print:border-black print:text-black print:bg-transparent ${
            isLight ? 'border-stone-200 bg-stone-50 text-stone-700' : 'border-amber-500/20 bg-amber-500/5 text-amber-400'
          }`}>
            {details.showtime.screenType}
          </div>
        </div>

        {/* Multiplex Booking Metadata */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-5 text-xs font-semibold print:border-black print:text-black ${
          isLight ? 'border-stone-150' : 'border-zinc-900'
        }`}>
          <div>
            <span className={`uppercase tracking-wider block text-[10px] ${isLight ? 'text-stone-400' : 'text-zinc-550'}`}>THEATER MULTIPLEX</span>
            <span className={`mt-1 block print:text-black ${isLight ? 'text-stone-800' : 'text-zinc-200'}`}>{details.theaterName}</span>
            <span className={`text-[10px] uppercase font-mono mt-0.5 block ${isLight ? 'text-stone-400' : 'text-zinc-550'}`}>{details.city} District</span>
          </div>

          <div>
            <span className={`uppercase tracking-wider block text-[10px] ${isLight ? 'text-stone-400' : 'text-zinc-550'}`}>SCREENING TIME SLOT</span>
            <span className={`mt-1 block font-black print:text-black ${isLight ? 'text-[#8C1D40]' : 'text-amber-500'}`}>{details.showtime.time}</span>
            <span className={`text-[10px] uppercase font-mono mt-0.5 block ${isLight ? 'text-stone-400' : 'text-zinc-450'}`}>Session: {details.bookingTime}</span>
          </div>
        </div>

        {/* Seats Reserved breakdown */}
        <div className={`border-t pt-5 mt-5 print:border-black print:text-black ${isLight ? 'border-stone-150' : 'border-zinc-900'}`}>
          <span className={`text-[10px] uppercase tracking-wider font-semibold block mb-2.5 ${isLight ? 'text-stone-400' : 'text-zinc-550'}`}>SEAT ALLOCATIONS</span>
          <div className="flex flex-wrap gap-2">
            {details.selectedSeats.map((seat) => (
              <div 
                key={seat.id}
                className={`rounded-lg border px-3 py-1.5 text-xs font-extrabold tracking-wider flex items-center gap-1.5 print:bg-transparent print:text-black print:border-black ${
                  isLight 
                    ? 'border-stone-200 bg-stone-50 text-stone-700' 
                    : 'border-zinc-800 bg-zinc-900 text-zinc-200'
                }`}
              >
                <Ticket className="h-3.5 w-3.5" />
                <span>{seat.id} ({seat.type === 'vip' ? 'VIP' : 'Std'})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Concessions List */}
        {details.foodItems && details.foodItems.length > 0 && (
          <div className={`border-t pt-5 mt-5 print:border-black print:text-black ${isLight ? 'border-stone-150' : 'border-zinc-900'}`}>
            <span className={`text-[10px] uppercase tracking-wider font-semibold block mb-2.5 ${isLight ? 'text-stone-400' : 'text-zinc-550'}`}>PRE-ORDERED SNACKS</span>
            <div className="flex flex-col gap-1.5 text-xs font-semibold">
              {details.foodItems.map((item) => (
                <div key={item.foodItem.id} className="flex justify-between">
                  <span className={isLight ? 'text-stone-700' : 'text-zinc-400'}>
                    {item.foodItem.name} (x{item.quantity})
                  </span>
                  <span className={isLight ? 'text-stone-900 font-mono' : 'text-zinc-200 font-mono'}>
                    ₹{item.foodItem.price * item.quantity}.00
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment accounting table */}
        <div className={`border-t pt-5 mt-5 font-mono text-xs print:text-black print:border-black ${
          isLight ? 'border-stone-150 text-stone-500' : 'border-zinc-900 text-zinc-400'
        }`}>
          <div className="flex justify-between">
            <span>SEAT TICKETS & CONVENIENCE FEES:</span>
            <span className={isLight ? 'text-stone-850' : 'text-white'}>
              ₹{details.originalTotal - (details.foodItems ? details.foodItems.reduce((acc, item) => acc + (item.foodItem.price * item.quantity), 0) : 0)}.00
            </span>
          </div>
          {details.foodItems && details.foodItems.length > 0 && (
            <div className="flex justify-between mt-1">
              <span>FOOD & BEVERAGES TOTAL:</span>
              <span className={isLight ? 'text-stone-850' : 'text-white'}>
                ₹{details.foodItems.reduce((acc, item) => acc + (item.foodItem.price * item.quantity), 0)}.00
              </span>
            </div>
          )}
          {details.discount > 0 && (
            <div className="flex justify-between text-emerald-600 mt-1 font-bold">
              <span>PROMO DISCOUNT CODE ({details.couponCode}):</span>
              <span>-₹{details.discount}.00</span>
            </div>
          )}
          <div className={`border-t pt-3 mt-3 flex justify-between text-base font-black print:text-black print:border-black ${
            isLight ? 'border-stone-150 text-stone-950' : 'border-zinc-850 text-white'
          }`}>
            <span className="font-sans">NET CHARGES COMPLETED:</span>
            <span className={isLight ? 'text-[#8C1D40]' : 'text-amber-400'}>₹{details.finalTotal}.00</span>
          </div>
        </div>

        {/* Barcode & Security stamp segment simulating actual physical scanning mechanisms */}
        <div className={`border-t pt-6 mt-6 flex flex-col sm:flex-row items-center justify-between gap-6 print:border-black print:text-black ${
          isLight ? 'border-stone-150' : 'border-zinc-900'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`h-14 w-14 rounded-lg border flex items-center justify-center print:bg-white print:border-black shrink-0 ${
              isLight ? 'bg-stone-50 border-stone-200 text-stone-500' : 'bg-zinc-900 border-zinc-800 text-zinc-300'
            }`}>
              <QrCode className="h-10 w-10 print:text-black" />
            </div>
            
            <div className="text-left leading-normal">
              <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest font-mono">DIGITAL POS PASS</span>
              <span className={`text-[11px] font-semibold print:text-black ${isLight ? 'text-stone-700' : 'text-zinc-300'}`}>Flash ticket code at auditorium entrance.</span>
              <p className="text-[9px] text-stone-400 mt-1 font-mono">ID: {details.bookingId}-STG-A</p>
            </div>
          </div>

          {/* Styled barcode vertical lines mimicking thermal multiplex printers */}
          <div className="flex flex-col items-center">
            <div className={`h-8 w-44 flex items-center justify-between px-1 py-1 rounded border print:border-black print:bg-white ${
              isLight ? 'bg-stone-50 border-stone-200' : 'bg-zinc-950 border-zinc-900'
            }`}>
              {[1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 2].map((width, idx) => (
                <div 
                  key={idx} 
                  className={`h-full print:bg-black ${isLight ? 'bg-stone-850' : 'bg-white'}`} 
                  style={{ width: `${width}px` }} 
                />
              ))}
            </div>
            <span className="text-[8px] font-mono text-stone-400 uppercase tracking-widest mt-1">POS THERMAL SECURE</span>
          </div>
        </div>

      </div>

      {/* Navigation and print trigger actions */}
      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={handlePrint}
          className={`rounded-xl border px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer ${
            isLight 
              ? 'border-stone-200 bg-stone-100 hover:bg-stone-200 text-stone-700' 
              : 'border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-200'
          }`}
          id="receipt-print-button"
        >
          <Printer className="h-4 w-4" />
          <span>Print Thermal PDF Receipt</span>
        </button>

        <button
          onClick={onRestart}
          className={`rounded-xl px-6 py-3.5 text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer text-white ${
            isLight 
              ? 'bg-[#8C1D40] hover:bg-[#701530]' 
              : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black'
          }`}
          id="receipt-restart-button"
        >
          <RefreshCw className="h-4 w-4 animate-spin-hover" />
          <span>Reserve Another Movie</span>
        </button>
      </div>

    </div>
  );
}
