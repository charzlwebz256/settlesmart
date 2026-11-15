/**
 * Gmail compose link so an email button opens Gmail with the site admin
 * already addressed, instead of relying on a desktop mail client.
 */
export function gmailComposeUrl({ to, subject = '', body = '' }) {
  const params = new URLSearchParams({ view: 'cm', fs: '1', to });
  if (subject) params.set('su', subject);
  if (body) params.set('body', body);
  return `https://mail.google.com/mail/?${params.toString()}`;
}

export const ADMIN_EMAIL = 'charzlwebz256@gmail.com';

export const FEEDBACK_URL = gmailComposeUrl({
  to: ADMIN_EMAIL,
  subject: 'SettleSmart feedback',
  body: 'What I was doing:\n\nWhat was wrong or what could be better:\n\n',
});