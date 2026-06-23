/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const STORAGE_KEYS = {
  AUTH: 'miraj_auth',
  PROFILE: 'miraj_profile',
  CARDS: 'miraj_cards',
  BOOKINGS: 'miraj_bookings',
  FAVORITES: 'miraj_favorites',
  PREFERENCES: 'miraj_preferences',
} as const;

export function getItem<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key) || sessionStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setItem<T>(key: string, value: T, useSession: boolean = false): void {
  try {
    if (useSession) {
      sessionStorage.setItem(key, JSON.stringify(value));
      // Clean up localStorage to prevent conflict
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
      // Clean up sessionStorage to prevent conflict
      sessionStorage.removeItem(key);
    }
  } catch {
    // Silently fail on private/incognito quota errors
  }
}

export function removeItem(key: string): void {
  try {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  } catch {
    // Silently fail
  }
}
