import { useEffect, useState } from 'react';
import { Footprints, Bus, Train, Ship, Bike, Car, Clock, Route, ArrowRight, Info, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ETS_LINKS } from '@/data/etsTransit';
import JourneyTimeline from './JourneyTimeline';
import { formatMinutes } from '@/lib/duration';

const MODE_META = {
  walk: { icon: Footprints, tint: 'text-green-600 bg-green-500/10' },
  bus: { icon: Bus, tint: 'text-orange-600 bg-orange-500/10' },
  train: { icon: Train, tint: 'text-blue-600 bg-blue-500/10' },
  tram: { icon: Train, tint: 'text-purple-600 bg-purple-500/10' },
  ferry: { icon: Ship, tint: 'text-cyan-600 bg-cyan-500/10' },
  bike: { icon: Bike, tint: 'text-purple-600 bg-purple-500/10' },
  cycling: { icon: Bike, tint: 'text-purple-600 bg-purple-500/10' },
  driving: { icon: Car, tint: 'text-blue-600 bg-blue-500/10' },
};

const ROUTE_TINT = {
  bus: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
  train: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  tram: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  ferry: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400',
};

function formatDistance(meters) {
  if (!meters) return null;
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters)} m`;
}

function formatTime(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function RouteSummary({ route, startLabel, endLabel }) {
  // Keeps the departure countdown honest as the rider stands at the stop.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 20000);
    return () => clearInterval(id);
  }, []);

  if (!route) return null;

  const steps = Array.isArray(route.steps) ? route.steps : [];
  const journey = Array.isArray(route.journey) ? route.journey : [];
  const buses = Array.isArray(route.bus_info) ? route.bus_info : [];
  const depart = formatTime(route.depart_at);
  const arrive = formatTime(route.arrive_at);
  const leaveIn = route.depart_at
    ? Math.round((new Date(route.depart_at).getTime() - now) / 60000)
    : null;

  return (
    <div className="bg-card rounded-xl border border-border/50 p-3.5 space-y-3">
      {/* Total time, distance, the Google Maps style summary */}
      <div className="flex items-end gap-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-primary" />
          <span className="font-heading font-bold text-xl leading-none">
            {route.estimated ? '≈ ' : ''}
            {formatMinutes(route.duration_minutes)}
          </span>
          {route.estimated && (
            <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
              estimate
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Route className="w-3.5 h-3.5" />
          <span className="text-sm font-semibold">{route.distance_km} km</span>
        </div>
        {depart && arrive && (
          <span className="text-[11px] font-medium text-muted-foreground ml-auto">
            {depart} → {arrive}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 flex-wrap text-[11px]">
        {leaveIn !== null && (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-bold',
              leaveIn <= 0 ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'
            )}
          >
            <Clock className="w-3 h-3" />
            {leaveIn > 0
              ? `Leaves in ${leaveIn} min`
              : leaveIn > -5
                ? 'Leaving now'
                : 'This departure has passed'}
          </span>
        )}
        <span className="text-muted-foreground">Shown in your local time</span>
      </div>

      {/* Routes to take */}
      {buses.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Take</span>
          {buses.map((b, i) => (
            <span
              key={i}
              className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold',
                ROUTE_TINT[b.kind] || ROUTE_TINT.bus
              )}
            >
              {b.name}
            </span>
          ))}
        </div>
      )}

      {/* The whole journey, leg by leg */}
      {journey.length > 0 && (
        <div className="border-t border-border/40 pt-2.5">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Full journey</p>
          <JourneyTimeline legs={journey} startLabel={startLabel} endLabel={endLabel} />
        </div>
      )}

      {/* Step by step (street routes) */}
      {journey.length === 0 && steps.length > 0 && (
        <ol className="space-y-1.5 border-t border-border/40 pt-2.5">
          {steps.map((s, i) => {
            const meta = MODE_META[s.mode] || MODE_META.walk;
            const Icon = meta.icon;
            const distance = formatDistance(s.distance_m);
            return (
              <li key={i} className="flex items-start gap-2 text-[12px] leading-snug">
                <span className={cn('mt-0.5 w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0', meta.tint)}>
                  <Icon className="w-3 h-3" />
                </span>
                <span className="flex-1 text-foreground">
                  {s.instruction}
                  {distance && <span className="text-muted-foreground"> · {distance}</span>}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      {route.transfer_note && (
        <p className="flex items-start gap-1.5 text-[11px] text-muted-foreground border-t border-border/40 pt-2">
          <ArrowRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
          {route.transfer_note}
        </p>
      )}

      {route.note && (
        <p className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
          <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
          {route.note}
        </p>
      )}

      {/* Live times and published schedules for Edmonton riders */}
      {buses.length > 0 && (
        <div className="flex flex-wrap gap-x-3 gap-y-1 border-t border-border/40 pt-2 text-[11px] font-semibold">
          <a
            href={ETS_LINKS.transitApp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            Live arrivals in the Transit app
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <a
            href={ETS_LINKS.schedules}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            ETS route schedules
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      )}
    </div>
  );
}