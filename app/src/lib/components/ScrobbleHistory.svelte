<script lang="ts">
  import type { ScrobbleSession } from '../types';
  
  interface Props {
    history: ScrobbleSession[];
  }
  
  let { history }: Props = $props();
  
  // Group history by album name
  const groupedHistory = $derived(() => {
    const groups = new Map<string, ScrobbleSession[]>();
    
    history.forEach(session => {
      const key = session.album.title;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(session);
    });
    
    // Convert to array and sort by most recent session in each group
    return Array.from(groups.entries()).map(([albumName, sessions]) => ({
      albumName,
      artist: sessions[0].album.artist,
      coverArtUrl: sessions[0].album.coverArtUrl,
      sessions: sessions.sort((a, b) => b.scrobbledAt - a.scrobbledAt)
    })).sort((a, b) => {
      // Sort groups by the most recent session
      const aLatest = a.sessions[0].scrobbledAt;
      const bLatest = b.sessions[0].scrobbledAt;
      return bLatest - aLatest;
    });
  });
  
  function formatDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  function formatTime(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  }
</script>

{#if history.length > 0}
  <div class="history-container">
    <h3 class="history-title">Recent Scrobbles</h3>
    
    <div class="history-list">
      {#each groupedHistory() as group}
        <div class="history-album-group">
          <div class="history-album-header">
            <div class="history-album-art">
              {#if group.coverArtUrl}
                <img src={group.coverArtUrl} alt={group.albumName} />
              {:else}
                <div class="history-album-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 18V5l12-2v13"></path>
                    <circle cx="6" cy="18" r="3"></circle>
                    <circle cx="18" cy="16" r="3"></circle>
                  </svg>
                </div>
              {/if}
            </div>
            <div class="history-album-info">
              <div class="history-album-name">{group.albumName}</div>
              <div class="history-artist-name">{group.artist}</div>
              <div class="history-session-count">{group.sessions.length} session{group.sessions.length !== 1 ? 's' : ''}</div>
            </div>
          </div>
          
          <div class="history-tracks">
            {#each group.sessions as session}
              <div class="history-session">
                <div class="history-session-date">{formatDate(session.scrobbledAt)}</div>
                <div class="history-session-tracks">
                  {#each session.tracks as track}
                    <div class="history-track-item">
                      <span class="history-track-name">{track.name}</span>
                      <span class="history-track-time">{formatTime(track.timestamp)}</span>
                    </div>
                  {/each}
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
{:else}
  <div class="history-empty">
    <div class="history-empty-icon">📀</div>
    <p>No scrobbles yet</p>
    <p class="history-empty-subtitle">Scan an album to get started</p>
  </div>
{/if}
