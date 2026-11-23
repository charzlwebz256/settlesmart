import { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { createNuanceConversation } from '@nuancelabs/js-sdk';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, PhoneOff, Loader2, AlertCircle, Radio, Keyboard } from 'lucide-react';
import { NEXA_PORTRAIT } from '@/data/nexaPortrait';
import VoiceRings from '@/components/nexa/VoiceRings';
import { cn } from '@/lib/utils';

const STATE_TEXT = {
  idle: 'Ready when you are',
  queued: 'Waiting for a free spot',
  connecting: 'Connecting',
  connected: 'Live',
  disconnected: 'Call ended',
  failed: 'Could not connect',
};

function describeError(error) {
  if (!error) return null;
  if (error?.code === 'credits_spent' || error?.status === 429) {
    return 'Nexa has used all of her voice minutes for today. They renew at 00:00 UTC. You can still chat with her by text.';
  }
  const name = String(error?.name || '');
  const reason = String(error?.reason || '');
  if (name === 'MediaAccessError' || reason === 'permission-denied' || name === 'NotAllowedError') {
    return 'Your browser blocked the microphone. Allow microphone access for this site, then try again.';
  }
  if (reason === 'device-not-found' || reason === 'device-in-use' || name === 'NotFoundError') {
    return 'No microphone is available right now. Check your device and try again.';
  }
  if (name === 'ActiveSessionError') {
    return 'A call is already open in another tab. Close it, then start again.';
  }
  if (name === 'WebRTCUnavailableError') {
    return 'This browser cannot place a live call. Try Chrome, Edge or Safari, or use the text chat.';
  }
  return 'Nexa could not start a voice call just now. Please try again in a moment, or use the text chat.';
}

// Live voice and video conversation with Nexa, powered by Nuance Live.
export default function NexaAvatarCall({ guest = null, className, onUseChat }) {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const conversationRef = useRef(null);
  const unsubscribersRef = useRef([]);
  const [phase, setPhase] = useState('idle');
  const [state, setState] = useState('idle');
  const [error, setError] = useState(null);
  const [creditsOut, setCreditsOut] = useState(false);
  const [muted, setMuted] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [youSpeaking, setYouSpeaking] = useState(false);

  const quietTimerRef = useRef(null);

  const clearQuiet = () => {
    if (quietTimerRef.current) clearTimeout(quietTimerRef.current);
    quietTimerRef.current = null;
  };

  // After a long silence Nexa starts the conversation again with an advice.
  const resetQuiet = () => {
    clearQuiet();
    quietTimerRef.current = setTimeout(() => {
      const conversation = conversationRef.current;
      if (!conversation) return;
      conversation
        .sendInterfaceEvent({
          type: 'response.create',
          response: {
            instructions:
              'The conversation has gone quiet. Do not repeat what you already said. Gently start it again with one short, practical SettleSmart tip about settling in Canada, and name the SettleSmart page that helps if it fits.',
          },
        })
        .catch(() => {});
      resetQuiet();
    }, 30000);
  };

  const teardown = () => {
    clearQuiet();
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
    setCreditsOut(false);
    setMuted(false);
    setPhase('starting');
    setState('connecting');

    const conversation = createNuanceConversation({
      token: async () => {
        try {
          const res = await base44.functions.invoke('nuanceToken', { guest });
          const token = res?.data?.token;
          if (!token) throw new Error(res?.data?.error || 'Nexa could not start a call');
          return token;
        } catch (err) {
          const data = err?.response?.data || {};
          const wrapped = new Error(data.error || 'Nexa could not start a call');
          wrapped.code = data.code;
          wrapped.status = err?.response?.status;
          wrapped.renewsAt = data.renews_at;
          throw wrapped;
        }
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
          if (conversation.avatar.videoTrack && videoRef.current) {
            conversation.avatar.videoTrack.attach(videoRef.current);
          }
          if (conversation.avatar.audioTrack && audioRef.current) {
            conversation.avatar.audioTrack.attach(audioRef.current);
          }
          break;
        case 'speaking-changed':
          if (event.participant === 'avatar') setSpeaking(event.isSpeaking);
          if (event.participant === 'user') setYouSpeaking(event.isSpeaking);
          resetQuiet();
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

    unsubscribersRef.current = [detachVideo];
    resetQuiet();

    try {
      await conversation.connect();
      setPhase('live');
    } catch (err) {
      const spent = err?.code === 'credits_spent' || err?.status === 429;
      setCreditsOut(spent);
      setError(spent ? null : describeError(err));
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
    const user = conversationRef.current?.user;
    if (!user) return;
    try {
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
              <VoiceRings nexa={speaking} className="h-2.5 w-2.5">
                <span className={cn('h-1.5 w-1.5 rounded-full', speaking ? 'bg-emerald-400' : 'bg-white/70')} />
              </VoiceRings>
              <span className="text-[10px] font-semibold text-white">Nexa</span>
              <span className="text-[10px] text-white/70">· {STATE_TEXT[state] || 'Live'}</span>
            </div>
            <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 backdrop-blur">
              <VoiceRings you={youSpeaking} className="h-2.5 w-2.5">
                <span className={cn('h-1.5 w-1.5 rounded-full', youSpeaking ? 'bg-accent' : 'bg-white/70')} />
              </VoiceRings>
              <span className="text-[10px] font-semibold text-white">You</span>
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
          </>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 border-t border-border/50 bg-destructive/10 px-3 py-2">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-destructive" />
          <p className="text-[11px] leading-relaxed text-destructive">{error}</p>
        </div>
      )}

      {creditsOut && (
        <div className="space-y-2 border-t border-border/50 bg-accent/10 px-3 py-3">
          <p className="flex items-start gap-2 text-[11px] font-medium leading-relaxed text-foreground">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-accent" />
            Nexa's live video minutes are used up for today. They renew at 00:00 UTC. She can still help you right now
            in the voice chat, hands-free, or by text.
          </p>
          <div className="flex flex-wrap gap-1.5">
            <Button
              size="sm"
              onClick={() => onUseChat?.(false)}
              className="h-8 gap-1.5 rounded-lg px-2.5 text-xs"
            >
              <Keyboard className="h-3.5 w-3.5" />
              Chat by text
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUseChat?.(true)}
              className="h-8 gap-1.5 rounded-lg px-2.5 text-xs"
            >
              <Mic className="h-3.5 w-3.5" />
              Talk by voice
            </Button>
          </div>
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