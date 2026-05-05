import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, Send, X, Loader2, MessageCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [siteData, setSiteData] = useState(null);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setInput(transcript);
        handleAsk(transcript);
      };
    }
  }, []);

  // Load site data on mount
  useEffect(() => {
    loadSiteData();
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadSiteData = async () => {
    try {
      const [services, events] = await Promise.all([
        base44.entities.Service.list(),
        base44.entities.Event.list(),
      ]);
      setSiteData({ services, events });
    } catch (error) {
      console.log('Could not load site data');
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      setIsListening(false);
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const handleAsk = async (question) => {
    if (!question.trim()) return;

    const userMsg = { role: 'user', content: question };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Prepare site context for the LLM
      const context = siteData
        ? `Site Data Available:
- Total Services: ${siteData.services?.length || 0}
- Total Events: ${siteData.events?.length || 0}
- Service Categories: ${[...new Set(siteData.services?.map(s => s.category))].join(', ')}
- Event Categories: ${[...new Set(siteData.events?.map(e => e.category))].join(', ')}`
        : '';

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a helpful AI assistant for SettleSmart Canada, a newcomer settlement platform. You have access to the site's services, events, and resources.

${context}

Answer the user's question about the site, settlement services, events, education, health, housing, jobs, immigration, or any other topic related to helping newcomers in Canada. Be conversational, friendly, and practical. If asked about specific services or events, reference what's available on the platform. If you don't have specific data, suggest how the user can find it on the site.

User Question: "${question}"`,
        add_context_from_internet: false,
      });

      const assistantMsg = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMsg]);
      
      // Speak the response (first 500 characters to avoid too long speech)
      const textToSpeak = response.substring(0, 500).replace(/[#*_`]/g, '');
      speak(textToSpeak);
    } catch (error) {
      const errorMsg = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAsk(input);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 p-4 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-110 transition-all"
        aria-label="Open voice assistant"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 w-96 max-w-[calc(100vw-48px)] bg-card rounded-2xl border border-border/50 shadow-xl flex flex-col max-h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div>
          <h3 className="font-heading font-bold text-sm">AI Assistant</h3>
          <p className="text-[10px] text-muted-foreground">Voice & chat enabled</p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 rounded-lg hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <p className="mb-3">👋 Ask me anything about:</p>
            <p className="text-xs">Education • Health • Settlement • Jobs • Housing • Events • Location</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                'flex gap-2',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[80%] rounded-lg px-3 py-2 text-sm',
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                )}
              >
                <ReactMarkdown className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex gap-2">
            <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-border/50 p-4 space-y-2">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1 px-3 py-2 rounded-lg border border-border/50 bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
          <Button
            type="button"
            size="icon"
            onClick={isListening ? stopListening : startListening}
            className={cn(
              'rounded-lg',
              isListening && 'bg-red-500 hover:bg-red-600'
            )}
          >
            {isListening ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </Button>
          <Button
            type="submit"
            size="icon"
            disabled={loading || !input.trim()}
            className="rounded-lg"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {isSpeaking && (
          <div className="flex items-center gap-2 text-xs text-primary">
            <Volume2 className="w-3 h-3 animate-pulse" />
            Speaking...
          </div>
        )}
      </form>
    </div>
  );
}