import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Bookmark, CalendarDays, CheckCircle2, ArrowRight, Loader2, ListTodo } from 'lucide-react';
import { motion } from 'framer-motion';
import { differenceInDays, parseISO, isAfter } from 'date-fns';

export default function MyProgressSection() {
  const { data: savedResources, isLoading: loadingResources } = useQuery({
    queryKey: ['savedResources'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.SavedResource.filter({ created_by: user.email });
    },
    initialData: [],
  });

  const { data: savedEvents, isLoading: loadingEvents } = useQuery({
    queryKey: ['savedEvents'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.SavedEvent.filter({ created_by: user.email });
    },
    initialData: [],
  });

  const { data: checklist, isLoading: loadingChecklist } = useQuery({
    queryKey: ['checklist'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.ChecklistItem.filter({ created_by: user.email });
    },
    initialData: [],
  });

  // Fetch full event details for saved events
  const { data: allEvents } = useQuery({
    queryKey: ['allEvents'],
    queryFn: () => base44.entities.Event.list('-date', 100),
    initialData: [],
  });

  const isLoading = loadingResources || loadingEvents || loadingChecklist;

  const completedTasks = checklist.filter(c => c.is_completed).length;
  const totalTasks = checklist.length;
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const today = new Date();
  const upcomingEvents = savedEvents
    .map(se => allEvents.find(e => e.id === se.event_id))
    .filter(e => e && e.date && isAfter(parseISO(e.date), today))
    .sort((a, b) => parseISO(a.date) - parseISO(b.date))
    .slice(0, 3);

  const recentSaved = savedResources.slice(0, 3);

  const stats = [
    {
      icon: Bookmark,
      color: 'bg-blue-500/10 text-blue-600',
      value: savedResources.length,
      label: 'Saved Services',
      path: '/services',
    },
    {
      icon: CalendarDays,
      color: 'bg-violet-500/10 text-violet-600',
      value: savedEvents.length,
      label: 'Saved Events',
      path: '/events',
    },
    {
      icon: CheckCircle2,
      color: 'bg-emerald-500/10 text-emerald-600',
      value: `${completedTasks}/${totalTasks}`,
      label: 'Checklist Done',
      path: '/checklist',
    },
  ];

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  // Don't show section if user has no data at all
  if (savedResources.length === 0 && savedEvents.length === 0 && checklist.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 pb-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-heading font-bold text-xl md:text-2xl">My Progress</h2>
          <p className="text-muted-foreground text-xs mt-0.5">Your settlement journey at a glance</p>
        </div>
        <Link to="/checklist" className="flex items-center gap-1 text-xs font-semibold text-primary hover:opacity-70 transition-opacity">
          Full Checklist <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Link to={s.path} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-sm transition-all text-center">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
              </div>
              <div>
                <p className="font-heading font-bold text-lg leading-tight">{s.value}</p>
                <p className="text-[10px] text-muted-foreground font-medium">{s.label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Checklist Progress Bar */}
      {totalTasks > 0 && (
        <div className="bg-card border border-border/50 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ListTodo className="w-4 h-4 text-primary" />
              Settlement Checklist
            </div>
            <span className="text-xs font-bold text-primary">{progressPct}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">{completedTasks} of {totalTasks} tasks completed</p>
        </div>
      )}

      {/* Upcoming saved events */}
      {upcomingEvents.length > 0 && (
        <div className="bg-card border border-border/50 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-violet-600" />
              Upcoming Saved Events
            </p>
            <Link to="/events" className="text-[11px] text-primary font-semibold hover:opacity-70">View all</Link>
          </div>
          <div className="space-y-2">
            {upcomingEvents.map(event => {
              const daysAway = differenceInDays(parseISO(event.date), today);
              return (
                <div key={event.id} className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{event.title}</p>
                    <p className="text-[10px] text-muted-foreground">{event.city} · {event.date}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    daysAway <= 3 ? 'bg-red-500/10 text-red-600' :
                    daysAway <= 7 ? 'bg-amber-500/10 text-amber-600' :
                    'bg-emerald-500/10 text-emerald-600'
                  }`}>
                    {daysAway === 0 ? 'Today' : daysAway === 1 ? 'Tomorrow' : `${daysAway}d`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}