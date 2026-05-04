import { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, RefreshCw, Briefcase, MapPin, Clock, ExternalLink, Building2, DollarSign, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCityDetection } from '@/hooks/useCityDetection';
import JobCard from '@/components/jobs/JobCard';
import JobFilters from '@/components/jobs/JobFilters';

const SOURCE_TABS = [
  { id: 'all', label: 'All Jobs' },
  { id: 'linkedin', label: 'LinkedIn', color: 'text-blue-600' },
  { id: 'indeed', label: 'Indeed', color: 'text-indigo-600' },
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
    if (!location && !query) return;
    setLoading(true);

    const searchLoc = location || 'Canada';
    const searchTerm = query || 'newcomer immigrant jobs';

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Search LinkedIn Jobs (https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(searchTerm)}&location=${encodeURIComponent(searchLoc + ', Canada')}) and Indeed Canada (https://ca.indeed.com/jobs?q=${encodeURIComponent(searchTerm)}&l=${encodeURIComponent(searchLoc + ', Canada')}) for current job postings.

Find 16 real, current job listings (8 from LinkedIn, 8 from Indeed) for: "${searchTerm}" in ${searchLoc}, Canada.

Focus on jobs accessible to newcomers and immigrants. Include entry-level, skilled trades, healthcare, IT, customer service, and warehouse roles.

For each job return:
- title: job title
- company: company name
- location: city and province
- job_type: "full_time", "part_time", "contract", or "remote"
- experience_level: "entry", "mid", "senior", or "any"
- salary: salary range if visible, else empty string
- posted: how long ago posted e.g. "2 days ago", "1 week ago"
- description: 1-2 sentence summary
- url: direct job URL on LinkedIn or Indeed
- source: "linkedin" or "indeed"
- is_newcomer_friendly: true if the job mentions no Canadian experience required, multilingual, or newcomer-friendly`,
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

  // Auto-load when city is detected
  useEffect(() => {
    if (!cityLoading && city && jobs.length === 0) {
      fetchJobs('', city);
    }
  }, [city, cityLoading]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const timer = setInterval(() => {
      if (!loading) fetchJobs();
    }, 5 * 60 * 1000);
    setAutoRefreshTimer(timer);
    return () => clearInterval(timer);
  }, [fetchJobs, loading]);

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
    <div className="max-w-5xl mx-auto px-4 py-6 pb-24 md:pb-8">
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
          title="Refresh jobs"
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
      <div className="flex gap-3 mb-5">
        <a
          href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(searchQuery || 'jobs')}&location=${encodeURIComponent((city || '') + ' Canada')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 text-xs font-semibold hover:bg-blue-500/15 transition-colors"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" className="w-4 h-4 rounded" alt="LinkedIn" />
          Search on LinkedIn
          <ExternalLink className="w-3 h-3 opacity-60" />
        </a>
        <a
          href={`https://ca.indeed.com/jobs?q=${encodeURIComponent(searchQuery || 'jobs')}&l=${encodeURIComponent((city || '') + ', Canada')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 text-xs font-semibold hover:bg-indigo-500/15 transition-colors"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fc/Indeed_logo.svg" className="w-10 h-4 object-contain" alt="Indeed" />
          Search on Indeed
          <ExternalLink className="w-3 h-3 opacity-60" />
        </a>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm font-medium">Fetching live jobs from LinkedIn & Indeed...</p>
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