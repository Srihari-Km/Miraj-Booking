/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, AuthState } from '../types/auth';
import { getItem, setItem, removeItem, STORAGE_KEYS } from '../utils/storage';

export interface AuthStoragePayload {
  token: string;
  userId: string;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, phone: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });

  // Restore session from localStorage/sessionStorage on mount
  useEffect(() => {
    const storedAuth = getItem<AuthStoragePayload>(STORAGE_KEYS.AUTH);
    const storedProfile = getItem<User>(STORAGE_KEYS.PROFILE);
    if (storedAuth?.token && storedProfile) {
      setAuthState({
        isAuthenticated: true,
        user: storedProfile,
        token: storedAuth.token,
      });
    }
  }, []);

  const login = useCallback(async (email: string, password: string, rememberMe: boolean = false): Promise<{ success: boolean; error?: string }> => {
    // Mock: load saved users from localStorage, check credentials
    const registeredUsers = getItem<Array<{ email: string; passwordHash: string; user: User }>>('miraj_registered_users') || [];
    const found = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!found) {
      return { success: false, error: 'No account found with this email. Please register first.' };
    }
    // Simple plaintext comparison (mock only)
    if (found.passwordHash !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    const mockToken = `miraj-mock-token-${Date.now()}`;
    const authPayload: AuthStoragePayload = { token: mockToken, userId: found.user.id };
    setItem(STORAGE_KEYS.AUTH, authPayload, !rememberMe);
    setItem(STORAGE_KEYS.PROFILE, found.user, !rememberMe);

    setAuthState({ isAuthenticated: true, user: found.user, token: mockToken });
    return { success: true };
  }, []);

  const register = useCallback(async (name: string, email: string, phone: string, password: string, rememberMe: boolean = false): Promise<{ success: boolean; error?: string }> => {
    const registeredUsers = getItem<Array<{ email: string; passwordHash: string; user: User }>>('miraj_registered_users') || [];
    const exists = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, error: 'An account with this email already exists. Please login instead.' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      createdAt: new Date().toISOString(),
    };

    registeredUsers.push({ email: newUser.email, passwordHash: password, user: newUser });
    setItem('miraj_registered_users', registeredUsers); // Always in localStorage for persistent registry

    const mockToken = `miraj-mock-token-${Date.now()}`;
    const authPayload: AuthStoragePayload = { token: mockToken, userId: newUser.id };
    setItem(STORAGE_KEYS.AUTH, authPayload, !rememberMe);
    setItem(STORAGE_KEYS.PROFILE, newUser, !rememberMe);

    // Initialize empty user data
    setItem(STORAGE_KEYS.CARDS, [], !rememberMe);
    setItem(STORAGE_KEYS.BOOKINGS, [], !rememberMe);
    setItem(STORAGE_KEYS.FAVORITES, [], !rememberMe);

    setAuthState({ isAuthenticated: true, user: newUser, token: mockToken });
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    removeItem(STORAGE_KEYS.AUTH);
    setAuthState({ isAuthenticated: false, user: null, token: null });
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
