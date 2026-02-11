<script lang="ts">
  import type { Album } from '../types';
  
  interface Props {
    album: Album;
  }
  
  let { album }: Props = $props();
  
  function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  
  function formatTotalDuration(): string {
    const total = album.tracks.reduce((sum, track) => sum + track.duration, 0);
    const mins = Math.floor(total / 60);
    return `${mins} min`;
  }
</script>

<div class="album-card">
  <div class="album-art">
    {#if album.coverArtUrl}
      <img src={album.coverArtUrl} alt={album.title} />
    {:else}
      <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; color: var(--text-muted);">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 18V5l12-2v13"></path>
          <circle cx="6" cy="18" r="3"></circle>
          <circle cx="18" cy="16" r="3"></circle>
        </svg>
      </div>
    {/if}
  </div>
  
  <div class="album-info">
    <h2 class="album-title">{album.title}</h2>
    <p class="album-artist">{album.artist}</p>
    {#if album.date}
      <p style="font-size: 14px; color: var(--text-muted); margin: 4px 0 0;">{album.date.substring(0, 4)} • {formatTotalDuration()}</p>
    {/if}
  </div>
</div>

<div class="tracklist">
  {#each album.tracks as track}
    <div class="track-item">
      <span class="track-number">{track.position}</span>
      <span class="track-name">{track.name}</span>
      <span class="track-duration">{formatDuration(track.duration)}</span>
    </div>
  {/each}
</div>
