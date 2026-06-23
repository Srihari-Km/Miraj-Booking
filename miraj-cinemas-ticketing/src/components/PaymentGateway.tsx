/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShieldAlert, CreditCard, ChevronLeft, Ticket, Check, RefreshCw, Star, Percent, Sparkles, Clock, UtensilsCrossed, ChevronDown } from 'lucide-react';
import { Movie, Showtime, Seat, TransactionDetails, City, SelectedFoodItem } from '../types';
import MirajLogo from './MirajLogo';
import SavedCards from './Profile/SavedCards';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { SavedCard } from '../types/user';

interface PaymentGatewayProps {
  city: City;
  movie: Movie;
  showtime: Showtime;
  selectedSeats: Seat[];
  selectedFood: SelectedFoodItem[];
  onBackToConcessions: () => void;
  onPaymentSuccess: (details: TransactionDetails) => void;
  onTimeoutReset: () => void;
  theme?: 'dark' | 'light';
}

export default function PaymentGateway({
  city,
  movie,
  showtime,
  selectedSeats,
  selectedFood,
  onBackToConcessions,
  onPaymentSuccess,
  onTimeoutReset,
  theme = 'dark'
}: PaymentGatewayProps) {
  const { isAuthenticated } = useAuth();
  const { savedCards, addCard, addBookingRecord } = useUser();

  // Saved card selection state
  const [selectedSavedCard, setSelectedSavedCard] = useState<SavedCard | null>(
    savedCards.find(c => c.isDefault) || null
  );
  const [usingSavedCard, setUsingSavedCard] = useState(isAuthenticated && savedCards.length > 0);
  const [saveNewCard, setSaveNewCard] = useState(false);

  // 10-Minute Lock seat retention state (600 seconds)
  const [timeLeft, setTimeLeft] = useState(600);
  const [sessionExpired, setSessionExpired] = useState(false);

  const isLight = theme === 'light';

  // Coupon promo state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Card details state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const { user } = useAuth();
  
  // Billing details pre-filled from user profile
  const [billingName, setBillingName] = useState(user?.name || '');
  const [billingEmail, setBillingEmail] = useState(user?.email || '');
  const [billingPhone, setBillingPhone] = useState(user?.phone || '');

  useEffect(() => {
    if (user) {
      setBillingName(prev => prev || user.name);
      setBillingEmail(prev => prev || user.email);
      setBillingPhone(prev => prev || user.phone);
    }
  }, [user]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  // Financial values
  const rawSeatsSubtotal = selectedSeats.reduce((acc, seat) => {
    const price = seat.type === 'vip'
      ? showtime.priceVIP
      : seat.type === 'premium'
        ? showtime.priceStandard + 150
        : showtime.priceStandard;
    return acc + price;
  }, 0);

  const foodSubtotal = selectedFood.reduce((acc, item) => {
    return acc + (item.foodItem.price * item.quantity);
  }, 0);

  const rawSubtotal = rawSeatsSubtotal + foodSubtotal;
  const convFeesAndTaxes = Math.round(rawSeatsSubtotal * 0.12); // 12% GST + processing fees (only on seats)
  const subTotalBeforeDiscount = rawSeatsSubtotal + foodSubtotal + convFeesAndTaxes;
  const payTotal = Math.max(0, subTotalBeforeDiscount - discountAmount);

  // Countdown clock ticker
  useEffect(() => {
    if (timeLeft <= 0) {
      setSessionExpired(true);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const validateAndApplyCoupon = (code: string) => {
    setCouponError(null);
    const formattedCode = code.trim().toUpperCase();

    if (formattedCode === '') {
      setCouponError('Please enter a coupon code.');
      return false;
    }

    let discount = 0;
    if (formattedCode === 'MIRAJPROMO') {
      discount = Math.round(subTotalBeforeDiscount * 0.20);
    } else if (formattedCode === 'ICICIBOGO') {
      if (selectedSeats.length <= 1) {
        setCouponError('ICICIBOGO BOGO offer requires booking at least 2 seats.');
        return false;
      }
      const ticketPrices = selectedSeats.map(s => s.type === 'vip' ? showtime.priceVIP : showtime.priceStandard);
      const cheapestTicket = Math.min(...ticketPrices);
      discount = Math.min(250, cheapestTicket);
    } else if (formattedCode === 'SBISIG250') {
      if (selectedSeats.length < 2) {
        setCouponError('SBISIG250 requires a minimum booking of 2 seats.');
        return false;
      }
      discount = 250;
    } else if (formattedCode === 'MIRAJNEW') {
      discount = Math.round(subTotalBeforeDiscount * 0.15);
    } else if (formattedCode === 'MIDWEEK75') {
      discount = 75;
    } else if (formattedCode === 'AMZPAY50') {
      discount = Math.min(50, Math.round(subTotalBeforeDiscount * 0.10));
    } else if (formattedCode === 'PTMNEW100') {
      if (rawSeatsSubtotal < 300) {
        setCouponError('PTMNEW100 requires a minimum booking value of ₹300.');
        return false;
      }
      discount = 100;
    } else {
      setCouponError(`Coupon "${formattedCode}" is invalid or expired.`);
      return false;
    }

    setDiscountAmount(discount);
    setAppliedCoupon(formattedCode);
    return true;
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    validateAndApplyCoupon(couponInput);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponError(null);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCardError(null);

    // 1. Validate contact/billing details first (always required)
    if (billingName.trim().length < 3) {
      setCardError('Please enter a valid Contact Name.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(billingEmail)) {
      setCardError('Please enter a valid Email Address.');
      return;
    }
    if (billingPhone.replace(/\D/g, '').length !== 10) {
      setCardError('Please enter a valid 10-digit Phone Number.');
      return;
    }

    // 2. Validate card details only if not paying with a saved card
    if (!usingSavedCard || !selectedSavedCard) {
      if (cardName.trim().length < 3) {
        setCardError('Please enter a valid Cardholder Name.');
        return;
      }
      if (cardNumber.length < 16) {
        setCardError('Please enter a complete 16-digit card number.');
        return;
      }
      if (cardExpiry.length < 5) {
        setCardError('Please enter a valid expiry date in MM/YY format.');
        return;
      }
      if (cardCvv.length < 3) {
        setCardError('Please enter a complete 3-digit CVV security code.');
        return;
      }
    }

    setIsSubmitting(true);

    // Simulate 1.5 seconds payment POS processing network gateway handshakes
    setTimeout(() => {
      // Save new card to profile if requested
      if (saveNewCard && isAuthenticated && !usingSavedCard && cardName && cardNumber.length >= 4) {
        addCard({
          cardHolder: cardName,
          lastFourDigits: cardNumber.slice(-4),
          expiryDate: cardExpiry,
          cardType: 'Visa',
          isDefault: savedCards.length === 0,
        });
      }

      const generatedId = `MRJ-${city.substring(0,3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const completedTransaction: TransactionDetails = {
        bookingId: generatedId,
        city,
        movie,
        theaterName: showtime.theaterName,
        showtime,
        selectedSeats,
        originalTotal: subTotalBeforeDiscount,
        discount: discountAmount,
        finalTotal: payTotal,
        couponCode: appliedCoupon || undefined,
        bookingTime: new Date().toLocaleString(),
        foodItems: selectedFood
      };

      // Persist booking record to user history
      if (isAuthenticated) {
        addBookingRecord({
          bookingId: generatedId,
          movieTitle: movie.title,
          moviePosterUrl: movie.posterUrl,
          theaterName: showtime.theaterName,
          showtime: showtime.time,
          screenType: showtime.screenType,
          selectedSeatIds: selectedSeats.map(s => s.id),
          finalTotal: payTotal,
          bookedAt: new Date().toLocaleString(),
          city,
        });
      }
      
      setIsSubmitting(false);
      onPaymentSuccess(completedTransaction);
    }, 1600);
  };

  // If the 10 minute lock expires, force reset
  const handleTimeoutResetConfirm = () => {
    onTimeoutReset();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 relative" id="payment-gateway-wrapper">
      
      {/* Session Timeout Warning Modal Overlay */}
      {sessionExpired && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="max-w-md w-full rounded-2xl border border-red-500/30 bg-zinc-950 p-8 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-red-600 animate-pulse" />
            
            <div className="mx-auto h-14 w-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5 text-red-500 animate-bounce">
              <Clock className="h-7 w-7" />
            </div>

            <h3 className="text-xl font-black text-white uppercase" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              TTL Lock Released!
            </h3>
            
            <p className="text-sm text-zinc-400 leading-relaxed mt-3">
              The 10-minute temporary seat retention lock in our database has expired to allow other moviegoers to secure these tickets.
            </p>

            <button
              onClick={handleTimeoutResetConfirm}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-red-500 to-red-600 py-3.5 text-xs font-black uppercase tracking-wider text-white hover:from-red-400 hover:to-red-500 transition-colors"
            >
              Understand & Restart Booking
            </button>
          </div>
        </div>
      )}

      {/* Back to Concessions Trigger */}
      <button
        onClick={onBackToConcessions}
        className={`mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors py-2 cursor-pointer ${
          isLight ? 'text-stone-550 hover:text-[#8C1D40]' : 'text-zinc-400 hover:text-amber-400'
        }`}
        id="checkout-back-button"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Return to Snack Concessions</span>
      </button>

      {/* 10-Minute Lock alert banner widget */}
      <div 
        className={`mb-8 rounded-xl border p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-left ${
          isLight 
            ? 'border-stone-200 bg-gradient-to-r from-stone-50 to-stone-100/50' 
            : 'border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-amber-500/10'
        }`}
        id="checkout-lock-timer-banner"
      >
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center animate-pulse border ${
            isLight 
              ? 'bg-[#8C1D40]/10 border-[#8C1D40]/25 text-[#8C1D40]' 
              : 'bg-amber-500/15 border-amber-500/30 text-amber-500'
          }`}>
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h4 className={`font-bold text-sm ${isLight ? 'text-stone-850' : 'text-zinc-200'}`}>Holding Your Seats!</h4>
            <p className={`text-xs leading-normal mt-0.5 ${isLight ? 'text-stone-500' : 'text-zinc-450'}`}>
              These seats are temporarily locked in the Miraj ERP cloud registry. Complete check-out before the timer runs out.
            </p>
          </div>
        </div>

        <div className={`rounded-xl border px-4 py-2 text-center shadow-sm ${
          isLight ? 'bg-white border-stone-200' : 'bg-zinc-950 border-amber-500/40'
        }`}>
          <span className={`block text-[8px] font-bold uppercase tracking-widest font-mono ${
            isLight ? 'text-[#8C1D40]' : 'text-amber-500'
          }`}>POS TICKET LOCK</span>
          <span className={`text-xl font-mono font-black tracking-widest ${
            isLight ? 'text-stone-900' : 'text-white'
          }`}>{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Checkout Summary Screen with background WATERMARK custom branding */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div 
            className={`rounded-2xl border p-6 sm:p-8 text-left shadow-xl relative overflow-hidden transition-all backdrop-blur-md ${
              isLight ? 'border-stone-200/80 bg-white/60' : 'border-zinc-900 bg-zinc-950/80'
            }`}
            id="checkout-summary-card"
          >
            {/* requested: Brand identity watermark next to transaction details */}
            <div className="absolute right-0 bottom-0 pointer-events-none opacity-5 translate-x-12 translate-y-12 select-none">
              <MirajLogo size="xl" variant={isLight ? 'red' : 'gold'} isLight={isLight} />
            </div>

            <div className={`border-b pb-5 mb-5 flex justify-between items-start ${
              isLight ? 'border-stone-100' : 'border-zinc-900'
            }`}>
              <div>
                <span className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest font-mono ${
                  isLight ? 'bg-[#8C1D40]/10 text-[#8C1D40]' : 'bg-amber-500/10 text-amber-400'
                }`}>
                  Order Summary
                </span>
                <h3 className={`text-2xl font-black uppercase mt-2.5 ${isLight ? 'text-stone-900' : 'text-white'}`} style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                  {movie.title}
                </h3>
              </div>
              <span className={`rounded border px-2 py-0.5 text-xs font-bold ${
                isLight ? 'bg-stone-50 border-stone-200 text-stone-700' : 'bg-zinc-850 border-zinc-700 text-amber-400'
              }`}>
                {movie.rating}
              </span>
            </div>

            {/* Multiplex show details */}
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold mb-6">
              <div>
                <span className={`uppercase tracking-wider block ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>MULTIPLEX VENUE</span>
                <span className={`mt-1 block ${isLight ? 'text-stone-800' : 'text-zinc-200'}`}>{showtime.theaterName}</span>
              </div>
              <div>
                <span className={`uppercase tracking-wider block ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>SHOWTIME SLOT</span>
                <span className={`mt-1 block font-bold ${isLight ? 'text-[#8C1D40]' : 'text-amber-400'}`}>{showtime.time} • {showtime.screenType}</span>
              </div>
            </div>

            {/* Chosen seats and types breakdown */}
            <div className={`border-t pt-5 mb-6 ${isLight ? 'border-stone-100' : 'border-zinc-900'}`}>
              <span className={`text-xs uppercase tracking-wider font-semibold block mb-3 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>LOCKED SEATS</span>
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((seat) => (
                  <div 
                    key={seat.id}
                    className={`rounded-lg px-3 py-1.5 border flex items-center gap-1.5 text-xs font-bold ${
                      seat.type === 'vip' 
                        ? isLight 
                          ? 'border-amber-400 bg-amber-50 text-amber-850' 
                          : 'border-amber-500/30 bg-amber-505/10 text-amber-400' 
                        : isLight 
                          ? 'border-stone-200 bg-stone-50 text-stone-700' 
                          : 'border-zinc-800 bg-zinc-900 text-zinc-300'
                    }`}
                  >
                    <Ticket className="h-3.5 w-3.5 text-stone-400" />
                    <span>{seat.id}</span>
                    <span className="text-[10px] font-medium text-stone-400">
                      (₹{seat.type === 'vip' ? showtime.priceVIP : seat.type === 'premium' ? showtime.priceStandard + 150 : showtime.priceStandard})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Concessions Breakdown */}
            {selectedFood && selectedFood.length > 0 && (
              <div className={`border-t pt-5 mb-6 ${isLight ? 'border-stone-100' : 'border-zinc-900'}`}>
                <span className={`text-xs uppercase tracking-wider font-semibold block mb-3 ${isLight ? 'text-stone-400' : 'text-zinc-550'}`}>SELECTED SNACKS</span>
                <div className="flex flex-col gap-2">
                  {selectedFood.map((item) => (
                    <div 
                      key={item.foodItem.id} 
                      className={`flex justify-between items-center text-xs py-1 ${
                        isLight ? 'text-stone-650' : 'text-zinc-450'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold">
                        <UtensilsCrossed className="h-3.5 w-3.5 text-stone-400" />
                        <span>{item.foodItem.name} (x{item.quantity})</span>
                      </div>
                      <span className="font-mono font-bold">₹{item.foodItem.price * item.quantity}.00</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing calculations */}
            <div className={`border-t pt-5 flex flex-col gap-3 font-mono text-xs ${isLight ? 'border-stone-100' : 'border-zinc-900'}`}>
              <div className="flex justify-between text-stone-500">
                <span>SEAT BASE SUB-TOTAL:</span>
                <span className={isLight ? 'text-stone-850' : 'text-white'}>₹{rawSeatsSubtotal}.00</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>FOOD & BEVERAGES SUB-TOTAL:</span>
                <span className={isLight ? 'text-stone-850' : 'text-white'}>₹{foodSubtotal}.00</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>CONVENIENCE CHARGES & GST (12%):</span>
                <span className={isLight ? 'text-stone-850' : 'text-white'}>₹{convFeesAndTaxes}.00</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 bg-emerald-50 p-2 rounded border border-emerald-100 font-bold">
                  <div className="flex items-center gap-1">
                    <Percent className="h-3.5 w-3.5" />
                    <span>PROMO CODE VERIFIED ("{appliedCoupon}"):</span>
                  </div>
                  <span>-₹{discountAmount}.00</span>
                </div>
              )}

              <div className={`border-t pt-4 mt-2 flex justify-between text-base font-black ${isLight ? 'border-stone-150' : 'border-zinc-900'}`}>
                <span className={`font-sans tracking-tight ${isLight ? 'text-stone-700' : 'text-zinc-350'}`}>TOTAL POS RECKONING:</span>
                <span className={isLight ? 'text-[#8C1D40]' : 'text-amber-400'}>₹{payTotal}.00</span>
              </div>
            </div>

          </div>

          {/* Interactive Coupon Validation Segment */}
          <div className={`rounded-2xl border p-6 text-left shadow-md transition-all backdrop-blur-md ${
            isLight ? 'border-stone-200/80 bg-white/60' : 'border-zinc-900 bg-zinc-950'
          }`}>
            <h4 className={`text-sm font-bold uppercase tracking-wider mb-3 ${isLight ? 'text-stone-800' : 'text-zinc-300'}`}>Redeem Corporate Gift Coupon / Promo Card</h4>
            <form onSubmit={handleApplyCoupon} className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Try typing 'MIRAJPROMO'"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className={`w-full rounded-xl border px-4 py-3 text-xs md:text-sm placeholder-stone-400 focus:outline-none transition-colors ${
                    isLight 
                      ? 'border-stone-200 bg-stone-50 text-stone-850 focus:border-[#8C1D40]' 
                      : 'border-zinc-800 bg-zinc-900 text-white placeholder-zinc-500 focus:border-amber-500'
                  }`}
                  id="coupon-input-field"
                />
                
                {appliedCoupon && (
                  <div className="absolute right-3 top-3 text-xs font-black text-emerald-600 uppercase flex items-center gap-0.5">
                    <Check className="h-3.5 w-3.5" />
                    <span>Applied</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className={`rounded-xl px-5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  isLight 
                    ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200' 
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                }`}
                id="apply-coupon-button"
              >
                Apply
              </button>
            </form>

            {/* Coupon state responses */}
            {couponError && (
              <p className="text-xs text-red-500 font-bold mt-2 pl-1">
                {couponError}
              </p>
            )}

            {appliedCoupon && (
              <div className="mt-3 flex items-center justify-between rounded-xl border border-emerald-500/25 bg-emerald-50 px-3 py-2 text-xs">
                <p className="text-emerald-700 font-medium">
                  Success! Code <strong className="font-mono">{appliedCoupon}</strong> applied correctly. Enjoy your discount of ₹{discountAmount}.00!
                </p>
                <button 
                  onClick={handleRemoveCoupon}
                  className="text-stone-500 hover:text-[#8C1D40] underline text-[10px] uppercase font-bold cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Active Coupon Code List */}
            <div className={`mt-6 pt-5 border-t border-dashed ${isLight ? 'border-stone-150' : 'border-zinc-900'}`}>
              <h5 className={`text-xs font-black uppercase tracking-wider mb-3 ${isLight ? 'text-stone-700' : 'text-zinc-400'}`}>
                Available Offers & Promo Codes
              </h5>
              <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
                {[
                  { code: 'MIRAJPROMO', title: 'MIRAJPROMO (20% Off)', desc: 'Save 20% on your entire booking subtotal.' },
                  { code: 'ICICIBOGO', title: 'ICICIBOGO (BOGO up to ₹250)', desc: 'Buy 1 Get 1 ticket free, up to ₹250. Min 2 seats.' },
                  { code: 'SBISIG250', title: 'SBISIG250 (Flat ₹250 Off)', desc: 'Save flat ₹250. Requires a minimum of 2 seats.' },
                  { code: 'MIRAJNEW', title: 'MIRAJNEW (15% Off)', desc: 'First time user special. Save 15% on tickets & snacks.' },
                  { code: 'MIDWEEK75', title: 'MIDWEEK75 (Flat ₹75 Off)', desc: 'Wednesday showtime promo. Save flat ₹75.' },
                  { code: 'AMZPAY50', title: 'AMZPAY50 (10% Off up to ₹50)', desc: 'Save 10% on UPI transactions, up to ₹50.' }
                ].map((offer) => {
                  const isCurrent = appliedCoupon === offer.code;
                  return (
                    <div 
                      key={offer.code} 
                      className={`rounded-xl border p-3 flex justify-between items-center transition-all ${
                        isCurrent 
                          ? isLight 
                            ? 'border-emerald-500 bg-emerald-50/50' 
                            : 'border-emerald-500 bg-emerald-500/5'
                          : isLight 
                            ? 'border-stone-150 bg-stone-50 hover:bg-stone-100' 
                            : 'border-zinc-900 bg-zinc-900/30 hover:bg-zinc-900/60'
                      }`}
                    >
                      <div className="text-left flex-1 pr-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-black font-mono px-2 py-0.5 rounded border ${
                            isCurrent 
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600' 
                              : isLight 
                                ? 'bg-white border-stone-200 text-[#8C1D40]' 
                                : 'bg-zinc-950 border-zinc-800 text-amber-500'
                          }`}>
                            {offer.code}
                          </span>
                          <span className={`text-xs font-bold ${isLight ? 'text-stone-850' : 'text-zinc-200'}`}>
                            {offer.title}
                          </span>
                        </div>
                        <p className={`text-[10px] mt-1 ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>
                          {offer.desc}
                        </p>
                      </div>

                      {isCurrent ? (
                        <span className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-0.5 shrink-0 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg">
                          <Check className="h-3 w-3" />
                          <span>Applied</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => validateAndApplyCoupon(offer.code)}
                          className={`text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg border cursor-pointer transition-all duration-200 shrink-0 ${
                            isLight 
                              ? 'border-stone-200 bg-white hover:bg-[#8C1D40]/5 hover:border-[#8C1D40]/30 hover:text-[#8C1D40] text-stone-700' 
                              : 'border-zinc-800 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 hover:text-white'
                          }`}
                        >
                          Apply
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Premium Interactive Mock Payment Interface */}
        <div className="lg:col-span-5">
          <div className={`rounded-2xl border p-6 sm:p-8 text-left shadow-xl h-full flex flex-col justify-between transition-all backdrop-blur-md ${
            isLight ? 'border-stone-200/80 bg-white/60' : 'border-zinc-900 bg-zinc-950'
          }`}>
            <div>
              <div className={`flex items-center gap-2 border-b pb-5 mb-6 ${isLight ? 'border-stone-100' : 'border-zinc-900'}`}>
                <CreditCard className={`h-5 w-5 ${isLight ? 'text-[#8C1D40]' : 'text-amber-500'}`} />
                <h3 className={`text-lg font-black uppercase tracking-tight ${isLight ? 'text-stone-900' : 'text-white'}`} style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                  Unified Payment Gateway
                </h3>
              </div>

              <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-4">

                {/* Saved cards selector (authenticated users only) */}
                {isAuthenticated && savedCards.length > 0 && (
                  <div className={`rounded-xl border p-3 ${isLight ? 'border-stone-200 bg-stone-50' : 'border-zinc-800 bg-zinc-900/50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>Saved Cards</span>
                      <button
                        type="button"
                        onClick={() => setUsingSavedCard(v => !v)}
                        className={`text-[10px] font-bold underline transition-colors cursor-pointer ${isLight ? 'text-[#8C1D40]' : 'text-amber-500'}`}
                      >
                        {usingSavedCard ? 'Use New Card' : 'Use Saved Card'}
                      </button>
                    </div>
                    {usingSavedCard && (
                      <SavedCards
                        theme={theme}
                        compact
                        onSelectCard={setSelectedSavedCard}
                      />
                    )}
                  </div>
                )}

                {/* Contact & Billing Details */}
                <div className={`rounded-xl border p-4.5 flex flex-col gap-3.5 text-left ${
                  isLight ? 'border-stone-200 bg-stone-50' : 'border-zinc-800 bg-zinc-900/30'
                }`}>
                  <h4 className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-stone-500' : 'text-zinc-450'}`}>
                    Contact & Billing Details
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="flex flex-col gap-1.5 text-xs font-semibold text-left">
                      <label className="text-stone-400">CONTACT NAME</label>
                      <input
                        type="text"
                        required
                        placeholder="Your full name"
                        value={billingName}
                        onChange={(e) => setBillingName(e.target.value)}
                        className={`rounded-xl border px-4 py-3 focus:outline-none ${
                          isLight 
                            ? 'border-stone-200 bg-white text-stone-850 placeholder-stone-450 focus:border-[#8C1D40]' 
                            : 'border-zinc-800 bg-zinc-900 text-white placeholder-zinc-555 focus:border-amber-500'
                        }`}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 text-xs font-semibold text-left">
                      <label className="text-stone-400">PHONE NUMBER</label>
                      <input
                        type="text"
                        required
                        placeholder="10-digit phone number"
                        value={billingPhone}
                        onChange={(e) => setBillingPhone(e.target.value)}
                        className={`rounded-xl border px-4 py-3 focus:outline-none ${
                          isLight 
                            ? 'border-stone-200 bg-white text-stone-850 placeholder-stone-450 focus:border-[#8C1D40]' 
                            : 'border-zinc-800 bg-zinc-900 text-white placeholder-zinc-555 focus:border-amber-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 text-xs font-semibold text-left">
                    <label className="text-stone-400">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. name@example.com"
                      value={billingEmail}
                      onChange={(e) => setBillingEmail(e.target.value)}
                      className={`rounded-xl border px-4 py-3 focus:outline-none ${
                        isLight 
                          ? 'border-stone-200 bg-white text-stone-850 placeholder-stone-455 focus:border-[#8C1D40]' 
                          : 'border-zinc-800 bg-zinc-900 text-white placeholder-zinc-555 focus:border-amber-500'
                      }`}
                    />
                  </div>
                </div>

                {!usingSavedCard && (
                  <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                    {/* Visual Credit Card Decoration */}
                    <div className="rounded-xl bg-gradient-to-br from-[#1C1C1E] via-[#2C2C2E] to-[#1C1C1E] p-5 border border-zinc-800 text-left flex flex-col justify-between h-40 shadow-inner relative overflow-hidden text-white">
                      <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none w-28 h-28 border border-amber-500/30 rounded-full translate-x-8 translate-y-8" />
                      
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-bold tracking-widest text-zinc-500 font-mono">MIRAJ EXPRESS GOLD</span>
                        <div className="h-6 w-8 rounded bg-zinc-800/10 border border-zinc-700 flex items-center justify-center text-amber-500/75">
                          <Sparkles className="h-3.5 w-3.5" />
                        </div>
                      </div>

                      <div className="text-sm font-mono tracking-widest text-zinc-300 font-black">
                        {cardNumber ? cardNumber.replace(/(\d{4})/g, '$1 ').trim().substring(0, 19) : '•••• •••• •••• ••••'}
                      </div>

                      <div className="flex justify-between items-end">
                        <div>
                          <span className="block text-[8px] text-zinc-500 uppercase font-mono">Card Holder</span>
                          <span className="text-[10px] text-white uppercase font-bold truncate max-w-[120px] block">
                            {cardName || 'MEMBER NAME'}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-zinc-500 uppercase font-mono">Expires</span>
                          <span className="text-[10px] text-white font-bold font-mono">
                            {cardExpiry || 'MM/YY'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Real inputs */}
                    <div className="flex flex-col gap-1.5 text-xs font-semibold text-left">
                      <label className="text-stone-400">CARDHOLDER NAME</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter full name on card"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className={`rounded-xl border px-4 py-3 focus:outline-none ${
                          isLight 
                            ? 'border-stone-200 bg-stone-50 text-stone-850 placeholder-stone-455 focus:border-[#8C1D40]' 
                            : 'border-zinc-800 bg-zinc-900 text-white placeholder-zinc-600 focus:border-amber-500'
                        }`}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 text-xs font-semibold text-left">
                      <label className="text-stone-400">CARD NUMBER</label>
                      <input
                        type="text"
                        maxLength={16}
                        required
                        placeholder="16-digit card number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                        className={`rounded-xl border px-4 py-3 font-mono tracking-widest focus:outline-none ${
                          isLight 
                            ? 'border-stone-200 bg-stone-50 text-stone-850 placeholder-stone-455 focus:border-[#8C1D40]' 
                            : 'border-zinc-800 bg-zinc-900 text-white placeholder-zinc-600 focus:border-amber-500'
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5 text-xs font-semibold text-left">
                        <label className="text-stone-400">VALID THRU</label>
                        <input
                          type="text"
                          maxLength={5}
                          required
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => {
                            let text = e.target.value.replace(/\D/g, '');
                            if (text.length > 2) {
                              text = text.substring(0, 2) + '/' + text.substring(2, 4);
                            }
                            setCardExpiry(text);
                          }}
                          className={`rounded-xl border px-4 py-3 font-mono text-center focus:outline-none ${
                            isLight 
                              ? 'border-stone-200 bg-stone-50 text-stone-850 placeholder-stone-455 focus:border-[#8C1D40]' 
                              : 'border-zinc-800 bg-zinc-900 text-white placeholder-zinc-600 focus:border-amber-500'
                          }`}
                        />
                      </div>
                      
                      <div className="flex flex-col gap-1.5 text-xs font-semibold text-left">
                        <label className="text-stone-400">CVV CODE</label>
                        <input
                          type="password"
                          maxLength={3}
                          required
                          placeholder="•••"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                          className={`rounded-xl border px-4 py-3 font-mono text-center focus:outline-none ${
                            isLight 
                              ? 'border-stone-200 bg-stone-50 text-stone-850 placeholder-stone-455 focus:border-[#8C1D40]' 
                              : 'border-zinc-800 bg-zinc-900 text-white placeholder-zinc-600 focus:border-amber-500'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Save Card Checkbox */}
                    {isAuthenticated && (
                      <label className="flex items-center gap-2 mt-1 select-none cursor-pointer self-start">
                        <input
                          type="checkbox"
                          checked={saveNewCard}
                          onChange={e => setSaveNewCard(e.target.checked)}
                          className={`rounded border h-3.5 w-3.5 focus:outline-none transition-all ${
                            isLight ? 'border-stone-300 text-[#8C1D40]' : 'border-zinc-700 text-amber-500 bg-zinc-900'
                          }`}
                        />
                        <span className={`text-xs font-semibold ${isLight ? 'text-stone-600' : 'text-zinc-400'}`}>
                          Save this card for future bookings
                        </span>
                      </label>
                    )}
                  </div>
                )}

                {cardError && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-400 font-semibold animate-bounce">
                    {cardError}
                  </div>
                )}

                <div className={`mt-4 rounded-xl p-4 border text-[11px] leading-relaxed ${
                  isLight 
                    ? 'bg-stone-50 border-stone-150 text-stone-400' 
                    : 'bg-zinc-900/40 border-zinc-900 text-zinc-500'
                }`}>
                  By clicking on checkout, you authorize Miraj Cinemas to secure these seats and deduct the total payable fee. POS seats locks are subject to our strict 10-minute automated purge routine under PCI standards.
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`rounded-xl py-4 text-xs font-black uppercase tracking-wider shadow-lg transition-all duration-300 disabled:opacity-50 mt-2 flex items-center justify-center gap-2 cursor-pointer ${
                    isLight 
                      ? 'bg-[#8C1D40] hover:bg-[#701530] text-white shadow-[#8C1D40]/10' 
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black'
                  }`}
                  id="checkout-finalize-button"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin text-white" />
                      <span>Verifying Card Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Authorize Payment - ₹{payTotal}.00</span>
                    </>
                  )}
                </button>

              </form>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
