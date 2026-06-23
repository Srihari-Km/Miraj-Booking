/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import MovieGrid from './components/MovieGrid';
import SeatingMatrix from './components/SeatingMatrix';
import FoodConcessions from './components/FoodConcessions';
import PaymentGateway from './components/PaymentGateway';
import Receipt from './components/Receipt';
import MovieInfo from './components/MovieInfo';
import Offers from './components/Offers';
import UpcomingShows from './components/UpcomingShows';
import Footer from './components/Footer';
import { MOCK_MOVIES } from './data/mockData';

// Context imports
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { BookingProvider, useBooking } from './contexts/BookingContext';
import AuthModal from './components/Auth/AuthModal';

// Lazy load new views
const Login = lazy(() => import('./components/Auth/Login'));
const Register = lazy(() => import('./components/Auth/Register'));
const ForgotPassword = lazy(() => import('./components/Auth/ForgotPassword'));
const Profile = lazy(() => import('./components/Profile/Profile'));
const HelpCenter = lazy(() => import('./components/Help/HelpCenter'));

function AppContent() {
  // Theme state: dark or light
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('miraj-theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });

  useEffect(() => {
    localStorage.setItem('miraj-theme', theme);
  }, [theme]);

  const {
    activeView,
    currentCity,
    selectedMovie,
    selectedShowtime,
    selectedSeats,
    selectedFood,
    transaction,
    selectedDate,
    initialBookingStep,
    handleCityChange,
    handleSelectMovie,
    handleHeroBookNow,
    handleSelectShowtime,
    handleProceedToConcessions,
    handlePaymentSuccess,
    handleTimeoutReset,
    handleRestartBooking,
    handleNavigate,
    setSelectedFood,
  } = useBooking();

  const { isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authSuccessCallback, setAuthSuccessCallback] = useState<(() => void) | null>(null);

  const handleAuthSuccess = () => {
    if (authSuccessCallback) {
      authSuccessCallback();
      setAuthSuccessCallback(null);
    }
  };

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
    setAuthSuccessCallback(null);
    if (activeView === 'checkout' && !isAuthenticated) {
      handleNavigate('food-concessions');
    }
  };

  // Guard: if user lands on checkout page and is not authenticated, prompt AuthModal
  useEffect(() => {
    if (activeView === 'checkout' && !isAuthenticated) {
      setIsAuthModalOpen(true);
    }
  }, [activeView, isAuthenticated]);

  // Sort by rating score descending and take top 4 for the cards (interlocking deck)
  const highestRatedMovies = [...MOCK_MOVIES].sort((a, b) => b.ratingScore - a.ratingScore).slice(0, 4);

  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isLight 
        ? 'bg-stone-50/45 text-stone-900 selection:bg-[#8C1D40] selection:text-white backdrop-blur-xs' 
        : 'bg-zinc-950 text-zinc-100 selection:bg-amber-500 selection:text-black'
    }`}>
      
      {/* Universal Sticky Navigation and Brand Hub */}
      <Header
        currentCity={currentCity}
        onCityChange={handleCityChange}
        activeView={activeView}
        onNavigate={handleNavigate}
        selectedMovie={selectedMovie}
        selectedSeatsCount={selectedSeats.length}
        theme={theme}
        onThemeToggle={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
      />

      {/* Main Core View Router */}
      <main className="flex-1 w-full pb-20 animate-fade">
        <Suspense fallback={
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className={`h-8 w-8 animate-spin rounded-full border-4 border-t-transparent ${
              isLight ? 'border-[#8C1D40]' : 'border-amber-500'
            }`} />
          </div>
        }>
          {activeView === 'booking-hub' && (
            <div className="animate-in fade-in duration-300">
              {/* Featured Blockbuster Spotlights containing only highest rated movies (ratingScore >= 9.0) */}
              <HeroBanner 
                movies={highestRatedMovies} 
                onBookNow={handleHeroBookNow} 
                onSelectMovie={handleSelectMovie}
                theme={theme}
              />

              {/* Active Cinema List Grid */}
              <MovieGrid
                movies={MOCK_MOVIES}
                currentCity={currentCity}
                onSelectMovie={handleSelectMovie}
                theme={theme}
              />
            </div>
          )}

          {activeView === 'offers' && (
            <div className="animate-in fade-in duration-300">
              <Offers theme={theme} />
            </div>
          )}

          {activeView === 'upcoming-shows' && (
            <div className="animate-in fade-in duration-300">
              <UpcomingShows theme={theme} />
            </div>
          )}

          {activeView === 'movie-info' && selectedMovie && (
            <div className="animate-in fade-in duration-300">
              <MovieInfo
                movie={selectedMovie}
                city={currentCity}
                onBack={() => handleNavigate('booking-hub')}
                onSelectShowtime={handleSelectShowtime}
                initialBookingStep={initialBookingStep}
                theme={theme}
              />
            </div>
          )}

          {activeView === 'seating-matrix' && selectedMovie && selectedShowtime && (
            <div className="animate-in fade-in duration-300">
              <SeatingMatrix
                movie={selectedMovie}
                showtime={selectedShowtime}
                initialSelectedSeats={selectedSeats}
                onBack={() => handleNavigate('booking-hub')}
                onProceedToCheckout={handleProceedToConcessions}
                theme={theme}
              />
            </div>
          )}

          {activeView === 'food-concessions' && selectedMovie && selectedShowtime && selectedSeats.length > 0 && (
            <div className="animate-in fade-in duration-300">
              <FoodConcessions
                movie={selectedMovie}
                showtime={selectedShowtime}
                selectedSeats={selectedSeats}
                onBack={() => handleNavigate('seating-matrix')}
                onProceed={(food) => {
                  setSelectedFood(food);
                  if (isAuthenticated) {
                    handleNavigate('checkout');
                  } else {
                    setAuthSuccessCallback(() => () => handleNavigate('checkout'));
                    setIsAuthModalOpen(true);
                  }
                }}
                theme={theme}
              />
            </div>
          )}

          {activeView === 'checkout' && selectedMovie && selectedShowtime && selectedSeats.length > 0 && (
            isAuthenticated ? (
              <div className="animate-in fade-in duration-300">
                <PaymentGateway
                  city={currentCity}
                  movie={selectedMovie}
                  showtime={selectedShowtime}
                  selectedSeats={selectedSeats}
                  selectedFood={selectedFood}
                  onBackToConcessions={() => handleNavigate('food-concessions')}
                  onPaymentSuccess={handlePaymentSuccess}
                  onTimeoutReset={handleTimeoutReset}
                  theme={theme}
                />
              </div>
            ) : null
          )}

          {activeView === 'receipt' && transaction && (
            <div className="animate-in fade-in duration-300">
              <Receipt
                details={transaction}
                onRestart={handleRestartBooking}
                theme={theme}
              />
            </div>
          )}

          {activeView === 'login' && (
            <div className="animate-in fade-in duration-300">
              <Login theme={theme} />
            </div>
          )}

          {activeView === 'register' && (
            <div className="animate-in fade-in duration-300">
              <Register theme={theme} />
            </div>
          )}

          {activeView === 'forgot-password' && (
            <div className="animate-in fade-in duration-300">
              <ForgotPassword theme={theme} />
            </div>
          )}

          {activeView === 'profile' && (
            <div className="animate-in fade-in duration-300">
              <Profile theme={theme} onThemeToggle={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} />
            </div>
          )}

          {activeView === 'help-center' && (
            <div className="animate-in fade-in duration-300">
              <HelpCenter theme={theme} />
            </div>
          )}
        </Suspense>
      </main>

      {/* Corporate Footer (Restricted Views) */}
      {activeView !== 'checkout' && activeView !== 'receipt' && (
        <Footer theme={theme} />
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleAuthModalClose}
        onSuccess={handleAuthSuccess}
        theme={theme}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <BookingProvider>
          <AppContent />
        </BookingProvider>
      </UserProvider>
    </AuthProvider>
  );
}
