import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Bookmark, ExternalLink, Trash2, Loader2, GraduationCap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const STATUSES = [
  { id: 'saved', label: 'Saved', color: 'bg-slate-500/10 text-slate-600 border-slate-300', dot: 'bg-slate-400' },
  { id: 'applied', label: 'Applied', color: 'bg-blue-500/10 text-blue-700 border-blue-300', dot: 'bg-blue-500' },
  { id: 'in_progress', label: 'In Review', color: 'bg-amber-500/10 text-amber-700 border-amber-300', dot: 'bg-amber-500' },
  { id: 'awarded', label: 'Awarded', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-300', dot: 'bg-emerald-500' },
  { id: 'rejected', label: 'Declined', color: 'bg-red-500/10 text-red-600 border-red-300', dot: 'bg-red-400' },
];

export default function MyScholarships() {
  const queryClient = useQueryClient();

  const { data: saved = [], isLoading } = useQuery({
    queryKey: ['savedScholarships'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.SavedScholarship.filter({ created_by: user.email }, '-created_date');
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.SavedScholarship.update(id, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['savedScholarships'] });
      const prev = queryClient.getQueryData(['savedScholarships']);
      queryClient.setQueryData(['savedScholarships'], old =>
        (old || []).map(s => (s.id === id ? { ...s, status } : s))
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => queryClient.setQueryData(['savedScholarships'], ctx.prev),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['savedScholarships'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.SavedScholarship.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['savedScholarships'] }),
  });

  const appliedCount = saved.filter(s => ['applied', 'in_progress', 'awarded'].includes(s.status)).length;
  const progress = saved.length > 0 ? (appliedCount / saved.length) * 100 : 0;
  const statusCounts = STATUSES.reduce((acc, s) => {
    acc[s.id] = saved.filter(x => x.status === s.id).length;
    return acc;
  }, {});

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-heading font-bold text-lg flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" /> My Scholarships
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {saved.length} saved · {appliedCount} in progress
          </p>
        </div>
        <Link to="/scholarships">
          <Button variant="outline" size="sm" className="rounded-lg text-xs gap-1">
            Browse <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      ) : saved.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Bookmark className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Save scholarships to track your applications here.
          </p>
          <Link to="/scholarships">
            <Button size="sm" className="rounded-lg gap-2">
              <GraduationCap className="w-3.5 h-3.5" /> Find Scholarships
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <Progress value={progress} className="h-2 mb-4" />
          <div className="flex gap-1.5 mb-4 flex-wrap">
            {STATUSES.map(s => (
              <span key={s.id} className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border', s.color)}>
                <span className={cn('w-1.5 h-1.5 rounded-full', s.dot)} />
                {statusCounts[s.id] || 0} {s.label}
              </span>
            ))}
          </div>
          <div className="space-y-2">
            {saved.map(s => (
              <div key={s.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border border-border/40">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold leading-snug">{s.scholarship_name}</h3>
                  {(s.province || s.funding_type) && (
                    <p className="text-[11px] text-muted-foreground mt-0.5 capitalize">
                      {[s.funding_type, s.province, s.city].filter(Boolean).map(x => String(x).replace(/_/g, ' ')).join(' · ')}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {s.link && (
                      <a href={s.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline">
                        <ExternalLink className="w-3 h-3" /> View
                      </a>
                    )}
                    <button onClick={() => deleteMutation.mutate(s.id)} className="inline-flex items-center gap-1 text-[10px] text-red-500 hover:underline">
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <select
                    value={s.status}
                    onChange={e => statusMutation.mutate({ id: s.id, status: e.target.value })}
                    className="text-[11px] border border-border/60 rounded-lg px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-primary/30 cursor-pointer"
                  >
                    {STATUSES.map(st => (
                      <option key={st.id} value={st.id}>{st.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}