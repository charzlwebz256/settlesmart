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

export default function Home() {
  const { city, province, isDetecting } = useLocation_();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showWizard, setShowWizard] = useState(false);

  const { data: profiles } = useQuery({
    queryKey: ['myProfile'],
    queryFn: async () => {
      const user = await base44.auth.me();
      const results = await base44.entities.UserProfile.filter({ created_by: user.email });
      return results;
    },
    initialData: [],
  });

  const hasProfile = profiles.length > 0 && profiles[0].onboarding_completed;

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
          <HeroSection hasProfile={hasProfile} onStartWizard={() => setShowWizard(true)} />
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