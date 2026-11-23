import { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader2, AlertCircle, Keyboard } from 'lucide-react';
import NexaPresence from '@/components/assistant/NexaPresence';
import { cn } from '@/lib/utils';

const SpeechRecognition =
  typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

// Voices that sound like a person rather than a machine, best first.
const VOICE_NAMES = [
  'Natural',
  'Neural',
  'Google US English',
  'Google UK English Female',
  'Ava',
  'Allison',
  'Samantha',
  'Aria',
  'Jenny',
  'Michelle',
  'Karen',
  'Serena',
  'Moira',
  'Tessa',
  'Zira',
];

function plainText(markdown) {
  return String(markdown || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function toSentences(text) {
  const clean = plainText(text);
  const parts = clean.match(/[^.!?]+[.!?]*/g) || [clean];
  return parts.map((part) => part.trim()).filter(Boolean).slice(0, 6);
}

function pickVoice() {
  const voices = window.speechSynthesis?.getVoices?.() || [];
  if (!voices.length) return null;
  const english = voices.filter((voice) => String(voice.lang || '').toLowerCase().startsWith('en'));
  if (!english.length) return voices[0];

  const scored = english.map((voice) => {
    const name = String(voice.name || '');
    let score = 0;
    if (voice.lang === 'en-CA') score += 12;
    else if (voice.lang === 'en-US') score += 8;
    else if (voice.lang === 'en-GB') score += 6;
    VOICE_NAMES.forEach((keyword, index) => {
      if (name.includes(keyword)) score += VOICE_NAMES.length - index;
    });
    if (/compact/i.test(name)) score -= 20;
    if (voice.localService) score -= 2;
    return { voice, score };
  });

  return scored.sort((a, b) => b.score - a.score)[0].voice;
}

// Voice conversation with Nexa in the browser: your microphone, her spoken answer.
export default function NexaVoiceChat({ guest = null, profile = null, className, onSwitchToText }) {
  const recognitionRef = useRef(null);
  const finalTextRef = useRef('');
  const mutedRef = useRef(false);
  const [phase, setPhase] = useState('idle');
  const [interim, setInterim] = useState('');
  const [answer, setAnswer] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

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
    if (!synth || mutedRef.current) {
      setPhase('idle');
      return;
    }
    synth.cancel();
    const voice = pickVoice();
    const parts = toSentences(text);
    setPhase('speaking');
    parts.forEach((part, index) => {
      const utterance = new SpeechSynthesisUtterance(part);
      if (voice) utterance.voice = voice;
      utterance.lang = voice?.lang || 'en-CA';
      // A hair under normal speed with a little lift reads warmer and less clipped.
      utterance.rate = index === 0 ? 1.02 : 1;
      utterance.pitch = 1.05;
      if (index === parts.length - 1) {
        utterance.onend = () => setPhase('idle');
      }
      utterance.onerror = () => setPhase('idle');
      synth.speak(utterance);
    });
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

  const lastQuestion = [...messages].reverse().find((m) => m.role === 'user')?.content;
  const caption =
    phase === 'listening'
      ? interim || 'I am listening…'
      : phase === 'speaking'
        ? plainText(answer).slice(0, 220)
        : lastQuestion || '';

  return (
    <div className={cn('overflow-hidden rounded-2xl border border-border/50 bg-card', className)}>
      <NexaPresence phase={phase} caption={caption} muted={muted} onToggleMute={toggleMute} />

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
              {phase === 'listening' ? 'Listening…' : lastQuestion ? 'Ask again' : 'Start talking'}
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