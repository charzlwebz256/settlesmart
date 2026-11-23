import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { AlertCircle, Mic, Pause, PhoneOff, Play } from 'lucide-react';
import { NEXA_PORTRAIT } from '@/data/nexaPortrait';
import { pauseNexaVoice, playNexaVoice, resumeNexaVoice, stopNexaVoice } from '@/lib/nexaVoice';
import { HeartbeatDot } from '@/components/nexa/Heartbeat';
import { cn } from '@/lib/utils';

const STATUS_TEXT = {
  listening: 'Listening',
  speaking: 'Nexa is speaking',
  paused: 'Paused',
};

const SILENCE_MS = 30000;

const TIP_PROMPT =
  'The person has been quiet for a while. Do not repeat anything you already said. Open the conversation again with one short, practical SettleSmart tip about settling in Canada, in one or two spoken sentences, and name the SettleSmart page that helps if it fits.';

// Hands-free voice conversation: speak straight to Nexa, she answers out loud.
export default function NexaVoiceChat({ guest = null, profile = null, className }) {
  const { pathname } = useLocation();
  const historyRef = useRef([]);
  const [status, setStatus] = useState('idle');
  const [youSpeaking, setYouSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const [paused, setPaused] = useState(false);
  const activeRef = useRef(false);
  const speakingRef = useRef(false);
  const pausedRef = useRef(false);
  const recognitionRef = useRef(null);
  const idleTimerRef = useRef(null);
  const supported = typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  const clearIdle = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = null;
  };

  const stop = () => {
    activeRef.current = false;
    speakingRef.current = false;
    pausedRef.current = false;
    setPaused(false);
    clearIdle();
    try {
      recognitionRef.current?.abort();
    } catch (_e) {
      // Already stopped.
    }
    stopNexaVoice();
    setYouSpeaking(false);
    setStatus('idle');
  };

  useEffect(() => stop, []);

  const ask = async (question) => {
    clearIdle();
    setError(null);
    // A new question drops whatever she had paused and answers from here.
    if (pausedRef.current) {
      pausedRef.current = false;
      setPaused(false);
      stopNexaVoice();
    }
    const history = historyRef.current.slice(-6);
    try {
      const res = await base44.functions.invoke('nexaChat', {
        message: question,
        history,
        profile,
        city: profile?.city || guest?.city,
        province: profile?.province || guest?.province,
        pageContext: `SettleSmart page: ${pathname}`,
        mode: 'voice',
      });
      const answer = res?.data?.answer;
      if (!answer) throw new Error('No answer');
      const turn = question === TIP_PROMPT
        ? [{ role: 'assistant', content: answer }]
        : [{ role: 'user', content: question }, { role: 'assistant', content: answer }];
      historyRef.current = [...historyRef.current, ...turn].slice(-12);
      speakReply(answer);
    } catch (_err) {
      activeRef.current = false;
      setStatus('idle');
      setError('Nexa could not answer just now. Check your connection and try again.');
    }
  };

  const offerTip = () => {
    if (!activeRef.current || speakingRef.current || pausedRef.current) return;
    ask(TIP_PROMPT);
  };

  // Pause holds Nexa mid-sentence but keeps the microphone open, so speaking
  // again starts a new question instead of waiting for her.
  const pause = () => {
    pausedRef.current = true;
    setPaused(true);
    clearIdle();
    pauseNexaVoice();
    listenForUser();
    setStatus('paused');
  };

  const resume = () => {
    pausedRef.current = false;
    setPaused(false);
    if (speakingRef.current) {
      resumeNexaVoice();
      setStatus('speaking');
      return;
    }
    setStatus('listening');
    armIdle();
    listenForUser();
  };

  // After a quiet stretch Nexa picks the conversation back up with an advice.
  const armIdle = () => {
    clearIdle();
    idleTimerRef.current = setTimeout(offerTip, SILENCE_MS);
  };

  function listenForUser() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition || !activeRef.current) return;
    try {
      recognitionRef.current?.abort();
    } catch (_e) {
      // Starting a fresh turn anyway.
    }
    const recognition = new Recognition();
    recognition.lang = 'en-CA';
    recognition.continuous = false;
    recognition.interimResults = true;
    let said = '';

    recognition.onresult = (event) => {
      let heard = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (result.isFinal) said += result[0].transcript;
        heard += result[0].transcript;
      }
      if (!heard.trim()) return;
      setYouSpeaking(true);
      clearIdle();
    };
    recognition.onspeechend = () => setYouSpeaking(false);
    recognition.onerror = (event) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      activeRef.current = false;
      setStatus('idle');
      setYouSpeaking(false);
      setError('Your browser could not use the microphone. Allow microphone access for this site, then try again.');
    };
    recognition.onend = () => {
      setYouSpeaking(false);
      if (!activeRef.current) return;
      const question = said.trim();
      if (question) {
        ask(question);
        return;
      }
      listenForUser();
    };

    recognitionRef.current = recognition;
    if (!speakingRef.current) setStatus('listening');
    try {
      recognition.start();
    } catch (_e) {
      // The next turn restarts it.
    }
  }

  function speakReply(text) {
    speakingRef.current = true;
    setStatus('speaking');
    playNexaVoice(text, {
      onEnd: () => {
        speakingRef.current = false;
        if (pausedRef.current) {
          setStatus('paused');
          return;
        }
        if (!activeRef.current) {
          setStatus('idle');
          return;
        }
        setStatus('listening');
        armIdle();
        // She always finishes her answer, then listens again.
        listenForUser();
      },
    });
  }

  const start = () => {
    if (!supported) return;
    activeRef.current = true;
    setError(null);
    armIdle();
    listenForUser();
  };

  const live = status !== 'idle';
  const talking = status === 'speaking' || youSpeaking;

  return (
    <div className={cn('overflow-hidden rounded-2xl border border-border/50 bg-card', className)}>
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-foreground/90">
        <img
          src={NEXA_PORTRAIT}
          alt="Nexa"
          className={cn(
            'absolute inset-0 h-full w-full object-cover',
            status === 'speaking' && 'heartbeat-image'
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/25" />

        {live && (
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 backdrop-blur">
            <HeartbeatDot
              active={talking}
              tone={youSpeaking ? 'you' : 'nexa'}
              className="h-3 w-3"
            >
              <span className={cn('h-1.5 w-1.5 rounded-full', youSpeaking ? 'bg-accent' : 'bg-emerald-400')} />
            </HeartbeatDot>
            <span className="text-[10px] font-semibold text-white">
              {youSpeaking ? 'You' : STATUS_TEXT[status] || 'Live'}
            </span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 space-y-2 p-4 text-center">
          {!live ? (
            <div className="space-y-2">
              <p className="font-heading text-base font-bold text-white">Talk with Nexa by voice</p>
              <p className="mx-auto max-w-[17rem] text-xs leading-relaxed text-white/80">
                Just speak. She hears you and answers out loud, then listens again when she is finished.
              </p>
              <Button onClick={start} className="mt-1 gap-1.5 rounded-xl" disabled={!supported}>
                <Mic className="h-4 w-4" />
                Start voice chat
              </Button>
              <p className="text-[10px] text-white/70">
                {supported
                  ? 'Microphone access is needed. Your camera stays off.'
                  : 'This browser cannot use the microphone. Try Chrome, Edge or Safari.'}
              </p>
            </div>
          ) : (
            <p className="text-[11px] font-medium text-white/85">
              {status === 'speaking'
                ? 'Nexa is answering, she will listen again in a moment.'
                : status === 'paused'
                  ? 'Paused, but still listening. Speak to start a new question.'
                  : 'Go ahead, I am listening.'}
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 border-t border-border/50 bg-destructive/10 px-3 py-2">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-destructive" />
          <p className="text-[11px] leading-relaxed text-destructive">{error}</p>
        </div>
      )}

      {live && (
        <div className="flex items-center justify-between gap-2 border-t border-border/50 px-3 py-2">
          <span className="text-[10px] font-medium text-muted-foreground">
            {status === 'paused'
              ? 'Paused, still listening to you'
              : status === 'listening'
                ? 'Your microphone is on'
                : 'Hands-free, just speak'}
          </span>
          <div className="flex gap-1.5">
            <Button
              size="sm"
              variant="outline"
              onClick={paused ? resume : pause}
              className="h-8 gap-1.5 rounded-lg px-2.5 text-xs"
            >
              {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
              {paused ? 'Resume' : 'Pause'}
            </Button>
            <Button size="sm" variant="destructive" onClick={stop} className="h-8 gap-1.5 rounded-lg px-2.5 text-xs">
              <PhoneOff className="h-3.5 w-3.5" />
              End
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}