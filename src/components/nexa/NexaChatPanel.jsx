import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Plus, History, Volume2, VolumeX, Trash2, AlertCircle, Loader2, Sparkles, ChevronRight } from 'lucide-react';
import ChatMessage from '@/components/nexa/ChatMessage';
import { HeartbeatDot } from '@/components/nexa/Heartbeat';
import TalkingBars from '@/components/nexa/TalkingBars';
import NexaComposer from '@/components/nexa/NexaComposer';
import { useSpeech } from '@/hooks/useSpeech';
import { loadConversations, saveConversation, deleteConversation, newConversation } from '@/lib/nexaHistory';
import { NEXA_PORTRAIT } from '@/data/nexaPortrait';
import { cn } from '@/lib/utils';

const PAGE_LABELS = {
  '/': 'Home',
  '/explore': 'Explore',
  '/services': 'Services',
  '/directory': 'National Directory',
  '/checklist': 'Checklist',
  '/work': 'Work',
  '/jobs': 'Job search',
  '/resume-builder': 'Resume Builder',
  '/job-tracker': 'Job Tracker',
  '/interview-prep': 'Interview Prep',
  '/job-coach': 'Job Coach',
  '/career-support': 'Career Support',
  '/workplace-rights': 'Workplace Rights',
  '/resources': 'Resources',
  '/events': 'Events',
  '/benefits': 'Benefits',
  '/healthcare': 'Healthcare',
  '/education': 'Education',
  '/scholarships': 'Scholarships',
  '/legal': 'Legal',
  '/emergency': 'Emergency',
  '/transit-map': 'Transit Map',
  '/near-me': 'Near Me',
  '/news': 'News',
  '/shop-smart': 'ShopSmart',
  '/smart-play': 'SmartPlay',
  '/fly-smart': 'FlySmart',
  '/profile': 'Profile',
  '/assistant': 'Assistant',
  '/volunteer': 'Volunteering',
  '/faq': 'FAQ',
};

const SUGGESTIONS = [
  'How do I get a Social Insurance Number?',
  'How do I apply for provincial health coverage?',
  'What free English classes can I join?',
  'How do I find affordable housing here?',
  'What benefits can my family apply for?',
  'How do I get my foreign credentials recognized?',
];

const QUICK_LINKS = [
  { label: 'Open the 90-day checklist', to: '/checklist' },
  { label: 'Browse the national directory', to: '/directory' },
  { label: 'See benefits you may qualify for', to: '/benefits' },
];

