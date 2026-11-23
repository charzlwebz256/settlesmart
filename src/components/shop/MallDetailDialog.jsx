import { Dialog, DialogContent } from '@/components/ui/dialog';
import { MALL_DETAILS } from '@/data/mallDetails';
import { MapPin, Clock, Phone, Globe, Store, CalendarDays, Navigation, ExternalLink, Info } from 'lucide-react';

function Fact({ icon: Icon, label, value, href }) {
  if (!value) return null;
  return (
    <div className="flex gap-2">
      <Icon className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="break-words text-xs font-semibold text-primary hover:underline"
          >
            {value}
          </a>
        ) : (
          <p className="text-xs font-semibold leading-snug text-foreground">{value}</p>
        )}
      </div>
    </div>
  );
}

// Full detail card for one shopping centre: facts, contact details and a live map.
export default function MallDetailDialog({ mall, onClose }) {
  const details = mall ? MALL_DETAILS[mall.name] || {} : {};
  const place = mall ? `${mall.name}, ${mall.city}, ${mall.province}, Canada` : '';
  const mapsSearch = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place)}`;
  const hours = details.hours || 'Hours vary by store, check the mall website before you go.';

  if (!mall) return null;

  return (
    <Dialog open={!!mall} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl gap-0 overflow-y-auto p-0 max-h-[92vh]">
        <div className="border-b border-border/60 bg-primary/10 px-4 pb-3 pt-4 sm:px-5">
          <p className="mb-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
            <MapPin className="h-3 w-3" />
            {mall.city} · {mall.province}
          </p>
          <h2 className="font-heading text-lg font-bold leading-tight text-foreground sm:text-xl">{mall.name}</h2>
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Fact icon={MapPin} label="Location" value={details.address || `${mall.city}, ${mall.province}`} />
            <Fact icon={Clock} label="Operating hours" value={hours} />
            <Fact icon={Phone} label="Phone" value={details.phone} href={details.phone ? `tel:${details.phone.replace(/[^\d+]/g, '')}` : null} />
            <Fact
              icon={Globe}
              label="Website"
              value={details.website ? details.website.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'Find on Google Maps'}
              href={details.website || mapsSearch}
            />
            <Fact icon={Store} label="Stores" value={details.stores} />
            <Fact icon={CalendarDays} label="Opened" value={details.opened} />
          </div>

          {details.facts?.length > 0 && (
            <div className="rounded-xl bg-muted/50 p-3">
              <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                <Info className="h-3 w-3 text-primary" />
                Facts about this mall
              </p>
              <ul className="space-y-1">
                {details.facts.map((fact) => (
                  <li key={fact} className="flex gap-1.5 text-xs leading-relaxed text-foreground">
                    <span className="text-primary">•</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              <MapPin className="h-3 w-3 text-primary" />
              On the map
            </p>
            <iframe
              title={`Map of ${mall.name}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(place)}&z=15&output=embed`}
              className="h-56 w-full rounded-xl border border-border/60"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={details.website || mapsSearch}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {details.website ? 'Visit mall website' : 'Open in Google Maps'}
            </a>
            <a
              href={directions}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold text-foreground transition-colors hover:bg-muted"
            >
              <Navigation className="h-3.5 w-3.5 text-primary" />
              Get directions
            </a>
          </div>

          <p className="text-[10px] leading-relaxed text-muted-foreground">
            Details are a general guide. Holiday hours, individual store hours and contact numbers change, so confirm with the
            mall before travelling.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}