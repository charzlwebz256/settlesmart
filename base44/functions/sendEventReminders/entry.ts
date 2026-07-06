import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    // Admin-only: this runs as a scheduled task and emails users directly.
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Tomorrow's date in the app's primary timezone (America/Edmonton).
    // Compute today's Y/M/D in Edmonton, then add one calendar day — robust
    // regardless of the server's UTC offset.
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Edmonton',
      year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(new Date());
    const y = Number(parts.find(p => p.type === 'year').value);
    const m = Number(parts.find(p => p.type === 'month').value);
    const d = Number(parts.find(p => p.type === 'day').value);
    const tomorrowStr = new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);

    // All saved events with reminders enabled
    const saved = await base44.asServiceRole.entities.SavedEvent.filter({ notify: true });
    const sent = [];
    const failed = [];

    for (const s of saved) {
      if (!s.event_id) continue;
      let event;
      try { event = await base44.asServiceRole.entities.Event.get(s.event_id); } catch { continue; }
      if (!event || event.date !== tomorrowStr) continue;

      let eventUser;
      try { eventUser = await base44.asServiceRole.entities.User.get(s.created_by_id); } catch { continue; }
      if (!eventUser || !eventUser.email) continue;

      const lines = [
        `Hi ${eventUser.full_name || 'there'},`,
        '',
        'This is a reminder for your saved event tomorrow:',
        '',
        `📌 ${event.title}`,
      ];
      if (event.time) lines.push(`🕒 ${event.time}${event.end_time ? ' – ' + event.end_time : ''}`);
      if (event.location) lines.push(`📍 ${event.location}`);
      if (event.is_online && event.online_link) lines.push(`🔗 ${event.online_link}`);
      if (event.registration_url) lines.push(`Register: ${event.registration_url}`);
      if (event.organizer) lines.push(`Organizer: ${event.organizer}`);
      lines.push('', 'View more in the SettleSmart app → Community Events.', '', '— The SettleSmart Team');

      try {
        await base44.integrations.Core.SendEmail({
          to: eventUser.email,
          subject: `Reminder: ${event.title} — tomorrow`,
          body: lines.join('\n'),
        });
        sent.push(eventUser.email);
      } catch (err) {
        failed.push({ email: eventUser.email, error: err.message });
      }
    }

    return Response.json({ status: 'success', tomorrow: tomorrowStr, sent: sent.length, failed });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});