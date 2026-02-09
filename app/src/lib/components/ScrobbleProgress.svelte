<script lang="ts">
  import type { Album } from '../types';
  
  interface Props {
    album: Album;
    progress: number;
    currentTrack: string;
  }
  
  let { album, progress, currentTrack }: Props = $props();
  
  function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  
  function calculateRemainingTime(): string {
    const completed = Math.floor((progress / 100) * album.tracks.length);
    const remaining = album.tracks.length - completed;
    const remainingDuration = album.tracks.slice(completed).reduce((sum, track) => sum + track.duration, 0);
    const mins = Math.floor(remainingDuration / 60);
    return `~${mins} min`;
  }
</script>

<div class="card progress-container text-center">
  <div class="album-art" style="width: 120px; height: 120px; margin: 0 auto 20px; border-radius: var(--radius-md);">
    {#if album.coverArtUrl}
      <img src={album.coverArtUrl} alt={album.title} style="border-radius: var(--radius-md);" />
    {:else}
      <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; color: var(--text-muted);">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 18V5l12-2v13"></path>
          <circle cx="6" cy="18" r="3"></circle>
          <circle cx="18" cy="16" r="3"></circle>
        </svg>
      </div>
    {/if}
  </div>
  
  <h3 style="margin: 0 0 8px; font-size: 18px; color: var(--text-primary);">Scrobbling...</h3>
  <p style="margin: 0 0 20px; font-size: 14px; color: var(--text-secondary);">{currentTrack}</p>
  
  <div class="progress-bar">
    <div class="progress-fill" style="width: {progress}%"></div>
  </div>
  
  <p class="progress-text">
    {Math.floor((progress / 100) * album.tracks.length)} of {album.tracks.length} tracks • Done in {calculateRemainingTime()}
  </p>
</div>
