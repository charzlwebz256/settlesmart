import { Footprints, Bus, Train, Ship, Bike, Car, Clock, Route, ArrowRight, Info, Repeat } from 'lucide-react';
import { cn } from '@/lib/utils';

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

export default function RouteSummary({ route }) {
  if (!route) return null;

  const steps = Array.isArray(route.steps) ? route.steps : [];
  const buses = Array.isArray(route.bus_info) ? route.bus_info : [];
  const alternatives = Array.isArray(route.alternatives) ? route.alternatives : [];
  const depart = formatTime(route.depart_at);
  const arrive = formatTime(route.arrive_at);

  return (
    <div className="bg-card rounded-xl border border-border/50 p-3.5 space-y-3">
      {/* Total time, distance — the Google Maps style summary */}
      <div className="flex items-end gap-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-primary" />
          <span className="font-heading font-bold text-xl leading-none">{route.duration_minutes} min</span>
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

      {/* Step by step */}
      {steps.length > 0 && (
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

      {alternatives.length > 0 && (
        <div className="border-t border-border/40 pt-2 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Other options</p>
          {alternatives.map((a, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] text-foreground">
              <Repeat className="w-3 h-3 text-muted-foreground" />
              <span className="font-semibold">{a.duration_minutes} min</span>
              {a.routes.length > 0 && <span className="text-muted-foreground">· {a.routes.join(', ')}</span>}
              <span className="text-muted-foreground ml-auto">
                {a.transfers === 0 ? 'no transfers' : `${a.transfers} transfer${a.transfers > 1 ? 's' : ''}`}
              </span>
            </div>
          ))}
        </div>
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
    </div>
  );
}