import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { MobileSelect as Select, MobileSelectContent as SelectContent, MobileSelectItem as SelectItem, MobileSelectTrigger as SelectTrigger, MobileSelectValue as SelectValue } from '@/components/ui/mobile-select';
import { Loader2, Mic, Send, RefreshCw, ChevronDown, ChevronUp, Lightbulb, Star, MessageSquare, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

const CANADIAN_TIPS = [
  { q: 'Tell me about yourself.', tip: 'Keep it professional (2 min). Summarize your background, why you moved to Canada, and what you bring. Avoid personal details like age/family.' },
  { q: 'Why do you want to work here?', tip: 'Research the company beforehand. Mention specific programs, values, or Canadian market presence. Show genuine interest.' },
  { q: 'What are your strengths/weaknesses?', tip: 'Use the STAR method. For weaknesses, always show what you are doing to improve.' },
  { q: 'How do you handle conflict with a coworker?', tip: 'Canadians value team harmony and respectful communication. Emphasize listening, empathy, and constructive resolution.' },
  { q: 'Where do you see yourself in 5 years?', tip: 'Show ambition aligned with the company\'s growth. Mention commitment to staying and growing in Canada.' },
  { q: 'Tell me about a challenge you overcame.', tip: 'Use the STAR method (Situation, Task, Action, Result). Quantify results where possible.' },
  { q: 'Do you have Canadian experience?', tip: 'Reframe international experience as valuable. Highlight transferable skills, English proficiency, and quick adaptation to Canadian workplace culture.' },
];

const QUESTION_CATEGORIES = [
  { id: 'behavioural', label: '🧠 Behavioural', color: 'bg-blue-500/10 text-blue-700' },
  { id: 'technical', label: '⚙️ Technical', color: 'bg-orange-500/10 text-orange-700' },
  { id: 'situational', label: '💡 Situational', color: 'bg-violet-500/10 text-violet-700' },
  { id: 'canadian', label: '🍁 Canadian Culture', color: 'bg-red-500/10 text-red-700' },
];

function TipCard({ item, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/30 transition-colors">
        <span className="text-sm font-semibold pr-4">Q{index + 1}: {item.q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-3 border-t border-border/30 pt-3">
          <p className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            {item.tip}
          </p>
        </div>
      )}
    </div>
  );
}

function FeedbackBubble({ feedback }) {
  return (
    <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4 mt-3">
      <p className="text-xs font-semibold text-primary mb-2 flex items-center gap-1.5">
        <Star className="w-3.5 h-3.5" /> AI Feedback
      </p>
      <ReactMarkdown className="text-sm prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_p]:my-1 [&_ul]:my-1 [&_strong]:font-semibold">
        {feedback}
      </ReactMarkdown>
    </div>
  );
}

