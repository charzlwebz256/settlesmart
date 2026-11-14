import { useEffect, useRef, useState } from 'react';

// Swipe-down-to-refresh for a section that fills the top of the screen (the
// transit map). Listens natively in the capture phase so a downward drag is
// still seen when the Google Maps canvas swallows the touch events.
export function useSwipeToRefresh({ onRefresh, threshold = 72, enabled = true }) {
  const ref = useRef(null);
  const startY = useRef(null);
  const distanceRef = useRef(0);
  const refreshingRef = useRef(false);
  const refreshRef = useRef(onRefresh);
  refreshRef.current = onRefresh;

  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return undefined;

    const atTop = () => (window.scrollY || 0) <= 0;

    const onStart = (event) => {
      if (refreshingRef.current || event.touches.length !== 1 || !atTop()) {
        startY.current = null;
        return;
      }
      startY.current = event.touches[0].clientY;
    };

    const onMove = (event) => {
      if (startY.current === null || refreshingRef.current) return;
      const delta = event.touches[0].clientY - startY.current;
      if (delta <= 0) {
        startY.current = null;
        distanceRef.current = 0;
        setPullDistance(0);
        return;
      }
      const next = Math.min(delta * 0.5, threshold * 1.6);
      distanceRef.current = next;
      setPullDistance(next);
    };

    const finish = async () => {
      if (refreshingRef.current) return;
      const reached = distanceRef.current >= threshold;
      startY.current = null;
      if (!reached) {
        distanceRef.current = 0;
        setPullDistance(0);
        return;
      }
      refreshingRef.current = true;
      setIsRefreshing(true);
      setPullDistance(threshold);
      try {
        await refreshRef.current?.();
      } finally {
        refreshingRef.current = false;
        setIsRefreshing(false);
        distanceRef.current = 0;
        setPullDistance(0);
      }
    };

    element.addEventListener('touchstart', onStart, { capture: true, passive: true });
    element.addEventListener('touchmove', onMove, { capture: true, passive: true });
    element.addEventListener('touchend', finish, { capture: true });
    element.addEventListener('touchcancel', finish, { capture: true });

    return () => {
      element.removeEventListener('touchstart', onStart, true);
      element.removeEventListener('touchmove', onMove, true);
      element.removeEventListener('touchend', finish, true);
      element.removeEventListener('touchcancel', finish, true);
    };
  }, [enabled, threshold]);

  return { ref, pullDistance, isRefreshing };
}