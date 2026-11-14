import { Bus, Footprints, Loader2, MapPin } from 'lucide-react';
import { distanceMeters, formatDistance } from '@/lib/geo';

// The stops closest to one point (the rider or the destination), closest first,
// each with the routes that actually serve it.
export default function NearbyTransitPanel({
  stops,
  loading,
  error,
  center,
  onWalkTo,
  title = 'Nearest bus stops',
  limit = 6,
  idleText = 'Allow location access to see the stops closest to you.',
}) {
  const ranked = center
    ? stops
        .filter((stop) => Number.isFinite(stop.lat) && Number.isFinite(stop.lng))
        .map((stop) => ({ ...stop, meters: distanceMeters(center, { lat: stop.lat, lng: stop.lng }) }))
        .sort((a, b) => a.meters - b.meters)
        .slice(0, limit)
    : [];

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-3">
      <div className="flex items-center gap-2">
        <Bus className="h-3.5 w-3.5 text-primary" />
        <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{title}</p>
      </div>

      {!center && idleText && (
        <p className="mt-2 text-[11px] leading-snug text-muted-foreground">{idleText}</p>
      )}

      {center && loading && ranked.length === 0 && (
        <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" /> Finding the closest stops…
        </p>
      )}

      {center && error && <p className="mt-2 text-[11px] text-destructive">{error}</p>}

      {center && !loading && !error && ranked.length === 0 && (
        <p className="mt-2 text-[11px] text-muted-foreground">No mapped stops close by.</p>
      )}

      <div className="mt-2 space-y-1.5">
        {ranked.map((stop, index) => (
          <div key={stop.id} className="rounded-xl bg-muted/40 p-2">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-3 w-3 flex-shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-semibold leading-tight text-foreground">
                  {stop.name}
                  {index === 0 && (
                    <span className="ml-1.5 rounded bg-primary/10 px-1 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary">
                      closest
                    </span>
                  )}
                </p>
                {stop.routes.length > 0 ? (
                  <p className="mt-0.5 flex flex-wrap items-center gap-1 text-[10px] text-muted-foreground">
                    Routes:
                    {stop.routes.map((route) => (
                      <span key={route} className="rounded bg-card px-1 py-0.5 font-bold text-foreground">
                        {route}
                      </span>
                    ))}
                  </p>
                ) : (
                  <p className="text-[10px] text-muted-foreground">Route numbers not published</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold text-foreground">{formatDistance(stop.meters)}</p>
                <p className="text-[9px] uppercase tracking-wide text-muted-foreground">straight line</p>
              </div>
            </div>
            <button
              onClick={() => onWalkTo?.(stop)}
              className="mt-1.5 flex w-full items-center justify-center gap-1 rounded-lg border border-border/60 px-2 py-1 text-[10px] font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <Footprints className="h-3 w-3 text-primary" />
              Walking route
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}