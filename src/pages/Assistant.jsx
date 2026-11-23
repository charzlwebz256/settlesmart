import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, ChevronRight, Pencil, MessageCircle, Mic, Keyboard } from 'lucide-react';
import NexaQuickStart from '@/components/assistant/NexaQuickStart';
import StartingPoints from '@/components/assistant/StartingPoints';
import NexaAvatarCall from '@/components/assistant/NexaAvatarCall';
import NexaTextChat from '@/components/assistant/NexaTextChat';
import { useAuth } from '@/lib/AuthContext';
import { useLocation_ } from '@/lib/LocationContext';

const STATUS_LABELS = {
  permanent_resident: 'Permanent resident',
  refugee: 'Refugee',
  international_student: 'International student',
  temporary_worker: 'Temporary worker',
  asylum_seeker: 'Asylum seeker',
  citizen: 'Citizen',
  other: 'Newcomer',
};

const TOPICS = [
  'Getting a Social Insurance Number',
  'A health card and a family doctor',
  'Finding housing and understanding a lease',
  'Free English or French classes',
  'Jobs and getting your credentials recognized',
  'Benefits, taxes and the Canada Child Benefit',
];

export default function Assistant() {
  const { isAuthenticated, user } = useAuth();
  const { city: detectedCity, province: detectedProvince } = useLocation_();
  const [guest, setGuest] = useState(null);
  const [mode, setMode] = useState('talk');

  const { data: profile } = useQuery({
    queryKey: ['myProfile'],
    enabled: isAuthenticated,
    queryFn: async () => {
      const me = await base44.auth.me();
      const results = await base44.entities.UserProfile.filter({ created_by_id: me.id });
      return results[0] || null;
    },
  });

  const resetGuest = () => setGuest(null);

  const place = [profile?.city || (isAuthenticated ? detectedCity : guest?.city), profile?.province || (isAuthenticated ? detectedProvince : guest?.province)]
    .filter(Boolean)
    .join(', ');
  const statusLabel = profile?.immigration_status ? STATUS_LABELS[profile.immigration_status] : null;
  const firstName = (user?.full_name || '').trim().split(' ')[0];

  // Signed-out visitors start with the three questions, not a blank call
  if (!isAuthenticated && !guest) {
    return <NexaQuickStart defaultProvince={detectedProvince} defaultCity={detectedCity} onComplete={setGuest} />;
  }

  const guestContext = guest
    ? { city: guest.city, province: guest.province, immigration_status: guest.role, interests: [guest.goal] }
    : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 pb-24 md:pb-10">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="font-heading text-lg font-bold leading-tight">Nexa</h1>
              <p className="truncate text-xs text-muted-foreground">Your live settlement guide for Canada</p>
            </div>
          </div>

          {isAuthenticated ? (
            <Link
              to="/profile"
              className="flex flex-shrink-0 items-center gap-2 rounded-xl border border-border/50 bg-card py-1 pl-2 pr-1 transition-colors hover:border-primary/30"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                {(firstName || 'U').charAt(0).toUpperCase()}
              </span>
              <span className="hidden text-left leading-tight sm:block">
                <span className="block max-w-[120px] truncate text-xs font-semibold">{user?.full_name || 'My account'}</span>
                <span className="block text-[10px] text-muted-foreground">View profile</span>
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ) : (
            <button
              onClick={resetGuest}
              className="flex flex-shrink-0 items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <Pencil className="h-3.5 w-3.5" /> Change answers
            </button>
          )}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          {isAuthenticated ? (
            <>
              <span>{place ? `Personalised for ${place}` : 'Add your city in your profile'}</span>
              {statusLabel && <span className="opacity-40">·</span>}
              {statusLabel && <span>{statusLabel}</span>}
            </>
          ) : (
            <span>
              Personalised for {[guest.city, guest.province].filter(Boolean).join(', ')} · {guest.roleLabel} · {guest.goalLabel}
            </span>
          )}
        </div>
      </div>

      <div className="mb-4 inline-flex rounded-xl border border-border/50 bg-card p-1">
        <button
          onClick={() => setMode('talk')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            mode === 'talk' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Mic className="h-3.5 w-3.5" /> Talk
        </button>
        <button
          onClick={() => setMode('type')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            mode === 'type' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Keyboard className="h-3.5 w-3.5" /> Type
        </button>
      </div>

      {mode === 'talk' ? (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,20rem)_1fr] md:items-start">
        <NexaAvatarCall guest={guestContext} onSwitchToText={() => setMode('type')} />

        <div className="space-y-4">
          <div className="rounded-2xl border border-border/50 bg-card p-4">
            <h2 className="mb-1 flex items-center gap-1.5 font-heading text-sm font-bold">
              <MessageCircle className="h-4 w-4 text-primary" />
              {firstName ? `Welcome back, ${firstName}` : 'How this works'}
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Press start and speak naturally. Nexa hears you, answers out loud with her face in view, and can stop and
              listen at any time. She knows {place ? `you are in ${place}` : 'the basics of settling in Canada'} and will
              point you to the right page of SettleSmart when a local detail matters.
            </p>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card p-4">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Things you can ask her</p>
            <ul className="space-y-1.5">
              {TOPICS.map((topic) => (
                <li key={topic} className="flex gap-2 text-xs leading-relaxed text-foreground">
                  <span className="text-primary">•</span>
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </div>

          {guest && <StartingPoints goal={guest.goal} province={guest.province} />}
        </div>
      </div>
      ) : (
        <NexaTextChat guest={guestContext} profile={profile} className="h-[calc(100vh-20rem)] min-h-[420px]" />
      )}
    </div>
  );
}