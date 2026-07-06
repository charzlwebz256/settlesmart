import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Workspace-registered "User Google Calendar" connector (APP_USER mode).
const CONNECTOR_ID = '6a4b29efdb6c44ab9da95d9f';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Current app user's OAuth token for their own Google Calendar
    const { accessToken } = await base44.asServiceRole.connectors.getCurrentAppUserConnection(CONNECTOR_ID);

    // Fetch events from ~1 month back through the end of next year
    const timeMin = new Date();
    timeMin.setMonth(timeMin.getMonth() - 1);
    const timeMax = new Date();
    timeMax.setFullYear(timeMax.getFullYear() + 1);

    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=250&singleEvents=true&orderBy=startTime&timeMin=${timeMin.toISOString()}&timeMax=${timeMax.toISOString()}`;

    const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!res.ok) {
      const errorText = await res.text();
      return Response.json({ error: `Google API error: ${res.status}`, details: errorText }, { status: res.status });
    }

    const data = await res.json();
    const events = (data.items || []).map(item => ({
      id: item.id,
      title: item.summary || 'Untitled event',
      start: item.start?.dateTime || item.start?.date,
      end: item.end?.dateTime || item.end?.date,
      location: item.location || null,
      description: item.description || null,
      is_all_day: !item.start?.dateTime,
    }));

    return Response.json({ events });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});