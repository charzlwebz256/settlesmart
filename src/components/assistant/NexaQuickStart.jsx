import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  BadgeCheck, GraduationCap, Briefcase, ShieldCheck, Scale, Users, FileText,
  Home as HomeIcon, HeartPulse, BookOpen, Wallet, CalendarDays, ArrowLeft, ArrowRight, Sparkles, MapPin,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PROVINCES, citiesFor } from '@/data/canadaLocations';
import {
  MobileSelect as Select, MobileSelectContent as SelectContent, MobileSelectItem as SelectItem,
  MobileSelectTrigger as SelectTrigger, MobileSelectValue as SelectValue,
} from '@/components/ui/mobile-select';

const ILLUSTRATION = 'https://media.base44.com/images/public/69f2dbb716d886c9c4ab31fc/9e409da97_generated_image.png';

const ROLES = [
  { id: 'permanent_resident', label: 'Permanent resident', hint: 'PR card or landing papers', Icon: BadgeCheck },
  { id: 'international_student', label: 'International student', hint: 'Study permit', Icon: GraduationCap },
  { id: 'temporary_worker', label: 'Temporary worker', hint: 'Work permit', Icon: Briefcase },
  { id: 'refugee', label: 'Refugee', hint: 'Protected person status', Icon: ShieldCheck },
  { id: 'asylum_seeker', label: 'Asylum seeker', hint: 'Claim in progress', Icon: Scale },
  { id: 'other', label: 'Just exploring', hint: 'Another situation', Icon: Users },
];

const GOALS = [
  { id: 'documents', label: 'Documents & PR', hint: 'SIN, health card, permits', Icon: FileText },
  { id: 'jobs', label: 'Jobs & career', hint: 'Find work, resume, interviews', Icon: Briefcase },
  { id: 'housing', label: 'Housing', hint: 'Renting, tenant rights', Icon: HomeIcon },
  { id: 'health', label: 'Healthcare', hint: 'Family doctor, coverage', Icon: HeartPulse },
  { id: 'education', label: 'Education & language', hint: 'LINC classes, schools', Icon: BookOpen },
  { id: 'money', label: 'Money & benefits', hint: 'CCB, credits, banking', Icon: Wallet },
  { id: 'legal', label: 'Legal help', hint: 'IRCC and immigration advice', Icon: Scale },
  { id: 'community', label: 'Community & events', hint: 'Meet people, workshops', Icon: CalendarDays },
];

function OptionButton({ item, selected, onSelect }) {
  const Icon = item.Icon;
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex items-start gap-2.5 text-left p-3 rounded-xl border transition-all',
        selected
          ? 'border-primary bg-primary/10'
          : 'border-border/50 bg-card hover:border-primary/30 hover:bg-primary/5'
      )}
    >
      <span className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', selected ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary')}>
        <Icon className="w-4 h-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold leading-tight">{item.label}</span>
        <span className="block text-[11px] text-muted-foreground mt-0.5 leading-snug">{item.hint}</span>
      </span>
    </button>
  );
}

export default function NexaQuickStart({ defaultProvince, defaultCity, onComplete }) {
  const [step, setStep] = useState(0);
  const [province, setProvince] = useState(defaultProvince || '');
  const [city, setCity] = useState(defaultCity || '');
  const [role, setRole] = useState(null);
  const [goal, setGoal] = useState(null);

  const pickRole = (item) => {
    setRole(item);
    setStep(1);
  };

  const finish = (item) => {
    setGoal(item);
    onComplete({
      role: role.id,
      roleLabel: role.label,
      goal: item.id,
      goalLabel: item.label,
      province,
      city,
    });
  };

  const dots = [0, 1, 2];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-8">
      <div className="rounded-3xl border border-border/50 bg-card overflow-hidden">
        <div className="grid md:grid-cols-[260px_1fr]">
          {/* Intro rail */}
          <div className="hidden md:flex flex-col justify-between gap-6 bg-primary/5 p-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary" />
                </span>
                <span className="font-heading font-bold text-sm">Nexa</span>
              </div>
              <h2 className="font-heading font-bold text-lg leading-snug">Let's find your starting point</h2>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Answer three quick questions and I'll point you to the right place to begin your Canadian journey. No account needed.
              </p>
            </div>
            <img src={ILLUSTRATION} alt="Your route into Canada" className="w-full rounded-2xl" />
          </div>

          {/* Questions */}
          <div className="p-5 md:p-7">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-1.5">
                {dots.map((d) => (
                  <span key={d} className={cn('h-1.5 rounded-full transition-all', d === step ? 'w-6 bg-primary' : d < step ? 'w-3 bg-primary/50' : 'w-3 bg-muted')} />
                ))}
              </div>
              <span className="text-[11px] font-medium text-muted-foreground">Step {step + 1} of 3</span>
            </div>

            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="role" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }}>
                  <h3 className="font-heading font-bold text-base mb-1">Who are you in Canada?</h3>
                  <p className="text-xs text-muted-foreground mb-4">This shapes the services and benefits I show you.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ROLES.map((item) => (
                      <OptionButton key={item.id} item={item} selected={role?.id === item.id} onSelect={() => pickRole(item)} />
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="location" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }}>
                  <h3 className="font-heading font-bold text-base mb-1">Where are you settling?</h3>
                  <p className="text-xs text-muted-foreground mb-4">Services, programs and news are different in every province.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Province or territory</label>
                      <Select value={province || undefined} onValueChange={(v) => { setProvince(v); setCity(''); }}>
                        <SelectTrigger className="w-full h-10 rounded-xl border border-input bg-card px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROVINCES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">City</label>
                      <Select value={city || undefined} onValueChange={setCity} disabled={!province}>
                        <SelectTrigger className="w-full h-10 rounded-xl border border-input bg-card px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50">
                          <SelectValue placeholder={province ? 'Select city' : 'Province first'} />
                        </SelectTrigger>
                        <SelectContent>
                          {citiesFor(province).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-5">
                    <Button variant="ghost" size="sm" onClick={() => setStep(0)} className="rounded-xl gap-1.5">
                      <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                    <Button size="sm" disabled={!province || !city} onClick={() => setStep(2)} className="rounded-xl gap-1.5 bg-primary hover:bg-primary/90 font-semibold">
                      Continue <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="goal" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }}>
                  <h3 className="font-heading font-bold text-base mb-1">What do you need first?</h3>
                  <p className="text-xs text-muted-foreground mb-4">Pick the priority for your first weeks — you can explore everything else later.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {GOALS.map((item) => (
                      <OptionButton key={item.id} item={item} selected={goal?.id === item.id} onSelect={() => finish(item)} />
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-4">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {[city, province].filter(Boolean).join(', ')}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="rounded-xl gap-1.5 mt-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}