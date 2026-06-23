/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Phone, Check, ShieldAlert, Chrome } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  theme?: 'dark' | 'light';
}

type TabType = 'login' | 'register';

export default function AuthModal({ isOpen, onClose, onSuccess, theme = 'dark' }: AuthModalProps) {
  const { login, register } = useAuth();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState<TabType>('login');
  
  // Login States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Register States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [isSubmittingReg, setIsSubmittingReg] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmittingLogin(true);

    try {
      const res = await login(loginEmail, loginPassword, rememberMe);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setLoginError(res.error || 'Failed to login');
      }
    } catch (err) {
      setLoginError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }

    setIsSubmittingReg(true);

    try {
      const res = await register(regName, regEmail, regPhone, regPassword, rememberMe);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setRegError(res.error || 'Failed to register');
      }
    } catch (err) {
      setRegError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmittingReg(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
        
        {/* Backdrop overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black backdrop-blur-md"
        />

        {/* Modal Card container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`relative z-10 w-full max-w-[500px] mx-auto px-4 sm:px-0`}
        >
          <div className={`w-full rounded-3xl border p-6 sm:p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden ${
            isLight 
              ? 'border-stone-200 bg-white/95 text-stone-900 backdrop-blur-xl' 
              : 'border-zinc-800 bg-zinc-950/90 text-white backdrop-blur-xl'
          }`}>
            
            {/* Visual accent top line */}
            <div className={`absolute top-0 inset-x-0 h-1 ${isLight ? 'bg-[#8C1D40]' : 'bg-amber-500'}`} />

            {/* Header info */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                  Sign In To Continue
                </h2>
                <p className={`text-xs mt-1 ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>
                  Login or create an account to complete your booking.
                </p>
              </div>
              <button 
                onClick={onClose}
                className={`h-8 w-8 rounded-full flex items-center justify-center border transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                  isLight ? 'border-stone-200 hover:bg-stone-100 text-stone-500' : 'border-zinc-800 hover:bg-zinc-900 text-zinc-400'
                }`}
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Tabs Selector */}
            <div className={`flex gap-1 rounded-xl p-1 border ${
              isLight ? 'border-stone-200 bg-stone-100' : 'border-zinc-900 bg-zinc-950'
            }`}>
              <button
                onClick={() => { setActiveTab('login'); setLoginError(''); }}
                className={`flex-1 rounded-lg py-2.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'login'
                    ? isLight 
                      ? 'bg-white text-[#8C1D40] shadow-sm border border-stone-200' 
                      : 'bg-zinc-850 text-amber-400 border border-zinc-800'
                    : isLight ? 'text-stone-500' : 'text-zinc-500'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => { setActiveTab('register'); setRegError(''); }}
                className={`flex-1 rounded-lg py-2.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'register'
                    ? isLight 
                      ? 'bg-white text-[#8C1D40] shadow-sm border border-stone-200' 
                      : 'bg-zinc-850 text-amber-400 border border-zinc-800'
                    : isLight ? 'text-stone-500' : 'text-zinc-500'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Form Panels */}
            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                {loginError && (
                  <div className="flex items-center gap-2 text-xs font-bold text-red-500 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                    <ShieldAlert className="h-4 w-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                {/* Email Input */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>Email Address</label>
                  <div className="relative">
                    <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${isLight ? 'text-stone-400' : 'text-zinc-555'}`} />
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@example.com"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none transition-colors ${
                        isLight 
                          ? 'border-stone-200 bg-stone-50 focus:border-[#8C1D40] text-black' 
                          : 'border-zinc-800 bg-zinc-950 focus:border-amber-500 text-white'
                      }`}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="flex flex-col gap-1.5 text-left">
                  <div className="flex justify-between items-center">
                    <label className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>Password</label>
                    <span className={`text-[10px] font-bold hover:underline cursor-pointer ${isLight ? 'text-[#8C1D40]' : 'text-amber-400'}`}>
                      Forgot?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${isLight ? 'text-stone-400' : 'text-zinc-555'}`} />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none transition-colors ${
                        isLight 
                          ? 'border-stone-200 bg-stone-50 focus:border-[#8C1D40] text-black' 
                          : 'border-zinc-800 bg-zinc-950 focus:border-amber-500 text-white'
                      }`}
                    />
                  </div>
                </div>

                {/* Remember Me checkbox */}
                <label className="flex items-center gap-2 mt-1 select-none cursor-pointer self-start">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className={`rounded border h-3.5 w-3.5 focus:outline-none transition-all ${
                      isLight ? 'border-stone-300 text-[#8C1D40]' : 'border-zinc-700 text-amber-500 bg-zinc-900'
                    }`}
                  />
                  <span className={`text-xs font-semibold ${isLight ? 'text-stone-600' : 'text-zinc-400'}`}>Remember Me</span>
                </label>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isSubmittingLogin}
                  className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest text-black shadow-lg transition-all duration-300 active:scale-95 cursor-pointer mt-2 ${
                    isLight 
                      ? 'bg-[#8C1D40] text-white hover:bg-[#8C1D40]/90' 
                      : 'bg-amber-500 hover:bg-amber-400'
                  }`}
                >
                  {isSubmittingLogin ? 'Logging In...' : 'Verify & Continue'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
                {regError && (
                  <div className="flex items-center gap-2 text-xs font-bold text-red-500 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                    <ShieldAlert className="h-4 w-4 shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                {/* Full Name */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>Full Name</label>
                  <div className="relative">
                    <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${isLight ? 'text-stone-400' : 'text-zinc-555'}`} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none transition-colors ${
                        isLight 
                          ? 'border-stone-200 bg-stone-50 focus:border-[#8C1D40] text-black' 
                          : 'border-zinc-800 bg-zinc-950 focus:border-amber-500 text-white'
                      }`}
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>Email Address</label>
                  <div className="relative">
                    <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${isLight ? 'text-stone-400' : 'text-zinc-555'}`} />
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@example.com"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none transition-colors ${
                        isLight 
                          ? 'border-stone-200 bg-stone-50 focus:border-[#8C1D40] text-black' 
                          : 'border-zinc-800 bg-zinc-950 focus:border-amber-500 text-white'
                      }`}
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>Phone Number</label>
                  <div className="relative">
                    <Phone className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${isLight ? 'text-stone-400' : 'text-zinc-555'}`} />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={regPhone}
                      onChange={e => setRegPhone(e.target.value)}
                      className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none transition-colors ${
                        isLight 
                          ? 'border-stone-200 bg-stone-50 focus:border-[#8C1D40] text-black' 
                          : 'border-zinc-800 bg-zinc-950 focus:border-amber-500 text-white'
                      }`}
                    />
                  </div>
                </div>

                {/* Passwords Flex Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>Password</label>
                    <div className="relative">
                      <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${isLight ? 'text-stone-400' : 'text-zinc-555'}`} />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={regPassword}
                        onChange={e => setRegPassword(e.target.value)}
                        className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none transition-colors ${
                          isLight 
                            ? 'border-stone-200 bg-stone-50 focus:border-[#8C1D40] text-black' 
                            : 'border-zinc-800 bg-zinc-950 focus:border-amber-500 text-white'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 text-left">
                    <label className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-stone-500' : 'text-zinc-400'}`}>Confirm Password</label>
                    <div className="relative">
                      <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${isLight ? 'text-stone-400' : 'text-zinc-555'}`} />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={regConfirmPassword}
                        onChange={e => setRegConfirmPassword(e.target.value)}
                        className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none transition-colors ${
                          isLight 
                            ? 'border-stone-200 bg-stone-50 focus:border-[#8C1D40] text-black' 
                            : 'border-zinc-800 bg-zinc-950 focus:border-amber-500 text-white'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Remember Me */}
                <label className="flex items-center gap-2 mt-1 select-none cursor-pointer self-start">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className={`rounded border h-3.5 w-3.5 focus:outline-none transition-all ${
                      isLight ? 'border-stone-300 text-[#8C1D40]' : 'border-zinc-700 text-amber-500 bg-zinc-900'
                    }`}
                  />
                  <span className={`text-xs font-semibold ${isLight ? 'text-stone-600' : 'text-zinc-400'}`}>Remember Me</span>
                </label>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={isSubmittingReg}
                  className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest text-black shadow-lg transition-all duration-300 active:scale-95 cursor-pointer mt-2 ${
                    isLight 
                      ? 'bg-[#8C1D40] text-white hover:bg-[#8C1D40]/90' 
                      : 'bg-amber-500 hover:bg-amber-400'
                  }`}
                >
                  {isSubmittingReg ? 'Creating Account...' : 'Register & Continue'}
                </button>
              </form>
            )}

            {/* Divider and Google Button */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className={`h-px flex-1 ${isLight ? 'bg-stone-200' : 'bg-zinc-800'}`} />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>Or</span>
                <div className={`h-px flex-1 ${isLight ? 'bg-stone-200' : 'bg-zinc-800'}`} />
              </div>

              <button
                type="button"
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all duration-200 hover:scale-[1.01] active:scale-95 border flex items-center justify-center gap-2 cursor-pointer ${
                  isLight 
                    ? 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700 shadow-sm' 
                    : 'border-zinc-850 bg-zinc-900 hover:bg-zinc-850 text-zinc-300'
                }`}
              >
                <Chrome className="h-4 w-4 shrink-0 text-red-500" />
                <span>Continue with Google</span>
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
