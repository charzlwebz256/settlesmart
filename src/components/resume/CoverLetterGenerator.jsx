import { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Download, Copy, CheckCircle2, RefreshCw } from 'lucide-react';

const TONES = ['Professional', 'Confident', 'Enthusiastic', 'Entry-Level'];

export default function CoverLetterGenerator({ resumeData }) {
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [tone, setTone] = useState('Professional');
  const [lang, setLang] = useState('en');
  const [letter, setLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const printRef = useRef(null);

  const generate = async () => {
    setLoading(true);
    const contact = resumeData?.contact || {};
    const jobs = resumeData?.jobs?.filter(j => j.title) || [];
    const skills = resumeData?.skills?.map(s => s.items).join(', ') || '';
    const summary = resumeData?.summary || '';

    const { data } = await base44.functions.invoke('careerAssistant', {
      action: 'cover_letter',
      jobTitle,
      company,
      jobDescription: jobDesc,
      tone,
      lang,
      contact,
      jobs,
      skills,
      summary,
    });
    setLetter(data?.letter || '');
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const contact = resumeData?.contact || {};
    const w = window.open('', '_blank');
    // Set the title safely (avoids interpolating user input into HTML markup)
    w.document.title = `Cover Letter – ${contact.fullName || ''}`;
    const style = w.document.createElement('style');
    style.textContent = `
      body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.7; color: #1a1a1a; padding: 2.5cm; max-width: 750px; margin: 0 auto; }
      pre { font-family: Arial, sans-serif; white-space: pre-wrap; word-wrap: break-word; }
      @media print { body { padding: 1.5cm; } }
    `;
    w.document.head.appendChild(style);
    const pre = w.document.createElement('pre');
    // textContent safely escapes the letter text (no script execution)
    pre.textContent = letter;
    w.document.body.appendChild(pre);
    setTimeout(() => w.print(), 300);
  };

  const inputCls = "w-full px-3 py-2 rounded-lg border border-border/60 bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none";
  const labelCls = "text-xs font-medium text-muted-foreground mb-1 block";

  return (
    <div className="space-y-4">
      {/* Form */}
      <div className="bg-card border border-border/50 rounded-xl p-4 space-y-4">
        <p className="font-semibold text-sm">✉️ Cover Letter Details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Job Title *</label>
            <input value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g. Administrative Assistant" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Company Name *</label>
            <input value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. ABC Corp" className={inputCls} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Job Description (optional, improves alignment)</label>
          <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)} rows={3} placeholder="Paste the job posting here..." className={`${inputCls} resize-none`} />
        </div>
        <div className="flex gap-4 flex-wrap">
          <div>
            <label className={labelCls}>Tone</label>
            <div className="flex gap-1.5 flex-wrap">
              {TONES.map(t => (
                <button key={t} onClick={() => setTone(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${tone === t ? 'bg-primary text-primary-foreground border-primary' : 'border-border/50 text-muted-foreground hover:border-primary/30'}`}>
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${lang === code ? 'bg-primary text-primary-foreground border-primary' : 'border-border/50 text-muted-foreground hover:border-primary/30'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {!resumeData && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 text-xs text-amber-700">
            💡 Tip: Complete the Build Resume tab first so AI can personalize this letter with your experience.
          </div>
        )}

        <Button onClick={generate} disabled={loading || !jobTitle.trim()} className="w-full bg-primary hover:bg-primary/90 rounded-xl gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? 'Generating Cover Letter...' : 'Generate Cover Letter with AI'}
        </Button>
      </div>

      {/* Output */}
      {letter && (
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="font-semibold text-sm">Generated Cover Letter</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleCopy} className="gap-1.5 text-xs rounded-xl">
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button size="sm" variant="outline" onClick={generate} disabled={loading} className="gap-1.5 text-xs rounded-xl">
                <RefreshCw className="w-3.5 h-3.5" /> Regenerate
              </Button>
              <Button size="sm" onClick={handlePrint} className="gap-1.5 text-xs rounded-xl bg-primary">
                <Download className="w-3.5 h-3.5" /> Export PDF
              </Button>
            </div>
          </div>

          {/* Letter Document */}
          <div className="bg-white rounded-2xl shadow-lg border border-border/30 p-8 md:p-10" ref={printRef}>
            <div className="max-w-[650px] mx-auto">
              {/* Letterhead */}
              <div className="mb-6">
                {resumeData?.contact?.fullName && (
                  <p className="font-bold text-base text-gray-900">{resumeData.contact.fullName}</p>
                )}
                <div className="text-[11px] text-gray-500 space-y-0.5 mt-1">
                  {resumeData?.contact?.city && <p>{resumeData.contact.city}{resumeData.contact.province ? `, ${resumeData.contact.province}` : ''}</p>}
                  {resumeData?.contact?.phone && <p>{resumeData.contact.phone}</p>}
                  {resumeData?.contact?.email && <p>{resumeData.contact.email}</p>}
                </div>
              </div>
              <div className="border-t border-gray-200 my-4" />
              <pre className="whitespace-pre-wrap font-sans text-[11.5px] text-gray-800 leading-relaxed">{letter}</pre>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 text-xs text-muted-foreground">
            🍁 <strong>Tip:</strong> Review and personalize the letter before sending. Replace any placeholders like [Today's Date] or [Hiring Manager's Name].
          </div>
        </div>
      )}
    </div>
  );
}