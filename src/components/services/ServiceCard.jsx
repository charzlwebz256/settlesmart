import { MapPin, Phone, Globe, ExternalLink, Bookmark } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const categoryIcons = {
  education: '🎓', language: '💬', housing: '🏠', employment: '💼',
  legal: '⚖️', health: '🧠', transportation: '🚌', volunteering: '🤝',
  settlement: '🧭', family_support: '👨‍👩‍👧‍👦', financial: '💰',
};

export default function ServiceCard({ service, onSave, saved }) {
  return (
    <div className="group bg-card rounded-2xl border border-border/50 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{categoryIcons[service.category] || '📋'}</span>
          <div>
            <h3 className="font-heading font-bold text-sm leading-tight">{service.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{service.organization}</p>
          </div>
        </div>
        {onSave && (
          <button
            onClick={() => onSave(service)}
            className={cn(
              "p-2 rounded-lg transition-all",
              saved ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
            )}
          >
            <Bookmark className={cn("w-4 h-4", saved && "fill-current")} />
          </button>
        )}
      </div>

      <p className="text-muted-foreground text-xs leading-relaxed mb-4 line-clamp-2">
        {service.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {service.is_free && (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-0 text-[10px] font-semibold">FREE</Badge>
        )}
        {service.eligibility?.slice(0, 2).map(e => (
          <Badge key={e} variant="secondary" className="text-[10px] capitalize">
            {e.replace(/_/g, ' ')}
          </Badge>
        ))}
        {service.languages_offered?.length > 0 && (
          <Badge variant="outline" className="text-[10px]">
            {service.languages_offered.length} languages
          </Badge>
        )}
      </div>

      <div className="space-y-1.5 text-xs text-muted-foreground">
        {service.city && (
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{service.city}, {service.province}</span>
          </div>
        )}
        {service.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 flex-shrink-0" />
            <a href={`tel:${service.phone}`} className="hover:text-primary transition-colors">{service.phone}</a>
          </div>
        )}
      </div>

      {service.website && (
        <a
          href={service.website}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary/5 text-primary text-xs font-semibold hover:bg-primary/10 transition-all"
        >
          <Globe className="w-3.5 h-3.5" />
          Visit Website
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
}