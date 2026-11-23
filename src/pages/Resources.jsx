import { Link } from 'react-router-dom';
import { Globe, Bus, ArrowRight, Compass } from 'lucide-react';
import CanadaTimeZones from '@/components/resources/CanadaTimeZones';
import TransitPlanner from '@/components/transit/TransitPlanner';
import LocalTimeChip from '@/components/transit/LocalTimeChip';

export default function Resources() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-12">
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-2 flex items-center gap-2">
          <Globe className="w-6 h-6 text-primary" />
          Canada Time Zones
        </h1>
        <p className="text-muted-foreground text-sm">
          Live local time across every province and territory, useful when you are calling a government
          office, a school or family back home.
        </p>
      </div>

      <CanadaTimeZones />

      <section className="mt-8">
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <div className="flex items-center gap-2">
            <h2 className="font-heading font-bold text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
              <Bus className="w-4 h-4 text-primary" />
              Transit map
            </h2>
            <LocalTimeChip />
          </div>
          <Link
            to="/transit-map"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            Open full map <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Live transit around you. Times are shown in your local timezone, wherever you are.
        </p>
        <TransitPlanner embedded autoLocate />
      </section>

      <Link
        to="/directory"
        className="mt-8 flex items-center justify-between gap-3 rounded-2xl border border-border/50 bg-card p-4 transition-colors hover:border-primary/50"
      >
        <div>
          <p className="flex items-center gap-2 font-heading text-sm font-bold">
            <Compass className="h-4 w-4 text-primary" />
            National Services Directory
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Emergency, housing, banking, family, seniors, transit, shopping, parks, libraries and pet services in every
            province and territory.
          </p>
        </div>
        <ArrowRight className="h-4 w-4 flex-shrink-0 text-primary" />
      </Link>
    </div>
  );
}