import { Link } from 'react-router-dom';
import { ArrowRight, ListChecks, Scale, Search, Briefcase, FileText, GraduationCap, HeartPulse, Wallet, Home as HomeIcon, CalendarDays, Users } from 'lucide-react';

// Each priority maps to the pages where that newcomer should start.
const PLANS = {
  documents: [
    { to: '/checklist', title: 'Your 90-day checklist', desc: 'SIN, health card, bank account and housing — in the right order.', Icon: ListChecks },
    { to: '/legal', title: 'IRCC & legal basics', desc: 'Permits, PR obligations and official IRCC links.', Icon: Scale },
    { to: '/services', title: 'Settlement agencies', desc: 'Free, in-person help with paperwork near you.', Icon: Search },
  ],
  jobs: [
    { to: '/jobs', title: 'Find jobs near you', desc: 'Live openings plus newcomer-friendly employers.', Icon: Briefcase },
    { to: '/resume-builder', title: 'Build a Canadian resume', desc: 'Format and wording that local recruiters expect.', Icon: FileText },
    { to: '/career-support', title: 'Credentials & bridging', desc: 'Get your qualifications recognised in Canada.', Icon: GraduationCap },
  ],
  housing: [
    { to: '/services', title: 'Housing help near you', desc: 'Settlement agencies, tenant support and shelters.', Icon: HomeIcon },
    { to: '/legal', title: 'Tenant rights', desc: 'Leases, deposits and what a landlord cannot do.', Icon: Scale },
    { to: '/near-me', title: 'What is close by', desc: 'Community services within reach of your address.', Icon: Search },
  ],
  health: [
    { to: '/healthcare', title: 'Healthcare by province', desc: 'Health card, walk-in clinics and coverage rules.', Icon: HeartPulse },
    { to: '/near-me', title: 'Clinics near you', desc: 'Find a family doctor or walk-in clinic today.', Icon: Search },
    { to: '/emergency', title: 'Emergency numbers', desc: '911, 811 and crisis lines you may need.', Icon: Scale },
  ],
  education: [
    { to: '/education', title: 'Schools & language classes', desc: 'Free LINC classes, colleges and credential assessment.', Icon: GraduationCap },
    { to: '/scholarships', title: 'Scholarships', desc: 'Awards and bursaries for newcomers and students.', Icon: Wallet },
    { to: '/checklist', title: 'School registration steps', desc: 'Enrol your children and yourself in the right order.', Icon: ListChecks },
  ],
  money: [
    { to: '/benefits', title: 'Benefits you may qualify for', desc: 'CCB, GST credit, provincial programs and how to apply.', Icon: Wallet },
    { to: '/checklist', title: 'Banking & money setup', desc: 'Open an account, build credit, file your first taxes.', Icon: ListChecks },
    { to: '/shop-smart', title: 'Shop smart in Canada', desc: 'Price comparison and ways to cut the cost of living.', Icon: Search },
  ],
  legal: [
    { to: '/legal', title: 'Legal & IRCC help', desc: 'Immigration rules, free legal clinics and official links.', Icon: Scale },
    { to: '/workplace-rights', title: 'Your rights at work', desc: 'Wages, hours, safety and what to do if something is wrong.', Icon: Briefcase },
    { to: '/services', title: 'Free legal clinics', desc: 'Settlement agencies that offer legal support.', Icon: Search },
  ],
  community: [
    { to: '/events', title: 'Community events', desc: 'Workshops, cultural gatherings and meetups nearby.', Icon: CalendarDays },
    { to: '/volunteer', title: 'Volunteer & meet people', desc: 'The fastest way to build a network and references.', Icon: Users },
    { to: '/assistant', title: 'Keep chatting with Nexa', desc: 'Ask anything about settling in Canada.', Icon: Search },
  ],
};

export default function StartingPoints({ goal, province }) {
  const plan = PLANS[goal] || PLANS.documents;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Start here</p>
        {province && <span className="text-[11px] text-muted-foreground">near {province}</span>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {plan.map((item) => (
          <Link
            key={item.to + item.title}
            to={item.to}
            className="group flex flex-col gap-1.5 p-3 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <item.Icon className="w-3.5 h-3.5" />
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="text-sm font-semibold leading-tight">{item.title}</p>
            <p className="text-[11px] text-muted-foreground leading-snug">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}