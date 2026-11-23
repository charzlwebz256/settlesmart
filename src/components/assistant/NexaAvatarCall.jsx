import { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { createNuanceConversation } from '@nuancelabs/js-sdk';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, PhoneOff, Loader2, AlertCircle, Radio, Keyboard } from 'lucide-react';
import { NEXA_PORTRAIT } from '@/data/nexaPortrait';
import { cn } from '@/lib/utils';

const STATE_TEXT = {
  idle: 'Ready when you are',
  queued: 'Waiting for a free spot',
  connecting: 'Connecting',
  connected: 'Live',
  disconnected: 'Call ended',
  failed: 'Could not connect',
};

function formatRenewal(iso) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

const CREDIT_MESSAGE = "The voice assistant has used today's call credits. You can still chat with Nexa by text.";

// Reads the token endpoint's own refusal so the person sees the real reason.
function refusalMessage(body) {
  if (!body || typeof body !== 'object') return null;
  const detail = typeof body.detail === 'string' ? body.detail : '';
  let code = body.code || '';
  let renewsAt = '';
  if (detail) {
    try {
      const parsed = JSON.parse(detail);
      code = code || parsed.code || '';
      renewsAt = parsed.renews_at || '';
    } catch (_e) {
      // Not JSON: the generic message below stands.
    }
  }
  if (code === 'credits_spent') {
    const when = formatRenewal(renewsAt);
    return when ? `The voice assistant has used today's call credits. They renew ${when}. You can still chat with Nexa by text.` : CREDIT_MESSAGE;
  }
  if (body.status === 503) return 'The voice assistant is not configured yet. You can still chat with Nexa by text.';
  return null;
}

function describeError(error) {
  if (!error) return null;
  if (error.friendly) return error.friendly;
  if (error?.name === 'MediaAccessError' || error?.reason === 'permission-denied') {
    return 'Your browser blocked the microphone. Allow microphone access for this site, then try again.';
  }
  if (error?.reason === 'device-not-found' || error?.reason === 'device-in-use') {
    return 'No microphone is available right now. Check your device and try again.';
  }
  if (error?.name === 'ActiveSessionError') {
    return 'Another Nexa call is already open in this browser. End it, then try again.';
  }
  if (error?.name === 'GuestLimitError') {
    return 'The free call limit for this device has been reached. You can still chat with Nexa by text.';
  }
  if (error?.name === 'JoinTimeoutError') {
    return 'The call could not connect. A VPN or a privacy extension can block calls, so try again on a normal connection.';
  }
  if (error?.name === 'MaintenanceError') {
    return error.message || 'The voice service is under maintenance. Please try again later.';
  }
  if (error?.name === 'LegalRequiredError') {
    return 'The voice assistant is not available right now. You can still chat with Nexa by text.';
  }
  if (error?.status === 429) {
    const when = formatRenewal(error.renewsAt);
    return when ? `The voice assistant has used today's call credits. They renew ${when}. You can still chat with Nexa by text.` : CREDIT_MESSAGE;
  }
  if (error?.status === 401) return 'The call session expired. Please start the call again.';
  if (error?.status === 503) return 'The voice service is busy right now. Please try again in a moment.';
  return 'Something went wrong starting the call. You can still chat with Nexa by text.';
}

