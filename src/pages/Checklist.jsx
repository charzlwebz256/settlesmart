import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import PullToRefreshIndicator from '@/components/ui/PullToRefreshIndicator';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Sparkles, Loader2, ChevronDown, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import ExportRoadmapPDF from '@/components/checklist/ExportRoadmapPDF';

const dayRangeLabels = {
  week1: 'Week 1 — First Steps',
  week2: 'Week 2 — Getting Settled',
  week3: 'Week 3 — Building Connections',
  week4: 'Week 4 — Moving Forward',
  month2: 'Month 2 — Deepening Roots',
  month3: 'Month 3 — Growing Independence',
};

const categoryColors = {
  documents: 'bg-blue-500/10 text-blue-600',
  housing: 'bg-emerald-500/10 text-emerald-600',
  banking: 'bg-amber-500/10 text-amber-600',
  health: 'bg-rose-500/10 text-rose-600',
  education: 'bg-purple-500/10 text-purple-600',
  employment: 'bg-orange-500/10 text-orange-600',
  transportation: 'bg-cyan-500/10 text-cyan-600',
  social: 'bg-pink-500/10 text-pink-600',
  legal: 'bg-violet-500/10 text-violet-600',
};

export default function Checklist() {
  const queryClient = useQueryClient();
  const [generating, setGenerating] = useState(false);
  const [expandedPeriod, setExpandedPeriod] = useState('week1');

  const handleRefresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['myChecklist'] });
  }, [queryClient]);

  const { containerRef, pullDistance, isRefreshing, touchHandlers } = usePullToRefresh({ onRefresh: handleRefresh });

  const { data: profile } = useQuery({
    queryKey: ['myProfile'],
    queryFn: async () => {
      const user = await base44.auth.me();
      const results = await base44.entities.UserProfile.filter({ created_by: user.email });
      return results[0] || null;
    },
  });

  const { data: checklist, isLoading } = useQuery({
    queryKey: ['myChecklist'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.ChecklistItem.filter({ created_by: user.email }, 'order');
    },
    initialData: [],
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_completed }) => base44.entities.ChecklistItem.update(id, { is_completed }),
    onMutate: async ({ id, is_completed }) => {
      await queryClient.cancelQueries({ queryKey: ['myChecklist'] });
      const previous = queryClient.getQueryData(['myChecklist']);
      queryClient.setQueryData(['myChecklist'], old =>
        (old || []).map(item => item.id === id ? { ...item, is_completed } : item)
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(['myChecklist'], ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['myChecklist'] }),
  });

  const generateChecklist = async () => {
    setGenerating(true);
    const context = profile
      ? `for a ${profile.immigration_status?.replace(/_/g, ' ')} settling in ${profile.city}, ${profile.province}. English level: ${profile.english_level}. Interests: ${profile.interests?.join(', ')}.`
      : 'for a newcomer settling in Canada.';

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate a "First 90 Days in Canada" settlement checklist ${context}

Create exactly 18 actionable checklist items organized by time period. Each item should be specific and practical.

Return JSON with an "items" array. Each item must have these exact fields:
- title: short actionable string
- description: 1 sentence string
- category: one of exactly: documents, housing, banking, health, education, employment, transportation, social, legal
- day_range: one of exactly: week1, week2, week3, week4, month2, month3
- order: integer 1 to 18
- link: a relevant URL string or empty string`,
      response_json_schema: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                category: { type: 'string' },
                day_range: { type: 'string' },
                order: { type: 'number' },
                link: { type: 'string' },
              },
            },
          },
        },
      },
    });

    if (result?.items) {
      await base44.entities.ChecklistItem.bulkCreate(
        result.items.map(item => ({
          ...item,
          is_completed: false,
        }))
      );
      queryClient.invalidateQueries({ queryKey: ['myChecklist'] });
    }
    setGenerating(false);
  };

  const completed = checklist.filter(c => c.is_completed).length;
  const total = checklist.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  // Group by day_range
  const grouped = checklist.reduce((acc, item) => {
    const key = item.day_range || 'week1';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div ref={containerRef} {...touchHandlers} className="max-w-3xl mx-auto px-4 py-6 pb-8">
      <PullToRefreshIndicator pullDistance={pullDistance} isRefreshing={isRefreshing} />
      <div className="mb-8 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl mb-2">Your First 90 Days 🍁</h1>
          <p className="text-muted-foreground text-sm">
            A personalized step-by-step guide to getting settled in Canada
          </p>
        </div>
        {checklist.length > 0 && (
          <ExportRoadmapPDF checklist={checklist} profile={profile} />
        )}
      </div>

      {checklist.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-heading font-bold text-xl mb-3">Generate Your Personal Checklist</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8">
            Our AI will create a customized 90-day settlement checklist based on your profile, location, and goals.
          </p>
          <Button
            onClick={generateChecklist}
            disabled={generating}
            size="lg"
            className="rounded-xl gap-2 bg-primary hover:bg-primary/90"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating your checklist...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate My Checklist
              </>
            )}
          </Button>
        </div>
      ) : (
        <>
          {/* Progress */}
          <div className="bg-card rounded-2xl border border-border/50 p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-heading font-bold text-base">Overall Progress</span>
              <span className="text-sm font-semibold text-primary">{completed}/{total} done</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {/* Grouped items */}
          <div className="space-y-4">
            {Object.keys(dayRangeLabels).map(period => {
              const items = grouped[period] || [];
              if (items.length === 0) return null;
              const periodCompleted = items.filter(i => i.is_completed).length;
              const isOpen = expandedPeriod === period;

              return (
                <div key={period} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                  <button
                    onClick={() => setExpandedPeriod(isOpen ? null : period)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div>
                      <h3 className="font-heading font-bold text-sm">{dayRangeLabels[period]}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {periodCompleted}/{items.length} completed
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${items.length > 0 ? (periodCompleted / items.length) * 100 : 0}%` }}
                        />
                      </div>
                      <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 space-y-2">
                      {items.map(item => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={cn(
                            "flex items-start gap-3 p-3 rounded-xl transition-all",
                            item.is_completed ? "bg-muted/30" : "bg-muted/50 hover:bg-muted/70"
                          )}
                        >
                          <button
                            onClick={() => toggleMutation.mutate({ id: item.id, is_completed: !item.is_completed })}
                            className="mt-0.5 flex-shrink-0"
                          >
                            {item.is_completed
                              ? <CheckCircle2 className="w-5 h-5 text-primary" />
                              : <Circle className="w-5 h-5 text-muted-foreground/40 hover:text-primary/60 transition-colors" />
                            }
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={cn("text-sm font-medium", item.is_completed && "line-through text-muted-foreground")}>
                              {item.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={cn("text-[10px] border-0", categoryColors[item.category] || 'bg-muted text-muted-foreground')}>
                                {item.category}
                              </Badge>
                              {item.link && (
                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline">
                                  <ExternalLink className="w-3 h-3" /> Resource
                                </a>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}