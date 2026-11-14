import { Scale, Wallet, ShieldCheck, AlertTriangle, Phone, Info } from 'lucide-react';
import ResourceList from '@/components/work/ResourceList';

const CORE_RIGHTS = [
  'A written record of your hours, pay and deductions — ask for a pay stub every pay period.',
  'At least the minimum wage for your province or territory, with no unauthorized deductions.',
  'Overtime pay, rest breaks and vacation pay as set by your province or the federal Labour Code.',
  'A safe workplace. You can refuse unsafe work without losing your job.',
  'Protection from harassment, discrimination and reprisal — including for asking about your rights.',
  'The right to join or form a union, and to be paid what you are owed if you are terminated.',
];

const WAGE_LINKS = [
  { label: 'Job Bank — Minimum wages by province and territory', url: 'https://www.jobbank.gc.ca/trend-analysis/search-wages', note: 'Official Government of Canada page with current rates for every province and territory' },
];

const FEDERAL = [
  { label: 'Federal Labour Program', url: 'https://www.canada.ca/en/employment-social-development.html', note: 'Rules for federally regulated jobs: banks, telecom, airlines, interprovincial transport' },
  { label: 'Temporary Foreign Worker Program — your rights', url: 'https://www.canada.ca/en/employment-social-development/services/foreign-workers.html', note: 'Open work permits, employer abuse and how to report it' },
];

const PROVINCIAL = [
  { label: 'Ontario — Employment Standards', url: 'https://www.ontario.ca/document/your-guide-employment-standards-act-0', note: 'Minimum wage, hours, vacation and complaints' },
  { label: 'Alberta — Employment Standards', url: 'https://www.alberta.ca/employment-standards', note: 'Wages, overtime, termination and complaints' },
  { label: 'British Columbia — Employment Standards', url: 'https://www2.gov.bc.ca/gov/content/employment-business/employment-standards-advice/employment-standards', note: 'Wages, leave and complaint process' },
  { label: 'Quebec — CNESST', url: 'https://www.cnesst.gouv.qc.ca/en', note: 'Working conditions, pay and complaints' },
  { label: 'Manitoba — Employment Standards', url: 'https://www.gov.mb.ca/labour/standards/', note: 'Wages, hours and termination' },
  { label: 'Saskatchewan — Employment Standards', url: 'https://www.saskatchewan.ca/business/employment-standards', note: 'Wages, leave and complaints' },
  { label: 'Nova Scotia — Employment Rights', url: 'https://novascotia.ca/lae/employmentrights/', note: 'Minimum standards and complaints' },
  { label: 'New Brunswick — Employment Standards', url: 'https://www.gnb.ca/en.html', note: 'Wages, holidays and complaints' },
  { label: 'Prince Edward Island — Employment Standards', url: 'https://www.princeedwardisland.ca/en/topic/employment-standards', note: 'Wages, hours and complaints' },
  { label: 'Newfoundland and Labrador — Employment Standards', url: 'https://www.gov.nl.ca/', note: 'Wages, leave and complaints' },
];

function Section({ icon: Icon, title, intro, children }) {
  return (
    <div className="bg-card rounded-2xl border border-border/50 p-5">
      <h2 className="font-heading font-bold text-base mb-1 flex items-center gap-2">
        <Icon className="w-5 h-5 text-primary" /> {title}
      </h2>
      {intro && <p className="text-xs text-muted-foreground mb-4 leading-snug">{intro}</p>}
      {children}
    </div>
  );
}

export default function WorkplaceRights() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24 md:pb-10">
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-1 flex items-center gap-2">
          <Scale className="w-6 h-6 text-primary" />
          Workplace Rights & Wages
        </h1>
        <p className="text-muted-foreground text-sm">
          What you are entitled to at work, minimum wages by province, and where to get help.
        </p>
      </div>

      <div className="space-y-5">
        <Section
          icon={ShieldCheck}
          title="Your core rights at work"
          intro="These apply in every province and territory. Detailed rules — hours, overtime, leave — are set by your province, or by the federal Labour Code for federally regulated jobs."
        >
          <ul className="space-y-2">
            {CORE_RIGHTS.map(r => (
              <li key={r} className="flex items-start gap-2 text-sm text-muted-foreground leading-snug">
                <span className="text-primary font-bold mt-0.5 flex-shrink-0">✓</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section
          icon={Wallet}
          title="Minimum wage"
          intro="Minimum wage is set per province and territory and changes on different dates. Always confirm the current rate before accepting a job."
        >
          <ResourceList items={WAGE_LINKS} />
          <p className="flex items-start gap-1.5 text-[11px] text-muted-foreground mt-3 leading-snug">
            <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            Some jobs — students, servers with tips, live-in caregivers — can have a different rate. Check the official table and your provincial page.
          </p>
        </Section>

        <Section
          icon={Scale}
          title="Employment standards by province"
          intro="Your provincial employment standards office explains pay, hours, leave and how to file a complaint."
        >
          <ResourceList items={PROVINCIAL} />
        </Section>

        <Section
          icon={ShieldCheck}
          title="Federally regulated jobs & temporary foreign workers"
          intro="Banks, telecom, airlines and interprovincial transport follow the federal Labour Code instead of provincial rules."
        >
          <ResourceList items={FEDERAL} />
        </Section>

        <Section
          icon={AlertTriangle}
          title="If your rights are violated"
          intro="Act quickly — some complaints have short deadlines."
        >
          <ol className="space-y-2 mb-4">
            {[
              'Keep records: pay stubs, schedules, messages and the names of managers involved.',
              'Ask your provincial employment standards office (or the federal Labour Program) what you are owed.',
              'Contact a free settlement agency or legal aid for help filing a complaint.',
              'If you are in danger or being threatened, call 911. For abuse or trafficking, contact the police and a settlement worker.',
            ].map((step, i) => (
              <li key={step} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-snug">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/40 rounded-xl p-3 leading-snug">
            <Phone className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary/60" />
            <p>Dial 211 for free, local help finding legal aid, a settlement agency or an employment counsellor.</p>
          </div>
        </Section>

        <p className="text-[11px] text-muted-foreground leading-snug px-1">
          Links point to official government pages. Rules, rates and deadlines change — confirm current details with the
          province or the federal Labour Program before you act.
        </p>
      </div>
    </div>
  );
}