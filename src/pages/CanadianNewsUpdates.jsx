import { useState, useCallback } from 'react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import PullToRefreshIndicator from '@/components/ui/PullToRefreshIndicator';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Newspaper, CloudSun, Zap, TrendingUp, Home as HomeIcon, Heart, Briefcase, Scale, AlertTriangle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCityDetection } from '@/hooks/useCityDetection';
import NewsSection from '@/components/news/NewsSection';
import WeatherWidget from '@/components/news/WeatherWidget';
import NewcomerInsights from '@/components/news/NewcomerInsights';

const CATEGORIES = [
  { id: 'all', label: 'All News', icon: Newspaper },
  { id: 'breaking', label: 'Breaking', icon: Zap },
  { id: 'immigration', label: 'Immigration', icon: AlertTriangle },
  { id: 'jobs', label: 'Jobs & Economy', icon: Briefcase },
  { id: 'housing', label: 'Housing', icon: HomeIcon },
  { id: 'health', label: 'Health & Safety', icon: Heart },
];

export default function CanadianNewsUpdates() {
  const { city, province } = useCityDetection();
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    const loc = city || 'Edmonton';
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a Canadian news aggregator. Search for today's latest news from CBC News, CTV News, Global News, Edmonton Journal, and CityNews Edmonton.

Find current news stories for ${loc}, ${province || 'Alberta'}, Canada (date: ${new Date().toDateString()}).

Return 12 news items total covering these categories:
- 2 breaking news stories (most urgent/recent)
- 3 immigration & policy updates (IRCC, government policy changes)
- 3 jobs & economy stories (employment, wages, businesses)  
- 2 housing & cost of living stories
- 2 health & safety stories

Also return a "newcomer_insights" array of 3 short plain-language tips explaining what the top stories mean for newcomers.

For each news item return: title, summary (2 sentences max), category (breaking/immigration/jobs/housing/health), source (CBC/CTV/GlobalNews/EdmontonJournal/CityNews), url, time_ago (e.g. "2 hours ago"), is_local (true if Edmonton/Alberta specific).`,
      add_context_from_internet: true,
      response_json_schema: {
        type: 'object',
        properties: {
          articles: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                summary: { type: 'string' },
                category: { type: 'string' },
                source: { type: 'string' },
                url: { type: 'string' },
                time_ago: { type: 'string' },
                is_local: { type: 'boolean' },
              },
            },
          },
          newcomer_insights: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                headline: { type: 'string' },
                insight: { type: 'string' },
                category: { type: 'string' },
              },
            },
          },
        },
      },
    });
    setNewsData(result);
    setLastUpdated(new Date());
    setLoading(false);
  }, [city, province]);

  const { containerRef, pullDistance, isRefreshing, touchHandlers } = usePullToRefresh({
    onRefresh: fetchNews,
  });

  const filteredArticles = newsData?.articles?.filter(a =>
    activeCategory === 'all' || a.category === activeCategory
  ) || [];

  return (
    <div ref={containerRef} className="max-w-5xl mx-auto px-4 py-6 pb-24 md:pb-8 overflow-y-auto" {...touchHandlers}>
      <PullToRefreshIndicator pullDistance={pullDistance} isRefreshing={isRefreshing} />
      {/* Header */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl mb-1 flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-primary" />
            News & Updates
          </h1>
          <p className="text-muted-foreground text-sm">
            Live news from CBC, CTV, Global News & Edmonton outlets
            {lastUpdated && (
              <span className="ml-2 text-[11px] text-muted-foreground/60">
                · Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </p>
        </div>
        <Button
          onClick={fetchNews}
          disabled={loading}
          className="rounded-xl gap-2 bg-primary"
          size="sm"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          {newsData ? 'Refresh' : 'Load News'}
        </Button>
      </div>

      {/* Weather Widget */}
      <WeatherWidget city={city || 'Edmonton'} province={province} />

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 my-5 scrollbar-hide">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border/50 text-muted-foreground hover:border-primary/30"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Not loaded state */}
      {!loading && !newsData && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📰</div>
          <h3 className="font-heading font-bold text-lg mb-2">Load Today's News</h3>
          <p className="text-muted-foreground text-sm mb-6">Get live updates from trusted Canadian news sources, tailored for newcomers.</p>
          <Button onClick={fetchNews} className="rounded-xl gap-2 bg-primary">
            <Newspaper className="w-4 h-4" /> Load News Feed
          </Button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm font-medium">Fetching live news from Canadian outlets...</p>
          <p className="text-xs text-muted-foreground mt-1">CBC, CTV, Global News, Edmonton Journal</p>
        </div>
      )}

      {/* News content */}
      {!loading && newsData && (
        <div className="space-y-6">
          {/* Newcomer Insights */}
          {newsData.newcomer_insights?.length > 0 && (
            <NewcomerInsights insights={newsData.newcomer_insights} />
          )}

          {/* Articles */}
          <NewsSection articles={filteredArticles} category={activeCategory} />
        </div>
      )}
    </div>
  );
}