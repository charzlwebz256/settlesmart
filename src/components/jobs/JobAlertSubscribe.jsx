import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, Loader2, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function JobAlertSubscribe({ defaultCity = '' }) {
  const [open, setOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState(defaultCity);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobTitle || !email) return;
    setLoading(true);

    // Fetch matching jobs immediately and email the summary
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Search LinkedIn Jobs and Indeed Canada for current job listings matching:
- Job title/keyword: "${jobTitle}"
- Location: ${location || 'Canada'}

Find the top 5 most relevant current job postings. For each include:
- title, company, location, job_type, salary (if available), posted, url (LinkedIn or Indeed link), source

Return as JSON.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: 'object',
        properties: {
          jobs: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                company: { type: 'string' },
                location: { type: 'string' },
                job_type: { type: 'string' },
                salary: { type: 'string' },
                posted: { type: 'string' },
                url: { type: 'string' },
                source: { type: 'string' },
              },
            },
          },
        },
      },
    });

    const jobs = result?.jobs || [];
    const jobList = jobs.map((j, i) =>
      `${i + 1}. ${j.title} at ${j.company} — ${j.location}${j.salary ? ' · ' + j.salary : ''}\n   ${j.source === 'linkedin' ? 'LinkedIn' : 'Indeed'}: ${j.url}`
    ).join('\n\n');

    await base44.integrations.Core.SendEmail({
      to: email,
      subject: `🍁 Job Alert: ${jobTitle} in ${location || 'Canada'}`,
      body: `Hi there,\n\nHere are the latest job matches for "${jobTitle}" in ${location || 'Canada'}:\n\n${jobList || 'No new listings found right now. We\'ll keep searching!'}\n\n---\nSearch more jobs:\n• LinkedIn: https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(jobTitle)}&location=${encodeURIComponent(location + ' Canada')}\n• Indeed: https://ca.indeed.com/jobs?q=${encodeURIComponent(jobTitle)}&l=${encodeURIComponent(location)}\n\nThis alert was sent from SettleSmart Canada. To manage alerts, visit the app.\n\nGood luck with your job search! 🍁`,
    });

    setLoading(false);
    setSuccess(true);
    setTimeout(() => { setSuccess(false); setOpen(false); setJobTitle(''); setEmail(''); }, 3000);
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
        Enter your details below — we'll immediately send you matching job listings and you can re-run anytime.
      </p>
      {success ? (
        <div className="flex items-center gap-2 text-green-600 py-4 justify-center">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium text-sm">Alert sent to {email}!</span>
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
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="w-full px-3 py-2 rounded-xl border border-border/60 bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
          <Button type="submit" disabled={loading} className="w-full rounded-xl gap-2 bg-primary hover:bg-primary/90">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending matches...</> : <><Bell className="w-4 h-4" /> Send Job Alert Now</>}
          </Button>
        </form>
      )}
    </div>
  );
}