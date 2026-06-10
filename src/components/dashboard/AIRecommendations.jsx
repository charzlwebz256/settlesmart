import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, ExternalLink, RefreshCw, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const categoryColors = {
  settlement: 'bg-teal-500/10 text-teal-700 dark:text-teal-400',
  education: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  language: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400',
  employment: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  housing: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  legal: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  health: 'bg-rose-500/10 text-rose-700 dark:text-rose-400',
  financial: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
};

export default function AIRecommendations({ profile }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: recommendations, isLoading, isFetching } = useQuery({
    queryKey: ['ai-recommendations', profile?.id, refreshKey],
    queryFn: async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a Canadian newcomer settlement advisor. Based on this user's profile, recommend 4 specific services or actions they should take NOW.

User Profile:
- Immigration Status: ${profile.immigration_status?.replace(/_/g, ' ')}
- Province: ${profile.province}
- City: ${profile.city}
- Interests: ${(profile.interests || []).join(', ') || 'not specified'}
- English Level: ${profile.english_level || 'not specified'}
- French Level: ${profile.french_level || 'not specified'}
- Education: ${profile.education_level || 'not specified'}
- Family Size: ${profile.family_size || 1}
- Arrival Date: ${profile.arrival_date || 'recent'}

Return EXACTLY 4 targeted recommendations. Each must be specific and actionable for their status and location.`,
        response_json_schema: {
          type: 'object',
          properties: {
            recommendations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  category: { type: 'string' },
                  urgency: { type: 'string', enum: ['high', 'medium', 'low'] },
                  action_label: { type: 'string' },
                  action_path: { type: 'string' },
                },
              },
            },
          },
        },
      });
      return result.recommendations || [];
    },
    enabled: !!profile,
    staleTime: 1000 * 60 * 10, // 10 min cache
  });

  const urgencyStyle = {
    high: 'border-l-4 border-rose-400',
    medium: 'border-l-4 border-amber-400',
    low: 'border-l-4 border-primary/40',
  };

  const urgencyBadge = {
    high: 'bg-rose-500/10 text-rose-600',
    medium: 'bg-amber-500/10 text-amber-600',
    low: 'bg-primary/10 text-primary',
  };

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-base leading-tight">AI Recommendations</h2>
            <p className="text-[10px] text-muted-foreground">Personalized for your profile</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg"
          onClick={() => setRefreshKey(k => k + 1)}
          disabled={isLoading || isFetching}
        >
          <RefreshCw className={`w-3.5 h-3.5 text-muted-foreground ${isFetching ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {isLoading || isFetching ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">Generating personalized recommendations…</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={refreshKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {(recommendations || []).map((rec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`p-4 rounded-xl bg-muted/40 ${urgencyStyle[rec.urgency] || ''}`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <p className="font-semibold text-sm leading-snug">{rec.title}</p>
                  <div className="flex gap-1 flex-shrink-0">
                    {rec.urgency && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${urgencyBadge[rec.urgency]}`}>
                        {rec.urgency}
                      </span>
                    )}
                    {rec.category && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${categoryColors[rec.category] || 'bg-muted text-muted-foreground'}`}>
                        {rec.category}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">{rec.description}</p>
                {rec.action_path && (
                  <Link to={rec.action_path}>
                    <button className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                      {rec.action_label || 'View'} <ChevronRight className="w-3 h-3" />
                    </button>
                  </Link>
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      <p className="text-[10px] text-muted-foreground mt-4 text-center">
        AI-generated · Based on your profile · <Link to="/profile" className="underline hover:text-primary">Update profile</Link> to improve results
      </p>
    </div>
  );
}