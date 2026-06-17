import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import PullToRefreshIndicator from '@/components/ui/PullToRefreshIndicator';
import { base44 } from '@/api/base44Client';
import { Loader2, MapPin, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProvinceServicePanel from '../components/services/ProvinceServicePanel';
import { useLocation_ } from '@/lib/LocationContext';
import { PROVINCES, PROVINCE_EMOJIS } from '@/lib/provinceServicesData';

const categories = [
  { value: 'settlement', label: '🧭 Settlement' },
  { value: 'education', label: '🎓 Education' },
  { value: 'language', label: '💬 Language' },
  { value: 'employment', label: '💼 Employment' },
  { value: 'housing', label: '🏠 Housing' },
  { value: 'legal', label: '⚖️ Legal' },
  { value: 'health', label: '🧠 Health' },
  { value: 'transport', label: '🚌 Transport' },
  { value: 'volunteering', label: '🤝 Volunteering' },
];

export default function Services() {
  const queryClient = useQueryClient();

  const handleRefresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['savedResources'] });
  }, [queryClient]);

  const { containerRef, pullDistance, isRefreshing, touchHandlers } = usePullToRefresh({ onRefresh: handleRefresh });
  const { city: locationCity, province: locationProvince } = useLocation_();
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category') || 'settlement';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [sortBy, setSortBy] = useState('section'); // 'section' | 'city' | 'name'

  const { data: profile } = useQuery({
    queryKey: ['myProfile'],
    queryFn: async () => {
      const user = await base44.auth.me();
      const results = await base44.entities.UserProfile.filter({ created_by: user.email });
      return results[0] || null;
    },
  });

  // Auto-apply province from profile or GPS detection
  useEffect(() => {
    if (selectedProvince) return;
    const province = profile?.province || locationProvince;
    if (province) setSelectedProvince(province);
    else setSelectedProvince('Ontario'); // default fallback
  }, [profile, locationProvince, selectedProvince]);

  const { data: savedResources } = useQuery({
    queryKey: ['savedResources'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.SavedResource.filter({ created_by: user.email });
    },
    initialData: [],
  });

  const categoryKey = selectedCategory;

  const sortOptions = [
    { value: 'section', label: 'By Category Group' },
    { value: 'city', label: 'By City' },
    { value: 'name', label: 'By Name (A–Z)' },
  ];

  return (
    <div ref={containerRef} {...touchHandlers} className="max-w-7xl mx-auto px-4 py-6 pb-8">
      <PullToRefreshIndicator pullDistance={pullDistance} isRefreshing={isRefreshing} />

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-1">Settlement Services</h1>
        <p className="text-muted-foreground text-sm">Find services for newcomers across all Canadian provinces</p>
      </div>

      {/* Province Selector */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          Select Province / Territory
          {(profile?.province || locationProvince) && (
            <span className="text-[10px] font-normal normal-case text-primary/70 bg-primary/8 px-2 py-0.5 rounded-md ml-1">
              {profile?.province ? 'from your profile' : 'detected location'}
            </span>
          )}
        </p>
        <div className="flex flex-wrap gap-2">
          {PROVINCES.map(p => (
            <button
              key={p}
              onClick={() => setSelectedProvince(p)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border",
                selectedProvince === p
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
              )}
            >
              <span>{PROVINCE_EMOJIS[p] || '🍁'}</span>
              <span className="hidden sm:inline">{p}</span>
              <span className="sm:hidden">{p.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Category Tabs + Sort Row */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
                selectedCategory === cat.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border/50 text-muted-foreground hover:border-primary/30"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort Control */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          <span className="text-xs text-muted-foreground font-medium">Sort by:</span>
          <div className="flex gap-1.5 flex-wrap">
            {sortOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border",
                  sortBy === opt.value
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-card border-border/50 text-muted-foreground hover:border-primary/20 hover:text-foreground"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Province + Category Banner */}
      {selectedProvince && (
        <div className="flex items-center gap-2 mb-5 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
          <span className="text-xl">{PROVINCE_EMOJIS[selectedProvince] || '🍁'}</span>
          <div>
            <p className="font-heading font-bold text-sm text-foreground">{selectedProvince}</p>
            <p className="text-xs text-muted-foreground">
              Showing {categories.find(c => c.value === selectedCategory)?.label?.replace(/^\S+\s/, '')} services
            </p>
          </div>
          <a
            href="https://ircc.canada.ca/english/newcomers/services/index.asp"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-xs text-primary font-semibold hover:underline"
          >
            IRCC Directory →
          </a>
        </div>
      )}

      {/* Province Service Panel */}
      {selectedProvince ? (
        <ProvinceServicePanel category={categoryKey} province={selectedProvince} sortBy={sortBy} />
      ) : (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}