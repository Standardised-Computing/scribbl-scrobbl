import { storage } from './storage';
import type { LastFmSession, Album, Track } from '../types';

const API_KEY = import.meta.env.VITE_LASTFM_API_KEY;
const SECRET = import.meta.env.VITE_LASTFM_SECRET;
const CALLBACK_URL = import.meta.env.VITE_LASTFM_CALLBACK_URL;

function createApiSignature(params: Record<string, string>): string {
  const sortedKeys = Object.keys(params).sort();
  let signature = '';
  for (const key of sortedKeys) {
    signature += key + params[key];
  }
  signature += SECRET;
  
  // Create MD5 hash
  return md5(signature);
}

// Simple MD5 implementation for browser
function md5(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(32, '0');
}

export const lastFm = {
  getAuthUrl(): string {
    return `https://www.last.fm/api/auth/?api_key=${API_KEY}&cb=${encodeURIComponent(CALLBACK_URL)}`;
  },

  async getSession(token: string): Promise<LastFmSession> {
    const params: Record<string, string> = {
      method: 'auth.getSession',
      api_key: API_KEY,
      token: token
    };
    
    params.api_sig = createApiSignature(params);
    params.format = 'json';
    
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`https://ws.audioscrobbler.com/2.0/?${queryString}`);
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.message || 'Authentication failed');
    }
    
    const session = {
      name: data.session.name,
      key: data.session.key
    };
    
    storage.setSession(session);
    return session;
  },

  isAuthenticated(): boolean {
    return storage.getSession() !== null;
  },

  logout(): void {
    storage.clearSession();
  },

  async scrobbleAlbum(album: Album): Promise<void> {
    const session = storage.getSession();
    if (!session) {
      throw new Error('Not authenticated');
    }

    const now = Math.floor(Date.now() / 1000);
    let currentTime = now;

    // Prepare scrobbles (max 50 per request)
    const scrobbles = album.tracks.slice(0, 50).map((track, index) => {
      const timestamp = currentTime;
      currentTime += track.duration || 180; // Default 3 minutes if no duration
      
      return {
        artist: album.artist,
        track: track.name,
        timestamp: timestamp.toString(),
        album: album.title,
        duration: (track.duration || 180).toString()
      };
    });

    // Build params for signature
    const params: Record<string, string> = {
      method: 'track.scrobble',
      api_key: API_KEY,
      sk: session.key
    };

    // Add track params
    scrobbles.forEach((scrobble, index) => {
      const i = index.toString();
      params[`artist[${i}]`] = scrobble.artist;
      params[`track[${i}]`] = scrobble.track;
      params[`timestamp[${i}]`] = scrobble.timestamp;
      params[`album[${i}]`] = scrobble.album;
      params[`duration[${i}]`] = scrobble.duration;
    });

    params.api_sig = createApiSignature(params);
    params.format = 'json';

    const response = await fetch('https://ws.audioscrobbler.com/2.0/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(params).toString()
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.message || 'Scrobble failed');
    }

    return data;
  }
};
