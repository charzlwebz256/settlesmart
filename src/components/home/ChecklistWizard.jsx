import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, CheckCircle2, ChevronRight, MapPin, User, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUSES = [
  { value: 'permanent_resident', label: 'Permanent Resident', emoji: '🍁' },
  { value: 'refugee', label: 'Refugee / Protected Person', emoji: '🏠' },
  { value: 'international_student', label: 'International Student', emoji: '🎓' },
  { value: 'temporary_worker', label: 'Temporary Worker', emoji: '💼' },
  { value: 'asylum_seeker', label: 'Asylum Seeker', emoji: '🛡️' },
  { value: 'other', label: 'Other / Not sure', emoji: '❓' },
];

const PROVINCES = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
  'Newfoundland and Labrador', 'Nova Scotia', 'Ontario',
  'Prince Edward Island', 'Quebec', 'Saskatchewan',
  'Northwest Territories', 'Nunavut', 'Yukon',
];

const ARRIVAL_OPTIONS = [
  { value: 'just_arrived', label: 'Just arrived (0–7 days)', days: 0 },
  { value: 'this_month', label: 'This month (1–30 days)', days: 14 },
  { value: 'few_months', label: 'A few months ago', days: 75 },
  { value: 'over_a_year', label: 'Over a year ago', days: 400 },
];

const STEPS = ['status', 'location', 'arrival', 'generating'];

function OptionButton({ selected, onClick, emoji, label, children }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all text-sm font-medium',
        selected
          ? 'border-primary bg-primary/10 text-primary shadow-sm'
          : 'border-border/60 bg-card hover:border-primary/40 hover:bg-muted/50'
      )}
    >
      {emoji && <span className="text-xl flex-shrink-0">{emoji}</span>}
      <span className="flex-1">{label || children}</span>
      {selected && <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />}
    </button>
  );
}

