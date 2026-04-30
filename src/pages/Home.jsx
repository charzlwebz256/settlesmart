import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import HeroSection from '../components/home/HeroSection';
import QuickAccessGrid from '../components/home/QuickAccessGrid';
import InfoBanner from '../components/home/InfoBanner';
import First30DaysBanner from '../components/home/First30DaysBanner';

export default function Home() {
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
      <HeroSection hasProfile={hasProfile} />
      <QuickAccessGrid />
      <First30DaysBanner />
      <InfoBanner />
    </div>
  );
}