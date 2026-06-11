import { useState, useEffect, useCallback } from 'react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import PullToRefreshIndicator from '@/components/ui/PullToRefreshIndicator';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, RefreshCw, Briefcase, MapPin, Clock, ExternalLink, Building2, DollarSign, SlidersHorizontal, FileText, ArrowRight, MessageSquare, BotMessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useLocation_ } from '@/lib/LocationContext';
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
  const { city, province, isDetecting: cityLoading } = useLocation_();
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

    try {
      // Fetch 5 batches of 10 jobs each = 50 total
      const batches = await Promise.all([
        base44.integrations.Core.InvokeLLM({
          prompt: `Find 10 real current job listings for "${searchTerm}" in ${searchLoc}, Canada. Sources: LinkedIn, Indeed, Job Bank, ZipRecruiter. Newcomer-friendly roles. Return ONLY: title, company, location (city), job_type (full_time/part_time/contract/remote), experience_level (entry/mid/senior), salary (short or empty), posted (e.g. "2d"), url, source, is_newcomer_friendly (boolean).`,
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
                    url: { type: 'string' },
                    source: { type: 'string' },
                    is_newcomer_friendly: { type: 'boolean' },
                  },
                },
              },
            },
          },
        }),
        base44.integrations.Core.InvokeLLM({
          prompt: `Find 10 more real current job listings for "${searchTerm}" in ${searchLoc}, Canada. Sources: LinkedIn, Indeed, Job Bank, ZipRecruiter. Newcomer-friendly roles. Return ONLY: title, company, location (city), job_type (full_time/part_time/contract/remote), experience_level (entry/mid/senior), salary (short or empty), posted (e.g. "2d"), url, source, is_newcomer_friendly (boolean).`,
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
                    url: { type: 'string' },
                    source: { type: 'string' },
                    is_newcomer_friendly: { type: 'boolean' },
                  },
                },
              },
            },
          },
        }),
        base44.integrations.Core.InvokeLLM({
          prompt: `Find 10 more real current job listings for "${searchTerm}" in ${searchLoc}, Canada. Sources: LinkedIn, Indeed, Job Bank, ZipRecruiter. Newcomer-friendly roles. Return ONLY: title, company, location (city), job_type (full_time/part_time/contract/remote), experience_level (entry/mid/senior), salary (short or empty), posted (e.g. "2d"), url, source, is_newcomer_friendly (boolean).`,
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
                    url: { type: 'string' },
                    source: { type: 'string' },
                    is_newcomer_friendly: { type: 'boolean' },
                  },
                },
              },
            },
          },
        }),
        base44.integrations.Core.InvokeLLM({
          prompt: `Find 10 more real current job listings for "${searchTerm}" in ${searchLoc}, Canada. Sources: LinkedIn, Indeed, Job Bank, ZipRecruiter. Newcomer-friendly roles. Return ONLY: title, company, location (city), job_type (full_time/part_time/contract/remote), experience_level (entry/mid/senior), salary (short or empty), posted (e.g. "2d"), url, source, is_newcomer_friendly (boolean).`,
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
                    url: { type: 'string' },
                    source: { type: 'string' },
                    is_newcomer_friendly: { type: 'boolean' },
                  },
                },
              },
            },
          },
        }),
        base44.integrations.Core.InvokeLLM({
          prompt: `Find 10 more real current job listings for "${searchTerm}" in ${searchLoc}, Canada. Sources: LinkedIn, Indeed, Job Bank, ZipRecruiter. Newcomer-friendly roles. Return ONLY: title, company, location (city), job_type (full_time/part_time/contract/remote), experience_level (entry/mid/senior), salary (short or empty), posted (e.g. "2d"), url, source, is_newcomer_friendly (boolean).`,
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
                    url: { type: 'string' },
                    source: { type: 'string' },
                    is_newcomer_friendly: { type: 'boolean' },
                  },
                },
              },
            },
          },
        }),
      ]);

      const allJobs = batches.flatMap(batch => batch?.jobs || []);
      setJobs(allJobs);
      setLastFetched(new Date());
    } finally {
      setLoading(false);
    }
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

  const [currentPage, setCurrentPage] = useState(1);
  const JOBS_PER_PAGE = 10; // 50 jobs = 5 pages

  const linkedinCount = jobs.filter(j => j.source === 'linkedin').length;
  const indeedCount = jobs.filter(j => j.source === 'indeed').length;

  const totalPages = Math.max(1, Math.ceil(filtered.length / JOBS_PER_PAGE));
  const paginatedJobs = filtered.slice((currentPage - 1) * JOBS_PER_PAGE, currentPage * JOBS_PER_PAGE);

  // Reset to page 1 when filters/search change
  const handleFilterChange = (f) => { setFilters(f); setCurrentPage(1); };
  const handleSourceChange = (s) => { setActiveSource(s); setCurrentPage(1); };

  return (
    <div ref={containerRef} className="max-w-5xl mx-auto px-4 py-6 pb-8 overflow-y-auto" {...touchHandlers}>
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

      {/* Tool Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        <Link to="/resume-builder" className="flex items-center gap-3 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl px-4 py-3 hover:border-primary/40 transition-all group">
          <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground">🍁 Resume Builder</p>
            <p className="text-[10px] text-muted-foreground">AI · Canadian format · ATS</p>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-primary flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
        </Link>
        <Link to="/job-tracker" className="flex items-center gap-3 bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl px-4 py-3 hover:border-blue-500/40 transition-all group">
          <div className="w-8 h-8 rounded-xl bg-blue-500/15 flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground">📋 Job Tracker</p>
            <p className="text-[10px] text-muted-foreground">Track applications · Reminders</p>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
        </Link>
        <Link to="/interview-prep" className="flex items-center gap-3 bg-gradient-to-r from-violet-500/10 to-violet-500/5 border border-violet-500/20 rounded-xl px-4 py-3 hover:border-violet-500/40 transition-all group">
          <div className="w-8 h-8 rounded-xl bg-violet-500/15 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-4 h-4 text-violet-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground">🎤 Interview Prep</p>
            <p className="text-[10px] text-muted-foreground">Mock interviews · AI feedback</p>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-violet-600 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
        </Link>
        <Link to="/job-coach" className="flex items-center gap-3 bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3 hover:border-amber-500/40 transition-all group sm:col-span-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
            <BotMessageSquare className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground">🤖 AI Job Coach</p>
            <p className="text-[10px] text-muted-foreground">Review applications · Personalized advice</p>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

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
        <JobFilters filters={filters} onChange={handleFilterChange} />
      )}

      {/* Source Tabs + Counts */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex gap-1.5 flex-wrap">
          {SOURCE_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleSourceChange(tab.id)}
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

      {/* Platform Links — 10 job sites */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Browse on Job Sites</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {[
            {
              name: 'Job Bank Canada',
              href: `https://www.jobbank.gc.ca/jobsearch/jobsearch?searchstring=${encodeURIComponent(searchQuery || '')}&locationstring=${encodeURIComponent(city || 'Canada')}`,
              logo: 'https://www.jobbank.gc.ca/images/jobbank-logo.svg',
              fallbackLogo: 'https://www.jobbank.gc.ca/favicon.ico',
              bg: 'bg-red-600/10 border-red-600/25 text-red-700',
              badge: '🍁 Official',
            },
            {
              name: 'LinkedIn',
              href: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(searchQuery || 'jobs')}&location=${encodeURIComponent((city || '') + ' Canada')}`,
              logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png',
              bg: 'bg-blue-600/10 border-blue-600/25 text-blue-700',
            },
            {
              name: 'Indeed',
              href: `https://ca.indeed.com/jobs?q=${encodeURIComponent(searchQuery || 'jobs')}&l=${encodeURIComponent((city || '') + ', Canada')}`,
              logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Indeed_logo.svg',
              logoClass: 'w-12 h-3.5 object-contain',
              bg: 'bg-indigo-600/10 border-indigo-600/25 text-indigo-700',
            },
            {
              name: 'Jooble',
              href: `https://jooble.org/jobs-${encodeURIComponent((searchQuery || 'jobs').replace(/ /g, '-'))}/${encodeURIComponent(city || 'canada')}`,
              logo: 'https://jooble.org/favicon.ico',
              bg: 'bg-orange-500/10 border-orange-500/25 text-orange-700',
            },
            {
              name: 'ZipRecruiter',
              href: `https://www.ziprecruiter.com/jobs-search?search=${encodeURIComponent(searchQuery || 'jobs')}&location=${encodeURIComponent((city || '') + ', Canada')}`,
              logo: 'https://www.ziprecruiter.com/favicon.ico',
              bg: 'bg-green-600/10 border-green-600/25 text-green-700',
            },
            {
              name: 'Glassdoor',
              href: `https://www.glassdoor.ca/Job/canada-${encodeURIComponent(searchQuery || 'jobs')}-jobs-SRCH_IL.0,6_IN3_KO7,${7 + (searchQuery || 'jobs').length}.htm`,
              logo: 'https://www.glassdoor.ca/favicon.ico',
              bg: 'bg-emerald-600/10 border-emerald-600/25 text-emerald-700',
            },
            {
              name: 'Monster',
              href: `https://www.monster.ca/jobs/search?q=${encodeURIComponent(searchQuery || 'jobs')}&where=${encodeURIComponent(city || 'Canada')}`,
              logo: 'https://www.monster.ca/favicon.ico',
              bg: 'bg-violet-600/10 border-violet-600/25 text-violet-700',
            },
            {
              name: 'Workopolis',
              href: `https://www.workopolis.com/jobsearch/find-jobs?ak=${encodeURIComponent(searchQuery || 'jobs')}&l=${encodeURIComponent(city || 'Canada')}`,
              logo: 'https://www.workopolis.com/favicon.ico',
              bg: 'bg-sky-600/10 border-sky-600/25 text-sky-700',
            },
            {
              name: 'SimplyHired',
              href: `https://www.simplyhired.ca/search?q=${encodeURIComponent(searchQuery || 'jobs')}&l=${encodeURIComponent(city || 'Canada')}`,
              logo: 'https://www.simplyhired.ca/favicon.ico',
              bg: 'bg-teal-600/10 border-teal-600/25 text-teal-700',
            },
            {
              name: 'Eluta',
              href: `https://www.eluta.ca/search?q=${encodeURIComponent(searchQuery || 'jobs')}&l=${encodeURIComponent(city || 'Canada')}`,
              logo: 'https://www.eluta.ca/favicon.ico',
              bg: 'bg-amber-600/10 border-amber-600/25 text-amber-700',
              badge: '🍁 Canada',
            },
          ].map((platform) => (
            <a
              key={platform.name}
              href={platform.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`relative flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold hover:opacity-80 transition-all ${platform.bg}`}
            >
              {platform.badge && (
                <span className="absolute -top-2 left-2 text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded-full font-bold leading-none">
                  {platform.badge}
                </span>
              )}
              <img
                src={platform.logo}
                alt={platform.name}
                className={platform.logoClass || 'w-4 h-4 rounded flex-shrink-0'}
                onError={e => { if (platform.fallbackLogo) { e.target.src = platform.fallbackLogo; } else { e.target.style.display = 'none'; } }}
              />
              <span className="truncate">{platform.name}</span>
              <ExternalLink className="w-3 h-3 opacity-50 flex-shrink-0 ml-auto" />
            </a>
          ))}
        </div>
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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {paginatedJobs.map((job, i) => (
              <JobCard key={i} job={job} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-border/50 bg-card text-muted-foreground hover:border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                ← Prev
              </button>
              {(() => {
                const pages = [];
                const delta = 2;
                const rangeStart = Math.max(2, currentPage - delta);
                const rangeEnd = Math.min(totalPages - 1, currentPage + delta);
                pages.push(1);
                if (rangeStart > 2) pages.push('...');
                for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
                if (rangeEnd < totalPages - 1) pages.push('...');
                if (totalPages > 1) pages.push(totalPages);
                return pages.map((page, i) => page === '...' ? (
                  <span key={`ellipsis-${i}`} className="text-xs text-muted-foreground px-1">…</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "w-8 h-8 rounded-xl text-xs font-semibold border transition-all",
                      currentPage === page
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border/50 bg-card text-muted-foreground hover:border-primary/30"
                    )}
                  >
                    {page}
                  </button>
                ));
              })()}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-border/50 bg-card text-muted-foreground hover:border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next →
              </button>
            </div>
          )}
          <p className="text-center text-xs text-muted-foreground mt-2">
            Showing {(currentPage - 1) * JOBS_PER_PAGE + 1}–{Math.min(currentPage * JOBS_PER_PAGE, filtered.length)} of {filtered.length} jobs
          </p>
        </>
      )}
    </div>
  );
}