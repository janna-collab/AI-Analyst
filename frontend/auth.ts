
import { User } from './types';

const STORAGE_KEY = 'vs_user_session';

/**
 * Authentication Service
 * Handles local session management for the analyst portal.
 */
export const authService = {
  signUp(email: string, _password: string, name: string): User {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return newUser;
  },

  login(email: string, _password: string): User {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const user = JSON.parse(stored);
      if (user.email === email) return user;
    }
    // Fallback for demo/guest purposes
    return this.signUp(email, 'pass', email.split('@')[0]);
  },

  getCurrentUser(): User | null {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  logout() {
    localStorage.removeItem(STORAGE_KEY);
  }
};
