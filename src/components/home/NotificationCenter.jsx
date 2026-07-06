import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Bell, X, AlertTriangle, CalendarDays, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { differenceInDays, parseISO, isAfter, isBefore, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import EmailNotificationSetup from './EmailNotificationSetup';

function buildNotifications(savedEvents, allEvents, checklist) {
  const notifications = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Upcoming saved events within 7 days
  savedEvents.forEach(se => {
    const event = allEvents.find(e => e.id === se.event_id);
    if (!event || !event.date) return;
    const eventDate = parseISO(event.date);
    if (!isAfter(eventDate, today)) return;
    const daysAway = differenceInDays(eventDate, today);
    if (daysAway <= 7) {
      const isTomorrow = daysAway === 1;
      notifications.push({
        id: `event-${se.id}`,
        type: 'event',
        icon: CalendarDays,
        color: daysAway === 0 ? 'text-red-600 bg-red-500/10' : isTomorrow ? 'text-orange-500 bg-orange-500/10' : 'text-violet-600 bg-violet-500/10',
        title: `"${event.title}" is ${daysAway === 0 ? 'today!' : isTomorrow ? 'tomorrow — reminder!' : `in ${daysAway} days`}`,
        subtitle: `${event.city ? event.city + ' · ' : ''}${event.date}`,
        path: '/events',
        urgency: daysAway,
        badge: isTomorrow ? '⏰ Tomorrow' : daysAway === 0 ? '🔴 Today' : null,
      });
    }
  });

  // Checklist items due tomorrow (by day_range or link presence)
  const incompleteTasks = checklist.filter(c => !c.is_completed);
  // Show up to 2 pending actionable tasks
  incompleteTasks.filter(c => c.link).slice(0, 2).forEach(task => {
    notifications.push({
      id: `task-${task.id}`,
      type: 'checklist',
      icon: CheckCircle2,
      color: 'text-amber-600 bg-amber-500/10',
      title: `Pending: ${task.title}`,
      subtitle: task.description ? task.description.slice(0, 60) + (task.description.length > 60 ? '…' : '') : 'Action required',
      path: '/checklist',
      urgency: 100,
    });
  });

  // Legal document reminder if legal checklist items pending
  const legalPending = checklist.filter(c => !c.is_completed && c.category === 'legal');
  if (legalPending.length > 0) {
    notifications.push({
      id: 'legal-reminder',
      type: 'legal',
      icon: AlertTriangle,
      color: 'text-purple-600 bg-purple-500/10',
      title: `${legalPending.length} legal task${legalPending.length > 1 ? 's' : ''} still pending`,
      subtitle: 'Documents & legal steps need attention',
      path: '/legal',
      urgency: 50,
    });
  }

  // Sort: most urgent first
  return notifications.sort((a, b) => a.urgency - b.urgency);
}

export default function NotificationCenter() {
  const [dismissed, setDismissed] = useState(new Set());
  const [expanded, setExpanded] = useState(false);

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
    queryFn: () => base44.entities.Event.list('-date', 100),
    initialData: [],
  });

  const { data: checklist } = useQuery({
    queryKey: ['checklist'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.ChecklistItem.filter({ created_by: user.email });
    },
    initialData: [],
  });

  const all = buildNotifications(savedEvents, allEvents, checklist);
  const visible = all.filter(n => !dismissed.has(n.id));

  const shown = expanded ? visible : visible.slice(0, 2);
  const hasMore = visible.length > 2;

  return (
    <section className="max-w-7xl mx-auto px-4 pb-6">
      {/* Email notification opt-in */}
      <EmailNotificationSetup
        savedEvents={savedEvents}
        allEvents={allEvents}
        checklist={checklist}
      />
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell className="w-4.5 h-4.5 w-[18px] h-[18px] text-foreground" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
              {visible.length}
            </span>
          </div>
          <h2 className="font-heading font-bold text-base">Notifications</h2>
        </div>
        {hasMore && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="text-xs text-primary font-semibold hover:opacity-70 transition-opacity flex items-center gap-1"
          >
            {expanded ? 'Show less' : `+${visible.length - 2} more`}
          </button>
        )}
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {shown.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10, height: 0, marginBottom: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 bg-card border border-border/50 rounded-2xl px-4 py-3 hover:border-primary/20 transition-all"
            >
              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0", n.color)}>
                <n.icon className="w-4 h-4" />
              </div>
              <Link to={n.path} className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-semibold leading-snug truncate">{n.title}</p>
                  {n.badge && (
                    <span className="flex-shrink-0 text-xs font-bold px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
                      {n.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{n.subtitle}</p>
              </Link>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Link to={n.path}>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50 hover:text-primary transition-colors" />
                </Link>
                <button
                  onClick={() => setDismissed(prev => new Set([...prev, n.id]))}
                  aria-label="Dismiss notification"
                  className="p-1 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-3 h-3 text-muted-foreground/50 hover:text-foreground" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}