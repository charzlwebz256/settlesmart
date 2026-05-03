import { Bell, BellOff, Calendar, X } from 'lucide-react';
import { format, parseISO, differenceInDays, isTomorrow, isToday } from 'date-fns';
import { cn } from '@/lib/utils';

function getDayLabel(dateStr) {
  try {
    const d = parseISO(dateStr);
    if (isToday(d)) return { label: 'Today', color: 'text-rose-600 bg-rose-500/10' };
    if (isTomorrow(d)) return { label: 'Tomorrow', color: 'text-amber-600 bg-amber-500/10' };
    const diff = differenceInDays(d, new Date());
    if (diff <= 7) return { label: `In ${diff} days`, color: 'text-primary bg-primary/10' };
    return { label: format(d, 'MMM d'), color: 'text-muted-foreground bg-muted' };
  } catch {
    return { label: dateStr, color: 'text-muted-foreground bg-muted' };
  }
}

export default function UpcomingReminders({ savedEvents, allEvents, onToggleNotify, onRemove }) {
  const upcoming = savedEvents
    .map(se => ({ saved: se, event: allEvents.find(e => e.id === se.event_id) }))
    .filter(({ event }) => event)
    .sort((a, b) => a.event.date?.localeCompare(b.event.date));

  if (upcoming.length === 0) return null;

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Bell className="w-4 h-4 text-primary" />
        <h3 className="font-heading font-bold text-sm">Saved Events & Reminders</h3>
        <span className="ml-auto text-xs text-muted-foreground">{upcoming.length} saved</span>
      </div>
      <div className="space-y-2">
        {upcoming.slice(0, 5).map(({ saved, event }) => {
          const { label, color } = getDayLabel(event.date);
          return (
            <div key={saved.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/50">
              <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0", color)}>{label}</span>
              <p className="text-xs font-medium flex-1 truncate">{event.title}</p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onToggleNotify(saved)}
                  className="p-1 rounded-lg hover:bg-muted transition-colors"
                  title={saved.notify ? 'Disable reminder' : 'Enable reminder'}
                >
                  {saved.notify
                    ? <Bell className="w-3.5 h-3.5 text-primary" />
                    : <BellOff className="w-3.5 h-3.5 text-muted-foreground" />}
                </button>
                <button onClick={() => onRemove(saved)} className="p-1 rounded-lg hover:bg-muted transition-colors">
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}