/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Tag, CreditCard, Wallet, Percent, Copy, Check, Ticket } from 'lucide-react';

interface OffersProps {
  theme?: 'dark' | 'light';
}

interface DemoOffer {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'cards' | 'wallets' | 'cinema';
  icon: React.ReactNode;
  code: string;
  expiry: string;
  color: string;
}

export default function Offers({ theme = 'dark' }: OffersProps) {
  const isLight = theme === 'light';
  const [activeCategory, setActiveCategory] = useState<'all' | 'cards' | 'wallets' | 'cinema'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const demoOffers: DemoOffer[] = [
    {
      id: 'off-1',
      title: 'ICICI Bank Credit Card Offer',
      subtitle: 'Buy 1 Ticket, Get 1 Ticket Free',
      description: 'Get up to ₹250 discount on your second movie ticket. Valid on ICICI Bank Sapphiro, Rubyx, and Coral Credit Cards twice a month.',
      category: 'cards',
      icon: <CreditCard className="h-6 w-6" />,
      code: 'ICICIBOGO',
      expiry: '31 Aug 2026',
      color: 'from-orange-500/10 to-amber-500/10 border-orange-500/30 text-orange-600'
    },
    {
      id: 'off-2',
      title: 'SBI Signature Card Special',
      subtitle: 'Flat ₹250 Off on Movie Tickets',
      description: 'Enjoy a flat discount of ₹250 on a minimum booking of 2 tickets. Valid once per user per calendar month on SBI Signature Cards.',
      category: 'cards',
      icon: <CreditCard className="h-6 w-6" />,
      code: 'SBISIG250',
      expiry: '30 Sep 2026',
      color: 'from-blue-500/10 to-indigo-500/10 border-blue-500/30 text-blue-600'
    },
    {
      id: 'off-3',
      title: 'Amazon Pay UPI Cashback',
      subtitle: 'Get 10% Cashback up to ₹50',
      description: 'Pay using Amazon Pay UPI and get up to ₹50 cashback directly credited into your Amazon Pay Wallet. No minimum transaction value.',
      category: 'wallets',
      icon: <Wallet className="h-6 w-6" />,
      code: 'AMZPAY50',
      expiry: '15 Jul 2026',
      color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/30 text-emerald-600'
    },
    {
      id: 'off-4',
      title: 'Paytm Wallet Movie Bonanza',
      subtitle: 'Flat ₹100 Cashback on 1st Movie Ticket',
      description: 'Book movie tickets for the first time via Paytm Wallet and get a flat ₹100 cashback. Minimum order value must be ₹300.',
      category: 'wallets',
      icon: <Wallet className="h-6 w-6" />,
      code: 'PTMNEW100',
      expiry: '31 Dec 2026',
      color: 'from-sky-500/10 to-blue-500/10 border-sky-500/30 text-sky-600'
    },
    {
      id: 'off-5',
      title: 'Miraj Cinemas First Time User',
      subtitle: 'Flat 15% Off on Popcorn & Tickets Combo',
      description: 'First booking on Miraj Cinemas Ticketing? Use code MIRAJNEW and get 15% discount on tickets and snack combinations.',
      category: 'cinema',
      icon: <Ticket className="h-6 w-6" />,
      code: 'MIRAJNEW',
      expiry: '31 Dec 2026',
      color: 'from-rose-500/10 to-red-500/10 border-rose-500/30 text-rose-600'
    },
    {
      id: 'off-6',
      title: 'Miraj Super Midweek Promo',
      subtitle: 'Save ₹75 on Wednesday Showtimes',
      description: 'Book any movie showtime on Wednesday and save ₹75. Available across all multiplex screens including VIP lounges.',
      category: 'cinema',
      icon: <Percent className="h-6 w-6" />,
      code: 'MIDWEEK75',
      expiry: '28 Oct 2026',
      color: 'from-purple-500/10 to-pink-500/10 border-purple-500/30 text-purple-600'
    }
  ];

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredOffers = activeCategory === 'all' 
    ? demoOffers 
    : demoOffers.filter(o => o.category === activeCategory);

  return (
    <div className={`mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-left ${
      isLight ? 'text-stone-900' : 'text-zinc-100'
    }`} id="offers-view-container">
      
      {/* View Header */}
      <div className="mb-8 border-b pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-zinc-900">
        <div>
          <div className="flex items-center gap-2">
            <Tag className={`h-5 w-5 ${isLight ? 'text-[#8C1D40]' : 'text-amber-500'}`} />
            <span className={`text-[10px] font-bold tracking-widest uppercase font-mono ${
              isLight ? 'text-[#8C1D40]' : 'text-amber-500'
            }`}>
              PROMOTIONS & SPECIALS
            </span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight mt-1" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
            Exclusive Ticketing Offers
          </h1>
          <p className={`text-xs mt-1 ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
            Apply promo codes at checkout to unlock flat cashback rewards, bank BOGO offers, and concessions savings
          </p>
        </div>
      </div>

      {/* Categories Filter Bar */}
      <div className="flex flex-wrap gap-2.5 mb-8">
        {(['all', 'cards', 'wallets', 'cinema'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4.5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border ${
              activeCategory === cat
                ? isLight 
                  ? 'bg-[#8C1D40] text-white border-transparent shadow-sm'
                  : 'bg-amber-500 text-black border-transparent shadow-md'
                : isLight
                  ? 'border-stone-200 bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-450 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            {cat === 'all' ? 'All Offers' : cat === 'cards' ? 'Bank Card Offers' : cat === 'wallets' ? 'UPI & Wallet Discounts' : 'Cinema Promos'}
          </button>
        ))}
      </div>

      {/* Offers Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffers.map((offer) => {
          const isCopied = copiedId === offer.id;
          return (
            <div
              key={offer.id}
              className={`relative rounded-2xl border p-5 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 ${
                isLight 
                  ? 'bg-white border-stone-200 hover:border-[#8C1D40]/30 shadow-sm hover:shadow-md'
                  : 'bg-zinc-950 border-zinc-900 hover:border-zinc-800 shadow-xl'
              }`}
            >
              {/* Holographic accent shimmer */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-[#8C1D40]/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div>
                {/* Header: Icon & Category */}
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl border flex items-center justify-center bg-gradient-to-br ${offer.color}`}>
                    {offer.icon}
                  </div>
                  <span className={`text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                    isLight 
                      ? 'bg-stone-100 border-stone-200 text-stone-500'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                  }`}>
                    {offer.category}
                  </span>
                </div>

                {/* Offer Title & Subtitle */}
                <h3 className={`text-base font-black uppercase tracking-tight ${
                  isLight ? 'text-stone-900' : 'text-white'
                }`}>
                  {offer.title}
                </h3>
                <h4 className={`text-xs font-bold mt-1 ${
                  isLight ? 'text-[#8C1D40]' : 'text-amber-500'
                }`}>
                  {offer.subtitle}
                </h4>

                {/* Offer Description */}
                <p className={`text-xs leading-relaxed mt-3.5 font-medium ${
                  isLight ? 'text-stone-600' : 'text-zinc-400'
                }`}>
                  {offer.description}
                </p>
              </div>

              {/* Footer: Expiry & Coupon Code Box */}
              <div className="mt-6 pt-4 border-t border-dashed flex items-center justify-between border-zinc-800">
                <div className="flex flex-col">
                  <span className={`text-[8px] font-bold uppercase tracking-wider ${
                    isLight ? 'text-stone-400' : 'text-zinc-500'
                  }`}>
                    VALID UNTIL
                  </span>
                  <span className={`text-[10px] font-bold font-mono mt-0.5 ${
                    isLight ? 'text-stone-700' : 'text-zinc-300'
                  }`}>
                    {offer.expiry}
                  </span>
                </div>

                {/* Copyable Promo Code Button */}
                <button
                  onClick={() => handleCopyCode(offer.id, offer.code)}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-black uppercase tracking-wider font-mono cursor-pointer transition-all duration-200 ${
                    isCopied
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                      : isLight
                        ? 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-[#8C1D40]/5 hover:border-[#8C1D40]/30 hover:text-[#8C1D40]'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                  }`}
                  id={`btn-copy-offer-${offer.id}`}
                  title="Click to copy coupon code"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>{offer.code}</span>
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
