import { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Download, Pencil, Loader2, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const TEMPLATES = [
  { id: 'clean', label: 'Clean Modern' },
  { id: 'classic', label: 'Classic Professional' },
  { id: 'sidebar', label: 'Sidebar Accent' },
];

export default function ResumePreview({ resumeData, onEdit }) {
  const [template, setTemplate] = useState('clean');
  const [loading, setLoading] = useState(false);
  const printRef = useRef(null);

  if (!resumeData) {
    return (
      <div className="text-center py-16">
        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
        <h3 className="font-heading font-bold text-lg mb-2">No Resume Yet</h3>
        <p className="text-muted-foreground text-sm mb-4">Fill out the Build Resume tab first.</p>
        <Button onClick={onEdit} className="rounded-xl gap-2 bg-primary">
          <Pencil className="w-4 h-4" /> Go to Builder
        </Button>
      </div>
    );
  }

  const { contact, summary, jobs, education, skills, certs, volunteer, format } = resumeData;

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const w = window.open('', '_blank');
    w.document.write(`
      <html><head><title>${contact.fullName || 'Resume'} - Resume</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; font-size: 11pt; line-height: 1.5; color: #1a1a1a; padding: 2cm; }
        h1 { font-size: 20pt; font-weight: 700; margin-bottom: 2px; }
        h2 { font-size: 11pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1.5px solid #2d9d78; padding-bottom: 3px; margin: 14px 0 6px; color: #1a1a1a; }
        .contact { font-size: 10pt; color: #555; margin-bottom: 4px; }
        .section-content { font-size: 10.5pt; }
        .job-title { font-weight: 600; }
        .job-meta { font-size: 10pt; color: #555; margin-bottom: 4px; }
        ul { margin-left: 14px; margin-top: 3px; }
        li { margin-bottom: 2px; }
        .skills-row { margin-bottom: 4px; }
        .skills-cat { font-weight: 600; }
        @media print { body { padding: 1.5cm; } }
      </style></head><body>${content}</body></html>
    `);
    w.document.close();
    setTimeout(() => { w.print(); }, 300);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1.5">
          {TEMPLATES.map(t => (
            <button key={t.id} onClick={() => setTemplate(t.id)}
              className={cn("px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all",
                template === t.id ? 'bg-primary text-primary-foreground border-primary' : 'border-border/50 text-muted-foreground hover:border-primary/30')}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onEdit} className="gap-1.5 rounded-xl text-xs"><Pencil className="w-3.5 h-3.5" /> Edit</Button>
          <Button size="sm" onClick={handlePrint} className="gap-1.5 rounded-xl text-xs bg-primary"><Download className="w-3.5 h-3.5" /> Export PDF</Button>
        </div>
      </div>

      {/* Resume Document */}
      <div className="bg-white rounded-2xl shadow-lg border border-border/30 overflow-hidden">
        <div ref={printRef} className={cn("p-8 md:p-10 text-gray-900", template === 'sidebar' && 'flex gap-0')}>
          {template === 'sidebar' ? (
            <SidebarLayout resumeData={resumeData} />
          ) : (
            <StandardLayout resumeData={resumeData} template={template} />
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        🍁 ATS-compliant · Canadian format · No photo/personal details
      </p>
    </div>
  );
}

function StandardLayout({ resumeData, template }) {
  const { contact, summary, jobs, education, skills, certs, volunteer } = resumeData;
  const accentColor = template === 'clean' ? 'text-emerald-700' : 'text-slate-800';
  const borderColor = template === 'clean' ? 'border-emerald-600' : 'border-slate-700';

  const SectionTitle = ({ children }) => (
    <h2 className={`text-xs font-bold uppercase tracking-widest border-b-2 ${borderColor} pb-1 mb-3 mt-5 ${accentColor}`}>{children}</h2>
  );

  return (
    <div className="max-w-[700px] mx-auto">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">{contact.fullName || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5 text-gray-600 text-[11px]">
          {contact.city && <span>{contact.city}{contact.province ? `, ${contact.province}` : ''}</span>}
          {contact.phone && <span>· {contact.phone}</span>}
          {contact.email && <span>· {contact.email}</span>}
          {contact.linkedin && <span>· {contact.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <>
          <SectionTitle>Professional Summary</SectionTitle>
          <p className="text-[11.5px] text-gray-700 leading-relaxed">{summary}</p>
        </>
      )}

      {/* Experience */}
      {jobs?.some(j => j.title) && (
        <>
          <SectionTitle>Work Experience</SectionTitle>
          {jobs.filter(j => j.title).map((job, i) => (
            <div key={i} className="mb-3.5">
              <div className="flex justify-between items-start flex-wrap gap-1">
                <div>
                  <p className="font-semibold text-sm text-gray-900">{job.title}</p>
                  <p className="text-[11px] text-gray-600">{job.company}{job.location ? ` · ${job.location}` : ''}</p>
                </div>
                {(job.start || job.end) && <p className="text-[11px] text-gray-500 flex-shrink-0">{job.start}{job.end ? ` – ${job.end}` : ''}</p>}
              </div>
              {job.bullets?.filter(b => b.trim()).length > 0 && (
                <ul className="mt-1.5 space-y-0.5 ml-3">
                  {job.bullets.filter(b => b.trim()).map((b, bi) => (
                    <li key={bi} className="text-[11px] text-gray-700 list-disc">{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </>
      )}

      {/* Education */}
      {education?.some(e => e.degree) && (
        <>
          <SectionTitle>Education</SectionTitle>
          {education.filter(e => e.degree).map((edu, i) => (
            <div key={i} className="flex justify-between items-start mb-2 flex-wrap gap-1">
              <div>
                <p className="font-semibold text-[12px] text-gray-900">{edu.degree}{edu.field ? ` – ${edu.field}` : ''}</p>
                <p className="text-[11px] text-gray-600">{edu.school}{edu.location ? ` · ${edu.location}` : ''}</p>
              </div>
              {edu.year && <p className="text-[11px] text-gray-500">{edu.year}</p>}
            </div>
          ))}
        </>
      )}

      {/* Skills */}
      {skills?.some(s => s.items.trim()) && (
        <>
          <SectionTitle>Skills</SectionTitle>
          <div className="space-y-1">
            {skills.filter(s => s.items.trim()).map((skill, i) => (
              <div key={i} className="text-[11.5px] text-gray-700">
                <span className="font-semibold text-gray-900">{skill.category}: </span>{skill.items}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Certifications */}
      {certs?.length > 0 && (
        <>
          <SectionTitle>Certifications</SectionTitle>
          <div className="space-y-1">
            {certs.map((cert, i) => (
              <div key={i} className="flex justify-between text-[11.5px] text-gray-700">
                <span>{cert.name}{cert.issuer ? ` · ${cert.issuer}` : ''}</span>
                {cert.year && <span className="text-gray-500">{cert.year}</span>}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Volunteer */}
      {volunteer?.some(v => v.role) && (
        <>
          <SectionTitle>Volunteer Experience</SectionTitle>
          {volunteer.filter(v => v.role).map((v, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between items-start flex-wrap gap-1">
                <div>
                  <p className="font-semibold text-[12px] text-gray-900">{v.role}</p>
                  <p className="text-[11px] text-gray-600">{v.org}</p>
                </div>
                {v.period && <p className="text-[11px] text-gray-500">{v.period}</p>}
              </div>
              {v.description && <p className="text-[11px] text-gray-700 mt-0.5">{v.description}</p>}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function SidebarLayout({ resumeData }) {
  const { contact, summary, jobs, education, skills, certs, volunteer } = resumeData;
  return (
    <div className="flex w-full min-h-[900px]">
      {/* Sidebar */}
      <div className="w-56 flex-shrink-0 bg-slate-800 text-white p-5 space-y-5">
        <div>
          <h1 className="text-lg font-bold leading-tight text-white">{contact.fullName || 'Your Name'}</h1>
          <div className="mt-3 space-y-1 text-[10px] text-slate-300">
            {contact.city && <p>📍 {contact.city}{contact.province ? `, ${contact.province}` : ''}</p>}
            {contact.phone && <p>📞 {contact.phone}</p>}
            {contact.email && <p>✉️ {contact.email}</p>}
            {contact.linkedin && <p>🔗 {contact.linkedin}</p>}
          </div>
        </div>
        {skills?.some(s => s.items.trim()) && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Skills</h2>
            {skills.filter(s => s.items.trim()).map((skill, i) => (
              <div key={i} className="mb-2">
                <p className="text-[9px] font-semibold text-slate-300 uppercase">{skill.category}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {skill.items.split(',').map((s, si) => s.trim() && (
                    <span key={si} className="bg-slate-700 text-white text-[9px] px-1.5 py-0.5 rounded">{s.trim()}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {certs?.length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Certifications</h2>
            {certs.map((cert, i) => (
              <div key={i} className="text-[10px] text-slate-300 mb-1">{cert.name}</div>
            ))}
          </div>
        )}
      </div>
      {/* Main */}
      <div className="flex-1 p-6 space-y-4">
        {summary && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-600 border-b border-slate-200 pb-1 mb-2">Summary</h2>
            <p className="text-[11px] text-gray-700 leading-relaxed">{summary}</p>
          </div>
        )}
        {jobs?.some(j => j.title) && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-600 border-b border-slate-200 pb-1 mb-3">Experience</h2>
            {jobs.filter(j => j.title).map((job, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between">
                  <div><p className="font-semibold text-[12px]">{job.title}</p><p className="text-[10px] text-gray-500">{job.company}{job.location ? ` · ${job.location}` : ''}</p></div>
                  <p className="text-[10px] text-gray-400">{job.start}{job.end ? ` – ${job.end}` : ''}</p>
                </div>
                <ul className="mt-1 ml-3 space-y-0.5">{job.bullets?.filter(b => b).map((b, bi) => <li key={bi} className="text-[11px] text-gray-700 list-disc">{b}</li>)}</ul>
              </div>
            ))}
          </div>
        )}
        {education?.some(e => e.degree) && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-600 border-b border-slate-200 pb-1 mb-2">Education</h2>
            {education.filter(e => e.degree).map((edu, i) => (
              <div key={i} className="flex justify-between mb-2">
                <div><p className="font-semibold text-[11px]">{edu.degree}{edu.field ? ` – ${edu.field}` : ''}</p><p className="text-[10px] text-gray-500">{edu.school}</p></div>
                <p className="text-[10px] text-gray-400">{edu.year}</p>
              </div>
            ))}
          </div>
        )}
        {volunteer?.some(v => v.role) && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-600 border-b border-slate-200 pb-1 mb-2">Volunteer</h2>
            {volunteer.filter(v => v.role).map((v, i) => (
              <div key={i} className="mb-2">
                <div className="flex justify-between"><p className="font-semibold text-[11px]">{v.role}</p><p className="text-[10px] text-gray-400">{v.period}</p></div>
                <p className="text-[10px] text-gray-500">{v.org}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}