import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Bell, Mail, CheckCircle2, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { differenceInDays, parseISO, isAfter, format } from 'date-fns';

const STORAGE_KEY = 'ss_email_notifications_sent_at';

// Checks if enough time has passed since last notification batch (24h)
function shouldSendToday() {
  const last = localStorage.getItem(STORAGE_KEY);
  if (!last) return true;
  const hours = (Date.now() - parseInt(last)) / (1000 * 60 * 60);
  return hours >= 24;
}

export default function EmailNotificationSetup({ savedEvents, allEvents, checklist }) {
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [dismissed, setDismissed] = useState(() => !!localStorage.getItem('ss_email_notif_dismissed'));

  // Auto-send daily digest on load (once per 24h)
  useEffect(() => {
    const autoSend = async () => {
      if (!shouldSendToday()) return;
      if (!savedEvents?.length && !checklist?.length) return;

      const user = await base44.auth.me();
      if (!user?.email) return;

      const today = new Date();

      // Upcoming events within 3 days
      const urgentEvents = savedEvents
        .map(se => allEvents?.find(e => e.id === se.event_id))
        .filter(Boolean)
        .filter(e => {
          if (!e?.date) return false;
          const d = parseISO(e.date);
          const daysAway = differenceInDays(d, today);
          return isAfter(d, today) && daysAway <= 3;
        });

      // Pending checklist items (not completed, not started)
      const pendingTasks = (checklist || []).filter(c => !c.is_completed).slice(0, 5);

      if (urgentEvents.length === 0 && pendingTasks.length === 0) return;

      const eventLines = urgentEvents.map(e =>
        `• "${e.title}" on ${format(parseISO(e.date), 'EEEE, MMMM d')}${e.location ? ` at ${e.location}` : ''}`
      ).join('\n');

      const taskLines = pendingTasks.map(t =>
        `• ${t.title}${t.description ? ` — ${t.description}` : ''}`
      ).join('\n');

      const subject = '🍁 SettleSmart Daily Update — Your events & checklist';
      const body = `Hello!

Here's your daily SettleSmart update to help you stay on track with your settlement journey.

${urgentEvents.length > 0 ? `📅 UPCOMING EVENTS (next 3 days):\n${eventLines}\n` : ''}
${pendingTasks.length > 0 ? `✅ CHECKLIST TASKS TO COMPLETE:\n${taskLines}\n` : ''}
Stay on track — you're doing great! 🍁

Visit SettleSmart to take action:
• Events → https://settlesmart.ca/events
• Checklist → https://settlesmart.ca/checklist

Best,
The SettleSmart Team`;

      await base44.integrations.Core.SendEmail({
        to: user.email,
        subject,
        body,
        from_name: 'SettleSmart Canada',
      });

      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    };

    autoSend().catch(() => {});
  }, [savedEvents, allEvents, checklist]);

  const handleSendNow = async () => {
    setStatus('sending');
    const user = await base44.auth.me();
    if (!user?.email) { setStatus('error'); return; }

    const today = new Date();
    const urgentEvents = savedEvents
      .map(se => allEvents?.find(e => e.id === se.event_id))
      .filter(Boolean)
      .filter(e => e?.date && isAfter(parseISO(e.date), today));

    const pendingTasks = (checklist || []).filter(c => !c.is_completed).slice(0, 8);

    const eventLines = urgentEvents.slice(0, 5).map(e =>
      `• "${e.title}" on ${format(parseISO(e.date), 'EEEE, MMMM d')}`
    ).join('\n') || 'No upcoming events saved yet.';

    const taskLines = pendingTasks.map(t => `• ${t.title}`).join('\n') || 'All tasks complete! 🎉';

    await base44.integrations.Core.SendEmail({
      to: user.email,
      subject: '🍁 SettleSmart — Your Events & Checklist Summary',
      body: `Hello!\n\n📅 SAVED EVENTS:\n${eventLines}\n\n✅ PENDING CHECKLIST:\n${taskLines}\n\nKeep going — you're doing amazing! 🍁\n\nSettleSmart Canada`,
      from_name: 'SettleSmart Canada',
    });

    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    setStatus('sent');
    setTimeout(() => setStatus('idle'), 4000);
  };

  if (dismissed) return null;

  return (
    <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-2xl px-4 py-3 mb-4">
      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Mail className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-foreground">Email Reminders</p>
        <p className="text-[10px] text-muted-foreground">Get daily updates on events & checklist tasks</p>
      </div>
      {status === 'sent' ? (
        <span className="flex items-center gap-1 text-xs text-primary font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" /> Sent!
        </span>
      ) : (
        <Button
          size="sm"
          variant="outline"
          onClick={handleSendNow}
          disabled={status === 'sending'}
          className="rounded-xl text-xs h-8 border-primary/30 text-primary hover:bg-primary/10 flex-shrink-0"
        >
          {status === 'sending' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Bell className="w-3 h-3" />}
          <span className="ml-1">Send now</span>
        </Button>
      )}
      <button
        onClick={() => { setDismissed(true); localStorage.setItem('ss_email_notif_dismissed', '1'); }}
        className="p-1 rounded-lg hover:bg-muted flex-shrink-0"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5 text-muted-foreground" />
      </button>
    </div>
  );
}