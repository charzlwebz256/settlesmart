import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle2, Clock, Bus } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { settlementModules } from '@/data/settlementModules';
import TransitPlanner from '@/components/transit/TransitPlanner';
import LocalTimeChip from '@/components/transit/LocalTimeChip';

const liveModules = settlementModules.filter(m => m.status === 'live');
const plannedModules = settlementModules.filter(m => m.status === 'planned');

function ModuleCard({ module, index }) {
  const Icon = module.icon;
  const available = module.status === 'live';

  const inner = (
    <div
      className={cn(
        "h-full flex items-start gap-4 p-5 rounded-2xl bg-card border transition-all",
        available
          ? "border-border/50 hover:border-primary/40 hover:shadow-md group"
          : "border-border/40 opacity-70"
      )}
    >
      <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0", module.accent)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className={cn("font-heading font-bold text-sm", available && "group-hover:text-primary transition-colors")}>
            {module.title}
          </h3>
          {available ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
          ) : (
            <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              <Clock className="w-2.5 h-2.5" /> Soon
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{module.description}</p>
      </div>
      {available && (
        <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className="h-full"
    >
      {available ? (
        <Link to={module.path} className="block h-full">{inner}</Link>
      ) : (
        inner
      )}
    </motion.div>
  );
}

export default function Explore() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-12">
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-2">Settlement Navigator</h1>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Everything you need to settle in Canada, in one place. Start with what matters most right now —
          you do not have to do it all at once.
        </p>
      </div>

      <Link
        to="/assistant"
        className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors mb-8 group"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading font-bold text-sm">Not sure where to start?</p>
          <p className="text-xs text-muted-foreground">Ask Nexa, your AI settlement guide, for a personalized plan.</p>
        </div>
        <ArrowRight className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors flex-shrink-0" />
      </Link>

      <section className="mb-8">
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <div className="flex items-center gap-2">
            <h2 className="font-heading font-bold text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
              <Bus className="w-4 h-4 text-primary" />
              Transit map
            </h2>
            <LocalTimeChip />
          </div>
          <Link
            to="/transit-map"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            Open full map <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Live transit around you. Times are shown in your local timezone, wherever you are.
        </p>
        <TransitPlanner embedded autoLocate />
      </section>

      <h2 className="font-heading font-bold text-sm uppercase tracking-wide text-muted-foreground mb-3">
        Available now
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {liveModules.map((m, i) => <ModuleCard key={m.id} module={m} index={i} />)}
      </div>

      {plannedModules.length > 0 && (
        <>
          <h2 className="font-heading font-bold text-sm uppercase tracking-wide text-muted-foreground mb-3">
            Coming next
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {plannedModules.map((m, i) => <ModuleCard key={m.id} module={m} index={i} />)}
          </div>
        </>
      )}
    </div>
  );
}