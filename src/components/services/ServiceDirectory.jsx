import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Loader2, AlertTriangle, RotateCcw, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResourceFilters from './ResourceFilters';
import ServiceCard from './ServiceCard';
import ResourceDetailDialog from './ResourceDetailDialog';

const EMPTY_FILTERS = {
  search: '',
  province: '',
  city: '',
  category: '',
  eligibility: '',
  language: '',
  cost: '',
};

export default function ServiceDirectory({ initialProvince = '', initialCategory = '' }) {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    ...EMPTY_FILTERS,
    province: initialProvince,
    category: initialCategory,
  });
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.search.trim()), 300);
    return () => clearTimeout(t);
  }, [filters.search]);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    staleTime: 1000 * 60 * 10,
  });

  const { data: savedResources = [] } = useQuery({
    queryKey: ['savedResources', user?.id],
    queryFn: () => base44.entities.SavedResource.filter({ created_by_id: user.id }),
    enabled: !!user?.id,
  });

  const savedByService = useMemo(() => {
    const map = {};
    savedResources.forEach(r => { if (r.service_id) map[r.service_id] = r; });
    return map;
  }, [savedResources]);

  // Service carries a field-level read rule, so distinct queries are rejected:
  // read every page and collect the unique values in code instead.
  const { data: filterOptions = { cities: [], languages: [] } } = useQuery({
    queryKey: ['serviceFilterOptions'],
    queryFn: async () => {
      const cities = new Set();
      const languages = new Set();
      let cursor;
      for (let i = 0; i < 20; i++) {
        const page = await base44.entities.Service.list({ limit: 500, cursor });
        (page.items || []).forEach(s => {
          if (s.city) cities.add(s.city);
          (s.languages_offered || []).forEach(l => { if (l) languages.add(l); });
        });
        if (!page.has_more || !page.next_cursor) break;
        cursor = page.next_cursor;
      }
      return { cities: [...cities].sort(), languages: [...languages].sort() };
    },
    staleTime: 1000 * 60 * 30,
  });
  const { cities, languages } = filterOptions;

  const queryKey = ['serviceDirectory', debouncedSearch, filters.province, filters.city, filters.category, filters.eligibility, filters.language, filters.cost];

  const { data: services = [], isLoading, isError, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      const query = {};
      if (debouncedSearch) {
        query.$or = ['name', 'organization', 'description'].map(field => ({
          [field]: { $regex: debouncedSearch, $options: 'i' },
        }));
      }
      if (filters.province) query.province = filters.province;
      if (filters.city) query.city = filters.city;
      if (filters.category) query.category = filters.category;
      if (filters.eligibility) query.eligibility = filters.eligibility;
      if (filters.language) query.languages_offered = filters.language;
      if (filters.cost === 'free') query.is_free = true;
      if (filters.cost === 'paid') query.is_free = false;

      const page = await base44.entities.Service.filter(query, { limit: 200 });
      return (page.items || []).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    },
  });

  const toggleSave = async (service) => {
    const existing = savedByService[service.id];
    if (existing) {
      await base44.entities.SavedResource.delete(existing.id);
    } else {
      await base44.entities.SavedResource.create({ service_id: service.id, status: 'saved' });
    }
    queryClient.invalidateQueries({ queryKey: ['savedResources'] });
  };

  const clearFilters = () => setFilters({ ...EMPTY_FILTERS });

  return (
    <div>
      <ResourceFilters
        filters={filters}
        onChange={setFilters}
        cities={cities}
        languages={languages}
        onClear={clearFilters}
      />

      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <p className="text-xs text-muted-foreground font-medium">
          {isLoading ? 'Searching resources…' : `${services.length} resource${services.length === 1 ? '' : 's'} found`}
        </p>
        <p className="text-[11px] text-muted-foreground/80">
          Verified listings are checked against their official source.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="h-56 rounded-2xl border border-border/50 bg-card animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-14 rounded-2xl border border-border/50 bg-card">
          <AlertTriangle className="w-7 h-7 text-destructive mx-auto mb-3" />
          <p className="font-heading font-semibold text-sm mb-1">We couldn't load the resource directory</p>
          <p className="text-xs text-muted-foreground mb-4">{error?.message || 'Please check your connection and try again.'}</p>
          <Button variant="outline" onClick={() => refetch()} className="rounded-xl gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" /> Try again
          </Button>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-14 rounded-2xl border border-border/50 bg-card">
          <SearchX className="w-8 h-8 text-muted-foreground/60 mx-auto mb-3" />
          <p className="font-heading font-semibold text-sm mb-1">No resources match this search</p>
          <p className="text-xs text-muted-foreground mb-4">
            Try a broader search, another city, or clear your filters.
          </p>
          <Button variant="outline" onClick={clearFilters} className="rounded-xl">Clear filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              saved={!!savedByService[service.id]}
              onSave={toggleSave}
              onOpen={setDetail}
            />
          ))}
        </div>
      )}

      <ResourceDetailDialog
        service={detail}
        open={!!detail}
        onOpenChange={(v) => { if (!v) setDetail(null); }}
        saved={!!(detail && savedByService[detail.id])}
        onToggleSave={toggleSave}
      />
    </div>
  );
}