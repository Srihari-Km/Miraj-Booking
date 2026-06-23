/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BookingRecord {
  bookingId: string;
  movieTitle: string;
  moviePosterUrl?: string;
  theaterName: string;
  showtime: string;
  screenType: string;
  selectedSeatIds: string[];
  finalTotal: number;
  bookedAt: string;
  city: string;
}
