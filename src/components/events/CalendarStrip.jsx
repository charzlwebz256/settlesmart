import { format, addDays, startOfDay, isSameDay, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function CalendarStrip({ selectedDate, onSelectDate, eventDates = [] }) {
  const [weekStart, setWeekStart] = useState(startOfDay(new Date()));

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const hasEvent = (date) =>
    eventDates.some(d => {
      try { return isSameDay(parseISO(d), date); } catch { return false; }
    });

  return (
    <div className="flex items-center gap-2">
      <button onClick={() => setWeekStart(d => addDays(d, -7))} className="p-1.5 rounded-lg hover:bg-muted transition-colors flex-shrink-0">
        <ChevronLeft className="w-4 h-4 text-muted-foreground" />
      </button>
      <div className="flex gap-1 flex-1 overflow-x-auto scrollbar-hide">
        {days.map(day => {
          const active = isSameDay(day, selectedDate);
          const dot = hasEvent(day);
          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl min-w-[44px] transition-all",
                active ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
              )}
            >
              <span className="text-[9px] font-medium uppercase">{format(day, 'EEE')}</span>
              <span className={cn("text-sm font-bold", active && "text-primary-foreground")}>{format(day, 'd')}</span>
              <div className={cn("w-1.5 h-1.5 rounded-full", dot ? (active ? "bg-white/80" : "bg-primary") : "bg-transparent")} />
            </button>
          );
        })}
      </div>
      <button onClick={() => setWeekStart(d => addDays(d, 7))} className="p-1.5 rounded-lg hover:bg-muted transition-colors flex-shrink-0">
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </button>
    </div>
  );
}