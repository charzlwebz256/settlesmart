import { Link } from 'react-router-dom';
import { ArrowRight, Compass, ExternalLink } from 'lucide-react';
import { SERVICE_DIRECTORY } from '@/data/nationalDirectory';

// Clickable card on the Resources page that opens the full national directory.
export default function DirectoryCard() {
  return (
    <Link
      to="/directory"
      className="group block rounded-2xl border border-border/50 bg-card p-4 transition-colors hover:border-primary/50"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Compass className="h-5 w-5 text-primary" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-heading text-sm font-bold">Browse the directory</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Emergency lines, housing, banks, family services, seniors, transit, parks, libraries and pet care, with the
            official website of each organisation.
          </p>
        </div>
        <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {SERVICE_DIRECTORY.map((category) => (
          <span
            key={category.id}
            className="rounded-lg bg-muted/60 px-2 py-1 text-[11px] font-semibold text-muted-foreground"
          >
            {category.label}
          </span>
        ))}
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-primary">
        <ExternalLink className="h-3 w-3" />
        13 provinces and territories, official links included
      </p>
    </Link>
  );
}