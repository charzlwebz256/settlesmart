import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Bookmark, CalendarDays, CheckCircle2, ArrowRight, Loader2, ListTodo, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { differenceInDays, parseISO, isAfter, format } from 'date-fns';
import {
  RadialBarChart, RadialBar, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const CATEGORY_COLORS = {
  documents: '#6366f1',
  housing: '#10b981',
  banking: '#f59e0b',
  health: '#ef4444',
  education: '#3b82f6',
  employment: '#8b5cf6',
  transportation: '#14b8a6',
  social: '#ec4899',
  legal: '#f97316',
};

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
    .slice(0, 5);

  // Checklist breakdown by category for bar chart
  const categoryBreakdown = Object.entries(
    checklist.reduce((acc, item) => {
      const cat = item.category || 'other';
      if (!acc[cat]) acc[cat] = { total: 0, done: 0 };
      acc[cat].total++;
      if (item.is_completed) acc[cat].done++;
      return acc;
    }, {})
  )
    .map(([cat, { total, done }]) => ({
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      cat,
      done,
      remaining: total - done,
    }))
    .sort((a, b) => b.done + b.remaining - (a.done + a.remaining));

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

  if (savedResources.length === 0 && savedEvents.length === 0 && checklist.length === 0) {
    return null;
  }

  const radialData = [{ value: progressPct, fill: 'hsl(var(--primary))' }];

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
                <s.icon className="w-[18px] h-[18px]" />
              </div>
              <div>
                <p className="font-heading font-bold text-lg leading-tight">{s.value}</p>
                <p className="text-[10px] text-muted-foreground font-medium">{s.label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      {totalTasks > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

          {/* Radial progress ring */}
          <div className="bg-card border border-border/50 rounded-2xl p-5 flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 text-sm font-semibold mb-2 self-start">
              <ListTodo className="w-4 h-4 text-primary" />
              Checklist Progress
            </div>
            <div className="relative w-40 h-40">
              <RadialBarChart
                width={160}
                height={160}
                cx={80}
                cy={80}
                innerRadius={52}
                outerRadius={72}
                startAngle={90}
                endAngle={-270}
                data={radialData}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar
                  background={{ fill: 'hsl(var(--muted))' }}
                  dataKey="value"
                  cornerRadius={8}
                  angleAxisId={0}
                />
              </RadialBarChart>
              {/* Centre label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-heading font-bold text-2xl text-foreground">{progressPct}%</span>
                <span className="text-[10px] text-muted-foreground">complete</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{completedTasks} of {totalTasks} tasks done</p>
          </div>

          {/* Category breakdown bar chart */}
          {categoryBreakdown.length > 0 && (
            <div className="bg-card border border-border/50 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                <TrendingUp className="w-4 h-4 text-primary" />
                By Category
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={categoryBreakdown} layout="vertical" margin={{ left: -10, right: 8, top: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    width={80}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid hsl(var(--border))' }}
                    formatter={(v, name) => [v, name === 'done' ? 'Done' : 'Remaining']}
                  />
                  <Bar dataKey="done" stackId="a" radius={[0, 0, 0, 0]}>
                    {categoryBreakdown.map(entry => (
                      <Cell key={entry.cat} fill={CATEGORY_COLORS[entry.cat] || '#6366f1'} />
                    ))}
                  </Bar>
                  <Bar dataKey="remaining" stackId="a" radius={[0, 4, 4, 0]} fill="hsl(var(--muted))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Upcoming saved events timeline */}
      {upcomingEvents.length > 0 && (
        <div className="bg-card border border-border/50 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-violet-600" />
              Upcoming Saved Events
            </p>
            <Link to="/events" className="text-[11px] text-primary font-semibold hover:opacity-70">View all</Link>
          </div>

          {/* Visual timeline bars */}
          <div className="space-y-2.5">
            {upcomingEvents.map(event => {
              const daysAway = differenceInDays(parseISO(event.date), today);
              const maxDays = Math.max(...upcomingEvents.map(e => differenceInDays(parseISO(e.date), today)), 1);
              const barWidth = Math.max(8, Math.round(((maxDays - daysAway) / maxDays) * 100));
              const urgencyColor = daysAway <= 3 ? 'bg-red-500' : daysAway <= 7 ? 'bg-amber-500' : 'bg-violet-500';
              const textColor = daysAway <= 3 ? 'text-red-600' : daysAway <= 7 ? 'text-amber-600' : 'text-violet-600';

              return (
                <div key={event.id}>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-xs font-semibold truncate flex-1">{event.title}</p>
                    <span className={`text-[10px] font-bold flex-shrink-0 ${textColor}`}>
                      {daysAway === 0 ? 'Today' : daysAway === 1 ? 'Tomorrow' : `in ${daysAway}d`}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${urgencyColor}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {format(parseISO(event.date), 'EEE, MMM d')}{event.city ? ` · ${event.city}` : ''}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}