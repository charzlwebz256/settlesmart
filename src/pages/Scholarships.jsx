import { useState, useMemo } from 'react';
import { Search, ExternalLink, MapPin, Landmark, GraduationCap, Award, Heart, BookOpen, ChevronDown } from 'lucide-react';
import { SCHOLARSHIPS_BY_PROVINCE, SECTION_META } from '@/data/scholarshipsData';
import { cn } from '@/lib/utils';

const ICONS = { Landmark, GraduationCap, Award, Heart, BookOpen };

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

function ProvinceSection({ province, search }) {
  const [openSections, setOpenSections] = useState(() =>
    Object.fromEntries(province.sections.map(s => [s.type, true]))
  );

  const filteredSections = useMemo(() =>
    province.sections
      .map(section => ({
        ...section,
        items: section.items.filter(item =>
          !search ||
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          (item.desc || '').toLowerCase().includes(search.toLowerCase())
        ),
      }))
      .filter(s => s.items.length > 0),
    [province, search]
  );

  if (filteredSections.length === 0) return null;

  return (
    <div className={cn('rounded-2xl border border-border/50 overflow-hidden bg-gradient-to-b', province.accent)}>
      <div className="flex items-center gap-2 px-4 py-3 bg-card/60 backdrop-blur-sm border-b border-border/30">
        <MapPin className="w-4 h-4 text-primary" />
        <h2 className="font-heading font-bold text-base text-foreground">{province.province}</h2>
        <span className="text-xs text-muted-foreground">· {province.city}</span>
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
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const provinces = SCHOLARSHIPS_BY_PROVINCE;
  const visible = activeProvince === 'all' ? provinces : provinces.filter(p => p.province === activeProvince);

  const totalCount = provinces.reduce(
    (sum, p) => sum + p.sections.reduce((s, sec) => s + sec.items.length, 0), 0
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
          Government-funded grants, university awards, private scholarships, and refugee/newcomer funding — organized by province and city. {totalCount}+ opportunities listed.
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

      {/* Province chips */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 -mx-1 px-1">
        <button
          onClick={() => setActiveProvince('all')}
          className={cn(
            'px-3 py-1.5 rounded-xl text-xs font-semibold border whitespace-nowrap transition-all',
            activeProvince === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border/50 text-muted-foreground hover:border-primary/30'
          )}
        >
          All Provinces
        </button>
        {provinces.map(p => (
          <button
            key={p.province}
            onClick={() => setActiveProvince(p.province)}
            className={cn(
              'px-3 py-1.5 rounded-xl text-xs font-semibold border whitespace-nowrap transition-all',
              activeProvince === p.province ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border/50 text-muted-foreground hover:border-primary/30'
            )}
          >
            {p.province}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 -mx-1 px-1">
        <button
          onClick={() => setCategoryFilter('all')}
          className={cn(
            'px-3 py-1.5 rounded-xl text-xs font-medium border whitespace-nowrap transition-all',
            categoryFilter === 'all' ? 'bg-foreground text-background border-foreground' : 'bg-card border-border/50 text-muted-foreground hover:border-foreground/30'
          )}
        >
          All Categories
        </button>
        {Object.entries(SECTION_META).map(([key, meta]) => {
          const Icon = ICONS[meta.icon];
          return (
            <button
              key={key}
              onClick={() => setCategoryFilter(key)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border whitespace-nowrap transition-all',
                categoryFilter === key ? 'bg-foreground text-background border-foreground' : 'bg-card border-border/50 text-muted-foreground hover:border-foreground/30'
              )}
            >
              {Icon && <Icon className="w-3 h-3" />}
              {meta.label}
            </button>
          );
        })}
      </div>

      {/* Province sections */}
      <div className="space-y-4">
        {visible.map(province => {
          const filteredProvince = categoryFilter === 'all'
            ? province
            : { ...province, sections: province.sections.filter(s => s.type === categoryFilter) };
          return (
            <ProvinceSection key={province.province} province={filteredProvince} search={search} />
          );
        })}
      </div>

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