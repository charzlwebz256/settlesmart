import { Loader2, ArrowDown } from 'lucide-react';

export default function PullToRefreshIndicator({ pullDistance, isRefreshing, threshold = 72 }) {
  const progress = Math.min(pullDistance / threshold, 1);
  const show = pullDistance > 4 || isRefreshing;
  if (!show) return null;

  return (
    <div
      className="flex items-center justify-center overflow-hidden transition-all duration-150"
      style={{ height: isRefreshing ? threshold : pullDistance }}
    >
      <div className="flex flex-col items-center gap-1">
        {isRefreshing ? (
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        ) : (
          <ArrowDown
            className="w-5 h-5 text-primary transition-transform"
            style={{ transform: `rotate(${progress * 180}deg)`, opacity: progress }}
          />
        )}
        <span className="text-[10px] text-muted-foreground">
          {isRefreshing ? 'Refreshing...' : progress >= 1 ? 'Release to refresh' : 'Pull to refresh'}
        </span>
      </div>
    </div>
  );
}