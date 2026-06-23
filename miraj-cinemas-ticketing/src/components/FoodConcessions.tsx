/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronLeft, Info, Plus, Minus, ShoppingCart, UtensilsCrossed, Sparkles } from 'lucide-react';
import { FoodItem, SelectedFoodItem, Movie, Showtime, Seat } from '../types';
import { MOCK_FOOD_ITEMS } from '../data/mockData';

interface FoodConcessionsProps {
  movie: Movie;
  showtime: Showtime;
  selectedSeats: Seat[];
  onBack: () => void;
  onProceed: (selectedFood: SelectedFoodItem[]) => void;
  theme?: 'dark' | 'light';
}

export default function FoodConcessions({
  movie,
  showtime,
  selectedSeats,
  onBack,
  onProceed,
  theme = 'dark'
}: FoodConcessionsProps) {
  const isLight = theme === 'light';
  const [activeTab, setActiveTab] = useState<'All' | 'Combos' | 'Snacks' | 'Beverages'>('All');
  
  // Local quantity map: { foodItemId: quantity }
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleAdd = (id: string) => {
    setQuantities(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handleSubtract = (id: string) => {
    setQuantities(prev => {
      const current = prev[id] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return {
        ...prev,
        [id]: current - 1
      };
    });
  };

  // Filter food items based on active tab
  const filteredFoodItems = activeTab === 'All'
    ? MOCK_FOOD_ITEMS
    : MOCK_FOOD_ITEMS.filter(item => item.category === activeTab);

  // Compile selected food items
  const selectedFoodList: SelectedFoodItem[] = Object.entries(quantities)
    .map(([id, quantity]) => {
      const foodItem = MOCK_FOOD_ITEMS.find(item => item.id === id);
      return foodItem ? { foodItem, quantity } : null;
    })
    .filter((item): item is SelectedFoodItem => item !== null);

  // Calculate totals
  const ticketCost = selectedSeats.reduce((acc, seat) => {
    return acc + (seat.type === 'vip' ? showtime.priceVIP : showtime.priceStandard);
  }, 0);
  
  const foodCost = selectedFoodList.reduce((acc, item) => {
    return acc + (item.foodItem.price * item.quantity);
  }, 0);

  const handleConfirm = () => {
    onProceed(selectedFoodList);
  };

  const handleSkip = () => {
    onProceed([]); // Empty food selection
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="food-concessions-container">
      
      {/* Back button and quick details header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between text-left gap-4" id="food-concessions-header">
        <button
          onClick={onBack}
          className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors self-start py-2 cursor-pointer ${
            isLight ? 'text-stone-500 hover:text-[#8C1D40]' : 'text-zinc-400 hover:text-amber-500'
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Seating Matrix</span>
        </button>

        <div className="flex flex-col sm:items-end text-left sm:text-right">
          <h3 className={`text-sm font-bold uppercase tracking-wider ${isLight ? 'text-stone-400' : 'text-zinc-450'}`}>Step 2: Add Snacks</h3>
          <h4 className={`text-xl font-black uppercase mt-0.5 ${isLight ? 'text-stone-900' : 'text-white'}`} style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
            Grab Food & Drinks
          </h4>
          <p className={`text-xs font-semibold mt-1 ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>
            Pre-order online to beat the queue and save up to 15% on concessions
          </p>
        </div>
      </div>

      {/* Main Core Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-24">
        
        {/* Left Column: Food Menu & Categories */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Categories Tab Bar */}
          <div className="flex flex-wrap gap-2.5 border-b pb-4 border-dashed border-stone-300/30 md:border-zinc-800/50">
            {(['All', 'Combos', 'Snacks', 'Beverages'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer border ${
                  activeTab === tab
                    ? isLight 
                      ? 'bg-[#8C1D40] text-white border-transparent shadow-sm'
                      : 'bg-amber-500 text-black border-transparent shadow-md'
                    : isLight
                      ? 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-150 hover:text-stone-900'
                      : 'border-zinc-850 bg-zinc-900/50 text-zinc-450 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Food Items Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredFoodItems.map((item) => {
              const qty = quantities[item.id] || 0;
              
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-4.5 flex gap-4 transition-all duration-300 items-start backdrop-blur-sm ${
                    isLight 
                      ? 'bg-white/60 border-stone-200/80 hover:border-[#8C1D40]/30 shadow-sm'
                      : 'bg-zinc-950 border-zinc-900 hover:border-zinc-800 shadow-xl'
                  }`}
                >
                  {/* Food Image */}
                  <div className="h-24 w-24 rounded-xl overflow-hidden shrink-0 bg-stone-800 border border-stone-200/5 select-none pointer-events-none">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-500" 
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Food details and add/remove selector */}
                  <div className="flex-1 flex flex-col justify-between min-h-[96px] text-left">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h4 className={`text-sm font-black uppercase tracking-tight line-clamp-1 ${isLight ? 'text-stone-900' : 'text-white'}`}>
                          {item.name}
                        </h4>
                        <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border leading-none ${
                          isLight ? 'bg-stone-50 border-stone-200 text-stone-500' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                        }`}>
                          {item.category}
                        </span>
                      </div>
                      <p className={`text-[11px] leading-normal mt-1.5 line-clamp-2 ${isLight ? 'text-stone-500 font-medium' : 'text-zinc-400 font-medium'}`}>
                        {item.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-stone-100/50 md:border-zinc-900/60">
                      <span className={`text-sm font-black font-mono ${isLight ? 'text-[#8C1D40]' : 'text-amber-500'}`}>
                        ₹{item.price}.00
                      </span>

                      {qty === 0 ? (
                        <button
                          onClick={() => handleAdd(item.id)}
                          className={`flex items-center gap-1 px-3.5 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                            isLight 
                              ? 'border-stone-200 bg-stone-50 hover:bg-[#8C1D40]/5 hover:border-[#8C1D40]/30 hover:text-[#8C1D40] text-stone-700' 
                              : 'border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white'
                          }`}
                          id={`btn-add-food-${item.id}`}
                        >
                          <Plus className="h-3 w-3" />
                          <span>Add</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleSubtract(item.id)}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                              isLight 
                                ? 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700' 
                                : 'border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300'
                            }`}
                            id={`btn-sub-food-${item.id}`}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          
                          <span className={`text-xs font-mono font-black ${isLight ? 'text-stone-900' : 'text-white'}`}>
                            {qty}
                          </span>

                          <button
                            onClick={() => handleAdd(item.id)}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                              isLight 
                                ? 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700' 
                                : 'border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300'
                            }`}
                            id={`btn-add-more-${item.id}`}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Order summary card (Sticky behavior) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <div className={`rounded-2xl border p-6 text-left shadow-xl backdrop-blur-md ${
            isLight ? 'border-stone-200/80 bg-white/60' : 'border-zinc-900 bg-zinc-950/80'
          }`} id="food-concessions-summary-card">
            
            <h3 className={`text-base font-black uppercase border-b pb-4 mb-4 flex items-center gap-2 ${
              isLight ? 'text-stone-900 border-stone-100' : 'text-white border-zinc-900'
            }`} style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              <ShoppingCart className="h-4.5 w-4.5" />
              <span>Concession Basket</span>
            </h3>

            {/* Selected Concession List */}
            {selectedFoodList.length === 0 ? (
              <div className="py-8 text-center flex flex-col items-center gap-3">
                <UtensilsCrossed className={`h-8 w-8 ${isLight ? 'text-stone-300' : 'text-zinc-800'}`} />
                <p className={`text-xs font-medium ${isLight ? 'text-stone-400' : 'text-zinc-550'}`}>
                  No popcorn or beverages selected yet. Use the cards on the left to add items.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 mb-6 max-h-56 overflow-y-auto pr-1">
                {selectedFoodList.map((item) => (
                  <div 
                    key={item.foodItem.id}
                    className={`flex items-center justify-between text-xs py-2 border-b border-dashed ${
                      isLight ? 'border-stone-100 text-stone-650' : 'border-zinc-900/60 text-zinc-400'
                    }`}
                  >
                    <div>
                      <span className={`font-black ${isLight ? 'text-stone-800' : 'text-zinc-200'}`}>
                        {item.foodItem.name}
                      </span>
                      <span className={`block text-[10px] ${isLight ? 'text-stone-400' : 'text-zinc-550'}`}>
                        ₹{item.foodItem.price} x {item.quantity}
                      </span>
                    </div>
                    <span className={`font-bold font-mono ${isLight ? 'text-stone-900' : 'text-zinc-300'}`}>
                      ₹{item.foodItem.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Totals Breakdown */}
            <div className={`border-t pt-4 flex flex-col gap-2.5 font-mono text-xs ${isLight ? 'border-stone-150' : 'border-zinc-900'}`}>
              <div className="flex justify-between text-stone-500">
                <span>SEAT BASE COST:</span>
                <span className={isLight ? 'text-stone-850' : 'text-white'}>₹{ticketCost}.00</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>FOOD & BEVERAGES:</span>
                <span className={isLight ? 'text-stone-850' : 'text-white'}>₹{foodCost}.00</span>
              </div>
              <div className={`border-t pt-3 mt-1.5 flex justify-between text-sm font-black ${isLight ? 'border-stone-150' : 'border-zinc-900'}`}>
                <span className="font-sans">RUNNING BILL SUB-TOTAL:</span>
                <span className={isLight ? 'text-[#8C1D40]' : 'text-amber-400'}>₹{ticketCost + foodCost}.00</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={handleConfirm}
                className={`w-full rounded-xl py-3.5 text-xs font-black uppercase tracking-wider shadow-md transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer text-white ${
                  isLight 
                    ? 'bg-[#8C1D40] hover:bg-[#701530]' 
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black'
                }`}
                id="btn-food-proceed"
              >
                <span>Add & Proceed to Pay</span>
              </button>

              <button
                onClick={handleSkip}
                className={`w-full rounded-xl border py-3.5 text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isLight 
                    ? 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-600 hover:text-stone-900' 
                    : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
                id="btn-food-skip"
              >
                <span>Skip Food & Drinks</span>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Floating Bottom Bar (Backup selector helper for mobile screen widths) */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-40 border-t py-4 px-6 shadow-2xl backdrop-blur-md md:hidden animate-in slide-in-from-bottom duration-300 transition-colors ${
          isLight ? 'bg-white/70 border-stone-200/80' : 'bg-zinc-950/95 border-zinc-800'
        }`}
        id="food-floating-mobile-bar"
      >
        <div className="flex justify-between items-center gap-4">
          <div className="text-left">
            <span className={`text-[8px] font-bold uppercase tracking-widest font-mono ${isLight ? 'text-stone-400' : 'text-zinc-550'}`}>Basket Sub-Total</span>
            <p className={`text-xl font-black font-mono ${isLight ? 'text-[#8C1D40]' : 'text-amber-400'}`}>
              ₹{ticketCost + foodCost}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSkip}
              className={`rounded-lg border px-3 py-2.5 text-[10px] font-black uppercase tracking-wider cursor-pointer ${
                isLight ? 'border-stone-200 text-stone-600' : 'border-zinc-800 text-zinc-400'
              }`}
            >
              Skip
            </button>
            
            <button
              onClick={handleConfirm}
              className={`rounded-lg px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-white cursor-pointer ${
                isLight ? 'bg-[#8C1D40]' : 'bg-amber-500 text-black'
              }`}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
