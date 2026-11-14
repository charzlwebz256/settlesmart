import { useCallback, useState } from 'react';
import { fetchNearbyStops } from '@/components/transit/nearbyStops';

// Loads the real transit stops around the current map view.
export function useNearbyStops() {
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async (center) => {
    if (!center) return;
    setLoading(true);
    setError(null);
    try {
      setStops(await fetchNearbyStops(center));
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