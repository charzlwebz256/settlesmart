import { useState, useEffect, useMemo } from 'react';
import { Globe, Clock } from 'lucide-react';

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
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

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

  return (
    <div className="rounded-2xl bg-card border border-border/50 p-5">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-sky-500/10 text-sky-600 flex-shrink-0">
          <Globe className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-heading font-bold text-base">Time Zones Across Canada</h2>
          <p className="text-muted-foreground text-xs leading-snug">Live local time in every province and city — updating in real time.</p>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-full flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          LIVE
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2 mb-4">
        <Clock className="w-3.5 h-3.5 text-primary" />
        Your local time: <span className="font-mono font-semibold text-foreground tabular-nums">{localTime}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PROVINCE_TIMEZONES.map(prov => (
          <div key={prov.province} className="rounded-xl border border-border/50 bg-background/60 p-3.5">
            <p className="font-heading font-bold text-sm mb-2">{prov.province}</p>
            <div className="space-y-2.5">
              {groupByZone(prov.cities).map(([tz, names]) => (
                <div key={tz}>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-mono text-[15px] font-semibold tabular-nums text-primary leading-none">
                      {zoneInfo[tz]?.time}
                    </span>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase flex-shrink-0">
                      {zoneInfo[tz]?.abbr}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug mt-1">{names.join(' · ')}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}