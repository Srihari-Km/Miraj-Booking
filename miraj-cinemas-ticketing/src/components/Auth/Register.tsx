/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import MirajLogo from '../MirajLogo';

interface RegisterProps {
  theme?: 'dark' | 'light';
}

export default function Register({ theme = 'dark' }: RegisterProps) {
  const { register } = useAuth();
  const { handleNavigate } = useBooking();
  const isLight = theme === 'light';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass = `w-full rounded-xl border px-4 py-3.5 text-sm placeholder-stone-400 focus:outline-none transition-all duration-200 ${
    isLight
      ? 'border-stone-200 bg-stone-50 text-stone-900 focus:border-[#8C1D40] focus:ring-2 focus:ring-[#8C1D40]/10'
      : 'border-zinc-800 bg-zinc-900 text-white placeholder-zinc-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10'
  }`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (name.trim().length < 2) { setError('Please enter your full name.'); return; }
    if (!email.includes('@')) { setError('Please enter a valid email address.'); return; }
    if (phone.replace(/\D/g, '').length < 10) { setError('Please enter a valid 10-digit phone number.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setIsLoading(true);
    const result = await register(name, email, phone, password);
    setIsLoading(false);
    if (result.success) {
      handleNavigate('booking-hub');
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }
  };

  const FieldWithIcon = ({ icon: Icon, label, id, type = 'text', value, onChange, placeholder, autoComplete }: any) => (
    <div className="flex flex-col gap-1.5">
      <label className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>{label}</label>
      <div className="relative">
        <Icon className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`} />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          className={inputClass + ' pl-10'}
          id={id}
          autoComplete={autoComplete}
        />
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 transition-colors duration-300 ${
      isLight ? 'bg-stone-50' : 'bg-zinc-950'
    }`}>
      <div className={`absolute inset-0 pointer-events-none ${isLight ? 'opacity-30' : 'opacity-20'}`}>
        <div className="absolute top-1/3 right-1/3 w-80 h-80 rounded-full blur-3xl" style={{ background: isLight ? 'radial-gradient(circle, #8C1D4018, transparent)' : 'radial-gradient(circle, #f59e0b12, transparent)' }} />
      </div>

      <div className={`relative w-full max-w-md rounded-2xl border p-8 shadow-2xl backdrop-blur-xl ${
        isLight ? 'border-stone-200 bg-white/90' : 'border-zinc-800 bg-zinc-950/90'
      }`}>
        <div className="flex flex-col items-center gap-3 mb-8">
          <MirajLogo size="md" variant={isLight ? 'red' : 'gold'} isLight={isLight} />
          <div className="text-center">
            <h1 className={`text-2xl font-black uppercase tracking-tight ${isLight ? 'text-stone-900' : 'text-white'}`} style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              Create Account
            </h1>
            <p className={`text-sm mt-1 ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
              Join Miraj for exclusive cinema experiences
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FieldWithIcon icon={User} label="Full Name" id="register-name" value={name} onChange={setName} placeholder="Your full name" autoComplete="name" />
          <FieldWithIcon icon={Mail} label="Email Address" id="register-email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" autoComplete="email" />
          <FieldWithIcon icon={Phone} label="Phone Number" id="register-phone" type="tel" value={phone} onChange={(v: string) => setPhone(v.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile number" autoComplete="tel" />

          <div className="flex flex-col gap-1.5">
            <label className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>Password</label>
            <div className="relative">
              <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={inputClass + ' pl-10 pr-10'}
                id="register-password"
                autoComplete="new-password"
              />
              <button type="button" onClick={() => setShowPassword(v => !v)} className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>Confirm Password</label>
            <div className="relative">
              <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className={inputClass + ' pl-10'}
                id="register-confirm-password"
                autoComplete="new-password"
              />
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
              isLight ? 'bg-[#8C1D40] hover:bg-[#701530] text-white' : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black'
            }`}
            id="register-submit-button"
          >
            {isLoading ? <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" /> : <><span>Create Account</span><ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>

        <p className={`text-center text-sm mt-6 ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
          Already have an account?{' '}
          <button onClick={() => handleNavigate('login')} className={`font-bold transition-colors ${isLight ? 'text-[#8C1D40] hover:underline' : 'text-amber-500 hover:underline'}`}>
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
