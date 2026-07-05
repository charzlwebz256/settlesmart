// Plays a short, pleasant "beep" using the Web Audio API — no asset required.
let _ctx = null;
export function playBeep(duration = 0.18, frequency = 660, volume = 0.12) {
  try {
    if (!_ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      _ctx = new AC();
    }
    // Resume if suspended (autoplay policy)
    if (_ctx.state === 'suspended') _ctx.resume();
    const osc = _ctx.createOscillator();
    const gain = _ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0, _ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, _ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, _ctx.currentTime + duration);
    osc.connect(gain).connect(_ctx.destination);
    osc.start();
    osc.stop(_ctx.currentTime + duration);
  } catch {
    // Silently ignore — audio is a non-critical nicety
  }
}