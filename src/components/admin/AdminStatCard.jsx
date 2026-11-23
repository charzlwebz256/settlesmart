import { useState } from 'react';
import { ArrowUpRight, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

// Expandable metric card: a label chip, the number, a progress bar and a trend.
export default function AdminStatCard({ label, value, unit, progress = 0, goalText, trend, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const pct = Math.max(0, Math.min(100, Math.round(progress || 0)));

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 p-4 text-left"
      >
        <span className="rounded-full bg-primary/10 px-3 py-1 text-[13px] font-semibold text-primary">{label}</span>
        <span
          className={cn(
            'ml-auto flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-border/60 bg-background text-foreground transition-transform duration-300',
            open && 'rotate-[135deg]'
          )}
        >
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </button>

      <div
        className={cn(
          'grid transition-all duration-500 ease-out',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4">
            <p className="font-heading text-3xl font-light leading-none tracking-tight text-foreground tabular-nums">
              {value}
              {unit && <span className="ml-1.5 text-sm font-normal tracking-normal text-muted-foreground">{unit}</span>}
            </p>

            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-1000 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">{goalText}</span>
              {trend && (
                <span className="ml-auto inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-border/60 px-2 py-0.5 text-[11px] font-semibold">
                  {trend.direction === 'down' ? (
                    <TrendingDown className="h-3 w-3 text-destructive" />
                  ) : (
                    <TrendingUp className="h-3 w-3 text-primary" />
                  )}
                  <span className={trend.direction === 'down' ? 'text-destructive' : 'text-primary'}>{trend.value}</span>
                  <span className="font-normal text-muted-foreground">{trend.period}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}