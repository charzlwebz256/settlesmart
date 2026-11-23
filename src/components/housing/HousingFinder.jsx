import { useMemo, useState } from 'react';
import { Search, ShieldAlert } from 'lucide-react';
import { HOUSING_CATEGORIES, RENTAL_PLATFORMS } from '@/data/housingDirectory';
import PlatformCard from '@/components/housing/PlatformCard';
import { Input } from '@/components/ui/input';

// Where to actually search for a place, by type of home.
export default function HousingFinder() {
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const search = query.trim().toLowerCase();

  const platforms = useMemo(
    () =>
      RENTAL_PLATFORMS.filter((platform) => {
        const inCategory = category === 'all' || platform.categories.includes(category);
        const text = `${platform.name} ${platform.kind} ${platform.description} ${platform.features.join(' ')}`.toLowerCase();
        return inCategory && (!search || text.includes(search));
      }),
    [category, search]
  );

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border/60 bg-card p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a platform, city or type of home"
            className="h-10 rounded-xl pl-9"
          />
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {HOUSING_CATEGORIES.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setCategory(option.id)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                category === option.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-xl bg-accent/10 p-3">
        <ShieldAlert className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          These are third-party listing sites. SettleSmart does not verify the listings or the landlords. View the place
          in person and never send a deposit before you have seen it and signed a lease.
        </p>
      </div>

      {platforms.length === 0 ? (
        <p className="rounded-2xl border border-border/60 bg-card p-6 text-center text-xs text-muted-foreground">
          No platform matches that search. Try a broader word, or pick another category.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {platforms.map((platform) => (
            <PlatformCard key={platform.name} platform={platform} />
          ))}
        </div>
      )}
    </div>
  );
}