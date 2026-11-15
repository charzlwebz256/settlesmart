import { useState, useMemo } from 'react';
import { Globe, Clock, MousePointerClick } from 'lucide-react';
import { useSyncedNow } from '@/lib/internetTime';
import ProvinceCard from '@/components/resources/ProvinceCard';
import { PROVINCE_PROFILES } from '@/data/provinceProfiles';

// Every province & territory with its main cities and IANA timezone.
const PROVINCE_TIMEZONES = [
  {
    province: 'Newfoundland & Labrador',
    cities: [
      { name: "St. John's", tz: 'America/St_Johns' },
      { name: 'Corner Brook', tz: 'America/St_Johns' },
      { name: 'Gander', tz: 'America/St_Johns' },
      { name: 'Labrador City', tz: 'America/Goose_Bay' },
      { name: 'Happy Valley-Goose Bay', tz: 'America/Goose_Bay' },
    ],
  },
  {
    province: 'Nova Scotia',
    cities: [
      { name: 'Halifax', tz: 'America/Halifax' },
      { name: 'Sydney', tz: 'America/Halifax' },
      { name: 'Truro', tz: 'America/Halifax' },
      { name: 'Wolfville', tz: 'America/Halifax' },
    ],
  },
  {
    province: 'Prince Edward Island',
    cities: [
      { name: 'Charlottetown', tz: 'America/Halifax' },
      { name: 'Summerside', tz: 'America/Halifax' },
    ],
  },
  {
    province: 'New Brunswick',
    cities: [
      { name: 'Fredericton', tz: 'America/Moncton' },
      { name: 'Moncton', tz: 'America/Moncton' },
      { name: 'Saint John', tz: 'America/Moncton' },
      { name: 'Sackville', tz: 'America/Moncton' },
    ],
  },
  {
    province: 'Quebec',
    cities: [
      { name: 'Montreal', tz: 'America/Toronto' },
      { name: 'Quebec City', tz: 'America/Toronto' },
      { name: 'Gatineau', tz: 'America/Toronto' },
      { name: 'Sherbrooke', tz: 'America/Toronto' },
    ],
  },
  {
    province: 'Ontario',
    cities: [
      { name: 'Toronto', tz: 'America/Toronto' },
      { name: 'Ottawa', tz: 'America/Toronto' },
      { name: 'Mississauga', tz: 'America/Toronto' },
      { name: 'Hamilton', tz: 'America/Toronto' },
      { name: 'London', tz: 'America/Toronto' },
      { name: 'Kitchener', tz: 'America/Toronto' },
      { name: 'Windsor', tz: 'America/Toronto' },
      { name: 'Sudbury', tz: 'America/Toronto' },
      { name: 'Thunder Bay', tz: 'America/Toronto' },
      { name: 'Kenora', tz: 'America/Winnipeg' },
    ],
  },
  {
    province: 'Manitoba',
    cities: [
      { name: 'Winnipeg', tz: 'America/Winnipeg' },
      { name: 'Brandon', tz: 'America/Winnipeg' },
    ],
  },
  {
    province: 'Saskatchewan',
    cities: [
      { name: 'Regina', tz: 'America/Regina' },
      { name: 'Saskatoon', tz: 'America/Regina' },
      { name: 'Moose Jaw', tz: 'America/Regina' },
      { name: 'Lloydminster', tz: 'America/Edmonton' },
    ],
  },
  {
    province: 'Alberta',
    cities: [
      { name: 'Calgary', tz: 'America/Edmonton' },
      { name: 'Edmonton', tz: 'America/Edmonton' },
      { name: 'Red Deer', tz: 'America/Edmonton' },
      { name: 'Lethbridge', tz: 'America/Edmonton' },
    ],
  },
  {
    province: 'British Columbia',
    cities: [
      { name: 'Vancouver', tz: 'America/Vancouver' },
      { name: 'Victoria', tz: 'America/Vancouver' },
      { name: 'Surrey', tz: 'America/Vancouver' },
      { name: 'Burnaby', tz: 'America/Vancouver' },
      { name: 'Kelowna', tz: 'America/Vancouver' },
      { name: 'Kamloops', tz: 'America/Vancouver' },
      { name: 'Prince George', tz: 'America/Vancouver' },
    ],
  },
  {
    province: 'Yukon',
    cities: [{ name: 'Whitehorse', tz: 'America/Whitehorse' }],
  },
  {
    province: 'Northwest Territories',
    cities: [{ name: 'Yellowknife', tz: 'America/Yellowknife' }],
  },
  {
    province: 'Nunavut',
    cities: [
      { name: 'Iqaluit', tz: 'America/Iqaluit' },
      { name: 'Rankin Inlet', tz: 'America/Rankin_Inlet' },
      { name: 'Cambridge Bay', tz: 'America/Cambridge_Bay' },
    ],
  },
];

function getZoneInfo(tz, date) {
  const time = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date);
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    timeZoneName: 'short',
  }).formatToParts(date);
  const abbr = parts.find(p => p.type === 'timeZoneName')?.value || '';
  return { time, abbr };
}

function groupByZone(cities) {
  const groups = {};
  cities.forEach(c => {
    (groups[c.tz] = groups[c.tz] || []).push(c.name);
  });
  return Object.entries(groups);
}

export default function CanadaTimeZones() {
  // Network-corrected time, so every province clock is right on any device
  const now = useSyncedNow();

  const uniqueTzs = useMemo(() => {
    const set = new Set();
    PROVINCE_TIMEZONES.forEach(p => p.cities.forEach(c => set.add(c.tz)));
    return [...set];
  }, []);

  const zoneInfo = useMemo(() => {
    const map = {};
    uniqueTzs.forEach(tz => {
      map[tz] = getZoneInfo(tz, now);
    });
    return map;
  }, [now, uniqueTzs]);

  const localTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' });
  // Only one province's facts are open at a time, so the next one is always reachable.
  const [openProvince, setOpenProvince] = useState(null);

  return (
    <div className="rounded-2xl bg-card border border-border/50 p-5">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-sky-500/10 text-sky-600 flex-shrink-0">
          <Globe className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-heading font-bold text-base">Time Zones Across Canada</h2>
          <p className="text-muted-foreground text-xs leading-snug">Live local time in every province and city, updating in real time.</p>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-full flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          LIVE
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2 mb-2">
        <Clock className="w-3.5 h-3.5 text-primary" />
        Your local time: <span className="font-mono font-semibold text-foreground tabular-nums">{localTime}</span>
      </div>

      <p className="mb-4 flex items-center gap-1.5 rounded-lg bg-primary/5 px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground">
        <MousePointerClick className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
        Hover over a province for its capital, population, leadership and geography, tap on a phone.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PROVINCE_TIMEZONES.map(prov => (
          <ProvinceCard
            key={prov.province}
            name={prov.province}
            profile={PROVINCE_PROFILES[prov.province]}
            timeGroups={groupByZone(prov.cities)}
            zoneInfo={zoneInfo}
            open={openProvince === prov.province}
            onOpen={() => setOpenProvince(prov.province)}
            onClose={() => setOpenProvince(prev => (prev === prov.province ? null : prev))}
            onToggle={() => setOpenProvince(prev => (prev === prov.province ? null : prov.province))}
          />
        ))}
      </div>
    </div>
  );
}