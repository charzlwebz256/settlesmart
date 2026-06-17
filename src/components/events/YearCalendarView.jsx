import { useState } from 'react';
import { format, addYears, subYears, startOfYear, endOfYear, eachMonthOfInterval, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameDay, isSameMonth, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isHoliday, getHolidayFlag } from '@/lib/holidays';

const CATEGORY_COLORS = {
  orientation: 'bg-blue-500',
  workshop: 'bg-orange-500',
  language: 'bg-teal-500',
  employment: 'bg-violet-500',
  community: 'bg-pink-500',
  health: 'bg-rose-500',
  legal: 'bg-amber-500',
  housing: 'bg-emerald-500',
  social: 'bg-purple-500',
};

export default function YearCalendarView({ events, selectedDate, onSelectDate }) {
  const [viewYear, setViewYear] = useState(selectedDate?.getFullYear() || new Date().getFullYear());

  const yearStart = new Date(viewYear, 0, 1);
  const yearEnd = new Date(viewYear, 11, 31);
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

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
      {/* Year nav */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/40">
        <button onClick={() => setViewYear(y => subYears(y, 1))}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-heading font-bold text-lg">{viewYear}</span>
        <button onClick={() => setViewYear(y => addYears(y, 1))}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 12 months grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {months.map((month, monthIdx) => {
          const monthStartDay = startOfMonth(month);
          const monthEndDay = endOfMonth(month);
          const calStart = startOfWeek(monthStartDay, { weekStartsOn: 0 });
          const calEnd = endOfWeek(monthEndDay, { weekStartsOn: 0 });
          const days = eachDayOfInterval({ start: calStart, end: calEnd });

          return (
            <div key={monthIdx} className="border border-border/30 rounded-xl p-2">
              <div className="text-center font-bold text-xs mb-2 text-foreground">
                {format(month, 'MMM')}
              </div>
              <div className="grid grid-cols-7 gap-0.5">
                {['S','M','T','W','T','F','S'].map((d, i) => (
                  <div key={i} className="text-[8px] font-bold text-muted-foreground text-center py-0.5">{d}</div>
                ))}
                {days.map((day, i) => {
                  const key = format(day, 'yyyy-MM-dd');
                  const dayEvents = eventsByDay[key] || [];
                  const isToday = isSameDay(day, new Date());
                  const inMonth = isSameMonth(day, month);
                  const holiday = isHoliday(day, 'Both');

                  return (
                    <button
                      key={i}
                      onClick={() => onSelectDate(day)}
                      className={cn(
                        "text-[8px] p-0.5 text-center rounded transition-colors hover:bg-muted/50 relative",
                        !inMonth && "opacity-30",
                        isToday && "bg-accent text-accent-foreground font-bold",
                        holiday && !isToday && "ring-1 ring-amber-500/40"
                      )}
                    >
                      {format(day, 'd')}
                      {dayEvents.length > 0 && (
                        <div className="flex gap-px justify-center mt-0.5">
                          {dayEvents.slice(0, 3).map((e, j) => (
                            <div
                              key={j}
                              className={cn("w-1 h-1 rounded-full", CATEGORY_COLORS[e.category] || 'bg-primary')}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}