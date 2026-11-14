import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { cleanText } from '../../shared/alertEmail.ts';

// Review notifications always go to the app's own support inbox.
const ADMIN_INBOX = 'support@settlesmart.ca';

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch]));
}

// Notifies the app owner about a review the caller just wrote.
// The caller passes only the review id; recipient and body are built here.
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: 'Sign in required' }, { status: 401 });

    const payload = await req.json().catch(() => ({}));
    const reviewId = cleanText(payload.reviewId, 80);
    if (!reviewId) return Response.json({ error: 'reviewId is required' }, { status: 400 });

    const review = await base44.asServiceRole.entities.ServiceReview
      .get(reviewId)
      .catch((e) => (e.status === 404 ? null : Promise.reject(e)));
    if (!review) return Response.json({ error: 'Review not found' }, { status: 404 });

    // Only the author may trigger the notification for their own review.
    if (review.created_by_id && review.created_by_id !== user.id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const rating = Math.max(1, Math.min(5, Number(review.rating) || 1));
    const stars = '⭐'.repeat(rating);
    const serviceName = cleanText(review.service_name, 120);
    const reviewerName = cleanText(review.reviewer_name, 80) || 'Anonymous';
    const reviewerEmail = cleanText(review.reviewer_email, 120);

    const replyLink = reviewerEmail
      ? `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(reviewerEmail)}&su=${encodeURIComponent(`Re: Review for ${serviceName}`)}`
      : '';

    const body = `
<h2>New Service Review Submitted</h2>
<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
  <tr><td style="padding:6px 12px;color:#666;">Service</td><td style="padding:6px 12px;font-weight:bold;">${escapeHtml(serviceName)}</td></tr>
  <tr><td style="padding:6px 12px;color:#666;">Province</td><td style="padding:6px 12px;">${escapeHtml(cleanText(review.province, 60))}</td></tr>
  <tr><td style="padding:6px 12px;color:#666;">Reviewer</td><td style="padding:6px 12px;">${escapeHtml(reviewerName)}</td></tr>
  <tr><td style="padding:6px 12px;color:#666;">Rating</td><td style="padding:6px 12px;">${stars} (${rating}/5)</td></tr>
  <tr><td style="padding:6px 12px;color:#666;">Review</td><td style="padding:6px 12px;">${escapeHtml(cleanText(review.review, 500) || '(no text)')}</td></tr>
</table>
${replyLink ? `<p><a href="${escapeHtml(replyLink)}" style="background:#1a73e8;color:#fff;padding:8px 16px;border-radius:6px;text-decoration:none;font-weight:bold;">Reply via Gmail</a></p>` : ''}
    `.trim();

    const result = await base44.asServiceRole.integrations.Core.SendEmail({
      to: ADMIN_INBOX,
      subject: `New Review: ${serviceName} — ${stars}`,
      body,
      from_name: 'SettleSmart Canada',
      category: 'transactional',
    });

    if (result && result.success === false) {
      return Response.json({ error: 'Notification could not be delivered' }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}