import { Bus, Clock, Footprints } from 'lucide-react';
import { cn } from '@/lib/utils';

function time(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

/**
 * Other buses and later departures that cover the same trip: each option lists
 * the lines to take with the time each one leaves and where it drops you.
 */
export default function AlternativeRoutes({ options }) {
  if (!Array.isArray(options) || options.length === 0) return null;

  return (
    <div className="space-y-2 border-t border-border/40 pt-2">
      <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
        Other buses &amp; departures
      </p>
      {options.map((option, index) => {
        const depart = time(option.depart_at);
        const arrive = time(option.arrive_at);
        const legs = (option.legs || []).filter((leg) => leg.is_transit);
        return (
          <div key={index} className="rounded-lg border border-border/50 bg-muted/30 p-2 space-y-1.5">
            <div className="flex items-center gap-2 text-[11px] flex-wrap">
              <Clock className="w-3 h-3 text-primary" />
              <span className="font-bold text-foreground">{option.duration_minutes} min</span>
              {depart && arrive && (
                <span className="font-medium text-muted-foreground">
                  {depart} → {arrive}
                </span>
              )}
              <span className="ml-auto text-muted-foreground">
                {option.transfers === 0 ? 'no transfers' : `${option.transfers} transfer${option.transfers > 1 ? 's' : ''}`}
              </span>
            </div>

            {legs.length > 0 ? (
              <ul className="space-y-1">
                {legs.map((leg, i) => {
                  const leaves = time(leg.depart_at);
                  return (
                    <li key={i} className="flex items-start gap-1.5 text-[11px] leading-snug">
                      <span className="mt-0.5 w-4 h-4 rounded bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        <Bus className="w-2.5 h-2.5" />
                      </span>
                      <span className="flex-1 text-foreground">
                        <span className="font-semibold">{leg.route_name || leg.kind}</span>
                        {leg.headsign && <span className="text-muted-foreground"> toward {leg.headsign}</span>}
                        <span className="text-muted-foreground">
                          {' '}
                          · {leaves ? `leaves ${leaves}` : `${leg.minutes} min`} from {leg.from_name}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="flex items-center gap-1.5 text-[11px] text-foreground">
                <Footprints className="w-3 h-3 text-green-600" />
                {option.routes?.join(', ') || 'Walking route'}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}