import { useState } from 'react';
import { FileText, ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ResumeForm from '@/components/resume/ResumeForm';
import ResumePreview from '@/components/resume/ResumePreview';
import CoverLetterGenerator from '@/components/resume/CoverLetterGenerator';

const TABS = [
  { id: 'build', label: '📝 Build Resume' },
  { id: 'preview', label: '👁 Preview & Export' },
  { id: 'cover', label: '✉️ Cover Letter' },
];

export default function ResumeBuilder() {
  const [activeTab, setActiveTab] = useState('build');
  const [resumeData, setResumeData] = useState(null);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-6">
        <Link to="/jobs" className="flex items-center gap-1 text-sm text-primary font-medium hover:opacity-70 mb-3">
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-2xl md:text-3xl">Smart Resume Builder</h1>
            <p className="text-muted-foreground text-sm">Canadian Format, ATS-Optimized, AI-Powered</p>
          </div>
        </div>
      </div>

      {/* Canadian Standard Notice */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 mb-6 flex items-start gap-3">
        <span className="text-lg">🍁</span>
        <div className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Canadian Standard:</span> This builder follows Canadian hiring norms — no photo, no age, no gender, no marital status. Resumes are ATS-compliant and use action-verb bullet points with measurable achievements.
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border/50 text-muted-foreground hover:border-primary/30'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'build' && (
        <ResumeForm onSave={(data) => { setResumeData(data); setActiveTab('preview'); }} />
      )}
      {activeTab === 'preview' && (
        <ResumePreview resumeData={resumeData} onEdit={() => setActiveTab('build')} />
      )}
      {activeTab === 'cover' && (
        <CoverLetterGenerator resumeData={resumeData} />
      )}
    </div>
  );
}