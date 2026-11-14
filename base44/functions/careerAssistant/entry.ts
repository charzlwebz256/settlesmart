import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { cleanText, safeUrl } from '../../shared/safeUrl.ts';

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
          job_type: { type: 'string' },
          experience_level: { type: 'string' },
          salary: { type: 'string' },
          posted: { type: 'string' },
          url: { type: 'string' },
          source: { type: 'string' },
          is_newcomer_friendly: { type: 'boolean' },
        },
      },
    },
  },
};

const QUESTIONS_SCHEMA = {
  type: 'object',
  properties: { questions: { type: 'array', items: { type: 'string' } } },
};

const OPTIMIZE_SCHEMA = {
  type: 'object',
  properties: {
    missing_keywords: { type: 'array', items: { type: 'string' } },
    tips: { type: 'array', items: { type: 'string' } },
    match_score: { type: 'number' },
  },
};

function jobPrompt(searchTerm, location) {
  return `Find 10 real current job listings for "${searchTerm}" in ${location}, Canada. Sources: LinkedIn, Indeed Canada (ca.indeed.com), Job Bank Canada, ZipRecruiter. Newcomer-friendly roles. For each job return: title, company, location (city), job_type (full_time/part_time/contract/remote), experience_level (entry/mid/senior), salary (short or empty), posted (e.g. "2d"), url (must be a direct link to the actual job posting, e.g. https://ca.indeed.com/viewjob?jk=JOBID or https://www.linkedin.com/jobs/view/JOBID), source (linkedin/indeed/jobbank/ziprecruiter), is_newcomer_friendly (boolean).`;
}

