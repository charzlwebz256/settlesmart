import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { isSafeUrl } from '@/lib/safeUrl';
import { Loader2, ShieldCheck, CalendarClock, Flag, Ban, AlertTriangle, RotateCcw } from 'lucide-react';
import VerificationBadge from '@/components/services/VerificationBadge';

const inputClass = 'w-full px-3 py-2 rounded-xl border border-border/60 bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30';

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

export default function VerifyResourceDialog({ service, reports = [], adminEmail, open, onOpenChange, onSaved }) {
  const [source, setSource] = useState('');
  const [reviewDate, setReviewDate] = useState('');
  const [verifiedBy, setVerifiedBy] = useState('');
  const [notes, setNotes] = useState('');
  const [contactedAt, setContactedAt] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!service) return;
    setSource(service.verification_source || '');
    setReviewDate(service.next_review_at ? String(service.next_review_at).slice(0, 10) : '');
    setVerifiedBy(service.verified_by || adminEmail || '');
    setNotes(service.verification_notes || '');
    setContactedAt(service.last_contacted_at ? String(service.last_contacted_at).slice(0, 10) : '');
    setError('');
  }, [service, adminEmail]);

  if (!service) return null;

  const save = async (newStatus) => {
    if (newStatus === 'verified') {
      if (!isSafeUrl(source)) {
        setError('Add the official source URL (https://…) before marking this resource verified.');
        return;
      }
      if (!reviewDate) {
        setError('Set the next review date before marking this resource verified.');
        return;
      }
    }
    setSaving(true);
    setError('');
    try {
      const data = {
        verification_source: source.trim(),
        next_review_at: reviewDate || null,
        verified_by: verifiedBy.trim(),
        verification_notes: notes,
        last_contacted_at: contactedAt ? new Date(contactedAt).toISOString() : null,
      };
      if (newStatus === 'verified') {
        data.verification_status = 'verified';
        data.verified_at = new Date().toISOString();
      } else if (newStatus) {
        data.verification_status = newStatus;
      }
      await base44.entities.Service.update(service.id, data);
      onSaved();
      onOpenChange(false);
    } catch (err) {
      setError(err.message || 'Could not save this review.');
    } finally {
      setSaving(false);
    }
  };

  const setReportStatus = async (report, status) => {
    await base44.entities.ResourceReport.update(report.id, { status });
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-base leading-snug">{service.name}</DialogTitle>
          <DialogDescription className="text-xs flex items-center gap-2 flex-wrap">
            <VerificationBadge status={service.verification_status} />
            {service.organization}
            {service.city ? ` · ${service.city}, ${service.province}` : ` · ${service.province}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="rounded-xl bg-muted/40 border border-border/40 p-3 text-xs text-muted-foreground">
            {service.description || 'No description stored.'}
            {service.website && (
              <p className="mt-1 truncate">
                Website: <a href={service.website} target="_blank" rel="noopener noreferrer" className="text-primary underline">{service.website}</a>
              </p>
            )}
            {service.source_url && (
              <p className="mt-0.5 truncate">
                Stored source: <a href={service.source_url} target="_blank" rel="noopener noreferrer" className="text-primary underline">{service.source_url}</a>
              </p>
            )}
          </div>

          <Field label="Source URL" hint="Required to mark this resource verified.">
            <input value={source} onChange={e => setSource(e.target.value)} placeholder="https://…" className={inputClass} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Next review date">
              <input type="date" value={reviewDate} onChange={e => setReviewDate(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Last contacted">
              <input type="date" value={contactedAt} onChange={e => setContactedAt(e.target.value)} className={inputClass} />
            </Field>
          </div>

          <Field label="Reviewed by">
            <input value={verifiedBy} onChange={e => setVerifiedBy(e.target.value)} className={inputClass} />
          </Field>

          <Field label="Internal notes" hint="Only visible on this admin screen.">
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} maxLength={1000} className="rounded-xl text-sm" />
          </Field>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => save('verified')} disabled={saving} className="rounded-xl gap-1.5">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              Mark verified
            </Button>
            <Button variant="outline" onClick={() => save(null)} disabled={saving} className="rounded-xl gap-1.5">
              <CalendarClock className="w-4 h-4" /> Save review
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1 border-t border-border/40">
            <Button size="sm" variant="outline" onClick={() => save('review_due')} disabled={saving} className="rounded-lg gap-1">
              <CalendarClock className="w-3.5 h-3.5" /> Review due
            </Button>
            <Button size="sm" variant="outline" onClick={() => save('needs_correction')} disabled={saving} className="rounded-lg gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Needs correction
            </Button>
            {service.verification_status === 'inactive' ? (
              <Button size="sm" variant="outline" onClick={() => save('pending')} disabled={saving} className="rounded-lg gap-1">
                <RotateCcw className="w-3.5 h-3.5" /> Reactivate
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={() => save('inactive')} disabled={saving} className="rounded-lg gap-1 text-destructive">
                <Ban className="w-3.5 h-3.5" /> Deactivate
              </Button>
            )}
          </div>

          {reports.length > 0 && (
            <div className="pt-2 border-t border-border/40">
              <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground mb-2">
                Reported issues ({reports.length})
              </p>
              <div className="space-y-2">
                {reports.map(r => (
                  <div key={r.id} className="rounded-xl border border-border/50 p-2.5 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold flex items-center gap-1">
                        <Flag className="w-3 h-3 text-orange-500" />
                        {r.issue_type?.replace(/_/g, ' ')}
                      </span>
                      <div className="flex gap-1">
                        <button onClick={() => setReportStatus(r, 'resolved')} className="text-[10px] font-bold text-emerald-700 hover:underline">Resolve</button>
                        <button onClick={() => setReportStatus(r, 'dismissed')} className="text-[10px] font-bold text-muted-foreground hover:underline">Dismiss</button>
                      </div>
                    </div>
                    {r.details && <p className="text-muted-foreground mt-1">{r.details}</p>}
                    <p className="text-[10px] text-muted-foreground/70 mt-1">
                      {r.created_date ? new Date(r.created_date).toLocaleDateString('en-CA') : ''} · {r.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}