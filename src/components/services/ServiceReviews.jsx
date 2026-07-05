import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Star, MessageSquare, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch]));
}

function sanitizeUrl(url) {
  const u = String(url ?? '');
  return /^https?:\/\//i.test(u) ? u : '#';
}

function StarRating({ value, onChange, readonly = false, size = 'md' }) {
  const [hovered, setHovered] = useState(0);
  const sz = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          disabled={readonly}
          onClick={() => onChange && onChange(n)}
          onMouseEnter={() => !readonly && setHovered(n)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={cn("transition-colors", readonly ? "cursor-default" : "cursor-pointer")}
        >
          <Star
            className={cn(sz, "transition-colors",
              (hovered || value) >= n ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
            )}
          />
        </button>
      ))}
    </div>
  );
}

export default function ServiceReviews({ serviceKey, serviceName, province }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['serviceReviews', serviceKey],
    queryFn: () => base44.entities.ServiceReview.filter({ service_key: serviceKey }),
    enabled: open,
  });

  const { data: myReview } = useQuery({
    queryKey: ['myServiceReview', serviceKey],
    queryFn: async () => {
      const user = await base44.auth.me();
      const results = await base44.entities.ServiceReview.filter({ service_key: serviceKey, created_by_id: user.id });
      return results[0] || null;
    },
    enabled: open,
  });

  const [submitError, setSubmitError] = useState(null);

  const mutation = useMutation({
    mutationFn: async (data) => {
      // Derive identity from the authenticated session — never trust client-supplied name/email
      const user = await base44.auth.me();
      const reviewerName = user?.full_name || 'Anonymous';
      const reviewerEmail = user?.email || '';
      const payload = { ...data, reviewer_name: reviewerName, reviewer_email: reviewerEmail };
      const created = await base44.entities.ServiceReview.create(payload);
      // Fire-and-forget email — never block the review save
      try {
        const stars = '⭐'.repeat(payload.rating);
        const replySubject = encodeURIComponent(`Re: Review for ${payload.service_name}`);
        const replyBody = encodeURIComponent(`Hi ${reviewerName},\n\nThank you for your review of ${payload.service_name}!\n\n`);
        const gmailReplyLink = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(reviewerEmail)}&su=${replySubject}&body=${replyBody}`;
        await base44.integrations.Core.SendEmail({
          to: import.meta.env.VITE_ADMIN_EMAIL || '',
          subject: `New Review: ${payload.service_name} — ${stars}`,
          body: `
<h2>New Service Review Submitted</h2>
<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
  <tr><td style="padding:6px 12px;color:#666;">Service</td><td style="padding:6px 12px;font-weight:bold;">${escapeHtml(payload.service_name)}</td></tr>
  <tr><td style="padding:6px 12px;color:#666;">Province</td><td style="padding:6px 12px;">${escapeHtml(payload.province)}</td></tr>
  <tr><td style="padding:6px 12px;color:#666;">Reviewer</td><td style="padding:6px 12px;">${escapeHtml(reviewerName)}</td></tr>
  <tr><td style="padding:6px 12px;color:#666;">Rating</td><td style="padding:6px 12px;">${stars} (${escapeHtml(payload.rating)}/5)</td></tr>
  <tr><td style="padding:6px 12px;color:#666;">Review</td><td style="padding:6px 12px;">${escapeHtml(payload.review || '(no text)')}</td></tr>
</table>
${reviewerEmail ? `<p><a href="${escapeHtml(sanitizeUrl(gmailReplyLink))}" style="background:#1a73e8;color:#fff;padding:8px 16px;border-radius:6px;text-decoration:none;font-weight:bold;">Reply via Gmail</a></p>` : ''}
          `.trim(),
        });
      } catch (_) {}
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceReviews', serviceKey] });
      queryClient.invalidateQueries({ queryKey: ['myServiceReview', serviceKey] });
      setSubmitted(true);
      setShowForm(false);
      setRating(0);
      setReview('');
      setSubmitError(null);
    },
    onError: () => setSubmitError('Failed to submit. Please try again.'),
  });

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) return;
    mutation.mutate({
      service_key: serviceKey,
      service_name: serviceName,
      province,
      rating,
      review: review.trim(),
    });
  };

  return (
    <div className="mt-2 border-t border-border/30 pt-2">
      {/* Toggle row */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 w-full text-left hover:opacity-80 transition-opacity"
      >
        <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground font-medium">
          {avgRating ? (
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-bold text-foreground">{avgRating}</span>
              <span>· {reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
            </span>
          ) : 'Reviews'}
        </span>
        {open ? <ChevronUp className="w-3.5 h-3.5 ml-auto text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 ml-auto text-muted-foreground" />}
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {/* Existing reviews */}
          {isLoading ? (
            <p className="text-xs text-muted-foreground">Loading reviews…</p>
          ) : reviews.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No reviews yet. Be the first!</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {reviews.map(r => (
                <div key={r.id} className="bg-muted/40 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-foreground">{r.reviewer_name || 'Anonymous'}</span>
                    <StarRating value={r.rating} readonly size="sm" />
                  </div>
                  {r.review && <p className="text-xs text-muted-foreground leading-snug">{r.review}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Write a review */}
          {!myReview && !submitted && (
            <>
              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  + Write a review
                </button>
              ) : (
                <form onSubmit={handleSubmit} className="bg-primary/5 border border-primary/15 rounded-xl p-3 space-y-2">
                  <div>
                    <p className="text-xs font-semibold mb-1">Your rating *</p>
                    <StarRating value={rating} onChange={setRating} />
                  </div>
                  <textarea
                    placeholder="Share your experience… (optional)"
                    value={review}
                    onChange={e => setReview(e.target.value)}
                    maxLength={500}
                    rows={3}
                    className="w-full text-xs bg-card border border-border/60 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                  {submitError && <p className="text-xs text-destructive">{submitError}</p>}
                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setShowForm(false)}
                      className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5">
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!rating || mutation.isPending}
                      className="flex items-center gap-1.5 text-xs font-semibold bg-primary text-primary-foreground px-3 py-1.5 rounded-lg disabled:opacity-50"
                    >
                      <Send className="w-3 h-3" />
                      {mutation.isPending ? 'Submitting…' : 'Submit'}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {(myReview || submitted) && (
            <p className="text-xs text-primary font-semibold">✓ You've reviewed this service</p>
          )}
        </div>
      )}
    </div>
  );
}