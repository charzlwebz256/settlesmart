import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, Mic, PhoneOff } from 'lucide-react';
import { NEXA_PORTRAIT } from '@/data/nexaPortrait';
import { playNexaVoice, stopNexaVoice } from '@/lib/nexaVoice';
import VoiceRings from '@/components/nexa/VoiceRings';
import TalkingBars from '@/components/nexa/TalkingBars';
import { cn } from '@/lib/utils';

const STATUS_TEXT = {
  listening: 'Listening',
  thinking: 'Thinking',
  speaking: 'Nexa is speaking',
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
  const activeRef = useRef(false);
  const speakingRef = useRef(false);
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
    setStatus('thinking');
    setError(null);
    const history = historyRef.current.slice(-10);
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
    if (!activeRef.current || speakingRef.current) return;
    ask(TIP_PROMPT);
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
        if (event.results[i].isFinal) said += event.results[i][0].transcript;
        heard += event.results[i][0].transcript;
      }
      if (heard.trim()) {
        setYouSpeaking(true);
        clearIdle();
        // Cut her off the moment the visitor starts speaking.
        if (speakingRef.current) {
          stopNexaVoice();
          speakingRef.current = false;
          setStatus('listening');
        }
      }
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
        // Speaking over Nexa stops her and takes the turn.
        stopNexaVoice();
        speakingRef.current = false;
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
        if (!activeRef.current) {
          setStatus('idle');
          return;
        }
        setStatus('listening');
        armIdle();
      },
    });
    // The microphone stays open, so the visitor can cut in at any moment.
    listenForUser();
  }

  const start = () => {
    if (!supported) return;
    activeRef.current = true;
    setError(null);
    armIdle();
    listenForUser();
  };

  const live = status !== 'idle';

  return (
    <div className={cn('overflow-hidden rounded-2xl border border-border/50 bg-card', className)}>
      <div className="relative flex aspect-[4/5] w-full flex-col items-center justify-center gap-3 overflow-hidden bg-gradient-to-b from-primary/20 via-primary/5 to-foreground/10 p-6 text-center">
        <VoiceRings nexa={status === 'speaking'} you={youSpeaking} className="h-28 w-28">
          <img
            src={NEXA_PORTRAIT}
            alt="Nexa"
            className={cn(
              'h-28 w-28 rounded-full object-cover shadow-lg ring-4 ring-white/70 dark:ring-white/10',
              status === 'speaking' && 'nexa-talking'
            )}
          />
        </VoiceRings>

        {!live ? (
          <>
            <div>
              <p className="font-heading text-base font-bold text-foreground">Talk with Nexa by voice</p>
              <p className="mx-auto mt-1 max-w-[16rem] text-xs leading-relaxed text-muted-foreground">
                Just speak. She hears you and answers out loud. Talk over her whenever you want to cut in.
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
              ) : (
                <TalkingBars active={status === 'speaking' || youSpeaking} tone={youSpeaking ? 'you' : 'nexa'} className="h-3" />
              )}
              <span className="text-[10px] font-semibold text-white">{STATUS_TEXT[status] || 'Live'}</span>
            </div>
            <p className="max-w-[16rem] text-[11px] leading-relaxed text-foreground/80">
              {status === 'speaking'
                ? 'Speak whenever you like, she will stop and listen.'
                : 'Go ahead, I am listening.'}
            </p>
          </>
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