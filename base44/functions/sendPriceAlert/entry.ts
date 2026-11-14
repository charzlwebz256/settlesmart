import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { cleanText, sendToUser } from '../../shared/alertEmail.ts';

// Confirms a price-alert subscription to the signed-in user's own account
// email. The recipient is never accepted from the request.
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: 'Please sign in to set price alerts.' }, { status: 401 });
    if (!user.email) return Response.json({ error: 'This account has no email address.' }, { status: 400 });

    const payload = await req.json().catch(() => ({}));
    const stores = (Array.isArray(payload.stores) ? payload.stores : [])
      .map((s) => cleanText(s, 60))
      .filter(Boolean)
      .slice(0, 12);
    const categories = (Array.isArray(payload.categories) ? payload.categories : [])
      .map((c) => cleanText(c, 60))
      .filter(Boolean)
      .slice(0, 8);

    if (!stores.length) return Response.json({ error: 'Select at least one store.' }, { status: 400 });

    const storeList = stores.map((s) => `• ${s}`).join('\n');
    const catList = categories.length ? categories.map((c) => `• ${c}`).join('\n') : '• All categories';

    const body = [
      'Hi there,',
      '',
      "You've signed up for price drop alerts on SettleSmart Canada!",
      '',
      "Stores you're watching:",
      storeList,
      '',
      'Categories:',
      catList,
      '',
      'We will notify you at this address when we spot significant deals or price drops at these stores for household essentials.',
      '',
      'Tip: Check the ShopSmart Price Comparison Guide in the app regularly to compare current price ranges across stores.',
      '',
      'Happy saving!',
      'The SettleSmart Team',
    ].join('\n');

    await sendToUser(base44, user.email, "SettleSmart Price Drop Alerts — You're Subscribed!", body);

    return Response.json({ ok: true, sentTo: user.email });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}