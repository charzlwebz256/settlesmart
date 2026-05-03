import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

/**
 * Detects the user's city via:
 * 1. Their saved UserProfile (most reliable, already personalized)
 * 2. IP-based geolocation (ipapi.co — free, no key needed)
 * 3. Falls back to 'Edmonton' if both fail
 *
 * Returns: { city, province, source, loading }
 */
export function useCityDetection() {
  const [city, setCity] = useState(null);
  const [province, setProvince] = useState(null);
  const [source, setSource] = useState(null); // 'profile' | 'ip' | 'fallback'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function detect() {
      // 1. Try saved profile first
      try {
        const user = await base44.auth.me();
        const results = await base44.entities.UserProfile.filter({ created_by: user.email });
        const profile = results[0];
        if (profile?.city && !cancelled) {
          setCity(profile.city);
          setProvince(profile.province || null);
          setSource('profile');
          setLoading(false);
          return;
        }
      } catch (_) {
        // not logged in or no profile — continue
      }

      // 2. Try IP geolocation
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data?.city && !cancelled) {
          setCity(data.city);
          setProvince(data.region || null);
          setSource('ip');
          setLoading(false);
          return;
        }
      } catch (_) {
        // network issue — continue
      }

      // 3. Fallback
      if (!cancelled) {
        setCity('Edmonton');
        setProvince('Alberta');
        setSource('fallback');
        setLoading(false);
      }
    }

    detect();
    return () => { cancelled = true; };
  }, []);

  return { city, province, source, loading };
}