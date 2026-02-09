<script lang="ts">
  import { lastFm } from '../services/lastfm';
  
  interface Props {
    isAuthenticated: boolean;
  }
  
  let { isAuthenticated }: Props = $props();
  
  function handleAuth() {
    if (isAuthenticated) {
      lastFm.logout();
      window.location.reload();
    } else {
      window.location.href = lastFm.getAuthUrl();
    }
  }
</script>

<button class="btn {isAuthenticated ? 'btn-secondary' : 'btn-music'} btn-large w-full" onclick={handleAuth}>
  {#if isAuthenticated}
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
    Disconnect
  {:else}
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
      <polyline points="10 17 15 12 10 7"></polyline>
      <line x1="15" y1="12" x2="3" y2="12"></line>
    </svg>
    Connect to Last.fm
  {/if}
</button>
