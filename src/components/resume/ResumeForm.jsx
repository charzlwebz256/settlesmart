import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Trash2, Sparkles, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const FORMATS = [
  { id: 'reverse_chronological', label: 'Reverse-Chronological', desc: 'Best for most job seekers. Lists recent experience first.' },
  { id: 'functional', label: 'Functional', desc: 'Focuses on skills. Great for career changers or gaps.' },
  { id: 'hybrid', label: 'Hybrid', desc: 'Combines both. Ideal for newcomers & experienced professionals.' },
];

const TONES = ['Professional', 'Confident', 'Entry-Level'];
const SKILL_CATEGORIES = ['Technical', 'Soft Skills', 'Language', 'Other'];

const emptyJob = () => ({ title: '', company: '', location: '', start: '', end: '', current: false, bullets: [''] });
const emptyEdu = () => ({ degree: '', school: '', location: '', year: '', field: '' });
const emptyCert = () => ({ name: '', issuer: '', year: '' });
const emptyVolunteer = () => ({ role: '', org: '', period: '', description: '' });

export default function ResumeForm({ onSave }) {
  const [format, setFormat] = useState('reverse_chronological');
  const [tone, setTone] = useState('Professional');
  const [lang, setLang] = useState('en');
  const [contact, setContact] = useState({ fullName: '', email: '', phone: '', city: '', province: '', linkedin: '' });
  const [summary, setSummary] = useState('');
  const [jobs, setJobs] = useState([emptyJob()]);
  const [education, setEducation] = useState([emptyEdu()]);
  const [skills, setSkills] = useState([{ category: 'Technical', items: '' }, { category: 'Soft Skills', items: '' }]);
  const [certs, setCerts] = useState([]);
  const [volunteer, setVolunteer] = useState([]);
  const [jobDesc, setJobDesc] = useState('');
  const [loadingAI, setLoadingAI] = useState('');
  const [openSection, setOpenSection] = useState('contact');
  const [tips, setTips] = useState([]);

  const toggle = (sec) => setOpenSection(openSection === sec ? '' : sec);

  const aiEnhanceBullet = async (jobIdx, bulletIdx) => {
    const bullet = jobs[jobIdx].bullets[bulletIdx];
    if (!bullet.trim()) return;
    setLoadingAI(`bullet-${jobIdx}-${bulletIdx}`);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Rewrite this work experience bullet point using strong Canadian job market language. Use an action verb, quantify achievements where possible, keep it concise (1 sentence). Tone: ${tone}.\n\nOriginal: "${bullet}"\n\nReturn only the rewritten bullet, no quotes.`,
    });
    const updated = jobs.map((j, i) => i === jobIdx ? {
      ...j, bullets: j.bullets.map((b, bi) => bi === bulletIdx ? result : b)
    } : j);
    setJobs(updated);
    setLoadingAI('');
  };

  const aiGenerateSummary = async () => {
    setLoadingAI('summary');
    const jobTitles = jobs.map(j => j.title).filter(Boolean).join(', ');
    const skillList = skills.map(s => s.items).join(', ');
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Write a 2-3 sentence professional summary for a Canadian resume. Tone: ${tone}. Format: ${format}. The person has experience in: ${jobTitles || 'various roles'}. Skills include: ${skillList || 'various skills'}. ${jobDesc ? `They are applying for: ${jobDesc.slice(0, 200)}` : ''}\n\nFollow Canadian standards: no personal details, focus on value to employer, use strong professional language. Return only the summary text.`,
    });
    setSummary(result);
    setLoadingAI('');
  };

  const aiOptimizeForJob = async () => {
    if (!jobDesc.trim()) return;
    setLoadingAI('optimize');
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyze this job description and provide resume optimization tips for a Canadian job application. Return as JSON.\n\nJob Description:\n${jobDesc}\n\nCurrent Skills: ${skills.map(s => s.items).join(', ')}\nCurrent Experience: ${jobs.map(j => `${j.title} at ${j.company}`).join(', ')}`,
      response_json_schema: {
        type: 'object',
        properties: {
          missing_keywords: { type: 'array', items: { type: 'string' } },
          tips: { type: 'array', items: { type: 'string' } },
          match_score: { type: 'number' },
        },
      },
    });
    setTips(result?.tips || []);
    setLoadingAI('');
  };

  const handleSave = () => {
    onSave({ contact, summary, jobs, education, skills, certs, volunteer, format, tone, lang, jobDesc });
  };

  const SectionHeader = ({ id, label, emoji }) => (
    <button onClick={() => toggle(id)} className="w-full flex items-center justify-between py-3 px-4 bg-card border border-border/50 rounded-xl hover:border-primary/30 transition-colors">
      <span className="font-semibold text-sm flex items-center gap-2">{emoji} {label}</span>
      {openSection === id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
    </button>
  );

  const inputCls = "w-full px-3 py-2 rounded-lg border border-border/60 bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none";
  const labelCls = "text-xs font-medium text-muted-foreground mb-1 block";

  return (
    <div className="space-y-3">
      {/* Format & Tone */}
      <div className="bg-card border border-border/50 rounded-xl p-4 space-y-4">
        <p className="font-semibold text-sm">⚙️ Resume Settings</p>
        <div>
          <label className={labelCls}>Resume Format</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {FORMATS.map(f => (
              <button key={f.id} onClick={() => setFormat(f.id)}
                className={cn("p-3 rounded-xl border text-left transition-all", format === f.id ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/30')}>
                <p className="text-xs font-semibold">{f.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{f.desc}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-32">
            <label className={labelCls}>Tone</label>
            <div className="flex gap-1.5">
              {TONES.map(t => (
                <button key={t} onClick={() => setTone(t)}
                  className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all", tone === t ? 'bg-primary text-primary-foreground border-primary' : 'border-border/50 text-muted-foreground hover:border-primary/30')}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelCls}>Language</label>
            <div className="flex gap-1.5">
              {[['en', '🇨🇦 English'], ['fr', '🇫🇷 French']].map(([code, label]) => (
                <button key={code} onClick={() => setLang(code)}
                  className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all", lang === code ? 'bg-primary text-primary-foreground border-primary' : 'border-border/50 text-muted-foreground hover:border-primary/30')}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Job Description Paste */}
      <div className="bg-card border border-border/50 rounded-xl p-4 space-y-2">
        <p className="font-semibold text-sm flex items-center gap-2">🎯 Job Description Matching <span className="text-[10px] font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Optional</span></p>
        <p className="text-xs text-muted-foreground">Paste a job posting to align your resume and get keyword optimization tips.</p>
        <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)} rows={3}
          placeholder="Paste the job description here..."
          className={`${inputCls} resize-none`} />
        {jobDesc.trim() && (
          <Button size="sm" variant="outline" onClick={aiOptimizeForJob} disabled={loadingAI === 'optimize'} className="gap-1.5 text-xs rounded-lg border-primary/30 text-primary">
            {loadingAI === 'optimize' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            Analyze & Optimize
          </Button>
        )}
        {tips.length > 0 && (
          <div className="space-y-1.5 mt-2">
            {tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 bg-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2">
                <Info className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 dark:text-amber-300">{tip}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Info */}
      <div className="space-y-2">
        <SectionHeader id="contact" label="Contact Information" emoji="👤" />
        {openSection === 'contact' && (
          <div className="bg-card border border-border/50 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[['fullName','Full Name *'],['email','Email Address *'],['phone','Phone Number'],['city','City'],['province','Province'],['linkedin','LinkedIn URL']].map(([key, placeholder]) => (
              <div key={key}>
                <label className={labelCls}>{placeholder}</label>
                <input value={contact[key]} onChange={e => setContact({...contact, [key]: e.target.value})} placeholder={placeholder} className={inputCls} />
              </div>
            ))}
            <div className="sm:col-span-2 bg-blue-500/5 border border-blue-500/20 rounded-lg px-3 py-2 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-blue-700 dark:text-blue-300">Canadian standard: Do NOT include photo, age, gender, marital status, or SIN number on your resume.</p>
            </div>
          </div>
        )}
      </div>

      {/* Professional Summary */}
      <div className="space-y-2">
        <SectionHeader id="summary" label="Professional Summary" emoji="📋" />
        {openSection === 'summary' && (
          <div className="bg-card border border-border/50 rounded-xl p-4 space-y-3">
            <textarea value={summary} onChange={e => setSummary(e.target.value)} rows={4}
              placeholder="Write a 2-3 sentence summary highlighting your key value to employers..."
              className={`${inputCls} resize-none`} />
            <Button size="sm" onClick={aiGenerateSummary} disabled={loadingAI === 'summary'} className="gap-1.5 text-xs rounded-lg bg-primary">
              {loadingAI === 'summary' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              AI Generate Summary
            </Button>
          </div>
        )}
      </div>

      {/* Work Experience */}
      <div className="space-y-2">
        <SectionHeader id="experience" label="Work Experience" emoji="💼" />
        {openSection === 'experience' && (
          <div className="bg-card border border-border/50 rounded-xl p-4 space-y-4">
            {jobs.map((job, idx) => (
              <div key={idx} className="border border-border/40 rounded-xl p-3 space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-semibold text-muted-foreground">Position {idx + 1}</p>
                  {jobs.length > 1 && (
                    <button onClick={() => setJobs(jobs.filter((_, i) => i !== idx))} className="p-1 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div><label className={labelCls}>Job Title *</label><input value={job.title} onChange={e => setJobs(jobs.map((j,i)=>i===idx?{...j,title:e.target.value}:j))} placeholder="e.g. Customer Service Representative" className={inputCls} /></div>
                  <div><label className={labelCls}>Company *</label><input value={job.company} onChange={e => setJobs(jobs.map((j,i)=>i===idx?{...j,company:e.target.value}:j))} placeholder="Company name" className={inputCls} /></div>
                  <div><label className={labelCls}>Location</label><input value={job.location} onChange={e => setJobs(jobs.map((j,i)=>i===idx?{...j,location:e.target.value}:j))} placeholder="City, Province" className={inputCls} /></div>
                  <div className="flex gap-2">
                    <div className="flex-1"><label className={labelCls}>Start Date</label><input value={job.start} onChange={e => setJobs(jobs.map((j,i)=>i===idx?{...j,start:e.target.value}:j))} placeholder="MM/YYYY" className={inputCls} /></div>
                    <div className="flex-1"><label className={labelCls}>End Date</label><input value={job.end} onChange={e => setJobs(jobs.map((j,i)=>i===idx?{...j,end:e.target.value}:j))} placeholder="MM/YYYY or Present" className={inputCls} /></div>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Key Accomplishments (use action verbs)</label>
                  {job.bullets.map((b, bi) => (
                    <div key={bi} className="flex gap-1.5 mb-1.5">
                      <span className="text-primary font-bold text-sm mt-2 flex-shrink-0">•</span>
                      <input value={b} onChange={e => setJobs(jobs.map((j,i)=>i===idx?{...j,bullets:j.bullets.map((bl,bli)=>bli===bi?e.target.value:bl)}:j))} placeholder='e.g. "Managed team of 5, improving efficiency by 20%"' className={`${inputCls} flex-1`} />
                      <button onClick={() => aiEnhanceBullet(idx, bi)} disabled={!!loadingAI} title="AI enhance" className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors flex-shrink-0">
                        {loadingAI === `bullet-${idx}-${bi}` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      </button>
                      {job.bullets.length > 1 && (
                        <button onClick={() => setJobs(jobs.map((j,i)=>i===idx?{...j,bullets:j.bullets.filter((_,bli)=>bli!==bi)}:j))} className="p-2 text-muted-foreground hover:text-destructive rounded-lg transition-colors flex-shrink-0">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => setJobs(jobs.map((j,i)=>i===idx?{...j,bullets:[...j.bullets,'']}:j))} className="text-xs text-primary font-semibold flex items-center gap-1 hover:opacity-70 mt-1">
                    <Plus className="w-3 h-3" /> Add bullet
                  </button>
                </div>
              </div>
            ))}
            <Button size="sm" variant="outline" onClick={() => setJobs([...jobs, emptyJob()])} className="gap-1.5 text-xs rounded-lg">
              <Plus className="w-3 h-3" /> Add Position
            </Button>
          </div>
        )}
      </div>

      {/* Education */}
      <div className="space-y-2">
        <SectionHeader id="education" label="Education" emoji="🎓" />
        {openSection === 'education' && (
          <div className="bg-card border border-border/50 rounded-xl p-4 space-y-4">
            {education.map((edu, idx) => (
              <div key={idx} className="border border-border/40 rounded-xl p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-semibold text-muted-foreground">Education {idx + 1}</p>
                  {education.length > 1 && <button onClick={() => setEducation(education.filter((_,i)=>i!==idx))} className="p-1 text-destructive hover:bg-destructive/10 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div><label className={labelCls}>Degree / Diploma *</label><input value={edu.degree} onChange={e => setEducation(education.map((ed,i)=>i===idx?{...ed,degree:e.target.value}:ed))} placeholder="e.g. Bachelor of Science" className={inputCls} /></div>
                  <div><label className={labelCls}>Field of Study</label><input value={edu.field} onChange={e => setEducation(education.map((ed,i)=>i===idx?{...ed,field:e.target.value}:ed))} placeholder="e.g. Computer Science" className={inputCls} /></div>
                  <div><label className={labelCls}>School / University *</label><input value={edu.school} onChange={e => setEducation(education.map((ed,i)=>i===idx?{...ed,school:e.target.value}:ed))} placeholder="Institution name" className={inputCls} /></div>
                  <div className="flex gap-2">
                    <div className="flex-1"><label className={labelCls}>Location</label><input value={edu.location} onChange={e => setEducation(education.map((ed,i)=>i===idx?{...ed,location:e.target.value}:ed))} placeholder="City, Country" className={inputCls} /></div>
                    <div className="w-24"><label className={labelCls}>Year</label><input value={edu.year} onChange={e => setEducation(education.map((ed,i)=>i===idx?{...ed,year:e.target.value}:ed))} placeholder="YYYY" className={inputCls} /></div>
                  </div>
                </div>
              </div>
            ))}
            <Button size="sm" variant="outline" onClick={() => setEducation([...education, emptyEdu()])} className="gap-1.5 text-xs rounded-lg"><Plus className="w-3 h-3" /> Add Education</Button>
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="space-y-2">
        <SectionHeader id="skills" label="Skills" emoji="⚡" />
        {openSection === 'skills' && (
          <div className="bg-card border border-border/50 rounded-xl p-4 space-y-3">
            {skills.map((skill, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <select value={skill.category} onChange={e => setSkills(skills.map((s,i)=>i===idx?{...s,category:e.target.value}:s))}
                  className="px-2 py-2 rounded-lg border border-border/60 bg-background text-xs font-semibold w-32 flex-shrink-0">
                  {SKILL_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <input value={skill.items} onChange={e => setSkills(skills.map((s,i)=>i===idx?{...s,items:e.target.value}:s))}
                  placeholder="Comma-separated skills (e.g. Excel, Python, Communication)" className={`${inputCls} flex-1`} />
                {skills.length > 1 && <button onClick={() => setSkills(skills.filter((_,i)=>i!==idx))} className="p-2 text-muted-foreground hover:text-destructive rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>}
              </div>
            ))}
            <Button size="sm" variant="outline" onClick={() => setSkills([...skills, { category: 'Other', items: '' }])} className="gap-1.5 text-xs rounded-lg"><Plus className="w-3 h-3" /> Add Skill Category</Button>
          </div>
        )}
      </div>

      {/* Certifications */}
      <div className="space-y-2">
        <SectionHeader id="certs" label="Certifications" emoji="🏅" />
        {openSection === 'certs' && (
          <div className="bg-card border border-border/50 rounded-xl p-4 space-y-3">
            <p className="text-xs text-muted-foreground">Common in Canada: First Aid/CPR, WHMIS, Food Safety, Forklift, AZ/DZ License</p>
            {certs.map((cert, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input value={cert.name} onChange={e => setCerts(certs.map((c,i)=>i===idx?{...c,name:e.target.value}:c))} placeholder="Certification name" className={`${inputCls} flex-1`} />
                <input value={cert.issuer} onChange={e => setCerts(certs.map((c,i)=>i===idx?{...c,issuer:e.target.value}:c))} placeholder="Issuer" className={`${inputCls} w-32`} />
                <input value={cert.year} onChange={e => setCerts(certs.map((c,i)=>i===idx?{...c,year:e.target.value}:c))} placeholder="Year" className={`${inputCls} w-20`} />
                <button onClick={() => setCerts(certs.filter((_,i)=>i!==idx))} className="p-2 text-muted-foreground hover:text-destructive rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
            <Button size="sm" variant="outline" onClick={() => setCerts([...certs, emptyCert()])} className="gap-1.5 text-xs rounded-lg"><Plus className="w-3 h-3" /> Add Certification</Button>
          </div>
        )}
      </div>

      {/* Volunteer */}
      <div className="space-y-2">
        <SectionHeader id="volunteer" label="Volunteer Experience" emoji="🤝" />
        {openSection === 'volunteer' && (
          <div className="bg-card border border-border/50 rounded-xl p-4 space-y-3">
            <p className="text-xs text-muted-foreground">Volunteer work is highly valued by Canadian employers and shows community integration.</p>
            {volunteer.map((v, idx) => (
              <div key={idx} className="border border-border/40 rounded-xl p-3 space-y-2">
                <div className="flex justify-between">
                  <p className="text-xs font-semibold text-muted-foreground">Volunteer {idx + 1}</p>
                  <button onClick={() => setVolunteer(volunteer.filter((_,i)=>i!==idx))} className="p-1 text-destructive hover:bg-destructive/10 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div><label className={labelCls}>Role</label><input value={v.role} onChange={e => setVolunteer(volunteer.map((vo,i)=>i===idx?{...vo,role:e.target.value}:vo))} placeholder="Volunteer role" className={inputCls} /></div>
                  <div><label className={labelCls}>Organization</label><input value={v.org} onChange={e => setVolunteer(volunteer.map((vo,i)=>i===idx?{...vo,org:e.target.value}:vo))} placeholder="Organization name" className={inputCls} /></div>
                  <div><label className={labelCls}>Period</label><input value={v.period} onChange={e => setVolunteer(volunteer.map((vo,i)=>i===idx?{...vo,period:e.target.value}:vo))} placeholder="e.g. Jan 2023 – Present" className={inputCls} /></div>
                  <div><label className={labelCls}>Description</label><input value={v.description} onChange={e => setVolunteer(volunteer.map((vo,i)=>i===idx?{...vo,description:e.target.value}:vo))} placeholder="Brief description" className={inputCls} /></div>
                </div>
              </div>
            ))}
            <Button size="sm" variant="outline" onClick={() => setVolunteer([...volunteer, emptyVolunteer()])} className="gap-1.5 text-xs rounded-lg"><Plus className="w-3 h-3" /> Add Volunteer Experience</Button>
          </div>
        )}
      </div>

      {/* Save */}
      <div className="pt-2">
        <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90 rounded-xl h-12 text-base font-semibold gap-2">
          Generate Resume Preview →
        </Button>
      </div>
    </div>
  );
}