import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { cleanText, sendToUser } from '../../shared/alertEmail.ts';

function formatDate(value) {
  const raw = cleanText(value, 20);
  if (!raw) return '';
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleDateString('en-CA', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Edmonton',
  });
}

// Emails the signed-in user a summary of their saved events and checklist.
// The recipient is always the account's own address.
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: 'Please sign in to receive email reminders.' }, { status: 401 });
    if (!user.email) return Response.json({ error: 'This account has no email address.' }, { status: 400 });

    const payload = await req.json().catch(() => ({}));
    const mode = payload.mode === 'manual' ? 'manual' : 'daily';

    const events = (Array.isArray(payload.events) ? payload.events : []).slice(0, 8).map((e) => ({
      title: cleanText(e?.title, 160),
      date: formatDate(e?.date),
      location: cleanText(e?.location, 160),
    })).filter((e) => e.title);

    const tasks = (Array.isArray(payload.tasks) ? payload.tasks : []).slice(0, 8).map((t) => ({
      title: cleanText(t?.title, 160),
      description: cleanText(t?.description, 240),
    })).filter((t) => t.title);

    if (!events.length && !tasks.length) {
      return Response.json({ error: 'Nothing to send yet.' }, { status: 400 });
    }

    const eventLines = events.map((e) => {
      const when = e.date ? ` on ${e.date}` : '';
      const where = e.location ? ` at ${e.location}` : '';
      return `• ${e.title}${when}${where}`;
    }).join('\n');

    const taskLines = tasks.map((t) => `• ${t.title}${t.description ? ` — ${t.description}` : ''}`).join('\n');

    let subject;
    let body;
    if (mode === 'manual') {
      subject = 'SettleSmart — Your Events & Checklist Summary';
      body = [
        'Hello!',
        '',
        'SAVED EVENTS:',
        eventLines || 'No upcoming events saved yet.',
        '',
        'PENDING CHECKLIST:',
        taskLines || 'All tasks complete!',
        '',
        "Keep going — you're doing amazing!",
        '',
        'SettleSmart Canada',
      ].join('\n');
    } else {
      subject = 'SettleSmart Daily Update — Your events & checklist';
      body = [
        'Hello!',
        '',
        "Here's your daily SettleSmart update to help you stay on track with your settlement journey.",
        '',
        events.length ? `UPCOMING EVENTS:\n${eventLines}` : '',
        tasks.length ? `CHECKLIST TASKS TO COMPLETE:\n${taskLines}` : '',
        'Stay on track — you are doing great!',
        '',
        'Visit SettleSmart to take action:',
        '• Events → /events',
        '• Checklist → /checklist',
        '',
        'Best,',
        'The SettleSmart Team',
      ].filter((line) => line !== '').join('\n');
    }

    await sendToUser(base44, user.email, subject, body);

    return Response.json({ ok: true, sentTo: user.email });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}