<script lang="ts">
  import { onMount } from 'svelte';
  import { lastFm } from './lib/services/lastfm';
  import { musicBrainz } from './lib/services/musicbrainz';
  import type { Album, ViewState } from './lib/types';
  
  import Scanner from './lib/components/Scanner.svelte';
  import AlbumCard from './lib/components/AlbumCard.svelte';
  import ScrobbleProgress from './lib/components/ScrobbleProgress.svelte';
  import AuthButton from './lib/components/AuthButton.svelte';
  
  // State
  let view: ViewState = $state('scanner');
  let isAuthenticated = $state(false);
  let currentAlbum: Album | null = $state(null);
  let error = $state('');
  let loading = $state(false);
  let scrobbleProgress = $state(0);
  let currentTrackName = $state('');
  let successMessage = $state('');
  
  onMount(() => {
    checkAuth();
    handleAuthCallback();
  });
  
  function checkAuth() {
    isAuthenticated = lastFm.isAuthenticated();
  }
  
  async function handleAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      loading = true;
      error = '';
      try {
        await lastFm.getSession(token);
        isAuthenticated = true;
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (err) {
        error = err instanceof Error ? err.message : 'Authentication failed';
      } finally {
        loading = false;
      }
    }
  }
  
  async function handleBarcodeScan(barcode: string) {
    if (!isAuthenticated) {
      error = 'Please connect to Last.fm first';
      return;
    }
    
    loading = true;
    error = '';
    
    try {
      const album = await musicBrainz.lookupByBarcode(barcode);
      
      if (!album) {
        error = 'Album not found. Try another barcode.';
        return;
      }
      
      currentAlbum = album;
      view = 'confirm';
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to lookup album';
    } finally {
      loading = false;
    }
  }
  
  async function handleScrobble() {
    if (!currentAlbum) return;
    
    view = 'scrobbling';
    error = '';
    
    try {
      // Simulate progress (actual scrobbling happens all at once)
      const totalTracks = currentAlbum.tracks.length;
      
      for (let i = 0; i < totalTracks; i++) {
        currentTrackName = currentAlbum.tracks[i].name;
        scrobbleProgress = ((i + 1) / totalTracks) * 100;
        
        // Small delay for visual feedback
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Actually scrobble
      await lastFm.scrobbleAlbum(currentAlbum);
      
      successMessage = `Scrobbled ${currentAlbum.tracks.length} tracks from "${currentAlbum.title}"`;
      view = 'success';
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to scrobble';
      view = 'confirm';
    }
  }
  
  function handleCancel() {
    currentAlbum = null;
    error = '';
    view = 'scanner';
  }
  
  function handleScanAnother() {
    currentAlbum = null;
    successMessage = '';
    error = '';
    view = 'scanner';
  }
</script>

<div class="nav-bar">
  <h1 class="nav-title">scribbl scrobbl</h1>
</div>

{#if error}
  <div class="status-message status-error" style="margin: 8px 16px;">
    {error}
  </div>
{/if}

{#if loading}
  <div style="padding: 40px; text-align: center;">
    <div style="color: var(--text-secondary);">Loading...</div>
  </div>
{/if}

{#if view === 'scanner'}
  {#if isAuthenticated}
    <Scanner 
      onScan={handleBarcodeScan}
      onError={(err) => error = err}
    />
  {:else}
    <div class="content flex flex-col items-center justify-center" style="gap: 24px;">
      <div class="text-center">
        <div style="font-size: 64px; margin-bottom: 16px;">📀</div>
        <h2 style="font-size: 24px; margin: 0 0 8px; color: var(--text-primary);">Welcome to scribbl scrobbl</h2>
        <p style="color: var(--text-secondary); margin: 0;">Scan physical music barcodes<br>and scrobble albums to Last.fm</p>
      </div>
      
      <div style="width: 100%; max-width: 300px;">
        <AuthButton {isAuthenticated} />
      </div>
      
      <div class="card" style="max-width: 300px; margin-top: 24px;">
        <p style="font-size: 14px; color: var(--text-muted); margin: 0; text-align: center;">
          Connect your Last.fm account to start scrobbling CDs, vinyl, and cassettes
        </p>
      </div>
    </div>
  {/if}
{:else if view === 'confirm' && currentAlbum}
  <div class="content">
    <AlbumCard album={currentAlbum} />
    
    <div style="display: flex; gap: 12px; margin-top: 24px;">
      <button class="btn btn-secondary" style="flex: 1;" onclick={handleCancel}>
        Cancel
      </button>
      <button class="btn btn-music btn-large" style="flex: 2;" onclick={handleScrobble}>
        Scrobble Now
      </button>
    </div>
  </div>
{:else if view === 'scrobbling' && currentAlbum}
  <div class="content flex flex-col items-center justify-center">
    <ScrobbleProgress 
      album={currentAlbum}
      progress={scrobbleProgress}
      currentTrack={currentTrackName}
    />
  </div>
{:else if view === 'success'}
  <div class="content flex flex-col items-center justify-center" style="gap: 24px;">
    <div class="text-center">
      <div style="font-size: 64px; margin-bottom: 16px;">✓</div>
      <h2 style="font-size: 24px; margin: 0 0 8px; color: var(--text-primary);">Success!</h2>
      <p style="color: var(--text-secondary); margin: 0;">{successMessage}</p>
    </div>
    
    {#if currentAlbum}
      <div class="album-art" style="width: 160px; height: 160px; border-radius: var(--radius-md);">
        {#if currentAlbum.coverArtUrl}
          <img src={currentAlbum.coverArtUrl} alt={currentAlbum.title} style="border-radius: var(--radius-md);" />
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
    {/if}
    
    <div style="width: 100%; max-width: 300px;">
      <button class="btn btn-success btn-large w-full" onclick={handleScanAnother}>
        Scan Another
      </button>
    </div>
    
    <a 
      href="https://www.last.fm/user/me" 
      target="_blank" 
      rel="noopener noreferrer"
      style="color: var(--accent-primary); text-decoration: none; font-size: 15px;"
    >
      View on Last.fm →
    </a>
  </div>
{/if}

{#if isAuthenticated && view === 'scanner'}
  <div style="position: fixed; bottom: calc(20px + var(--safe-bottom)); left: 16px; right: 16px;">
    <div class="card" style="display: flex; align-items: center; justify-content: space-between;">
      <span style="font-size: 14px; color: var(--text-secondary);">Connected to Last.fm</span>
      <AuthButton {isAuthenticated} />
    </div>
  </div>
{/if}
