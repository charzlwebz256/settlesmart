import { useCallback, useEffect, useRef, useState } from 'react';

// Device compass (deviceorientation) plus its tilt. Heading tells the map which
// way the phone points, tilt lets the compass rose lean with the hand holding it.
const ease = (prev, next) => {
  if (!Number.isFinite(prev)) return next;
  const delta = ((next - prev + 540) % 360) - 180; // turn the short way round
  return (((prev + delta * 0.25) % 360) + 360) % 360;
};

export function useDeviceOrientation() {
  const [heading, setHeading] = useState(null);
  const [tilt, setTilt] = useState(null);
  const [granted, setGranted] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);
  const handlerRef = useRef(null);
  const activeRef = useRef(false);

  const listen = useCallback(() => {
    if (activeRef.current) return;
    activeRef.current = true;

    const handler = (event) => {
      const alpha = Number(event.alpha);
      const beta = Number(event.beta);
      const gamma = Number(event.gamma);
      const absolute = event.absolute === true || event.type === 'deviceorientationabsolute';

      if (Number.isFinite(beta)) setTilt(Math.max(-45, Math.min(45, beta - 90)));

      let raw = null;
      if (Number.isFinite(event.webkitCompassHeading)) {
        // iOS gives a true compass bearing directly.
        raw = event.webkitCompassHeading;
      } else if (absolute && Number.isFinite(alpha)) {
        raw = 360 - alpha;
      } else if (Number.isFinite(beta) && Number.isFinite(gamma) && (Math.abs(beta - 90) > 12 || Math.abs(gamma) > 12)) {
        // Only a relative sensor here: follow how the phone is tilted instead.
        raw = (Math.atan2(-gamma, beta - 90) * 180) / Math.PI;
      }

      if (raw === null || !Number.isFinite(raw)) return;
      const normalised = ((raw % 360) + 360) % 360;
      setHeading((prev) => ease(prev, normalised));
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

  return { heading, tilt, granted, needsPermission, requestPermission };
}