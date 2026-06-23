/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { SavedCard, UserProfile } from '../types/user';
import { BookingRecord } from '../types/booking';
import { getItem, setItem, STORAGE_KEYS } from '../utils/storage';
import { useAuth } from './AuthContext';

interface UserContextValue {
  profile: UserProfile | null;
  savedCards: SavedCard[];
  bookingHistory: BookingRecord[];
  updateProfile: (updates: Partial<UserProfile>) => void;
  addFavorite: (movieId: string) => void;
  removeFavorite: (movieId: string) => void;
  addCard: (card: Omit<SavedCard, 'id'>) => void;
  removeCard: (cardId: string) => void;
  setDefaultCard: (cardId: string) => void;
  addBookingRecord: (record: BookingRecord) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [bookingHistory, setBookingHistory] = useState<BookingRecord[]>([]);

  // Load user data from localStorage whenever auth user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      const storedProfile = getItem<UserProfile>(STORAGE_KEYS.PROFILE);
      const storedCards = getItem<SavedCard[]>(STORAGE_KEYS.CARDS) || [];
      const storedBookings = getItem<BookingRecord[]>(STORAGE_KEYS.BOOKINGS) || [];
      const storedFavorites = getItem<string[]>(STORAGE_KEYS.FAVORITES) || [];

      setProfile(storedProfile ? {
        ...storedProfile,
        favoriteMovieIds: storedFavorites,
      } : {
        userId: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
        notifications: true,
        marketingEmails: false,
        favoriteMovieIds: storedFavorites,
      });
      setSavedCards(storedCards);
      setBookingHistory(storedBookings);
    } else {
      setProfile(null);
      setSavedCards([]);
      setBookingHistory([]);
    }
  }, [isAuthenticated, user]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      setItem(STORAGE_KEYS.PROFILE, updated);
      setItem(STORAGE_KEYS.FAVORITES, updated.favoriteMovieIds);
      return updated;
    });
  }, []);

  const addFavorite = useCallback((movieId: string) => {
    setProfile(prev => {
      if (!prev) return prev;
      if (prev.favoriteMovieIds.includes(movieId)) return prev;
      const updated = { ...prev, favoriteMovieIds: [...prev.favoriteMovieIds, movieId] };
      setItem(STORAGE_KEYS.PROFILE, updated);
      setItem(STORAGE_KEYS.FAVORITES, updated.favoriteMovieIds);
      return updated;
    });
  }, []);

  const removeFavorite = useCallback((movieId: string) => {
    setProfile(prev => {
      if (!prev) return prev;
      const updated = { ...prev, favoriteMovieIds: prev.favoriteMovieIds.filter(id => id !== movieId) };
      setItem(STORAGE_KEYS.PROFILE, updated);
      setItem(STORAGE_KEYS.FAVORITES, updated.favoriteMovieIds);
      return updated;
    });
  }, []);

  const addCard = useCallback((card: Omit<SavedCard, 'id'>) => {
    setSavedCards(prev => {
      const newCard: SavedCard = { ...card, id: `card-${Date.now()}` };
      const updated = card.isDefault
        ? [...prev.map(c => ({ ...c, isDefault: false })), newCard]
        : [...prev, newCard];
      setItem(STORAGE_KEYS.CARDS, updated);
      return updated;
    });
  }, []);

  const removeCard = useCallback((cardId: string) => {
    setSavedCards(prev => {
      const updated = prev.filter(c => c.id !== cardId);
      setItem(STORAGE_KEYS.CARDS, updated);
      return updated;
    });
  }, []);

  const setDefaultCard = useCallback((cardId: string) => {
    setSavedCards(prev => {
      const updated = prev.map(c => ({ ...c, isDefault: c.id === cardId }));
      setItem(STORAGE_KEYS.CARDS, updated);
      return updated;
    });
  }, []);

  const addBookingRecord = useCallback((record: BookingRecord) => {
    setBookingHistory(prev => {
      const updated = [record, ...prev];
      setItem(STORAGE_KEYS.BOOKINGS, updated);
      return updated;
    });
  }, []);

  return (
    <UserContext.Provider value={{
      profile,
      savedCards,
      bookingHistory,
      updateProfile,
      addFavorite,
      removeFavorite,
      addCard,
      removeCard,
      setDefaultCard,
      addBookingRecord,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
