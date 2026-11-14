import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Bell, Loader2, CheckCircle2, X } from 'lucide-react';

export default function JobAlertSubscribe({ defaultCity = '' }) {
  const [open, setOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState(defaultCity);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobTitle) return;
    setLoading(true);
    setError('');

    try {
      // The backend resolves the recipient from the signed-in account.
      const { data } = await base44.functions.invoke('sendJobAlert', { jobTitle, location });
      if (data?.error) throw new Error(data.error);
      setSuccess(true);
      setTimeout(() => { setSuccess(false); setOpen(false); setJobTitle(''); }, 3000);
    } catch (err) {
      setError(err?.message || 'Could not send the alert. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-semibold hover:bg-primary/15 transition-colors"
      >
        <Bell className="w-4 h-4" />
        Set Job Alert
      </button>
    );
  }

  return (
    <div className="bg-card border border-primary/20 rounded-2xl p-5 mb-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          <h3 className="font-heading font-bold text-sm">Job Alert Subscription</h3>
        </div>
        <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-muted">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Enter a job title and location. We'll email matching listings to the address on your account.
      </p>
      {success ? (
        <div className="flex items-center gap-2 text-green-600 py-4 justify-center">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium text-sm">Alert sent to your account email!</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={jobTitle}
            onChange={e => setJobTitle(e.target.value)}
            placeholder="Job title or keyword (e.g. Nurse, Software Developer)"
            required
            className="w-full px-3 py-2 rounded-xl border border-border/60 bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
          <input
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Location (e.g. Edmonton, Alberta)"
            className="w-full px-3 py-2 rounded-xl border border-border/60 bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full rounded-xl gap-2 bg-primary hover:bg-primary/90">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending matches...</> : <><Bell className="w-4 h-4" /> Send Job Alert Now</>}
          </Button>
        </form>
      )}
    </div>
  );
}