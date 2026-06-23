/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Globe, Award, ShieldCheck, Heart, Send, Smartphone, Star, Twitter, Instagram, Youtube, Facebook } from 'lucide-react';
import MirajLogo from './MirajLogo';

interface FooterProps {
  theme?: 'dark' | 'light';
}

export default function Footer({ theme = 'dark' }: FooterProps) {
  const isLight = theme === 'light';
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.includes('@')) {
      setNewsletterSent(true);
    }
  };

  return (
    <footer
      className={`relative w-full border-t transition-colors duration-300 pt-16 pb-8 print:hidden overflow-hidden ${
        isLight
          ? 'border-stone-200 bg-gradient-to-b from-stone-100 to-stone-50 text-stone-600'
          : 'border-zinc-900 bg-gradient-to-b from-zinc-950 to-black text-zinc-400'
      }`}
      id="corporate-brand-footer"
    >
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[200px] rounded-full blur-3xl opacity-[0.04]"
          style={{ background: isLight ? '#8C1D40' : '#f59e0b' }}
        />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Segment: Brand logo, description and locations summary */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-dashed border-stone-300/30 md:border-zinc-800/50">
          <div className="md:col-span-5 flex flex-col items-start gap-4">
            <MirajLogo size="md" variant={isLight ? 'red' : 'gold'} isLight={isLight} />
            <p className={`text-xs leading-relaxed max-w-sm font-medium ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>
              Experience Indian cinema at its finest with state-of-the-art projection systems, Dolby Atmos immersive sound, and premium gold-class hospitality across India's fastest-growing multiplex network.
            </p>
            <div className="flex gap-2.5 mt-1">
              {[
                { icon: Facebook, label: 'Facebook', color: '#1877f2' },
                { icon: Twitter, label: 'Twitter', color: '#1da1f2' },
                { icon: Instagram, label: 'Instagram', color: '#e1306c' },
                { icon: Youtube, label: 'YouTube', color: '#ff0000' },
              ].map(({ icon: Icon, label, color }) => (
                <button
                  key={label}
                  aria-label={label}
                  className={`h-8 w-8 rounded-lg border flex items-center justify-center transition-all duration-200 hover:scale-110 hover:-translate-y-0.5 active:scale-95 cursor-pointer group ${
                    isLight
                      ? 'border-stone-200 bg-white text-stone-400 hover:text-white shadow-sm'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-500 hover:text-white'
                  }`}
                  style={{}}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = color, e.currentTarget.style.backgroundColor = color)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '', e.currentTarget.style.backgroundColor = '')}
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Column 1: Cinematic Offerings */}
            <div className="flex flex-col items-start text-left gap-3">
              <h4 className={`text-xs font-black uppercase tracking-widest ${isLight ? 'text-stone-900' : 'text-white'}`}>
                Experience
              </h4>
              <ul className="flex flex-col gap-2 text-xs font-medium">
              {["Now Showing", "Upcoming Release", "IMAX 3D Experience", "GOLD VIP Lounges", "Corporate Booking"].map((item) => (
                  <li
                    key={item}
                    className={`cursor-pointer transition-all duration-200 hover:translate-x-1 ${isLight ? 'hover:text-[#8C1D40]' : 'hover:text-amber-500'}`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Corporate Info */}
            <div className="flex flex-col items-start text-left gap-3">
              <h4 className={`text-xs font-black uppercase tracking-widest ${isLight ? 'text-stone-900' : 'text-white'}`}>
                Company
              </h4>
              <ul className="flex flex-col gap-2 text-xs font-medium">
                {['About Miraj', 'Careers @ Miraj', 'Media Coverage', 'Partnerships', 'Legal Notices'].map((item) => (
                  <li
                    key={item}
                    className={`cursor-pointer transition-all duration-200 hover:translate-x-1 ${isLight ? 'hover:text-[#8C1D40]' : 'hover:text-amber-500'}`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Regional Hubs */}
            <div className="flex flex-col items-start text-left gap-3 col-span-2 sm:col-span-1">
              <h4 className={`text-xs font-black uppercase tracking-widest ${isLight ? 'text-stone-900' : 'text-white'}`}>
                Key Cities
              </h4>
              <div className={`text-xs leading-relaxed font-semibold flex flex-wrap gap-x-3 gap-y-1.5 max-w-xs ${isLight ? 'text-stone-700' : 'text-zinc-350'}`}>
                {['Mumbai', 'Pune', 'Bengaluru', 'Belagavi', 'Nathdwara', 'Delhi NCR', 'Jaipur', 'Hyderabad'].map((city) => (
                  <span key={city} className={`cursor-pointer ${isLight ? 'hover:text-[#8C1D40]' : 'hover:text-amber-500'}`}>
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter & App Download Section */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 py-10 border-b border-dashed ${isLight ? 'border-stone-300/30' : 'border-zinc-800/50'}`}>
          {/* Newsletter */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Mail className={`h-4 w-4 ${isLight ? 'text-[#8C1D40]' : 'text-amber-500'}`} />
              <h4 className={`text-xs font-black uppercase tracking-widest ${isLight ? 'text-stone-900' : 'text-white'}`}>Stay in the Know</h4>
            </div>
            <p className={`text-xs ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>Get exclusive offers, early ticket access, and cinema news straight to your inbox.</p>
            {newsletterSent ? (
              <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold text-emerald-600 ${isLight ? 'border-emerald-200 bg-emerald-50' : 'border-emerald-500/20 bg-emerald-500/5'}`}>
                <Star className="h-3.5 w-3.5" />
                <span>You're subscribed! Expect great things in your inbox. 🎬</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`} />
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={newsletterEmail}
                    onChange={e => setNewsletterEmail(e.target.value)}
                    className={`w-full rounded-xl border pl-9 pr-4 py-2.5 text-xs focus:outline-none transition-all ${isLight ? 'border-stone-200 bg-white text-stone-900 focus:border-[#8C1D40]' : 'border-zinc-800 bg-zinc-900 text-white placeholder-zinc-500 focus:border-amber-500'}`}
                    id="footer-newsletter-input"
                  />
                </div>
                <button
                  type="submit"
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95 ${isLight ? 'bg-[#8C1D40] text-white hover:bg-[#701530]' : 'bg-amber-500 text-black hover:bg-amber-400'}`}
                >
                  <Send className="h-3 w-3" />
                  Subscribe
                </button>
              </form>
            )}
          </div>

          {/* App Download */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Smartphone className={`h-4 w-4 ${isLight ? 'text-[#8C1D40]' : 'text-amber-500'}`} />
              <h4 className={`text-xs font-black uppercase tracking-widest ${isLight ? 'text-stone-900' : 'text-white'}`}>Download the App</h4>
            </div>
            <p className={`text-xs ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>Book tickets on the go. Available on iOS and Android.</p>
            <div className="flex gap-3">
              {['App Store', 'Play Store'].map(store => (
                <button
                  key={store}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold transition-all hover:scale-[1.02] active:scale-95 cursor-pointer ${
                    isLight
                      ? 'border-stone-200 bg-white text-stone-700 hover:border-[#8C1D40]/40 shadow-sm'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-amber-500/40'
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  {store}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-10 border-b border-dashed border-stone-300/30 md:border-zinc-800/50 text-left">
          
          {/* Contact Details */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <h4 className={`text-xs font-black uppercase tracking-widest ${isLight ? 'text-stone-900' : 'text-white'}`}>
              Guest Support
            </h4>
            <div className="flex flex-col gap-3 text-xs font-medium">
              <div className="flex items-center gap-2.5">
                <Phone className={`h-4 w-4 ${isLight ? 'text-[#8C1D40]' : 'text-amber-500'}`} />
                <span>Toll-Free: <strong className={isLight ? 'text-stone-850' : 'text-zinc-250'}>1800-1203-699</strong></span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className={`h-4 w-4 ${isLight ? 'text-[#8C1D40]' : 'text-amber-500'}`} />
                <span>Email: <a href="mailto:contactus@mirajcinemas.com" className={`underline ${isLight ? 'text-stone-850 hover:text-[#8C1D40]' : 'text-zinc-250 hover:text-amber-500'}`}>contactus@mirajcinemas.com</a></span>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe className={`h-4 w-4 ${isLight ? 'text-[#8C1D40]' : 'text-amber-500'}`} />
                <span>Web: <a href="https://www.mirajcinemas.com" target="_blank" rel="noreferrer" className={`underline ${isLight ? 'text-stone-850 hover:text-[#8C1D40]' : 'text-zinc-250 hover:text-amber-500'}`}>www.mirajcinemas.com</a></span>
              </div>
            </div>
          </div>

          {/* Nathdwara Headquarters */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <MapPin className={`h-4 w-4 ${isLight ? 'text-[#8C1D40]' : 'text-amber-500'}`} />
              <h5 className={`text-xs font-black uppercase tracking-wider ${isLight ? 'text-stone-850' : 'text-zinc-250'}`}>
                Registered Office
              </h5>
            </div>
            <p className={`text-xs leading-relaxed font-medium ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>
              Miraj Campus, Nathdwara,<br />
              Rajsamand, Rajasthan - 313301, India.<br />
              <span className="text-[10px] uppercase font-mono mt-1 block">CIN: U92419RJ1987PTC004122</span>
            </p>
          </div>

          {/* Mumbai Corporate Office */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <MapPin className={`h-4 w-4 ${isLight ? 'text-[#8C1D40]' : 'text-amber-500'}`} />
              <h5 className={`text-xs font-black uppercase tracking-wider ${isLight ? 'text-stone-850' : 'text-zinc-250'}`}>
                Corporate HQ (Mumbai)
              </h5>
            </div>
            <p className={`text-xs leading-relaxed font-medium ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>
              Miraj Entertainment Ltd., 4th Floor,<br />
              Shalimar Moti Building, Malad Link Road,<br />
              Malad West, Mumbai, MH - 400064, India.
            </p>
          </div>

        </div>

        {/* Bottom Segment: Copyright & Trust badges */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-mono tracking-wider uppercase">
          <div className={`flex flex-col sm:flex-row items-center gap-2 sm:gap-4 font-semibold text-center sm:text-left ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>
            <span>© 2026 Miraj Entertainment Limited. All Rights Reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              <Award className="h-3 w-3" /> Division of Miraj Group
            </span>
          </div>

          <div className={`flex flex-wrap justify-center gap-4 ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> PCI Compliance Locked
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Heart className={`h-3 w-3 ${isLight ? 'text-[#8C1D40]' : 'text-amber-500'}`} /> Made in India
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
