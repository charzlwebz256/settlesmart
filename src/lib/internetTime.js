import { useEffect, useState } from 'react';

// A device clock can be minutes or hours off, so the clock reads the real time
// from the network: the Date header of a response from this app's own origin.
// No third-party service, no API key, and it works on every phone.
let offsetMs = 0;
let syncing = null;

async function readServerTime() {
  const url = `${window.location.origin}/`;
  let response = await fetch(url, { method: 'HEAD', cache: 'no-store' });
  if (!response.ok) response = await fetch(url, { method: 'GET', cache: 'no-store' });
  const header = response.headers.get('date');
  const server = header ? Date.parse(header) : NaN;
  if (Number.isFinite(server)) offsetMs = server - Date.now();
}

export function syncInternetTime() {
  if (syncing) return syncing;
  syncing = readServerTime().catch(() => {
    // Offline or a blocked header: fall back to the device clock.
  });
  return syncing;
}

// The current instant, corrected by the measured network offset.
export function nowSynced() {
  return new Date(Date.now() + offsetMs);
}

/**
 * Ticks with network-corrected time and re-syncs every five minutes, so the
 * clock stays right when the device clock or the network drifts.
 */
export function useSyncedNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => nowSynced());

  useEffect(() => {
    syncInternetTime();
    const tick = setInterval(() => setNow(nowSynced()), intervalMs);
    const resync = setInterval(() => {
      syncing = null;
      syncInternetTime();
    }, 300000);
    return () => {
      clearInterval(tick);
      clearInterval(resync);
    };
  }, [intervalMs]);

  return now;
}