/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Phone, Mail, Globe, Clock, Send, Check } from 'lucide-react';

interface ContactSupportProps {
  theme?: 'dark' | 'light';
}

export default function ContactSupport({ theme = 'dark' }: ContactSupportProps) {
  const isLight = theme === 'light';
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsLoading(false);
    setSubmitted(true);
  };

  const inputClass = `w-full rounded-xl border px-4 py-3 text-sm focus:outline-none transition-all ${
    isLight
      ? 'border-stone-200 bg-stone-50 text-stone-900 placeholder-stone-400 focus:border-[#8C1D40] focus:ring-2 focus:ring-[#8C1D40]/10'
      : 'border-zinc-800 bg-zinc-900 text-white placeholder-zinc-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10'
  }`;

  const supportItems = [
    { icon: Phone, label: 'Toll-Free Helpline', value: '1800-1203-699', sub: 'Mon – Sun, 9:00 AM – 9:00 PM IST' },
    { icon: Mail, label: 'Email Support', value: 'contactus@mirajcinemas.com', sub: 'Response within 24 hours' },
    { icon: Globe, label: 'Corporate Website', value: 'www.mirajcinemas.com', sub: 'Live chat available on website' },
    { icon: Clock, label: 'Support Hours', value: '9:00 AM – 9:00 PM', sub: 'Monday to Sunday (Indian Standard Time)' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Contact Form */}
      <div className={`rounded-2xl border p-6 ${isLight ? 'border-stone-200 bg-white shadow-sm' : 'border-zinc-800 bg-zinc-900/30'}`}>
        <h3 className={`text-sm font-black uppercase tracking-wider mb-5 ${isLight ? 'text-stone-900' : 'text-white'}`}>
          Send a Message
        </h3>

        {submitted ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className={`h-14 w-14 rounded-full flex items-center justify-center ${isLight ? 'bg-emerald-50 border border-emerald-200' : 'bg-emerald-500/10 border border-emerald-500/20'}`}>
              <Check className="h-7 w-7 text-emerald-500" />
            </div>
            <div>
              <p className={`font-black text-base ${isLight ? 'text-stone-900' : 'text-white'}`}>Message Sent!</p>
              <p className={`text-sm mt-1 ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
                We'll get back to you within 24 hours at <strong>{formData.email}</strong>.
              </p>
              <p className={`text-xs mt-1 italic ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>(Demo mode — no actual message sent)</p>
            </div>
            <button
              onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}
              className={`rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider ${isLight ? 'bg-stone-100 text-stone-700 hover:bg-stone-200' : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'}`}
            >
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>Full Name</label>
                <input type="text" required placeholder="Your name" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className={inputClass} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>Email</label>
                <input type="email" required placeholder="you@email.com" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className={inputClass} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>Subject</label>
              <input type="text" required placeholder="e.g., Booking Issue, Refund Request" value={formData.subject} onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>Message</label>
              <textarea
                required
                rows={4}
                placeholder="Describe your issue in detail..."
                value={formData.message}
                onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                className={inputClass + ' resize-none'}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-black uppercase tracking-wider shadow-lg transition-all active:scale-95 disabled:opacity-60 ${
                isLight ? 'bg-[#8C1D40] text-white hover:bg-[#701530]' : 'bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500'
              }`}
            >
              {isLoading ? <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" /> : <><Send className="h-4 w-4" /><span>Send Message</span></>}
            </button>
          </form>
        )}
      </div>

      {/* Support Info */}
      <div className="flex flex-col gap-4">
        {supportItems.map(({ icon: Icon, label, value, sub }) => (
          <div
            key={label}
            className={`rounded-xl border p-4 flex items-start gap-4 transition-all hover:scale-[1.01] ${
              isLight ? 'border-stone-200 bg-white shadow-sm hover:border-[#8C1D40]/30' : 'border-zinc-800 bg-zinc-900/30 hover:border-amber-500/30'
            }`}
          >
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${isLight ? 'bg-[#8C1D40]/10 text-[#8C1D40]' : 'bg-amber-500/10 text-amber-500'}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>{label}</p>
              <p className={`text-sm font-black mt-0.5 ${isLight ? 'text-stone-900' : 'text-white'}`}>{value}</p>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
