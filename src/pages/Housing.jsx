import { useState } from 'react';
import { Building2, ClipboardList, LifeBuoy, MapPin, Search } from 'lucide-react';
import HousingFinder from '@/components/housing/HousingFinder';
import HousingTracker from '@/components/housing/HousingTracker';
import HousingHelp from '@/components/housing/HousingHelp';
import { useLocation_ } from '@/lib/LocationContext';

const TABS = [
  { id: 'find', label: 'Find a rental', icon: Search },
  { id: 'track', label: 'My applications', icon: ClipboardList },
  { id: 'help', label: 'Housing help', icon: LifeBuoy },
];

export default function Housing() {
  const { city, province } = useLocation_();
  const [tab, setTab] = useState('find');
  const place = [city, province].filter(Boolean).join(', ');

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 pb-24 md:pb-10">
      <div className="mb-4">
        <h1 className="flex items-center gap-2 font-heading text-xl font-bold md:text-2xl">
          <Building2 className="h-5 w-5 text-primary" />
          Housing &amp; Accommodation
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Where to search across Canada, a tracker for every application, and the programs that help with rent.
        </p>
        {place && (
          <p className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            Around {place}
          </p>
        )}
      </div>

      <div className="mb-4 inline-flex flex-wrap gap-1 rounded-xl border border-border/50 bg-card p-1">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              tab === item.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'find' && <HousingFinder />}
      {tab === 'track' && <HousingTracker />}
      {tab === 'help' && <HousingHelp />}
    </div>
  );
}