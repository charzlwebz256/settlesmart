import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Send, Loader2, AlertCircle } from 'lucide-react';
import { NEXA_PORTRAIT } from '@/data/nexaPortrait';
import { cn } from '@/lib/utils';

const OPENERS = [
  'How do I get a Social Insurance Number?',
  'What free English classes can I join?',
  'How do I find a family doctor?',
];

// Written conversation with Nexa, same knowledge and grounding as the voice call.
export default function NexaTextChat({ guest = null, profile = null, className }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, sending]);

  const send = async (text) => {
    const question = String(text || input).trim();
    if (!question || sending) return;
    setInput('');
    setError(null);
    const history = messages.slice(-8).map((m) => ({ role: m.role, content: m.content }));
    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    setSending(true);
    try {
      const res = await base44.functions.invoke('nexaChat', {
        message: question,
        history,
        profile,
        city: profile?.city || guest?.city,
        province: profile?.province || guest?.province,
        mode: 'full',
      });
      const answer = res?.data?.answer;
      if (!answer) throw new Error('No answer');
      setMessages((prev) => [...prev, { role: 'assistant', content: answer }]);
    } catch (_err) {
      setError('Nexa could not answer just now. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={cn('flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card', className)}>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && !sending && (
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <img src={NEXA_PORTRAIT} alt="Nexa" className="h-8 w-8 flex-shrink-0 rounded-full object-cover" />
              <div className="rounded-2xl rounded-tl-sm bg-secondary px-3 py-2">
                <p className="text-sm leading-relaxed text-secondary-foreground">
                  Hi, I am Nexa. Ask me anything about settling in Canada: documents, housing, health, school, work or
                  benefits.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 pl-10">
              {OPENERS.map((opener) => (
                <button
                  key={opener}
                  onClick={() => send(opener)}
                  className="rounded-full border border-border/60 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {opener}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={cn('flex items-start gap-2.5', m.role === 'user' && 'flex-row-reverse')}>
            {m.role === 'assistant' && (
              <img src={NEXA_PORTRAIT} alt="Nexa" className="h-8 w-8 flex-shrink-0 rounded-full object-cover" />
            )}
            <div
              className={cn(
                'max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed',
                m.role === 'user'
                  ? 'rounded-tr-sm bg-primary text-primary-foreground'
                  : 'rounded-tl-sm bg-secondary text-secondary-foreground'
              )}
            >
              {m.role === 'assistant' ? (
                <div className="space-y-1.5 [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_h3]:mt-2 [&_h3]:font-heading [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-foreground [&_li]:ml-4 [&_li]:list-disc [&_p]:leading-relaxed [&_strong]:font-semibold">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              ) : (
                m.content
              )}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex items-center gap-2.5">
            <img src={NEXA_PORTRAIT} alt="Nexa" className="h-8 w-8 flex-shrink-0 rounded-full object-cover" />
            <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-secondary px-3 py-2.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">Nexa is thinking</span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 rounded-xl bg-destructive/10 px-3 py-2">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-destructive" />
            <p className="text-[11px] leading-relaxed text-destructive">{error}</p>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex items-end gap-2 border-t border-border/50 p-2.5">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          rows={1}
          placeholder="Type your question"
          className="max-h-24 min-h-[38px] flex-1 resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
        />
        <Button type="submit" size="icon" className="h-9 w-9 flex-shrink-0 rounded-xl" disabled={!input.trim() || sending}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}