import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Plus, Briefcase, Loader2, ExternalLink, Calendar, Trash2, Edit3, ChevronDown, ChevronUp, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO, isPast, isToday } from 'date-fns';
import JobApplicationForm from '@/components/jobs/JobApplicationForm';

const STATUSES = [
  { id: 'saved',       label: 'Saved',        color: 'bg-slate-500/10 text-slate-600 border-slate-300',     dot: 'bg-slate-400' },
  { id: 'applied',     label: 'Applied',       color: 'bg-blue-500/10 text-blue-700 border-blue-300',        dot: 'bg-blue-500' },
  { id: 'interviewing',label: 'Interviewing',  color: 'bg-violet-500/10 text-violet-700 border-violet-300',  dot: 'bg-violet-500' },
  { id: 'offer',       label: 'Offer 🎉',      color: 'bg-emerald-500/10 text-emerald-700 border-emerald-300', dot: 'bg-emerald-500' },
  { id: 'rejected',    label: 'Rejected',      color: 'bg-red-500/10 text-red-600 border-red-300',           dot: 'bg-red-400' },
];

function StatusBadge({ status }) {
  const s = STATUSES.find(x => x.id === status) || STATUSES[0];
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border', s.color)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', s.dot)} />
      {s.label}
    </span>
  );
}

