import { useRef, useState } from 'react';
import TransitPlanner from '@/components/transit/TransitPlanner';
import EtsNetworkPanel from '@/components/transit/EtsNetworkPanel';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import PullToRefreshIndicator from '@/components/ui/PullToRefreshIndicator';

export default function TransitMap() {
  const [refreshSignal, setRefreshSignal] = useState(0);
  const ignoreRef = useRef(false);

  const { containerRef, pullDistance, isRefreshing, touchHandlers } = usePullToRefresh({
    onRefresh: async () => {
      setRefreshSignal((n) => n + 1);
      // Give the position fix and route request a moment to land.
      await new Promise((resolve) => setTimeout(resolve, 900));
    },
  });

  // Dragging the map must never trigger the page refresh.
  const guardedHandlers = {
    onTouchStart: (e) => {
      ignoreRef.current = Boolean(e.target.closest?.('.gm-style'));
      if (!ignoreRef.current) touchHandlers.onTouchStart(e);
    },
    onTouchMove: (e) => {
      if (!ignoreRef.current) touchHandlers.onTouchMove(e);
    },
    onTouchEnd: (e) => {
      if (!ignoreRef.current) touchHandlers.onTouchEnd(e);
      ignoreRef.current = false;
    },
  };

  return (
    <div ref={containerRef} className="pb-16 md:pb-0" {...guardedHandlers}>
      <PullToRefreshIndicator pullDistance={pullDistance} isRefreshing={isRefreshing} />
      <TransitPlanner refreshSignal={refreshSignal} />
      {/* ETS routes, commutes and schedules */}
      <EtsNetworkPanel />
    </div>
  );
}