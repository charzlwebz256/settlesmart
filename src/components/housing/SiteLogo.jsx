import { useState } from 'react';
import { siteLogo } from '@/lib/siteLogos';
import { cn } from '@/lib/utils';

// A site's logo from Google's favicon service, with a letter tile if it cannot load.
export default function SiteLogo({ url, name, className }) {
  const [failed, setFailed] = useState(false);
  const letter = (name || '?').charAt(0).toUpperCase();
  const src = siteLogo(url);

  if (!src || failed) {
    return (
      <span
        className={cn(
          'flex flex-shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground',
          className
        )}
      >
        {letter}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'flex flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-card p-1',
        className
      )}
    >
      <img
        src={src}
        alt={`${name} logo`}
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-full w-full object-contain"
      />
    </span>
  );
}