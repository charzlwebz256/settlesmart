import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Verify admin access
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get Google Calendar connection
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');
    const authHeader = { Authorization: `Bearer ${accessToken}` };

    // Load sync token from SyncState entity
    const existing = await base44.asServiceRole.entities.SyncState.list();
    const syncRecord = existing.length > 0 ? existing[0] : null;

    // Build URL - use syncToken if available, otherwise fetch recent events
    let url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=250&singleEvents=true&orderBy=startTime';
    if (syncRecord?.sync_token) {
      url += `&syncToken=${syncRecord.sync_token}`;
    } else {
      // Initial sync: get events from the past month to end of next year
      const timeMin = new Date();
      timeMin.setMonth(timeMin.getMonth() - 1);
      const timeMax = new Date();
      timeMax.setFullYear(timeMax.getFullYear() + 1);
      url += `&timeMin=${timeMin.toISOString()}&timeMax=${timeMax.toISOString()}`;
    }

    let res = await fetch(url, { headers: authHeader });
    
    // Handle expired sync token (410 Gone)
    if (res.status === 410) {
      url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=250&singleEvents=true&orderBy=startTime';
      const timeMin = new Date();
      timeMin.setMonth(timeMin.getMonth() - 1);
      const timeMax = new Date();
      timeMax.setFullYear(timeMax.getFullYear() + 1);
      url += `&timeMin=${timeMin.toISOString()}&timeMax=${timeMax.toISOString()}`;
      res = await fetch(url, { headers: authHeader });
    }
    
    if (!res.ok) {
      const errorText = await res.text();
      return Response.json({ error: `Google API error: ${res.status}`, details: errorText }, { status: res.status });
    }

    // Drain all pages to get nextSyncToken
    const allItems = [];
    let pageData = await res.json();
    let newSyncToken = null;
    
    while (true) {
      allItems.push(...(pageData.items || []));
      if (pageData.nextSyncToken) newSyncToken = pageData.nextSyncToken;
      if (!pageData.nextPageToken) break;
      
      const nextRes = await fetch(
        url + `&pageToken=${pageData.nextPageToken}`,
        { headers: authHeader }
      );
      if (!nextRes.ok) break;
      pageData = await nextRes.json();
    }

    // Import all events from Google Calendar (including birthdays and holidays)
    const imported = [];
    for (const event of allItems) {
      if (!event.start?.date) continue;
      
      const eventDate = event.start.date;
      const title = event.summary || 'Event';
      const summary = (event.summary || '').toLowerCase();
      
      // Determine category based on event summary
      let category = 'community';
      if (summary.includes('birthday')) {
        category = 'social';
      } else if (summary.includes('holiday')) {
        category = 'community';
      } else if (summary.includes('meeting') || summary.includes('work')) {
        category = 'employment';
      }
      
      // Check if this event already exists
      const existingEvents = await base44.asServiceRole.entities.Event.filter({ 
        title: title,
        date: eventDate 
      });
      
      if (existingEvents.length === 0) {
        await base44.asServiceRole.entities.Event.create({
          title: title,
          description: event.description || `Event from Google Calendar`,
          category: category,
          date: eventDate,
          is_free: true,
          organizer: event.organizer?.displayName || 'Google Calendar Sync',
          tags: ['google-calendar-sync', summary.includes('birthday') ? 'birthday' : 'event']
        });
        imported.push(title);
      }
    }

    // Update sync token
    const now = new Date().toISOString();
    if (syncRecord) {
      await base44.asServiceRole.entities.SyncState.update(syncRecord.id, {
        sync_token: newSyncToken,
        last_sync: now
      });
    } else {
      await base44.asServiceRole.entities.SyncState.create({
        sync_token: newSyncToken,
        last_sync: now
      });
    }

    return Response.json({
      status: 'success',
      imported: imported.length,
      events: imported,
      last_sync: now
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});