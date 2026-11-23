import { useState } from 'react';
import { ChevronDown, ExternalLink, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { institutionLogo } from '@/data/institutionLogos';
import { officialLinks } from '@/data/officialLinks';

// One organisation: opens its details on hover, tap or keyboard focus.
export default function DirectoryEntry({ item, categoryLabel, province, allowMap = true }) {
  const [open, setOpen] = useState(false);
  const logo = institutionLogo(item.name);
  const links = officialLinks(item.name);
  // A map only helps for a real organisation with a location, never a hotline.
  const hotline = /^\d/.test(item.name.trim()) || /^(911|988|211|811|311|511)\b/.test(item.name.trim());
  const mapsUrl =
    allowMap && !hotline
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          [item.name, province].filter(Boolean).join(' ')
        )}`
      : null;

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className={cn(
        'rounded-xl border p-3 transition-colors',
        open ? 'border-primary/40 bg-muted/60' : 'border-transparent bg-muted/40'
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-start gap-2.5 text-left"
      >
        {logo ? (
          <img
            src={logo}
            alt=""
            className="mt-0.5 h-7 w-7 flex-shrink-0 rounded-md bg-card object-contain p-0.5"
            onError={(event) => {
              event.currentTarget.style.visibility = 'hidden';
            }}
          />
        ) : (
          <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-primary/10 text-[11px] font-bold text-primary">
            {item.name.charAt(0)}
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-foreground">{item.name}</span>
          {item.note && !open && (
            <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{item.note}</span>
          )}
        </span>
        <ChevronDown
          className={cn('mt-1 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')}
        />
      </button>

      <div
        className={cn(
          'grid transition-all duration-200',
          open ? 'mt-2 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="min-h-0 overflow-hidden">
          {item.note && <p className="text-xs leading-relaxed text-muted-foreground">{item.note}</p>}
          <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {categoryLabel} · {province || 'Across Canada'}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/20"
              >
                {link.label}
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-border/60 px-2 py-1 text-[11px] font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Find on the map
                <MapPin className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}