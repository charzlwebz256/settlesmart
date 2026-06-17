import { useState } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameDay, isSameMonth, parseISO, format, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isHoliday, getHolidayFlag, getHolidayBadgeColor } from '@/lib/holidays';

const CATEGORY_COLORS = {
  orientation: 'bg-blue-500',
  workshop: 'bg-orange-500',
  language: 'bg-teal-500',
  employment: 'bg-violet-500',
  community: 'bg-pink-500',
  health: 'bg-rose-500',
  legal: 'bg-amber-500',
  housing: 'bg-emerald-500',
};

export default function MonthCalendarView({ events, selectedDate, onSelectDate }) {
  const [viewMonth, setViewMonth] = useState(selectedDate || new Date());

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const eventsByDay = {};
  events.forEach(e => {
    if (!e.date) return;
    try {
      const d = format(parseISO(e.date), 'yyyy-MM-dd');
      if (!eventsByDay[d]) eventsByDay[d] = [];
      eventsByDay[d].push(e);
    } catch {}
  });

  return (
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
      {/* Month nav */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/40">
        <button onClick={() => setViewMonth(m => subMonths(m, 1))}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-heading font-bold text-sm">{format(viewMonth, 'MMMM yyyy')}</span>
        <button onClick={() => setViewMonth(m => addMonths(m, 1))}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-border/30">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-muted-foreground py-2">{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {days.map((day, i) => {
          const key = format(day, 'yyyy-MM-dd');
          const dayEvents = eventsByDay[key] || [];
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());
          const inMonth = isSameMonth(day, viewMonth);

          const holiday = isHoliday(day, 'Both');
          return (
            <button
              key={i}
              onClick={() => onSelectDate(day)}
              className={cn(
                "min-h-[56px] p-1.5 text-left border-b border-r border-border/20 transition-colors hover:bg-muted/50 flex flex-col gap-0.5 relative",
                !inMonth && "opacity-35",
                isSelected && "bg-primary/10",
                holiday && !isSelected && "ring-1 ring-amber-500/30"
              )}
            >
              <div className="flex items-center gap-0.5">
                <span className={cn(
                  "text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full",
                  isSelected ? "bg-primary text-primary-foreground" : isToday ? "bg-accent text-accent-foreground" : "text-foreground"
                )}>
                  {format(day, 'd')}
                </span>
                {holiday && (
                  <span className="text-[10px]">{getHolidayFlag(holiday.country)}</span>
                )}
              </div>
              {holiday && (
                <span className="text-[8px] font-medium text-amber-600 dark:text-amber-400 truncate">
                  {holiday.name}
                </span>
              )}
              <div className="flex flex-col gap-0.5 w-full overflow-hidden">
                {dayEvents.slice(0, 2).map((e, j) => (
                  <div key={j} className={cn(
                    "text-[9px] font-semibold text-white rounded px-1 truncate leading-4",
                    CATEGORY_COLORS[e.category] || 'bg-primary'
                  )}>
                    {e.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <span className="text-[9px] text-muted-foreground font-medium">+{dayEvents.length - 2} more</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}