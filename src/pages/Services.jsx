import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Search, Filter, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { MobileSelect as Select, MobileSelectContent as SelectContent, MobileSelectItem as SelectItem, MobileSelectTrigger as SelectTrigger, MobileSelectValue as SelectValue } from '@/components/ui/mobile-select';
import { cn } from '@/lib/utils';
import ServiceCard from '../components/services/ServiceCard';
import StaticCategoryPanel from '../components/services/StaticCategoryPanel';

const categories = [
  { value: 'all', label: 'All Services' },
  { value: 'settlement', label: '🧭 Settlement' },
  { value: 'education', label: '🎓 Education' },
  { value: 'language', label: '💬 Language' },
  { value: 'employment', label: '💼 Employment' },
  { value: 'housing', label: '🏠 Housing' },
  { value: 'legal', label: '⚖️ Legal' },
  { value: 'health', label: '🧠 Health' },
  { value: 'transportation', label: '🚌 Transport' },
  { value: 'volunteering', label: '🤝 Volunteering' },
  { value: 'family_support', label: '👨‍👩‍👧‍👦 Family' },
];

export default function Services() {
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedProvince, setSelectedProvince] = useState('all');

  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => base44.entities.Service.list('-created_date', 200),
    initialData: [],
  });

  const { data: savedResources } = useQuery({
    queryKey: ['savedResources'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.SavedResource.filter({ created_by: user.email });
    },
    initialData: [],
  });

  const savedIds = new Set(savedResources.map(r => r.service_id));

  const saveMutation = useMutation({
    mutationFn: async (service) => {
      if (savedIds.has(service.id)) {
        const existing = savedResources.find(r => r.service_id === service.id);
        if (existing) await base44.entities.SavedResource.delete(existing.id);
      } else {
        await base44.entities.SavedResource.create({ service_id: service.id });
      }
    },
    onMutate: async (service) => {
      await queryClient.cancelQueries({ queryKey: ['savedResources'] });
      const previous = queryClient.getQueryData(['savedResources']);
      if (savedIds.has(service.id)) {
        queryClient.setQueryData(['savedResources'], old =>
          (old || []).filter(r => r.service_id !== service.id)
        );
      } else {
        queryClient.setQueryData(['savedResources'], old =>
          [...(old || []), { service_id: service.id, id: `optimistic-${service.id}` }]
        );
      }
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(['savedResources'], ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['savedResources'] }),
  });

  const handleSave = (service) => saveMutation.mutate(service);

  const provinces = useMemo(() => {
    const set = new Set(services.map(s => s.province).filter(Boolean));
    return ['all', ...Array.from(set).sort()];
  }, [services]);

  const filtered = useMemo(() => {
    return services.filter(s => {
      const catMatch = selectedCategory === 'all' || s.category === selectedCategory;
      const provMatch = selectedProvince === 'all' || s.province === selectedProvince;
      const searchMatch = !searchQuery ||
        s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.organization?.toLowerCase().includes(searchQuery.toLowerCase());
      return catMatch && provMatch && searchMatch;
    });
  }, [services, selectedCategory, selectedProvince, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-24 md:pb-8">
      <div className="mb-8">
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-2">Settlement Services</h1>
        <p className="text-muted-foreground text-sm">Browse free services for newcomers across Canada</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search services, organizations, or keywords..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-11 h-12 rounded-xl border-border/50 bg-card"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
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

      {/* Province Filter */}
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <Select value={selectedProvince} onValueChange={setSelectedProvince}>
          <SelectTrigger className="w-44 min-h-[44px] rounded-xl text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent label="Filter by Province">
            {provinces.map(p => (
              <SelectItem key={p} value={p}>{p === 'all' ? 'All Provinces' : p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground ml-auto">{filtered.length} results</span>
      </div>

      {/* Static category panels for rich data tabs */}
      {['language', 'education', 'legal', 'health', 'transportation', 'housing', 'volunteering', 'family_support'].includes(selectedCategory) && !searchQuery ? (
        <StaticCategoryPanel category={selectedCategory} />
      ) : isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🔍</p>
          <h3 className="font-heading font-bold text-lg mb-2">No services found</h3>
          <p className="text-muted-foreground text-sm">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              onSave={handleSave}
              saved={savedIds.has(service.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}