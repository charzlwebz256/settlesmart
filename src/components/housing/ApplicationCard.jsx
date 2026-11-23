import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { CalendarClock, ExternalLink, MapPin, Pencil, Trash2, Wallet } from 'lucide-react';
import { HOUSING_STATUSES } from '@/data/housingDirectory';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

const formatDate = (value) => (value ? new Date(value).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' }) : null);

// One tracked rental: the property, its status, and the next thing to do.
export default function ApplicationCard({ application, onEdit, onChanged }) {
  const [saving, setSaving] = useState(false);
  const status = HOUSING_STATUSES.find((option) => option.id === application.status) || HOUSING_STATUSES[0];

  const changeStatus = async (next) => {
    setSaving(true);
    try {
      await base44.entities.HousingApplication.update(application.id, { status: next });
      onChanged?.();
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    await base44.entities.HousingApplication.delete(application.id);
    onChanged?.();
  };

  const place = [application.city, application.province].filter(Boolean).join(', ');

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-heading text-sm font-bold leading-tight">{application.property_name}</p>
          {place && (
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
              <MapPin className="h-3 w-3 flex-shrink-0 text-primary" />
              <span className="truncate">{application.address ? `${application.address}, ${place}` : place}</span>
            </p>
          )}
        </div>
        <span className={cn('flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold', status.className)}>
          {status.label}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
        {application.rent > 0 && (
          <span className="flex items-center gap-1">
            <Wallet className="h-3 w-3 text-primary" />
            ${application.rent.toLocaleString()}/month
          </span>
        )}
        {application.bedrooms > 0 && <span>{application.bedrooms} bedroom{application.bedrooms > 1 ? 's' : ''}</span>}
        {application.source && <span>via {application.source}</span>}
        {formatDate(application.applied_date) && <span>Applied {formatDate(application.applied_date)}</span>}
        {formatDate(application.follow_up_date) && (
          <span className="flex items-center gap-1">
            <CalendarClock className="h-3 w-3 text-accent" />
            Follow up {formatDate(application.follow_up_date)}
          </span>
        )}
      </div>

      {application.landlord_contact && (
        <p className="mt-1.5 truncate text-[11px] text-muted-foreground">Contact: {application.landlord_contact}</p>
      )}
      {application.notes && (
        <p className="mt-1.5 rounded-lg bg-muted/50 p-2 text-[11px] leading-relaxed text-muted-foreground">
          {application.notes}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <Select value={application.status || 'saved'} onValueChange={changeStatus} disabled={saving}>
          <SelectTrigger className="h-8 w-[9.5rem] rounded-lg text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {HOUSING_STATUSES.map((option) => (
              <SelectItem key={option.id} value={option.id} className="text-xs">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {application.listing_url && (
          <Button asChild size="sm" variant="outline" className="h-8 gap-1.5 rounded-lg px-2.5 text-xs">
            <a href={application.listing_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
              Listing
            </a>
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={() => onEdit?.(application)} className="h-8 gap-1.5 rounded-lg px-2.5 text-xs">
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="ghost" className="ml-auto h-8 gap-1.5 rounded-lg px-2 text-xs text-muted-foreground">
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove this application?</AlertDialogTitle>
              <AlertDialogDescription>
                {application.property_name} will be deleted from your housing tracker.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep it</AlertDialogCancel>
              <AlertDialogAction onClick={remove}>Remove</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}