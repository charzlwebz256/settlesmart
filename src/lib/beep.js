// Plays a Windows-style "beep" using the Web Audio API — no asset required.
// Classic default-beep character: a buzzy square tone, sustained for at least 3 seconds.
let _ctx = null;
export function playBeep(duration = 3, frequency = 800, volume = 0.08) {
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
    osc.type = 'square'; // buzzy Windows-style beep
    osc.frequency.value = frequency;
    // Gentle attack/decay so it's a clean sustained beep, not a click
    gain.gain.setValueAtTime(0, _ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, _ctx.currentTime + 0.02);
    gain.gain.setValueAtTime(volume, _ctx.currentTime + Math.max(0, duration - 0.08));
    gain.gain.exponentialRampToValueAtTime(0.0001, _ctx.currentTime + duration);
    osc.connect(gain).connect(_ctx.destination);
    osc.start();
    osc.stop(_ctx.currentTime + duration);
  } catch {
    // Silently ignore — audio is a non-critical nicety
  }
}