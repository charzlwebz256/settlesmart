import { useRef, useState, useCallback } from 'react';

/**
 * Native-style pull-to-refresh hook.
 * Returns { containerRef, pullDistance, isRefreshing, isPulling }
 * Calls `onRefresh` when the user pulls past `threshold` pixels.
 */
export function usePullToRefresh({ onRefresh, threshold = 72 }) {
  const containerRef = useRef(null);
  const startY = useRef(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isPulling = pullDistance > 0;

  const handleTouchStart = useCallback((e) => {
    if (containerRef.current?.scrollTop !== 0) return;
    startY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (startY.current === null) return;
    if (isRefreshing) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0 && containerRef.current?.scrollTop === 0) {
      // Dampen pull
      setPullDistance(Math.min(dy * 0.45, threshold * 1.5));
    }
  }, [isRefreshing, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(threshold);
      await onRefresh();
      setIsRefreshing(false);
    }
    setPullDistance(0);
    startY.current = null;
  }, [pullDistance, threshold, isRefreshing, onRefresh]);

  const touchHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };

  return { containerRef, pullDistance, isRefreshing, isPulling, touchHandlers };
}