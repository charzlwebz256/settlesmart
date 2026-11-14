import { useState, useCallback, useEffect, useRef, } from 'react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import PullToRefreshIndicator from '@/components/ui/PullToRefreshIndicator';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Newspaper, Zap, Briefcase, Home as HomeIcon, Heart, AlertTriangle, Globe, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PROVINCES, citiesFor } from '@/data/canadaLocations';
import {
  MobileSelect as Select, MobileSelectContent as SelectContent, MobileSelectItem as SelectItem,
  MobileSelectTrigger as SelectTrigger, MobileSelectValue as SelectValue,
} from '@/components/ui/mobile-select';
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
  },
  {
    id: 'immigration',
    label: 'Immigration',
    icon: AlertTriangle,
    color: 'text-purple-600',
    activeBg: 'bg-purple-600 text-white',
  },
  {
    id: 'jobs',
    label: 'Jobs & Economy',
    icon: Briefcase,
    color: 'text-amber-600',
    activeBg: 'bg-amber-600 text-white',
  },
  {
    id: 'housing',
    label: 'Housing',
    icon: HomeIcon,
    color: 'text-emerald-600',
    activeBg: 'bg-emerald-600 text-white',
  },
  {
    id: 'health',
    label: 'Health & Safety',
    icon: Heart,
    color: 'text-rose-600',
    activeBg: 'bg-rose-600 text-white',
  },
];

export default function CanadianNewsUpdates() {
  const { city, province, loading: cityLoading } = useCityDetection();
  const [activeTab, setActiveTab] = useState('breaking');
  const [override, setOverride] = useState(null); // { province, city } chosen in the filter
  const [tabData, setTabData] = useState({}); // { [tabId]: { articles, newcomer_insights, loadedAt } }
  const [loadingTabs, setLoadingTabs] = useState({});
  const loadedRef = useRef({});

  // Detected location until the visitor picks a province or city
  const activeLoc = override || { province: province || '', city: city || '' };
  const locKey = `${activeLoc.province}|${activeLoc.city}`;

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
    const response = await base44.functions.invoke('communityFeeds', {
      action: 'news',
      topic: tabId,
      city: activeLoc.city,
      province: activeLoc.province,
    });
    const result = response.data || {};
    // Filter out any articles older than 7 days by checking time_ago text
    const filtered = (result?.articles || []).map(a => ({
      ...a,
      // Prefer the verified original article link.
      url: a.source_url || a.url,
    })).filter(a => {
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
  }, [locKey]); // eslint-disable-line

  // Reload the visible topic whenever the province/city filter changes
  useEffect(() => {
    if (cityLoading && !override) return;
    loadedRef.current = {};
    setTabData({});
    fetchTab(activeTab);
  }, [locKey, cityLoading]); // eslint-disable-line

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

  // Keep a detected city that isn't in our list selectable
  const cityOptions = activeLoc.province
    ? (activeLoc.city && !citiesFor(activeLoc.province).includes(activeLoc.city)
        ? [activeLoc.city, ...citiesFor(activeLoc.province)]
        : citiesFor(activeLoc.province))
    : [];

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
            <span>BBC, CNN, Al Jazeera, Reuters, CBC, IRCC</span>
            {currentData?.loadedAt && (
              <span className="text-[11px] text-muted-foreground/60">
                Updated {currentData.loadedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

      {/* Location filter, every province and territory in Canada */}
      <div className="bg-card border border-border/50 rounded-2xl px-3 py-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 text-primary" /> News for
          </span>

          <Select
            value={activeLoc.province || 'all'}
            onValueChange={(v) => setOverride({ province: v === 'all' ? '' : v, city: '' })}
          >
            <SelectTrigger className="h-9 w-[85px] flex-shrink-0 rounded-xl border border-input bg-background px-2 text-xs font-medium [&>span]:truncate">
              <SelectValue placeholder="All Canada" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Canada</SelectItem>
              {PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select
            value={activeLoc.city || 'all'}
            onValueChange={(v) => setOverride({ province: activeLoc.province, city: v === 'all' ? '' : v })}
            disabled={!activeLoc.province}
          >
            <SelectTrigger className="h-9 w-auto min-w-[110px] flex-shrink-0 rounded-xl border border-input bg-background px-2.5 text-xs font-medium disabled:opacity-50 [&>span]:whitespace-nowrap">
              <SelectValue placeholder="All cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cities</SelectItem>
              {cityOptions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>

          {override && (
            <button
              onClick={() => setOverride(null)}
              className="text-[11px] font-semibold text-primary hover:underline ml-auto"
            >
              Use my location
            </button>
          )}
        </div>
      </div>

      {/* Weather stays on the visitor's own location, never on the news filter */}
      <div className="mt-3">
        <WeatherWidget city={city || 'Edmonton'} province={province} />
      </div>

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
          <p className="text-xs text-muted-foreground mt-1">Searching BBC, CNN, Al Jazeera, Reuters, CBC, IRCC</p>
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