export default function ChecklistWizard({ onComplete }) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [arrival, setArrival] = useState('');
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  const currentStep = STEPS[step];

  const canNext =
    (currentStep === 'status' && status) ||
    (currentStep === 'location' && province) ||
    (currentStep === 'arrival' && arrival);

  const handleGenerate = async () => {
    setStep(3);
    setGenerating(true);

    const arrivalOpt = ARRIVAL_OPTIONS.find(a => a.value === arrival);
    const arrivalDate = new Date();
    arrivalDate.setDate(arrivalDate.getDate() - (arrivalOpt?.days || 0));
    const arrivalDateStr = arrivalDate.toISOString().split('T')[0];
    const statusLabel = STATUSES.find(s => s.value === status)?.label || status;
    const location = city ? `${city}, ${province}` : province;

    // Fire LLM + user fetch simultaneously — don't wait for profile before starting LLM
    const llmPromise = base44.integrations.Core.InvokeLLM({
      model: 'gpt_5_mini',
      prompt: `Settlement checklist for a ${statusLabel} in ${location}, Canada. Arrival: ${arrivalOpt?.label}.
Return JSON "items" array, exactly 12 items. Each: title (5 words max), description (1 short sentence), category (documents|housing|banking|health|education|employment|transportation|social|legal), day_range (week1|week2|week3|week4|month2|month3), order (1-12), link (relevant gov/org URL or "").`,
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

    const userPromise = base44.auth.me().then(user =>
      Promise.all([
        base44.entities.UserProfile.filter({ created_by: user.email }),
        base44.entities.ChecklistItem.filter({ created_by: user.email }),
      ])
    );

    // Wait for both in parallel
    const [result, [existingProfiles, existingItems]] = await Promise.all([llmPromise, userPromise]);

    const profileData = {
      immigration_status: status,
      province,
      city: city || province,
      arrival_date: arrivalDateStr,
      onboarding_completed: true,
    };

    // Save profile + clear old items in parallel
    await Promise.all([
      existingProfiles.length > 0
        ? base44.entities.UserProfile.update(existingProfiles[0].id, profileData)
        : base44.entities.UserProfile.create(profileData),
      ...existingItems.map(i => base44.entities.ChecklistItem.delete(i.id)),
    ]);

    // Bulk create new checklist items
    if (result?.items?.length) {
      await base44.entities.ChecklistItem.bulkCreate(
        result.items.map(item => ({ ...item, is_completed: false }))
      );
    }

    queryClient.invalidateQueries({ queryKey: ['myProfile'] });
    queryClient.invalidateQueries({ queryKey: ['myChecklist'] });

    setGenerating(false);
    setDone(true);
    setTimeout(() => onComplete?.(), 1200);
  };

  const progressPct = (step / 3) * 100;

  return (
    <div className="bg-gradient-to-br from-primary/5 via-background to-accent/5 rounded-2xl border border-primary/20 p-6 md:p-8 shadow-lg max-w-xl mx-auto">
      {/* Progress bar */}
      {step < 3 && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Step {step + 1} of 3</span>
            <span>{Math.round(progressPct)}% complete</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Step 1: Status */}
        {currentStep === 'status' && (
          <motion.div key="status" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="flex items-center gap-2 mb-1">
              <User className="w-5 h-5 text-primary" />
              <h2 className="font-heading font-bold text-lg">What's your immigration status?</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-5">This helps us tailor your checklist to the right programs and steps.</p>
            <div className="space-y-2">
              {STATUSES.map(s => (
                <OptionButton key={s.value} selected={status === s.value} onClick={() => setStatus(s.value)} emoji={s.emoji} label={s.label} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Location */}
        {currentStep === 'location' && (
          <motion.div key="location" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="font-heading font-bold text-lg">Where are you settling?</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-5">We'll include province-specific services and resources.</p>

            <div className="mb-4">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">Province / Territory</label>
              <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {PROVINCES.map(p => (
                  <OptionButton key={p} selected={province === p} onClick={() => setProvince(p)} label={p} />
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">City (optional)</label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="e.g. Toronto, Vancouver, Calgary..."
                className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </motion.div>
        )}

        {/* Step 3: Arrival */}
        {currentStep === 'arrival' && (
          <motion.div key="arrival" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-5 h-5 text-primary" />
              <h2 className="font-heading font-bold text-lg">When did you arrive in Canada?</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-5">We'll prioritize the most urgent steps first based on where you are in your journey.</p>
            <div className="space-y-2">
              {ARRIVAL_OPTIONS.map(a => (
                <OptionButton key={a.value} selected={arrival === a.value} onClick={() => setArrival(a.value)} label={a.label} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 4: Generating */}
        {currentStep === 'generating' && (
          <motion.div key="generating" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
            {!done ? (
              <>
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
                <h2 className="font-heading font-bold text-xl mb-2">Building your checklist...</h2>
                <p className="text-sm text-muted-foreground">
                  Personalizing 18 steps for a <span className="font-medium text-foreground">{STATUSES.find(s => s.value === status)?.label}</span> in <span className="font-medium text-foreground">{city || province}</span>
                </p>
              </>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="font-heading font-bold text-xl mb-2">Your checklist is ready! 🍁</h2>
                <p className="text-sm text-muted-foreground">Redirecting you to your dashboard...</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      {step < 3 && (
        <div className="flex items-center justify-between mt-6">
          {step > 0 ? (
            <Button variant="ghost" size="sm" onClick={() => setStep(s => s - 1)} className="text-muted-foreground">
              ← Back
            </Button>
          ) : <div />}

          {step < 2 ? (
            <Button
              disabled={!canNext}
              onClick={() => setStep(s => s + 1)}
              className="rounded-xl gap-1 bg-primary hover:bg-primary/90"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              disabled={!canNext}
              onClick={handleGenerate}
              className="rounded-xl gap-2 bg-primary hover:bg-primary/90"
            >
              <Sparkles className="w-4 h-4" />
              Generate My Checklist
            </Button>
          )}
        </div>
      )}
    </div>
  );
}