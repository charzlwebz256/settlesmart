import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { cleanText, sendToUser } from '../../shared/alertEmail.ts';

const JOB_SCHEMA = {
  type: 'object',
  properties: {
    jobs: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          company: { type: 'string' },
          location: { type: 'string' },
          salary: { type: 'string' },
          url: { type: 'string' },
        },
      },
    },
  },
};

// Sends a job-search alert to the signed-in user's own account email.
// The recipient is never accepted from the request.
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: 'Please sign in to set a job alert.' }, { status: 401 });
    if (!user.email) return Response.json({ error: 'This account has no email address.' }, { status: 400 });

    const payload = await req.json().catch(() => ({}));
    const jobTitle = cleanText(payload.jobTitle, 80);
    const location = cleanText(payload.location, 80) || 'Canada';
    if (!jobTitle) return Response.json({ error: 'A job title or keyword is required.' }, { status: 400 });

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Search LinkedIn Jobs and Indeed Canada for current job listings matching:
- Job title/keyword: "${jobTitle}"
- Location: ${location}

Find the top 5 most relevant current job postings. For each include:
- title, company, location, job_type, salary (if available), posted, url (LinkedIn or Indeed link), source

Return as JSON.`,
      add_context_from_internet: true,
      response_json_schema: JOB_SCHEMA,
    });

    const jobs = Array.isArray(result?.jobs) ? result.jobs.slice(0, 5) : [];
    const jobList = jobs.map((j, i) => {
      const line = `${i + 1}. ${cleanText(j.title, 120)} at ${cleanText(j.company, 80)} — ${cleanText(j.location, 80)}`;
      const salary = j.salary ? ` · ${cleanText(j.salary, 60)}` : '';
      const url = j.url ? `\n   ${cleanText(j.url, 300)}` : '';
      return `${line}${salary}${url}`;
    }).join('\n\n');

    const body = [
      'Hi there,',
      '',
      `Here are the latest job matches for "${jobTitle}" in ${location}:`,
      '',
      jobList || "No new listings found right now. We'll keep searching!",
      '',
      '---',
      'Search more jobs:',
      `• LinkedIn: https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(jobTitle)}&location=${encodeURIComponent(location + ' Canada')}`,
      `• Indeed: https://ca.indeed.com/jobs?q=${encodeURIComponent(jobTitle)}&l=${encodeURIComponent(location)}`,
      '',
      'This alert was sent from SettleSmart Canada to the email on your account.',
      '',
      'Good luck with your job search!',
    ].join('\n');

    await sendToUser(base44, user.email, `Job Alert: ${jobTitle} in ${location}`, body);

    return Response.json({ ok: true, sentTo: user.email, count: jobs.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}