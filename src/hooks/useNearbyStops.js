import { useCallback, useState } from 'react';
import { fetchNearbyStops } from '@/components/transit/nearbyStops';

// Transit stops barely change, so nearby results are cached per ~1 km square.
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const cacheKey = (center) => `ss-stops:${Number(center[0]).toFixed(2)}:${Number(center[1]).toFixed(2)}`;

function readCache(center) {
  try {
    const raw = window.localStorage.getItem(cacheKey(center));
    if (!raw) return null;
    const entry = JSON.parse(raw);
    return Date.now() - entry.at < CACHE_TTL_MS ? entry.stops : null;
  } catch {
    return null;
  }
}

function writeCache(center, stops) {
  try {
    window.localStorage.setItem(cacheKey(center), JSON.stringify({ at: Date.now(), stops }));
  } catch {
    // Storage disabled — the map still works, it just refetches.
  }
}

// Loads the real transit stops around the current map view.
export function useNearbyStops() {
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async (center, { force = false } = {}) => {
    if (!center) return;
    const cached = force ? null : readCache(center);
    if (cached) {
      setStops(cached);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const fresh = await fetchNearbyStops(center);
      setStops(fresh);
      writeCache(center, fresh);
    } catch (e) {
      setError(e?.message || 'Could not load nearby transit stops.');
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setStops([]);
    setError(null);
  }, []);

  return { stops, loading, error, load, clear };
}