import { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, Mic, PhoneOff, Volume2 } from 'lucide-react';
import { NEXA_PORTRAIT } from '@/data/nexaPortrait';
import { playNexaVoice, stopNexaVoice } from '@/lib/nexaVoice';
import { playBell } from '@/lib/bellChime';
import VoiceRings from '@/components/nexa/VoiceRings';
import { cn } from '@/lib/utils';

const STATUS_TEXT = {
  listening: 'Listening',
  thinking: 'Thinking',
  speaking: 'Nexa is speaking',
};

// Hands-free voice conversation: speak straight to Nexa, she answers out loud.
export default function NexaVoiceChat({ guest = null, profile = null, className }) {
  const [status, setStatus] = useState('idle');
  const [reply, setReply] = useState('');
  const [error, setError] = useState(null);
  const activeRef = useRef(false);
  const recognitionRef = useRef(null);
  const supported = typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  const stop = () => {
    activeRef.current = false;
    try {
      recognitionRef.current?.abort();
    } catch (_e) {
      // Already stopped.
    }
    stopNexaVoice();
    setStatus('idle');
  };

  useEffect(() => stop, []);

  const speakReply = (text) => {
    setStatus('speaking');
    playNexaVoice(text, {
      onEnd: () => {
        if (activeRef.current) startListening();
        else setStatus('idle');
      },
    });
  };

  const ask = async (question) => {
    setStatus('thinking');
    setError(null);
    try {
      const res = await base44.functions.invoke('nexaChat', {
        message: question,
        history: [],
        profile,
        city: profile?.city || guest?.city,
        province: profile?.province || guest?.province,
        pageContext: 'Ask Nexa',
        mode: 'voice',
      });
      const answer = res?.data?.answer;
      if (!answer) throw new Error('No answer');
      setReply(answer);
      speakReply(answer);
    } catch (_err) {
      activeRef.current = false;
      setStatus('idle');
      setError('Nexa could not answer just now. Check your connection and try again.');
    }
  };

  const startListening = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition || !activeRef.current) return;
    const recognition = new Recognition();
    recognition.lang = 'en-CA';
    recognition.continuous = false;
    recognition.interimResults = false;
    let said = '';
    let chimed = false;

    recognition.onresult = (event) => {
      if (!chimed && (event.results[event.resultIndex]?.[0]?.transcript || '').trim()) {
        chimed = true;
        playBell();
      }
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        if (event.results[i].isFinal) said += event.results[i][0].transcript;
      }
    };
    recognition.onerror = (event) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      activeRef.current = false;
      setStatus('idle');
      setError('Your browser could not use the microphone. Allow microphone access for this site, then try again.');
    };
    recognition.onend = () => {
      if (!activeRef.current) return;
      const question = said.trim();
      if (!question) {
        startListening();
        return;
      }
      ask(question);
    };

    recognitionRef.current = recognition;
    setStatus('listening');
    try {
      recognition.start();
    } catch (_e) {
      // The loop restarts on the next silence.
    }
  };

  const start = () => {
    if (!supported) return;
    activeRef.current = true;
    setReply('');
    setError(null);
    startListening();
  };

  const live = status !== 'idle';

  return (
    <div className={cn('overflow-hidden rounded-2xl border border-border/50 bg-card', className)}>
      <div className="relative flex aspect-[4/5] w-full flex-col items-center justify-center gap-3 overflow-hidden bg-gradient-to-b from-primary/20 via-primary/5 to-foreground/10 p-6 text-center">
        <VoiceRings nexa={status === 'speaking'} you={status === 'listening'} className="h-28 w-28">
          <img
            src={NEXA_PORTRAIT}
            alt="Nexa"
            className="h-28 w-28 rounded-full object-cover shadow-lg ring-4 ring-white/70 dark:ring-white/10"
          />
        </VoiceRings>

        {!live ? (
          <>
            <div>
              <p className="font-heading text-base font-bold text-foreground">Talk with Nexa by voice</p>
              <p className="mx-auto mt-1 max-w-[16rem] text-xs leading-relaxed text-muted-foreground">
                Just speak. She hears you and answers out loud, nothing is typed. Her portrait stays in view.
              </p>
            </div>
            <Button onClick={start} className="mt-1 gap-1.5 rounded-xl" disabled={!supported}>
              <Mic className="h-4 w-4" />
              Start voice chat
            </Button>
            <p className="text-[10px] text-muted-foreground">
              {supported
                ? 'Microphone access is needed. Your camera stays off.'
                : 'This browser cannot use the microphone. Try Chrome, Edge or Safari.'}
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 backdrop-blur">
              {status === 'thinking' ? (
                <Loader2 className="h-3 w-3 animate-spin text-white" />
              ) : status === 'speaking' ? (
                <Volume2 className="h-3 w-3 text-white" />
              ) : (
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              )}
              <span className="text-[10px] font-semibold text-white">{STATUS_TEXT[status] || 'Live'}</span>
            </div>
            <p className="max-w-[16rem] text-[11px] leading-relaxed text-foreground/80">
              {status === 'listening' ? 'Go ahead, I am listening.' : 'Speak again whenever you are ready.'}
            </p>
          </>
        )}

        {reply && (
          <div className="absolute inset-x-2 bottom-2 rounded-xl bg-black/60 px-3 py-2 backdrop-blur">
            <p className="line-clamp-4 text-left text-[11px] leading-relaxed text-white">{reply}</p>
          </div>
        )}
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
            {status === 'listening' ? 'Your microphone is on' : 'Hands-free, just speak'}
          </span>
          <Button size="sm" variant="destructive" onClick={stop} className="h-8 gap-1.5 rounded-lg px-2.5 text-xs">
            <PhoneOff className="h-3.5 w-3.5" />
            End
          </Button>
        </div>
      )}
    </div>
  );
}