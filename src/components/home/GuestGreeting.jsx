import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CalendarDays, Sparkles } from 'lucide-react';
import GreetingCard from './GreetingCard';
import { getDayPart } from '@/lib/dayParts';

// Signed-out visitors: a greeting card that follows the time of day, no name.
export default function GuestGreeting({ onStartWizard }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const part = getDayPart(now);

  return (
    <GreetingCard
      part={part}
      eyebrow={(
        <>
          <CalendarDays className="w-3.5 h-3.5" />
          {now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
          <span className="opacity-50">·</span>
          {now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
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
        Free settlement services, housing, jobs and education — all in one place.
      </p>

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