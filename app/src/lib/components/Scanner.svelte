<script lang="ts">
  import { Html5Qrcode } from 'html5-qrcode';
  import { onMount, onDestroy } from 'svelte';
  
  interface Props {
    onScan: (barcode: string) => void;
    onError?: (error: string) => void;
    active?: boolean;
  }
  
  let { onScan, onError, active = true }: Props = $props();
  
  let scanner: Html5Qrcode | null = null;
  let isScanning = $state(false);
  let error = $state('');
  let scannerContainerId = 'qr-reader';
  
  onMount(() => {
    if (active) {
      startScanner();
    }
    return () => {
      stopScanner();
    };
  });
  
  onDestroy(() => {
    stopScanner();
  });
  
  // React to active prop changes
  $effect(() => {
    if (active && !isScanning) {
      startScanner();
    } else if (!active && isScanning) {
      stopScanner();
    }
  });
  
  async function startScanner() {
    try {
      scanner = new Html5Qrcode(scannerContainerId);
      
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length > 0) {
        // Prefer rear camera
        const rearCamera = devices.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('rear'));
        const cameraId = rearCamera?.id || devices[0].id;
        
        await scanner.start(
          cameraId,
          {
            fps: 10,
            qrbox: { width: 280, height: 180 },
            aspectRatio: 1.0
          },
          (decodedText) => {
            // Success callback
            onScan(decodedText);
            // Haptic feedback if available
            if (navigator.vibrate) {
              navigator.vibrate(200);
            }
          },
          (errorMessage) => {
            // Error callback - usually just "QR code not found" while scanning
            // Don't show errors for normal scanning process
          }
        );
        
        isScanning = true;
      } else {
        error = 'No cameras found';
        if (onError) onError(error);
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Camera access denied';
      if (onError) onError(error);
    }
  }
  
  async function stopScanner() {
    if (scanner && isScanning) {
      try {
        await scanner.stop();
      } catch (e) {
        // Scanner might already be stopped
      }
      isScanning = false;
    }
  }
</script>

<div class="scanner-container">
  <div id={scannerContainerId} style="width: 100%; height: 100%;"></div>
  
  {#if error}
    <div class="scanner-overlay">
      <div class="card status-error" style="max-width: 300px;">
        <p style="margin: 0 0 12px 0;">{error}</p>
        <button class="btn" onclick={startScanner}>Try Again</button>
      </div>
    </div>
  {:else}
    <div class="scanner-overlay">
      <div class="scanner-frame"></div>
    </div>
    
    <div style="position: absolute; bottom: 100px; left: 0; right: 0; text-align: center; pointer-events: none;">
      <p style="color: white; font-size: 15px; text-shadow: 0 1px 3px rgba(0,0,0,0.8); margin: 0;">
        Point camera at barcode
      </p>
    </div>
  {/if}
</div>

<style>
  :global(#qr-reader video) {
    object-fit: cover !important;
    width: 100% !important;
    height: 100% !important;
  }
  
  :global(#qr-reader) {
    width: 100% !important;
    height: 100% !important;
    border: none !important;
  }
  
  :global(#qr-reader__dashboard) {
    display: none !important;
  }
</style>
