/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { User, LogOut, HelpCircle, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';

interface UserAvatarMenuProps {
  theme?: 'dark' | 'light';
}

export default function UserAvatarMenu({ theme = 'dark' }: UserAvatarMenuProps) {
  const { user, logout } = useAuth();
  const { handleNavigate } = useBooking();
  const isLight = theme === 'light';
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleLogout = () => {
    setOpen(false);
    logout();
    handleNavigate('booking-hub');
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(v => !v)}
        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer ${
          isLight
            ? 'border-stone-200 bg-white text-stone-700 hover:border-[#8C1D40]/40 shadow-sm'
            : 'border-zinc-700 bg-zinc-800 text-zinc-200 hover:border-amber-500/40'
        }`}
        id="user-avatar-menu-button"
      >
        {user.profileImage ? (
          <img src={user.profileImage} alt={user.name} className="h-6 w-6 rounded-full object-cover" />
        ) : (
          <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black ${
            isLight ? 'bg-[#8C1D40] text-white' : 'bg-amber-500 text-black'
          }`}>
            {initials}
          </div>
        )}
        <span className="hidden sm:block max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
        <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className={`absolute right-0 top-full mt-2 w-52 rounded-xl border shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 ${
          isLight ? 'border-stone-200 bg-white' : 'border-zinc-700 bg-zinc-800'
        }`}>
          {/* User info header */}
          <div className={`px-4 py-3 border-b ${isLight ? 'border-stone-100 bg-stone-50' : 'border-zinc-700'}`}>
            <p className={`text-xs font-black truncate ${isLight ? 'text-stone-900' : 'text-white'}`}>{user.name}</p>
            <p className={`text-[10px] truncate mt-0.5 ${isLight ? 'text-stone-400' : 'text-zinc-400'}`}>{user.email}</p>
          </div>

          {/* Menu items */}
          {[
            { icon: LayoutDashboard, label: 'My Profile', action: () => { setOpen(false); handleNavigate('profile'); } },
            { icon: HelpCircle, label: 'Help Center', action: () => { setOpen(false); handleNavigate('help-center'); } },
          ].map(item => (
            <button
              key={item.label}
              onClick={item.action}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors text-left ${
                isLight
                  ? 'text-stone-700 hover:bg-stone-50 hover:text-[#8C1D40]'
                  : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </button>
          ))}

          <div className={`border-t ${isLight ? 'border-stone-100' : 'border-zinc-700'}`} />

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-500/5 transition-colors text-left"
            id="logout-button"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
