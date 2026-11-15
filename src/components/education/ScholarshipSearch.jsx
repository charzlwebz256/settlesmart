import { useState, useMemo, useEffect } from 'react';
import { Search, ExternalLink, GraduationCap, MapPin, Wallet, X } from 'lucide-react';
import { SCHOLARSHIPS_BY_PROVINCE, SECTION_META } from '@/data/scholarshipsData';
import { cn } from '@/lib/utils';
import {
  MobileSelect as Select, MobileSelectContent as SelectContent, MobileSelectItem as SelectItem,
  MobileSelectTrigger as SelectTrigger, MobileSelectValue as SelectValue,
} from '@/components/ui/mobile-select';

// Cities newcomers most often settle in, per province.
const PROVINCE_CITIES = {
  'Ontario': ['Toronto', 'Ottawa', 'Hamilton', 'London', 'Waterloo', 'Kingston', 'Mississauga', 'Windsor'],
  'Alberta': ['Calgary', 'Edmonton', 'Lethbridge', 'Red Deer'],
  'Saskatchewan': ['Saskatoon', 'Regina', 'Moose Jaw', 'Prince Albert'],
  'Nova Scotia': ['Halifax', 'Sydney', 'Truro', 'Wolfville'],
  'Quebec': ['Montreal', 'Quebec City', 'Sherbrooke', 'Laval', 'Gatineau'],
  'Manitoba': ['Winnipeg', 'Brandon', 'Steinbach'],
  'British Columbia': ['Vancouver', 'Victoria', 'Kelowna', 'Surrey', 'Burnaby', 'Kamloops'],
  'Newfoundland & Labrador': ["St. John's", 'Corner Brook', 'Gander'],
  'New Brunswick': ['Fredericton', 'Moncton', 'Saint John', 'Sackville'],
  'Prince Edward Island': ['Charlottetown', 'Summerside'],
};

// Every listed opportunity, flattened with the province, city and funding type it belongs to.
const ALL_AWARDS = SCHOLARSHIPS_BY_PROVINCE.flatMap((province) =>
  province.sections.flatMap((section) =>
    section.items.map((item) => ({
      ...item,
      province: province.province,
      regionCity: province.city,
      type: section.type,
    }))
  )
);

const PROVINCE_OPTIONS = SCHOLARSHIPS_BY_PROVINCE.map((p) => p.province);
const TYPE_OPTIONS = Object.entries(SECTION_META).map(([value, meta]) => ({ value, label: meta.label }));

export default function ScholarshipSearch({ initialProvince = 'all' }) {
  const [search, setSearch] = useState('');
  const [province, setProvince] = useState(initialProvince);
  const [city, setCity] = useState('all');
  const [type, setType] = useState('all');

  // Follow the province chosen on the page above (or detected from the visitor's location).
  useEffect(() => {
    if (!initialProvince || initialProvince === province) return;
    setProvince(initialProvince);
    setCity('all');
  }, [initialProvince]);

  const cities = province === 'all' ? [] : (PROVINCE_CITIES[province] || []);

  const results = useMemo(() => {
    const term = search.trim().toLowerCase();
    return ALL_AWARDS.filter((award) => {
      if (province !== 'all' && award.province !== province) return false;
      if (type !== 'all' && award.type !== type) return false;
      // University awards are campus-specific; provincial awards apply everywhere.
      if (city !== 'all' && award.type === 'university') {
        const haystack = `${award.name} ${award.desc || ''}`.toLowerCase();
        if (!haystack.includes(city.toLowerCase())) return false;
      }
      if (!term) return true;
      return `${award.name} ${award.desc || ''} ${award.province}`.toLowerCase().includes(term);
    });
  }, [search, province, city, type]);

  const hasFilters = search || province !== 'all' || city !== 'all' || type !== 'all';
  const clearAll = () => { setSearch(''); setProvince('all'); setCity('all'); setType('all'); };

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-5">
      <h2 className="font-heading font-bold text-base mb-1 flex items-center gap-2">
        <GraduationCap className="w-5 h-5 text-primary" /> Find funding for tuition
      </h2>
      <p className="text-xs text-muted-foreground mb-4 leading-snug">
        Search scholarships, grants, bursaries and newcomer awards. Filter by province, city and
        funding type to estimate what your tuition could cost.
      </p>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search scholarships, universities, awards…"
          aria-label="Search scholarships"
          className="w-full pl-9 pr-9 py-2.5 text-sm bg-card border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
        <div>
          <label className="text-[11px] font-medium text-muted-foreground mb-1 block flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Province
          </label>
          <Select value={province} onValueChange={(v) => { setProvince(v); setCity('all'); }}>
            <SelectTrigger className="w-full h-10 rounded-xl border border-border/60 bg-card px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30">
              <SelectValue placeholder="All provinces" />
            </SelectTrigger>
            <SelectContent label="Province">
              <SelectItem value="all">All provinces</SelectItem>
              {PROVINCE_OPTIONS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-[11px] font-medium text-muted-foreground mb-1 block">City</label>
          <Select value={city} onValueChange={setCity} disabled={province === 'all'}>
            <SelectTrigger className="w-full h-10 rounded-xl border border-border/60 bg-card px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50">
              <SelectValue placeholder={province === 'all' ? 'Pick a province first' : 'All cities'} />
            </SelectTrigger>
            <SelectContent label="City">
              <SelectItem value="all">{province === 'all' ? 'Pick a province first' : 'All cities'}</SelectItem>
              {cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-[11px] font-medium text-muted-foreground mb-1 block flex items-center gap-1">
            <Wallet className="w-3 h-3" /> Funding type
          </label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-full h-10 rounded-xl border border-border/60 bg-card px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent label="Funding type">
              <SelectItem value="all">All types</SelectItem>
              {TYPE_OPTIONS.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground flex-wrap">
        <span className="font-semibold text-foreground">{results.length}</span>
        award{results.length === 1 ? '' : 's'} match
        {province !== 'all' && <> · {province}</>}
        {city !== 'all' && <> · {city}</>}
        {type !== 'all' && <> · {SECTION_META[type].label}</>}
        {hasFilters && (
          <button onClick={clearAll} className="ml-auto text-primary font-medium hover:underline">
            Clear filters
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <p className="text-xs text-muted-foreground rounded-xl bg-muted/40 p-4">
          No awards match those filters yet. Try another city, funding type, or a broader search.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[28rem] overflow-y-auto pr-1">
          {results.slice(0, 60).map((award) => {
            const meta = SECTION_META[award.type];
            return (
              <a
                key={`${award.province}-${award.name}`}
                href={award.link || '#'}
                target={award.link ? '_blank' : undefined}
                rel={award.link ? 'noopener noreferrer' : undefined}
                className="group rounded-xl border border-border/50 bg-card p-3 transition-all hover:border-primary/30 hover:shadow-sm"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-md', meta.bg, meta.color)}>
                    {meta.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{award.province}</span>
                  {award.link && <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground/60 group-hover:text-primary" />}
                </div>
                <h4 className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors">{award.name}</h4>
                {award.desc && <p className="text-[11px] text-muted-foreground mt-1 leading-snug line-clamp-2">{award.desc}</p>}
              </a>
            );
          })}
        </div>
      )}

      {results.length > 60 && (
        <p className="mt-2 text-[11px] text-muted-foreground">
          Showing the first 60 of {results.length}. Narrow the filters to see the rest.
        </p>
      )}
    </div>
  );
}