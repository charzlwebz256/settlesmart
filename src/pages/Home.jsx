import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import HeroSection from '../components/home/HeroSection';
import QuickAccessGrid from '../components/home/QuickAccessGrid';
import InfoBanner from '../components/home/InfoBanner';
import First30DaysBanner from '../components/home/First30DaysBanner';
import OnboardingWalkthrough from '../components/onboarding/OnboardingWalkthrough';
import MyProgressSection from '../components/home/MyProgressSection';
import NotificationCenter from '../components/home/NotificationCenter';
import LocationBanner from '../components/home/LocationBanner';
import WhyCanadaSection from '../components/home/WhyCanadaSection';
import ChecklistWizard from '../components/home/ChecklistWizard';
import { useLocation_ } from '@/lib/LocationContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

export default function Home() {
  const { city, province, isDetecting } = useLocation_();
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  const queryClient = useQueryClient();
  const [showWizard, setShowWizard] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['myProfile'],
    queryFn: async () => {
      try {
        const user = await base44.auth.me();
        const results = await base44.entities.UserProfile.filter({ created_by_id: user.id }, '-updated_date');
        if (!results || results.length === 0) return null;
        return results.find(p => p.onboarding_completed) || results[0];
      } catch {
        return null;
      }
    },
  });

  const hasProfile = !!profile?.onboarding_completed;

  const handleWizardComplete = () => {
    queryClient.invalidateQueries({ queryKey: ['myProfile'] });
    navigate('/dashboard');
  };

  return (
    <div className="pb-8">
      <OnboardingWalkthrough />
      <LocationBanner city={city} province={province} isDetecting={isDetecting} />

      {showWizard ? (
        <div className="max-w-xl mx-auto px-4 py-8">
          <ChecklistWizard onComplete={handleWizardComplete} />
        </div>
      ) : (
        <>
          <HeroSection
            hasProfile={hasProfile}
            onStartWizard={() => requireAuth(() => setShowWizard(true))}
          />
          {hasProfile && (
            <>
              <NotificationCenter />
              <MyProgressSection />
            </>
          )}
          <WhyCanadaSection />
          <QuickAccessGrid />
          <First30DaysBanner />
          <InfoBanner />
        </>
      )}
    </div>
  );
}