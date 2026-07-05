import { MapPin, Phone, Globe, ExternalLink, Bookmark, Users, CheckCircle2, Navigation } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getOrgLogo } from '@/lib/orgLogos';

const CATEGORY_META = {
  education:        { icon: '🎓', label: 'Education',      bar: 'from-blue-500 to-blue-400',        chip: 'bg-blue-500/10 text-blue-700 dark:text-blue-300' },
  language:         { icon: '💬', label: 'Language',       bar: 'from-indigo-500 to-indigo-400',     chip: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300' },
  housing:          { icon: '🏠', label: 'Housing',        bar: 'from-emerald-500 to-emerald-400',   chip: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' },
  employment:       { icon: '💼', label: 'Employment',     bar: 'from-amber-500 to-amber-400',      chip: 'bg-amber-500/10 text-amber-700 dark:text-amber-300' },
  legal:            { icon: '⚖️', label: 'Legal',          bar: 'from-purple-500 to-purple-400',    chip: 'bg-purple-500/10 text-purple-700 dark:text-purple-300' },
  health:           { icon: '🧠', label: 'Health',         bar: 'from-rose-500 to-rose-400',        chip: 'bg-rose-500/10 text-rose-700 dark:text-rose-300' },
  transportation:   { icon: '🚌', label: 'Transportation', bar: 'from-cyan-500 to-cyan-400',        chip: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300' },
  volunteering:     { icon: '🤝', label: 'Volunteering',   bar: 'from-pink-500 to-pink-400',        chip: 'bg-pink-500/10 text-pink-700 dark:text-pink-300' },
  settlement:       { icon: '🧭', label: 'Settlement',     bar: 'from-teal-500 to-teal-400',        chip: 'bg-teal-500/10 text-teal-700 dark:text-teal-300' },
  family_support:   { icon: '👨‍👩‍👧‍👦', label: 'Family Support', bar: 'from-fuchsia-500 to-fuchsia-400', chip: 'bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300' },
  financial:        { icon: '💰', label: 'Financial',      bar: 'from-orange-500 to-orange-400',   chip: 'bg-orange-500/10 text-orange-700 dark:text-orange-300' },
};

const ELIGIBILITY_LABELS = {
  permanent_resident: 'Permanent Resident',
  refugee: 'Refugee',
  international_student: 'Int. Student',
  temporary_worker: 'Temp. Worker',
  asylum_seeker: 'Asylum Seeker',
  citizen: 'Citizen',
};

export default function ServiceCard({ service, onSave, saved }) {
  const meta = CATEGORY_META[service.category] || { icon: '📋', label: service.category || 'Service', bar: 'from-slate-400 to-slate-300', chip: 'bg-muted text-muted-foreground' };
  const logo = getOrgLogo(service.organization) || getOrgLogo(service.name);
  const eligibility = service.eligibility || [];
  const hasLocation = service.city || service.province || service.address;
  const mapQuery = service.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${service.address}, ${service.city || ''} ${service.province || ''}`)}`
    : (service.city ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${service.name}, ${service.city}, ${service.province || ''}`)}` : null);

  return (
    <div className="group bg-card rounded-2xl border border-border/60 overflow-hidden hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
      {/* Category accent bar */}
      <div className={cn("h-1.5 w-full bg-gradient-to-r", meta.bar)} />

      <div className="p-5 flex flex-col gap-3.5 flex-1">
        {/* Header: category chip + bookmark */}
        <div className="flex items-start justify-between gap-2">
          <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide", meta.chip)}>
            <span>{meta.icon}</span>
            {meta.label}
          </span>
          {onSave && (
            <button
              onClick={() => onSave(service)}
              aria-label={saved ? 'Remove from saved' : 'Save resource'}
              className={cn(
                "p-2 rounded-lg transition-all flex-shrink-0",
                saved ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              )}
            >
              <Bookmark className={cn("w-4 h-4", saved && "fill-current")} />
            </button>
          )}
        </div>

        {/* Name + organization */}
        <div className="flex items-start gap-3">
          {logo ? (
            <img src={logo} alt={service.organization || service.name} className="w-10 h-10 rounded-lg object-contain flex-shrink-0 border border-border/40 bg-white p-1" onError={e => { e.target.style.display='none'; }} />
          ) : (
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-lg", meta.chip)}>
              {meta.icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-bold text-sm leading-snug">{service.name}</h3>
            {service.organization && service.organization !== service.name && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{service.organization}</p>
            )}
          </div>
        </div>

        {/* Description */}
        {service.description && (
          <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
            {service.description}
          </p>
        )}

        {/* Eligibility — highlighted */}
        {eligibility.length > 0 && (
          <div className="rounded-xl bg-muted/40 border border-border/40 p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Eligibility</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {eligibility.map(e => (
                <span key={e} className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-card border border-border/60 text-foreground">
                  <CheckCircle2 className="w-2.5 h-2.5 text-primary" />
                  {ELIGIBILITY_LABELS[e] || e.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Location — highlighted */}
        {hasLocation && (
          <div className="rounded-xl bg-primary/5 border border-primary/15 p-3 flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wide text-primary/80">Location</p>
              {service.city && service.province && (
                <p className="text-xs font-semibold text-foreground leading-snug">{service.city}, {service.province}</p>
              )}
              {service.address && (
                <p className="text-[11px] text-muted-foreground leading-snug mt-0.5 line-clamp-2">{service.address}</p>
              )}
            </div>
          </div>
        )}

        {/* Quick badges: free + languages */}
        <div className="flex flex-wrap gap-1.5">
          {service.is_free && (
            <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-0 text-[10px] font-bold">FREE</Badge>
          )}
          {service.languages_offered?.length > 0 && (
            <Badge variant="outline" className="text-[10px] font-medium">
              🌐 {service.languages_offered.length} language{service.languages_offered.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {/* Contact */}
        {(service.phone || service.email) && (
          <div className="space-y-1 text-xs text-muted-foreground">
            {service.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 flex-shrink-0 text-primary/60" />
                <a href={`tel:${service.phone}`} className="hover:text-primary font-medium transition-colors">{service.phone}</a>
              </div>
            )}
            {service.email && (
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 flex-shrink-0 text-primary/60" />
                <a href={`mailto:${service.email}`} className="hover:text-primary transition-colors truncate">{service.email}</a>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-1">
          {service.website && (
            <a
              href={service.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              Visit Website
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          )}
          {mapQuery && (
            <a
              href={mapQuery}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-muted text-muted-foreground text-xs font-semibold hover:bg-muted/70 hover:text-foreground transition-colors"
              aria-label="Open in Maps"
            >
              <Navigation className="w-3.5 h-3.5" />
              Map
            </a>
          )}
        </div>
      </div>
    </div>
  );
}