import { base44 } from '@/api/base44Client';

// One warm, natural speaking voice for everything Nexa says out loud.
const VOICE = 'honey';

const cache = new Map();
let currentAudio = null;
let playToken = 0;

export const plainSpeech = (text) =>
  String(text || '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#*_`>]/g, '')
    .replace(/\n{2,}/g, '. ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 1200);

export function stopNexaVoice() {
  playToken += 1;
  try {
    currentAudio?.pause();
  } catch (_e) {
    // Nothing playing.
  }
  currentAudio = null;
  try {
    window.speechSynthesis?.cancel();
  } catch (_e) {
    // No browser speech to stop.
  }
}

// Holds the current sentence where it is, so it can be picked up again.
export function pauseNexaVoice() {
  try {
    currentAudio?.pause();
  } catch (_e) {
    // Nothing playing.
  }
  try {
    window.speechSynthesis?.pause();
  } catch (_e) {
    // No browser speech to pause.
  }
}

export function resumeNexaVoice() {
  try {
    currentAudio?.play();
  } catch (_e) {
    // Nothing to resume.
  }
  try {
    window.speechSynthesis?.resume();
  } catch (_e) {
    // No browser speech to resume.
  }
}

function browserFallback(plain, handlers) {
  if (!('speechSynthesis' in window)) {
    handlers.onEnd?.();
    return;
  }
  const utterance = new SpeechSynthesisUtterance(plain);
  utterance.lang = 'en-CA';
  utterance.rate = 1;
  utterance.onend = () => handlers.onEnd?.();
  utterance.onerror = () => handlers.onEnd?.();
  window.speechSynthesis.speak(utterance);
}

// Speaks text in the studio-quality Nexa voice, falling back to the browser voice.
export async function playNexaVoice(text, handlers = {}) {
  const plain = plainSpeech(text);
  if (!plain) {
    handlers.onEnd?.();
    return;
  }
  stopNexaVoice();
  const token = playToken;
  handlers.onStart?.();
  try {
    let url = cache.get(plain);
    if (!url) {
      const result = await base44.integrations.Core.GenerateSpeech({ text: plain, voice: VOICE, language_code: 'en' });
      url = result?.url;
      if (url) cache.set(plain, url);
    }
    if (token !== playToken) return;
    if (!url) throw new Error('No audio returned');
    const audio = new Audio(url);
    currentAudio = audio;
    audio.onended = () => {
      if (currentAudio === audio) currentAudio = null;
      handlers.onEnd?.();
    };
    audio.onerror = () => {
      if (currentAudio === audio) currentAudio = null;
      handlers.onEnd?.();
    };
    await audio.play();
  } catch (_e) {
    if (token !== playToken) return;
    browserFallback(plain, handlers);
  }
}