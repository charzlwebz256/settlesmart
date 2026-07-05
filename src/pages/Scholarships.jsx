import { useState, useMemo } from 'react';
import { Search, ExternalLink, MapPin, Landmark, GraduationCap, Award, Heart, BookOpen, ChevronDown } from 'lucide-react';
import { SCHOLARSHIPS_BY_PROVINCE, SECTION_META } from '@/data/scholarshipsData';
import { cn } from '@/lib/utils';

const ICONS = { Landmark, GraduationCap, Award, Heart, BookOpen };

// Major cities per province (for city-level drill-down)
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

function NativeSelect({ value, onChange, options, placeholder, disabled }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className="w-full h-10 appearance-none rounded-xl border border-border/60 bg-card pl-3 pr-9 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="all">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none" />
    </div>
  );
}

function ScholarshipCard({ item }) {
  return (
    <a
      href={item.link}
      target={item.link ? '_blank' : undefined}
      rel={item.link ? 'noopener noreferrer' : undefined}
      className={cn(
        'block bg-card border border-border/50 rounded-xl p-3 transition-all',
        item.link ? 'hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : 'cursor-default'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-foreground leading-snug flex-1">{item.name}</h4>
        {item.link && <ExternalLink className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />}
      </div>
      {item.desc && <p className="text-xs text-muted-foreground mt-1 leading-snug">{item.desc}</p>}
    </a>
  );
}

function ProvinceSection({ province, search, categoryFilter, city }) {
  const [openSections, setOpenSections] = useState(() =>
    Object.fromEntries(province.sections.map(s => [s.type, true]))
  );

  const filteredSections = useMemo(() =>
    province.sections
      .map(section => ({
        ...section,
        items: section.items.filter(item => {
          const matchesSearch = !search ||
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            (item.desc || '').toLowerCase().includes(search.toLowerCase());
          const matchesCategory = categoryFilter === 'all' || section.type === categoryFilter;
          // City filter: university scholarships are city-specific; others are province-wide
          const matchesCity = !city || section.type !== 'university' ||
            item.name.toLowerCase().includes(city.toLowerCase()) ||
            (item.desc || '').toLowerCase().includes(city.toLowerCase());
          return matchesSearch && matchesCategory && matchesCity;
        }),
      }))
      .filter(s => s.items.length > 0),
    [province, search, categoryFilter, city]
  );

  if (filteredSections.length === 0) return null;

  return (
    <div className={cn('rounded-2xl border border-border/50 overflow-hidden bg-gradient-to-b', province.accent)}>
      <div className="flex items-center gap-2 px-4 py-3 bg-card/60 backdrop-blur-sm border-b border-border/30">
        <MapPin className="w-4 h-4 text-primary" />
        <h2 className="font-heading font-bold text-base text-foreground">{province.province}</h2>
        <span className="text-xs text-muted-foreground">· {city && city !== 'all' ? city : province.city}</span>
        <span className="ml-auto text-xs text-muted-foreground">
          {filteredSections.reduce((s, sec) => s + sec.items.length, 0)} opportunities
        </span>
      </div>
      <div className="p-4 space-y-4">
        {filteredSections.map(section => {
          const meta = SECTION_META[section.type];
          const Icon = ICONS[meta.icon];
          const isOpen = openSections[section.type];
          return (
            <div key={section.type} className="bg-card/80 rounded-xl border border-border/40 overflow-hidden">
              <button
                onClick={() => setOpenSections(prev => ({ ...prev, [section.type]: !prev[section.type] }))}
                className="flex items-center gap-2 w-full px-3 py-2.5 text-left hover:bg-muted/30 transition-colors"
              >
                <span className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0', meta.bg)}>
                  {Icon && <Icon className={cn('w-4 h-4', meta.color)} />}
                </span>
                <span className="text-sm font-semibold text-foreground flex-1">{section.title}</span>
                <span className="text-xs text-muted-foreground">{section.items.length}</span>
                <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', isOpen ? 'rotate-180' : '')} />
              </button>
              {isOpen && (
                <div className="px-3 pb-3 pt-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {section.items.map((item, i) => (
                    <ScholarshipCard key={i} item={item} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Scholarships() {
  const [activeProvince, setActiveProvince] = useState('all');
  const [activeCity, setActiveCity] = useState('all');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const provinces = SCHOLARSHIPS_BY_PROVINCE;
  const visible = activeProvince === 'all' ? provinces : provinces.filter(p => p.province === activeProvince);

  const totalCount = provinces.reduce(
    (sum, p) => sum + p.sections.reduce((s, sec) => s + sec.items.length, 0), 0
  );

  const categoryOptions = Object.entries(SECTION_META).map(([key, meta]) => ({ value: key, label: meta.label }));
  const provinceOptions = provinces.map(p => ({ value: p.province, label: p.province }));
  const cityOptions = (activeProvince !== 'all' ? (PROVINCE_CITIES[activeProvince] || []) : []).map(c => ({ value: c, label: c }));

  const handleProvinceChange = (val) => {
    setActiveProvince(val);
    setActiveCity('all');
  };

  // Count opportunities for the selected province/city/category
  const visibleCount = visible.reduce(
    (sum, p) => sum + p.sections
      .map(section => ({
        ...section,
        items: section.items.filter(item => {
          const matchesCategory = categoryFilter === 'all' || section.type === categoryFilter;
          const matchesCity = !activeCity || activeCity === 'all' || section.type !== 'university' ||
            item.name.toLowerCase().includes(activeCity.toLowerCase()) ||
            (item.desc || '').toLowerCase().includes(activeCity.toLowerCase());
          return matchesCategory && matchesCity;
        }),
      }))
      .filter(s => s.items.length > 0)
      .reduce((s, sec) => s + sec.items.length, 0),
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-24 md:pb-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-2 flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-primary" />
          Scholarships in Canada
        </h1>
        <p className="text-muted-foreground text-sm">
          Government-funded grants, university awards, private scholarships, and refugee/newcomer funding — classified by province, city, and type. {totalCount}+ opportunities listed.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search scholarships, awards, universities…"
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-card border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Dropdowns: Province + City + Category */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Province / Region</label>
          <NativeSelect
            value={activeProvince}
            onChange={handleProvinceChange}
            options={provinceOptions}
            placeholder="All Provinces"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">City</label>
          <NativeSelect
            value={activeCity}
            onChange={setActiveCity}
            options={cityOptions}
            placeholder={activeProvince === 'all' ? 'Select province first' : 'All Cities'}
            disabled={activeProvince === 'all'}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Funding Type</label>
          <NativeSelect
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={categoryOptions}
            placeholder="All Types"
          />
        </div>
      </div>

      {/* Result summary */}
      <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground flex-wrap">
        <span className="font-semibold text-foreground">{visibleCount}</span> opportunit{visibleCount !== 1 ? 'ies' : 'y'} found
        {activeProvince !== 'all' && <> in <span className="font-medium text-foreground">{activeProvince}</span></>}
        {activeCity !== 'all' && activeCity && <> · <span className="font-medium text-foreground">{activeCity}</span></>}
        {categoryFilter !== 'all' && <> · <span className="font-medium text-foreground">{SECTION_META[categoryFilter].label}</span></>}
        {(activeProvince !== 'all' || categoryFilter !== 'all' || activeCity !== 'all') && (
          <button
            onClick={() => { setActiveProvince('all'); setActiveCity('all'); setCategoryFilter('all'); }}
            className="ml-auto text-primary hover:underline font-medium"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Province sections */}
      {visible.length > 0 ? (
        <div className="space-y-4">
          {visible.map(province => (
            <ProvinceSection
              key={province.province}
              province={province}
              search={search}
              categoryFilter={categoryFilter}
              city={activeCity}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🎓</div>
          <h3 className="font-heading font-bold text-lg mb-2">No scholarships match</h3>
          <p className="text-muted-foreground text-sm">Try a different province, city, type, or search term.</p>
        </div>
      )}

      {/* Footer note */}
      <div className="mt-8 bg-card rounded-2xl border border-border/50 p-4">
        <h3 className="font-heading font-bold text-sm mb-2 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-primary" /> Tips for Newcomers
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="flex gap-2"><span className="text-primary font-bold">✓</span><span><strong className="text-foreground">Apply early</strong> — Most government aid and university scholarships have deadlines 6–8 months before the academic year.</span></div>
          <div className="flex gap-2"><span className="text-primary font-bold">✓</span><span><strong className="text-foreground">One application</strong> — Provincial student aid automatically assesses federal + provincial grants.</span></div>
          <div className="flex gap-2"><span className="text-primary font-bold">✓</span><span><strong className="text-foreground">Refugee status</strong> — Protected persons and refugees may qualify for additional bursaries and emergency aid.</span></div>
          <div className="flex gap-2"><span className="text-primary font-bold">✓</span><span><strong className="text-foreground">National awards</strong> — Many private scholarships (TD, Loran, Schulich) are open across all provinces.</span></div>
        </div>
      </div>
    </div>
  );
}