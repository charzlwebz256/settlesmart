import { useCallback, useEffect, useRef, useState } from 'react';

// Browser speech input and spoken replies for Nexa.
export function useSpeech() {
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    setRecognitionSupported(Boolean(window.SpeechRecognition || window.webkitSpeechRecognition));
    setSpeechSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
    return () => {
      try {
        recognitionRef.current?.stop();
        window.speechSynthesis?.cancel();
      } catch (_e) {
        // Nothing to release.
      }
    };
  }, []);

  const stopListening = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch (_e) {
      // Already stopped.
    }
    setListening(false);
  }, []);

  const listen = useCallback((onText) => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return;
    try {
      recognitionRef.current?.abort();
    } catch (_e) {
      // Starting a fresh session anyway.
    }
    const recognition = new Recognition();
    recognition.lang = 'en-CA';
    recognition.interimResults = true;
    recognition.continuous = false;

    let finalText = '';
    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += transcript;
        else interim += transcript;
      }
      onText(`${finalText}${interim}`);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }, []);

  const stopSpeaking = useCallback(() => {
    try {
      window.speechSynthesis?.cancel();
    } catch (_e) {
      // Nothing playing.
    }
    setSpeaking(false);
  }, []);

  const speak = useCallback((text) => {
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const plain = String(text)
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[#*_`>]/g, '')
      .replace(/\n{2,}/g, '. ')
      .slice(0, 1200);
    const utterance = new SpeechSynthesisUtterance(plain);
    utterance.lang = 'en-CA';
    utterance.rate = 1;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, []);

  return { listen, stopListening, listening, recognitionSupported, speak, stopSpeaking, speaking, speechSupported };
}