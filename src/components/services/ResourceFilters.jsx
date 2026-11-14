import { Search, X } from 'lucide-react';
import { MobileSelect as Select, MobileSelectContent as SelectContent, MobileSelectItem as SelectItem, MobileSelectTrigger as SelectTrigger, MobileSelectValue as SelectValue } from '@/components/ui/mobile-select';
import { PROVINCES, PROVINCE_EMOJIS } from '@/lib/provinceServicesData';

const NONE = '__none__';

export const ELIGIBILITY_OPTIONS = [
  { value: 'permanent_resident', label: 'Permanent Resident' },
  { value: 'refugee', label: 'Refugee' },
  { value: 'asylum_seeker', label: 'Asylum Seeker' },
  { value: 'international_student', label: 'International Student' },
  { value: 'temporary_worker', label: 'Temporary Worker' },
  { value: 'citizen', label: 'Citizen' },
];

export const CATEGORY_OPTIONS = [
  { value: 'settlement', label: '🧭 Settlement' },
  { value: 'education', label: '🎓 Education' },
  { value: 'language', label: '💬 Language' },
  { value: 'employment', label: '💼 Employment' },
  { value: 'housing', label: '🏠 Housing' },
  { value: 'legal', label: '⚖️ Legal' },
  { value: 'health', label: '🧠 Health' },
  { value: 'transportation', label: '🚌 Transportation' },
  { value: 'volunteering', label: '🤝 Volunteering' },
  { value: 'family_support', label: '👨‍👩‍👧 Family Support' },
  { value: 'financial', label: '💰 Financial' },
];

function FilterSelect({ label, value, onChange, placeholder, options }) {
  return (
    <div className="flex-1 min-w-[150px]">
      <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">{label}</label>
      <Select value={value || NONE} onValueChange={(v) => onChange(v === NONE ? '' : v)}>
        <SelectTrigger className="bg-card border border-border/70 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary/30">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE}>{placeholder}</SelectItem>
          {options.map(o => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default function ResourceFilters({ filters, onChange, cities = [], languages = [], onClear }) {
  const set = (key) => (value) => onChange({ ...filters, [key]: value, ...(key === 'province' ? { city: '' } : {}) });
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-4 shadow-sm mb-5">
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={filters.search}
          onChange={e => onChange({ ...filters, search: e.target.value })}
          placeholder="Search by service name, organization or description…"
          className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-border/60 bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        {filters.search && (
          <button
            onClick={() => onChange({ ...filters, search: '' })}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <FilterSelect
          label="Province"
          value={filters.province}
          onChange={set('province')}
          placeholder="All provinces"
          options={PROVINCES.map(p => ({ value: p, label: `${PROVINCE_EMOJIS[p] || '🍁'} ${p}` }))}
        />
        <FilterSelect
          label="City"
          value={filters.city}
          onChange={set('city')}
          placeholder={filters.province ? 'All cities' : 'All cities'}
          options={cities.map(c => ({ value: c, label: c }))}
        />
        <FilterSelect
          label="Category"
          value={filters.category}
          onChange={set('category')}
          placeholder="All categories"
          options={CATEGORY_OPTIONS}
        />
        <FilterSelect
          label="Eligibility"
          value={filters.eligibility}
          onChange={set('eligibility')}
          placeholder="Anyone"
          options={ELIGIBILITY_OPTIONS}
        />
        <FilterSelect
          label="Language"
          value={filters.language}
          onChange={set('language')}
          placeholder="Any language"
          options={languages.map(l => ({ value: l, label: l }))}
        />
        <FilterSelect
          label="Cost"
          value={filters.cost}
          onChange={set('cost')}
          placeholder="Free or paid"
          options={[{ value: 'free', label: 'Free' }, { value: 'paid', label: 'Paid' }]}
        />
      </div>

      {hasFilters && (
        <button
          onClick={onClear}
          className="mt-3 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}