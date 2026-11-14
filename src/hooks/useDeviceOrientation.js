import { useCallback, useEffect, useRef, useState } from 'react';

// Device compass and tilt (deviceorientation). The heading gives the way the
// phone points, which a rider needs while standing still; beta/gamma let the
// compass rose lean with the handset.
export function useDeviceOrientation() {
  const [heading, setHeading] = useState(null);
  const [tilt, setTilt] = useState({ beta: 0, gamma: 0 });
  const [granted, setGranted] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);
  const handlerRef = useRef(null);
  const activeRef = useRef(false);

  const listen = useCallback(() => {
    if (activeRef.current) return;
    activeRef.current = true;

    const handler = (event) => {
      // Tilt is readable from any orientation event, absolute or not.
      const beta = Number(event.beta);
      const gamma = Number(event.gamma);
      if (Number.isFinite(beta) || Number.isFinite(gamma)) {
        const nextBeta = Number.isFinite(beta) ? Math.round(beta) : 0;
        const nextGamma = Number.isFinite(gamma) ? Math.round(gamma) : 0;
        setTilt((prev) =>
          prev.beta === nextBeta && prev.gamma === nextGamma ? prev : { beta: nextBeta, gamma: nextGamma }
        );
      }

      // Only trust a real compass reading, a laptop's relative tilt sensor would
      // otherwise spin the arrow for no reason.
      const compass = Number.isFinite(event.webkitCompassHeading);
      if (!compass && event.type !== 'deviceorientationabsolute' && event.absolute !== true) return;
      const raw = compass ? event.webkitCompassHeading : 360 - (Number(event.alpha) || 0);
      if (!Number.isFinite(raw)) return;

      const next = ((raw % 360) + 360) % 360;
      // Ignore sub-degree jitter so the dial settles instead of buzzing.
      setHeading((prev) =>
        prev !== null && Math.abs(((next - prev + 540) % 360) - 180) < 0.8 ? prev : next
      );
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