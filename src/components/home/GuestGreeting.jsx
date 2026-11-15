import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CalendarDays, Sparkles } from 'lucide-react';
import GreetingCard from './GreetingCard';
import BannerWeather from './BannerWeather';
import { getDayPart } from '@/lib/dayParts';
import { timezoneForLocation, formatClock, formatDate } from '@/lib/canadaTimezones';
import { useSyncedNow } from '@/lib/internetTime';

// Signed-out visitors: a greeting card that follows the time of day, no name.
export default function GuestGreeting({ onStartWizard, city, province }) {
  const now = useSyncedNow();
  const timeZone = timezoneForLocation(province);
  const part = getDayPart(now, timeZone);

  return (
    <GreetingCard
      part={part}
      eyebrow={(
        <>
          <CalendarDays className="w-3.5 h-3.5" />
          {formatDate(now, timeZone)}
          <span className="opacity-50">·</span>
          <span className="tabular-nums">{formatClock(now, timeZone)}</span>
        </>
      )}
      title={(
        <>
          <part.Icon className={`w-6 h-6 md:w-8 md:h-8 ${part.tint}`} />
          {part.label}
        </>
      )}
      subtitle="Start your new life in Canada with confidence."
    >
      <p className="text-sm text-muted-foreground mt-2 max-w-lg">
        Free settlement services, housing, jobs and education, all in one place.
      </p>

      <div className="mt-3">
        <BannerWeather city={city} province={province} />
      </div>

      <div className="flex flex-wrap gap-2 mt-5">
        <Button
          onClick={onStartWizard}
          className="rounded-xl gap-1.5 h-10 px-4 bg-primary hover:bg-primary/90 font-semibold"
        >
          <Sparkles className="w-4 h-4" /> Build my checklist
          <ArrowRight className="w-4 h-4" />
        </Button>
        <Link to="/services">
          <Button variant="outline" className="rounded-xl h-10 px-4 font-semibold">
            Browse services
          </Button>
        </Link>
      </div>
    </GreetingCard>
  );
}