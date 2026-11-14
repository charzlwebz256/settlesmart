import { useCallback, useEffect, useRef, useState } from 'react';

// Device compass (deviceorientation). Gives the way the phone is pointing, which
// the map needs for a Google-Maps style direction arrow, GPS heading alone is
// null whenever the rider stands still.
export function useDeviceOrientation() {
  const [heading, setHeading] = useState(null);
  const [granted, setGranted] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);
  const handlerRef = useRef(null);
  const activeRef = useRef(false);

  const listen = useCallback(() => {
    if (activeRef.current) return;
    activeRef.current = true;

    const handler = (event) => {
      // Only trust a real compass reading, a laptop's relative tilt sensor would
      // otherwise spin the arrow for no reason.
      const compass = Number.isFinite(event.webkitCompassHeading);
      if (!compass && event.type !== 'deviceorientationabsolute' && event.absolute !== true) return;
      const raw = compass ? event.webkitCompassHeading : 360 - (Number(event.alpha) || 0);
      if (!Number.isFinite(raw)) return;
      setHeading(((raw % 360) + 360) % 360);
    };

    handlerRef.current = handler;
    window.addEventListener('deviceorientationabsolute', handler, true);
    window.addEventListener('deviceorientation', handler, true);
    setGranted(true);
    setNeedsPermission(false);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.DeviceOrientationEvent === 'undefined') return;
    // iOS hands out a prompt instead of the sensor, and only after a tap.
    if (typeof window.DeviceOrientationEvent.requestPermission === 'function') {
      setNeedsPermission(true);
    } else {
      listen();
    }
    return () => {
      const handler = handlerRef.current;
      if (!handler) return;
      window.removeEventListener('deviceorientationabsolute', handler, true);
      window.removeEventListener('deviceorientation', handler, true);
      activeRef.current = false;
    };
  }, [listen]);

  // Must be called from a tap: the browser only shows the prompt on a gesture.
  const requestPermission = useCallback(async () => {
    try {
      const result = await window.DeviceOrientationEvent.requestPermission();
      if (result === 'granted') listen();
      else setNeedsPermission(false);
    } catch (_e) {
      setNeedsPermission(false);
    }
  }, [listen]);

  return { heading, granted, needsPermission, requestPermission };
}