/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type City = 'Mumbai' | 'Pune' | 'Bengaluru' | 'Belagavi';

export interface CastMember {
  name: string;
  character: string;
  photoUrl: string;
}

export interface Movie {
  id: string;
  title: string;
  rating: 'U' | 'UA' | 'A';
  genre: string[];
  duration: string; // e.g., "2h 45m"
  synopsis: string;
  starring: string[];
  director: string;
  backdrop: string; // Gradient/styling info or descriptive visual representation
  accentColor: string; // Hex color for styled highlights
  ratingScore: number; // e.g., 9.2
  isFeatured?: boolean;
  posterUrl?: string;
  backdropUrl?: string;
  logoUrl?: string;
  cast?: CastMember[];
  directorPhotoUrl?: string;
  trailerYoutubeId?: string;
  localVideoUrl?: string;
}

export interface Showtime {
  id: string;
  time: string; // e.g. "03:15 PM"
  screenType: 'IMAX 3D' | 'GOLD VIP' | '2D DOLBY ATMOS' | '4DX';
  theaterId: string;
  theaterName: string;
  priceStandard: number;
  priceVIP: number;
}

export interface TheaterShowtimes {
  theaterId: string;
  theaterName: string;
  distance: string;
  showtimes: Showtime[];
}

export interface Seat {
  id: string; // e.g. "A5"
  row: string; // e.g., "A"
  col: number; // e.g., 5
  type: 'standard' | 'premium' | 'vip' | 'aisle';
  status: 'available' | 'booked' | 'selected';
}

export interface TransactionDetails {
  bookingId: string;
  city: City;
  movie: Movie;
  theaterName: string;
  showtime: Showtime;
  selectedSeats: Seat[];
  originalTotal: number;
  discount: number;
  finalTotal: number;
  couponCode?: string;
  bookingTime: string;
  foodItems?: SelectedFoodItem[];
}

export interface DailyAnalytics {
  timeSlot: string; // e.g. "12:00 PM"
  occupancy: number; // percentage
  velocity: number; // bookings/min
}

export interface TheaterOccupancy {
  movieTitle: string;
  occupancyRate: number;
  seatsBooked: number;
  totalSeats: number;
}

export interface FoodItem {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: 'Combos' | 'Snacks' | 'Beverages';
}

export interface SelectedFoodItem {
  foodItem: FoodItem;
  quantity: number;
}

