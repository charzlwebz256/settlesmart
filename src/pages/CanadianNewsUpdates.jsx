import { useState, useCallback, useEffect, useRef, } from 'react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import PullToRefreshIndicator from '@/components/ui/PullToRefreshIndicator';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Newspaper, Zap, Briefcase, Home as HomeIcon, Heart, AlertTriangle, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCityDetection } from '@/hooks/useCityDetection';
import NewsSection from '@/components/news/NewsSection';
import WeatherWidget from '@/components/news/WeatherWidget';
import NewcomerInsights from '@/components/news/NewcomerInsights';

const TABS = [
  {
    id: 'breaking',
    label: 'Breaking',
    icon: Zap,
    color: 'text-red-600',
    activeBg: 'bg-red-600 text-white',
    prompt: (loc, prov) => `You are a LIVE breaking news reporter. Today is ${new Date().toISOString()}. Search for the MOST URGENT breaking news stories published in the LAST 6 HOURS globally and in Canada. CRITICAL: Only include stories published within the last 7 days. For each article, provide an EXACT time_ago in format like "12 minutes ago", "3 hours ago", "2 days ago". Do NOT include stories older than 7 days.

Location context: ${loc}, ${prov || 'Canada'}

Sources to search: BBC News (bbc.com), CNN (cnn.com), Reuters (reuters.com), Al Jazeera (aljazeera.com), CBC News (cbc.ca), CTV News, AP News, The Guardian, Globe and Mail, National Post.

Return 10 breaking news stories published TODAY — prioritize stories from the last 1-6 hours. Include: major world events, Canadian emergencies, political crises, natural disasters, major policy changes, major crimes, wars/conflicts, economic shocks.

For each: exact real headline, 2-sentence factual summary, source name, realistic time_ago (e.g. "12 min ago", "2 hrs ago", "4 hrs ago"), real or likely URL, is_local flag.

Also return 3 newcomer_insights: what these breaking stories mean for newcomers in Canada specifically.`,
  },
  {
    id: 'immigration',
    label: 'Immigration',
    icon: AlertTriangle,
    color: 'text-purple-600',
    activeBg: 'bg-purple-600 text-white',
    prompt: (loc, prov) => `You are an immigration news specialist. Today is ${new Date().toISOString()}. Search for the LATEST immigration and visa policy news from the last 48 hours. CRITICAL: Only include stories published within the last 7 days. For each article, provide an EXACT time_ago in format like "45 minutes ago", "6 hours ago", "1 day ago". Do NOT include stories older than 7 days.

Sources: IRCC Canada (canada.ca/ircc), CIC News (cicnews.com), Immigration.ca, CBC News, Reuters, BBC, Al Jazeera, Globe and Mail.

Return 10 immigration stories — must include:
- IRCC Express Entry draws, PNP updates, work permit changes
- International student policy changes
- Refugee and asylum updates globally
- Visa policy changes for any country affecting newcomers
- Immigration court rulings or policy shifts
- Travel advisories affecting immigrants

Each article: exact headline, 2-sentence factual summary, source name, realistic time_ago (hours/days ago), URL, is_local (Canada-specific = true).

Also return 3 newcomer_insights specific to immigration impacts.`,
  },
  {
    id: 'jobs',
    label: 'Jobs & Economy',
    icon: Briefcase,
    color: 'text-amber-600',
    activeBg: 'bg-amber-600 text-white',
    prompt: (loc, prov) => `You are a jobs and economy reporter. Today is ${new Date().toISOString()}. Search for LATEST jobs and economic news published in last 48 hours. CRITICAL: Only include stories published within the last 7 days. For each article, provide an EXACT time_ago in format like "30 minutes ago", "4 hours ago", "3 days ago". Do NOT include stories older than 7 days.

Location: ${loc}, ${prov || 'Canada'}

Sources: Statistics Canada, CBC News, BNN Bloomberg, Globe and Mail, Financial Post, Reuters, BBC Business, CNN Business, Indeed Canada, LinkedIn News.

Return 10 economy/jobs stories — must include:
- Canadian employment data, job numbers, unemployment stats
- Minimum wage changes by province
- Major layoffs or hiring announcements
- Cost of living, inflation, grocery price changes
- Canadian dollar / interest rate news
- Major company news affecting workers in Canada
- Gig economy / newcomer employment opportunities

Each article: exact headline, 2-sentence factual summary, source, realistic time_ago, URL, is_local.

Return 3 newcomer_insights about what these economic stories mean for newcomers job-hunting in Canada.`,
  },
  {
    id: 'housing',
    label: 'Housing',
    icon: HomeIcon,
    color: 'text-emerald-600',
    activeBg: 'bg-emerald-600 text-white',
    prompt: (loc, prov) => `You are a housing and real estate reporter. Today is ${new Date().toISOString()}. Search for the LATEST housing and real estate news from the last 48-72 hours. CRITICAL: Only include stories published within the last 7 days. For each article, provide an EXACT time_ago in format like "1 hour ago", "5 hours ago", "4 days ago". Do NOT include stories older than 7 days.

Location focus: ${loc}, ${prov || 'Canada'} — but include national news.

Sources: CBC News, CTV News, Globe and Mail, Toronto Star, CMHC Canada, Canada Mortgage Housing, Bloomberg, Reuters, local real estate boards.

Return 10 housing stories — must include:
- Rent price changes and rental market updates
- Home buying/selling market data
- Eviction protection news
- Affordable housing programs (federal, provincial, municipal)
- Shelter and housing support for newcomers
- Mortgage rate changes
- New housing construction announcements

Each article: exact headline, 2-sentence factual summary, source, realistic time_ago, URL, is_local.

Return 3 newcomer_insights about housing tips and what these stories mean for newly arrived immigrants renting or buying.`,
  },
  {
    id: 'health',
    label: 'Health & Safety',
    icon: Heart,
    color: 'text-rose-600',
    activeBg: 'bg-rose-600 text-white',
    prompt: (loc, prov) => `You are a health and safety reporter. Today is ${new Date().toISOString()}. Search for LATEST health and safety news from the last 48 hours globally and in Canada. CRITICAL: Only include stories published within the last 7 days. For each article, provide an EXACT time_ago in format like "20 minutes ago", "2 hours ago", "6 days ago". Do NOT include stories older than 7 days.

Location: ${loc}, ${prov || 'Canada'}

Sources: Health Canada, CBC News, WHO (who.int), Reuters Health, BBC Health, CNN Health, Al Jazeera, Canadian Press, provincial health authorities.

Return 10 health & safety stories — must include:
- Disease outbreaks, pandemics, new health alerts
- Drug recalls or food safety warnings in Canada
- Mental health resources and announcements
- Healthcare system updates (wait times, doctor shortages, OHIP/provincial health coverage news)
- Vaccines, immunization program updates
- Global health emergencies affecting Canada
- Safety alerts (weather, crime, environmental hazards) in ${prov || 'Canada'}

Each article: exact headline, 2-sentence factual summary, source, realistic time_ago, URL, is_local.

Return 3 newcomer_insights about health/safety topics newcomers should know.`,
  },
];

