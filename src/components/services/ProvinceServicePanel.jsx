import { useState, lazy, Suspense } from 'react';
import { Phone, Globe, MapPin, Mail, ExternalLink, Navigation, List, Map, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getOrgLogo } from '@/lib/orgLogos';
import { PROVINCE_DATA } from '@/lib/provinceServicesData';

const MapView = lazy(() => import('./MapView'));

// ── SHARED ORG CARD ──────────────────────────────────────────────────────────
function OrgCard({ item }) {
  const logo = item.logo || getOrgLogo(item.name);
  const mapQuery = item.address && item.address.length > 10 && !['Province-wide', 'Multiple', 'Online'].some(x => item.address.startsWith(x))
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address)}`
    : null;

  return (
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden hover:border-primary/30 hover:shadow-md transition-all flex flex-col">
      {/* Card top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-primary/60 to-primary/20" />

      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Name + logo row */}
        <div className="flex items-start gap-3">
          {logo && (
            <img src={logo} alt={item.name} className="h-8 w-auto object-contain flex-shrink-0 mt-0.5"
              onError={e => { e.target.style.display = 'none'; }} />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-bold text-sm leading-snug">{item.name}</h3>
            {item.organization && item.organization !== item.name && (
              <p className="text-xs text-muted-foreground mt-0.5">{item.organization}</p>
            )}
            {item.city && item.city !== 'Province-Wide' && (
              <span className="text-[10px] font-semibold text-primary/80 bg-primary/8 border border-primary/15 px-2 py-0.5 rounded-full mt-1 inline-block">
                📍 {item.city}
              </span>
            )}
          </div>
        </div>

        {/* Services list */}
        {item.services && item.services.length > 0 && (
          <div className="bg-muted/40 rounded-xl p-3">
            <ul className="space-y-1">
              {item.services.map((s, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <span className="text-primary font-bold mt-0.5 flex-shrink-0">✓</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Contact info */}
        <div className="space-y-1.5 text-xs text-muted-foreground">
          {item.address && (
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-primary/50 mt-0.5" />
              <span className="leading-snug">{item.address}</span>
            </div>
          )}
          {item.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 flex-shrink-0 text-primary/50" />
              <a href={`tel:${item.phone}`} className="hover:text-primary font-medium transition-colors">{item.phone}</a>
            </div>
          )}
          {item.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 flex-shrink-0 text-primary/50" />
              <a href={`mailto:${item.email}`} className="hover:text-primary transition-colors truncate">{item.email}</a>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap mt-auto pt-1 border-t border-border/30">
          {item.website && (
            <a href={item.website} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors">
              <Globe className="w-3 h-3" /> Visit Website <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>
          )}
          {mapQuery && (
            <a href={mapQuery} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-semibold hover:bg-muted/70 hover:text-foreground transition-colors">
              <MapPin className="w-3 h-3" /> Map
            </a>
          )}
          {item.liveMap && (
            <a href={item.liveMap} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-700 text-xs font-semibold hover:bg-teal-500/20 transition-colors">
              <Navigation className="w-3 h-3" /> Live Map
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ── SECTIONED GRID ────────────────────────────────────────────────────────────
function SectionedGrid({ items, sortBy = 'section' }) {
  const [view, setView] = useState('list');
  const [search, setSearch] = useState('');
  const [openSections, setOpenSections] = useState({});

  const filtered = search.trim()
    ? items.filter(i =>
        [i.name, i.organization, i.section, i.city, ...(i.services || [])]
          .filter(Boolean).join(' ').toLowerCase().includes(search.toLowerCase())
      )
    : items;

  // Sort + group depending on sortBy
  const groupKey = (i) => {
    if (sortBy === 'city') return i.city || i.section || 'Province-Wide';
    if (sortBy === 'name') return null; // flat A–Z, no groups
    return i.section || i.city || 'General';
  };

  const sortedItems = sortBy === 'name'
    ? [...filtered].sort((a, b) => a.name.localeCompare(b.name))
    : filtered;

  const sections = sortBy === 'name'
    ? ['A–Z']
    : [...new Set(sortedItems.map(i => groupKey(i)).filter(Boolean))];

  const toggle = (sec) => setOpenSections(prev => ({ ...prev, [sec]: !prev[sec] }));
  const isOpen = (sec) => openSections[sec] !== false; // default open

  return (
    <div>
      {/* Search + View toggle */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search organizations, services, city…"
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border/60 bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex gap-1 bg-muted rounded-xl p-1 self-start sm:self-auto">
          <button onClick={() => setView('list')}
            className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
              view === 'list' ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>
            <List className="w-3.5 h-3.5" /> List
          </button>
          <button onClick={() => setView('map')}
            className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
              view === 'map' ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>
            <Map className="w-3.5 h-3.5" /> Map
          </button>
        </div>
      </div>

      {view === 'map' ? (
        <Suspense fallback={<div className="h-96 flex items-center justify-center text-muted-foreground text-sm">Loading map...</div>}>
          <MapView items={filtered.map(i => ({ ...i, logo: getOrgLogo(i.name) }))} cityFilter="all" />
        </Suspense>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-2xl mb-2">🔍</p>
          <p className="text-sm font-semibold">No results for "{search}"</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map(sec => {
            const sectionItems = sortBy === 'name'
              ? sortedItems
              : sortedItems.filter(i => groupKey(i) === sec);
            const open = isOpen(sec);
            return (
              <div key={sec} className="rounded-2xl border border-border/40 overflow-hidden shadow-sm">
                {/* Section header */}
                <button
                  onClick={() => toggle(sec)}
                  className="w-full flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-heading font-bold text-sm text-foreground">{sec}</span>
                    <span className="text-[10px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                      {sectionItems.length}
                    </span>
                  </div>
                  <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform duration-200", open && "rotate-180")} />
                </button>

                {/* Cards grid */}
                {open && (
                  <div className="bg-muted/20 px-4 pb-4 border-t border-border/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 pt-4">
                      {sectionItems.map((item, idx) => <OrgCard key={idx} item={item} />)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── EDUCATION PANEL ───────────────────────────────────────────────────────────
const typeColors = {
  University: 'bg-blue-500/10 text-blue-700 border-blue-200',
  Polytechnic: 'bg-orange-500/10 text-orange-700 border-orange-200',
  College: 'bg-teal-500/10 text-teal-700 border-teal-200',
};

function EducationGrid({ items }) {
  const [typeFilter, setTypeFilter] = useState('all');
  const cities = ['all', ...new Set(items.map(i => i.city).filter(x => x && x !== 'Province-Wide'))];
  const [cityFilter, setCityFilter] = useState('all');

  const filtered = items.filter(i =>
    (cityFilter === 'all' || i.city === cityFilter) &&
    (typeFilter === 'all' || i.type === typeFilter)
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-5">
        {cities.length > 2 && cities.map(c => (
          <button key={c} onClick={() => setCityFilter(c)}
            className={cn("px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border",
              cityFilter === c ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border/50 text-muted-foreground hover:border-primary/30")}>
            {c === 'all' ? 'All Cities' : c}
          </button>
        ))}
        {['all', 'University', 'Polytechnic', 'College'].map(t => (
          <button key={t} onClick={() => setTypeFilter(t)}
            className={cn("px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border",
              typeFilter === t ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border/50 text-muted-foreground hover:border-primary/30")}>
            {t === 'all' ? 'All Types' : t}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((inst, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-4 flex flex-col gap-3 hover:border-primary/20 hover:shadow-sm transition-all">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-md border", typeColors[inst.type] || 'bg-muted text-muted-foreground border-border')}>{inst.type}</span>
                  {inst.city && inst.city !== 'Province-Wide' && <span className="text-[10px] text-muted-foreground font-medium">{inst.city}</span>}
                </div>
                <h3 className="font-heading font-bold text-sm">{inst.name}</h3>
              </div>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              {inst.address && <div className="flex items-start gap-2"><MapPin className="w-3.5 h-3.5 text-primary/50 mt-0.5 flex-shrink-0" /><span>{inst.address}</span></div>}
              {inst.phone && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-primary/50 flex-shrink-0" /><a href={`tel:${inst.phone}`} className="hover:text-primary">{inst.phone}</a></div>}
              {inst.email && <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-primary/50 flex-shrink-0" /><a href={`mailto:${inst.email}`} className="hover:text-primary truncate">{inst.email}</a></div>}
            </div>
            <div className="flex gap-2 mt-auto pt-1">
              <a href={inst.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/15 transition-colors">
                <Globe className="w-3 h-3" /> Website <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
              {inst.address && inst.address.length > 10 && (
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(inst.address)}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-semibold hover:bg-muted/70 transition-colors">
                  <MapPin className="w-3 h-3" /> Map
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
export default function ProvinceServicePanel({ category, province, sortBy = 'section' }) {
  const provinceData = PROVINCE_DATA[province];

  if (!provinceData) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-3xl mb-3">🏔️</p>
        <p className="font-semibold text-sm">No data available for this province yet.</p>
        <p className="text-xs mt-1">Please check the IRCC settlement finder: <a href="https://ircc.canada.ca/english/newcomers/services/index.asp" target="_blank" rel="noopener noreferrer" className="text-primary underline">ircc.canada.ca</a></p>
      </div>
    );
  }

  const items = provinceData[category];

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-3xl mb-3">🔍</p>
        <p className="font-semibold text-sm">No {category} services listed for {province} yet.</p>
        <a href="https://ircc.canada.ca/english/newcomers/services/index.asp" target="_blank" rel="noopener noreferrer"
          className="text-xs text-primary underline mt-1 block">Find services via IRCC →</a>
      </div>
    );
  }

  if (category === 'education') return <EducationGrid items={items} />;

  return <SectionedGrid items={items} sortBy={sortBy} />;
}