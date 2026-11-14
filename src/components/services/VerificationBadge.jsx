import { ShieldCheck, Clock, AlertTriangle, Ban } from 'lucide-react';
import { cn } from '@/lib/utils';

const META = {
  verified: {
    label: 'Verified',
    Icon: ShieldCheck,
    className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
  },
  pending: {
    label: 'Not yet verified',
    Icon: Clock,
    className: 'bg-muted text-muted-foreground border-border/60',
  },
  review_due: {
    label: 'Review due',
    Icon: Clock,
    className: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
  },
  needs_correction: {
    label: 'Needs correction',
    Icon: AlertTriangle,
    className: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20',
  },
  inactive: {
    label: 'No longer active',
    Icon: Ban,
    className: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20',
  },
};

export default function VerificationBadge({ status, className }) {
  // Only a record whose stored status is "verified" may wear the verified badge.
  const meta = META[status] || META.pending;
  const Icon = meta.Icon;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wide',
        meta.className,
        className
      )}
    >
      <Icon className="w-3 h-3" />
      {meta.label}
    </span>
  );
}