import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Loader2, Send, BotMessageSquare, Plus, Trash2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

const QUICK_PROMPTS = [
  'Review all my job applications and give me feedback',
  'Which applications should I follow up on?',
  'Help me improve my notes for my best application',
  'What are my chances based on current statuses?',
  'Give me interview tips for my current applications',
];

function FunctionDisplay({ toolCall }) {
  const [expanded, setExpanded] = useState(false);
  const dp = toolCall.display_projection || {};
  const isFailed = ['failed', 'error'].includes(toolCall.status) ||
    /error|failed/i.test(String(toolCall.results));
  const isPending = ['pending', 'running', 'in_progress'].includes(toolCall.status);

  const label = dp.hide_details && dp.details_redacted
    ? (isPending ? dp.active_label : isFailed ? dp.error_label : dp.label)
    : toolCall.name?.replace(/_/g, ' ');

  if (dp.hide_details && dp.details_redacted) {
    return (
      <div className={cn('mt-2 text-[11px] px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5',
        isFailed ? 'bg-red-500/10 text-red-600' : isPending ? 'bg-primary/10 text-primary' : 'bg-emerald-500/10 text-emerald-700')}>
        {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
        {label}
      </div>
    );
  }

  let parsed;
  try { parsed = JSON.parse(toolCall.results); } catch { parsed = toolCall.results; }

  return (
    <div className="mt-2 text-[11px] border border-border/40 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className={cn('w-full flex items-center gap-1.5 px-3 py-1.5 text-left',
          isFailed ? 'bg-red-500/10 text-red-600' : isPending ? 'bg-primary/10 text-primary' : 'bg-muted/50 text-muted-foreground')}
      >
        {isPending && <Loader2 className="w-3 h-3 animate-spin flex-shrink-0" />}
        <span className="font-medium truncate capitalize">{label}</span>
        <span className="ml-auto opacity-60">{expanded ? '▲' : '▼'}</span>
      </button>
      {expanded && (
        <div className="px-3 py-2 bg-muted/20 space-y-1.5 text-[10px] font-mono max-h-40 overflow-y-auto">
          {toolCall.arguments_string && (
            <div><span className="font-semibold text-muted-foreground">Params: </span>
              <pre className="whitespace-pre-wrap break-all">{toolCall.arguments_string}</pre></div>
          )}
          {parsed && (
            <div><span className="font-semibold text-muted-foreground">Result: </span>
              <pre className="whitespace-pre-wrap break-all">{typeof parsed === 'string' ? parsed : JSON.stringify(parsed, null, 2)}</pre></div>
          )}
        </div>
      )}
    </div>
  );
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={cn('flex gap-2.5', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <BotMessageSquare className="w-4 h-4 text-primary" />
        </div>
      )}
      <div className={cn('max-w-[82%] rounded-2xl px-4 py-3 text-sm',
        isUser ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-card border border-border/50 rounded-tl-sm')}>
        {message.content && (
          isUser
            ? <p className="whitespace-pre-wrap">{message.content}</p>
            : <div className="prose prose-sm dark:prose-invert max-w-none text-foreground">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
        )}
        {message.tool_calls?.map((tc, i) => <FunctionDisplay key={i} toolCall={tc} />)}
      </div>
    </div>
  );
}

export default function JobCoach() {
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const bottomRef = useRef(null);
  const unsubRef = useRef(null);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    setLoadingConvs(true);
    const convs = await base44.agents.listConversations({ agent_name: 'job_coach' });
    setConversations(convs || []);
    setLoadingConvs(false);
    if (convs?.length > 0) {
      openConversation(convs[0]);
    }
  };

  const openConversation = (conv) => {
    setActiveConvId(conv.id);
    setMessages(conv.messages || []);
    // Subscribe for real-time updates
    if (unsubRef.current) unsubRef.current();
    unsubRef.current = base44.agents.subscribeToConversation(conv.id, (data) => {
      setMessages(data.messages || []);
    });
  };

  const newConversation = async () => {
    const conv = await base44.agents.createConversation({
      agent_name: 'job_coach',
      metadata: { name: `Session ${new Date().toLocaleDateString()}` },
    });
    setConversations(prev => [conv, ...prev]);
    openConversation(conv);
    setMessages([]);
  };

  const sendMessage = async (text) => {
    const content = (text || input).trim();
    if (!content || sending) return;
    setInput('');
    setSending(true);

    let convId = activeConvId;
    let conv;
    if (!convId) {
      conv = await base44.agents.createConversation({
        agent_name: 'job_coach',
        metadata: { name: `Session ${new Date().toLocaleDateString()}` },
      });
      setConversations(prev => [conv, ...prev]);
      convId = conv.id;
      openConversation(conv);
    } else {
      conv = await base44.agents.getConversation(convId);
    }

    await base44.agents.addMessage(conv, { role: 'user', content });
    setSending(false);
  };

  // Cleanup subscription on unmount
  useEffect(() => () => { if (unsubRef.current) unsubRef.current(); }, []);

  const isStreaming = messages.some(m =>
    m.role === 'assistant' && m.tool_calls?.some(tc => ['pending','running','in_progress'].includes(tc.status))
  ) || (messages.length > 0 && messages[messages.length - 1]?.role === 'user' && sending === false &&
    !messages.some(m => m.role === 'assistant'));

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-1 flex items-center gap-2">
          <BotMessageSquare className="w-6 h-6 text-primary" />
          AI Job Coach
        </h1>
        <p className="text-muted-foreground text-sm">
          Get personalized advice on your job applications for the Canadian market
        </p>
      </div>

      <div className="flex gap-4 h-[calc(100vh-260px)] min-h-[400px]">
        {/* Sidebar — conversations */}
        <div className="hidden md:flex flex-col w-56 flex-shrink-0 gap-2">
          <Button onClick={newConversation} size="sm" className="w-full rounded-xl gap-1.5 bg-primary">
            <Plus className="w-4 h-4" /> New Session
          </Button>
          <div className="flex-1 overflow-y-auto space-y-1">
            {loadingConvs ? (
              <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 animate-spin text-primary" /></div>
            ) : conversations.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No sessions yet</p>
            ) : (
              conversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => openConversation(conv)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all truncate',
                    activeConvId === conv.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                  )}
                >
                  {conv.metadata?.name || 'Session'}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-card border border-border/50 rounded-2xl overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-4 py-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-heading font-semibold text-base mb-1">Your AI Job Coach</p>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    Ask me anything about your job applications — I'll review them and suggest improvements.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                  {QUICK_PROMPTS.map(p => (
                    <button
                      key={p}
                      onClick={() => sendMessage(p)}
                      className="text-left text-xs px-3 py-2.5 rounded-xl bg-muted/60 hover:bg-muted border border-border/40 transition-all text-muted-foreground hover:text-foreground"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => <MessageBubble key={i} message={msg} />)}
            {(sending || isStreaming) && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <BotMessageSquare className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-card border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border/50 p-3">
            <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about your applications..."
                disabled={sending}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              />
              <Button type="submit" disabled={!input.trim() || sending} size="icon" className="rounded-xl bg-primary w-10 h-10 flex-shrink-0">
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}