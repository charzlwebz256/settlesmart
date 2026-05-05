import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, MapPin, User, BookOpen,
  Sparkles, Globe, Users, CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const provinces = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
  'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia',
  'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon'
];

const statuses = [
  { value: 'permanent_resident', label: 'Permanent Resident', icon: '🏠' },
  { value: 'refugee', label: 'Refugee / Protected Person', icon: '🛡️' },
  { value: 'international_student', label: 'International Student', icon: '🎓' },
  { value: 'temporary_worker', label: 'Temporary Worker', icon: '💼' },
  { value: 'asylum_seeker', label: 'Asylum Seeker', icon: '🤝' },
  { value: 'citizen', label: 'New Citizen', icon: '🍁' },
];

const interests = [
  { value: 'education', label: 'Education & Language', icon: BookOpen },
  { value: 'employment', label: 'Jobs & Career', icon: User },
  { value: 'housing', label: 'Housing', icon: MapPin },
  { value: 'legal', label: 'Legal & Immigration', icon: Globe },
  { value: 'health', label: 'Health & Wellness', icon: Users },
  { value: 'volunteering', label: 'Community & Volunteering', icon: Sparkles },
];

const languages = [
  { value: 'en', label: 'English' }, { value: 'fr', label: 'Français' },
  { value: 'ar', label: 'العربية' }, { value: 'zh', label: '中文' },
  { value: 'es', label: 'Español' }, { value: 'hi', label: 'हिन्दी' },
  { value: 'ur', label: 'اردو' }, { value: 'fa', label: 'فارسی' },
  { value: 'so', label: 'Soomaali' }, { value: 'tl', label: 'Tagalog' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    immigration_status: '',
    province: '',
    city: '',
    language_preference: 'en',
    interests: [],
    english_level: 'beginner',
    family_size: 1,
  });

  const updateField = (field, value) => setData(prev => ({ ...prev, [field]: value }));
  const toggleInterest = (val) => {
    setData(prev => ({
      ...prev,
      interests: prev.interests.includes(val)
        ? prev.interests.filter(i => i !== val)
        : [...prev.interests, val]
    }));
  };

  const handleFinish = async () => {
    setSaving(true);
    await base44.entities.UserProfile.create({
      ...data,
      onboarding_completed: true,
      arrival_date: new Date().toISOString().split('T')[0],
    });
    navigate('/dashboard');
  };

  const steps = [
    // Step 0: Status
    <div key="status" className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="font-heading font-bold text-2xl mb-2">Welcome to Canada! 🍁</h2>
        <p className="text-muted-foreground">What best describes your immigration status?</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {statuses.map(s => (
          <button
            key={s.value}
            onClick={() => updateField('immigration_status', s.value)}
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
              data.immigration_status === s.value
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30"
            )}
          >
            <span className="text-2xl">{s.icon}</span>
            <span className="font-semibold text-sm">{s.label}</span>
          </button>
        ))}
      </div>
    </div>,

    // Step 1: Location
    <div key="location" className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="font-heading font-bold text-2xl mb-2">Where are you settling?</h2>
        <p className="text-muted-foreground">We'll find services near you</p>
      </div>
      <div className="space-y-4 max-w-md mx-auto">
        <div className="block">
          <span className="text-sm font-medium mb-1.5 block">Province / Territory</span>
          <div className="grid grid-cols-2 gap-2">
            {provinces.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => updateField('province', p)}
                className={cn(
                  "px-3 py-2.5 rounded-xl border-2 text-sm text-left transition-all font-medium",
                  data.province === p
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/30 text-foreground"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <label className="block">
          <span className="text-sm font-medium mb-1.5 block">City</span>
          <input
            value={data.city}
            onChange={e => updateField('city', e.target.value)}
            placeholder="e.g., Edmonton, Toronto, Vancouver"
            className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:ring-2 focus:ring-primary/20"
          />
        </label>
      </div>
    </div>,

    // Step 2: Language
    <div key="language" className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="font-heading font-bold text-2xl mb-2">Your Language</h2>
        <p className="text-muted-foreground">Choose your preferred language and English level</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto">
        {languages.map(l => (
          <button
            key={l.value}
            onClick={() => updateField('language_preference', l.value)}
            className={cn(
              "p-3 rounded-xl border-2 text-center transition-all text-sm font-medium",
              data.language_preference === l.value
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30"
            )}
          >
            {l.label}
          </button>
        ))}
      </div>
      <div className="max-w-md mx-auto mt-6">
        <span className="text-sm font-medium mb-2 block">English Level</span>
        <div className="flex gap-2 flex-wrap">
          {['none', 'beginner', 'intermediate', 'advanced', 'fluent'].map(level => (
            <button
              key={level}
              onClick={() => updateField('english_level', level)}
              className={cn(
                "px-4 py-2 rounded-lg border text-xs font-medium capitalize transition-all",
                data.english_level === level
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary/30"
              )}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    </div>,

    // Step 3: Interests
    <div key="interests" className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="font-heading font-bold text-2xl mb-2">What do you need help with?</h2>
        <p className="text-muted-foreground">Select all that apply — we'll personalize your experience</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
        {interests.map(int => (
          <button
            key={int.value}
            onClick={() => toggleInterest(int.value)}
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all",
              data.interests.includes(int.value)
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              data.interests.includes(int.value) ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}>
              <int.icon className="w-5 h-5" />
            </div>
            <span className="font-semibold text-sm">{int.label}</span>
            {data.interests.includes(int.value) && (
              <CheckCircle2 className="w-5 h-5 text-primary ml-auto" />
            )}
          </button>
        ))}
      </div>
    </div>,
  ];

  const canProceed = [
    data.immigration_status,
    data.province && data.city,
    data.language_preference,
    data.interests.length > 0,
  ][step];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Step {step + 1} of {steps.length}</span>
            <span className="text-xs font-medium text-primary">{Math.round(((step + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {steps[step]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="sticky bottom-0 bg-card/80 backdrop-blur-xl border-t border-border/50 p-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          {step > 0 && (
            <Button variant="outline" size="lg" className="rounded-xl" onClick={() => setStep(s => s - 1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <Button
            size="lg"
            className="rounded-xl flex-1 bg-primary hover:bg-primary/90"
            disabled={!canProceed || saving}
            onClick={step < steps.length - 1 ? () => setStep(s => s + 1) : handleFinish}
          >
            {saving ? 'Setting up...' : step < steps.length - 1 ? 'Continue' : 'Finish Setup'}
            {!saving && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}