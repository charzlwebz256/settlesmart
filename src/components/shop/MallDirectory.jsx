import { useState } from 'react';
import { MapPin, Store } from 'lucide-react';
import { MALLS, PROVINCES } from '@/data/nationalDirectory';
import { institutionLogo } from '@/data/institutionLogos';
import { useLocation_ } from '@/lib/LocationContext';

// Major shopping centres by province, shown on ShopSmart rather than the services directory.
export default function MallDirectory() {
  const { province: detectedProvince } = useLocation_();
  const [province, setProvince] = useState('');

  const activeProvince = province || detectedProvince || '';
  const malls = MALLS?.provinces[activeProvince] || [];

  return (
    <section className="mt-10 rounded-2xl border border-border/50 bg-card p-5">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 font-heading text-base font-bold">
          <Store className="h-4 w-4 text-primary" />
          Major malls and shopping centres
        </h3>
        <select
          value={activeProvince}
          onChange={(event) => setProvince(event.target.value)}
          className="rounded-xl border border-border/60 bg-background px-3 py-2 text-xs font-semibold text-foreground outline-none focus:border-primary"
        >
          <option value="">Choose a province</option>
          {PROVINCES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <p className="mb-4 text-xs text-muted-foreground">
        The big regional centres people actually shop at, province by province.
      </p>

      {!activeProvince ? (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          Pick a province or territory to see its malls.
        </p>
      ) : malls.length === 0 ? (
        <p className="text-xs text-muted-foreground">No malls listed for {activeProvince} yet.</p>
      ) : (
        <div className="space-y-2">
          {malls.map((mall) => {
            const logo = institutionLogo(mall.name);
            return (
              <div key={mall.name} className="flex gap-2.5 rounded-xl bg-muted/40 p-3">
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
                    {mall.name.charAt(0)}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{mall.name}</p>
                  {mall.note && <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{mall.note}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}