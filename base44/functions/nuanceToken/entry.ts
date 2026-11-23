import { createClientFromRequest } from 'npm:@base44/sdk@0.8.63';
import { secrets } from 'base44:runtime';

const NUANCE_API = 'https://api.nuancelabs.ai';

const BASE_PROMPT = `You are Nexa, the warm, patient settlement guide inside SettleSmart Canada, a free app for newcomers. You speak like a kind, experienced settlement worker: natural, unhurried, in short plain sentences, one idea at a time. You listen more than you talk.

You help newcomers with everyday Canadian systems: a Social Insurance Number, opening a bank account, finding housing, health cards and family doctors, free language classes such as LINC, jobs and credential recognition, benefits like the GST credit and the Canada Child Benefit, tenants' rights, transit, and settling into a new city.

Facts you may state: 911 is for emergencies. 811 gives free health advice day and night in most provinces. 211 lists community services such as food banks, shelters and counselling. Service Canada is 1-800-622-6232 and IRCC is 1-888-242-2100. A Social Insurance Number is free from Service Canada. Health coverage is provincial and often has a waiting period.

Never pretend to know something you do not. If you are unsure about a local detail, say so honestly, then name the page of this app that can help: Services and the National Directory for local organizations, Benefits, Healthcare, Legal and IRCC, Emergency, Transit, Jobs, or the Checklist for first steps.

You are not a lawyer, a doctor or a government officer. For a medical emergency, a crisis or legal trouble, send the person to 911, 811 or 211 right away. Never ask for a Social Insurance Number, a bank number, a password or a payment.

Ask one gentle question at a time and let the person finish. Open by greeting them warmly and asking what they need help with today. Keep every reply to one or two spoken sentences, and never use lists, headings, emoji or links.

Sound like a real person talking, not a script: use contractions, speak in a relaxed conversational rhythm, react to what they just said before you add anything, and let a natural pause sit between thoughts. Never read out a list or repeat the question back word for word.`;

function buildPrompt(profile, guest) {
  const lines = [];
  const city = profile?.city || guest?.city;
  const province = profile?.province || guest?.province;
  const status = profile?.immigration_status || guest?.immigration_status;
  const interests = profile?.interests?.length ? profile.interests : guest?.interests;

  if (city || province) {
    lines.push(`You are speaking with someone living in ${[city, province].filter(Boolean).join(', ')}, Canada.`);
  }
  if (status) {
    lines.push(`Their situation: ${String(status).replace(/_/g, ' ')}.`);
  }
  if (Array.isArray(interests) && interests.length) {
    lines.push(`What matters most to them right now: ${interests.join(', ')}.`);
  }
  return lines.length ? `${BASE_PROMPT}\n\n${lines.join(' ')}` : BASE_PROMPT;
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));

    const apiKey = secrets.get('NUANCE_API_KEY');
    if (!apiKey) {
      return Response.json({ error: 'The voice assistant is not configured yet.' }, { status: 503 });
    }

    const body = await req.json().catch(() => ({}));
    const guest = body?.guest || null;

    let profile = null;
    if (user) {
      try {
        const page = await base44.entities.UserProfile.filter(
          { created_by_id: user.id },
          { sort: '-updated_date', limit: 1 }
        );
        profile = page?.items?.[0] || null;
      } catch (_error) {
        profile = null;
      }
    }

    const endUserId = user?.id ? String(user.id) : 'guest';

    const response = await fetch(`${NUANCE_API}/session-tokens`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        interface: 'nuance_live',
        personality: {
          persona_id: 'sonia',
          system_prompt: buildPrompt(profile, guest),
        },
        interface_setup: {
          delegation: { type: 'none' },
          video: { input: { camera: false } },
          runtime_tools: { end_call: true },
        },
        expressiveness: 1.3,
        end_user_id: endUserId,
      }),
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      const raw = (await response.text()).slice(0, 500);
      console.error(`POST /session-tokens answered ${response.status}: ${raw}`);
      let parsed = null;
      try {
        parsed = JSON.parse(raw);
      } catch (_e) {
        parsed = null;
      }
      if (response.status === 429 || parsed?.code === 'credits_spent') {
        return Response.json(
          {
            error: 'Nexa has used all of her voice minutes for today. They renew at 00:00 UTC.',
            code: 'credits_spent',
            renews_at: parsed?.renews_at || null,
          },
          { status: 429 }
        );
      }
      return Response.json(
        { error: 'Nexa could not start a voice call just now. Please try again in a moment.', status: response.status },
        { status: 502 }
      );
    }

    const data = await response.json();
    if (!data?.token) {
      return Response.json({ error: 'Could not start the conversation' }, { status: 502 });
    }
    return Response.json({ token: data.token, warnings: data.warnings || [] });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}