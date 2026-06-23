/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { City, Movie, Showtime, Seat, TransactionDetails, SelectedFoodItem } from '../types';

type ActiveView =
  | 'booking-hub'
  | 'offers'
  | 'upcoming-shows'
  | 'movie-info'
  | 'seating-matrix'
  | 'food-concessions'
  | 'checkout'
  | 'receipt'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'profile'
  | 'help-center';

interface BookingContextValue {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  currentCity: City;
  setCurrentCity: (city: City) => void;
  selectedMovie: Movie | null;
  setSelectedMovie: (movie: Movie | null) => void;
  selectedShowtime: Showtime | null;
  setSelectedShowtime: (showtime: Showtime | null) => void;
  selectedSeats: Seat[];
  setSelectedSeats: (seats: Seat[]) => void;
  selectedFood: SelectedFoodItem[];
  setSelectedFood: (food: SelectedFoodItem[]) => void;
  transaction: TransactionDetails | null;
  setTransaction: (tx: TransactionDetails | null) => void;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  initialBookingStep: 'info' | 'times';
  setInitialBookingStep: (step: 'info' | 'times') => void;
  handleNavigate: (view: ActiveView) => void;
  handleCityChange: (city: City) => void;
  handleSelectMovie: (movie: Movie) => void;
  handleHeroBookNow: (movie: Movie) => void;
  handleSelectShowtime: (movie: Movie, showtime: Showtime, date: string) => void;
  handleProceedToConcessions: (seats: Seat[]) => void;
  handlePaymentSuccess: (details: TransactionDetails) => void;
  handleTimeoutReset: () => void;
  handleRestartBooking: () => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [activeView, setActiveViewState] = useState<ActiveView>('booking-hub');
  const [currentCity, setCurrentCity] = useState<City>('Mumbai');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [selectedFood, setSelectedFood] = useState<SelectedFoodItem[]>([]);
  const [transaction, setTransaction] = useState<TransactionDetails | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [initialBookingStep, setInitialBookingStep] = useState<'info' | 'times'>('info');

  const setActiveView = useCallback((view: ActiveView) => {
    setActiveViewState(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNavigate = useCallback((view: ActiveView) => {
    setActiveView(view);
  }, [setActiveView]);

  const handleCityChange = useCallback((newCity: City) => {
    setCurrentCity(newCity);
    if (activeView === 'movie-info') {
      setSelectedShowtime(null);
      setSelectedSeats([]);
      setSelectedDate(null);
    } else if (activeView === 'seating-matrix') {
      setSelectedShowtime(null);
      setSelectedSeats([]);
      setSelectedDate(null);
      setInitialBookingStep('times');
      setActiveView('movie-info');
    } else {
      setSelectedMovie(null);
      setSelectedShowtime(null);
      setSelectedSeats([]);
      setSelectedDate(null);
      setActiveView('booking-hub');
    }
  }, [activeView, setActiveView]);

  const handleSelectMovie = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
    setInitialBookingStep('info');
    setActiveView('movie-info');
  }, [setActiveView]);

  const handleHeroBookNow = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
    setInitialBookingStep('times');
    setActiveView('movie-info');
  }, [setActiveView]);

  const handleSelectShowtime = useCallback((movie: Movie, showtime: Showtime, date: string) => {
    setSelectedMovie(movie);
    setSelectedShowtime(showtime);
    setSelectedDate(date);
    setSelectedSeats([]);
    setActiveView('seating-matrix');
  }, [setActiveView]);

  const handleProceedToConcessions = useCallback((chosenSeats: Seat[]) => {
    setSelectedSeats(chosenSeats);
    setActiveView('food-concessions');
  }, [setActiveView]);

  const handlePaymentSuccess = useCallback((details: TransactionDetails) => {
    setTransaction(details);
    setActiveView('receipt');
  }, [setActiveView]);

  const handleTimeoutReset = useCallback(() => {
    setSelectedSeats([]);
    setSelectedFood([]);
    setSelectedShowtime(null);
    setActiveView('booking-hub');
  }, [setActiveView]);

  const handleRestartBooking = useCallback(() => {
    setSelectedMovie(null);
    setSelectedShowtime(null);
    setSelectedSeats([]);
    setSelectedFood([]);
    setTransaction(null);
    setActiveView('booking-hub');
  }, [setActiveView]);

  return (
    <BookingContext.Provider value={{
      activeView,
      setActiveView,
      currentCity,
      setCurrentCity,
      selectedMovie,
      setSelectedMovie,
      selectedShowtime,
      setSelectedShowtime,
      selectedSeats,
      setSelectedSeats,
      selectedFood,
      setSelectedFood,
      transaction,
      setTransaction,
      selectedDate,
      setSelectedDate,
      initialBookingStep,
      setInitialBookingStep,
      handleNavigate,
      handleCityChange,
      handleSelectMovie,
      handleHeroBookNow,
      handleSelectShowtime,
      handleProceedToConcessions,
      handlePaymentSuccess,
      handleTimeoutReset,
      handleRestartBooking,
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}

export type { ActiveView };
