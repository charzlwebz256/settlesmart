import { Bike, Bus, Car, Clock, Footprints, Play, Train } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatMinutes } from '@/lib/duration';

const RIDE_KINDS = ['walk', 'bike', 'driving'];

const KIND_ICON = { bus: Bus, train: Train, tram: Train, ferry: Bus, walk: Footprints, bike: Bike, driving: Car };

function time(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function legsOf(option) {
  if (Array.isArray(option.journey) && option.journey.length) return option.journey;
  return Array.isArray(option.legs) ? option.legs : [];
}

function rideLegs(option) {
  return legsOf(option).filter((leg) => leg.is_transit === true || !RIDE_KINDS.includes(leg.kind));
}

/**
 * Every way to make this trip: pick one, then start it.
 */
export default function RouteOptions({ options, selectedIndex, onSelect, onStart, navigating }) {
  if (!Array.isArray(options) || options.length === 0) return null;

  return (
    <section className="space-y-2 rounded-2xl border border-border/60 bg-card p-3">
      <div className="flex items-baseline justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          {options.length > 1 ? 'Choose your route' : 'Your route'}
        </p>
        {options.length > 1 && (
          <span className="text-[10px] font-medium text-muted-foreground">{options.length} options</span>
        )}
      </div>

      {options.map((option, index) => {
        const active = index === selectedIndex;
        const depart = time(option.depart_at);
        const arrive = time(option.arrive_at);
        const rides = rideLegs(option);

        return (
          <div
            key={index}
            role="button"
            tabIndex={0}
            onClick={() => !navigating && onSelect(index)}
            onKeyDown={(e) => {
              if (navigating) return;
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(index);
              }
            }}
            className={cn(
              'rounded-xl border p-2.5 transition-colors',
              navigating ? 'cursor-default' : 'cursor-pointer',
              active ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/40'
            )}
          >
            <div className="flex items-center gap-2">
              <span className="font-heading text-sm font-bold">{formatMinutes(option.duration_minutes)}</span>
              {index === 0 && (
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary">
                  Best
                </span>
              )}
              {depart && arrive && (
                <span className="text-[11px] font-medium text-muted-foreground">
                  {depart} → {arrive}
                </span>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(index);
                  onStart(index);
                }}
                disabled={navigating}
                className={cn(
                  'ml-auto flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-colors',
                  navigating
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                )}
              >
                <Play className="h-3 w-3" />
                Start
              </button>
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-1">
              {rides.length > 0 ? (
                rides.map((leg, i) => {
                  const Icon = KIND_ICON[leg.kind] || Bus;
                  return (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-bold text-foreground"
                    >
                      <Icon className="h-2.5 w-2.5 text-primary" />
                      {leg.route_name || leg.label || 'Transit'}
                    </span>
                  );
                })
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                  <Footprints className="h-3 w-3 text-green-600" />
                  {option.estimated ? 'Estimated route' : 'Direct route'}
                </span>
              )}
              <span className="ml-auto flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                <Clock className="h-2.5 w-2.5" />
                {option.transfers === 0 || option.transfers === undefined
                  ? 'no transfers'
                  : `${option.transfers} transfer${option.transfers > 1 ? 's' : ''}`}
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
}