// Live voice and video conversation with Nexa, powered by Nuance Live.
export default function NexaAvatarCall({ guest = null, className, onSwitchToText }) {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const conversationRef = useRef(null);
  const unsubscribersRef = useRef([]);
  const [phase, setPhase] = useState('idle');
  const [state, setState] = useState('idle');
  const [caption, setCaption] = useState('');
  const [error, setError] = useState(null);
  const [muted, setMuted] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const teardown = () => {
    unsubscribersRef.current.forEach((off) => {
      try {
        off();
      } catch (_e) {
        // A stale listener must not block the reset.
      }
    });
    unsubscribersRef.current = [];
    conversationRef.current = null;
  };

  useEffect(() => () => {
    conversationRef.current?.disconnect().catch(() => {});
    teardown();
  }, []);

  const start = async () => {
    if (conversationRef.current) return;
    setError(null);
    setCaption('');
    setMuted(false);
    setPhase('starting');
    setState('connecting');

    const conversation = createNuanceConversation({
      token: async () => {
        let res;
        try {
          res = await base44.functions.invoke('nuanceToken', { guest });
        } catch (err) {
          const friendly = refusalMessage(err?.data || err?.response?.data);
          throw Object.assign(new Error('token'), {
            friendly: friendly || 'The voice assistant could not start. You can still chat with Nexa by text.',
          });
        }
        const friendly = refusalMessage(res?.data);
        if (friendly) throw Object.assign(new Error('token'), { friendly });
        const token = res?.data?.token;
        if (!token) {
          throw Object.assign(new Error('token'), {
            friendly: res?.data?.error || 'The voice assistant could not start. You can still chat with Nexa by text.',
          });
        }
        return token;
      },
      mediaDevices: { cameraEnabled: false },
    });
    conversationRef.current = conversation;

    const detachVideo = conversation.onChange((event) => {
      switch (event.type) {
        case 'state-changed':
          setState(event.state);
          break;
        case 'tracks-changed':
          try {
            const avatar = conversation.avatar;
            if (avatar.videoTrack && videoRef.current) avatar.videoTrack.attach(videoRef.current);
            if (avatar.audioTrack && audioRef.current) avatar.audioTrack.attach(audioRef.current);
          } catch (_e) {
            // A call that is not up yet has no tracks; the next change re-reads them.
          }
          break;
        case 'speaking-changed':
          if (event.participant === 'avatar') {
            setSpeaking(event.isSpeaking);
            if (event.isSpeaking) setCaption('');
          }
          break;
        case 'avatar-presented':
          conversation
            .sendInterfaceEvent({
              type: 'response.create',
              response: { instructions: 'Greet the person warmly and ask what they need help with today.' },
            })
            .catch(() => {});
          break;
        case 'session-ended':
          setPhase('ended');
          setState('disconnected');
          teardown();
          break;
        default:
          break;
      }
    });

    const detachInterface = conversation.onInterfaceEvent((event) => {
      if (event?.type === 'session.output_transcript.delta') {
        setCaption((prev) => (prev + String(event.delta || '')).slice(-400));
      }
    });
    unsubscribersRef.current = [detachVideo, detachInterface];

    try {
      await conversation.connect();
      setPhase('live');
    } catch (err) {
      setError(describeError(err));
      setPhase('idle');
      setState('idle');
      teardown();
    }
  };

  const end = async () => {
    const conversation = conversationRef.current;
    setPhase('ended');
    setState('disconnected');
    try {
      await conversation?.disconnect();
    } catch (_e) {
      // Leaving the room already failed; the UI still resets.
    }
    teardown();
  };

  const toggleMute = async () => {
    try {
      const user = conversationRef.current?.user;
      if (!user) return;
      if (muted) await user.unmuteAudio();
      else await user.muteAudio();
      setMuted(!muted);
    } catch (_e) {
      // The call keeps running; the button simply stays as it was.
    }
  };

  const live = phase === 'live' || phase === 'starting';

  return (
    <div className={cn('overflow-hidden rounded-2xl border border-border/50 bg-card', className)}>
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-primary/20 via-primary/5 to-foreground/10">
        <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
        <audio ref={audioRef} autoPlay />

        {/* Idle cover */}
        {!live && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-primary/15 to-background/90 p-6 text-center">
            <img
              src={NEXA_PORTRAIT}
              alt="Nexa"
              className="h-24 w-24 rounded-full object-cover shadow-lg ring-4 ring-white/70 dark:ring-white/10"
            />
            <div>
              <p className="font-heading text-base font-bold text-foreground">Talk with Nexa</p>
              <p className="mx-auto mt-1 max-w-[15rem] text-xs leading-relaxed text-muted-foreground">
                A face-to-face voice conversation. She listens, speaks and answers like a person.
              </p>
            </div>
            <Button onClick={start} className="mt-1 gap-1.5 rounded-xl" disabled={phase === 'starting'}>
              {phase === 'starting' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mic className="h-4 w-4" />}
              {phase === 'ended' ? 'Start again' : 'Start talking'}
            </Button>
            <p className="text-[10px] text-muted-foreground">Microphone access is needed. Your camera stays off.</p>
          </div>
        )}

        {/* Live badges */}
        {live && (
          <>
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 backdrop-blur">
              <span className={cn('h-1.5 w-1.5 rounded-full', speaking ? 'bg-emerald-400 animate-pulse' : 'bg-white/70')} />
              <span className="text-[10px] font-semibold text-white">Nexa</span>
              <span className="text-[10px] text-white/70">· {STATE_TEXT[state] || 'Live'}</span>
            </div>
            {state !== 'connected' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/70 backdrop-blur-sm">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-xs font-semibold text-foreground">{STATE_TEXT[state] || 'Connecting'}</p>
                <p className="max-w-[13rem] text-center text-[10px] text-muted-foreground">
                  Getting Nexa ready. This can take a few seconds.
                </p>
              </div>
            )}
            {caption && (
              <div className="absolute inset-x-2 bottom-2 rounded-xl bg-black/60 px-3 py-2 backdrop-blur">
                <p className="line-clamp-3 text-[11px] leading-relaxed text-white">{caption}</p>
              </div>
            )}
          </>
        )}
      </div>

      {error && (
        <div className="space-y-2 border-t border-border/50 bg-destructive/10 px-3 py-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-destructive" />
            <p className="text-[11px] leading-relaxed text-destructive">{error}</p>
          </div>
          {onSwitchToText && (
            <Button
              size="sm"
              variant="outline"
              onClick={onSwitchToText}
              className="h-8 gap-1.5 rounded-lg px-2.5 text-xs"
            >
              <Keyboard className="h-3.5 w-3.5" /> Chat by text instead
            </Button>
          )}
        </div>
      )}

      {live && (
        <div className="flex items-center justify-between gap-2 border-t border-border/50 px-3 py-2">
          <span className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
            <Radio className="h-3 w-3 text-primary" />
            {muted ? 'Your microphone is muted' : 'Nexa can hear you'}
          </span>
          <div className="flex gap-1.5">
            <Button
              size="sm"
              variant="outline"
              onClick={toggleMute}
              className="h-8 gap-1.5 rounded-lg px-2.5 text-xs"
              aria-label={muted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {muted ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
              {muted ? 'Unmute' : 'Mute'}
            </Button>
            <Button size="sm" variant="destructive" onClick={end} className="h-8 gap-1.5 rounded-lg px-2.5 text-xs">
              <PhoneOff className="h-3.5 w-3.5" />
              End
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}