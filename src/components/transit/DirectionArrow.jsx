import { ArrowUp, Compass } from 'lucide-react';
import { formatDistance } from '@/lib/geo';

// Google-Maps style direction arrow: keeps aiming at the destination while the
// rider turns, instead of the map chasing them around.
export default function DirectionArrow({ bearing, heading, distance, needsCompass, onEnableCompass }) {
  const aimed = Number.isFinite(bearing);
  // With a compass the arrow is relative to the phone; without one it is a plain map bearing.
  const rotation = aimed ? bearing - (Number.isFinite(heading) ? heading : 0) : 0;

  return (
    <div
      className="pointer-events-none absolute left-3 z-10 flex flex-col items-start gap-2"
      style={{ bottom: 'calc(4.25rem + env(safe-area-inset-bottom))' }}
    >
      {aimed && (
        <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/95 py-1.5 pl-1.5 pr-3 shadow-lg backdrop-blur">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <ArrowUp className="h-5 w-5 transition-transform duration-200" style={{ transform: `rotate(${rotation}deg)` }} />
          </span>
          <span className="text-[11px] font-bold leading-tight text-foreground">
            {formatDistance(distance)}
            <span className="block text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
              to destination
            </span>
          </span>
        </div>
      )}

      {needsCompass && (
        <button
          onClick={onEnableCompass}
          className="pointer-events-auto flex min-h-[38px] items-center gap-1.5 rounded-full border border-primary/40 bg-card/95 px-3 py-2 text-[11px] font-bold text-primary shadow-lg backdrop-blur transition-colors hover:bg-card"
        >
          <Compass className="h-3.5 w-3.5" />
          Turn on compass
        </button>
      )}
    </div>
  );
}