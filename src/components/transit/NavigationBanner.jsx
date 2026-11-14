import { Check, Clock, Navigation, Play, Route as RouteIcon, Volume2, VolumeX, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatMinutes } from '@/lib/duration';
import { formatDistance } from '@/lib/navigation';

const BOTTOM = { bottom: 'calc(4.75rem + env(safe-area-inset-bottom))' };

/**
 * Sits on the map: starts navigation for the chosen route, then steers the rider
 * turn by turn until they arrive.
 */
export default function NavigationBanner({ route, guidance, navigating, arrived, onStart, onEnd, canStart, heading, voiceOn, voiceSupported, onToggleVoice }) {
  if (!navigating && !route) return null;

  const voiceButton = voiceSupported ? (
    <button
      onClick={onToggleVoice}
      aria-label={voiceOn ? 'Turn spoken directions off' : 'Turn spoken directions on'}
      className={cn(
        'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border transition-colors',
        voiceOn
          ? 'border-primary/40 bg-primary/10 text-primary'
          : 'border-border/60 text-muted-foreground hover:bg-muted'
      )}
    >
      {voiceOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
    </button>
  ) : null;

  if (navigating) {
    const rotation = Number.isFinite(guidance?.bearing)
      ? guidance.bearing - (Number.isFinite(heading) ? heading : 0)
      : null;

    return (
      <div
        className="absolute left-1/2 z-20 w-[min(94%,460px)] -translate-x-1/2 rounded-2xl border border-border/60 bg-card/95 p-3 shadow-xl backdrop-blur"
        style={BOTTOM}
      >
        {arrived ? (
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Check className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-heading text-sm font-bold">You have arrived</p>
              <p className="truncate text-[11px] text-muted-foreground">Trip finished, well done</p>
            </div>
            <button
              onClick={onEnd}
              className="rounded-lg bg-primary px-3 py-2 text-[11px] font-bold text-primary-foreground"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Navigation
                  className="h-5 w-5"
                  style={rotation === null ? undefined : { transform: `rotate(${Math.round(rotation)}deg)` }}
                />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-heading text-sm font-bold leading-snug">
                  {guidance?.instruction || 'Follow the route on the map'}
                </p>
                {guidance?.detail && (
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{guidance.detail}</p>
                )}
              </div>
              {voiceButton}
              <button
                onClick={onEnd}
                aria-label="End navigation"
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-border/60 text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 flex items-center gap-3 border-t border-border/40 pt-2 text-[11px] font-semibold text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatMinutes(guidance?.remainingMinutes ?? route?.duration_minutes)}
              </span>
              <span className="flex items-center gap-1">
                <RouteIcon className="h-3 w-3" />
                {formatDistance(guidance?.remainingM ?? (route?.distance_km ? route.distance_km * 1000 : 0))} left
              </span>
              {guidance?.offRoute && (
                <span className="ml-auto rounded bg-amber-500/15 px-1.5 py-0.5 text-amber-700 dark:text-amber-400">
                  Off route · {formatDistance(guidance.offRouteM)}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div
      className="absolute left-1/2 z-20 w-[min(94%,420px)] -translate-x-1/2 rounded-2xl border border-border/60 bg-card/95 p-2.5 shadow-xl backdrop-blur"
      style={BOTTOM}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-heading text-sm font-bold">
            {formatMinutes(route.duration_minutes)}
            {route.distance_km ? <span className="text-muted-foreground"> · {route.distance_km} km</span> : null}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            {canStart ? 'Start to follow the route live' : 'Turn on location to navigate'}
          </p>
        </div>
        {voiceButton}
        <button
          onClick={onStart}
          disabled={!canStart}
          className={cn(
            'flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold transition-transform active:scale-95',
            canStart ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          )}
        >
          <Play className="h-4 w-4" />
          Start
        </button>
      </div>
    </div>
  );
}