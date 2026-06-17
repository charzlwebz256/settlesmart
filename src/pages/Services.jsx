import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import PullToRefreshIndicator from '@/components/ui/PullToRefreshIndicator';
import { base44 } from '@/api/base44Client';
import { MapPin, ChevronDown } from 'lucide-react';
import ProvinceServicePanel from '../components/services/ProvinceServicePanel';
import { useLocation_ } from '@/lib/LocationContext';
import { PROVINCES, PROVINCE_EMOJIS, PROVINCE_DATA } from '@/lib/provinceServicesData';

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

function SelectField({ label, icon, value, onChange, options, placeholder }) {
  return (
    <div className="flex-1 min-w-[180px]">
      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
        {icon} {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full appearance-none bg-card border border-border/70 rounded-xl px-4 py-2.5 pr-9 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 cursor-pointer"
        >
          <option value="">{placeholder}</option>
          {options.map(opt => (
            <option key={opt.value ?? opt} value={opt.value ?? opt}>
              {opt.label ?? opt}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
}

export default function Services() {
  const queryClient = useQueryClient();
  const handleRefresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['savedResources'] });
  }, [queryClient]);

  const { containerRef, pullDistance, isRefreshing, touchHandlers } = usePullToRefresh({ onRefresh: handleRefresh });
  const { province: locationProvince } = useLocation_();
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category') || '';

  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [hasManuallySelectedProvince, setHasManuallySelectedProvince] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['myProfile'],
    queryFn: async () => {
      const user = await base44.auth.me();
      const results = await base44.entities.UserProfile.filter({ created_by: user.email });
      return results[0] || null;
    },
  });

  // Auto-set province from profile or GPS (only if user hasn't manually selected)
  useEffect(() => {
    if (hasManuallySelectedProvince) return;
    const province = profile?.province || locationProvince;
    if (province && !selectedProvince) {
      setSelectedProvince(province);
    }
  }, [profile, locationProvince, selectedProvince, hasManuallySelectedProvince]);

  // Reset city when province changes (preserve category)
  useEffect(() => {
    setSelectedCity('');
  }, [selectedProvince]);

  // Derive available cities from the selected province's data
  const provinceData = selectedProvince ? PROVINCE_DATA[selectedProvince] : null;
  const availableCities = (() => {
    if (!provinceData) return [];
    const allItems = Object.values(provinceData).flat();
    const cities = [...new Set(allItems.map(i => i.city).filter(c => c && c !== 'Province-Wide'))].sort();
    return cities;
  })();

  const canSearch = selectedProvince && selectedCategory;

  return (
    <div ref={containerRef} {...touchHandlers} className="max-w-4xl mx-auto px-4 py-6 pb-8">
      <PullToRefreshIndicator pullDistance={pullDistance} isRefreshing={isRefreshing} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-1">Settlement Services</h1>
        <p className="text-muted-foreground text-sm">Select your location and the type of service you need</p>
      </div>

      {/* Filter card */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm mb-6">
        <div className="flex flex-wrap gap-4">
          {/* Province */}
          <SelectField
            label="Province / Territory"
            icon={<MapPin className="w-3.5 h-3.5 text-primary" />}
            value={selectedProvince}
            onChange={(value) => {
              setSelectedProvince(value);
              setHasManuallySelectedProvince(true);
            }}
            placeholder="Select a province…"
            options={PROVINCES.map(p => ({ value: p, label: `${PROVINCE_EMOJIS[p] || '🍁'} ${p}` }))}
          />

          {/* City */}
          <SelectField
            label="City (optional)"
            icon="📍"
            value={selectedCity}
            onChange={setSelectedCity}
            placeholder={selectedProvince && availableCities.length > 0 ? 'Select a city (optional)' : 'Select province first'}
            options={availableCities.map(c => ({ value: c, label: c }))}
          />

          {/* Service type */}
          <SelectField
            label="Service Type"
            icon="🗂️"
            value={selectedCategory}
            onChange={setSelectedCategory}
            placeholder="Select a service…"
            options={categories.map(c => ({ value: c.value, label: c.label }))}
          />
        </div>

        {/* Selection summary */}
        {(selectedProvince || selectedCategory) && (
          <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              {selectedProvince && (
                <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {PROVINCE_EMOJIS[selectedProvince] || '🍁'} {selectedProvince}
                </span>
              )}
              {selectedCity && (
                <span className="text-xs font-semibold bg-muted text-muted-foreground px-3 py-1 rounded-full">
                  📍 {selectedCity}
                </span>
              )}
              {selectedCategory && (
                <span className="text-xs font-semibold bg-accent/10 text-accent px-3 py-1 rounded-full">
                  {categories.find(c => c.value === selectedCategory)?.label}
                </span>
              )}
            </div>
            {(selectedProvince || selectedCategory || selectedCity) && (
              <button
                onClick={() => { setSelectedProvince(''); setSelectedCity(''); setSelectedCategory(''); }}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors font-medium"
              >
                Clear all
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      {!canSearch ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-5xl mb-4">🗂️</p>
          <p className="font-heading font-bold text-base mb-1">Choose your location &amp; service</p>
          <p className="text-sm">Select a province and service type above to browse resources</p>
        </div>
      ) : (
        <ProvinceServicePanel
          category={selectedCategory}
          province={selectedProvince}
          cityFilter={selectedCity}
        />
      )}
    </div>
  );
}