const ARTICLE_SCHEMA = {
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
};

export default function CanadianNewsUpdates() {
  const { city, province, loading: cityLoading } = useCityDetection();
  const [activeTab, setActiveTab] = useState('breaking');
  const [tabData, setTabData] = useState({}); // { [tabId]: { articles, newcomer_insights, loadedAt } }
  const [loadingTabs, setLoadingTabs] = useState({});
  const loadedRef = useRef({});

  // Live clock tick for "X ago" freshness display
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 30000);
    return () => clearInterval(t);
  }, []);

  const fetchTab = useCallback(async (tabId) => {
    const tab = TABS.find(t => t.id === tabId);
    if (!tab) return;
    setLoadingTabs(prev => ({ ...prev, [tabId]: true }));
    const loc = city || 'Edmonton';
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: tab.prompt(loc, province),
      add_context_from_internet: true,
      response_json_schema: ARTICLE_SCHEMA,
    });
    // Filter out any articles older than 7 days by checking time_ago text
    const filtered = (result?.articles || []).filter(a => {
      if (!a.time_ago) return true;
      const t = a.time_ago.toLowerCase();
      // Reject anything explicitly saying 8+ days, weeks, months
      if (/(\d+)\s*(week|month|year)/.test(t)) return false;
      const dayMatch = t.match(/(\d+)\s*day/);
      if (dayMatch && parseInt(dayMatch[1]) > 7) return false;
      return true;
    });
    setTabData(prev => ({ ...prev, [tabId]: { ...result, articles: filtered, loadedAt: new Date() } }));
    setLoadingTabs(prev => ({ ...prev, [tabId]: false }));
    loadedRef.current[tabId] = true;
  }, [city, province]);

  // Auto-load breaking news on mount
  useEffect(() => {
    if (!cityLoading && !loadedRef.current['breaking']) {
      fetchTab('breaking');
    }
  }, [cityLoading]); // eslint-disable-line

  // Load tab when switching if not yet loaded
  const handleTabSwitch = (tabId) => {
    setActiveTab(tabId);
    if (!loadedRef.current[tabId] && !loadingTabs[tabId]) {
      fetchTab(tabId);
    }
  };

  const { containerRef, pullDistance, isRefreshing, touchHandlers } = usePullToRefresh({
    onRefresh: () => fetchTab(activeTab),
  });

  const currentData = tabData[activeTab];
  const isLoading = loadingTabs[activeTab];
  const currentTab = TABS.find(t => t.id === activeTab);

  return (
    <div ref={containerRef} className="max-w-5xl mx-auto px-4 py-6 pb-24 md:pb-8 overflow-y-auto" {...touchHandlers}>
      <PullToRefreshIndicator pullDistance={pullDistance} isRefreshing={isRefreshing} />

      {/* Header */}
      <div className="mb-5 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl mb-1 flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary" />
            News & Updates
          </h1>
          <p className="text-muted-foreground text-sm flex items-center gap-1.5 flex-wrap">
            <span>BBC · CNN · Al Jazeera · Reuters · CBC · IRCC</span>
            {currentData?.loadedAt && (
              <span className="text-[11px] text-muted-foreground/60">
                · Updated {currentData.loadedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </p>
        </div>
        <Button
          onClick={() => fetchTab(activeTab)}
          disabled={isLoading}
          className="rounded-xl gap-2 bg-primary"
          size="sm"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Refresh
        </Button>
      </div>

      {/* Weather */}
      <WeatherWidget city={city || 'Edmonton'} province={province} />

      {/* Tab Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 mt-5 mb-4 scrollbar-hide">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const hasData = !!tabData[tab.id];
          const isTabLoading = loadingTabs[tab.id];
          return (
            <button
              key={tab.id}
              onClick={() => handleTabSwitch(tab.id)}
              className={cn(
                "flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap relative",
                isActive ? tab.activeBg : "bg-card border border-border/50 text-muted-foreground hover:border-primary/30"
              )}
            >
              {isTabLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Icon className="w-3.5 h-3.5" />
              )}
              {tab.label}
              {hasData && !isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary absolute -top-0.5 -right-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm font-medium">Fetching latest {currentTab?.label} news...</p>
          <p className="text-xs text-muted-foreground mt-1">Searching BBC · CNN · Al Jazeera · Reuters · CBC · IRCC</p>
        </div>
      )}

      {/* No data yet */}
      {!isLoading && !currentData && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">
            {activeTab === 'breaking' ? '⚡' : activeTab === 'immigration' ? '🛂' : activeTab === 'jobs' ? '💼' : activeTab === 'housing' ? '🏠' : '🏥'}
          </div>
          <h3 className="font-heading font-bold text-lg mb-2">Load {currentTab?.label} News</h3>
          <p className="text-muted-foreground text-sm mb-6">Get the latest {currentTab?.label?.toLowerCase()} updates from global and Canadian sources.</p>
          <Button onClick={() => fetchTab(activeTab)} className="rounded-xl gap-2 bg-primary">
            <Newspaper className="w-4 h-4" /> Load Now
          </Button>
        </div>
      )}

      {/* Content */}
      {!isLoading && currentData && (
        <div className="space-y-6">
          {currentData.newcomer_insights?.length > 0 && (
            <NewcomerInsights insights={currentData.newcomer_insights} />
          )}
          <NewsSection articles={currentData.articles || []} category={activeTab} />
        </div>
      )}
    </div>
  );
}