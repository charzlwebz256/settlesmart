import { useCallback, useEffect, useRef, useState } from 'react';
import { bearingBetween, distanceMeters } from '@/lib/geo';

// A fix older than this is not worth drawing.
const STALE_MS = 30000;
// A single reading this rough is discarded once we already have a usable one.
const MAX_ACCURACY_M = 500;
// Anything implying a faster move than this over land is a bad fix, not travel.
const MAX_SPEED_MPS = 90;

// Always ask for a brand-new high-accuracy fix: maximumAge 0 keeps the pin at
// the metre-level precision GPS can report, never a cached reading.
const WATCH_OPTIONS = { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 };
const ONCE_OPTIONS = { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 };

const STATUS_MESSAGES = {
  denied: 'Location permission is blocked. Allow location for this site in your browser settings, then tap Locate.',
  timeout: 'GPS is taking too long. Move near a window or outdoors and try again.',
  unavailable: 'Your device could not provide a location right now.',
  unsupported: 'This browser does not support location access. Search an address instead.',
};

// Live device location: continuous watch, accuracy filtering, jitter smoothing
// and impossible-jump rejection. Accuracy is always the device's own reading.
export function useDeviceLocation({ autoStart = true } = {}) {
  const [position, setPosition] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [heading, setHeading] = useState(null);
  const [speed, setSpeed] = useState(null);
  const [lastFixAt, setLastFixAt] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const watchRef = useRef(null);
  const lastFixRef = useRef(null);
  const headingRef = useRef(null);

  const acceptFix = useCallback((coords, timestamp) => {
    if (!coords) return;
    const age = Date.now() - timestamp;
    if (age > STALE_MS) return;

    const reportedAccuracy = Number.isFinite(coords.accuracy) ? coords.accuracy : null;
    const next = { lat: coords.latitude, lng: coords.longitude };
    const previous = lastFixRef.current;

    if (previous) {
      if (reportedAccuracy != null && reportedAccuracy > MAX_ACCURACY_M) return;
      // A rougher reading never pulls the pin away from a tighter fix we hold.
      if (
        reportedAccuracy != null &&
        previous.accuracy != null &&
        reportedAccuracy > previous.accuracy * 1.5 &&
        reportedAccuracy > previous.accuracy + 15
      ) return;
      const seconds = Math.max((timestamp - previous.at) / 1000, 0.5);
      const moved = distanceMeters(previous, next);
      if (moved > 150 && moved / seconds > MAX_SPEED_MPS) return;
    }

    // Smoothing: barely moves when standing still, keeps up when travelling.
    let smoothed = next;
    if (previous) {
      const moved = distanceMeters(previous, next);
      // A tight fix (a few metres) is trusted as-is; rougher ones are smoothed.
      const weight =
        reportedAccuracy != null && reportedAccuracy <= 8
          ? 1
          : moved < 4
            ? 0.18
            : moved < 25
              ? 0.4
              : 0.65;
      smoothed = {
        lat: previous.lat + (next.lat - previous.lat) * weight,
        lng: previous.lng + (next.lng - previous.lng) * weight,
      };
      if (Number.isFinite(coords.heading) && coords.speed > 0.6) {
        headingRef.current = coords.heading;
      } else if (distanceMeters(previous, smoothed) > 5) {
        headingRef.current = bearingBetween(previous, smoothed);
      }
    }

    lastFixRef.current = { ...smoothed, at: timestamp, accuracy: reportedAccuracy };
    setPosition(smoothed);
    setAccuracy(reportedAccuracy);
    setSpeed(Number.isFinite(coords.speed) ? coords.speed : null);
    setHeading(headingRef.current);
    setLastFixAt(timestamp);
    setError('');
    setStatus('tracking');
  }, []);

  const handleError = useCallback((err) => {
    if (err?.code === 1) setStatus('denied');
    else if (err?.code === 3) setStatus('timeout');
    else setStatus('unavailable');
    setError(STATUS_MESSAGES[statusKeyOf(err)] || 'Could not get your location.');
  }, []);

  const requestOnce = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('unsupported');
      setError(STATUS_MESSAGES.unsupported);
      return;
    }
    setStatus((current) => (current === 'tracking' ? current : 'locating'));
    navigator.geolocation.getCurrentPosition(
      (fix) => acceptFix(fix.coords, fix.timestamp),
      handleError,
      ONCE_OPTIONS
    );
  }, [acceptFix, handleError]);

  const start = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('unsupported');
      setError(STATUS_MESSAGES.unsupported);
      return;
    }
    if (watchRef.current != null) return;
    setStatus((current) => (current === 'tracking' ? current : 'locating'));
    setError('');
    watchRef.current = navigator.geolocation.watchPosition(
      (fix) => acceptFix(fix.coords, fix.timestamp),
      handleError,
      WATCH_OPTIONS
    );
  }, [acceptFix, handleError]);

  const stop = useCallback(() => {
    if (watchRef.current != null) {
      navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
    }
    setStatus((current) => (current === 'tracking' ? 'paused' : current));
  }, []);

  useEffect(() => {
    if (autoStart) start();
    return () => {
      if (watchRef.current != null) {
        navigator.geolocation.clearWatch(watchRef.current);
        watchRef.current = null;
      }
    };
  }, [autoStart, start]);

  return {
    position,
    accuracy,
    heading,
    speed,
    lastFixAt,
    status,
    error,
    locating: status === 'locating',
    tracking: status === 'tracking',
    start,
    stop,
    requestOnce,
  };
}

function statusKeyOf(err) {
  if (err?.code === 1) return 'denied';
  if (err?.code === 3) return 'timeout';
  return 'unavailable';
}