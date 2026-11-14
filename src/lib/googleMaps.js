import { base44 } from '@/api/base44Client';

// Loads the Google Maps JavaScript API once per session.
// The key is a browser (referrer-restricted) key served by the mapsConfig function.
let loaderPromise = null;

export function loadGoogleMaps() {
  if (typeof window !== 'undefined' && window.google?.maps?.Map) {
    return Promise.resolve(window.google.maps);
  }
  if (loaderPromise) return loaderPromise;

  loaderPromise = (async () => {
    const response = await base44.functions.invoke('mapsConfig', {});
    const key = response?.data?.key;
    if (!key) throw new Error('missing-key');

    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly&libraries=geometry`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('load-failed'));
      document.head.appendChild(script);
    });

    if (!window.google?.maps?.Map) throw new Error('load-failed');
    return window.google.maps;
  })().catch((error) => {
    loaderPromise = null;
    throw error;
  });

  return loaderPromise;
}