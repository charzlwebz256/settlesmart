import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { NEXA_SYSTEM_PROMPT } from '../../shared/nexaPrompt.ts';
import { cleanText } from '../../shared/safeUrl.ts';

const VOICE_CONTEXT = `AVAILABLE SECTIONS ON THE APP:
- Home: Dashboard and main overview
- Explore: Browse settlement services, find services near you, transit maps
- Work: Job search, job tracker, interview prep, resume builder
- Resources: Legal & IRCC info, news & updates, shopping guides
- Events: Discover community events and workshops
- Checklist: 90-day settlement guide and tasks
- Emergency: Emergency contacts and crisis support
- Assistant: AI chat for detailed help
- Profile: Manage your profile and preferences`;

function buildProfileContext(profile) {
  if (!profile || typeof profile !== 'object') return '';
  const fields = [
    ['Province', profile.province],
    ['City', profile.city],
    ['Immigration status', String(profile.immigration_status || '').replace(/_/g, ' ')],
    ['Family size', profile.family_size],
    ['Arrived', profile.arrival_date],
    ['English level', profile.english_level],
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
    .slice(-8)
    .map((m) => {
      const role = m && m.role === 'user' ? 'Newcomer' : 'Nexa';
      return `${role}: ${cleanText(m && m.content, 1200)}`;
    })
    .filter((line) => line.length > 6)
    .join('\n');
}

// Answers a newcomer's settlement question with Nexa's grounding rules.
// The prompt is always built here, never accepted from the browser.
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json().catch(() => ({}));

    const message = cleanText(payload.message, 2000);
    if (!message) return Response.json({ error: 'A question is required.' }, { status: 400 });

    const mode = payload.mode === 'voice' ? 'voice' : payload.mode === 'brief' ? 'brief' : 'full';
    const history = buildHistory(payload.history);

    let prompt;
    let useWebSearch = false;

    if (mode === 'voice') {
      const siteContext = cleanText(payload.siteContext, 200);
      prompt = `You are a helpful voice AI assistant for SettleSmart Canada, a newcomer settlement platform.

${VOICE_CONTEXT}

${siteContext ? `Current app data: ${siteContext}` : ''}

YOUR ROLE: Provide CLEAR RECOMMENDATIONS and STEP-BY-STEP GUIDANCE on what to do.

For each question:
1. Understand their need
2. Recommend which section or tool they should use (give specific tab/page names)
3. Explain what they'll find there
4. Provide clear, actionable next steps

Keep responses under 80 words and speak naturally.
Be warm, directive, and guide them to the RIGHT SECTION FOR THEIR NEED.

User question: "${message}"`;
    } else {
      const profileContext = buildProfileContext(payload.profile);
      const city = cleanText(payload.city, 80);
      const province = cleanText(payload.province, 80);
      const locationContext = !profileContext && (city || province)
        ? `The user is located in ${city ? (province ? `${city}, ${province}` : city) : province}, Canada.`
        : '';
      useWebSearch = mode === 'full';

      prompt = `${NEXA_SYSTEM_PROMPT}

${profileContext ? `About this person — tailor every answer to this location and situation instead of giving generic Canada-wide advice: ${profileContext}.` : locationContext}

${history ? `Conversation so far:\n${history}\n` : ''}
Newcomer's question: ${message}

Reply as Nexa.`;
    }

    const answer = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: useWebSearch,
    });

    return Response.json({ answer: typeof answer === 'string' ? answer : '' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}