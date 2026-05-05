import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import HeroSection from '../components/home/HeroSection';
import QuickAccessGrid from '../components/home/QuickAccessGrid';
import InfoBanner from '../components/home/InfoBanner';
import First30DaysBanner from '../components/home/First30DaysBanner';
import OnboardingWalkthrough from '../components/onboarding/OnboardingWalkthrough';
import MyProgressSection from '../components/home/MyProgressSection';
import NotificationCenter from '../components/home/NotificationCenter';

export default function Home() {
  const [userCity, setUserCity] = useState(null);
  const [userProvince, setUserProvince] = useState(null);

  // Detect user location on mount
  useEffect(() => {
    const detectLocation = async () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            // Use reverse geolocation via LLM
            const result = await base44.integrations.Core.InvokeLLM({
              prompt: `Given latitude ${latitude} and longitude ${longitude} in Canada, determine the nearest city and province. Return JSON with city and province fields.`,
              add_context_from_internet: true,
              response_json_schema: {
                type: 'object',
                properties: {
                  city: { type: 'string' },
                  province: { type: 'string' },
                },
              },
            });
            if (result?.city && result?.province) {
              setUserCity(result.city);
              setUserProvince(result.province);
            }
          },
          () => {
            // Geolocation denied or unavailable - silently fail
          }
        );
      }
    };
    detectLocation();
  }, []);

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

  return (
    <div className="pb-24 md:pb-8">
      <OnboardingWalkthrough />
      <HeroSection hasProfile={hasProfile} />
      {hasProfile && (
        <>
          <NotificationCenter />
          <MyProgressSection />
        </>
      )}
      <QuickAccessGrid />
      <First30DaysBanner />
      <InfoBanner />
    </div>
  );
}