import { useState } from 'react';
import { AFFORDABLE_PROGRAMS, HOUSING_SUPPORT } from '@/data/housingDirectory';
import { PROVINCES } from '@/data/nationalDirectory';
import { useLocation_ } from '@/lib/LocationContext';
import { Building2, ExternalLink, Info, LifeBuoy } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Government and subsidized housing programs, plus where to get help fast.
export default function HousingHelp() {
  const { province: detectedProvince } = useLocation_();
  const [province, setProvince] = useState(detectedProvince || '');

  const programs = AFFORDABLE_PROGRAMS.filter(
    (program) => !program.province || !province || program.province === province
  );

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border/60 bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="flex items-center gap-1.5 font-heading text-sm font-bold">
              <Building2 className="h-4 w-4 text-primary" />
              Affordable and subsidized housing
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Government programs usually have eligibility rules and waiting lists. Apply as early as you can.
            </p>
          </div>
          <Select value={province || 'all'} onValueChange={(value) => setProvince(value === 'all' ? '' : value)}>
            <SelectTrigger className="h-9 w-[11rem] rounded-lg text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All of Canada</SelectItem>
              {PROVINCES.map((option) => (
                <SelectItem key={option} value={option} className="text-xs">{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {programs.map((program) => (
            <a
              key={program.name}
              href={program.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-border/60 p-3 transition-colors hover:border-primary/40"
            >
              <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                {program.name}
                <ExternalLink className="h-3 w-3 text-primary" />
              </p>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">
                {program.province || 'Canada-wide'}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{program.description}</p>
            </a>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-4">
        <h2 className="flex items-center gap-1.5 font-heading text-sm font-bold">
          <LifeBuoy className="h-4 w-4 text-primary" />
          Renting help and your rights
        </h2>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {HOUSING_SUPPORT.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-muted/50 p-3 transition-colors hover:bg-muted"
            >
              <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                {item.name}
                <ExternalLink className="h-3 w-3 flex-shrink-0 text-primary" />
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{item.description}</p>
            </a>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-xl bg-accent/10 p-3">
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Never pay a deposit or a "holding fee" before you have viewed the place and signed a lease. If someone asks for
          money by gift card, e-transfer or crypto to hold a unit you have not seen, it is a scam. Report it to the
          Canadian Anti-Fraud Centre.
        </p>
      </div>
    </div>
  );
}