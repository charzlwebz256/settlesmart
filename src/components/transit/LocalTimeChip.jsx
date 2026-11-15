import { Clock } from 'lucide-react';
import { useSyncedNow } from '@/lib/internetTime';

// Short zone name for the rider's own timezone, e.g. "MST".
function zoneName(date) {
  const parts = new Intl.DateTimeFormat([], { timeZoneName: 'short' }).formatToParts(date);
  return parts.find((part) => part.type === 'timeZoneName')?.value || '';
}

/**
 * The rider's local time, ticking live. Everything on the map is scheduled in the
 * device's own timezone, so this is the clock those departure times are in.
 */
export default function LocalTimeChip() {
  const now = useSyncedNow();

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
      <Clock className="h-3 w-3 text-primary" />
      {now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
      {zoneName(now) && <span className="font-normal">· {zoneName(now)}</span>}
    </span>
  );
}