export default function NexaChatPanel({ profile = null, guest = null, className, compact = false, autoListen = false }) {
  const { pathname } = useLocation();
  const [conversations, setConversations] = useState(() => loadConversations());
  const [active, setActive] = useState(() => loadConversations()[0] || newConversation());
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [attachment, setAttachment] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [typingIndex, setTypingIndex] = useState(null);
  const [youSpeaking, setYouSpeaking] = useState(false);
  const micSpeechTimer = useRef(null);
  const [speakReplies, setSpeakReplies] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const endRef = useRef(null);
  const { listen, listening, recognitionSupported, speak, stopSpeaking, stopListening, speaking, speechSupported } = useSpeech();

  const pageContext = PAGE_LABELS[pathname] || 'SettleSmart';

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [active.messages.length, sending]);

  // Opened from the call screen when live minutes are spent: start the microphone once.
  useEffect(() => {
    if (autoListen && recognitionSupported) listen(setInput);
  }, [autoListen]);

  useEffect(() => {
    if (!active.messages.length) return;
    const saved = saveConversation(active);
    if (saved) setConversations(saved);
  }, [active]);

  const send = async () => {
    const text = input.trim();
    if ((!text && !attachment) || sending || uploading) return;
    const question = text || 'Please explain this document and what I need to do next.';
    const outgoing = attachment;
    setInput('');
    setAttachment(null);
    setError(null);
    const history = active.messages.slice(-10).map((m) => ({ role: m.role, content: m.content }));
    const userMessage = { role: 'user', content: question, attachmentName: outgoing?.name || null };
    setActive((prev) => ({ ...prev, messages: [...prev.messages, userMessage] }));
    setSending(true);
    try {
      const res = await base44.functions.invoke('nexaChat', {
        message: question,
        history,
        profile,
        city: profile?.city || guest?.city,
        province: profile?.province || guest?.province,
        pageContext,
        document: outgoing ? { file_uri: outgoing.file_uri, name: outgoing.name } : null,
        mode: 'full',
      });
      const answer = res?.data?.answer;
      if (!answer) throw new Error('No answer');
      setTypingIndex(active.messages.length + 1);
      setActive((prev) => ({ ...prev, messages: [...prev.messages, { role: 'assistant', content: answer }] }));
      if (speakReplies) speak(answer);
    } catch (_err) {
      setError('Nexa could not answer just now. Check your connection and try again.');
    } finally {
      setSending(false);
    }
  };

  const pickFile = async (file) => {
    setUploading(true);
    setError(null);
    try {
      const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
      setAttachment({ name: file.name, file_uri });
    } catch (_err) {
      setError('That file could not be uploaded. Try a PDF, Word document, text file or image.');
    } finally {
      setUploading(false);
    }
  };

  const startNewChat = () => {
    setActive(newConversation());
    setTypingIndex(null);
    setInput('');
    setAttachment(null);
    setError(null);
    setFeedback({});
    setHistoryOpen(false);
    stopSpeaking();
  };

  const openConversation = (conversation) => {
    setActive(conversation);
    setTypingIndex(null);
    setError(null);
    setFeedback({});
    setHistoryOpen(false);
    stopSpeaking();
  };

  const removeConversation = (id) => {
    const next = deleteConversation(id);
    setConversations(next || []);
    if (active.id === id) startNewChat();
  };

  const handleFeedback = (index, value) => {
    setFeedback((prev) => ({ ...prev, [index]: value }));
    base44.analytics.track({ eventName: 'nexa_answer_feedback', properties: { rating: value, page: pageContext } });
  };

  const toggleSpeak = () => {
    if (speakReplies) stopSpeaking();
    setSpeakReplies(!speakReplies);
  };

  const empty = active.messages.length === 0;

  return (
    <div className={cn('relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card', className)}>
      <div className="flex items-center justify-between gap-2 border-b border-border/50 px-2.5 py-2">
        <button
          onClick={startNewChat}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Plus className="h-3.5 w-3.5" /> New chat
        </button>
        <div className="flex items-center gap-1">
          {speechSupported && (
            <button
              onClick={toggleSpeak}
              aria-label={speakReplies ? 'Turn off spoken answers' : 'Read answers aloud'}
              className={cn(
                'flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium transition-colors hover:bg-secondary',
                speakReplies ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {speakReplies ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              {!compact && (speakReplies ? 'Voice on' : 'Voice off')}
            </button>
          )}
          <button
            onClick={() => setHistoryOpen((prev) => !prev)}
            aria-label="Conversation history"
            className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <History className="h-3.5 w-3.5" /> {!compact && 'History'}
          </button>
        </div>
      </div>

      {historyOpen && (
        <div className="absolute inset-x-0 top-[41px] z-10 max-h-64 overflow-y-auto border-b border-border/50 bg-card p-2 shadow-lg">
          {conversations.length === 0 ? (
            <p className="px-2 py-3 text-xs text-muted-foreground">Your past conversations will appear here.</p>
          ) : (
            <ul className="space-y-0.5">
              {conversations.map((conversation) => (
                <li key={conversation.id} className="flex items-center gap-1">
                  <button
                    onClick={() => openConversation(conversation)}
                    className={cn(
                      'min-w-0 flex-1 rounded-lg px-2 py-1.5 text-left text-xs transition-colors hover:bg-secondary',
                      conversation.id === active.id ? 'font-semibold text-primary' : 'text-foreground'
                    )}
                  >
                    <span className="block truncate">{conversation.title}</span>
                    <span className="block text-[10px] text-muted-foreground">
                      {new Date(conversation.updatedAt).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
                    </span>
                  </button>
                  <button
                    onClick={() => removeConversation(conversation.id)}
                    aria-label="Delete conversation"
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="flex-1 space-y-3 overflow-y-auto p-3.5">
        {empty && (
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <img src={NEXA_PORTRAIT} alt="Nexa" className="h-8 w-8 flex-shrink-0 rounded-full object-cover" />
              <div className="rounded-2xl rounded-tl-sm bg-secondary px-3 py-2">
                <p className="text-sm leading-relaxed text-secondary-foreground">
                  Hi, I am Nexa, your guide to life in Canada. Ask me about immigration, documents, housing, health,
                  school, work, money or benefits. You can also attach a letter or form and I will explain it.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 pl-10">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="rounded-full border border-border/60 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            {!compact && (
              <div className="space-y-1 rounded-xl bg-secondary/50 p-2.5">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  <Sparkles className="h-3 w-3" /> Quick actions
                </p>
                {QUICK_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center justify-between rounded-lg px-1.5 py-1 text-xs text-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {active.messages.map((message, index) => (
          <ChatMessage
            key={index}
            index={index}
            message={message}
            feedback={feedback[index]}
            onFeedback={handleFeedback}
            onSpeak={speak}
            typing={index === typingIndex}
            onTypingDone={() => setTypingIndex(null)}
            onTypingTick={() => endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })}
          />
        ))}

        {sending && (
          <div className="flex items-center gap-2.5">
            <img src={NEXA_PORTRAIT} alt="Nexa" className="h-8 w-8 flex-shrink-0 rounded-full object-cover" />
            <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-secondary px-3 py-2.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">Checking the official sources</span>
            </div>
          </div>
        )}

        {(speaking || listening) && (
          <div className="flex items-center gap-2">
            <HeartbeatDot active={speaking || youSpeaking} tone={speaking ? 'nexa' : 'you'} className="h-5 w-5">
              <span className={cn('h-2.5 w-2.5 rounded-full', speaking ? 'bg-primary' : 'bg-accent')} />
            </HeartbeatDot>
            <TalkingBars active tone={speaking ? 'nexa' : 'you'} className="h-4" />
            <span className="text-[11px] font-medium text-foreground">
              {speaking ? 'Nexa is reading aloud' : 'Listening to you'}
            </span>
            {speaking && (
              <button onClick={stopSpeaking} className="text-[11px] font-medium text-primary underline">
                Stop
              </button>
            )}
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

      <NexaComposer
        value={input}
        onChange={setInput}
        onSend={send}
        sending={sending}
        attachment={attachment}
        uploading={uploading}
        onPickFile={pickFile}
        onRemoveFile={() => setAttachment(null)}
        onMic={() => {
          if (listening) {
            stopListening();
            setYouSpeaking(false);
            return;
          }
          listen((text) => {
            setInput(text);
            setYouSpeaking(true);
            clearTimeout(micSpeechTimer.current);
            micSpeechTimer.current = setTimeout(() => setYouSpeaking(false), 1200);
          });
        }}
        listening={listening}
        micSupported={recognitionSupported}
      />
    </div>
  );
}