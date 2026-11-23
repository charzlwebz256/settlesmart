import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { HOUSING_STATUSES } from '@/data/housingDirectory';
import ApplicationCard from '@/components/housing/ApplicationCard';
import ApplicationForm from '@/components/housing/ApplicationForm';
import { Button } from '@/components/ui/button';
import { ClipboardList, Loader2, Lock, Plus } from 'lucide-react';

// The renter's own board: what they applied for, and where each one stands.
export default function HousingTracker() {
  const { isAuthenticated } = useAuth();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('all');

  const { data: applications = [], isLoading, refetch } = useQuery({
    queryKey: ['housingApplications'],
    enabled: isAuthenticated,
    queryFn: async () => {
      const page = await base44.entities.HousingApplication.filter({}, { sort: '-created_date', limit: 100 });
      return page.items || [];
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-8 text-center">
        <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
          <Lock className="h-5 w-5 text-muted-foreground" />
        </span>
        <h2 className="font-heading text-base font-bold">Sign in to track your housing search</h2>
        <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
          Keep every viewing, application and follow-up in one place, and see at a glance what still needs an answer.
        </p>
        <Button asChild className="mt-4 rounded-xl">
          <Link to="/login">Sign in</Link>
        </Button>
      </div>
    );
  }

  const visible = filter === 'all' ? applications : applications.filter((item) => item.status === filter);
  const counts = HOUSING_STATUSES.map((status) => ({
    ...status,
    count: applications.filter((item) => item.status === status.id).length,
  }));

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (application) => {
    setEditing(application);
    setFormOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${
              filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            All {applications.length > 0 && `(${applications.length})`}
          </button>
          {counts.filter((status) => status.count > 0).map((status) => (
            <button
              key={status.id}
              type="button"
              onClick={() => setFilter(status.id)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                filter === status.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {status.label} ({status.count})
            </button>
          ))}
        </div>
        <Button onClick={openNew} size="sm" className="h-8 gap-1.5 rounded-lg px-3 text-xs">
          <Plus className="h-3.5 w-3.5" />
          Track a rental
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card p-8 text-center">
          <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <ClipboardList className="h-5 w-5 text-primary" />
          </span>
          <h2 className="font-heading text-base font-bold">
            {applications.length === 0 ? 'Nothing tracked yet' : 'Nothing in this status'}
          </h2>
          <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
            {applications.length === 0
              ? 'Save a listing you like, then move it along as you contact the landlord, book a viewing and apply.'
              : 'Pick another status, or add a new rental to your tracker.'}
          </p>
          <Button onClick={openNew} size="sm" className="mt-4 gap-1.5 rounded-lg px-3 text-xs">
            <Plus className="h-3.5 w-3.5" />
            Track a rental
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {visible.map((application) => (
            <ApplicationCard key={application.id} application={application} onEdit={openEdit} onChanged={refetch} />
          ))}
        </div>
      )}

      <ApplicationForm
        open={formOpen}
        onOpenChange={setFormOpen}
        application={editing}
        onSaved={refetch}
      />
    </div>
  );
}