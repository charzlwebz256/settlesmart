import { base44 } from '@/api/base44Client';

// Loads the Google Maps JavaScript API once per session.
// The key is a browser (referrer-restricted) key served by the mapsConfig function.
let loaderPromise = null;
let authFailed = false;

// Google reports a rejected key or referrer through window.gm_authFailure. Without
// a handler it paints its own "Oops! Something went wrong" panel over the map.
const authFailureListeners = new Set();

export function onMapsAuthFailure(listener) {
  authFailureListeners.add(listener);
  return () => authFailureListeners.delete(listener);
}

const CALLBACK = '__settlesmartMapsReady';

function injectScript(key) {
  return new Promise((resolve, reject) => {
    window[CALLBACK] = () => resolve();
    const script = document.createElement('script');
    // auth_referrer_policy keeps the key valid when a browser strips the full URL.
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly&libraries=geometry&callback=${CALLBACK}&auth_referrer_policy=origin`;
    script.async = true;
    script.onerror = () => reject(new Error('load-failed'));
    document.head.appendChild(script);
  });
}

// On a phone the maps namespace appears a moment after the script reports ready,
// so wait for it instead of failing on the first look.
async function waitForMaps(timeoutMs = 10000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (authFailed) return null;
    if (window.google?.maps?.Map) return window.google.maps;
    await new Promise((resolve) => setTimeout(resolve, 120));
  }
  return null;
}

export function loadGoogleMaps() {
  if (typeof window !== 'undefined' && window.google?.maps?.Map) {
    return Promise.resolve(window.google.maps);
  }
  if (loaderPromise) return loaderPromise;

  window.gm_authFailure = () => {
    authFailed = true;
    loaderPromise = null;
    authFailureListeners.forEach((listener) => {
      try {
        listener();
      } catch (_e) {
        // A broken listener must not hide the failure from the others.
      }
    });
  };

  loaderPromise = (async () => {
    const response = await base44.functions.invoke('mapsConfig', {});
    const key = response?.data?.key;
    if (!key) throw new Error('missing-key');

    await injectScript(key);
    const maps = await waitForMaps();
    if (authFailed) throw new Error('auth-failed');
    if (!maps) throw new Error('load-failed');
    return maps;
  })().catch((error) => {
    loaderPromise = null;
    throw error;
  });

  return loaderPromise;
}