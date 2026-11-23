import { createClientFromRequest } from 'npm:@base44/sdk@0.8.63';
import { NEXA_SYSTEM_PROMPT } from '../../shared/nexaPrompt.ts';
import { cleanText } from '../../shared/safeUrl.ts';

const PAGE_CONTEXT = `The person is reading this page of SettleSmart right now. Lean the answer toward it when it fits, but still answer their actual question:`;

// Spoken answers carry no markup, links or web addresses.
function spokenText(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[*_`#>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildProfileContext(profile) {
  if (!profile || typeof profile !== 'object') return '';
  const fields = [
    ['Province', profile.province],
    ['City', profile.city],
    ['Immigration status', String(profile.immigration_status || '').replace(/_/g, ' ')],
    ['Family size', profile.family_size],
    ['Arrived', profile.arrival_date],
    ['English level', profile.english_level],
    ['French level', profile.french_level],
    ['Education', profile.education_level],
    ['Interests', Array.isArray(profile.interests) ? profile.interests.join(', ') : profile.interests],
  ];
  const parts = fields
    .map(([label, value]) => (value ? `${label}: ${cleanText(String(value), 60)}` : null))
    .filter(Boolean);
  return parts.join('; ');
}

function buildHistory(history) {
  if (!Array.isArray(history)) return '';
  return history
    .slice(-10)
    .map((m) => {
      const role = m && m.role === 'user' ? 'Newcomer' : 'Nexa';
      return `${role}: ${cleanText(m && m.content, 2000)}`;
    })
    .filter((line) => line.length > 6)
    .join('\n');
}

const STATUS_RANK = { verified: 0, review_due: 1, pending: 2, needs_correction: 3, inactive: 4 };

// Directory records, ranked for this person: local, eligible, verified first.
// Only text the app already stores is included — Nexa may not add service facts.
function buildServiceContext(services, profile) {
  if (!Array.isArray(services) || services.length === 0) return '';

  const province = profile && typeof profile === 'object' ? profile.province : '';
  const city = profile && typeof profile === 'object' ? profile.city : '';
  const immigrationStatus = profile && typeof profile === 'object' ? profile.immigration_status : '';

  const ranked = services
    .filter((s) => (s.verification_status || 'pending') !== 'inactive')
    .map((s) => {
      let score = 0;
      if (province && s.province === province) score += 30;
      if (city && String(s.city || '').toLowerCase() === String(city).toLowerCase()) score += 25;
      if (immigrationStatus && Array.isArray(s.eligibility) && s.eligibility.includes(immigrationStatus)) score += 20;
      const status = s.verification_status || 'pending';
      if (status === 'verified') score += 15;
      if (status === 'review_due') score += 5;
      if (status === 'needs_correction') score -= 10;
      if (s.is_free) score += 3;
      return { service: s, score };
    })
    .sort((a, b) => b.score - a.score || (STATUS_RANK[a.service.verification_status || 'pending'] - STATUS_RANK[b.service.verification_status || 'pending']))
    .slice(0, 8)
    .map(({ service: s }) => {
      const status = s.verification_status || 'pending';
      const parts = [
        `- ${cleanText(s.name, 140)}${s.organization ? ` (${cleanText(s.organization, 100)})` : ''}`,
        `  Location: ${cleanText(s.city || 'Province-wide', 60)}, ${cleanText(s.province || '', 40)}`,
        `  Category: ${cleanText(s.category, 40)}`,
        Array.isArray(s.eligibility) && s.eligibility.length
          ? `  Eligibility: ${s.eligibility.map((e) => cleanText(e, 40)).join(', ')}`
          : '  Eligibility: not recorded',
        `  Verification status: ${status}${status === 'verified' && s.verified_at ? ` (verified ${String(s.verified_at).slice(0, 10)})` : ''}`,
        s.source_url ? `  Official source: ${cleanText(s.source_url, 250)}` : '',
        s.website ? `  Website: ${cleanText(s.website, 250)}` : '',
        s.phone ? `  Phone: ${cleanText(s.phone, 40)}` : '',
        s.description ? `  Description: ${cleanText(s.description, 260)}` : '',
      ].filter(Boolean);
      return parts.join('\n');
    });

  if (ranked.length === 0) return '';

  return `SERVICES IN THE SETTLESMART DIRECTORY (the app's own records, ranked for this person — local, eligible and verified first):
${ranked.join('\n')}

HOW TO USE THE DIRECTORY:
- Recommend only services from this list, and only details written above. Never invent a service, phone number, address, website or eligibility rule.
- Prefer "verified" records, and say when a record is "pending", "review_due" or "needs_correction": describe those as not yet verified and tell the person to confirm with the organization.
- State eligibility restrictions exactly as listed, and mention when eligibility is not recorded instead of guessing.
- Include the official source or website link (a full https:// URL) when you name a service.
- If nothing in this list fits, say the directory has no match and suggest a general next step — do not imply an unlisted service exists.`;
}

// Answers a newcomer's settlement question with Nexa's grounding rules.
// The prompt is always built here, never accepted from the browser.
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json().catch(() => ({}));

    const message = cleanText(payload.message, 4000);
    if (!message) return Response.json({ error: 'A question is required.' }, { status: 400 });

    const mode = payload.mode === 'voice' ? 'voice' : 'full';
    const history = buildHistory(payload.history);
    const pageContext = cleanText(payload.pageContext, 120);
    const language = cleanText(payload.language, 40);

    const profileContext = buildProfileContext(payload.profile);
    const city = cleanText(payload.city, 80);
    const province = cleanText(payload.province, 80);
    const locationContext = !profileContext && (city || province)
      ? `The user is located in ${city ? (province ? `${city}, ${province}` : city) : province}, Canada.`
      : '';

    if (mode === 'voice') {
      const prompt = `${NEXA_SYSTEM_PROMPT}

${profileContext ? `ABOUT THIS PERSON — tailor the answer to this location and situation: ${profileContext}.` : locationContext}

${pageContext ? `${PAGE_CONTEXT} ${pageContext}` : ''}

${history ? `Conversation so far:\n${history}\n` : ''}
Newcomer said: ${message}

This reply is spoken out loud, so answer as natural speech: two or three short sentences, warm and professional, no lists, headings, emoji, links or web addresses at all. Say the name of the office or the page instead of a URL. Answer the question directly first, then give the one next step that matters, then ask one short follow-up question when it would help you guide them better. Name the official office that helps, and say where in SettleSmart to tap to continue, for example "open Explore, then Education". If the question is unclear, too vague, or the speech looks garbled, do not guess: ask one short question to confirm what they meant, and nothing else.`;

      const answer = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: true,
        model: 'gemini_3_flash',
      });
      return Response.json({ answer: spokenText(answer) });
    }

    let serviceContext = '';
    try {
      const servicePage = await base44.asServiceRole.entities.Service.filter({}, { limit: 300 });
      serviceContext = buildServiceContext(servicePage.items || [], payload.profile);
    } catch {
      serviceContext = '';
    }

    const prompt = `${NEXA_SYSTEM_PROMPT}

${profileContext ? `ABOUT THIS PERSON — tailor every answer to this location and situation instead of giving generic Canada-wide advice: ${profileContext}.` : locationContext}

${serviceContext}

${pageContext ? `${PAGE_CONTEXT} ${pageContext}` : ''}

${language ? `Reply in this language: ${language}.` : ''}

${history ? `Conversation so far:\n${history}\n` : ''}
Newcomer's message: ${message}

Reply as Nexa.`;

    const fileUri = cleanText(payload.document?.file_uri, 500);
    let fileUrls = null;
    if (fileUri) {
      try {
        const signed = await base44.asServiceRole.integrations.Core.CreateFileSignedUrl({ file_uri: fileUri, expires_in: 600 });
        if (signed?.signed_url) fileUrls = [signed.signed_url];
      } catch {
        fileUrls = null;
      }
    }

    const answer = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: fileUrls
        ? `${prompt}\n\nThe person attached a document. Read it, explain in plain language what it is and what it asks of them, then give the next steps. Never repeat full identifying numbers.`
        : prompt,
      add_context_from_internet: true,
      ...(fileUrls ? { file_urls: fileUrls } : {}),
    });

    return Response.json({ answer: typeof answer === 'string' ? answer : '' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}