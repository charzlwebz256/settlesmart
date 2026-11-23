import { ExternalLink } from 'lucide-react';

// One rental platform: what it lists, what it is good at, and a link out.
export default function PlatformCard({ platform }) {
  return (
    <div className="flex flex-col rounded-2xl border border-border/60 bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-heading text-sm font-bold leading-tight">{platform.name}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">{platform.kind}</p>
        </div>
        {platform.recommended && (
          <span className="flex-shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
            Recommended
          </span>
        )}
      </div>

      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{platform.description}</p>

      <ul className="mt-2 space-y-1">
        {platform.features.map((feature) => (
          <li key={feature} className="flex gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-primary" />
            {feature}
          </li>
        ))}
      </ul>

      <a
        href={platform.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
      >
        Visit site
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}