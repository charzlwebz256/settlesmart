import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Loader2, BookOpen, Briefcase, Home, Scale, Heart, DollarSign, Bus, Users, Building2, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

// Immigration status → most relevant service categories
const STATUS_CATEGORY_WEIGHTS = {
  refugee:            ['legal', 'housing', 'health', 'settlement', 'language'],
  asylum_seeker:      ['legal', 'health', 'housing', 'settlement', 'language'],
  permanent_resident: ['employment', 'education', 'language', 'financial', 'housing'],
  temporary_worker:   ['employment', 'legal', 'housing', 'language', 'health'],
  international_student: ['education', 'language', 'housing', 'employment', 'health'],
  citizen:            ['volunteering', 'education', 'employment', 'family_support', 'financial'],
  other:              ['settlement', 'language', 'housing', 'legal', 'health'],
};

const CATEGORY_META = {
  education:      { icon: GraduationCap, color: 'text-blue-600 bg-blue-500/10', label: 'Education' },
  language:       { icon: BookOpen,      color: 'text-indigo-600 bg-indigo-500/10', label: 'Language' },
  housing:        { icon: Home,          color: 'text-emerald-600 bg-emerald-500/10', label: 'Housing' },
  employment:     { icon: Briefcase,     color: 'text-amber-600 bg-amber-500/10', label: 'Employment' },
  legal:          { icon: Scale,         color: 'text-purple-600 bg-purple-500/10', label: 'Legal' },
  health:         { icon: Heart,         color: 'text-rose-600 bg-rose-500/10', label: 'Health' },
  financial:      { icon: DollarSign,    color: 'text-orange-600 bg-orange-500/10', label: 'Financial' },
  transportation: { icon: Bus,           color: 'text-cyan-600 bg-cyan-500/10', label: 'Transit' },
  volunteering:   { icon: Users,         color: 'text-pink-600 bg-pink-500/10', label: 'Volunteer' },
  settlement:     { icon: Building2,     color: 'text-teal-600 bg-teal-500/10', label: 'Settlement' },
  family_support: { icon: Users,         color: 'text-fuchsia-600 bg-fuchsia-500/10', label: 'Family' },
};

export default function ServiceRecommendations({ profile }) {
  const { data: services, isLoading } = useQuery({
    queryKey: ['services-for-recommendations', profile?.province],
    queryFn: () => base44.entities.Service.filter({ province: profile.province }, 'name', 50),
    enabled: !!profile?.province,
    staleTime: 1000 * 60 * 15,
  });

  const recommended = useMemo(() => {
    if (!services || !profile) return [];

    const priorityCategories = STATUS_CATEGORY_WEIGHTS[profile.immigration_status] ||
                               STATUS_CATEGORY_WEIGHTS.other;

    // Score each service
    const scored = services.map(svc => {
      let score = 0;
      const catIdx = priorityCategories.indexOf(svc.category);
      if (catIdx !== -1) score += (priorityCategories.length - catIdx) * 10;

      // Bonus: city match
      if (profile.city && svc.city?.toLowerCase() === profile.city.toLowerCase()) score += 8;

      // Bonus: eligibility match
      if (svc.eligibility?.includes(profile.immigration_status)) score += 5;

      // Bonus: free services rank higher
      if (svc.is_free) score += 2;

      return { ...svc, score };
    });

    // Sort by score desc, dedupe by category (show variety), take top 4
    scored.sort((a, b) => b.score - a.score);
    const seen = new Set();
    const result = [];
    for (const svc of scored) {
      if (result.length >= 4) break;
      if (!seen.has(svc.category)) {
        seen.add(svc.category);
        result.push(svc);
      }
    }
    // If fewer than 4 after dedup, fill with next best
    if (result.length < 4) {
      for (const svc of scored) {
        if (result.length >= 4) break;
        if (!result.find(r => r.id === svc.id)) result.push(svc);
      }
    }
    return result;
  }, [services, profile]);

  if (!profile) return null;

  const statusLabel = profile.immigration_status?.replace(/_/g, ' ');

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-base leading-tight">Recommended Services</h2>
            <p className="text-xs text-muted-foreground capitalize">
              For {statusLabel} · {profile.city}, {profile.province}
            </p>
          </div>
        </div>
        <Link to="/services" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      ) : recommended.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          <p>No services found for your province yet.</p>
          <Link to="/services" className="text-primary text-xs underline mt-1 inline-block">Browse all services</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {recommended.map((svc, i) => {
            const meta = CATEGORY_META[svc.category] || CATEGORY_META.settlement;
            const Icon = meta.icon;
            return (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link to={`/services?province=${encodeURIComponent(profile.province)}&category=${svc.category}`}>
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors group">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-semibold text-sm leading-snug truncate">{svc.name}</p>
                        {svc.is_free && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-green-500/10 text-green-700 dark:text-green-400 border-0">
                            Free
                          </Badge>
                        )}
                      </div>
                      {svc.organization && (
                        <p className="text-xs text-muted-foreground truncate">{svc.organization}</p>
                      )}
                      {svc.city && (
                        <p className="text-xs text-muted-foreground/70 flex items-center gap-0.5 mt-0.5">
                          <MapPin className="w-2.5 h-2.5" />{svc.city}
                        </p>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}