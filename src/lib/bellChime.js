// A warm, clear bell strike, synthesised in the browser so it needs no download.
let ctx = null;
let lastPlayed = 0;

const PARTIALS = [
  { ratio: 0.5, gain: 0.34, decay: 2.8 },
  { ratio: 1, gain: 0.5, decay: 2.2 },
  { ratio: 1.19, gain: 0.22, decay: 1.5 },
  { ratio: 1.56, gain: 0.18, decay: 1.2 },
  { ratio: 2.0, gain: 0.14, decay: 0.95 },
  { ratio: 2.51, gain: 0.1, decay: 0.75 },
  { ratio: 3.01, gain: 0.07, decay: 0.6 },
  { ratio: 4.16, gain: 0.05, decay: 0.4 },
];

export function playBell() {
  const now = Date.now();
  if (now - lastPlayed < 900) return;
  lastPlayed = now;

  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!ctx) ctx = new AudioCtx();
    if (ctx.state === 'suspended') ctx.resume();

    const t = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.value = 0.32;
    master.connect(ctx.destination);

    const base = 784; // G5, the pitch of a small hand bell
    PARTIALS.forEach(({ ratio, gain, decay }) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = base * ratio;
      const env = ctx.createGain();
      env.gain.setValueAtTime(0.0001, t);
      env.gain.exponentialRampToValueAtTime(gain, t + 0.006);
      env.gain.exponentialRampToValueAtTime(0.0001, t + decay);
      osc.connect(env).connect(master);
      osc.start(t);
      osc.stop(t + decay + 0.05);
    });

    // The short metallic strike that makes it read as a bell, not a tone.
    const strike = ctx.createBufferSource();
    const frames = Math.floor(ctx.sampleRate * 0.05);
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / frames) ** 3;
    }
    strike.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3200;
    filter.Q.value = 1.2;
    const strikeGain = ctx.createGain();
    strikeGain.gain.value = 0.12;
    strike.connect(filter).connect(strikeGain).connect(master);
    strike.start(t);
  } catch (_e) {
    // Sound is a nicety: the ring still shows without it.
  }
}