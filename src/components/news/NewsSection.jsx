import { Badge } from '@/components/ui/badge';
import { ExternalLink, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORY_STYLES = {
  breaking: 'bg-red-500/10 text-red-700 border-red-200',
  immigration: 'bg-purple-500/10 text-purple-700 border-purple-200',
  jobs: 'bg-amber-500/10 text-amber-700 border-amber-200',
  housing: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
  health: 'bg-rose-500/10 text-rose-700 border-rose-200',
};

const CATEGORY_LABELS = {
  breaking: '🔴 Breaking',
  immigration: '🛂 Immigration',
  jobs: '💼 Jobs & Economy',
  housing: '🏠 Housing',
  health: '🧠 Health',
};

const SOURCE_COLORS = {
  CBC: 'bg-red-600 text-white',
  CTV: 'bg-blue-700 text-white',
  GlobalNews: 'bg-indigo-600 text-white',
  EdmontonJournal: 'bg-slate-700 text-white',
  CityNews: 'bg-orange-600 text-white',
};

export default function NewsSection({ articles, category }) {
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-sm">No articles found for this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {articles.map((article, i) => (
        <a
          key={i}
          href={article.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "group bg-card rounded-2xl border border-border/50 p-4 flex flex-col gap-3 hover:border-primary/20 hover:shadow-md transition-all",
            article.category === 'breaking' && "border-red-200/60 bg-red-500/3"
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              <Badge className={cn("text-[10px] border px-2 py-0.5", CATEGORY_STYLES[article.category] || 'bg-muted text-muted-foreground')}>
                {CATEGORY_LABELS[article.category] || article.category}
              </Badge>
              {article.is_local && (
                <Badge className="text-[10px] border px-2 py-0.5 bg-teal-500/10 text-teal-700 border-teal-200 flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5" /> Local
                </Badge>
              )}
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/40 flex-shrink-0 group-hover:text-primary transition-colors" />
          </div>

          <div>
            <h3 className="font-heading font-bold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-1.5">
              {article.title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{article.summary}</p>
          </div>

          <div className="flex items-center justify-between mt-auto pt-1">
            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md", SOURCE_COLORS[article.source] || 'bg-muted text-muted-foreground')}>
              {article.source}
            </span>
            {article.time_ago && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="w-3 h-3" /> {article.time_ago}
              </span>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}