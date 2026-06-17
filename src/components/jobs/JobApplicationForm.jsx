import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/mobile-select';
import { X, Loader2, Save } from 'lucide-react';

const STATUSES = [
  { id: 'saved', label: 'Saved' },
  { id: 'applied', label: 'Applied' },
  { id: 'interviewing', label: 'Interviewing' },
  { id: 'offer', label: 'Offer' },
  { id: 'rejected', label: 'Rejected' },
];

const SOURCES = ['LinkedIn', 'Indeed', 'Job Bank', 'Jooble', 'ZipRecruiter', 'Glassdoor', 'Monster', 'Company Website', 'Referral', 'Other'];

export default function JobApplicationForm({ application, onClose, onSaved }) {
  const isEdit = !!application;
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    job_title: '',
    company: '',
    location: '',
    job_url: '',
    source: '',
    status: 'saved',
    applied_date: '',
    follow_up_date: '',
    salary_range: '',
    notes: '',
    resume_version: '',
    cover_letter_sent: false,
    contact_name: '',
    contact_email: '',
    job_description: '',
  });

  useEffect(() => {
    if (application) {
      setForm({
        job_title: application.job_title || '',
        company: application.company || '',
        location: application.location || '',
        job_url: application.job_url || '',
        source: application.source || '',
        status: application.status || 'saved',
        applied_date: application.applied_date || '',
        follow_up_date: application.follow_up_date || '',
        salary_range: application.salary_range || '',
        notes: application.notes || '',
        resume_version: application.resume_version || '',
        cover_letter_sent: application.cover_letter_sent || false,
        contact_name: application.contact_name || '',
        contact_email: application.contact_email || '',
        job_description: application.job_description || '',
      });
    }
  }, [application]);

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleSave = async () => {
    if (!form.job_title || !form.company) return;
    setSaving(true);
    try {
      if (isEdit) {
        await base44.entities.JobApplication.update(application.id, form);
      } else {
        await base44.entities.JobApplication.create(form);
      }
      onSaved();
    } catch (error) {
      console.error('Failed to save application:', error);
      alert('Failed to save application. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 safe-area-bottom">
      <div className="bg-card rounded-2xl shadow-2xl border border-border/50 w-full max-w-lg max-h-[90vh] overflow-y-auto safe-area-bottom">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border/50 px-5 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="font-heading font-bold text-base">{isEdit ? 'Edit Application' : 'Add Job Application'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Required */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs text-muted-foreground font-medium block mb-1">Job Title *</label>
              <input value={form.job_title} onChange={set('job_title')} placeholder="e.g. Software Developer" className="w-full text-sm px-3 py-2.5 rounded-xl border border-border/60 bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-medium block mb-1">Company *</label>
              <input value={form.company} onChange={set('company')} placeholder="Company name" className="w-full text-sm px-3 py-2.5 rounded-xl border border-border/60 bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-medium block mb-1">Location</label>
              <input value={form.location} onChange={set('location')} placeholder="City, Province" className="w-full text-sm px-3 py-2.5 rounded-xl border border-border/60 bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none" />
            </div>
          </div>

          {/* Status + Source */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground font-medium block mb-1">Status</label>
              <Select value={form.status} onValueChange={(value) => setForm(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-medium block mb-1">Source</label>
              <Select value={form.source} onValueChange={(value) => setForm(prev => ({ ...prev, source: value }))}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="— Select —" />
                </SelectTrigger>
                <SelectContent>
                  {SOURCES.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground font-medium block mb-1">📅 Applied Date</label>
              <input type="date" value={form.applied_date} onChange={set('applied_date')} className="w-full text-sm px-3 py-2.5 rounded-xl border border-border/60 bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-medium block mb-1">🔔 Follow-up Date</label>
              <input type="date" value={form.follow_up_date} onChange={set('follow_up_date')} className="w-full text-sm px-3 py-2.5 rounded-xl border border-border/60 bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none" />
            </div>
          </div>

          {/* URLs + Salary */}
          <div>
            <label className="text-xs text-muted-foreground font-medium block mb-1">Job Posting URL</label>
            <input value={form.job_url} onChange={set('job_url')} placeholder="https://..." className="w-full text-sm px-3 py-2.5 rounded-xl border border-border/60 bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium block mb-1">Salary Range</label>
            <input value={form.salary_range} onChange={set('salary_range')} placeholder="e.g. $55,000 – $70,000" className="w-full text-sm px-3 py-2.5 rounded-xl border border-border/60 bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none" />
          </div>

          {/* Resume + Cover Letter */}
          <div className="grid grid-cols-2 gap-3 items-end">
            <div>
              <label className="text-xs text-muted-foreground font-medium block mb-1">📄 Resume Version</label>
              <input value={form.resume_version} onChange={set('resume_version')} placeholder="e.g. v2-tech, Jan2025" className="w-full text-sm px-3 py-2.5 rounded-xl border border-border/60 bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none" />
            </div>
            <div className="flex items-center gap-2 pb-2.5">
              <input type="checkbox" id="cover_letter_sent" checked={form.cover_letter_sent} onChange={set('cover_letter_sent')} className="w-4 h-4 accent-primary rounded" />
              <label htmlFor="cover_letter_sent" className="text-sm font-medium cursor-pointer">Cover letter sent</label>
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground font-medium block mb-1">Contact Name</label>
              <input value={form.contact_name} onChange={set('contact_name')} placeholder="Recruiter name" className="w-full text-sm px-3 py-2.5 rounded-xl border border-border/60 bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-medium block mb-1">Contact Email</label>
              <input value={form.contact_email} onChange={set('contact_email')} placeholder="recruiter@company.com" className="w-full text-sm px-3 py-2.5 rounded-xl border border-border/60 bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none" />
            </div>
          </div>

          {/* Job description (for interview prep) */}
          <div>
            <label className="text-xs text-muted-foreground font-medium block mb-1">Job Description <span className="text-primary/60">(used for Interview Prep)</span></label>
            <textarea value={form.job_description} onChange={set('job_description')} placeholder="Paste the job description..." rows={3} className="w-full text-sm px-3 py-2.5 rounded-xl border border-border/60 bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none" />
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs text-muted-foreground font-medium block mb-1">Notes</label>
            <textarea value={form.notes} onChange={set('notes')} placeholder="Any personal notes..." rows={2} className="w-full text-sm px-3 py-2.5 rounded-xl border border-border/60 bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none" />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t border-border/50 px-5 py-4 flex gap-2 rounded-b-2xl">
          <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl">Cancel</Button>
          <Button onClick={handleSave} disabled={!form.job_title || !form.company || saving} className="flex-1 rounded-xl gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEdit ? 'Save Changes' : 'Add Application'}
          </Button>
        </div>
      </div>
    </div>
  );
}