export default function InterviewPrep() {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('behavioural');
  const [questions, setQuestions] = useState([]);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loadingQ, setLoadingQ] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState('practice'); // 'practice' | 'tips'
  const [history, setHistory] = useState([]); // [{question, answer, feedback}]

  // Load saved applications to pick job from
  const { data: applications = [] } = useQuery({
    queryKey: ['jobApplications'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.JobApplication.filter({ created_by: user.email }, '-created_date', 50);
    },
  });

  const generateQuestions = async () => {
    if (!jobTitle) return;
    setLoadingQ(true);
    setQuestions([]);
    setCurrentQIdx(0);
    setFeedback('');
    setHistory([]);

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a Canadian interview coach. Generate 6 ${selectedCategory} interview questions for a "${jobTitle}" position in Canada.
${jobDescription ? `Job description context: ${jobDescription.slice(0, 600)}` : ''}
Make questions relevant to the Canadian workplace (diversity, teamwork, Canadian standards).
Return them as a JSON array of strings.`,
      response_json_schema: {
        type: 'object',
        properties: { questions: { type: 'array', items: { type: 'string' } } }
      }
    });

    setQuestions(result?.questions || []);
    setLoadingQ(false);
  };

  const getFeedback = async () => {
    if (!userAnswer.trim() || !questions[currentQIdx]) return;
    setLoadingFeedback(true);

    const fb = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert Canadian interview coach. Evaluate this interview answer.

Job Role: ${jobTitle}
Question: ${questions[currentQIdx]}
Candidate's Answer: ${userAnswer}

Provide structured feedback with:
1. **Score** (out of 10) — with a brief reason
2. **What worked well** — 1-2 specific positives
3. **What to improve** — 1-2 actionable suggestions
4. **Stronger example answer** — a concise improved version using STAR method if applicable
5. **Canadian context tip** — one specific tip for Canadian workplace culture

Keep it concise, warm, and encouraging.`,
    });

    setFeedback(fb);
    setHistory(prev => [...prev, { question: questions[currentQIdx], answer: userAnswer, feedback: fb }]);
    setLoadingFeedback(false);
  };

  const nextQuestion = () => {
    setCurrentQIdx(i => Math.min(i + 1, questions.length - 1));
    setUserAnswer('');
    setFeedback('');
  };

  const prevQuestion = () => {
    setCurrentQIdx(i => Math.max(i - 1, 0));
    setUserAnswer('');
    setFeedback('');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl md:text-3xl flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-primary" /> Interview Prep
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">AI-powered mock interviews tailored to your target role</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-xl p-1 mb-6 w-fit">
        {[{ id: 'practice', label: '🎤 Mock Interview' }, { id: 'tips', label: '🍁 Canadian Tips' }].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={cn('px-4 py-2 rounded-lg text-sm font-semibold transition-all',
              activeTab === t.id ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground')}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'tips' && (
        <div className="space-y-3">
          <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4 mb-4">
            <p className="text-sm font-semibold mb-1 flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary" /> Canadian Interview Culture</p>
            <ul className="text-xs text-muted-foreground space-y-1.5 ml-1">
              <li>🤝 <strong>Warmth matters</strong> — greet the interviewer by name, smile, and make eye contact</li>
              <li>🕒 <strong>Arrive 5–10 min early</strong> — punctuality is highly valued in Canadian workplaces</li>
              <li>🇨🇦 <strong>Emphasize diversity</strong> — mention your multicultural background as a strength</li>
              <li>📧 <strong>Send a thank-you email</strong> within 24 hours — very common and expected in Canada</li>
              <li>💬 <strong>Be specific</strong> — use the STAR method (Situation, Task, Action, Result)</li>
              <li>🔇 <strong>Don't oversell</strong> — Canadians value modesty; let your results speak for themselves</li>
            </ul>
          </div>
          {CANADIAN_TIPS.map((item, i) => <TipCard key={i} item={item} index={i} />)}
        </div>
      )}

      {activeTab === 'practice' && (
        <div className="space-y-5">
          {/* Setup */}
          <div className="bg-card border border-border/50 rounded-2xl p-5">
            <p className="text-sm font-semibold mb-3">1. Set up your mock interview</p>

            {/* Pick from tracker */}
            {applications.length > 0 && (
              <div className="mb-3">
                <label className="text-xs text-muted-foreground font-medium block mb-1">Pick from Job Tracker</label>
                <Select onValueChange={id => {
                  const app = applications.find(a => a.id === id);
                  if (app) {
                    setJobTitle(app.job_title + (app.company ? ` at ${app.company}` : ''));
                    setJobDescription(app.job_description || '');
                  }
                }}>
                  <SelectTrigger className="w-full min-h-[44px] rounded-xl text-sm">
                    <SelectValue placeholder="— Select a saved application —" />
                  </SelectTrigger>
                  <SelectContent label="Pick from Job Tracker">
                    {applications.map(a => (
                      <SelectItem key={a.id} value={a.id}>{a.job_title} @ {a.company}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <label className="text-xs text-muted-foreground font-medium block mb-1">Job Title / Role *</label>
            <input
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
              placeholder="e.g. Software Developer, Nurse, Customer Service Rep"
              className="w-full text-sm px-3 py-2.5 rounded-xl border border-border/60 bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none mb-3"
            />

            <label className="text-xs text-muted-foreground font-medium block mb-1">Job Description (optional — improves question quality)</label>
            <textarea
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={3}
              className="w-full text-sm px-3 py-2.5 rounded-xl border border-border/60 bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none mb-3 resize-none"
            />

            <label className="text-xs text-muted-foreground font-medium block mb-2">Question Type</label>
            <div className="flex gap-2 flex-wrap mb-4">
              {QUESTION_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn('px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all',
                    selectedCategory === cat.id ? 'border-primary bg-primary/10 text-primary' : 'border-border/50 text-muted-foreground hover:border-primary/30')}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <Button
              onClick={generateQuestions}
              disabled={!jobTitle || loadingQ}
              className="w-full rounded-xl gap-2"
            >
              {loadingQ ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating questions...</> : <><RefreshCw className="w-4 h-4" /> Generate Interview Questions</>}
            </Button>
          </div>

          {/* Practice area */}
          {questions.length > 0 && (
            <div className="bg-card border border-border/50 rounded-2xl p-5 space-y-4">
              {/* Progress */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground font-medium">Question {currentQIdx + 1} of {questions.length}</p>
                <div className="flex gap-1">
                  {questions.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setCurrentQIdx(i); setUserAnswer(''); setFeedback(''); }}
                      className={cn('w-5 h-1.5 rounded-full transition-all', i === currentQIdx ? 'bg-primary' : i < currentQIdx ? 'bg-primary/40' : 'bg-border')}
                    />
                  ))}
                </div>
              </div>

              {/* Question */}
              <div className="bg-primary/5 border border-primary/15 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-foreground leading-relaxed">{questions[currentQIdx]}</p>
              </div>

              {/* Answer */}
              <div>
                <label className="text-xs text-muted-foreground font-medium block mb-1.5">Your Answer</label>
                <textarea
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                  placeholder="Type your answer here. Use the STAR method for best results: Situation, Task, Action, Result."
                  rows={5}
                  className="w-full text-sm px-3 py-2.5 rounded-xl border border-border/60 bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                />
              </div>

              <Button
                onClick={getFeedback}
                disabled={!userAnswer.trim() || loadingFeedback}
                className="w-full rounded-xl gap-2"
              >
                {loadingFeedback ? <><Loader2 className="w-4 h-4 animate-spin" /> Analysing your answer...</> : <><Send className="w-4 h-4" /> Get AI Feedback</>}
              </Button>

              {feedback && <FeedbackBubble feedback={feedback} />}

              {/* Navigation */}
              <div className="flex gap-2 pt-2 border-t border-border/30">
                <Button variant="outline" onClick={prevQuestion} disabled={currentQIdx === 0} className="flex-1 rounded-xl">Previous</Button>
                <Button variant="outline" onClick={nextQuestion} disabled={currentQIdx === questions.length - 1} className="flex-1 rounded-xl">Next</Button>
              </div>
            </div>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Session History ({history.length} answered)</p>
              {history.map((item, i) => (
                <details key={i} className="bg-card border border-border/50 rounded-xl overflow-hidden">
                  <summary className="px-4 py-3 text-sm font-medium cursor-pointer hover:bg-muted/30 transition-colors list-none flex items-center justify-between">
                    <span className="truncate pr-4">Q{i + 1}: {item.question}</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </summary>
                  <div className="px-4 pb-4 border-t border-border/30 pt-3 space-y-2">
                    <div>
                      <p className="text-[11px] text-muted-foreground font-semibold uppercase mb-1">Your Answer</p>
                      <p className="text-xs text-foreground">{item.answer}</p>
                    </div>
                    <FeedbackBubble feedback={item.feedback} />
                  </div>
                </details>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}