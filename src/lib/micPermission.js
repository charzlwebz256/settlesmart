// Asks the browser for the microphone, so Nexa can hear the visitor.
export async function requestMicrophone() {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    return { ok: false, reason: 'unsupported' };
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    return { ok: true };
  } catch (error) {
    const denied = error?.name === 'NotAllowedError' || error?.name === 'SecurityError';
    return { ok: false, reason: denied ? 'denied' : 'failed' };
  }
}

export const MIC_DENIED_MESSAGE =
  'Your browser blocked the microphone. Allow microphone access for this site, then press start again.';

export const MIC_FAILED_MESSAGE =
  'No microphone is available right now. Check your device, then press start again.';