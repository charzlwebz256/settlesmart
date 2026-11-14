// Shared helpers for the app's alert/notification emails.
// Recipients are always chosen on the server (the signed-in account or a
// fixed app address) — never taken from request input.

export function cleanText(value, maxLength = 200) {
  return String(value ?? '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, maxLength);
}

export function cleanEmail(value) {
  return cleanText(value, 120).toLowerCase();
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail(value));
}

// Sends through the service role after the caller has been authenticated.
export async function sendToUser(base44, email, subject, body) {
  return base44.asServiceRole.integrations.Core.SendEmail({
    to: email,
    subject: cleanText(subject, 160),
    body,
    from_name: 'SettleSmart Canada',
  });
}