// Career tools: job search, interview practice and resume writing prompts.
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json().catch(() => ({}));
    const action = payload.action;
    const llm = (args) => base44.asServiceRole.integrations.Core.InvokeLLM(args);

    if (action === 'job_search') {
      const searchTerm = cleanText(payload.searchTerm, 80) || 'newcomer immigrant jobs';
      const location = cleanText(payload.location, 80) || 'Canada';

      const batches = await Promise.all([
        llm({ prompt: jobPrompt(searchTerm, location), add_context_from_internet: true, response_json_schema: JOB_SCHEMA }),
        llm({ prompt: jobPrompt(searchTerm, location) + ' Return different postings than a typical first page of results.', add_context_from_internet: true, response_json_schema: JOB_SCHEMA }),
      ]);

      const jobs = batches
        .flatMap((batch) => (Array.isArray(batch?.jobs) ? batch.jobs : []))
        .slice(0, 20)
        .map((job) => ({
          title: cleanText(job?.title, 140),
          company: cleanText(job?.company, 100),
          location: cleanText(job?.location, 100),
          job_type: cleanText(job?.job_type, 30),
          experience_level: cleanText(job?.experience_level, 30),
          salary: cleanText(job?.salary, 60),
          posted: cleanText(job?.posted, 30),
          url: safeUrl(job?.url),
          source: cleanText(job?.source, 30),
          is_newcomer_friendly: Boolean(job?.is_newcomer_friendly),
        }))
        .filter((job) => job.title && job.company);

      return Response.json({ jobs });
    }

    if (action === 'interview_questions') {
      const jobTitle = cleanText(payload.jobTitle, 120);
      if (!jobTitle) return Response.json({ error: 'A job title is required.' }, { status: 400 });
      const category = cleanText(payload.category, 40) || 'general';
      const jobDescription = cleanText(payload.jobDescription, 700);

      const result = await llm({
        prompt: `You are a Canadian interview coach. Generate 6 ${category} interview questions for a "${jobTitle}" position in Canada.
${jobDescription ? `Job description context: ${jobDescription}` : ''}
Make questions relevant to the Canadian workplace (diversity, teamwork, Canadian standards).
Return them as a JSON array of strings.`,
        response_json_schema: QUESTIONS_SCHEMA,
      });

      const questions = (Array.isArray(result?.questions) ? result.questions.slice(0, 8) : [])
        .map((q) => cleanText(q, 300))
        .filter(Boolean);

      return Response.json({ questions });
    }

    if (action === 'interview_feedback') {
      const jobTitle = cleanText(payload.jobTitle, 120);
      const question = cleanText(payload.question, 400);
      const answer = cleanText(payload.answer, 3000);
      if (!question || !answer) return Response.json({ error: 'A question and an answer are required.' }, { status: 400 });

      const feedback = await llm({
        prompt: `You are an expert Canadian interview coach. Evaluate this interview answer.

Job Role: ${jobTitle || 'the role'}
Question: ${question}
Candidate's Answer: ${answer}

Provide structured feedback with:
1. **Score** (out of 10) — with a brief reason
2. **What worked well** — 1-2 specific positives
3. **What to improve** — 1-2 actionable suggestions
4. **Stronger example answer** — a concise improved version using STAR method if applicable
5. **Canadian context tip** — one specific tip for Canadian workplace culture

Keep it concise, warm, and encouraging.`,
      });

      return Response.json({ feedback: typeof feedback === 'string' ? feedback : '' });
    }

    if (action === 'resume_bullet') {
      const bullet = cleanText(payload.bullet, 500);
      if (!bullet) return Response.json({ error: 'A bullet point is required.' }, { status: 400 });
      const tone = cleanText(payload.tone, 40) || 'Professional';

      const text = await llm({
        prompt: `Rewrite this work experience bullet point using strong Canadian job market language. Use an action verb, quantify achievements where possible, keep it concise (1 sentence). Tone: ${tone}.\n\nOriginal: "${bullet}"\n\nReturn only the rewritten bullet, no quotes.`,
      });

      return Response.json({ text: typeof text === 'string' ? text : '' });
    }

    if (action === 'resume_summary') {
      const jobTitles = cleanText(payload.jobTitles, 300);
      const skills = cleanText(payload.skills, 400);
      const jobDescription = cleanText(payload.jobDescription, 250);
      const tone = cleanText(payload.tone, 40) || 'Professional';
      const format = cleanText(payload.format, 40) || 'Chronological';

      const text = await llm({
        prompt: `Write a 2-3 sentence professional summary for a Canadian resume. Tone: ${tone}. Format: ${format}. The person has experience in: ${jobTitles || 'various roles'}. Skills include: ${skills || 'various skills'}. ${jobDescription ? `They are applying for: ${jobDescription}` : ''}\n\nFollow Canadian standards: no personal details, focus on value to employer, use strong professional language. Return only the summary text.`,
      });

      return Response.json({ text: typeof text === 'string' ? text : '' });
    }

    if (action === 'resume_optimize') {
      const jobDescription = cleanText(payload.jobDescription, 3000);
      if (!jobDescription) return Response.json({ error: 'A job description is required.' }, { status: 400 });
      const skills = cleanText(payload.skills, 600);
      const experience = cleanText(payload.experience, 600);

      const result = await llm({
        prompt: `Analyze this job description and provide resume optimization tips for a Canadian job application. Return as JSON.\n\nJob Description:\n${jobDescription}\n\nCurrent Skills: ${skills}\nCurrent Experience: ${experience}`,
        response_json_schema: OPTIMIZE_SCHEMA,
      });

      return Response.json({
        missing_keywords: (Array.isArray(result?.missing_keywords) ? result.missing_keywords.slice(0, 15) : []).map((k) => cleanText(k, 60)),
        tips: (Array.isArray(result?.tips) ? result.tips.slice(0, 10) : []).map((t) => cleanText(t, 300)),
        match_score: Number(result?.match_score) || 0,
      });
    }

    if (action === 'cover_letter') {
      const jobTitle = cleanText(payload.jobTitle, 120);
      const company = cleanText(payload.company, 120);
      const jobDesc = cleanText(payload.jobDescription, 500);
      const tone = cleanText(payload.tone, 40) || 'Professional';
      const lang = payload.lang === 'fr' ? 'fr' : 'en';
      const contact = payload.contact && typeof payload.contact === 'object' ? payload.contact : {};
      const resumeJobs = Array.isArray(payload.jobs) ? payload.jobs.slice(0, 3) : [];
      const skills = cleanText(payload.skills, 400);
      const summary = cleanText(payload.summary, 600);

      const experienceLine = resumeJobs
        .map((j) => `${cleanText(j?.title, 80)} at ${cleanText(j?.company, 80)}`)
        .filter((line) => line.trim() !== 'at')
        .join('; ') || 'various roles';

      const prompt = lang === 'fr'
        ? `Rédigez une lettre de motivation professionnelle en français pour un poste de ${jobTitle || 'poste non précisé'} chez ${company || "l'entreprise"}. Suivez la structure canadienne standard.`
        : `Write a professional Canadian cover letter for the position of "${jobTitle || 'the advertised position'}" at "${company || 'your company'}".

Follow Canadian cover letter structure:
1. Opening paragraph: State position applying for and express genuine interest. Mention where you found the job.
2. Body paragraph 1: Highlight 2-3 most relevant skills and experiences that match the role. Use specific examples.
3. Body paragraph 2: Show knowledge of the company/sector and explain why you are a great cultural fit.
4. Closing paragraph: Thank the employer, express eagerness for an interview, include professional sign-off.

Details about the applicant:
- Name: ${cleanText(contact.fullName, 100) || '[Applicant Name]'}
- City/Province: ${cleanText(contact.city, 80)}${contact.province ? `, ${cleanText(contact.province, 80)}` : ''}
- Recent experience: ${experienceLine}
- Key skills: ${skills || 'various professional skills'}
- Professional summary: ${summary}
${jobDesc ? `\nJob description to align with:\n${jobDesc}` : ''}

Tone: ${tone}. Language: Canadian English. Keep it to 3–4 paragraphs, under 350 words. No overly emotional language. Include "[Today's Date]" as placeholder. Start with "Dear Hiring Manager," or "Dear [Name]," if company is known. End with "Sincerely," and the applicant's name.`;

      const letter = await llm({ prompt });
      return Response.json({ letter: typeof letter === 'string' ? letter : '' });
    }

    return Response.json({ error: 'Unknown action.' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}