import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, ExternalLink, Calendar, MapPin, Globe, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EventbriteFeed({ city = 'Edmonton' }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Search Eventbrite Canada for upcoming events in ${city}, Alberta. 
Visit or search: https://www.eventbrite.ca/d/canada--${city.toLowerCase()}/all-events/

Return the 8 most relevant upcoming community, cultural, workshop, or free events. Focus on events relevant to newcomers, immigrants, or community gatherings.

For each event return:
- title: event name
- date: formatted as "Day, Mon D" e.g. "Sat, May 10"
- time: start time e.g. "2:00 PM"
- location: venue name and area
- is_free: true/false
- price: price string if not free e.g. "From CA$20"
- url: full eventbrite URL
- image_url: thumbnail image URL from evbuc.com if available
- category: one of: workshop, community, social, employment, health, orientation, language, other`,
      add_context_from_internet: true,
      response_json_schema: {
        type: 'object',
        properties: {
          events: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                date: { type: 'string' },
                time: { type: 'string' },
                location: { type: 'string' },
                is_free: { type: 'boolean' },
                price: { type: 'string' },
                url: { type: 'string' },
                image_url: { type: 'string' },
                category: { type: 'string' },
              },
            },
          },
        },
      },
    });
    setEvents(result?.events || []);
    setLoaded(true);
    setLoading(false);
  };

  const categoryColors = {
    workshop: 'bg-blue-500/10 text-blue-600',
    community: 'bg-orange-500/10 text-orange-600',
    social: 'bg-pink-500/10 text-pink-600',
    employment: 'bg-amber-500/10 text-amber-600',
    health: 'bg-rose-500/10 text-rose-600',
    orientation: 'bg-teal-500/10 text-teal-600',
    language: 'bg-purple-500/10 text-purple-600',
    other: 'bg-muted text-muted-foreground',
  };

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-orange-500" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm">Live from Eventbrite</h3>
            <p className="text-[11px] text-muted-foreground">{city} community events</p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={fetchEvents}
          disabled={loading}
          className="rounded-xl gap-1.5 text-xs h-8"
        >
          {loading
            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading...</>
            : loaded
            ? <><RefreshCw className="w-3.5 h-3.5" /> Refresh</>
            : <><Zap className="w-3.5 h-3.5" /> Load Events</>}
        </Button>
      </div>

      {!loaded && !loading && (
        <div className="text-center py-8 text-muted-foreground">
          <Calendar className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Click "Load Events" to fetch live Edmonton events from Eventbrite</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Fetching live events from Eventbrite...</p>
        </div>
      )}

      {loaded && !loading && events.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-6">No events found. Try refreshing.</p>
      )}

      {loaded && !loading && events.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {events.map((ev, i) => (
            <a
              key={i}
              href={ev.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex gap-3 p-3 rounded-xl border border-border/50 hover:border-primary/20 hover:shadow-md transition-all bg-background"
            >
              {ev.image_url && (
                <img
                  src={ev.image_url}
                  alt={ev.title}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  onError={e => e.target.style.display = 'none'}
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-1 mb-1">
                  <Badge className={cn("text-[9px] border-0 px-1.5 py-0", categoryColors[ev.category] || categoryColors.other)}>
                    {ev.category || 'event'}
                  </Badge>
                  {ev.is_free && <Badge className="text-[9px] border-0 px-1.5 py-0 bg-green-500/10 text-green-600">Free</Badge>}
                </div>
                <p className="text-xs font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">{ev.title}</p>
                <div className="mt-1.5 space-y-0.5">
                  {(ev.date || ev.time) && (
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      <span>{ev.date}{ev.time && ` · ${ev.time}`}</span>
                    </div>
                  )}
                  {ev.location && (
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{ev.location}</span>
                    </div>
                  )}
                  {!ev.is_free && ev.price && (
                    <p className="text-[10px] font-medium text-amber-600">{ev.price}</p>
                  )}
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
            </a>
          ))}
        </div>
      )}

      {loaded && events.length > 0 && (
        <a
          href={`https://www.eventbrite.ca/d/canada--${city.toLowerCase()}/all-events/`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-1.5 text-xs text-primary hover:underline"
        >
          View all {city} events on Eventbrite <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
}