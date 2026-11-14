import { Crosshair, Loader2, LocateFixed } from 'lucide-react';
import { cn } from '@/lib/utils';

// Shows the address the GPS resolved, and lets the rider refresh it.
export default function MyLocationCard({ address, accuracy, locating, resolving, error, hasPosition, onLocate }) {
  return (
    <section className="rounded-2xl border border-border/60 bg-card p-3">
      <div className="flex items-start gap-2">
        <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
          <LocateFixed className="w-3.5 h-3.5" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">My location</p>
          <p className="text-[13px] font-semibold text-foreground leading-snug break-words">
            {locating
              ? 'Finding you with GPS…'
              : resolving
                ? 'Finding your address…'
                : address || (hasPosition ? 'Location found' : 'Location not set yet')}
          </p>
        </div>
        <button
          onClick={onLocate}
          disabled={locating}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-border/60 text-[11px] font-semibold text-foreground hover:bg-muted transition-colors disabled:opacity-50 flex-shrink-0"
        >
          {locating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Crosshair className="w-3 h-3 text-primary" />}
          {hasPosition ? 'Update' : 'Enable'}
        </button>
      </div>

      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <span className={cn('inline-flex items-center gap-1', hasPosition && 'text-green-600 font-semibold')}>
          <span className={cn('w-1.5 h-1.5 rounded-full', hasPosition ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground/40')} />
          {hasPosition ? (accuracy ? `GPS active · ±${accuracy} m` : 'GPS active') : 'GPS off'}
        </span>
        {hasPosition && <span className="truncate">· used as your starting point</span>}
      </div>

      {error && <p className="mt-2 text-[11px] text-destructive leading-snug">{error}</p>}
    </section>
  );
}