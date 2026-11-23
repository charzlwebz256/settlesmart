import { createClientFromRequest } from 'npm:@base44/sdk@0.8.63';

const escapeHtml = (value) =>
  String(value || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const safeLink = (href, pattern) => (pattern.test(String(href || '')) ? String(href) : null);

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: 'Please sign in first.' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const contacts = Array.isArray(body?.contacts) ? body.contacts.slice(0, 12) : [];
    if (!contacts.length) return Response.json({ error: 'There is nothing to send yet.' }, { status: 400 });

    const rows = contacts
      .map((contact) => {
        const phoneHref = safeLink(contact?.phone?.href, /^tel:\+?[\d\s()+-]{5,}$/);
        const siteHref = safeLink(contact?.website?.href, /^https?:\/\/[^\s]+$/i);
        const mapHref = safeLink(contact?.address?.href, /^https?:\/\/[^\s]+$/i);
        const lines = [
          phoneHref
            ? `<a href="${escapeHtml(phoneHref)}" style="color:#279b84;text-decoration:none">${escapeHtml(contact?.phone?.label || phoneHref)}</a>`
            : '',
          siteHref
            ? `<a href="${escapeHtml(siteHref)}" style="color:#279b84;text-decoration:none">${escapeHtml(contact?.website?.label || siteHref)}</a>`
            : '',
          mapHref
            ? `<a href="${escapeHtml(mapHref)}" style="color:#279b84;text-decoration:none">${escapeHtml(contact?.address?.label || 'Open the address')}</a>`
            : '',
        ]
          .filter(Boolean)
          .join('<br>');
        const note = contact?.note ? `<br><span style="color:#676f7e;font-size:13px">${escapeHtml(contact.note)}</span>` : '';
        return `<div style="margin:0 0 16px"><strong style="color:#131720">${escapeHtml(contact?.name || 'Contact')}</strong>${note}<br><span style="color:#676f7e;font-size:14px">${lines}</span></div>`;
      })
      .join('');

    const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#131720;font-size:15px;line-height:1.6;max-width:600px">
      <h2 style="font-size:18px;margin:0 0 14px">The contacts Nexa found for you</h2>
      ${rows}
      <p style="color:#676f7e;font-size:13px;margin-top:18px">Saved from your conversation with Nexa in SettleSmart. Confirm the details with the organisation before you visit.</p>
    </div>`;

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: user.email,
      subject: 'The contacts Nexa found for you',
      html,
      category: 'transactional',
    });

    return Response.json({ sent: true, to: user.email });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}