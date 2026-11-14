import { ExternalLink } from 'lucide-react';

const TINT = {
  rose: 'border-rose-200 dark:border-rose-800',
  amber: 'border-amber-200 dark:border-amber-800',
  violet: 'border-violet-200 dark:border-violet-800',
  emerald: 'border-emerald-200 dark:border-emerald-800',
  slate: 'border-slate-200 dark:border-slate-700',
};

const ACCESS = {
  free: { label: 'Free', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
  ads: { label: 'Free with ads', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  tier: { label: 'Free tier', cls: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300' },
  library: { label: 'Library card', cls: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300' },
  paid: { label: 'Paid', cls: 'bg-slate-200 text-slate-700 dark:bg-slate-700/60 dark:text-slate-200' },
};

/** One streaming or audio service, opening in a new tab. */
export default function PlayCard({ service, tint = 'slate', index = 0 }) {
  const access = ACCESS[service.access] || ACCESS.paid;

  return (
    <a
      href={service.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ animationDelay: `${index * 40}ms` }}
      className={`group flex h-full w-full flex-col gap-3 rounded-2xl border bg-card p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg animate-fade-in ${TINT[tint] || TINT.slate}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-white p-1.5">
          <img
            src={service.logo}
            alt={service.name}
            loading="lazy"
            className="h-full w-full object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <span className="hidden h-full w-full items-center justify-center text-[10px] font-bold text-slate-700">
            {service.name.slice(0, 2)}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-sm font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
            {service.name}
          </h3>
          <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${access.cls}`}>
            {access.label}
          </span>
        </div>
        <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground/40 transition-colors group-hover:text-primary" />
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">{service.desc}</p>
    </a>
  );
}