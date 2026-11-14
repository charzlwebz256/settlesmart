import { ExternalLink } from 'lucide-react';

export default function ResourceList({ items }) {
  return (
    <div className="space-y-2">
      {items.map(item => (
        <a
          key={item.url}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
        >
          <ExternalLink className="w-4 h-4 text-primary/60 flex-shrink-0 mt-0.5 group-hover:text-primary" />
          <div className="min-w-0">
            <p className="text-sm font-semibold group-hover:text-primary transition-colors">{item.label}</p>
            {item.note && <p className="text-xs text-muted-foreground leading-snug">{item.note}</p>}
          </div>
        </a>
      ))}
    </div>
  );
}