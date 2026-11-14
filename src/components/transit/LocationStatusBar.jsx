import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BAND_STYLES, formatAccuracy, formatUpdatedAgo } from '@/lib/geo';

const STATE_LABELS = {
  idle: 'Location off',
  paused: 'Tracking paused',
  locating: 'Getting a fix…',
  tracking: 'GPS active',
  denied: 'Permission blocked',
  timeout: 'GPS timed out',
  unavailable: 'Location unavailable',
  unsupported: 'Not supported',
};

// The rider's real GPS state: reported accuracy, reading quality and freshness.
export default function LocationStatusBar({ band, accuracy, lastFixAt, status, onRefresh }) {
  const meta = BAND_STYLES[band] || BAND_STYLES.unknown;

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">GPS signal</p>
        <button
          onClick={onRefresh}
          className="flex items-center gap-1 rounded-lg border border-border/60 px-2 py-1 text-[11px] font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <RefreshCw className="h-3 w-3 text-primary" />
          Refresh
        </button>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold', meta.chip)}>
          <span className={cn('h-1.5 w-1.5 rounded-full', meta.dot)} />
          {meta.label}
        </span>
        {Number.isFinite(accuracy) && (
          <span className="text-[11px] font-medium text-muted-foreground">±{formatAccuracy(accuracy)} reported</span>
        )}
      </div>

      <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
        {STATE_LABELS[status] || 'Location off'}
        {lastFixAt ? ` · updated ${formatUpdatedAgo(lastFixAt)}` : ''}
      </p>
    </section>
  );
}