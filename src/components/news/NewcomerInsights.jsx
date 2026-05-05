import { Lightbulb } from 'lucide-react';

const CATEGORY_EMOJIS = {
  immigration: '🛂',
  jobs: '💼',
  housing: '🏠',
  health: '🧠',
  breaking: '🔴',
};

export default function NewcomerInsights({ insights }) {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl border border-primary/15 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-sm">What This Means For You</h3>
          <p className="text-[11px] text-muted-foreground">Plain-language insights for newcomers</p>
        </div>
      </div>
      <div className="space-y-3">
        {insights.map((item, i) => (
          <div key={i} className="flex items-start gap-3 bg-card/60 rounded-xl p-3">
            <span className="text-lg flex-shrink-0">{CATEGORY_EMOJIS[item.category] || '💡'}</span>
            <div>
              <p className="text-xs font-semibold mb-0.5">{item.headline}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.insight}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}