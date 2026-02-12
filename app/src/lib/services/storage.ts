import type { LastFmSession, ScrobbleSession } from '../types';

const SESSION_KEY = 'lastfm_session';
const HISTORY_KEY = 'scrobble_history';
const MAX_HISTORY_ITEMS = 20;

export const storage = {
  getSession(): LastFmSession | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(SESSION_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  setSession(session: LastFmSession): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },

  clearSession(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(SESSION_KEY);
  },

  getHistory(): ScrobbleSession[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(HISTORY_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  addToHistory(session: ScrobbleSession): void {
    if (typeof window === 'undefined') return;
    const history = this.getHistory();
    history.unshift(session);
    // Keep only last MAX_HISTORY_ITEMS
    const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
  }
};
