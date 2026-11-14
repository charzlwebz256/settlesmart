export const ARTICLE_SCHEMA = {
  type: 'object',
  properties: {
    articles: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          summary: { type: 'string' },
          category: { type: 'string' },
          source: { type: 'string' },
          url: { type: 'string' },
          source_url: { type: 'string' },
          published_date: { type: 'string' },
          time_ago: { type: 'string' },
          is_local: { type: 'boolean' },
        },
      },
    },
    newcomer_insights: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          headline: { type: 'string' },
          insight: { type: 'string' },
          category: { type: 'string' },
        },
      },
    },
  },
};

export const SOURCE_RULES = `

For EVERY article also return:
- published_date: the original publication date in ISO format (YYYY-MM-DD).
- source_url: the direct link to that original article on the publisher's site.
- source: the publisher name (for example CBC News, Reuters, IRCC).
Never invent a date or a link. If you cannot verify the exact publication date, set published_date to an empty string.
If you cannot verify the direct article URL, set source_url to an empty string. label the summary field as your own
plain-language summary, not the publisher's text.`;

const now = () => new Date().toISOString();

export const NEWS_PROMPTS = {
  breaking: (loc, prov) => `You are a LIVE breaking news reporter. Today is ${now()}. Search for the MOST URGENT breaking news stories published in the LAST 6 HOURS globally and in Canada. CRITICAL: Only include stories published within the last 7 days. For each article, provide an EXACT time_ago in format like "12 minutes ago", "3 hours ago", "2 days ago". Do NOT include stories older than 7 days.

Location context: ${loc}${prov ? `, ${prov}` : ''}

Sources to search: BBC News (bbc.com), CNN (cnn.com), Reuters (reuters.com), Al Jazeera (aljazeera.com), CBC News (cbc.ca), CTV News, AP News, The Guardian, Globe and Mail, National Post.

Return 5 breaking news stories published TODAY — prioritize stories from the last 1-6 hours. Include: major world events, Canadian emergencies, political crises, natural disasters, major policy changes, major crimes, wars/conflicts, economic shocks.

For each: exact real headline, 2-sentence factual summary, source name, realistic time_ago (e.g. "12 min ago", "2 hrs ago", "4 hrs ago"), real or likely URL, is_local flag.

Also return 2 newcomer_insights: what these breaking stories mean for newcomers in Canada specifically.`,

  immigration: (loc, prov) => `You are an immigration news specialist. Today is ${now()}. Search for the LATEST immigration and visa policy news from the last 48 hours. CRITICAL: Only include stories published within the last 7 days. For each article, provide an EXACT time_ago in format like "45 minutes ago", "6 hours ago", "1 day ago". Do NOT include stories older than 7 days.

Sources: IRCC Canada (canada.ca/ircc), CIC News (cicnews.com), Immigration.ca, CBC News, Reuters, BBC, Al Jazeera, Globe and Mail.

Return 5 immigration stories — must include:
- IRCC Express Entry draws, PNP updates, work permit changes
- International student policy changes
- Refugee and asylum updates globally
- Visa policy changes for any country affecting newcomers
- Immigration court rulings or policy shifts
- Travel advisories affecting immigrants

Each article: exact headline, 2-sentence factual summary, source name, realistic time_ago (hours/days ago), URL, is_local (Canada-specific = true).

Also return 2 newcomer_insights specific to immigration impacts.`,

  jobs: (loc, prov) => `You are a jobs and economy reporter. Today is ${now()}. Search for LATEST jobs and economic news published in last 48 hours. CRITICAL: Only include stories published within the last 7 days. For each article, provide an EXACT time_ago in format like "30 minutes ago", "4 hours ago", "3 days ago". Do NOT include stories older than 7 days.

Location: ${loc}${prov ? `, ${prov}` : ''}

Sources: Statistics Canada, CBC News, BNN Bloomberg, Globe and Mail, Financial Post, Reuters, BBC Business, CNN Business, Indeed Canada, LinkedIn News.

Return 5 economy/jobs stories — must include:
- Canadian employment data, job numbers, unemployment stats
- Minimum wage changes by province
- Major layoffs or hiring announcements
- Cost of living, inflation, grocery price changes
- Canadian dollar / interest rate news
- Major company news affecting workers in Canada
- Gig economy / newcomer employment opportunities

Each article: exact headline, 2-sentence factual summary, source, realistic time_ago, URL, is_local.

Return 2 newcomer_insights about what these economic stories mean for newcomers job-hunting in Canada.`,

  housing: (loc, prov) => `You are a housing and real estate reporter. Today is ${now()}. Search for the LATEST housing and real estate news from the last 48-72 hours. CRITICAL: Only include stories published within the last 7 days. For each article, provide an EXACT time_ago in format like "1 hour ago", "5 hours ago", "4 days ago". Do NOT include stories older than 7 days.

Location focus: ${loc}${prov ? `, ${prov}` : ''} — but include national news.

Sources: CBC News, CTV News, Globe and Mail, Toronto Star, CMHC Canada, Canada Mortgage Housing, Bloomberg, Reuters, local real estate boards.

Return 5 housing stories — must include:
- Rent price changes and rental market updates
- Home buying/selling market data
- Eviction protection news
- Affordable housing programs (federal, provincial, municipal)
- Shelter and housing support for newcomers
- Mortgage rate changes
- New housing construction announcements

Each article: exact headline, 2-sentence factual summary, source, realistic time_ago, URL, is_local.

Return 2 newcomer_insights about housing tips and what these stories mean for newly arrived immigrants renting or buying.`,

  health: (loc, prov) => `You are a health and safety reporter. Today is ${now()}. Search for LATEST health and safety news from the last 48 hours globally and in Canada. CRITICAL: Only include stories published within the last 7 days. For each article, provide an EXACT time_ago in format like "20 minutes ago", "2 hours ago", "6 days ago". Do NOT include stories older than 7 days.

Location: ${loc}${prov ? `, ${prov}` : ''}

Sources: Health Canada, CBC News, WHO (who.int), Reuters Health, BBC Health, CNN Health, Al Jazeera, Canadian Press, provincial health authorities.

Return 5 health & safety stories — must include:
- Disease outbreaks, pandemics, new health alerts
- Drug recalls or food safety warnings in Canada
- Mental health resources and announcements
- Healthcare system updates (wait times, doctor shortages, OHIP/provincial health coverage news)
- Vaccines, immunization program updates
- Global health emergencies affecting Canada
- Safety alerts (weather, crime, environmental hazards) in ${prov || 'Canada'}

Each article: exact headline, 2-sentence factual summary, source, realistic time_ago, URL, is_local.

Return 2 newcomer_insights about health/safety topics newcomers should know.`,
};