/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  category: string;
  items: FAQItem[];
}

const FAQ_DATA: FAQCategory[] = [
  {
    category: 'Ticket Booking',
    items: [
      { q: 'How do I book a ticket?', a: 'Select a movie, choose your preferred showtime and date, pick your seats from the interactive seating map, optionally add food & beverages, and complete the payment. Your booking confirmation will be displayed on screen.' },
      { q: 'Can I book tickets for multiple people?', a: 'Yes! You can select up to 8 seats in a single booking. Just click each available seat on the seating map before proceeding to payment.' },
      { q: 'What is the seat lock timer?', a: 'Once you reach the payment screen, your selected seats are held for 10 minutes to complete checkout. After this window, the lock releases so other guests can book those seats.' },
      { q: 'Can I choose my seat category?', a: 'Absolutely. Rows A–C are Standard, Rows D–E are Premium (₹150 extra), and Rows F–G are VIP Recliner seats. Each offers different comfort levels and pricing.' },
    ],
  },
  {
    category: 'Payments',
    items: [
      { q: 'What payment methods are accepted?', a: 'We accept all major credit and debit cards (Visa, Mastercard, RuPay, Amex), UPI, and Miraj Gift Cards. More payment methods coming soon.' },
      { q: 'How do I apply a promo code?', a: 'On the payment/checkout screen, enter your promo code in the "Redeem Coupon" field and click Apply. Valid codes are listed on the checkout page (e.g., MIRAJPROMO, ICICIBOGO, MIRAJNEW).' },
      { q: 'Is my payment information secure?', a: 'Yes. All transactions are encrypted and PCI-DSS compliant. Your card details are never stored on our servers. We use bank-grade 256-bit SSL encryption for all payment data.' },
      { q: 'How do saved cards work?', a: 'After a successful booking, you can opt to save your card for future use. On subsequent bookings, a one-tap payment option appears with your saved cards. You can manage or delete saved cards from your Profile.' },
    ],
  },
  {
    category: 'Refunds & Cancellations',
    items: [
      { q: 'Can I cancel my booking?', a: 'Cancellations are permitted up to 2 hours before the showtime. A convenience fee of ₹50 per ticket applies. Cancellations requested less than 2 hours before the show are non-refundable.' },
      { q: 'How long does a refund take?', a: 'Refunds are processed to your original payment method within 5–7 business days. UPI and wallet refunds may appear faster (1–3 business days).' },
      { q: 'What if the show is cancelled by the cinema?', a: 'If Miraj Cinemas cancels a show, you will receive a full refund including all convenience fees within 3–5 business days. You may also opt for a credit to your Miraj Wallet.' },
    ],
  },
  {
    category: 'Seat Selection',
    items: [
      { q: 'What do the different seat colors mean?', a: 'Grey seats are already booked. White/blue seats are available. Yellow/gold seats are selected by you. Purple seats are Premium tier. Gold/dark border seats are VIP Recliner class.' },
      { q: 'Can I zoom into the seating layout?', a: 'Yes! Use the +/- zoom controls on the top-right of the seating map, or use your mouse wheel / trackpad pinch gesture to zoom in and out for a better view.' },
      { q: 'What is the difference between Standard, Premium, and VIP seats?', a: 'Standard (Rows A–C): Regular cinema seats. Premium (Rows D–E): Wider seats with extra legroom, priced ₹150 above standard. VIP Recliner (Rows F–G): Full reclining lounger seats at the best viewing angle, premium pricing.' },
    ],
  },
  {
    category: 'Membership & Profile',
    items: [
      { q: 'How do I create an account?', a: 'Click the "Login" button in the header, then select "Create one free". Fill in your name, email, phone number and password to register instantly.' },
      { q: 'What are the benefits of a Miraj account?', a: 'With a Miraj account you can view your full booking history, save payment cards for one-tap checkout, mark favourite movies, and receive personalized offers and exclusive promo codes.' },
      { q: 'How do I update my profile information?', a: 'Navigate to Profile (click your avatar in the header) → Settings tab. You can update your name, phone number, and notification preferences.' },
    ],
  },
  {
    category: 'Technical Issues',
    items: [
      { q: 'The page is not loading properly. What should I do?', a: 'Try clearing your browser cache and cookies, then reload the page. Ensure your browser is up to date. Chrome, Firefox, Safari, and Edge (latest versions) are fully supported.' },
      { q: 'I completed payment but didn\'t receive a booking confirmation.', a: 'Your booking should appear instantly on the receipt screen after payment. Check your email as well. If the issue persists, contact our support at contactus@mirajcinemas.com with your booking details.' },
      { q: 'The trailer video is not playing.', a: 'Ensure your browser allows autoplay with sound. If using a corporate or restricted network, YouTube embeds may be blocked. Try switching to a different network or browser.' },
    ],
  },
];

interface FAQAccordionProps {
  searchQuery: string;
  theme?: 'dark' | 'light';
}

export default function FAQAccordion({ searchQuery, theme = 'dark' }: FAQAccordionProps) {
  const isLight = theme === 'light';
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (key: string) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return FAQ_DATA;
    const q = searchQuery.toLowerCase();
    return FAQ_DATA.map(category => ({
      ...category,
      items: category.items.filter(item =>
        item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
      ),
    })).filter(cat => cat.items.length > 0);
  }, [searchQuery]);

  if (filteredData.length === 0) {
    return (
      <div className={`py-16 text-center rounded-2xl border border-dashed ${isLight ? 'border-stone-200 text-stone-400' : 'border-zinc-800 text-zinc-500'}`}>
        <p className="text-lg font-bold mb-2">No results found</p>
        <p className="text-sm">Try a different search term or browse all categories below.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {filteredData.map(category => (
        <div key={category.category}>
          <div className={`flex items-center gap-2 mb-3 pb-2 border-b ${isLight ? 'border-stone-200' : 'border-zinc-800'}`}>
            <ChevronRight className={`h-4 w-4 ${isLight ? 'text-[#8C1D40]' : 'text-amber-500'}`} />
            <h3 className={`text-sm font-black uppercase tracking-wider ${isLight ? 'text-stone-900' : 'text-white'}`}>
              {category.category}
            </h3>
          </div>
          <div className="flex flex-col gap-2">
            {category.items.map((item, idx) => {
              const key = `${category.category}-${idx}`;
              const isOpen = openItems.has(key);
              return (
                <div
                  key={key}
                  className={`rounded-xl border overflow-hidden transition-all duration-200 ${
                    isLight
                      ? isOpen ? 'border-[#8C1D40]/30 bg-[#8C1D40]/2' : 'border-stone-200 bg-white hover:border-stone-300'
                      : isOpen ? 'border-amber-500/30 bg-amber-500/2' : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700'
                  }`}
                >
                  <button
                    onClick={() => toggleItem(key)}
                    className={`w-full flex items-center justify-between p-4 text-left cursor-pointer ${
                      isLight ? 'text-stone-900' : 'text-white'
                    }`}
                  >
                    <span className="text-sm font-semibold pr-4">{item.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      } ${isLight ? 'text-[#8C1D40]' : 'text-amber-500'}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <p className={`px-4 pb-4 text-sm leading-relaxed ${isLight ? 'text-stone-600' : 'text-zinc-400'}`}>
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
