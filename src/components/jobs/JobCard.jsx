import { Badge } from '@/components/ui/badge';
import { ExternalLink, MapPin, Clock, Building2, DollarSign, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const typeLabels = {
  full_time: { label: 'Full-time', color: 'bg-green-500/10 text-green-700' },
  part_time: { label: 'Part-time', color: 'bg-yellow-500/10 text-yellow-700' },
  contract: { label: 'Contract', color: 'bg-orange-500/10 text-orange-700' },
  remote: { label: 'Remote', color: 'bg-sky-500/10 text-sky-700' },
};

const expLabels = {
  entry: { label: 'Entry Level', color: 'bg-emerald-500/10 text-emerald-700' },
  mid: { label: 'Mid Level', color: 'bg-blue-500/10 text-blue-700' },
  senior: { label: 'Senior', color: 'bg-purple-500/10 text-purple-700' },
  any: { label: 'Any Level', color: 'bg-muted text-muted-foreground' },
};

const sourceConfig = {
  linkedin: {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png',
    label: 'LinkedIn',
    badge: 'bg-blue-500/10 text-blue-700 border-blue-200',
  },
  indeed: {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Indeed_logo.svg',
    label: 'Indeed',
    badge: 'bg-indigo-500/10 text-indigo-700 border-indigo-200',
  },
};

function buildJobUrl(job) {
  // Prefer the direct posting URL returned by the job platform (live feed)
  if (job.url && /^https?:\/\//i.test(job.url)) return job.url;
  // Fallback to a search on the relevant platform
  const q = encodeURIComponent(`${job.title} ${job.company}`.trim());
  const loc = encodeURIComponent(job.location || 'Canada');
  const src = (job.source || '').toLowerCase();
  if (src === 'linkedin') return `https://www.linkedin.com/jobs/search/?keywords=${q}&location=${loc}`;
  if (src === 'jobbank') return `https://www.jobbank.gc.ca/jobsearch/jobsearch?searchstring=${q}&locationstring=${loc}`;
  if (src === 'ziprecruiter') return `https://www.ziprecruiter.com/jobs-search?search=${q}&location=${loc}`;
  if (src === 'jooble') return `https://jooble.org/jobs/${q}/${loc}`;
  if (src === 'glassdoor') return `https://www.glassdoor.ca/Job/jobs.htm?sc.keyword=${q}`;
  return `https://ca.indeed.com/jobs?q=${q}&l=${loc}`;
}

export default function JobCard({ job, onAddToTracker }) {
  const src = sourceConfig[job.source] || sourceConfig.indeed;
  const typeStyle = typeLabels[job.job_type] || { label: job.job_type, color: 'bg-muted text-muted-foreground' };
  const expStyle = expLabels[job.experience_level] || expLabels.any;
  const jobUrl = buildJobUrl(job);

  const openJob = () => window.open(jobUrl, '_blank', 'noopener,noreferrer');

  return (
    <div
      onClick={openJob}
      className="flex flex-col gap-3 p-4 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1.5 mb-1.5">
            <Badge className={cn("text-[10px] border px-2 py-0 font-semibold", src.badge)}>
              <img src={src.logo} alt={src.label} className="w-3 h-3 mr-1 inline object-contain" />
              {src.label}
            </Badge>
            <Badge className={cn("text-[10px] border-0 px-2 py-0", typeStyle.color)}>{typeStyle.label}</Badge>
            <Badge className={cn("text-[10px] border-0 px-2 py-0", expStyle.color)}>{expStyle.label}</Badge>
            {job.is_newcomer_friendly && (
              <Badge className="text-[10px] border-0 px-2 py-0 bg-primary/10 text-primary">🍁 Newcomer Friendly</Badge>
            )}
          </div>
          <h3 className="font-heading font-bold text-sm leading-snug group-hover:text-primary transition-colors">{job.title}</h3>
        </div>
        <ExternalLink className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
      </div>

      {/* Company & Meta */}
      <div className="space-y-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 flex-shrink-0 text-primary/50" />
          <span className="font-medium text-foreground">{job.company}</span>
        </div>
        {job.location && (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-primary/50" />
            <span>{job.location}</span>
          </div>
        )}
        {job.salary && (
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 flex-shrink-0 text-green-600/70" />
            <span className="text-green-700 font-medium">{job.salary}</span>
          </div>
        )}
        {job.posted && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{job.posted}</span>
          </div>
        )}
      </div>

      {/* Description */}
      {job.description && (
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{job.description}</p>
      )}

      {/* Actions */}
      <div className="mt-auto flex items-center gap-2">
        <button
          onClick={e => { e.stopPropagation(); openJob(); }}
          className="flex items-center gap-1.5 text-xs font-semibold text-primary-foreground bg-primary px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Apply Now
        </button>
        {onAddToTracker && (
          <button
            onClick={e => { e.stopPropagation(); onAddToTracker(job); }}
            className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Add to Tracker
          </button>
        )}
      </div>
    </div>
  );
}