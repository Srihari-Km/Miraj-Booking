/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SavedCard {
  id: string;
  cardHolder: string;
  lastFourDigits: string;
  expiryDate: string;
  cardType: 'Visa' | 'Mastercard' | 'RuPay' | 'Amex';
  isDefault: boolean;
}

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  notifications: boolean;
  marketingEmails: boolean;
  favoriteMovieIds: string[];
}
