import { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Send, Sparkles, Loader2, MapPin, User, ChevronRight, Pencil } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import TypewriterContent from '@/components/assistant/TypewriterContent';
import NexaQuickStart from '@/components/assistant/NexaQuickStart';
import StartingPoints from '@/components/assistant/StartingPoints';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/AuthContext';
import { useLocation_ } from '@/lib/LocationContext';

const suggestedQuestions = [
  "How do I get a SIN number?",
  "What free English classes are available?",
  "How do I find affordable housing?",
  "What health services can I access for free?",
  "How do I get my credentials assessed?",
  "What are my rights as a tenant?",
];

const STATUS_LABELS = {
  permanent_resident: 'Permanent resident',
  refugee: 'Refugee',
  international_student: 'International student',
  temporary_worker: 'Temporary worker',
  asylum_seeker: 'Asylum seeker',
  citizen: 'Citizen',
  other: 'Newcomer',
};

export default function Assistant() {
  const { isAuthenticated, user } = useAuth();
  const { city: detectedCity, province: detectedProvince } = useLocation_();
  const [guest, setGuest] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const { data: profile } = useQuery({
    queryKey: ['myProfile'],
    enabled: isAuthenticated,
    queryFn: async () => {
      const me = await base44.auth.me();
      const results = await base44.entities.UserProfile.filter({ created_by_id: me.id });
      return results[0] || null;
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const ask = async (text, history, activeProfile) => {
    setLoading(true);
    const { data } = await base44.functions.invoke('nexaChat', {
      message: text,
      history: history.slice(-6),
      profile: activeProfile,
      city: activeProfile?.city || detectedCity,
      province: activeProfile?.province || detectedProvince,
      mode: 'full',
    });
    setMessages(prev => [...prev, { role: 'assistant', content: data?.answer || '', typing: true }]);
    setLoading(false);
  };

  const sendMessage = (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: 'user', content: text };
    const activeProfile = isAuthenticated
      ? profile
      : guest
        ? { province: guest.province, city: guest.city, immigration_status: guest.role, interests: [guest.goal] }
        : null;
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    ask(text, messages, activeProfile);
  };

  // Guest answers three questions, then Nexa opens with a plan for them
  const handleQuickStart = (answers) => {
    setGuest(answers);
    const context = {
      province: answers.province,
      city: answers.city,
      immigration_status: answers.role,
      interests: [answers.goal],
    };
    setMessages([{
      role: 'user',
      content: `I'm a ${answers.roleLabel.toLowerCase()} in ${answers.city}, ${answers.province}. My priority: ${answers.goalLabel.toLowerCase()}.`,
    }]);
    ask(
      `I am a ${answers.roleLabel} living in ${answers.city}, ${answers.province}, Canada. My top priority right now is ${answers.goalLabel}. Where should I start on SettleSmart? Give me a short numbered starting plan for my first steps, and name the pages of this app I should open.`,
      [],
      context
    );
  };

  const resetGuest = () => {
    setGuest(null);
    setMessages([]);
  };

  const place = [profile?.city || (isAuthenticated ? detectedCity : guest?.city), profile?.province || (isAuthenticated ? detectedProvince : guest?.province)]
    .filter(Boolean)
    .join(', ');
  const statusLabel = profile?.immigration_status ? STATUS_LABELS[profile.immigration_status] : null;
  const firstName = (user?.full_name || '').trim().split(' ')[0];

  // Signed-out visitors start with the three questions, not a blank chat
  if (!isAuthenticated && !guest) {
    return <NexaQuickStart defaultProvince={detectedProvince} defaultCity={detectedCity} onComplete={handleQuickStart} />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="font-heading font-bold text-lg leading-tight">Nexa</h1>
              <p className="text-xs text-muted-foreground truncate">Your AI settlement guide for Canada</p>
            </div>
          </div>

          {isAuthenticated ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl border border-border/50 bg-card hover:border-primary/30 transition-colors flex-shrink-0"
            >
              <span className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                {(firstName || 'U').charAt(0).toUpperCase()}
              </span>
              <span className="hidden sm:block text-left leading-tight">
                <span className="block text-xs font-semibold max-w-[120px] truncate">{user?.full_name || 'My account'}</span>
                <span className="block text-[10px] text-muted-foreground">View profile</span>
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          ) : (
            <button onClick={resetGuest} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex-shrink-0">
              <Pencil className="w-3.5 h-3.5" /> Change answers
            </button>
          )}
        </div>

        {/* Who Nexa is talking to */}
        <div className="flex items-center gap-2 mt-2 text-[11px] text-muted-foreground flex-wrap">
          <MapPin className="w-3.5 h-3.5 text-primary" />
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-10">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-heading font-bold text-xl mb-2">
              {firstName ? `Welcome back, ${firstName}` : 'How can I help you today?'}
            </h2>
            <p className="text-muted-foreground text-sm mb-8 max-w-md mx-auto">
              I can see {place ? `you're in ${place}` : 'your profile'} and answer with settlement advice for your situation.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto">
              {suggestedQuestions.map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-left p-3 rounded-xl bg-card border border-border/50 hover:border-primary/30 text-sm text-muted-foreground hover:text-foreground transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex gap-3", msg.role === 'user' ? "justify-end" : "justify-start")}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                </div>
              )}
              <div className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3",
                msg.role === 'user'
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border/50"
              )}>
                {msg.role === 'user' ? (
                  <p className="text-sm">{msg.content}</p>
                ) : msg.typing ? (
                  <TypewriterContent
                    content={msg.content}
                    className="text-sm prose prose-sm prose-slate dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                    onDone={() => setMessages(prev => prev.map((m, idx) => idx === i ? { ...m, typing: false } : m))}
                    onTick={() => bottomRef.current?.scrollIntoView({ block: 'end' })}
                  />
                ) : (
                  <ReactMarkdown className="text-sm prose prose-sm prose-slate dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                    {msg.content}
                  </ReactMarkdown>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="bg-card border border-border/50 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Thinking...
              </div>
            </div>
          </div>
        )}

        {guest && !loading && messages.some(m => m.role === 'assistant' && !m.typing) && (
          <StartingPoints goal={guest.goal} province={guest.province} />
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/50 bg-card/50 backdrop-blur-xl pb-24 md:pb-4">
        <form
          onSubmit={e => { e.preventDefault(); sendMessage(input); }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about housing, jobs, education, healthcare..."
            className="flex-1 px-4 py-3 rounded-xl border border-border/50 bg-card text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
            disabled={loading}
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-xl h-12 w-12 bg-primary hover:bg-primary/90"
            disabled={!input.trim() || loading}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}