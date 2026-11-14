import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { MapPin, Phone, Mail, Globe, ExternalLink, Bookmark, Flag, Users, CheckCircle2, ShieldCheck, CalendarClock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { safeHref } from '@/lib/safeUrl';
import VerificationBadge from './VerificationBadge';
import ReportResourceDialog from './ReportResourceDialog';

const ELIGIBILITY_LABELS = {
  permanent_resident: 'Permanent Resident',
  refugee: 'Refugee',
  international_student: 'International Student',
  temporary_worker: 'Temporary Worker',
  asylum_seeker: 'Asylum Seeker',
  citizen: 'Citizen',
};

function formatDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d.toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function ResourceDetailDialog({ service, open, onOpenChange, saved, onToggleSave }) {
  const [reportOpen, setReportOpen] = useState(false);
  if (!service) return null;

  const website = safeHref(service.website);
  const source = safeHref(service.source_url);
  const verifiedOn = formatDate(service.verified_at);
  const eligibility = service.eligibility || [];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <VerificationBadge status={service.verification_status} />
              {service.is_free && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">FREE</span>
              )}
              {service.is_free === false && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">PAID</span>
              )}
            </div>
            <DialogTitle className="font-heading text-lg leading-snug">{service.name}</DialogTitle>
            <DialogDescription className="text-xs">
              {service.organization && service.organization !== service.name ? service.organization : 'Community service'}
              {service.city ? ` · ${service.city}${service.province ? `, ${service.province}` : ''}` : ''}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {service.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
            )}

            {eligibility.length > 0 && (
              <div className="rounded-xl bg-muted/40 border border-border/40 p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Who can use it</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {eligibility.map(e => (
                    <span key={e} className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-card border border-border/60">
                      <CheckCircle2 className="w-2.5 h-2.5 text-primary" />
                      {ELIGIBILITY_LABELS[e] || e.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-1.5 text-sm text-muted-foreground">
              {service.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-primary/60 mt-0.5 flex-shrink-0" />
                  <span>{service.address}</span>
                </div>
              )}
              {service.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-primary/60 flex-shrink-0" />
                  <a href={`tel:${service.phone}`} className="hover:text-primary font-medium">{service.phone}</a>
                </div>
              )}
              {service.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-primary/60 flex-shrink-0" />
                  <a href={`mailto:${service.email}`} className="hover:text-primary truncate">{service.email}</a>
                </div>
              )}
              {service.languages_offered?.length > 0 && (
                <div className="flex items-start gap-2">
                  <Globe className="w-3.5 h-3.5 text-primary/60 mt-0.5 flex-shrink-0" />
                  <span>Available in {service.languages_offered.join(', ')}</span>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-border/50 p-3 space-y-1.5 text-[11px] text-muted-foreground">
              {service.verification_status === 'verified' && verifiedOn && (
                <p className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Last verified {verifiedOn}
                </p>
              )}
              {service.next_review_at && (
                <p className="flex items-center gap-1.5">
                  <CalendarClock className="w-3.5 h-3.5" />
                  Next review {formatDate(service.next_review_at)}
                </p>
              )}
              {source && (
                <p className="flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <a href={source} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                    Original information source
                  </a>
                </p>
              )}
              {service.verification_status !== 'verified' && (
                <p className="text-amber-700 dark:text-amber-300">
                  This listing has not been verified against its official source yet — confirm details before relying on them.
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {website && (
                <Button asChild className="rounded-xl gap-1.5 flex-1">
                  <a href={website} target="_blank" rel="noopener noreferrer">
                    <Globe className="w-4 h-4" /> Official website
                  </a>
                </Button>
              )}
              {onToggleSave && (
                <Button
                  variant={saved ? 'default' : 'outline'}
                  onClick={() => onToggleSave(service)}
                  className={cn('rounded-xl gap-1.5', saved && 'bg-primary')}
                >
                  <Bookmark className={cn('w-4 h-4', saved && 'fill-current')} />
                  {saved ? 'Saved' : 'Save'}
                </Button>
              )}
              <Button variant="outline" onClick={() => setReportOpen(true)} className="rounded-xl gap-1.5">
                <Flag className="w-4 h-4" />
                Report an issue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ReportResourceDialog open={reportOpen} onOpenChange={setReportOpen} service={service} />
    </>
  );
}