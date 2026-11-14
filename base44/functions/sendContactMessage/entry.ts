import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { cleanText, cleanEmail, isValidEmail } from '../../shared/alertEmail.ts';

// Delivers a contact-form message to the app's own support address.
// The recipient is fixed here and can never be supplied by the caller.
const SUPPORT_INBOX = 'support@settlesmart.ca';

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json().catch(() => ({}));

    const name = cleanText(payload.name, 80);
    const email = cleanEmail(payload.email);
    const message = String(payload.message ?? '').trim().slice(0, 4000);

    if (!name || !email || !message) {
      return Response.json({ error: 'Name, email and message are required.' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const result = await base44.asServiceRole.integrations.Core.SendEmail({
      to: SUPPORT_INBOX,
      subject: `Contact Form: Message from ${name}`,
      body: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      from_name: 'SettleSmart Canada',
      category: 'transactional',
    });

    if (result && result.success === false) {
      return Response.json({ error: 'The message could not be delivered.' }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}