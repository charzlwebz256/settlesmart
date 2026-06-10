import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addMonths, subMonths, eachDayOfInterval, isSameMonth, isSameDay,
  isToday, parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, CalendarDays, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function DashboardCalendar() {
  const [month, setMonth] = useState(new Date());
  const [selected, setSelected] = useState(new Date());

  const { data: savedEvents } = useQuery({
    queryKey: ['savedEvents'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.SavedEvent.filter({ created_by: user.email });
    },
    initialData: [],
  });

  const { data: allEvents } = useQuery({
    queryKey: ['allEvents'],
    queryFn: () => base44.entities.Event.list('date', 200),
    initialData: [],
  });

  const { data: checklist } = useQuery({
    queryKey: ['myChecklist'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.ChecklistItem.filter({ created_by: user.email });
    },
    initialData: [],
  });

  // Build a map: dateString → { events, tasks }
  const dayData = {};

  savedEvents.forEach(se => {
    const ev = allEvents.find(e => e.id === se.event_id);
    if (!ev?.date) return;
    const key = ev.date; // YYYY-MM-DD
    if (!dayData[key]) dayData[key] = { events: [], tasks: [] };
    dayData[key].events.push(ev);
  });

  checklist.filter(c => !c.is_completed && c.day_range).forEach(task => {
    // We use day_range as a label. Pin to today as a visual reminder.
    const key = format(new Date(), 'yyyy-MM-dd');
    if (!dayData[key]) dayData[key] = { events: [], tasks: [] };
    dayData[key].tasks.push(task);
  });

  // Calendar grid
  const start = startOfWeek(startOfMonth(month));
  const end = endOfWeek(endOfMonth(month));
  const days = eachDayOfInterval({ start, end });

  // Selected day details
  const selectedKey = format(selected, 'yyyy-MM-dd');
  const selectedData = dayData[selectedKey] || { events: [], tasks: [] };
  const pendingTasks = checklist.filter(c => !c.is_completed);

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading font-bold text-lg flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary" />
          My Calendar
        </h2>
        <Link to="/events" className="text-xs text-primary font-semibold flex items-center gap-1 hover:opacity-70 transition-opacity">
          All Events <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setMonth(m => subMonths(m, 1))}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold">{format(month, 'MMMM yyyy')}</span>
        <button
          onClick={() => setMonth(m => addMonths(m, 1))}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day of week headers */}
      <div className="grid grid-cols-7 mb-1">
        {DOW.map(d => (
          <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground py-1">{d}</div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map(day => {
          const key = format(day, 'yyyy-MM-dd');
          const data = dayData[key];
          const hasEvent = data?.events?.length > 0;
          const hasTask = data?.tasks?.length > 0;
          const isSelected = isSameDay(day, selected);
          const isCurrentMonth = isSameMonth(day, month);
          const todayDay = isToday(day);

          return (
            <button
              key={key}
              onClick={() => setSelected(day)}
              className={cn(
                "relative flex flex-col items-center justify-start pt-1 pb-1.5 rounded-lg text-xs font-medium transition-all min-h-[40px]",
                !isCurrentMonth && "opacity-30",
                isSelected && "bg-primary text-primary-foreground",
                !isSelected && todayDay && "ring-2 ring-primary ring-offset-1",
                !isSelected && !todayDay && "hover:bg-muted"
              )}
            >
              <span>{format(day, 'd')}</span>
              {(hasEvent || hasTask) && (
                <div className="flex gap-0.5 mt-0.5">
                  {hasEvent && (
                    <span className={cn("w-1.5 h-1.5 rounded-full", isSelected ? "bg-primary-foreground" : "bg-violet-500")} />
                  )}
                  {hasTask && (
                    <span className={cn("w-1.5 h-1.5 rounded-full", isSelected ? "bg-primary-foreground/70" : "bg-amber-500")} />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-violet-500" />
          <span className="text-[10px] text-muted-foreground">Event</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-[10px] text-muted-foreground">Checklist</span>
        </div>
      </div>

      {/* Selected day detail */}
      <div className="mt-4 border-t border-border/40 pt-4 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {isToday(selected) ? 'Today' : format(selected, 'EEE, MMM d')}
        </p>

        {selectedData.events.length === 0 && selectedData.tasks.length === 0 ? (
          <p className="text-xs text-muted-foreground py-2">Nothing scheduled.</p>
        ) : null}

        {selectedData.events.map(ev => (
          <Link key={ev.id} to="/events" className="flex items-start gap-2.5 p-2.5 rounded-xl bg-violet-50 dark:bg-violet-500/10 hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-colors">
            <CalendarDays className="w-3.5 h-3.5 text-violet-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-violet-700 dark:text-violet-400 truncate">{ev.title}</p>
              {ev.time && <p className="text-[10px] text-muted-foreground">{ev.time}{ev.location ? ` · ${ev.location}` : ''}</p>}
            </div>
          </Link>
        ))}

        {isToday(selected) && pendingTasks.slice(0, 2).map(task => (
          <Link key={task.id} to="/checklist" className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 truncate">{task.title}</p>
              {task.day_range && <p className="text-[10px] text-muted-foreground capitalize">{task.day_range.replace(/_/g, ' ')}</p>}
            </div>
          </Link>
        ))}

        {isToday(selected) && pendingTasks.length > 2 && (
          <Link to="/checklist" className="text-xs text-primary font-semibold hover:opacity-70 transition-opacity">
            +{pendingTasks.length - 2} more checklist items →
          </Link>
        )}
      </div>
    </div>
  );
}