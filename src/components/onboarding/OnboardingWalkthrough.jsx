import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, MapPin, Search, Briefcase, Scale, Bell, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const STEPS = [
  {
    icon: MapPin,
    color: 'bg-teal-500/10 text-teal-600',
    title: 'Welcome to SettleSmart Canada 🍁',
    description: 'Your all-in-one guide to settling in Canada. Let\'s show you the key features to help you get started quickly.',
    action: null,
    tip: 'This walkthrough takes under 2 minutes.',
  },
  {
    icon: MapPin,
    color: 'bg-emerald-500/10 text-emerald-600',
    title: 'Set Your City & Preferences',
    description: 'Tell us where you are and your immigration status so we can personalize services, jobs, and resources for your exact location.',
    action: { label: 'Go to Profile', path: '/profile' },
    tip: 'Your location helps filter services, events, and jobs nearby.',
  },
  {
    icon: Search,
    color: 'bg-blue-500/10 text-blue-600',
    title: 'Service Finder',
    description: 'Browse hundreds of free settlement services — housing, language classes, healthcare, legal aid, and more — filtered to your city and province.',
    action: { label: 'Explore Services', path: '/services' },
    tip: 'All services listed are free for newcomers.',
  },
  {
    icon: Briefcase,
    color: 'bg-amber-500/10 text-amber-600',
    title: 'Job Search & Alerts',
    description: 'Search live jobs from LinkedIn, Indeed, and the Government of Canada Job Bank. Subscribe to Job Alerts and get matching jobs delivered to your email.',
    action: { label: 'Find Jobs', path: '/jobs' },
    tip: 'Job Alerts send results directly to your inbox — no account needed.',
  },
  {
    icon: Scale,
    color: 'bg-purple-500/10 text-purple-600',
    title: 'Legal & Immigration Documents',
    description: 'Access official IRCC links for SIN numbers, PR cards, work permits, refugee claims, and citizenship — all in one place.',
    action: { label: 'View Legal Resources', path: '/legal' },
    tip: 'Always use official government links (canada.ca) for applications.',
  },
  {
    icon: Bell,
    color: 'bg-rose-500/10 text-rose-600',
    title: 'News, Weather & Education',
    description: 'Stay informed with live Canadian news, real-time weather, and find schools, colleges, hospitals, and daycares near you.',
    action: { label: 'Read the News', path: '/news' },
    tip: 'News is sourced from CBC, CTV, Global News, and Edmonton-local outlets.',
  },
];

const STORAGE_KEY = 'settlesmart_walkthrough_done';

export default function OnboardingWalkthrough() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) setVisible(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="bg-card rounded-3xl shadow-2xl border border-border/50 w-full max-w-md overflow-hidden"
          >
            {/* Progress bar */}
            <div className="h-1.5 bg-muted">
              <motion.div
                className="h-full bg-primary rounded-full"
                animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            {/* Close */}
            <div className="flex justify-between items-center px-5 pt-4">
              <span className="text-xs text-muted-foreground font-medium">
                Step {step + 1} of {STEPS.length}
              </span>
              <button onClick={dismiss} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
              <div className={`w-14 h-14 rounded-2xl ${current.color} flex items-center justify-center mb-4`}>
                <Icon className="w-7 h-7" />
              </div>
              <h2 className="font-heading font-bold text-xl mb-2 leading-snug">{current.title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{current.description}</p>
              {current.tip && (
                <div className="flex items-start gap-2 bg-primary/5 border border-primary/15 rounded-xl px-3 py-2.5 mb-5">
                  <span className="text-primary text-xs mt-0.5">💡</span>
                  <p className="text-xs text-primary/80 leading-relaxed">{current.tip}</p>
                </div>
              )}

              {/* Action button */}
              {current.action && (
                <Link to={current.action.path} onClick={dismiss}>
                  <Button variant="outline" size="sm" className="rounded-xl gap-1.5 mb-4 w-full">
                    {current.action.label}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between px-6 pb-6 gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep(s => s - 1)}
                disabled={step === 0}
                className="rounded-xl gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>

              <div className="flex gap-1.5">
                {STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-primary w-4' : 'bg-muted-foreground/30'}`}
                  />
                ))}
              </div>

              {isLast ? (
                <Button size="sm" onClick={dismiss} className="rounded-xl gap-1.5 bg-primary">
                  <CheckCircle2 className="w-4 h-4" /> Get Started
                </Button>
              ) : (
                <Button size="sm" onClick={() => setStep(s => s + 1)} className="rounded-xl gap-1.5 bg-primary">
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}