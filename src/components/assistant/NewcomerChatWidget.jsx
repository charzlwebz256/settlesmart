import { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Send, Loader2, Sparkles, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const QUICK_QUESTIONS = [
  "What's the nearest emergency shelter?",
  "How do I get a transit card?",
  "Where can I get free food assistance?",
  "How do I find a family doctor?",
  "What is 211 Canada?",
  "How do I call for emergency help?",
];

const SYSTEM_PROMPT = `You are a Canadian Newcomer Settlement Assistant — a warm, knowledgeable helper specializing in services for immigrants, refugees, and newcomers to Canada.

Your expertise covers:
- **Emergency contacts**: 911 (police/fire/ambulance), 211 (social services helpline), 1-800-O-Canada (government info)
- **Settlement services**: IRCC-funded agencies, newcomer centres, Catholic Social Services, ACCES Employment
- **Housing**: shelters, transitional housing, tenant rights by province, affordable housing waitlists
- **Food**: food banks, community meals, Ontario Works/Alberta Works/BC Employment Assistance
- **Healthcare**: health card registration by province, walk-in clinics, Community Health Centres
- **Transit**: Presto (Ontario), Compass (BC), Orca (Metro Vancouver), transit card setup by city
- **Language**: LINC programs, ESL classes, language assessment (CLB), IELTS/CELPIP info
- **Employment**: SIN application, job search, credential recognition (WES, ICAS), bridging programs
- **Legal**: legal aid, tenant rights, immigration lawyers, refugee claim process
- **Financial**: opening a bank account, credit building, GST/HST credits, Canada Child Benefit

IMPORTANT RULES:
- Always be warm, reassuring, and practical
- Give specific phone numbers, websites, and names where possible
- For emergencies, ALWAYS lead with 911 or 211
- Tailor advice to the user's province/city if mentioned
- Keep answers concise but actionable — use bullet points
- If you don't know something specific, refer to 211.ca or canada.ca`;

export default function NewcomerChatWidget({ userCity, userProvince }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('newcomerChatMessages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('Failed to load chat history:', e);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('newcomerChatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (open && messages.length === 0) {
      const greeting = {
        role: 'assistant',
        content: `Hi! I'm your Canadian Newcomer Assistant 🍁\n\nI can help you find **emergency contacts**, **nearby services**, **transit info**, and answers to common settlement questions${userCity ? ` for **${userCity}**` : ''}.\n\nWhat do you need help with?`,
      };
      setMessages([greeting]);
    }
  }, [open, userCity]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const sendMessage = async (text) => {
    const query = (text || input).trim();
    if (!query || loading) return;
    setInput('');
    const userMsg = { role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    const locationCtx = userCity && userProvince
      ? `The user is located in ${userCity}, ${userProvince}, Canada.`
      : userProvince
      ? `The user is located in ${userProvince}, Canada.`
      : 'The user is located in Canada (city unknown).';

    const history = [...messages, userMsg]
      .slice(-8)
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `${SYSTEM_PROMPT}\n\n${locationCtx}\n\nConversation:\n${history}\n\nRespond as the Assistant:`,
    });

    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            aria-label="Open newcomer assistant chat"
            className="fixed bottom-24 right-4 md:bottom-8 md:right-6 z-40 w-12 h-12 rounded-full bg-primary shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary/90 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-primary-foreground" />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-accent flex items-center justify-center">
              <Sparkles className="w-2 h-2 text-accent-foreground" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 w-[calc(100vw-2rem)] max-w-sm h-[520px] bg-card rounded-2xl shadow-2xl border border-border/50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-sm leading-tight">Newcomer Assistant</p>
                  <p className="text-[10px] text-white/70">Emergency • Services • Settlement</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat" className="p-1.5 rounded-lg hover:bg-white/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex gap-2", msg.role === 'user' ? "justify-end" : "justify-start")}>
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <Sparkles className="w-3 h-3 text-primary" />
                    </div>
                  )}
                  <div className={cn(
                    "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                    msg.role === 'user'
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}>
                    {msg.role === 'user' ? (
                      <p>{msg.content}</p>
                    ) : (
                      <ReactMarkdown className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_p]:my-1 [&_ul]:my-1 [&_li]:my-0.5 [&_strong]:font-semibold">
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3 h-3 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl px-3 py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick questions */}
            {messages.length <= 1 && !loading && (
              <div className="px-4 pb-2 flex gap-1.5 overflow-x-auto scrollbar-hide flex-shrink-0">
                {QUICK_QUESTIONS.map(q => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="flex-shrink-0 text-[10px] px-2.5 py-1.5 rounded-lg bg-primary/8 border border-primary/15 text-primary font-medium hover:bg-primary/15 transition-colors whitespace-nowrap"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-border/50 flex-shrink-0">
              <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask about services, emergencies, transit..."
                  className="flex-1 px-3 py-2 rounded-xl border border-border/50 bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  size="icon"
                  aria-label="Send message"
                  className="rounded-xl h-9 w-9 bg-primary hover:bg-primary/90 flex-shrink-0"
                  disabled={!input.trim() || loading}
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}