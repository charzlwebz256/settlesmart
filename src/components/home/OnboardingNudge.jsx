import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';

export default function OnboardingNudge() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  if (!isAuthenticated || dismissed) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 mt-4">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary/10 border border-primary/25 rounded-2xl p-4 flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading font-bold text-sm">Finish your profile</p>
          <p className="text-xs text-muted-foreground">Complete onboarding to unlock personalized recommendations, your 90-day checklist, and saved items.</p>
        </div>
        <button
          onClick={() => navigate('/onboarding')}
          className="flex-shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-primary bg-primary/15 hover:bg-primary/20 px-3 py-2 rounded-xl transition-colors"
        >
          Continue <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 p-1.5 rounded-lg text-muted-foreground hover:bg-muted"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}