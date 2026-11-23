import { useMemo, useState } from 'react';
import { AlertTriangle, BookOpen, Bus, Compass, Download, ExternalLink, FileDown, HeartHandshake, Home, Landmark, MapPin, PawPrint, Search, ShoppingBag, Trees, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SERVICE_DIRECTORY as DIRECTORY, PROVINCES } from '@/data/nationalDirectory';
import { institutionLogo } from '@/data/institutionLogos';
import { officialLinks } from '@/data/officialLinks';
import { downloadDirectoryHtml, downloadDirectoryPdf } from '@/lib/directoryDownload';
import { useLocation_ } from '@/lib/LocationContext';

const ICONS = {
  emergency: AlertTriangle,
  housing: Home,
  banking: Landmark,
  family: Users,
  seniors: HeartHandshake,
  transit: Bus,
  malls: ShoppingBag,
  parks: Trees,
  libraries: BookOpen,
  pets: PawPrint,
};

function matches(item, query) {
  if (!query) return true;
  const text = `${item.name} ${item.note || ''}`.toLowerCase();
  return text.includes(query);
}

function EntryList({ items, emptyText }) {
  if (items.length === 0) {
    return <p className="text-xs text-muted-foreground">{emptyText}</p>;
  }
  return (
    <div className="space-y-2">
      {items.map((item) => {
        const logo = institutionLogo(item.name);
        const links = officialLinks(item.name);
        return (
          <div key={item.name} className="flex gap-2.5 rounded-xl bg-muted/40 p-3">
            {logo ? (
              <img
                src={logo}
                alt=""
                className="mt-0.5 h-7 w-7 flex-shrink-0 rounded-md bg-card object-contain p-0.5"
                onError={(event) => {
                  event.currentTarget.style.visibility = 'hidden';
                }}
              />
            ) : (
              <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-primary/10 text-[11px] font-bold text-primary">
                {item.name.charAt(0)}
              </span>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{item.name}</p>
              {item.note && <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{item.note}</p>}
              {links.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/20"
                    >
                      {link.label}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function NationalDirectory() {
  const { province: detectedProvince } = useLocation_();
  const [categoryId, setCategoryId] = useState('emergency');
  const [province, setProvince] = useState('');
  const [query, setQuery] = useState('');

  const activeProvince = province || detectedProvince || '';
  const category = DIRECTORY.find((entry) => entry.id === categoryId) || DIRECTORY[0];
  const search = query.trim().toLowerCase();

  const national = useMemo(() => category.national.filter((item) => matches(item, search)), [category, search]);
  const provincial = useMemo(
    () => (category.provinces[activeProvince] || []).filter((item) => matches(item, search)),
    [category, activeProvince, search]
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 pb-24 md:pb-8">
      <div className="mb-5">
        <h1 className="flex items-center gap-2 font-heading text-2xl font-bold md:text-3xl">
          <Compass className="h-6 w-6 text-primary" />
          National Services Directory
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Emergency, housing, banking, family, seniors, transit, shopping, parks, libraries and pet services across all 13
          provinces and territories.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={downloadDirectoryPdf}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-transform active:scale-95"
          >
            <Download className="h-3.5 w-3.5" />
            Download PDF
          </button>
          <button
            onClick={downloadDirectoryHtml}
            className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-card px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <FileDown className="h-3.5 w-3.5" />
            Save offline copy
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a service or organisation"
            className="w-full rounded-xl border border-border/60 bg-card py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <select
          value={activeProvince}
          onChange={(event) => setProvince(event.target.value)}
          className="rounded-xl border border-border/60 bg-card px-3 py-2.5 text-sm font-medium outline-none focus:border-primary"
        >
          <option value="">All provinces</option>
          {PROVINCES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="-mx-4 mb-4 flex gap-1.5 overflow-x-auto px-4 pb-1">
        {DIRECTORY.map((entry) => {
          const Icon = ICONS[entry.id] || Compass;
          return (
            <button
              key={entry.id}
              onClick={() => setCategoryId(entry.id)}
              className={cn(
                'flex flex-shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors',
                entry.id === category.id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border/60 bg-card text-foreground hover:bg-muted'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {entry.label}
            </button>
          );
        })}
      </div>

      <p className="mb-4 text-xs text-muted-foreground">{category.blurb}</p>

      {national.length > 0 && (
        <section className="mb-4 rounded-2xl border border-border/50 bg-card p-4">
          <h2 className="mb-2 font-heading text-sm font-bold">Across Canada</h2>
          <EntryList items={national} emptyText="No national entry matches that search." />
        </section>
      )}

      <section className="rounded-2xl border border-border/50 bg-card p-4">
        <h2 className="mb-2 flex items-center gap-1.5 font-heading text-sm font-bold">
          <MapPin className="h-4 w-4 text-primary" />
          {activeProvince || 'Choose a province'}
        </h2>
        {activeProvince ? (
          <EntryList
            items={provincial}
            emptyText={
              Object.keys(category.provinces).length === 0
                ? 'This service works nationally, see the list above.'
                : `Nothing listed for ${activeProvince} in this category yet.`
            }
          />
        ) : (
          <p className="text-xs text-muted-foreground">Pick a province or territory above to see who to contact.</p>
        )}
      </section>

      <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
        This is a starting directory of major cities and organisations, not a complete list of every office or branch.
        Confirm current names, phone numbers and hours with the organisation before you travel.
      </p>
    </div>
  );
}