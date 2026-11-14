import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { cleanText, safeUrl } from '../../shared/safeUrl.ts';

const ALLOWED_PATHS = ['/services', '/checklist', '/jobs', '/legal', '/resources', '/events', '/healthcare', '/benefits', '/education', '/career-support', '/near-me', '/emergency'];

function safePath(value) {
  const path = typeof value === 'string' ? value.trim() : '';
  return ALLOWED_PATHS.includes(path) ? path : '';
}

const CHECKLIST_SCHEMA = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          day_range: { type: 'string' },
          order: { type: 'number' },
          link: { type: 'string' },
        },
      },
    },
  },
};

const TIP_SCHEMA = {
  type: 'object',
  properties: {
    tip_title: { type: 'string' },
    tip_body: { type: 'string' },
    action_label: { type: 'string' },
    action_path: { type: 'string' },
    category: { type: 'string' },
    emoji: { type: 'string' },
  },
};

const RECOMMENDATIONS_SCHEMA = {
  type: 'object',
  properties: {
    recommendations: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          urgency: { type: 'string', enum: ['high', 'medium', 'low'] },
          action_label: { type: 'string' },
          action_path: { type: 'string' },
        },
      },
    },
  },
};

// Personalized settlement guidance: the 90-day checklist, the daily tip and
// the dashboard recommendations.
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json().catch(() => ({}));
    const action = payload.action;

    if (action === 'checklist') {
      const statusLabel = cleanText(payload.statusLabel, 80) || 'newcomer';
      const location = cleanText(payload.location, 100) || 'Canada';
      const arrivalLabel = cleanText(payload.arrivalLabel, 80) || 'recently';

      const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `Settlement checklist for a ${statusLabel} in ${location}, Canada. Arrival: ${arrivalLabel}.
Return JSON "items" array, exactly 8 items. Each: title (5 words max), description (1 short sentence), category (documents|housing|banking|health|education|employment|transportation|social|legal), day_range (week1|week2|week3|week4|month2|month3), order (1-8), link (relevant gov/org URL or ""). Be concise and fast.`,
        response_json_schema: CHECKLIST_SCHEMA,
      });

      const items = (Array.isArray(result?.items) ? result.items.slice(0, 12) : []).map((item) => ({
        title: cleanText(item?.title, 120),
        description: cleanText(item?.description, 400),
        category: cleanText(item?.category, 30),
        day_range: cleanText(item?.day_range, 20),
        order: Number(item?.order) || 0,
        link: safeUrl(item?.link),
      }));

      return Response.json({ items });
    }

    if (action === 'daily_tip') {
      const status = cleanText(payload.status, 60) || 'newcomer';
      const city = cleanText(payload.city, 60) || 'Canada';
      const province = cleanText(payload.province, 60) || 'Canada';
      const arrivalLabel = cleanText(payload.arrivalLabel, 80) || 'a short time';
      const phase = cleanText(payload.phase, 40) || 'early';
      const english = cleanText(payload.english, 40) || 'unknown';
      const interests = cleanText(payload.interests, 200) || 'general settlement';

      const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `You are a friendly Canadian settlement advisor. Generate ONE practical, actionable daily tip for a ${status} who has been in Canada for ${arrivalLabel}, living in ${city}, ${province}.

Settlement phase: ${phase.replace(/_/g, ' ')}
English level: ${english}
Interests: ${interests}

The tip must be:
- Specific to their immigration status (${status}) and how long they've been here (${arrivalLabel})
- Immediately actionable today or this week
- Concise and warm in tone
- Reference real Canadian programs, services, or resources when relevant
- Include a specific next step they can take

Return JSON with:
- tip_title: short punchy title (max 8 words)
- tip_body: 2-3 sentence practical advice
- action_label: short call-to-action button text (e.g. "Find a settlement office", "Apply on IRCC.ca")
- action_path: internal app path if relevant ("/services", "/checklist", "/jobs", "/legal", "/resources") or null
- category: one of: documents, housing, banking, health, employment, language, social, legal
- emoji: one relevant emoji`,
        response_json_schema: TIP_SCHEMA,
      });

      return Response.json({
        tip_title: cleanText(result?.tip_title, 120),
        tip_body: cleanText(result?.tip_body, 600),
        action_label: cleanText(result?.action_label, 60),
        action_path: safePath(result?.action_path),
        category: cleanText(result?.category, 30),
        emoji: cleanText(result?.emoji, 8),
      });
    }

    if (action === 'recommendations') {
      const profile = payload.profile && typeof payload.profile === 'object' ? payload.profile : {};
      const interests = Array.isArray(profile.interests) ? profile.interests.slice(0, 12).join(', ') : 'not specified';

      const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `You are a Canadian newcomer settlement advisor. Based on this user's profile, recommend 4 specific services or actions they should take NOW.

User Profile:
- Immigration Status: ${cleanText(String(profile.immigration_status || '').replace(/_/g, ' '), 60) || 'not specified'}
- Province: ${cleanText(profile.province, 60) || 'not specified'}
- City: ${cleanText(profile.city, 60) || 'not specified'}
- Interests: ${cleanText(interests, 200)}
- English Level: ${cleanText(profile.english_level, 40) || 'not specified'}
- French Level: ${cleanText(profile.french_level, 40) || 'not specified'}
- Education: ${cleanText(profile.education_level, 40) || 'not specified'}
- Family Size: ${Number(profile.family_size) || 1}
- Arrival Date: ${cleanText(profile.arrival_date, 20) || 'recent'}

Return EXACTLY 4 targeted recommendations. Each must be specific and actionable for their status and location.`,
        response_json_schema: RECOMMENDATIONS_SCHEMA,
      });

      const recommendations = (Array.isArray(result?.recommendations) ? result.recommendations.slice(0, 5) : []).map((r) => ({
        title: cleanText(r?.title, 120),
        description: cleanText(r?.description, 500),
        category: cleanText(r?.category, 30),
        urgency: ['high', 'medium', 'low'].includes(r?.urgency) ? r.urgency : 'medium',
        action_label: cleanText(r?.action_label, 60),
        action_path: safePath(r?.action_path),
      }));

      return Response.json({ recommendations });
    }

    return Response.json({ error: 'Unknown action.' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}