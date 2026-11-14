import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { ARTICLE_SCHEMA, NEWS_PROMPTS, SOURCE_RULES } from '../../shared/newsBriefing.ts';
import { cleanText, safeUrl } from '../../shared/safeUrl.ts';

const EVENT_SCHEMA = {
  type: 'object',
  properties: {
    events: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          date: { type: 'string' },
          time: { type: 'string' },
          location: { type: 'string' },
          is_free: { type: 'boolean' },
          price: { type: 'string' },
          url: { type: 'string' },
          image_url: { type: 'string' },
          category: { type: 'string' },
        },
      },
    },
  },
};

function safeArticles(result) {
  const articles = Array.isArray(result?.articles) ? result.articles.slice(0, 8) : [];
  return articles.map((article) => ({
    title: cleanText(article?.title, 240),
    summary: cleanText(article?.summary, 800),
    category: cleanText(article?.category, 40),
    source: cleanText(article?.source, 80),
    url: safeUrl(article?.source_url) || safeUrl(article?.url),
    published_date: cleanText(article?.published_date, 20),
    time_ago: cleanText(article?.time_ago, 40),
    is_local: Boolean(article?.is_local),
  }));
}

// Live community events and news briefings, with every AI/web-derived link
// reduced to http(s) before it reaches the app.
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json().catch(() => ({}));
    const action = payload.action;

    if (action === 'events') {
      const city = cleanText(payload.city, 60) || 'Edmonton';
      const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `Search Eventbrite Canada for upcoming events in ${city}, Alberta. 
Visit or search: https://www.eventbrite.ca/d/canada--${city.toLowerCase()}/all-events/

Return the 8 most relevant upcoming community, cultural, workshop, or free events. Focus on events relevant to newcomers, immigrants, or community gatherings.

For each event return:
- title: event name
- date: formatted as "Day, Mon D" e.g. "Sat, May 10"
- time: start time e.g. "2:00 PM"
- location: venue name and area
- is_free: true/false
- price: price string if not free e.g. "From CA$20"
- url: full eventbrite URL
- image_url: thumbnail image URL from evbuc.com if available
- category: one of: workshop, community, social, employment, health, orientation, language, other`,
        add_context_from_internet: true,
        response_json_schema: EVENT_SCHEMA,
      });

      const events = (Array.isArray(result?.events) ? result.events.slice(0, 12) : []).map((ev) => ({
        title: cleanText(ev?.title, 200),
        date: cleanText(ev?.date, 60),
        time: cleanText(ev?.time, 60),
        location: cleanText(ev?.location, 160),
        is_free: Boolean(ev?.is_free),
        price: cleanText(ev?.price, 60),
        url: safeUrl(ev?.url),
        image_url: safeUrl(ev?.image_url),
        category: cleanText(ev?.category, 30) || 'other',
      }));

      return Response.json({ events });
    }

    if (action === 'news') {
      const topic = Object.prototype.hasOwnProperty.call(NEWS_PROMPTS, payload.topic) ? payload.topic : 'breaking';
      // No province = Canada-wide news; a chosen province carries its city
      const city = cleanText(payload.city, 60) || 'Canada';
      const province = cleanText(payload.province, 60);

      const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
        model: 'gemini_3_8_flash',
        prompt: NEWS_PROMPTS[topic](city, province) + SOURCE_RULES,
        add_context_from_internet: true,
        response_json_schema: ARTICLE_SCHEMA,
      });

      const insights = (Array.isArray(result?.newcomer_insights) ? result.newcomer_insights.slice(0, 3) : []).map((i) => ({
        headline: cleanText(i?.headline, 200),
        insight: cleanText(i?.insight, 800),
        category: cleanText(i?.category, 40),
      }));

      return Response.json({ articles: safeArticles(result), newcomer_insights: insights });
    }

    return Response.json({ error: 'Unknown action.' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}