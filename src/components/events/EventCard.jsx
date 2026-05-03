import { Calendar, Clock, MapPin, Globe, Bookmark, BookmarkCheck, ExternalLink, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

const categoryConfig = {
  workshop: { color: 'bg-blue-500/10 text-blue-600', label: 'Workshop' },
  community: { color: 'bg-orange-500/10 text-orange-600', label: 'Community' },
  language: { color: 'bg-purple-500/10 text-purple-600', label: 'Language' },
  employment: { color: 'bg-amber-500/10 text-amber-600', label: 'Employment' },
  health: { color: 'bg-rose-500/10 text-rose-600', label: 'Health' },
  legal: { color: 'bg-violet-500/10 text-violet-600', label: 'Legal' },
  housing: { color: 'bg-emerald-500/10 text-emerald-600', label: 'Housing' },
  social: { color: 'bg-pink-500/10 text-pink-600', label: 'Social' },
  orientation: { color: 'bg-teal-500/10 text-teal-600', label: 'Orientation' },
};

export default function EventCard({ event, saved, onSave }) {
  const config = categoryConfig[event.category] || categoryConfig.community;

  let dateDisplay = '';
  try {
    dateDisplay = format(parseISO(event.date), 'EEE, MMM d, yyyy');
  } catch {
    dateDisplay = event.date;
  }

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-4 hover:border-primary/20 hover:shadow-md transition-all flex flex-col gap-3">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1.5 mb-1.5">
            <Badge className={cn("text-[10px] border-0 font-medium", config.color)}>{config.label}</Badge>
            {event.is_free && <Badge className="text-[10px] border-0 bg-green-500/10 text-green-600">Free</Badge>}
            {event.is_online && <Badge className="text-[10px] border-0 bg-sky-500/10 text-sky-600">Online</Badge>}
          </div>
          <h3 className="font-heading font-bold text-sm leading-snug">{event.title}</h3>
          {event.organizer && <p className="text-[11px] text-muted-foreground mt-0.5">{event.organizer}</p>}
        </div>
        <button
          onClick={() => onSave(event)}
          className="flex-shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors"
        >
          {saved
            ? <BookmarkCheck className="w-5 h-5 text-primary" />
            : <Bookmark className="w-5 h-5 text-muted-foreground" />}
        </button>
      </div>

      {/* Details */}
      <div className="space-y-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-primary/60" />
          <span>{dateDisplay}{event.time && ` · ${event.time}`}{event.end_time && ` – ${event.end_time}`}</span>
        </div>
        {(event.location || event.is_online) && (
          <div className="flex items-center gap-2">
            {event.is_online ? <Globe className="w-3.5 h-3.5 flex-shrink-0 text-sky-500" /> : <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-primary/60" />}
            <span className="truncate">{event.is_online ? 'Online event' : event.location}</span>
          </div>
        )}
        {event.languages?.length > 0 && (
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 flex-shrink-0 text-primary/60" />
            <span>{event.languages.join(', ')}</span>
          </div>
        )}
      </div>

      {event.description && (
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{event.description}</p>
      )}

      {event.registration_url && (
        <a href={event.registration_url} target="_blank" rel="noopener noreferrer" className="mt-auto">
          <Button size="sm" variant="outline" className="w-full rounded-xl text-xs gap-1.5 h-8">
            Register <ExternalLink className="w-3 h-3" />
          </Button>
        </a>
      )}
    </div>
  );
}