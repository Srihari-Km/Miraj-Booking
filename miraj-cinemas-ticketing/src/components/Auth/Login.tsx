/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Film, ArrowRight, Chrome } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import MirajLogo from '../MirajLogo';

interface LoginProps {
  theme?: 'dark' | 'light';
}

export default function Login({ theme = 'dark' }: LoginProps) {
  const { login } = useAuth();
  const { handleNavigate } = useBooking();
  const isLight = theme === 'light';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    if (result.success) {
      handleNavigate('booking-hub');
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
  };

  const inputClass = `w-full rounded-xl border px-4 py-3.5 text-sm placeholder-stone-400 focus:outline-none transition-all duration-200 ${
    isLight
      ? 'border-stone-200 bg-stone-50 text-stone-900 focus:border-[#8C1D40] focus:ring-2 focus:ring-[#8C1D40]/10'
      : 'border-zinc-800 bg-zinc-900 text-white placeholder-zinc-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10'
  }`;

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 transition-colors duration-300 ${
      isLight ? 'bg-stone-50' : 'bg-zinc-950'
    }`}>
      {/* Ambient background glow */}
      <div className={`absolute inset-0 pointer-events-none ${isLight ? 'opacity-30' : 'opacity-20'}`}>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: isLight ? 'radial-gradient(circle, #8C1D4020, transparent)' : 'radial-gradient(circle, #f59e0b15, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl" style={{ background: isLight ? 'radial-gradient(circle, #8C1D4015, transparent)' : 'radial-gradient(circle, #f59e0b10, transparent)' }} />
      </div>

      <div className={`relative w-full max-w-md rounded-2xl border p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
        isLight
          ? 'border-stone-200 bg-white/90'
          : 'border-zinc-800 bg-zinc-950/90'
      }`}>
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <MirajLogo size="md" variant={isLight ? 'red' : 'gold'} isLight={isLight} />
          <div className="text-center">
            <h1 className={`text-2xl font-black uppercase tracking-tight ${isLight ? 'text-stone-900' : 'text-white'}`} style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              Welcome Back
            </h1>
            <p className={`text-sm mt-1 ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
              Sign in to your Miraj account
            </p>
          </div>
        </div>

        {/* Google dummy button */}
        <button
          type="button"
          className={`w-full flex items-center justify-center gap-3 rounded-xl border py-3 text-sm font-semibold mb-6 transition-all duration-200 hover:scale-[1.01] active:scale-95 ${
            isLight
              ? 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50 shadow-sm'
              : 'border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
          }`}
          id="google-login-button"
        >
          <Chrome className="h-4 w-4 text-blue-500" />
          <span>Continue with Google</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className={`flex-1 h-px ${isLight ? 'bg-stone-200' : 'bg-zinc-800'}`} />
          <span className={`text-xs font-semibold ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>OR</span>
          <div className={`flex-1 h-px ${isLight ? 'bg-stone-200' : 'bg-zinc-800'}`} />
        </div>

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
                className={inputClass + ' pl-10'}
                id="login-email-input"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>Password</label>
              <button
                type="button"
                onClick={() => handleNavigate('forgot-password')}
                className={`text-xs font-semibold transition-colors ${isLight ? 'text-[#8C1D40] hover:text-[#701530]' : 'text-amber-500 hover:text-amber-400'}`}
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={inputClass + ' pl-10 pr-10'}
                id="login-password-input"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-500 font-semibold animate-in fade-in duration-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`mt-2 w-full flex items-center justify-center gap-2 rounded-xl py-4 text-sm font-black uppercase tracking-wider shadow-lg transition-all duration-300 active:scale-95 disabled:opacity-60 ${
              isLight
                ? 'bg-[#8C1D40] hover:bg-[#701530] text-white'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black'
            }`}
            id="login-submit-button"
          >
            {isLoading ? (
              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className={`text-center text-sm mt-6 ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
          Don't have an account?{' '}
          <button
            onClick={() => handleNavigate('register')}
            className={`font-bold transition-colors ${isLight ? 'text-[#8C1D40] hover:underline' : 'text-amber-500 hover:underline'}`}
          >
            Create one free
          </button>
        </p>

        <p className={`text-center text-xs mt-3 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
          <button onClick={() => handleNavigate('booking-hub')} className="underline opacity-60 hover:opacity-100 transition-opacity">
            Continue as Guest →
          </button>
        </p>
      </div>
    </div>
  );
}
