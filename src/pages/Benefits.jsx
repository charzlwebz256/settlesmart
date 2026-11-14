import { useState } from 'react';
import { Wallet, CheckCircle2, ExternalLink, RotateCcw, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { benefitsPrograms } from '@/data/benefitsPrograms';
import { PROVINCES } from '@/data/provincialHealth';

const STATUS_OPTIONS = [
  { value: 'permanent_resident', label: 'Permanent resident' },
  { value: 'refugee', label: 'Refugee / protected person' },
  { value: 'international_student', label: 'International student' },
  { value: 'temporary_worker', label: 'Temporary worker' },
  { value: 'citizen', label: 'Canadian citizen' },
  { value: 'other', label: 'Other / not sure' },
];

const INCOME_OPTIONS = [
  { value: 'none', label: 'No income right now' },
  { value: 'low', label: 'Low income' },
  { value: 'moderate', label: 'Moderate income' },
  { value: 'comfortable', label: 'Comfortable income' },
];

const EMPTY = { province: '', status: '', income: '', working: null, children: null, renting: null, studying: null };

function YesNo({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {[true, false].map(v => (
        <button
          key={String(v)}
          type="button"
          onClick={() => onChange(v)}
          className={cn(
            "flex-1 px-3 py-2 rounded-xl text-sm font-medium border-2 transition-all",
            value === v
              ? "border-primary bg-primary/5 text-primary"
              : "border-border text-muted-foreground hover:border-primary/30"
          )}
        >
          {v ? 'Yes' : 'No'}
        </button>
      ))}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

export default function Benefits() {
  const [answers, setAnswers] = useState(EMPTY);
  const [showResults, setShowResults] = useState(false);
  const set = (key, value) => setAnswers(prev => ({ ...prev, [key]: value }));

  const complete =
    answers.province && answers.status && answers.income &&
    answers.working !== null && answers.children !== null &&
    answers.renting !== null && answers.studying !== null;

  const matches = showResults ? benefitsPrograms.filter(p => p.applies(answers)) : [];

  const reset = () => {
    setAnswers(EMPTY);
    setShowResults(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-12">
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-2 flex items-center gap-2">
          <Wallet className="w-6 h-6 text-primary" />
          Benefits &amp; Financial Support
        </h1>
        <p className="text-muted-foreground text-sm">
          Answer a few questions to see which government programs may apply to you. This is a guide, not an
          official decision.
        </p>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 p-5 space-y-4 mb-6">
        <div className="auto-grid gap-4">
          <Field label="Province or territory">
            <Select value={answers.province || undefined} onValueChange={v => set('province', v)}>
              <SelectTrigger className="w-full h-10 rounded-xl border border-input bg-transparent px-3 text-sm">
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent>
                {PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Immigration status">
            <Select value={answers.status || undefined} onValueChange={v => set('status', v)}>
              <SelectTrigger className="w-full h-10 rounded-xl border border-input bg-transparent px-3 text-sm">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field label="Household income">
          <Select value={answers.income || undefined} onValueChange={v => set('income', v)}>
            <SelectTrigger className="w-full h-10 rounded-xl border border-input bg-transparent px-3 text-sm">
              <SelectValue placeholder="Select your situation" />
            </SelectTrigger>
            <SelectContent>
              {INCOME_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>

        <div className="auto-grid gap-4">
          <Field label="Are you currently working?">
            <YesNo value={answers.working} onChange={v => set('working', v)} />
          </Field>
          <Field label="Do you have children under 18?">
            <YesNo value={answers.children} onChange={v => set('children', v)} />
          </Field>
          <Field label="Are you renting your home?">
            <YesNo value={answers.renting} onChange={v => set('renting', v)} />
          </Field>
          <Field label="Are you studying?">
            <YesNo value={answers.studying} onChange={v => set('studying', v)} />
          </Field>
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            onClick={() => setShowResults(true)}
            disabled={!complete}
            className="flex-1 rounded-xl"
          >
            See what may apply
          </Button>
          {showResults && (
            <Button variant="outline" onClick={reset} className="rounded-xl gap-1.5">
              <RotateCcw className="w-4 h-4" /> Reset
            </Button>
          )}
        </div>
        {!complete && (
          <p className="text-[11px] text-muted-foreground">Answer every question to see results.</p>
        )}
      </div>

      {showResults && (
        <>
          <h2 className="font-heading font-bold text-sm mb-3">
            {matches.length} program{matches.length !== 1 ? 's' : ''} may apply
          </h2>

          {matches.length === 0 ? (
            <div className="p-5 rounded-2xl bg-card border border-border/50 text-sm text-muted-foreground">
              Nothing matched with these answers. Try adjusting them, or call 211 to speak with someone about
              local help.
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map(p => (
                <div key={p.id} className="p-4 rounded-2xl bg-card border border-border/50">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <h3 className="font-heading font-bold text-sm">{p.name}</h3>
                    <span className="text-[10px] font-semibold uppercase tracking-wide bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {p.level}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-1.5">{p.description}</p>
                  <p className="text-xs text-foreground/80 leading-relaxed mb-2.5">
                    <span className="font-semibold">Who it helps: </span>{p.eligibility}
                  </p>
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    Official source <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-muted/60 mt-4">
            <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              This is general information, not an official decision. Eligibility depends on details such as
              income, tax filing, family size and your immigration status, and rules change. Confirm on the
              official page, or call 211 for free help applying.
            </p>
          </div>
        </>
      )}
    </div>
  );
}