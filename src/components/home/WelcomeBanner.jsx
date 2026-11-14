import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, ListChecks, Sparkles, User, CalendarDays } from 'lucide-react';
import { differenceInDays, parseISO, isValid } from 'date-fns';
import GreetingCard from './GreetingCard';
import BannerWeather from './BannerWeather';
import { getDayPart } from '@/lib/dayParts';
import { timezoneForLocation, formatClock, formatDate } from '@/lib/canadaTimezones';

const STATUS_LABELS = {
  permanent_resident: 'Permanent resident',
  refugee: 'Refugee',
  international_student: 'International student',
  temporary_worker: 'Temporary worker',
  asylum_seeker: 'Asylum seeker',
  citizen: 'Citizen',
  other: 'Newcomer',
};

export default function WelcomeBanner({ user, profile, city, province }) {
  const [now, setNow] = useState(new Date());

  // Keep the greeting, photo and clock in step with the time of day
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Local time at the visitor's own province
  const activeProvince = profile?.province || province;
  const activeCity = profile?.city || city;
  const timeZone = timezoneForLocation(activeProvince);
  const part = getDayPart(now, timeZone);
  const name = (user?.full_name || '').trim().split(' ')[0] || 'there';
  const place = [activeCity, activeProvince].filter(Boolean).join(', ');
  const status = STATUS_LABELS[profile?.immigration_status];
  const arrival = profile?.arrival_date ? parseISO(profile.arrival_date) : null;
  const daysInCanada = arrival && isValid(arrival) ? Math.max(0, differenceInDays(now, arrival)) : null;

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
          {part.label}, {name}
        </>
      )}
      subtitle="Start your new life with confidence, here's where your journey stands today."
    >
      <div className="flex flex-wrap items-center gap-2 mt-4">
        {place && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card/80 border border-border/60 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5 text-primary" /> {place}
          </span>
        )}
        {status && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card/80 border border-border/60 text-xs font-medium">
            <User className="w-3.5 h-3.5 text-primary" /> {status}
          </span>
        )}
        {daysInCanada !== null && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card/80 border border-border/60 text-xs font-medium">
            {daysInCanada} {daysInCanada === 1 ? 'day' : 'days'} in Canada
          </span>
        )}
        <BannerWeather city={activeCity} province={activeProvince} />
      </div>

      <div className="flex flex-wrap gap-2 mt-5">
        <Link to="/checklist">
          <Button size="sm" className="rounded-xl gap-1.5 h-10 px-4 bg-primary hover:bg-primary/90 font-semibold">
            <ListChecks className="w-4 h-4" /> My checklist
          </Button>
        </Link>
        <Link to="/profile">
          <Button size="sm" variant="outline" className="rounded-xl gap-1.5 h-10 px-4 font-semibold">
            <User className="w-4 h-4" /> My profile
          </Button>
        </Link>
        <Link to="/assistant">
          <Button size="sm" variant="ghost" className="rounded-xl gap-1.5 h-10 px-4 font-semibold text-primary hover:bg-black hover:text-white">
            <Sparkles className="w-4 h-4" /> Ask Nexa
          </Button>
        </Link>
      </div>
    </GreetingCard>
  );
}