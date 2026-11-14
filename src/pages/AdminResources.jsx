import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck, Lock, AlertTriangle, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import VerificationBadge from '@/components/services/VerificationBadge';
import VerifyResourceDialog from '@/components/admin/VerifyResourceDialog';

const TABS = [
  { id: 'pending', label: 'Pending' },
  { id: 'verified', label: 'Verified' },
  { id: 'review_due', label: 'Review due' },
  { id: 'reported', label: 'Reported' },
  { id: 'inactive', label: 'Inactive' },
];

export default function AdminResources() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('pending');
  const [editing, setEditing] = useState(null);

  const isAdmin = user?.role === 'admin';

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['adminServices'],
    queryFn: async () => {
      const page = await base44.entities.Service.filter({}, { limit: 500 });
      return page.items || [];
    },
    enabled: isAdmin,
  });

  const { data: reports = [] } = useQuery({
    queryKey: ['adminReports'],
    queryFn: () => base44.entities.ResourceReport.filter({ status: { $in: ['open', 'reviewing'] } }, '-created_date', 200),
    enabled: isAdmin,
  });

  const reportsByService = useMemo(() => {
    const map = {};
    reports.forEach(r => {
      if (!map[r.service_id]) map[r.service_id] = [];
      map[r.service_id].push(r);
    });
    return map;
  }, [reports]);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['adminServices'] });
    queryClient.invalidateQueries({ queryKey: ['adminReports'] });
    queryClient.invalidateQueries({ queryKey: ['serviceDirectory'] });
  };

  const statusOf = (s) => s.verification_status || 'pending';

  const rows = useMemo(() => {
    if (tab === 'reported') {
      return services.filter(s => (reportsByService[s.id]?.length || 0) > 0);
    }
    return services.filter(s => statusOf(s) === tab);
  }, [services, tab, reportsByService]);

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <h1 className="font-heading font-bold text-lg mb-1">Administrators only</h1>
        <p className="text-sm text-muted-foreground">This review queue is restricted to app administrators.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-24 md:pb-10">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-heading font-bold text-2xl">Resource verification</h1>
          <p className="text-muted-foreground text-sm">
            Review listings against their official source. Nothing is marked verified until you confirm a source and a review date.
          </p>
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-4">
        {TABS.map(t => {
          const count = t.id === 'reported'
            ? services.filter(s => (reportsByService[s.id]?.length || 0) > 0).length
            : services.filter(s => statusOf(s) === t.id).length;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all',
                tab === t.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border/50 text-muted-foreground hover:border-primary/30'
              )}
            >
              {t.label}
              <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full', tab === t.id ? 'bg-primary-foreground/20' : 'bg-muted')}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="py-16 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-border/50 bg-card">
          <ShieldCheck className="w-7 h-7 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-sm font-semibold">Nothing in this queue</p>
          <p className="text-xs text-muted-foreground mt-1">Resources appear here as their status changes.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map(service => {
            const serviceReports = reportsByService[service.id] || [];
            return (
              <div key={service.id} className="bg-card border border-border/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <VerificationBadge status={statusOf(service)} />
                    {serviceReports.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-700 dark:text-orange-300 bg-orange-500/10 px-2 py-0.5 rounded-full">
                        <Flag className="w-3 h-3" /> {serviceReports.length} report{serviceReports.length > 1 ? 's' : ''}
                      </span>
                    )}
                    {!service.source_url && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        <AlertTriangle className="w-3 h-3" /> No source
                      </span>
                    )}
                  </div>
                  <p className="font-heading font-semibold text-sm leading-snug truncate">{service.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {service.organization || '—'} · {service.city || 'Province-wide'}{service.province ? `, ${service.province}` : ''}
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => setEditing(service)} className="rounded-xl flex-shrink-0">
                  Review
                </Button>
              </div>
            );
          })}
        </div>
      )}

      <VerifyResourceDialog
        service={editing}
        reports={editing ? (reportsByService[editing.id] || []) : []}
        adminEmail={user?.email}
        open={!!editing}
        onOpenChange={(v) => { if (!v) setEditing(null); }}
        onSaved={refresh}
      />
    </div>
  );
}