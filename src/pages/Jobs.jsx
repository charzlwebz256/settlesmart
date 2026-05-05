import { useState, useEffect, useCallback } from 'react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import PullToRefreshIndicator from '@/components/ui/PullToRefreshIndicator';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, RefreshCw, Briefcase, MapPin, Clock, ExternalLink, Building2, DollarSign, SlidersHorizontal, FileText, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useCityDetection } from '@/hooks/useCityDetection';
import JobCard from '@/components/jobs/JobCard';
import JobFilters from '@/components/jobs/JobFilters';
import JobAlertSubscribe from '@/components/jobs/JobAlertSubscribe';

const SOURCE_TABS = [
  { id: 'all', label: 'All Jobs' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'indeed', label: 'Indeed' },
  { id: 'jooble', label: 'Jooble' },
  { id: 'jobbank', label: 'Job Bank' },
  { id: 'ziprecruiter', label: 'ZipRecruiter' },
];

export default function Jobs() {
  const { city, province, loading: cityLoading } = useCityDetection();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSource, setActiveSource] = useState('all');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastFetched, setLastFetched] = useState(null);
  const [filters, setFilters] = useState({ type: 'all', experience: 'all' });
  const [showFilters, setShowFilters] = useState(false);
  const [autoRefreshTimer, setAutoRefreshTimer] = useState(null);

  const fetchJobs = useCallback(async (query = searchQuery, location = city) => {
    const loc = location || city;
    if (!loc && !query) return;
    setLoading(true);

    const searchLoc = loc || 'Canada';
    const searchTerm = query || 'newcomer immigrant jobs';

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Find 12 real current job listings for "${searchTerm}" in ${searchLoc}, Canada. Mix sources across LinkedIn, Indeed, Jooble (jooble.org), Job Bank Canada (jobbank.gc.ca), and ZipRecruiter. Focus on roles accessible to newcomers (entry-level, trades, healthcare, IT, customer service). For each job provide: title, company, location, job_type (full_time/part_time/contract/remote), experience_level (entry/mid/senior), salary (or empty string), posted (e.g. "2 days ago"), description (one short sentence), url (direct link to the job listing), source (linkedin/indeed/jooble/jobbank/ziprecruiter), is_newcomer_friendly (boolean).`,
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
                experience_level: { type: 'string' },
                salary: { type: 'string' },
                posted: { type: 'string' },
                description: { type: 'string' },
                url: { type: 'string' },
                source: { type: 'string' },
                is_newcomer_friendly: { type: 'boolean' },
              },
            },
          },
        },
      },
    });

    setJobs(result?.jobs || []);
    setLastFetched(new Date());
    setLoading(false);
  }, [searchQuery, city]);

  // Auto-load when city is detected (only once)
  useEffect(() => {
    if (!cityLoading && city && jobs.length === 0 && !loading) {
      fetchJobs('', city);
    }
  }, [city, cityLoading]); // eslint-disable-line

  // Auto-refresh every 10 minutes (not 5 — reduces unnecessary LLM calls)
  useEffect(() => {
    const timer = setInterval(() => {
      if (!loading && jobs.length > 0) fetchJobs();
    }, 10 * 60 * 1000);
    return () => clearInterval(timer);
  }, [fetchJobs, loading]);

  const { containerRef, pullDistance, isRefreshing, touchHandlers } = usePullToRefresh({
    onRefresh: () => fetchJobs(searchQuery, city),
  });

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(searchQuery, city);
  };

  const filtered = jobs.filter(job => {
    const sourceMatch = activeSource === 'all' || job.source === activeSource;
    const typeMatch = filters.type === 'all' || job.job_type === filters.type;
    const expMatch = filters.experience === 'all' || job.experience_level === filters.experience;
    return sourceMatch && typeMatch && expMatch;
  });

  const linkedinCount = jobs.filter(j => j.source === 'linkedin').length;
  const indeedCount = jobs.filter(j => j.source === 'indeed').length;

  return (
    <div ref={containerRef} className="max-w-5xl mx-auto px-4 py-6 pb-24 md:pb-8 overflow-y-auto" {...touchHandlers}>
      <PullToRefreshIndicator pullDistance={pullDistance} isRefreshing={isRefreshing} />
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-1 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-primary" />
          Job Search
        </h1>
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm flex-wrap">
          {cityLoading ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Detecting location...</>
          ) : (
            <>
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>Jobs near <span className="font-medium text-foreground">{city}{province ? `, ${province}` : ''}</span></span>
              {lastFetched && (
                <span className="text-[11px] text-muted-foreground/60 ml-1">
                  · Updated {lastFetched.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Resume Builder Banner */}
      <Link to="/resume-builder" className="flex items-center justify-between gap-3 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl px-4 py-3 mb-4 hover:border-primary/40 transition-all group">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
            <FileText className="w-4.5 h-4.5 w-[18px] h-[18px] text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">🍁 Smart Resume Builder</p>
            <p className="text-xs text-muted-foreground">AI-powered · Canadian format · ATS-optimized · Cover letter included</p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 group-hover:translate-x-1 transition-transform" />
      </Link>

      {/* Job Alert */}
      <JobAlertSubscribe defaultCity={city || ''} />

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search jobs by title, skill, or keyword..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border/60 bg-card text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
        </div>
        <Button type="submit" disabled={loading} className="rounded-xl px-5 bg-primary hover:bg-primary/90 gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Search
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={cn("rounded-xl gap-1.5", showFilters && "border-primary text-primary")}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => fetchJobs()}
          disabled={loading}
          className="rounded-xl"
          aria-label="Refresh jobs"
        >
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
        </Button>
      </form>

      {/* Filters */}
      {showFilters && (
        <JobFilters filters={filters} onChange={setFilters} />
      )}

      {/* Source Tabs + Counts */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1.5">
          {SOURCE_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSource(tab.id)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
                activeSource === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border/50 text-muted-foreground hover:border-primary/30"
              )}
            >
              {tab.label}
              {tab.id === 'linkedin' && linkedinCount > 0 && (
                <span className="ml-1.5 opacity-70">({linkedinCount})</span>
              )}
              {tab.id === 'indeed' && indeedCount > 0 && (
                <span className="ml-1.5 opacity-70">({indeedCount})</span>
              )}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">{filtered.length} job{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Platform Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
        <a
          href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(searchQuery || 'jobs')}&location=${encodeURIComponent((city || '') + ' Canada')}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 text-xs font-semibold hover:bg-blue-500/15 transition-colors"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" className="w-4 h-4 rounded flex-shrink-0" alt="LinkedIn" />
          <span className="truncate">LinkedIn</span>
          <ExternalLink className="w-3 h-3 opacity-60 flex-shrink-0 ml-auto" />
        </a>
        <a
          href={`https://ca.indeed.com/jobs?q=${encodeURIComponent(searchQuery || 'jobs')}&l=${encodeURIComponent((city || '') + ', Canada')}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 text-xs font-semibold hover:bg-indigo-500/15 transition-colors"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fc/Indeed_logo.svg" className="w-10 h-3.5 object-contain flex-shrink-0" alt="Indeed" />
          <span className="truncate">Indeed</span>
          <ExternalLink className="w-3 h-3 opacity-60 flex-shrink-0 ml-auto" />
        </a>
        <a
          href={`https://jooble.org/jobs-${encodeURIComponent((searchQuery || 'jobs').replace(/ /g, '-'))}/${encodeURIComponent(city || 'canada')}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-700 text-xs font-semibold hover:bg-orange-500/15 transition-colors"
        >
          <img src="https://jooble.org/favicon.ico" className="w-4 h-4 rounded flex-shrink-0" alt="Jooble" />
          <span className="truncate">Jooble</span>
          <ExternalLink className="w-3 h-3 opacity-60 flex-shrink-0 ml-auto" />
        </a>
        <a
          href={`https://www.jobbank.gc.ca/jobsearch/jobsearch?searchstring=${encodeURIComponent(searchQuery || '')}&locationstring=${encodeURIComponent(city || 'Canada')}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 text-xs font-semibold hover:bg-red-500/15 transition-colors"
        >
          <img src="https://www.jobbank.gc.ca/favicon.ico" className="w-4 h-4 rounded flex-shrink-0" alt="Job Bank" />
          <span className="truncate">Job Bank GC</span>
          <ExternalLink className="w-3 h-3 opacity-60 flex-shrink-0 ml-auto" />
        </a>
        <a
          href={`https://www.ziprecruiter.com/jobs-search?search=${encodeURIComponent(searchQuery || 'jobs')}&location=${encodeURIComponent((city || '') + ', Canada')}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-700 text-xs font-semibold hover:bg-green-500/15 transition-colors"
        >
          <img src="https://www.ziprecruiter.com/favicon.ico" className="w-4 h-4 rounded flex-shrink-0" alt="ZipRecruiter" />
          <span className="truncate">ZipRecruiter</span>
          <ExternalLink className="w-3 h-3 opacity-60 flex-shrink-0 ml-auto" />
        </a>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm font-medium">Fetching live jobs from LinkedIn, Indeed, Jooble, Job Bank & ZipRecruiter...</p>
          <p className="text-xs text-muted-foreground mt-1">This may take a moment</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && jobs.length === 0 && !cityLoading && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">💼</div>
          <h3 className="font-heading font-bold text-lg mb-2">No jobs loaded yet</h3>
          <p className="text-muted-foreground text-sm mb-4">Search for a keyword or wait for auto-detection</p>
          <Button onClick={() => fetchJobs('', city)} className="rounded-xl gap-2 bg-primary">
            <Search className="w-4 h-4" /> Load Jobs in {city || 'Canada'}
          </Button>
        </div>
      )}

      {/* No filter results */}
      {!loading && filtered.length === 0 && jobs.length > 0 && (
        <div className="text-center py-10 text-muted-foreground text-sm">
          No jobs match your current filters. Try adjusting them.
        </div>
      )}

      {/* Jobs Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((job, i) => (
            <JobCard key={i} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}