import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import AdminStatCard from '@/components/admin/AdminStatCard';
import { Button } from '@/components/ui/button';
import { BarChart3, Loader2, Lock, Search, ShieldCheck } from 'lucide-react';

const DAY = 24 * 60 * 60 * 1000;
const WEEK = 7 * DAY;
const iso = (ms) => new Date(ms).toISOString();

function trendOf(current, previous) {
  if (!previous) return null;
  const diff = ((current - previous) / previous) * 100;
  return { direction: diff < 0 ? 'down' : 'up', value: `${Math.abs(Math.round(diff))}%` };
}

function distinctUsers(visits) {
  return new Set(visits.map((visit) => visit.created_by_id).filter(Boolean)).size;
}

function titleCase(text) {
  return String(text || '').replace(/\b\w/g, (char) => char.toUpperCase());
}

// Owner view: how many people use SettleSmart, and what they look up most.
export default function AdminDashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const { data, isLoading } = useQuery({
    queryKey: ['adminOverview'],
    enabled: isAdmin,
    queryFn: async () => {
      const now = Date.now();
      const [users, visitsNow, visitsPrev, searchesNow, searchesPrev, totalSearches, grouped] = await Promise.all([
        base44.entities.User.list(),
        base44.entities.AppVisit.filter({ created_date: { $gte: iso(now - WEEK) } }, { limit: 1000 }),
        base44.entities.AppVisit.filter(
          { created_date: { $gte: iso(now - 2 * WEEK), $lt: iso(now - WEEK) } },
          { limit: 1000 }
        ),
        base44.entities.ResourceSearch.count({ created_date: { $gte: iso(now - WEEK) } }),
        base44.entities.ResourceSearch.count({
          created_date: { $gte: iso(now - 2 * WEEK), $lt: iso(now - WEEK) },
        }),
        base44.entities.ResourceSearch.count({}),
        base44.entities.ResourceSearch.aggregate({ query: {}, groupBy: 'query' }),
      ]);

      const list = Array.isArray(users) ? users : users?.items || [];
      const newUsers = list.filter(
        (account) => account.created_date && now - new Date(account.created_date).getTime() <= 30 * DAY
      ).length;

      const rows = (grouped?.rows || [])
        .map((row) => ({ term: row.query, count: row.count || 0 }))
        .filter((row) => row.term)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return {
        totalUsers: list.length,
        newUsers,
        activeNow: distinctUsers(visitsNow?.items || []),
        activePrev: distinctUsers(visitsPrev?.items || []),
        searchesNow,
        searchesPrev,
        totalSearches,
        rows,
      };
    },
  });

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
          <Lock className="h-5 w-5 text-muted-foreground" />
        </span>
        <h1 className="font-heading text-lg font-bold">Admins only</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This overview is limited to the SettleSmart admin account.
        </p>
        <Button asChild className="mt-4 rounded-xl">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  const totalUsers = data?.totalUsers || 0;
  const activeShare = totalUsers ? ((data?.activeNow || 0) / totalUsers) * 100 : 0;
  const newShare = totalUsers ? ((data?.newUsers || 0) / totalUsers) * 100 : 0;
  const searchShare = data?.totalSearches ? ((data?.searchesNow || 0) / data.totalSearches) * 100 : 0;
  const topCount = data?.rows?.[0]?.count || 1;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 pb-24 md:pb-10">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 font-heading text-xl font-bold md:text-2xl">
            <BarChart3 className="h-5 w-5 text-primary" />
            Admin overview
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            How people are using SettleSmart and what they look up most.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
          <ShieldCheck className="h-3.5 w-3.5" />
          Admin only
        </span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <AdminStatCard
              label="Active users"
              value={(data?.activeNow || 0).toLocaleString()}
              unit="people"
              progress={activeShare}
              goalText={
                <>
                  <strong className="font-semibold text-foreground">{Math.round(activeShare)}%</strong> of {totalUsers} registered
                </>
              }
              trend={{ ...(trendOf(data?.activeNow || 0, data?.activePrev || 0) || { direction: 'up', value: '0%' }), period: 'vs last week' }}
              defaultOpen
            />
            <AdminStatCard
              label="New sign-ups"
              value={(data?.newUsers || 0).toLocaleString()}
              unit="people"
              progress={newShare}
              goalText={
                <>
                  joined in the <strong className="font-semibold text-foreground">last 30 days</strong>
                </>
              }
            />
            <AdminStatCard
              label="Resource searches"
              value={(data?.searchesNow || 0).toLocaleString()}
              unit="searches"
              progress={searchShare}
              goalText={
                <>
                  of <strong className="font-semibold text-foreground">{(data?.totalSearches || 0).toLocaleString()}</strong> searches all time
                </>
              }
              trend={{ ...(trendOf(data?.searchesNow || 0, data?.searchesPrev || 0) || { direction: 'up', value: '0%' }), period: 'vs last week' }}
            />
          </div>

          <section className="rounded-2xl border border-border/60 bg-card p-4">
            <h2 className="flex items-center gap-1.5 font-heading text-sm font-bold">
              <Search className="h-4 w-4 text-primary" />
              Most searched settlement resources
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              What newcomers type into the National Directory search.
            </p>

            {data?.rows?.length ? (
              <ul className="mt-3 space-y-2.5">
                {data.rows.map((row, index) => (
                  <li key={row.term} className="flex items-center gap-3">
                    <span className="w-4 flex-shrink-0 text-[11px] font-bold text-muted-foreground">{index + 1}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="truncate text-xs font-semibold text-foreground">{titleCase(row.term)}</p>
                        <span className="flex-shrink-0 text-[11px] font-medium text-muted-foreground">
                          {row.count.toLocaleString()} {row.count === 1 ? 'search' : 'searches'}
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${Math.max(6, (row.count / topCount) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 rounded-xl bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">
                No directory searches logged yet. As people search the National Directory, the most looked-up resources
                will appear here.
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}