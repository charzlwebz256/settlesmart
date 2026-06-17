import { Badge } from '@/components/ui/badge';
import { ExternalLink, Clock, MapPin, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORY_STYLES = {
  breaking: 'bg-red-500/10 text-red-700 border-red-200',
  immigration: 'bg-purple-500/10 text-purple-700 border-purple-200',
  jobs: 'bg-amber-500/10 text-amber-700 border-amber-200',
  housing: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
  health: 'bg-rose-500/10 text-rose-700 border-rose-200',
  world: 'bg-blue-500/10 text-blue-700 border-blue-200',
};

// Source brand colors
const SOURCE_STYLES = {
  'BBC': 'bg-[#BB1919] text-white',
  'BBC News': 'bg-[#BB1919] text-white',
  'CNN': 'bg-[#CC0000] text-white',
  'Al Jazeera': 'bg-[#009B4D] text-white',
  'Reuters': 'bg-[#FF7300] text-white',
  'CBC': 'bg-[#D02B2B] text-white',
  'CBC News': 'bg-[#D02B2B] text-white',
  'CTV': 'bg-[#1A56DB] text-white',
  'CTV News': 'bg-[#1A56DB] text-white',
  'AP News': 'bg-[#121212] text-white',
  'AP': 'bg-[#121212] text-white',
  'The Guardian': 'bg-[#052962] text-white',
  'Globe and Mail': 'bg-[#1A1A2E] text-white',
  'IRCC': 'bg-[#D4000F] text-white',
  'CIC News': 'bg-[#7C3AED] text-white',
  'National Post': 'bg-[#0A2E52] text-white',
  'Toronto Star': 'bg-[#D22B2B] text-white',
  'Global News': 'bg-[#3B3B8C] text-white',
  'BNN Bloomberg': 'bg-[#F26E22] text-white',
  'Bloomberg': 'bg-[#F26E22] text-white',
};

function getSourceStyle(source) {
  if (!source) return 'bg-muted text-muted-foreground';
  // Try exact match first
  if (SOURCE_STYLES[source]) return SOURCE_STYLES[source];
  // Try partial match
  const key = Object.keys(SOURCE_STYLES).find(k => source.toLowerCase().includes(k.toLowerCase()));
  return key ? SOURCE_STYLES[key] : 'bg-slate-700 text-white';
}

function isRecent(time_ago) {
  if (!time_ago) return false;
  const t = time_ago.toLowerCase();
  return t.includes('min') || t.includes('hr') || t.includes('hour') || t.includes('just now') || t.includes('1 day') || t.includes('2 hr') || t.includes('3 hr');
}

export default function NewsSection({ articles, category }) {
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-sm">No articles found. Click Refresh to load the latest news.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {articles.map((article, i) => {
        const fresh = isRecent(article.time_ago);
        return (
          <a
            key={i}
            href={article.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group bg-card rounded-2xl border p-4 flex flex-col gap-3 hover:shadow-md transition-all",
              article.category === 'breaking' || category === 'breaking'
                ? "border-red-200/60 hover:border-red-300"
                : "border-border/50 hover:border-primary/20"
            )}
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {fresh && (
                  <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full animate-pulse">
                    <Radio className="w-2.5 h-2.5" /> LIVE
                  </span>
                )}
                {article.is_local && (
                  <Badge className="text-xs border px-2 py-0.5 bg-teal-500/10 text-teal-700 border-teal-200 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" /> Local
                  </Badge>
                )}
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/40 flex-shrink-0 group-hover:text-primary transition-colors" />
            </div>

            {/* Headline + Summary */}
            <div>
              <h3 className="font-heading font-bold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-1.5">
                {article.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{article.summary}</p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-auto pt-1">
              <span className={cn("text-xs font-bold px-2 py-0.5 rounded-md", getSourceStyle(article.source))}>
                {article.source}
              </span>
              {article.time_ago && (
                <span className={cn("flex items-center gap-1 text-xs", fresh ? "text-red-500 font-semibold" : "text-muted-foreground")}>
                  <Clock className="w-3 h-3" /> {article.time_ago}
                </span>
              )}
            </div>
          </a>
        );
      })}
    </div>
  );
}