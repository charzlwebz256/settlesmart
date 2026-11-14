import { Building2, GraduationCap, Users, Wrench, BadgeCheck, Info } from 'lucide-react';
import ResourceList from '@/components/work/ResourceList';

const NEWCOMER_EMPLOYERS = [
  { label: 'Job Bank, Government of Canada', url: 'https://www.jobbank.gc.ca/', note: 'Official job board; filter by location, entry level and newcomer-friendly employers' },
  { label: 'Magnet', url: 'https://magnet.today/', note: 'Job matching focused on newcomers and equity-deserving groups' },
  { label: 'ACCES Employment', url: 'https://accesemployment.ca/', note: 'Newcomer employment services (Ontario, online)' },
  { label: 'COSTI, Employment Services', url: 'https://www.costi.org/programs/employment/', note: 'Free employment help (Ontario)' },
  { label: 'ISSofBC', url: 'https://issbc.org/', note: 'Employment and settlement services (British Columbia)' },
  { label: 'Mennonite Centre for Newcomers', url: 'https://www.mcnedmonton.com/', note: 'Employment support in Edmonton' },
  { label: 'YMCA, Employment Services', url: 'https://www.ymca.ca/', note: 'Free job-search help in many Canadian cities' },
];

const ENTRY_LEVEL = [
  { label: 'Job Bank', url: 'https://www.jobbank.gc.ca/findajob', note: 'Search by city and filter for entry-level and no-experience roles' },
  { label: 'Indeed Canada', url: 'https://ca.indeed.com/', note: 'Large aggregator; filter by entry level and salary' },
  { label: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs/', note: 'Search entry-level roles and set job alerts' },
  { label: 'WorkBC', url: 'https://www.workbc.ca/', note: 'British Columbia job board and career tools' },
  { label: 'ALIS, Alberta careers', url: 'https://alis.alberta.ca/', note: 'Alberta career, wage and job-search information' },
];

const AGENCIES = [
  { label: 'IRCC, Find settlement services', url: 'https://ircc.canada.ca/english/newcomers/services/index.asp', note: 'Official list of funded settlement agencies near you' },
  { label: '211 Canada', url: 'https://www.211.ca/', note: 'Dial 211 for local employment and settlement support' },
  { label: 'ACCES Employment', url: 'https://accesemployment.ca/', note: 'Newcomer-focused employment agency (Ontario, online)' },
  { label: 'COSTI Immigrant Services', url: 'https://www.costi.org/', note: 'Settlement and employment services (Ontario)' },
];

const CREDENTIALS = [
  { label: 'CICIC, International credentials', url: 'https://www.cicic.ca/', note: 'How Canadian credential assessment works and how to find the right body' },
  { label: 'Canada.ca, Get your education assessed', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/documents/education-assessed.html', note: 'Official federal guidance on educational credential assessment' },
  { label: 'WES, World Education Services', url: 'https://www.wes.org/ca/', note: 'One of the designated credential assessment providers' },
  { label: 'ICAS', url: 'https://www.icascanada.ca/', note: 'Another designated assessment provider' },
  { label: 'IQAS, Alberta', url: 'https://www.alberta.ca/iqas', note: 'Alberta government assessment service' },
  { label: 'CICIC, Find a regulatory body', url: 'https://www.cicic.ca/1285/regulatory-bodies.canada', note: 'Required for regulated professions such as nursing, engineering and teaching' },
];

const APPRENTICESHIPS = [
  { label: 'Red Seal Program', url: 'https://www.red-seal.ca/', note: 'National standard for skilled trades; your certificate is recognized across Canada' },
  { label: 'Canada Apprentice Loan', url: 'https://www.canada.ca/en/services/benefits/education/student-aid/grants-loans.html', note: 'Interest-free loans for registered apprentices in Red Seal trades' },
  { label: 'Apprenticeship grants', url: 'https://www.canada.ca/en/employment-social-development.html', note: 'Federal grants for apprentices who complete training' },
  { label: 'Skilled Trades Ontario', url: 'https://www.skilledtradesontario.ca/', note: 'Apprenticeship and certification in Ontario' },
  { label: 'Trades Alberta (Trade Secrets)', url: 'https://tradesecrets.alberta.ca/', note: 'Apprenticeship and certification in Alberta' },
];

function Section({ icon: Icon, title, intro, items }) {
  return (
    <div className="bg-card rounded-2xl border border-border/50 p-5">
      <h2 className="font-heading font-bold text-base mb-1 flex items-center gap-2">
        <Icon className="w-5 h-5 text-primary" /> {title}
      </h2>
      {intro && <p className="text-xs text-muted-foreground mb-4 leading-snug">{intro}</p>}
      <ResourceList items={items} />
    </div>
  );
}

export default function CareerSupport() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24 md:pb-10">
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-1 flex items-center gap-2">
          <BadgeCheck className="w-6 h-6 text-primary" />
          Career Support
        </h1>
        <p className="text-muted-foreground text-sm">
          Newcomer-friendly employers, entry-level jobs, agencies, credential recognition and apprenticeships.
        </p>
      </div>

      <div className="space-y-5">
        <Section
          icon={Building2}
          title="Newcomer-friendly employers"
          intro="These official and recognized services connect newcomers with employers who hire internationally trained people."
          items={NEWCOMER_EMPLOYERS}
        />
        <Section
          icon={Users}
          title="Entry-level and first-job search"
          intro="Start with roles that require little or no Canadian experience, then build from there."
          items={ENTRY_LEVEL}
        />
        <Section
          icon={GraduationCap}
          title="Employment agencies & settlement employment services"
          intro="Legitimate agencies are paid by employers, never pay a fee to get a job. Settlement agencies offer free help."
          items={AGENCIES}
        />
        <Section
          icon={BadgeCheck}
          title="Foreign credential recognition"
          intro="Get your education and professional credentials assessed, then contact the regulator for your profession."
          items={CREDENTIALS}
        />
        <Section
          icon={Wrench}
          title="Apprenticeships & skilled trades"
          intro="Trades are one of the fastest routes to stable work, and Red Seal certification is recognized across Canada."
          items={APPRENTICESHIPS}
        />

        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/40 rounded-xl p-4 leading-snug">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary/60" />
          <p>
            Bridging programs for regulated professions vary by province and school. Search
            &ldquo;<span className="font-medium">[your profession] bridging program [your province]</span>&rdquo; and confirm with the
            provincial regulator listed on CICIC before paying for any course.
          </p>
        </div>
      </div>
    </div>
  );
}