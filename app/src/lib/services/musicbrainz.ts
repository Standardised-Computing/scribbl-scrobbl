import type { Album, Track, MusicBrainzRelease } from '../types';

// Rate limiting: MusicBrainz requires 1 request per second
let lastRequestTime = 0;
const REQUEST_DELAY = 1100; // 1.1 seconds to be safe

async function rateLimitedFetch(url: string): Promise<Response> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < REQUEST_DELAY) {
    await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY - timeSinceLastRequest));
  }
  
  lastRequestTime = Date.now();
  
  return fetch(url, {
    headers: {
      'User-Agent': 'scribbl-scrobbl/1.0 (https://github.com/user/scribbl-scrobbl)'
    }
  });
}

export const musicBrainz = {
  async lookupByBarcode(barcode: string): Promise<Album | null> {
    // Search for release by barcode
    const searchUrl = `https://musicbrainz.org/ws/2/release?query=barcode:${barcode}&fmt=json`;
    const searchResponse = await rateLimitedFetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchData.releases || searchData.releases.length === 0) {
      return null;
    }

    const release: MusicBrainzRelease = searchData.releases[0];
    
    // Fetch full release with tracklist
    const releaseUrl = `https://musicbrainz.org/ws/2/release/${release.id}?inc=recordings&fmt=json`;
    const releaseResponse = await rateLimitedFetch(releaseUrl);
    const releaseData = await releaseResponse.json();

    // Extract tracks
    const tracks: Track[] = [];
    if (releaseData.media && releaseData.media.length > 0) {
      for (const medium of releaseData.media) {
        if (medium.tracks) {
          for (const track of medium.tracks) {
            tracks.push({
              name: track.title,
              duration: track.length ? Math.floor(track.length / 1000) : 180,
              position: track.position
            });
          }
        }
      }
    }

    // Get artist name
    const artistName = release['artist-credit']?.[0]?.name || 'Unknown Artist';
    const artistId = release['artist-credit']?.[0]?.artist?.id || '';

    // Try to get cover art
    let coverArtUrl: string | undefined;
    try {
      const coverArtResponse = await fetch(`https://coverartarchive.org/release/${release.id}/front-250`);
      if (coverArtResponse.ok) {
        coverArtUrl = coverArtResponse.url;
      }
    } catch {
      // Cover art not available
    }

    return {
      id: release.id,
      title: release.title,
      artist: artistName,
      artistId: artistId,
      date: release.date || '',
      barcode: barcode,
      tracks: tracks,
      coverArtUrl: coverArtUrl
    };
  }
};
