import { useState } from 'react';
import { MapPin, Store } from 'lucide-react';
import { PROVINCES } from '@/data/nationalDirectory';
import { MALLS_BY_CITY } from '@/data/mallsByCity';
import { institutionLogo } from '@/data/institutionLogos';
import { useLocation_ } from '@/lib/LocationContext';

const SELECT_CLASS =
  'rounded-xl border border-border/60 bg-background px-3 py-2 text-xs font-semibold text-foreground outline-none focus:border-primary';

function MallRow({ name }) {
  const logo = institutionLogo(name);
  return (
    <div className="flex items-center gap-2 rounded-xl bg-muted/40 p-2.5">
      {logo ? (
        <img
          src={logo}
          alt=""
          className="h-6 w-6 flex-shrink-0 rounded-md bg-card object-contain p-0.5"
          onError={(event) => {
            event.currentTarget.style.visibility = 'hidden';
          }}
        />
      ) : (
        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-primary/10 text-[10px] font-bold text-primary">
          {name.charAt(0)}
        </span>
      )}
      <p className="text-xs font-semibold leading-tight text-foreground">{name}</p>
    </div>
  );
}

// Major shopping centres, grouped by province and city.
export default function MallDirectory() {
  const { province: detectedProvince } = useLocation_();
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');

  const activeProvince = province || detectedProvince || '';
  const citiesInProvince = MALLS_BY_CITY[activeProvince] || {};
  const cityNames = Object.keys(citiesInProvince);

  const groups = city
    ? [[city, citiesInProvince[city] || []]]
    : cityNames.map((name) => [name, citiesInProvince[name]]);

  const changeProvince = (value) => {
    setProvince(value);
    setCity('');
  };

  return (
    <section className="mt-10 rounded-2xl border border-border/50 bg-card p-5">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 font-heading text-base font-bold">
          <Store className="h-4 w-4 text-primary" />
          Major malls and shopping centres
        </h3>
        <div className="flex flex-wrap gap-2">
          <select value={activeProvince} onChange={(event) => changeProvince(event.target.value)} className={SELECT_CLASS}>
            <option value="">Province</option>
            {PROVINCES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <select
            value={city}
            onChange={(event) => setCity(event.target.value)}
            disabled={!activeProvince}
            className={`${SELECT_CLASS} disabled:opacity-50`}
          >
            <option value="">All cities</option>
            {cityNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="mb-4 text-xs text-muted-foreground">
        Browse by province, then narrow to your city to see the centres people actually shop at.
      </p>

      {!activeProvince ? (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          Pick a province or territory to see its cities and malls.
        </p>
      ) : groups.length === 0 ? (
        <p className="text-xs text-muted-foreground">No malls listed for {activeProvince} yet.</p>
      ) : (
        <div className="space-y-4">
          {groups.map(([cityName, malls]) => (
            <div key={cityName}>
              <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                <MapPin className="h-3 w-3 text-primary" />
                {cityName}
                <span className="font-medium normal-case tracking-normal">· {malls.length}</span>
              </p>
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {malls.map((mall) => (
                  <MallRow key={mall} name={mall} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}