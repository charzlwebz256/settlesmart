import { useState } from 'react';
import { Download, ExternalLink, Smartphone, X } from 'lucide-react';
import { ETS_LINKS } from '@/data/etsTransit';

// Encourages riders to use the Transit app for live ETS arrivals while they plan here.
export default function TransitAppPromo() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="absolute top-3 left-3 z-[1000] w-[16.5rem] max-w-[calc(100%-4.5rem)] rounded-2xl bg-card/95 backdrop-blur border border-border/60 shadow-lg p-3 animate-fade-in">
      <div className="flex items-start gap-2">
        <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
          <Smartphone className="w-3.5 h-3.5" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-bold text-foreground leading-tight">Live ETS arrivals in Transit</p>
          <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
            Real-time bus and LRT times, nearby stops and step-by-step directions while you ride in Edmonton.
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss Transit app suggestion"
          className="p-1 -m-1 rounded-md hover:bg-muted flex-shrink-0"
        >
          <X className="w-3 h-3 text-muted-foreground" />
        </button>
      </div>
      <a
        href={ETS_LINKS.transitApp}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2.5 flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-xl bg-primary text-primary-foreground text-[11px] font-bold hover:bg-primary/90 transition-colors"
      >
        <Download className="w-3.5 h-3.5" />
        Get the Transit app
        <ExternalLink className="w-3 h-3 opacity-70" />
      </a>
    </div>
  );
}