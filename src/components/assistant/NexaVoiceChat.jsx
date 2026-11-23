import { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Square, Loader2, AlertCircle, Keyboard, Volume2 } from 'lucide-react';
import { NEXA_PORTRAIT } from '@/data/nexaPortrait';
import { cn } from '@/lib/utils';

const SpeechRecognition =
  typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

const STATE_TEXT = {
  idle: 'Ready when you are',
  listening: 'Listening',
  thinking: 'Thinking',
  speaking: 'Speaking',
};

function plainText(markdown) {
  return String(markdown || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function pickVoice() {
  const voices = window.speechSynthesis?.getVoices?.() || [];
  if (!voices.length) return null;
  const english = voices.filter((voice) => String(voice.lang || '').toLowerCase().startsWith('en'));
  const preferred = ['Google US English', 'Samantha', 'Karen', 'Serena', 'Google UK English Female'];
  return (
    preferred.map((name) => english.find((voice) => voice.name.includes(name))).find(Boolean) ||
    english[0] ||
    voices[0]
  );
}

// Voice conversation with Nexa in the browser: the microphone transcribes you,
// her answer is read aloud. No external voice credits, so it works at any hour.
export default function NexaVoiceChat({ guest = null, profile = null, className, onSwitchToText }) {
  const recognitionRef = useRef(null);
  const finalTextRef = useRef('');
  const [phase, setPhase] = useState('idle');
  const [interim, setInterim] = useState('');
  const [answer, setAnswer] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [muted, setMuted] = useState(false);

  useEffect(
    () => () => {
      try {
        recognitionRef.current?.abort();
      } catch (_e) {
        // Already stopped.
      }
      window.speechSynthesis?.cancel();
    },
    []
  );

  const speak = (text) => {
    const synth = window.speechSynthesis;
    if (!synth || muted) {
      setPhase('idle');
      return;
    }
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(plainText(text).slice(0, 900));
    const voice = pickVoice();
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang || 'en-CA';
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onend = () => setPhase('idle');
    utterance.onerror = () => setPhase('idle');
    setPhase('speaking');
    synth.speak(utterance);
  };

  const ask = async (question) => {
    setPhase('thinking');
    setError(null);
    const history = messages.slice(-6).map((m) => ({ role: m.role, content: m.content }));
    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    try {
      const res = await base44.functions.invoke('nexaChat', {
        message: question,
        history,
        profile,
        city: profile?.city || guest?.city,
        province: profile?.province || guest?.province,
        mode: 'brief',
      });
      const reply = res?.data?.answer;
      if (!reply) throw new Error('empty');
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      setAnswer(reply);
      speak(reply);
    } catch (_err) {
      setError('Nexa could not answer just now. Please try again.');
      setPhase('idle');
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setPhase('idle');
  };

  const stopListening = () => {
    try {
      recognitionRef.current?.stop();
    } catch (_e) {
      setPhase('idle');
    }
  };

  const startListening = () => {
    if (phase === 'listening') {
      stopListening();
      return;
    }
    if (!SpeechRecognition) {
      setError('This browser cannot use the microphone. Try Chrome, Edge or Safari, or switch to Type.');
      return;
    }
    stopSpeaking();
    setError(null);
    setInterim('');
    setAnswer('');
    finalTextRef.current = '';

    const recognition = new SpeechRecognition();
    recognition.lang = String(navigator.language || 'en-CA').toLowerCase().startsWith('en')
      ? navigator.language
      : 'en-CA';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (result.isFinal) finalTextRef.current += result[0].transcript;
        else interimText += result[0].transcript;
      }
      setInterim(interimText || finalTextRef.current);
    };

    recognition.onerror = (event) => {
      const reason = event?.error;
      if (reason === 'no-speech' || reason === 'aborted') return;
      if (reason === 'not-allowed' || reason === 'service-not-allowed') {
        setError('Your browser blocked the microphone. Allow microphone access for this site, then try again.');
      } else if (reason === 'network') {
        setError('The microphone lost its connection. Please try again.');
      } else {
        setError('I could not hear that. Please try again.');
      }
      setPhase('idle');
    };

    recognition.onend = () => {
      const said = finalTextRef.current.trim();
      recognitionRef.current = null;
      setInterim('');
      if (said) ask(said);
      else setPhase('idle');
    };

    recognitionRef.current = recognition;
    setPhase('listening');
    try {
      recognition.start();
    } catch (_e) {
      recognitionRef.current = null;
      setPhase('idle');
      setError('The microphone could not start. Please try again.');
    }
  };

  const toggleMute = () => {
    if (!muted) stopSpeaking();
    setMuted(!muted);
  };

  const busy = phase === 'listening' || phase === 'thinking' || phase === 'speaking';
  const lastQuestion = [...messages].reverse().find((m) => m.role === 'user')?.content;

  return (
    <div className={cn('overflow-hidden rounded-2xl border border-border/50 bg-card', className)}>
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-primary/20 via-primary/5 to-foreground/10">
        <img
          src={NEXA_PORTRAIT}
          alt="Nexa"
          className={cn(
            'h-full w-full object-cover transition-transform duration-700',
            phase === 'speaking' && 'scale-105'
          )}
        />

        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <div className="flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 backdrop-blur">
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                phase === 'listening' && 'bg-emerald-400 animate-pulse',
                phase === 'speaking' && 'bg-primary animate-pulse',
                phase === 'thinking' && 'bg-amber-400 animate-pulse',
                phase === 'idle' && 'bg-white/70'
              )}
            />
            <span className="text-[10px] font-semibold text-white">Nexa</span>
            <span className="text-[10px] text-white/70">· {STATE_TEXT[phase]}</span>
          </div>
          <button
            onClick={toggleMute}
            aria-label={muted ? 'Turn her voice back on' : 'Silence her voice'}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition-colors hover:bg-black/70"
          >
            {muted ? <Volume2 className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
          </button>
        </div>

        {phase === 'thinking' && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/45 backdrop-blur-sm">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {(interim || lastQuestion || (phase === 'speaking' && answer)) && (
          <div className="absolute inset-x-2 bottom-2 rounded-xl bg-black/65 px-3 py-2 backdrop-blur">
            <p className="line-clamp-4 text-[11px] leading-relaxed text-white">
              {phase === 'listening' && (interim || 'I am listening…')}
              {phase !== 'listening' && phase === 'speaking' && plainText(answer).slice(0, 260)}
              {(phase === 'idle' || phase === 'thinking') && lastQuestion}
            </p>
          </div>
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

      <div className="flex items-center justify-between gap-2 border-t border-border/50 px-3 py-2">
        <span className="text-[10px] font-medium text-muted-foreground">
          {muted ? 'Her voice is silenced' : 'Speak naturally, then pause'}
        </span>
        <div className="flex gap-1.5">
          {phase === 'speaking' ? (
            <Button size="sm" variant="outline" onClick={stopSpeaking} className="h-8 gap-1.5 rounded-lg px-2.5 text-xs">
              <Square className="h-3.5 w-3.5" /> Stop
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={startListening}
              disabled={phase === 'thinking'}
              className="h-8 gap-1.5 rounded-lg px-3 text-xs"
            >
              {phase === 'listening' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Mic className="h-3.5 w-3.5" />}
              {phase === 'listening' ? 'Listening…' : busy ? 'Wait' : lastQuestion ? 'Ask again' : 'Start talking'}
            </Button>
          )}
        </div>
      </div>

      {answer && (
        <div className="max-h-40 overflow-y-auto border-t border-border/50 px-3 py-2">
          <p className="whitespace-pre-line text-[11px] leading-relaxed text-muted-foreground">{plainText(answer)}</p>
        </div>
      )}
    </div>
  );
}