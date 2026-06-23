/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CreditCard, Trash2, Star, Plus, Check, Shield } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { SavedCard } from '../../types/user';

interface SavedCardsProps {
  theme?: 'dark' | 'light';
  onSelectCard?: (card: SavedCard) => void;
  selectedCardId?: string | null;
  compact?: boolean;
}

const CARD_TYPE_COLORS: Record<SavedCard['cardType'], { bg: string; text: string }> = {
  Visa: { bg: 'bg-blue-600', text: 'Visa' },
  Mastercard: { bg: 'bg-red-600', text: 'MC' },
  RuPay: { bg: 'bg-green-700', text: 'RuPay' },
  Amex: { bg: 'bg-blue-800', text: 'Amex' },
};

export default function SavedCards({ theme = 'dark', onSelectCard, selectedCardId, compact = false }: SavedCardsProps) {
  const { savedCards, removeCard, setDefaultCard } = useUser();
  const isLight = theme === 'light';
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  if (savedCards.length === 0 && !showAddForm) {
    return (
      <div className={`flex flex-col items-center gap-4 py-12 text-center rounded-2xl border border-dashed ${isLight ? 'border-stone-200 text-stone-400' : 'border-zinc-800 text-zinc-500'}`}>
        <div className={`h-14 w-14 rounded-full flex items-center justify-center ${isLight ? 'bg-stone-100' : 'bg-zinc-900'}`}>
          <CreditCard className={`h-7 w-7 ${isLight ? 'text-stone-300' : 'text-zinc-600'}`} />
        </div>
        <div>
          <p className={`font-bold text-sm ${isLight ? 'text-stone-700' : 'text-zinc-300'}`}>No saved cards</p>
          <p className="text-xs mt-1">Save a card at checkout for faster future bookings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {savedCards.map(card => {
        const colors = CARD_TYPE_COLORS[card.cardType];
        const isSelected = selectedCardId === card.id;
        const isDeleting = confirmDeleteId === card.id;

        return (
          <div
            key={card.id}
            onClick={() => onSelectCard && onSelectCard(card)}
            className={`rounded-xl border p-4 transition-all duration-200 ${
              onSelectCard ? 'cursor-pointer hover:scale-[1.01]' : ''
            } ${
              isSelected
                ? isLight ? 'border-[#8C1D40] bg-[#8C1D40]/5' : 'border-amber-500 bg-amber-500/5'
                : isLight ? 'border-stone-200 bg-white shadow-sm' : 'border-zinc-800 bg-zinc-900/30'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Card type badge */}
                <div className={`h-10 w-14 rounded-lg ${colors.bg} flex items-center justify-center text-white text-[10px] font-black tracking-wider shrink-0`}>
                  {colors.text}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-bold font-mono ${isLight ? 'text-stone-900' : 'text-white'}`}>
                      •••• {card.lastFourDigits}
                    </p>
                    {card.isDefault && (
                      <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${isLight ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>
                        Default
                      </span>
                    )}
                  </div>
                  <p className={`text-xs mt-0.5 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
                    {card.cardHolder} · Exp {card.expiryDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isSelected && <Check className={`h-4 w-4 ${isLight ? 'text-[#8C1D40]' : 'text-amber-500'}`} />}

                {!compact && (
                  <>
                    {!card.isDefault && (
                      <button
                        onClick={e => { e.stopPropagation(); setDefaultCard(card.id); }}
                        title="Set as default"
                        className={`h-7 w-7 rounded-lg border flex items-center justify-center transition-all hover:scale-110 cursor-pointer ${isLight ? 'border-stone-200 text-stone-400 hover:text-amber-600 hover:border-amber-300' : 'border-zinc-700 text-zinc-500 hover:text-amber-400 hover:border-amber-500/40'}`}
                      >
                        <Star className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {isDeleting ? (
                      <div className="flex gap-1.5">
                        <button onClick={e => { e.stopPropagation(); removeCard(card.id); setConfirmDeleteId(null); }} className="text-[10px] font-bold text-red-500 hover:underline cursor-pointer px-2 py-1 rounded bg-red-500/10 border border-red-500/20">Delete</button>
                        <button onClick={e => { e.stopPropagation(); setConfirmDeleteId(null); }} className={`text-[10px] font-bold cursor-pointer px-2 py-1 rounded ${isLight ? 'text-stone-500 bg-stone-100' : 'text-zinc-400 bg-zinc-800'}`}>Cancel</button>
                      </div>
                    ) : (
                      <button
                        onClick={e => { e.stopPropagation(); setConfirmDeleteId(card.id); }}
                        className={`h-7 w-7 rounded-lg border flex items-center justify-center transition-all hover:scale-110 cursor-pointer ${isLight ? 'border-stone-200 text-stone-400 hover:text-red-500 hover:border-red-300' : 'border-zinc-700 text-zinc-500 hover:text-red-400 hover:border-red-500/40'}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {!compact && (
        <div className={`flex items-center gap-2 mt-1 rounded-xl border border-dashed px-4 py-3 text-xs font-semibold cursor-pointer transition-colors ${isLight ? 'border-stone-200 text-stone-400 hover:text-stone-600 hover:border-stone-300' : 'border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'}`}>
          <Shield className="h-3.5 w-3.5" />
          <span>Cards are secured with bank-grade 256-bit encryption</span>
        </div>
      )}
    </div>
  );
}
