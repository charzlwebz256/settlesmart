import { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { isSameDay, parseISO, startOfDay } from 'date-fns';
import { Loader2, CalendarDays, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import CalendarStrip from '@/components/events/CalendarStrip';
import MonthCalendarView from '@/components/events/MonthCalendarView';
import EventCard from '@/components/events/EventCard';
import UpcomingReminders from '@/components/events/UpcomingReminders';
import EventbriteFeed from '@/components/events/EventbriteFeed';
import { useLocation_ } from '@/lib/LocationContext';

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'orientation', label: '🧭 Orientation' },
  { value: 'workshop', label: '🛠 Workshop' },
  { value: 'language', label: '💬 Language' },
  { value: 'employment', label: '💼 Employment' },
  { value: 'community', label: '🤝 Community' },
  { value: 'health', label: '🧠 Health' },
  { value: 'legal', label: '⚖️ Legal' },
  { value: 'housing', label: '🏠 Housing' },
];

export default function Events() {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [category, setCategory] = useState('all');
  const [viewAll, setViewAll] = useState(false);
  const [calView, setCalView] = useState('strip'); // 'strip' | 'month'
  const { city, province, isDetecting: cityLoading } = useLocation_();
  const source = city ? 'gps' : null;

  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.list('date', 200),
    initialData: [],
  });

  const { data: savedEvents } = useQuery({
    queryKey: ['savedEvents'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.SavedEvent.filter({ created_by: user.email });
    },
    initialData: [],
  });

  const savedIds = new Set(savedEvents.map(s => s.event_id));

  const handleSave = async (event) => {
    if (savedIds.has(event.id)) {
      const existing = savedEvents.find(s => s.event_id === event.id);
      if (existing) await base44.entities.SavedEvent.delete(existing.id);
    } else {
      await base44.entities.SavedEvent.create({ event_id: event.id, notify: true });
    }
    queryClient.invalidateQueries({ queryKey: ['savedEvents'] });
  };

  const handleToggleNotify = async (saved) => {
    await base44.entities.SavedEvent.update(saved.id, { notify: !saved.notify });
    queryClient.invalidateQueries({ queryKey: ['savedEvents'] });
  };

  const handleRemove = async (saved) => {
    await base44.entities.SavedEvent.delete(saved.id);
    queryClient.invalidateQueries({ queryKey: ['savedEvents'] });
  };

  const eventDates = events.map(e => e.date).filter(Boolean);

  const filtered = useMemo(() => {
    return events.filter(e => {
      const catMatch = category === 'all' || e.category === category;
      const cityMatch = !city || e.city?.toLowerCase() === city.toLowerCase() || !e.city;
      let dateMatch = true;
      if (!viewAll) {
        try { dateMatch = isSameDay(parseISO(e.date), selectedDate); } catch { dateMatch = false; }
      }
      return catMatch && dateMatch && cityMatch;
    });
  }, [events, category, selectedDate, viewAll, city]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-1 flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-primary" />
          Community Events
        </h1>
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
          {cityLoading ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Detecting your location...</>
          ) : (
            <><MapPin className="w-3.5 h-3.5 text-primary" />
            Showing events near <span className="font-medium text-foreground">{city}{province ? `, ${province}` : ''}</span>
            {source === 'ip' && <span className="text-[10px] text-muted-foreground/70">(via IP)</span>}
            {source === 'fallback' && <span className="text-[10px] text-muted-foreground/70">(default)</span>}
            </>
          )}
        </div>
      </div>

      {/* Reminders panel */}
      {savedEvents.length > 0 && (
        <div className="mb-6">
          <UpcomingReminders
            savedEvents={savedEvents}
            allEvents={events}
            onToggleNotify={handleToggleNotify}
            onRemove={handleRemove}
          />
        </div>
      )}

      {/* Calendar view toggle */}
      <div className="flex gap-1 bg-muted rounded-xl p-1 self-start mb-3 w-fit">
        <button onClick={() => setCalView('strip')}
          className={cn("text-xs px-3 py-1.5 rounded-lg font-semibold transition-all",
            calView === 'strip' ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>
          Week Strip
        </button>
        <button onClick={() => setCalView('month')}
          className={cn("text-xs px-3 py-1.5 rounded-lg font-semibold transition-all",
            calView === 'month' ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>
          Month View
        </button>
      </div>

      {/* Calendar */}
      <div className="mb-4">
        {calView === 'strip' ? (
          <div className="bg-card rounded-2xl border border-border/50 p-4">
            <CalendarStrip
              selectedDate={selectedDate}
              onSelectDate={(d) => { setSelectedDate(d); setViewAll(false); }}
              eventDates={eventDates}
            />
          </div>
        ) : (
          <MonthCalendarView
            events={events}
            selectedDate={selectedDate}
            onSelectDate={(d) => { setSelectedDate(d); setViewAll(false); }}
          />
        )}
      </div>

      {/* View toggle */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setViewAll(false)}
            className={cn("text-xs px-3 py-1.5 rounded-lg font-medium transition-all",
              !viewAll ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}
          >
            Selected Day
          </button>
          <button
            onClick={() => setViewAll(true)}
            className={cn("text-xs px-3 py-1.5 rounded-lg font-medium transition-all",
              viewAll ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}
          >
            All Upcoming
          </button>
        </div>
        <span className="text-xs text-muted-foreground">{filtered.length} event{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={cn(
              "flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
              category === cat.value
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border/50 text-muted-foreground hover:border-primary/30"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Eventbrite Live Feed */}
      <div className="mb-6">
        {!cityLoading && city && <EventbriteFeed city={city} />}
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="font-heading font-bold text-lg mb-2">No events found</h3>
          <p className="text-muted-foreground text-sm">
            {viewAll ? 'Try a different category filter.' : 'No events on this day. Try "All Upcoming" or another date.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <EventCard
                  event={event}
                  saved={savedIds.has(event.id)}
                  onSave={handleSave}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}