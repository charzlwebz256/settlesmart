import { ArrowRight, ExternalLink } from 'lucide-react';

const TINT = {
  blue: 'border-blue-200 dark:border-blue-800',
  violet: 'border-violet-200 dark:border-violet-800',
  emerald: 'border-emerald-200 dark:border-emerald-800',
};

/** One flight site, opening in a new tab. */
export default function FlightCard({ item, tint = 'blue', index = 0 }) {
  const initials = item.name.replace(/[^A-Za-z ]/g, '').slice(0, 2).toUpperCase();
  const callToAction = item.cta === 'Book flights' ? 'Book flights' : `Visit ${item.name}`;

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ animationDelay: `${index * 45}ms` }}
      className={`group flex w-full flex-col gap-3 rounded-2xl border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl animate-fade-in ${TINT[tint] || TINT.blue}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-white p-1.5 transition-transform duration-300 group-hover:scale-110">
          <img
            src={item.logo}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <span className="hidden h-full w-full items-center justify-center text-[11px] font-bold text-slate-700">
            {initials}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-sm font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
            {item.name}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
        </div>
        <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>

      <span className="mt-auto inline-flex items-center gap-1 text-[11px] font-bold text-primary">
        {callToAction}
        <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </a>
  );
}