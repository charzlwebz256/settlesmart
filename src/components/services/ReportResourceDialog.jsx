import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { MobileSelect as Select, MobileSelectContent as SelectContent, MobileSelectItem as SelectItem, MobileSelectTrigger as SelectTrigger, MobileSelectValue as SelectValue } from '@/components/ui/mobile-select';
import { Loader2, CheckCircle2, Flag } from 'lucide-react';

const ISSUE_TYPES = [
  { value: 'phone', label: 'Incorrect phone number' },
  { value: 'address', label: 'Incorrect address' },
  { value: 'website', label: 'Broken website' },
  { value: 'eligibility', label: 'Incorrect eligibility' },
  { value: 'unavailable', label: 'Service no longer available' },
  { value: 'description', label: 'Incorrect description' },
  { value: 'other', label: 'Other issue' },
];

export default function ReportResourceDialog({ open, onOpenChange, service }) {
  const [issueType, setIssueType] = useState('');
  const [details, setDetails] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const reset = () => {
    setIssueType('');
    setDetails('');
    setError('');
    setDone(false);
    setSaving(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!issueType) {
      setError('Choose what is wrong with this resource.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await base44.entities.ResourceReport.create({
        service_id: service.id,
        service_name: service.name,
        issue_type: issueType,
        details: details.trim(),
        status: 'open',
      });
      setDone(true);
    } catch (err) {
      setError(err.message || 'Your report could not be sent. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-primary" />
            Report incorrect information
          </DialogTitle>
          <DialogDescription>
            {service?.name} — a moderator reviews every report. Nothing is changed automatically.
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-10 h-10 text-primary mx-auto mb-3" />
            <p className="font-heading font-semibold text-sm mb-1">Thanks — report received</p>
            <p className="text-xs text-muted-foreground mb-4">
              A reviewer will check this resource against its official source.
            </p>
            <Button className="rounded-xl" onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                What is wrong?
              </label>
              <Select value={issueType} onValueChange={setIssueType}>
                <SelectTrigger className="rounded-xl text-sm">
                  <SelectValue placeholder="Choose an issue…" />
                </SelectTrigger>
                <SelectContent>
                  {ISSUE_TYPES.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                Details (optional)
              </label>
              <Textarea
                value={details}
                onChange={e => setDetails(e.target.value)}
                maxLength={1000}
                rows={3}
                placeholder="What did you find instead?"
                className="rounded-xl text-sm"
              />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Button type="submit" disabled={saving} className="w-full rounded-xl gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flag className="w-4 h-4" />}
              Send report
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}