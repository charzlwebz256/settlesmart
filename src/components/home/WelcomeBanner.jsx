import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, ListChecks, Sparkles, Sunrise, Sun, Sunset, Moon, User, CalendarDays } from 'lucide-react';
import { differenceInDays, parseISO, isValid } from 'date-fns';

const IMAGE = 'https://media.base44.com/images/public/69f2dbb716d886c9c4ab31fc/302dc30c0_generated_image.png';

const PARTS = [
  { from: 5, to: 12, label: 'Good morning', Icon: Sunrise, tint: 'text-amber-600 dark:text-amber-400', grad: 'from-amber-100/70 via-card to-card dark:from-amber-950/30' },
  { from: 12, to: 17, label: 'Good afternoon', Icon: Sun, tint: 'text-primary', grad: 'from-primary/10 via-card to-card' },
  { from: 17, to: 21, label: 'Good evening', Icon: Sunset, tint: 'text-orange-600 dark:text-orange-400', grad: 'from-orange-100/70 via-card to-card dark:from-orange-950/30' },
  { from: 21, to: 24, label: 'Good evening', Icon: Moon, tint: 'text-indigo-600 dark:text-indigo-400', grad: 'from-indigo-100/60 via-card to-card dark:from-indigo-950/30' },
  { from: 0, to: 5, label: 'Good night', Icon: Moon, tint: 'text-indigo-600 dark:text-indigo-400', grad: 'from-indigo-100/60 via-card to-card dark:from-indigo-950/30' },
];

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

  // Keep the greeting and clock in step with the time of day
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const hour = now.getHours();
  const part = PARTS.find((p) => hour >= p.from && hour < p.to) || PARTS[0];
  const name = (user?.full_name || '').trim().split(' ')[0] || 'there';
  const place = [profile?.city || city, profile?.province || province].filter(Boolean).join(', ');
  const status = STATUS_LABELS[profile?.immigration_status];
  const arrival = profile?.arrival_date ? parseISO(profile.arrival_date) : null;
  const daysInCanada = arrival && isValid(arrival) ? Math.max(0, differenceInDays(now, arrival)) : null;

  return (
    <section className="max-w-7xl mx-auto px-4 pt-5">
      <div className={`relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br ${part.grad} p-6 md:p-8`}>
        <div className="flex items-center gap-6">
          <div className="flex-1 min-w-0">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <CalendarDays className="w-3.5 h-3.5" />
              {now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
              <span className="opacity-50">·</span>
              {now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
            </p>

            <h1 className="font-heading font-extrabold text-2xl md:text-4xl leading-tight mt-2 flex items-center gap-2 flex-wrap">
              <part.Icon className={`w-6 h-6 md:w-8 md:h-8 ${part.tint}`} />
              {part.label}, {name}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1.5">
              Welcome back to SettleSmart. Here's where your journey stands today.
            </p>

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
                  Day {daysInCanada} in Canada
                </span>
              )}
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
                <Button size="sm" variant="ghost" className="rounded-xl gap-1.5 h-10 px-4 font-semibold text-primary hover:bg-primary/10">
                  <Sparkles className="w-4 h-4" /> Ask Nexa
                </Button>
              </Link>
            </div>
          </div>

          <img
            src={IMAGE}
            alt="Newcomers arriving in Canada"
            className="hidden md:block w-64 lg:w-80 h-48 object-cover rounded-2xl flex-shrink-0 shadow-sm"
          />
        </div>
      </div>
    </section>
  );
}