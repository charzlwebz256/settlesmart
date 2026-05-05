import { useState, useRef, useEffect } from 'react';
import { Loader2, Volume2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { cn } from '@/lib/utils';

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [siteData, setSiteData] = useState(null);
  const recognitionRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(interimTranscript || finalTranscript);
        
        if (finalTranscript.trim()) {
          recognitionRef.current.stop();
          handleAsk(finalTranscript.trim());
        }
      };
    }
    
    loadSiteData();
  }, []);

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

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      recognitionRef.current?.start();
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.3;
      utterance.pitch = 1.5;
      
      // Get female voice with American accent
      const voices = speechSynthesis.getVoices();
      const femaleVoice = voices.find(v => 
        v.lang === 'en-US' && (
          v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('woman') ||
          v.name.toLowerCase().includes('zira') ||
          v.name.toLowerCase().includes('victoria') ||
          v.name.toLowerCase().includes('samantha')
        )
      ) || voices.find(v => v.lang === 'en-US');
      
      if (femaleVoice) utterance.voice = femaleVoice;
      speechSynthesis.speak(utterance);
    }
  };

  const handleAsk = async (question) => {
    if (!question.trim() || loading) return;
    setLoading(true);

    try {
      const context = siteData
        ? `Available Services: ${siteData.services?.length || 0} | Available Events: ${siteData.events?.length || 0}`
        : '';

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a smart voice AI assistant (like Siri/Bixby) for SettleSmart Canada, a newcomer settlement platform. ${context}

Answer the user's question conversationally and concisely (keep response under 100 words). Cover: settlement services, events, education, health, jobs, housing, immigration, location, weather, or anything related to newcomers in Canada.

Be friendly, direct, and practical. User: "${question}"`,
        add_context_from_internet: false,
      });

      speak(response);
    } catch (error) {
      speak('Sorry, I encountered an error. Please try again.');
    } finally {
      setLoading(false);
      setTranscript('');
    }
  };

  return (
    <button
      onClick={toggleListening}
      disabled={loading}
      className={cn(
        'fixed bottom-6 left-6 z-40 p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300',
        isListening || loading
          ? 'bg-red-500 hover:bg-red-600 text-white'
          : 'bg-primary hover:bg-primary/90 text-primary-foreground'
      )}
      aria-label="Voice assistant"
      title={isListening ? 'Listening...' : loading ? 'Processing...' : 'Press to speak'}
    >
      <div className="relative flex items-center justify-center">
        <Volume2 className={cn('w-6 h-6', isListening && 'animate-pulse')} />
        {(isListening || loading) && (
          <div className="absolute inset-0 rounded-full animate-ping bg-red-500/50" />
        )}
      </div>
    </button>
  );
}