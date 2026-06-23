/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { useBooking } from '../../contexts/BookingContext';
import MirajLogo from '../MirajLogo';

interface ForgotPasswordProps {
  theme?: 'dark' | 'light';
}

export default function ForgotPassword({ theme = 'dark' }: ForgotPasswordProps) {
  const { handleNavigate } = useBooking();
  const isLight = theme === 'light';

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setIsLoading(true);
    // Simulate network delay
    await new Promise(res => setTimeout(res, 1200));
    setIsLoading(false);
    setIsSent(true);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 transition-colors duration-300 ${
      isLight ? 'bg-stone-50' : 'bg-zinc-950'
    }`}>
      <div className={`relative w-full max-w-md rounded-2xl border p-8 shadow-2xl backdrop-blur-xl ${
        isLight ? 'border-stone-200 bg-white/90' : 'border-zinc-800 bg-zinc-950/90'
      }`}>
        <div className="flex flex-col items-center gap-3 mb-8">
          <MirajLogo size="md" variant={isLight ? 'red' : 'gold'} isLight={isLight} />
          <div className="text-center">
            <h1 className={`text-2xl font-black uppercase tracking-tight ${isLight ? 'text-stone-900' : 'text-white'}`} style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              Reset Password
            </h1>
            <p className={`text-sm mt-1 ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
              Enter your email and we'll send a reset link
            </p>
          </div>
        </div>

        {isSent ? (
          <div className="flex flex-col items-center gap-5 py-6 text-center">
            <div className={`h-16 w-16 rounded-full flex items-center justify-center ${isLight ? 'bg-emerald-50 border border-emerald-200' : 'bg-emerald-500/10 border border-emerald-500/20'}`}>
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
            <div>
              <h3 className={`text-lg font-black ${isLight ? 'text-stone-900' : 'text-white'}`}>Check your inbox!</h3>
              <p className={`text-sm mt-2 leading-relaxed ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
                A password reset link has been sent to <strong>{email}</strong>. Check your spam folder if not received.
              </p>
              <p className={`text-xs mt-2 italic ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>(This is a demo — no actual email is sent)</p>
            </div>
            <button
              onClick={() => handleNavigate('login')}
              className={`mt-2 flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
                isLight ? 'bg-[#8C1D40] text-white hover:bg-[#701530]' : 'bg-amber-500 text-black hover:bg-amber-400'
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>Email Address</label>
              <div className="relative">
                <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={`w-full rounded-xl border pl-10 pr-4 py-3.5 text-sm focus:outline-none transition-all ${
                    isLight
                      ? 'border-stone-200 bg-stone-50 text-stone-900 focus:border-[#8C1D40] focus:ring-2 focus:ring-[#8C1D40]/10'
                      : 'border-zinc-800 bg-zinc-900 text-white placeholder-zinc-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10'
                  }`}
                  id="forgot-password-email"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-500 font-semibold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`mt-2 w-full flex items-center justify-center gap-2 rounded-xl py-4 text-sm font-black uppercase tracking-wider shadow-lg transition-all disabled:opacity-60 active:scale-95 ${
                isLight ? 'bg-[#8C1D40] hover:bg-[#701530] text-white' : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 to-amber-500 text-black'
              }`}
            >
              {isLoading ? <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" /> : <><Send className="h-4 w-4" /><span>Send Reset Link</span></>}
            </button>

            <button type="button" onClick={() => handleNavigate('login')} className={`flex items-center justify-center gap-1.5 text-sm font-semibold transition-colors ${isLight ? 'text-stone-500 hover:text-stone-900' : 'text-zinc-400 hover:text-white'}`}>
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
