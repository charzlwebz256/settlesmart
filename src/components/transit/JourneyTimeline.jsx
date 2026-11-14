import { useState } from 'react';
import { Bike, Bus, Car, ChevronDown, Footprints, Ship, Train } from 'lucide-react';
import { cn } from '@/lib/utils';

const KIND_META = {
  walk: { icon: Footprints },
  bike: { icon: Bike },
  bus: { icon: Bus },
  train: { icon: Train },
  tram: { icon: Train },
  ferry: { icon: Ship },
  driving: { icon: Car },
};

const transitTime = (iso) => {
  if (!iso) return '';
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

const distanceText = (meters) => {
  if (!Number.isFinite(meters) || meters <= 0) return '';
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters)} m`;
};

const isTransitLeg = (leg) => !['walk', 'bike', 'driving'].includes(leg.kind);

// The whole journey, leg by leg: every board, transfer and arrival.
export default function JourneyTimeline({ legs, startLabel, endLabel }) {
  const [expanded, setExpanded] = useState({});

  if (!Array.isArray(legs) || legs.length === 0) return null;

  const nameFor = (name) => {
    if (name === 'your start') return startLabel || 'Your location';
    if (name === 'your destination') return endLabel || 'Destination';
    return name;
  };

  return (
    <ol className="space-y-0">
      {legs.map((leg, index) => {
        const meta = KIND_META[leg.kind] || KIND_META.bus;
        const Icon = meta.icon;
        const transit = isTransitLeg(leg);
        const open = Boolean(expanded[index]);
        const distance = distanceText(leg.distance_m);

        return (
          <li key={index} className="flex gap-2.5">
            {/* Timeline rail: solid for riding, dashed for walking */}
            <div className="flex w-3 flex-col items-center">
              <span className="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full border-2 border-primary bg-card" />
              <span
                className={cn(
                  'my-0.5 w-0 flex-1',
                  transit ? 'border-l-2 border-primary' : 'border-l-2 border-dashed border-muted-foreground/50'
                )}
              />
            </div>

            <div className="min-w-0 flex-1 pb-3">
              <p className="text-[11px] font-bold text-foreground">
                {transitTime(leg.start_at) || 'Now'}
                <span className="font-medium text-muted-foreground"> · {nameFor(leg.from_name)}</span>
              </p>

              <div className="mt-1 rounded-xl border border-border/60 bg-muted/20 p-2">
                {transit ? (
                  <>
                    <div className="flex items-center gap-1.5">
                      {leg.route_name ? (
                        <span
                          className="rounded-md px-1.5 py-0.5 text-[11px] font-bold text-white"
                          style={{ backgroundColor: leg.color || '#1a73e8' }}
                        >
                          {leg.route_name}
                        </span>
                      ) : (
                        <span className="rounded-md bg-primary px-1.5 py-0.5 text-[11px] font-bold text-primary-foreground">
                          {leg.label}
                        </span>
                      )}
                      <Icon className="h-3.5 w-3.5 text-foreground" />
                      <span className="truncate text-[11px] font-semibold text-foreground">
                        {leg.headsign ? `toward ${leg.headsign}` : leg.long_name || leg.label}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {leg.duration_minutes} min
                      {leg.stops_count ? ` · ${leg.stops_count} stops` : ''}
                      {distance ? ` · ${distance}` : ''}
                      {leg.agency ? ` · ${leg.agency}` : ''}
                    </p>
                    <div className="mt-1.5 space-y-0.5 border-t border-border/40 pt-1.5 text-[11px]">
                      <p className="text-foreground">
                        <span className="font-semibold">Board</span> {nameFor(leg.from_name)}
                      </p>
                      <p className="text-foreground">
                        <span className="font-semibold">Get off</span> {nameFor(leg.to_name)}
                      </p>
                    </div>
                    {leg.intermediate_stops?.length > 0 && (
                      <>
                        <button
                          onClick={() => setExpanded((prev) => ({ ...prev, [index]: !open }))}
                          className="mt-1.5 flex w-full items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-primary"
                        >
                          {leg.intermediate_stops.length} stops on the way
                          <ChevronDown className={cn('h-3 w-3 transition-transform', open && 'rotate-180')} />
                        </button>
                        {open && (
                          <ul className="mt-1 space-y-0.5 text-[11px] text-muted-foreground">
                            {leg.intermediate_stops.map((stop, stopIndex) => (
                              <li key={stopIndex} className="flex items-start gap-1.5">
                                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground/60" />
                                {stop.name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5">
                      <Icon className="h-3.5 w-3.5 text-foreground" />
                      <span className="text-[11px] font-semibold text-foreground">{leg.label}</span>
                      <span className="text-[11px] text-muted-foreground">
                        {leg.duration_minutes} min{distance ? ` · ${distance}` : ''}
                      </span>
                      <button
                        onClick={() => setExpanded((prev) => ({ ...prev, [index]: !open }))}
                        aria-label="Toggle walking details"
                        className="ml-auto rounded-md p-0.5 hover:bg-muted"
                      >
                        <ChevronDown className={cn('h-3.5 w-3.5 text-muted-foreground transition-transform', open && 'rotate-180')} />
                      </button>
                    </div>
                    {open && (
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        From {nameFor(leg.from_name)} to {nameFor(leg.to_name)}
                        {distance ? ` · about ${distance}` : ''}
                      </p>
                    )}
                  </>
                )}
              </div>

              {index === legs.length - 1 && (
                <p className="mt-1.5 text-[11px] font-bold text-foreground">
                  {transitTime(leg.end_at) || 'Arrive'}
                  <span className="font-medium text-muted-foreground"> · {nameFor(leg.to_name)}</span>
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}