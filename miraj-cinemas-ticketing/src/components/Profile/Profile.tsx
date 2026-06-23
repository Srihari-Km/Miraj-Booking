/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, 
  Ticket, 
  CreditCard, 
  Heart, 
  Settings, 
  LogOut, 
  Calendar, 
  Mail, 
  Phone, 
  Shield, 
  Bell, 
  Camera,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { useBooking } from '../../contexts/BookingContext';
import BookingHistory from './BookingHistory';
import SavedCards from './SavedCards';
import Favorites from './Favorites';

interface ProfileProps {
  theme?: 'dark' | 'light';
  onThemeToggle?: () => void;
}

type TabType = 'overview' | 'bookings' | 'cards' | 'favorites' | 'settings';

export default function Profile({ theme = 'dark', onThemeToggle }: ProfileProps) {
  const { user, logout } = useAuth();
  const { profile, savedCards, bookingHistory, updateProfile } = useUser();
  const { handleNavigate } = useBooking();
  
  const isLight = theme === 'light';
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Settings form states
  const [editName, setEditName] = useState(profile?.name || user?.name || '');
  const [editPhone, setEditPhone] = useState(profile?.phone || user?.phone || '');
  const [notifications, setNotifications] = useState(profile?.notifications ?? true);
  const [marketingEmails, setMarketingEmails] = useState(profile?.marketingEmails ?? false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  if (!user || !profile) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <p className="text-stone-400">Please sign in to view your profile dashboard.</p>
        <button
          onClick={() => handleNavigate('login')}
          className={`mt-4 px-6 py-2 rounded-xl text-xs font-bold ${
            isLight ? 'bg-[#8C1D40] text-white' : 'bg-amber-500 text-black'
          }`}
        >
          Sign In
        </button>
      </div>
    );
  }

  const initials = profile.name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    setTimeout(() => {
      updateProfile({
        name: editName,
        phone: editPhone,
        notifications,
        marketingEmails
      });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 800);
  };

  const handleLogout = () => {
    logout();
    handleNavigate('booking-hub');
  };

  const tabs: { id: TabType; label: string; icon: React.ComponentType<any> }[] = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'bookings', label: 'Booking History', icon: Ticket },
    { id: 'cards', label: 'Saved Cards', icon: CreditCard },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Title Header */}
      <div className="mb-8">
        <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-stone-900' : 'text-white'}`}>
          My Profile Dashboard
        </h1>
        <p className={`text-xs mt-1 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
          Manage your bookings, preference settings, saved payment cards, and favorites.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Column: Sticky Sidebar */}
        <div className="lg:col-span-1 lg:sticky lg:top-24 flex flex-col gap-6">
          {/* User Card */}
          <div className={`rounded-2xl border p-5 flex flex-col items-center text-center relative overflow-hidden ${
            isLight ? 'border-stone-200 bg-white shadow-sm' : 'border-zinc-800 bg-zinc-900/30 backdrop-blur-md'
          }`}>
            {/* Visual accent */}
            <div className={`absolute top-0 inset-x-0 h-1.5 ${isLight ? 'bg-[#8C1D40]' : 'bg-amber-500'}`} />

            <div className="relative mt-4">
              {profile.profileImage ? (
                <img 
                  src={profile.profileImage} 
                  alt={profile.name} 
                  className="h-20 w-20 rounded-full object-cover border-2 border-stone-200 dark:border-zinc-800"
                />
              ) : (
                <div className={`h-20 w-20 rounded-full flex items-center justify-center text-xl font-black ${
                  isLight ? 'bg-[#8C1D40] text-white' : 'bg-amber-500 text-black'
                }`}>
                  {initials}
                </div>
              )}
            </div>

            <h2 className={`mt-4 text-base font-black tracking-tight ${isLight ? 'text-stone-900' : 'text-white'}`}>
              {profile.name}
            </h2>
            <p className={`text-xs mt-1 font-semibold ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
              {profile.email}
            </p>

            <div className={`mt-5 pt-4 w-full border-t border-dashed flex flex-col gap-2.5 text-left text-xs ${
              isLight ? 'border-stone-150 text-stone-600' : 'border-zinc-800 text-zinc-400'
            }`}>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-stone-400 dark:text-zinc-500" />
                <span>{profile.phone || 'No phone set'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-stone-400 dark:text-zinc-500" />
                <span>Member since June 2026</span>
              </div>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <nav className={`rounded-2xl border p-2 flex flex-col gap-1 ${
            isLight ? 'border-stone-200 bg-white shadow-sm' : 'border-zinc-800 bg-zinc-900/30'
          }`}>
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 w-full rounded-xl px-4 py-3 text-xs font-bold transition-all text-left cursor-pointer ${
                    isActive
                      ? isLight
                        ? 'bg-[#8C1D40]/10 text-[#8C1D40]'
                        : 'bg-amber-500/10 text-amber-400'
                      : isLight
                        ? 'text-stone-600 hover:bg-stone-50 hover:text-black'
                        : 'text-zinc-400 hover:bg-zinc-850 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            <div className={`my-1 border-t ${isLight ? 'border-stone-105' : 'border-zinc-800'}`} />

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-500/5 transition-all text-left cursor-pointer"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Sign Out</span>
            </button>
          </nav>
        </div>

        {/* Right Column: Tab View Content */}
        <div className="lg:col-span-3">
          <div className={`rounded-2xl border p-6 min-h-[450px] ${
            isLight ? 'border-stone-200 bg-white shadow-sm' : 'border-zinc-800 bg-zinc-900/10 backdrop-blur-md'
          }`}>
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-6 animate-in fade-in duration-200">
                <div>
                  <h3 className={`text-lg font-black tracking-tight flex items-center gap-2 ${isLight ? 'text-stone-900' : 'text-white'}`}>
                    Welcome back, {profile.name.split(' ')[0]}! <Sparkles className="h-4 w-4 text-amber-400" />
                  </h3>
                  <p className={`text-xs mt-1 ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
                    Here is a quick snapshot of your Miraj Cinemas booking portal stats.
                  </p>
                </div>

                {/* Quick stats grids */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                  {[
                    { label: 'Total Bookings', val: bookingHistory.length, desc: 'Tickets reserved', icon: Ticket, action: () => setActiveTab('bookings') },
                    { label: 'Saved Cards', val: savedCards.length, desc: 'Payment methods', icon: CreditCard, action: () => setActiveTab('cards') },
                    { label: 'Favorites', val: profile.favoriteMovieIds?.length || 0, desc: 'Watchlist movies', icon: Heart, action: () => setActiveTab('favorites') },
                  ].map(stat => (
                    <div 
                      key={stat.label}
                      onClick={stat.action}
                      className={`p-4 rounded-xl border flex flex-col gap-2 transition-all duration-200 hover:scale-[1.02] cursor-pointer ${
                        isLight ? 'border-stone-150 bg-stone-50 hover:bg-stone-100/50' : 'border-zinc-800 bg-zinc-850/30 hover:bg-zinc-800/40'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <stat.icon className={`h-5 w-5 ${isLight ? 'text-[#8C1D40]' : 'text-amber-400'}`} />
                        <span className={`text-2xl font-black ${isLight ? 'text-stone-900' : 'text-white'}`}>
                          {stat.val}
                        </span>
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${isLight ? 'text-stone-800' : 'text-zinc-200'}`}>{stat.label}</p>
                        <p className="text-[10px] text-stone-400 dark:text-zinc-500 mt-0.5">{stat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Booking snippet */}
                <div className="mt-4">
                  <h4 className={`text-sm font-black mb-3.5 flex justify-between items-center ${isLight ? 'text-stone-850' : 'text-zinc-300'}`}>
                    <span>Recent Reservation</span>
                    {bookingHistory.length > 0 && (
                      <button 
                        onClick={() => setActiveTab('bookings')} 
                        className={`text-xs flex items-center gap-1 font-bold ${isLight ? 'text-[#8C1D40]' : 'text-amber-400'} hover:underline`}
                      >
                        View all <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                  </h4>

                  {bookingHistory.length > 0 ? (
                    <div className={`p-4 rounded-xl border ${isLight ? 'border-stone-200 bg-white' : 'border-zinc-800 bg-zinc-950/20'}`}>
                      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:items-center">
                        <div>
                          <p className={`text-sm font-black ${isLight ? 'text-stone-900' : 'text-white'}`}>{bookingHistory[0].movieTitle}</p>
                          <p className="text-xs text-stone-400 dark:text-zinc-500 mt-0.5">{bookingHistory[0].theaterName} · {bookingHistory[0].showtime}</p>
                        </div>
                        <div className="flex sm:flex-col justify-between items-center sm:items-end gap-1.5 pt-3 sm:pt-0 border-t sm:border-t-0 border-dashed border-stone-250 dark:border-zinc-850">
                          <span className={`text-sm font-black ${isLight ? 'text-[#8C1D40]' : 'text-amber-500'}`}>₹{bookingHistory[0].finalTotal}</span>
                          <span className="text-[10px] font-bold text-stone-500">Seats: {bookingHistory[0].selectedSeatIds.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={`py-8 text-center rounded-xl border border-dashed text-xs text-stone-400 ${isLight ? 'border-stone-200' : 'border-zinc-800'}`}>
                      No movie reservations booked yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <div className="animate-in fade-in duration-200">
                <h3 className={`text-lg font-black tracking-tight mb-4 ${isLight ? 'text-stone-900' : 'text-white'}`}>
                  Booking & Ticket History
                </h3>
                <BookingHistory theme={theme} />
              </div>
            )}

            {/* CARDS TAB */}
            {activeTab === 'cards' && (
              <div className="animate-in fade-in duration-200">
                <h3 className={`text-lg font-black tracking-tight mb-4 ${isLight ? 'text-stone-900' : 'text-white'}`}>
                  Saved Payment Methods
                </h3>
                <SavedCards theme={theme} />
              </div>
            )}

            {/* FAVORITES TAB */}
            {activeTab === 'favorites' && (
              <div className="animate-in fade-in duration-200">
                <h3 className={`text-lg font-black tracking-tight mb-4 ${isLight ? 'text-stone-900' : 'text-white'}`}>
                  My Favorite Movies Watchlist
                </h3>
                <Favorites theme={theme} />
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="animate-in fade-in duration-200">
                <h3 className={`text-lg font-black tracking-tight mb-4 ${isLight ? 'text-stone-900' : 'text-white'}`}>
                  Profile & Preferences
                </h3>

                <form onSubmit={handleSaveSettings} className="flex flex-col gap-5 mt-2 max-w-xl">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className={`text-xs font-bold ${isLight ? 'text-stone-700' : 'text-zinc-300'}`}>Full Name</label>
                    <input 
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      required
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold focus:outline-none transition-colors ${
                        isLight 
                          ? 'border-stone-200 bg-stone-50 focus:border-[#8C1D40] text-black' 
                          : 'border-zinc-800 bg-zinc-950 focus:border-amber-500 text-white'
                      }`}
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label className={`text-xs font-bold ${isLight ? 'text-stone-700' : 'text-zinc-300'}`}>Phone Number</label>
                    <input 
                      type="tel"
                      value={editPhone}
                      onChange={e => setEditPhone(e.target.value)}
                      required
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold focus:outline-none transition-colors ${
                        isLight 
                          ? 'border-stone-200 bg-stone-50 focus:border-[#8C1D40] text-black' 
                          : 'border-zinc-800 bg-zinc-950 focus:border-amber-500 text-white'
                      }`}
                    />
                  </div>

                  {/* Theme Switcher Toggle inside settings */}
                  {onThemeToggle && (
                    <div className={`flex items-center justify-between p-3.5 rounded-xl border ${
                      isLight ? 'border-stone-150 bg-stone-50' : 'border-zinc-800 bg-zinc-950/40'
                    }`}>
                      <div className="flex flex-col">
                        <span className={`text-xs font-bold ${isLight ? 'text-stone-850' : 'text-zinc-200'}`}>Dark Theme Mode</span>
                        <span className="text-[10px] text-stone-400 mt-0.5 font-medium">Switch between ticketing aesthetics</span>
                      </div>
                      <button
                        type="button"
                        onClick={onThemeToggle}
                        className={`relative flex h-6 w-11 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 ${
                          !isLight ? 'bg-amber-500' : 'bg-stone-300'
                        }`}
                      >
                        <div
                          className={`h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 transform ${
                            !isLight ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  )}

                  {/* Email Notifications */}
                  <div className={`flex items-center justify-between p-3.5 rounded-xl border ${
                    isLight ? 'border-stone-150 bg-stone-50' : 'border-zinc-800 bg-zinc-950/40'
                  }`}>
                    <div className="flex flex-col">
                      <span className={`text-xs font-bold ${isLight ? 'text-stone-850' : 'text-zinc-200'}`}>Push Notifications</span>
                      <span className="text-[10px] text-stone-400 mt-0.5 font-medium">Get real-time updates on ticket bookings</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifications(prev => !prev)}
                      className={`relative flex h-6 w-11 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 ${
                        notifications 
                          ? isLight ? 'bg-[#8C1D40]' : 'bg-amber-500'
                          : 'bg-stone-300 dark:bg-zinc-800'
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 transform ${
                          notifications ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Marketing Emails */}
                  <div className={`flex items-center justify-between p-3.5 rounded-xl border ${
                    isLight ? 'border-stone-150 bg-stone-50' : 'border-zinc-800 bg-zinc-950/40'
                  }`}>
                    <div className="flex flex-col">
                      <span className={`text-xs font-bold ${isLight ? 'text-stone-850' : 'text-zinc-200'}`}>Promo & Marketing Offers</span>
                      <span className="text-[10px] text-stone-400 mt-0.5 font-medium">Receive deals, concession combos, and discounts</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMarketingEmails(prev => !prev)}
                      className={`relative flex h-6 w-11 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 ${
                        marketingEmails 
                          ? isLight ? 'bg-[#8C1D40]' : 'bg-amber-500'
                          : 'bg-stone-300 dark:bg-zinc-800'
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 transform ${
                          marketingEmails ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Submit buttons */}
                  <div className="flex items-center gap-3.5 mt-3">
                    <button
                      type="submit"
                      disabled={saveStatus === 'saving'}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer hover:scale-[1.01] active:scale-95 ${
                        isLight ? 'bg-[#8C1D40] text-white hover:bg-[#8C1D40]/90' : 'bg-amber-500 text-black hover:bg-amber-400'
                      }`}
                    >
                      {saveStatus === 'saving' ? 'Saving...' : 'Save Settings'}
                    </button>

                    {saveStatus === 'success' && (
                      <span className="text-xs font-bold text-green-500 animate-fade">
                        ✓ Profile updated successfully!
                      </span>
                    )}
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
