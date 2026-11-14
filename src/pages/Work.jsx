import { Link } from 'react-router-dom';
import { Briefcase, CalendarDays, ArrowRight, FileText, MessagesSquare, BadgeCheck, Scale, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const groups = [
  {
    title: 'Find work',
    items: [
      {
        icon: BadgeCheck,
        color: 'bg-emerald-500/10 text-emerald-600',
        label: 'Job Tracker',
        desc: 'Track every application, follow-up date and interview in one place.',
        path: '/job-tracker',
      },
    ],
  },
  {
    title: 'Prepare & apply',
    items: [
      {
        icon: FileText,
        color: 'bg-blue-500/10 text-blue-600',
        label: 'Resume Builder',
        desc: 'Build a Canadian-style resume and tailor it to the job you want.',
        path: '/resume-builder',
      },
      {
        icon: MessagesSquare,
        color: 'bg-violet-500/10 text-violet-600',
        label: 'Interview Preparation',
        desc: 'Practise common questions and learn what Canadian employers expect.',
        path: '/interview-prep',
      },
      {
        icon: Sparkles,
        color: 'bg-fuchsia-500/10 text-fuchsia-600',
        label: 'AI Job Coach',
        desc: 'Get personal advice on your resume, cover letter and job search.',
        path: '/job-coach',
      },
    ],
  },
  {
    title: 'Support & recognition',
    items: [
      {
        icon: Briefcase,
        color: 'bg-teal-500/10 text-teal-600',
        label: 'Career Support',
        desc: 'Newcomer-friendly employers, entry-level jobs, employment agencies, credential recognition and apprenticeships.',
        path: '/career-support',
      },
      {
        icon: Scale,
        color: 'bg-rose-500/10 text-rose-600',
        label: 'Workplace Rights & Wages',
        desc: 'Your rights at work, minimum wages by province, and where to get help if something goes wrong.',
        path: '/workplace-rights',
      },
    ],
  },
  {
    title: 'Community',
    items: [
      {
        icon: CalendarDays,
        color: 'bg-violet-500/10 text-violet-600',
        label: 'Events & Community',
        desc: 'Discover local workshops, job fairs, language programs and community events near you.',
        path: '/events',
      },
    ],
  },
];

export default function Work() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 pb-24 md:pb-12">
      <div className="mb-8">
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-2">SmartLife</h1>
        <p className="text-muted-foreground text-sm">Shopping, entertainment and work, the everyday essentials for life in Canada.</p>
      </div>

      <div className="space-y-8">
        {groups.map((group, gi) => (
          <div key={group.title}>
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{group.title}</h2>
            <div className="space-y-3">
              {group.items.map((s, i) => (
                <motion.div
                  key={s.path}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (gi * 0.04) + (i * 0.05) }}
                >
                  <Link
                    to={s.path}
                    className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-md transition-all group"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
                      <s.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-bold text-base mb-0.5 group-hover:text-primary transition-colors">{s.label}</h3>
                      <p className="text-muted-foreground text-sm leading-snug">{s.desc}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground/40 group-hover:text-primary transition-colors flex-shrink-0" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}