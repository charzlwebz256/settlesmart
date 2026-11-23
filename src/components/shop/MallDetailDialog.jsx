import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { MALL_DETAILS } from '@/data/mallDetails';
import { MapPin, Clock, Phone, Globe, Store, CalendarDays, Navigation, ExternalLink, Info } from 'lucide-react';

const FALLBACK_IMAGES = [
  'https://media.base44.com/images/public/69f2dbb716d886c9c4ab31fc/8f2767d5a_generated_image.png',
  'https://media.base44.com/images/public/69f2dbb716d886c9c4ab31fc/b5f519c45_generated_image.png',
  'https://media.base44.com/images/public/69f2dbb716d886c9c4ab31fc/80cec429b_generated_image.png',
];

let keyPromise = null;
const getMapsKey = () => {
  if (!keyPromise) {
    keyPromise = base44.functions
      .invoke('mapsConfig', {})
      .then((res) => res?.data?.key || null)
      .catch(() => null);
  }
  return keyPromise;
};

const imageFor = (name) => FALLBACK_IMAGES[[...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % FALLBACK_IMAGES.length];

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

// Full detail card for one shopping centre: photo, facts, contact details and a live map.
export default function MallDetailDialog({ mall, onClose }) {
  const [streetUrl, setStreetUrl] = useState(null);
  const [streetFailed, setStreetFailed] = useState(false);

  const details = mall ? MALL_DETAILS[mall.name] || {} : {};
  const place = mall ? `${mall.name}, ${mall.city}, ${mall.province}, Canada` : '';
  const mapsSearch = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place)}`;
  const hours = details.hours || 'Hours vary by store, check the mall website before you go.';

  // A Street View photo of the actual mall when the maps key allows it.
  useEffect(() => {
    setStreetUrl(null);
    setStreetFailed(false);
    if (!mall) return;
    let alive = true;
    getMapsKey().then((key) => {
      if (!alive || !key) return;
      setStreetUrl(
        `https://maps.googleapis.com/maps/api/streetview?size=900x420&location=${encodeURIComponent(place)}&fov=80&key=${encodeURIComponent(key)}&return_error_code=true`
      );
    });
    return () => {
      alive = false;
    };
  }, [mall, place]);

  if (!mall) return null;

  const hero = streetUrl && !streetFailed ? streetUrl : imageFor(mall.name);

  return (
    <Dialog open={!!mall} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl gap-0 overflow-y-auto p-0 max-h-[92vh]">
        <div className="relative">
          <img
            src={hero}
            alt={`${mall.name} shopping centre`}
            className="h-44 w-full object-cover sm:h-52"
            onError={() => setStreetFailed(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="mb-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-white/80">
              <MapPin className="h-3 w-3" />
              {mall.city} · {mall.province}
            </p>
            <h2 className="font-heading text-lg font-bold leading-tight text-white sm:text-xl">{mall.name}</h2>
          </div>
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