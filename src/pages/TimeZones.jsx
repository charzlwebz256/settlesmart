import { Globe } from 'lucide-react';
import CanadaTimeZones from '@/components/resources/CanadaTimeZones';

export default function TimeZones() {
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
    </div>
  );
}