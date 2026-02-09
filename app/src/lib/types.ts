export interface Track {
  name: string;
  duration: number; // in seconds
  position: number;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  date: string;
  barcode: string;
  tracks: Track[];
  coverArtUrl?: string;
}

export interface LastFmSession {
  name: string;
  key: string;
}

export type ViewState = 'scanner' | 'confirm' | 'scrobbling' | 'success';

export interface ScrobbleProgress {
  total: number;
  completed: number;
  currentTrack: string;
}

export interface MusicBrainzRelease {
  id: string;
  title: string;
  'artist-credit': Array<{
    name: string;
    artist: {
      id: string;
      name: string;
    };
  }>;
  date: string;
  barcode: string;
  media?: Array<{
    tracks: Array<{
      id: string;
      title: string;
      length?: number;
      position: number;
    }>;
  }>;
}
