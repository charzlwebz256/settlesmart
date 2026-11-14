import { AlertTriangle, Bus, ExternalLink, Phone, Train } from 'lucide-react';
import { ETS_LINKS, ETS_LRT_LINES, ETS_QUICK_LINKS, ETS_SERVICE_FACTS } from '@/data/etsTransit';

// ETS routes, frequencies and schedule links shown under the map.
export default function EtsNetworkPanel() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="rounded-2xl border border-border/60 bg-card p-5">
        <div className="flex items-start gap-3">
          <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <Bus className="w-4 h-4" />
          </span>
          <div className="flex-1 min-w-0">
            <h2 className="font-heading font-bold text-base">Edmonton Transit (ETS) routes, commutes & schedules</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Typical service levels for Edmonton buses and LRT. Routes change seasonally, so confirm times with ETS before you ride.
            </p>
          </div>
          <a
            href={ETS_LINKS.home}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline flex-shrink-0"
          >
            ETS home
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {ETS_LRT_LINES.map((line) => (
            <div key={line.name} className="rounded-xl border border-border/50 p-3">
              <div className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${line.tone}`} />
                <Train className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="text-xs font-bold text-foreground">{line.name}</p>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">{line.endpoints}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {ETS_SERVICE_FACTS.map((fact) => (
            <div key={fact.label} className="rounded-xl bg-muted/40 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{fact.label}</p>
              <p className="text-[12px] text-foreground mt-0.5 leading-snug">{fact.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {ETS_QUICK_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 text-[11px] font-semibold text-foreground hover:bg-muted transition-colors"
            >
              {link.label}
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/40 pt-3 text-[11px] text-muted-foreground">
          <a href={ETS_LINKS.alerts} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-semibold text-foreground hover:text-primary">
            <AlertTriangle className="w-3.5 h-3.5 text-accent" />
            Check service alerts and detours
          </a>
          <a href={ETS_LINKS.busLink} className="flex items-center gap-1.5 hover:text-foreground">
            <Phone className="w-3.5 h-3.5" />
            BusLink 780-496-1600
          </a>
          <a href={ETS_LINKS.owl} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
            Late Night Owl service
          </a>
          <a href={ETS_LINKS.airport} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
            Route 747 airport
          </a>
        </div>
      </div>
    </section>
  );
}