import { cn } from '@/lib/utils';

const JOB_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'full_time', label: 'Full-time' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'remote', label: 'Remote' },
];

const EXPERIENCE = [
  { value: 'all', label: 'Any Level' },
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior' },
];

export default function JobFilters({ filters, onChange }) {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-4 mb-4 space-y-3">
      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-2">Job Type</p>
        <div className="flex flex-wrap gap-2">
          {JOB_TYPES.map(t => (
            <button
              key={t.value}
              onClick={() => onChange({ ...filters, type: t.value })}
              className={cn(
                "px-3 py-1 min-h-[44px] rounded-lg text-xs font-medium transition-all",
                filters.type === t.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-2">Experience Level</p>
        <div className="flex flex-wrap gap-2">
          {EXPERIENCE.map(e => (
            <button
              key={e.value}
              onClick={() => onChange({ ...filters, experience: e.value })}
              className={cn(
                "px-3 py-1 min-h-[44px] rounded-lg text-xs font-medium transition-all",
                filters.experience === e.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              )}
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}