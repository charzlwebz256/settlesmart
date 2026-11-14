import { useCallback, useEffect, useRef, useState } from 'react';

const isSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

// Units written short on screen are read out in full by the voice.
function speakable(text) {
  return String(text)
    .replace(/(\d+(?:\.\d+)?)\s?km\b/g, '$1 kilometres')
    .replace(/(\d+)\s?m\b/g, '$1 meters')
    .replace(/\bmin\b/g, 'minutes')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Speaks turn-by-turn directions the way a navigation app does: each new
 * instruction is read aloud once, and nothing is repeated while it stays the same.
 */
export default function useVoiceGuidance() {
  const [voiceOn, setVoiceOn] = useState(true);
  const spokenKeyRef = useRef('');
  const enabledRef = useRef(true);

  enabledRef.current = voiceOn;

  useEffect(() => {
    return () => {
      if (isSupported()) window.speechSynthesis.cancel();
    };
  }, []);

  const toggleVoice = useCallback(() => {
    setVoiceOn((on) => {
      if (on && isSupported()) window.speechSynthesis.cancel();
      return !on;
    });
  }, []);

  // `key` identifies the instruction: the same key never speaks twice in a row.
  const announce = useCallback((text, key) => {
    if (!isSupported() || !enabledRef.current || !text) return;
    const id = key || text;
    if (id === spokenKeyRef.current) return;
    spokenKeyRef.current = id;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(speakable(text));
    utterance.lang = 'en-CA';
    utterance.rate = 1.02;
    utterance.pitch = 1;
    // Browsers stay silent when no voice is picked, so choose a Canadian one.
    const voices = synth.getVoices();
    const voice =
      voices.find((v) => /^en[-_]CA/i.test(v.lang)) || voices.find((v) => /^en/i.test(v.lang));
    if (voice) utterance.voice = voice;
    synth.speak(utterance);
  }, []);

  const resetVoice = useCallback(() => {
    spokenKeyRef.current = '';
    if (isSupported()) window.speechSynthesis.cancel();
  }, []);

  return { voiceOn: voiceOn && isSupported(), voiceSupported: isSupported(), toggleVoice, announce, resetVoice };
}