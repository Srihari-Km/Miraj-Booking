/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { Search, X, HelpCircle, MessageSquare, BookOpen } from 'lucide-react';
import FAQAccordion from './FAQAccordion';
import ContactSupport from './ContactSupport';

interface HelpCenterProps {
  theme?: 'dark' | 'light';
}

type HelpTab = 'faq' | 'contact';

export default function HelpCenter({ theme = 'dark' }: HelpCenterProps) {
  const isLight = theme === 'light';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<HelpTab>('faq');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(value), 300);
  }, []);

  const tabs: { key: HelpTab; label: string; icon: typeof HelpCircle }[] = [
    { key: 'faq', label: 'FAQ', icon: BookOpen },
    { key: 'contact', label: 'Contact Support', icon: MessageSquare },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isLight ? 'bg-stone-50 text-stone-900' : 'bg-zinc-950 text-white'}`}>
      {/* Hero Header */}
      <div className={`relative overflow-hidden border-b ${isLight ? 'border-stone-200 bg-white' : 'border-zinc-800 bg-zinc-900'}`}>
        {/* Ambient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-10"
            style={{ background: isLight ? '#8C1D40' : '#f59e0b' }} />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-4 ${
            isLight ? 'border-[#8C1D40]/20 bg-[#8C1D40]/5 text-[#8C1D40]' : 'border-amber-500/20 bg-amber-500/5 text-amber-500'
          }`}>
            <HelpCircle className="h-3.5 w-3.5" />
            Help Center
          </div>

          <h1 className={`text-4xl sm:text-5xl font-black uppercase tracking-tight mb-4 ${isLight ? 'text-stone-900' : 'text-white'}`} style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
            How can we <span style={{ color: isLight ? '#8C1D40' : '#f59e0b' }}>help you?</span>
          </h1>
          <p className={`text-base mb-8 max-w-xl mx-auto ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
            Search our knowledge base or browse the FAQs below. Can't find what you need? Contact our support team.
          </p>

          {/* Search Bar */}
          <div className={`relative max-w-xl mx-auto rounded-2xl border shadow-lg overflow-hidden ${
            isLight ? 'border-stone-200 bg-white' : 'border-zinc-700 bg-zinc-800'
          }`}>
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${isLight ? 'text-stone-400' : 'text-zinc-400'}`} />
            <input
              type="text"
              placeholder="Search FAQs — try 'refund', 'seat', 'payment'..."
              value={searchQuery}
              onChange={e => handleSearchChange(e.target.value)}
              className={`w-full py-4 pl-12 pr-12 text-sm focus:outline-none bg-transparent ${isLight ? 'text-stone-900 placeholder-stone-400' : 'text-white placeholder-zinc-400'}`}
              id="help-center-search"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setDebouncedQuery(''); }}
                className={`absolute right-4 top-1/2 -translate-y-1/2 ${isLight ? 'text-stone-400 hover:text-stone-600' : 'text-zinc-400 hover:text-white'}`}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Tab Switcher */}
        <div className={`flex gap-1 rounded-xl border p-1 w-fit mb-8 ${isLight ? 'border-stone-200 bg-stone-100' : 'border-zinc-800 bg-zinc-900'}`}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeTab === tab.key
                  ? isLight
                    ? 'bg-white text-[#8C1D40] shadow-sm border border-stone-200'
                    : 'bg-zinc-800 text-amber-400 border border-zinc-700'
                  : isLight
                    ? 'text-stone-500 hover:text-stone-800'
                    : 'text-zinc-500 hover:text-zinc-200'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'faq' ? (
          <FAQAccordion searchQuery={debouncedQuery} theme={theme} />
        ) : (
          <ContactSupport theme={theme} />
        )}
      </div>
    </div>
  );
}
