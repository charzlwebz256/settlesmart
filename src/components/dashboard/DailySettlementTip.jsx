import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, Lightbulb, RefreshCw, Calendar, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { differenceInDays, differenceInMonths, parseISO } from 'date-fns';

const CACHE_KEY = 'settlement_tip_cache';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function getArrivalContext(arrival_date) {
  if (!arrival_date) return { label: 'recently arrived', days: null };
  const days = differenceInDays(new Date(), parseISO(arrival_date));
  const months = differenceInMonths(new Date(), parseISO(arrival_date));
  if (days <= 7) return { label: `${days} day${days !== 1 ? 's' : ''} in Canada`, days };
  if (days <= 30) return { label: `${days} days in Canada`, days };
  if (months < 12) return { label: `${months} month${months !== 1 ? 's' : ''} in Canada`, days };
  const years = Math.floor(months / 12);
  return { label: `${years} year${years !== 1 ? 's' : ''} in Canada`, days };
}

function getTipPhase(days) {
  if (days === null) return 'early';
  if (days <= 7) return 'first_week';
  if (days <= 30) return 'first_month';
  if (days <= 90) return 'first_3_months';
  if (days <= 365) return 'first_year';
  return 'established';
}

const PHASE_COLORS = {
  first_week: 'from-red-500/10 to-orange-500/10 border-red-200/50',
  first_month: 'from-orange-500/10 to-amber-500/10 border-amber-200/50',
  first_3_months: 'from-amber-500/10 to-yellow-500/10 border-yellow-200/50',
  first_year: 'from-primary/10 to-teal-500/10 border-primary/20',
  established: 'from-emerald-500/10 to-teal-500/10 border-emerald-200/50',
  early: 'from-primary/10 to-teal-500/10 border-primary/20',
};

export default function DailySettlementTip({ profile }) {
  const [tip, setTip] = useState(null);
  const [loading, setLoading] = useState(false);

  const arrivalCtx = getArrivalContext(profile?.arrival_date);
  const phase = getTipPhase(arrivalCtx.days);

  const fetchTip = async (force = false) => {
    // Check 24h cache unless forced
    if (!force) {
      try {
        const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
        if (cached && Date.now() - cached.ts < CACHE_TTL_MS && cached.status === profile?.immigration_status) {
          setTip(cached.tip);
          return;
        }
      } catch (_) {}
    }

    setLoading(true);
    const status = profile?.immigration_status?.replace(/_/g, ' ') || 'newcomer';
    const city = profile?.city || 'Canada';
    const province = profile?.province || 'Canada';

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a friendly Canadian settlement advisor. Generate ONE practical, actionable daily tip for a ${status} who has been in Canada for ${arrivalCtx.label}, living in ${city}, ${province}.

Settlement phase: ${phase.replace(/_/g, ' ')}
English level: ${profile?.english_level || 'unknown'}
Interests: ${(profile?.interests || []).join(', ') || 'general settlement'}

The tip must be:
- Specific to their immigration status (${status}) and how long they've been here (${arrivalCtx.label})
- Immediately actionable today or this week
- Concise and warm in tone
- Reference real Canadian programs, services, or resources when relevant
- Include a specific next step they can take

Return JSON with:
- tip_title: short punchy title (max 8 words)
- tip_body: 2-3 sentence practical advice
- action_label: short call-to-action button text (e.g. "Find a settlement office", "Apply on IRCC.ca")
- action_path: internal app path if relevant ("/services", "/checklist", "/jobs", "/legal", "/resources") or null
- category: one of: documents, housing, banking, health, employment, language, social, legal
- emoji: one relevant emoji`,
      response_json_schema: {
        type: 'object',
        properties: {
          tip_title: { type: 'string' },
          tip_body: { type: 'string' },
          action_label: { type: 'string' },
          action_path: { type: 'string' },
          category: { type: 'string' },
          emoji: { type: 'string' },
        },
      },
    });

    setTip(result);
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ tip: result, ts: Date.now(), status: profile?.immigration_status }));
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => {
    if (profile) fetchTip();
  }, [profile?.immigration_status, profile?.arrival_date]); // eslint-disable-line

  const colorClass = PHASE_COLORS[phase] || PHASE_COLORS.early;

  return (
    <div className={`bg-gradient-to-br ${colorClass} rounded-2xl border p-5`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-wide">Daily Tip</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {arrivalCtx.label}
            </p>
          </div>
        </div>
        <button
          onClick={() => fetchTip(true)}
          disabled={loading}
          className="text-muted-foreground hover:text-primary transition-colors"
          title="Get a new tip"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 py-4">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Personalizing your tip...</span>
        </div>
      )}

      {!loading && tip && (
        <>
          <div className="flex items-start gap-2 mb-2">
            <span className="text-xl flex-shrink-0">{tip.emoji || '💡'}</span>
            <h4 className="font-heading font-bold text-sm leading-snug">{tip.tip_title}</h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">{tip.tip_body}</p>

          {tip.action_label && (
            tip.action_path ? (
              <Link to={tip.action_path}>
                <Button size="sm" className="w-full rounded-xl gap-1 bg-primary hover:bg-primary/90 text-xs h-8">
                  {tip.action_label} <ChevronRight className="w-3 h-3" />
                </Button>
              </Link>
            ) : (
              <Button size="sm" variant="outline" className="w-full rounded-xl gap-1 text-xs h-8" disabled>
                {tip.action_label}
              </Button>
            )
          )}
        </>
      )}

      {!loading && !tip && (
        <div className="text-center py-2">
          <Button size="sm" onClick={() => fetchTip(true)} className="rounded-xl text-xs bg-primary">
            Get My Tip
          </Button>
        </div>
      )}
    </div>
  );
}