function ApplicationCard({ app, onEdit, onDelete, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);
  const followUp = app.follow_up_date ? parseISO(app.follow_up_date) : null;
  const followUpUrgent = followUp && (isToday(followUp) || isPast(followUp));

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-4 hover:border-primary/20 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <StatusBadge status={app.status} />
            {app.source && <span className="text-[10px] text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-full">{app.source}</span>}
          </div>
          <h3 className="font-heading font-bold text-sm leading-snug">{app.job_title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{app.company}{app.location ? ` · ${app.location}` : ''}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={() => onEdit(app)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <Edit3 className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <button onClick={() => onDelete(app.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-3 flex-wrap">
        {app.applied_date && (
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Applied {format(parseISO(app.applied_date), 'MMM d, yyyy')}
          </span>
        )}
        {followUp && (
          <span className={cn('text-[11px] flex items-center gap-1 font-semibold', followUpUrgent ? 'text-red-600' : 'text-amber-600')}>
            <Calendar className="w-3 h-3" /> Follow-up {format(followUp, 'MMM d')}
            {followUpUrgent && ' ⚠️'}
          </span>
        )}
        {app.salary_range && <span className="text-[11px] text-muted-foreground">💰 {app.salary_range}</span>}
        {app.cover_letter_sent && <span className="text-[11px] text-emerald-600">✓ Cover Letter Sent</span>}
        {app.resume_version && <span className="text-[11px] text-primary/80">📄 {app.resume_version}</span>}
      </div>

      {/* Status changer */}
      <div className="flex gap-1.5 mt-3 flex-wrap">
        {STATUSES.filter(s => s.id !== app.status).map(s => (
          <button
            key={s.id}
            onClick={() => onStatusChange(app.id, s.id)}
            className="text-[10px] px-2 py-1 rounded-lg border border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all"
          >
            → {s.label}
          </button>
        ))}
      </div>

      {(app.notes || app.job_url || app.contact_name) && (
        <button onClick={() => setExpanded(e => !e)} className="flex items-center gap-1 mt-3 text-[11px] text-primary font-medium hover:opacity-70 transition-opacity">
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? 'Less' : 'More details'}
        </button>
      )}

      {expanded && (
        <div className="mt-3 space-y-2 border-t border-border/40 pt-3">
          {app.contact_name && <p className="text-xs text-muted-foreground">👤 {app.contact_name}{app.contact_email ? ` · ${app.contact_email}` : ''}</p>}
          {app.notes && <p className="text-xs text-muted-foreground italic">📝 {app.notes}</p>}
          {app.job_url && (
            <a href={app.job_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-primary hover:underline">
              <LinkIcon className="w-3 h-3" /> View Job Posting <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function JobTracker() {
  const queryClient = useQueryClient();
  const [editingApp, setEditingApp] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [activeColumn, setActiveColumn] = useState('all');

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['jobApplications'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.JobApplication.filter({ created_by: user.email }, '-created_date', 200);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.JobApplication.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobApplications'] }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.JobApplication.update(id, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['jobApplications'] });
      const previous = queryClient.getQueryData(['jobApplications']);
      queryClient.setQueryData(['jobApplications'], old =>
        (old || []).map(app => app.id === id ? { ...app, status } : app)
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(['jobApplications'], ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['jobApplications'] }),
  });

  const filtered = activeColumn === 'all' ? applications : applications.filter(a => a.status === activeColumn);

  const counts = STATUSES.reduce((acc, s) => {
    acc[s.id] = applications.filter(a => a.status === s.id).length;
    return acc;
  }, {});

  const handleEdit = (app) => { setEditingApp(app); setShowForm(true); };
  const handleClose = () => { setEditingApp(null); setShowForm(false); };

  // Upcoming follow-ups
  const upcomingFollowUps = applications
    .filter(a => a.follow_up_date)
    .sort((a, b) => new Date(a.follow_up_date) - new Date(b.follow_up_date))
    .slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary" /> Job Tracker
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">Track every application in one place</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="rounded-xl gap-2 bg-primary">
          <Plus className="w-4 h-4" /> Add Job
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-5">
        {STATUSES.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveColumn(activeColumn === s.id ? 'all' : s.id)}
            className={cn(
              'flex flex-col items-center gap-1 p-3 rounded-2xl border transition-all text-center',
              activeColumn === s.id ? 'border-primary bg-primary/5' : 'border-border/50 bg-card hover:border-primary/20'
            )}
          >
            <span className={cn('text-xl font-heading font-bold', activeColumn === s.id ? 'text-primary' : 'text-foreground')}>{counts[s.id] || 0}</span>
            <span className="text-[10px] text-muted-foreground font-medium leading-tight">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Follow-up reminders */}
      {upcomingFollowUps.length > 0 && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 mb-5">
          <p className="text-xs font-semibold text-amber-700 mb-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Upcoming Follow-ups
          </p>
          <div className="space-y-1.5">
            {upcomingFollowUps.map(app => {
              const d = parseISO(app.follow_up_date);
              const urgent = isToday(d) || isPast(d);
              return (
                <div key={app.id} className="flex items-center justify-between text-xs">
                  <span className="font-medium truncate mr-3">{app.job_title} @ {app.company}</span>
                  <span className={cn('font-semibold flex-shrink-0', urgent ? 'text-red-600' : 'text-amber-600')}>
                    {isToday(d) ? 'Today' : format(d, 'MMM d')} {urgent && '⚠️'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All filter */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setActiveColumn('all')}
          className={cn('px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all',
            activeColumn === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border/50 text-muted-foreground hover:border-primary/30')}
        >
          All ({applications.length})
        </button>
        <span className="text-xs text-muted-foreground ml-auto">{filtered.length} application{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="font-heading font-bold text-lg mb-2">
            {applications.length === 0 ? 'No applications yet' : 'No applications in this column'}
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            {applications.length === 0 ? 'Start tracking your job applications to stay organised.' : 'Try selecting a different status.'}
          </p>
          {applications.length === 0 && (
            <Button onClick={() => setShowForm(true)} className="rounded-xl gap-2">
              <Plus className="w-4 h-4" /> Add your first application
            </Button>
          )}
        </div>
      )}

      <div className="space-y-3">
        {filtered.map(app => (
          <ApplicationCard
            key={app.id}
            app={app}
            onEdit={handleEdit}
            onDelete={(id) => deleteMutation.mutate(id)}
            onStatusChange={(id, status) => statusMutation.mutate({ id, status })}
          />
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <JobApplicationForm
          application={editingApp}
          onClose={handleClose}
          onSaved={() => {
            queryClient.invalidateQueries({ queryKey: ['jobApplications'] });
            handleClose();
          }}
        />
      )}
    </div>
  );
}