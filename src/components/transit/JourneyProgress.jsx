import { Bus, Check, Flag, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatMinutes } from '@/lib/duration';
import { formatDistance } from '@/lib/navigation';

/**
 * Sits on the map while travelling: how far along the journey the rider has got,
 * with their live position marked on the line between start and destination.
 */
export default function JourneyProgress({ navigating, arrived, guidance, route }) {
  if (!navigating) return null;

  const legs = Array.isArray(route?.journey) ? route.journey : [];
  const fromName = legs[0]?.from_name || 'Start';
  const toName = legs[legs.length - 1]?.to_name || 'Destination';
  const percent = arrived ? 100 : Math.max(0, Math.min(100, guidance?.progress ?? 0));
  const remainingM = guidance?.remainingM ?? (route?.distance_km ? route.distance_km * 1000 : 0);

  return (
    <div className="pointer-events-none absolute left-1/2 top-3 z-20 w-[min(94%,430px)] -translate-x-1/2 rounded-2xl border border-border/60 bg-card/95 p-3 shadow-xl backdrop-blur">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          {arrived ? <Check className="h-3.5 w-3.5 text-primary" /> : <Bus className="h-3.5 w-3.5 text-primary" />}
          {arrived ? 'Journey complete' : 'Journey progress'}
        </p>
        <p className="font-heading text-sm font-bold text-primary">{percent}%</p>
      </div>

      <div className="relative mt-2.5 h-2 rounded-full bg-muted">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
        <span
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card bg-primary shadow transition-all duration-500"
          style={{ left: `${percent}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 text-[10px] font-semibold text-muted-foreground">
        <span className="flex min-w-0 items-center gap-1">
          <MapPin className="h-3 w-3 flex-shrink-0 text-primary" />
          <span className="truncate">{fromName}</span>
        </span>
        <span className="flex min-w-0 items-center justify-end gap-1">
          <span className="truncate">{toName}</span>
          <Flag className="h-3 w-3 flex-shrink-0 text-destructive" />
        </span>
      </div>

      <p className={cn('mt-1 text-center text-[10px] font-semibold', arrived ? 'text-primary' : 'text-muted-foreground')}>
        {arrived
          ? 'You have reached your destination'
          : `${formatDistance(remainingM)} left · ${formatMinutes(guidance?.remainingMinutes ?? route?.duration_minutes)} remaining`}
      </p>
    </div>
  );
}