import { Phone, MapPin, Scale, Heart, Home, Shield, ExternalLink, AlertTriangle } from 'lucide-react';
import { getOrgLogo } from '@/lib/orgLogos';

const EMERGENCY = [
  { label: 'Police / Fire / Ambulance', number: '911', color: 'bg-red-500', note: 'For immediate life-threatening emergencies' },
  { label: '211 — Social Services Helpline', number: '211', color: 'bg-blue-500', note: 'Housing, food, crisis, mental health — 24/7' },
  { label: 'Kids Help Phone', number: '1-800-668-6868', color: 'bg-pink-500', note: 'For youth in crisis — 24/7' },
  { label: 'Crisis Text Line (Canada)', number: 'Text HOME to 686868', color: 'bg-purple-500', note: 'Free, confidential crisis support' },
  { label: 'Suicide Crisis Helpline', number: '9-8-8', color: 'bg-rose-600', note: 'Dial 9-8-8 for suicide crisis support' },
];

const SHELTERS = [
  { label: 'Find a Shelter — 211 Ontario', url: 'https://211ontario.ca/', note: 'Search shelters and housing by city' },
  { label: 'Shelter Finder Canada (Homeless Hub)', url: 'https://www.homelesshub.ca/solutions/emergency-response/emergency-shelters', note: 'National shelter directory' },
  { label: 'YWCA Canada — Women\'s Shelters', url: 'https://www.ywcacanada.ca/', note: 'Women and family emergency housing' },
  { label: 'Salvation Army — Emergency Shelter', url: 'https://www.salvationarmy.ca/what-we-do/emergency-disaster-services/', note: 'National emergency services' },
  { label: 'Refugee Housing (COSTI)', url: 'https://www.costi.org/programs/housing/', note: 'Refugee and newcomer housing support' },
];

const LEGAL_AID = [
  { label: 'Legal Aid Ontario', url: 'https://www.legalaid.on.ca/', note: 'Free legal help in Ontario' },
  { label: 'Legal Aid BC', url: 'https://lss.bc.ca/', note: 'Free legal services in British Columbia' },
  { label: 'Legal Aid Alberta', url: 'https://www.legalaid.ab.ca/', note: 'Free legal help in Alberta' },
  { label: 'IRCC — Report a Problem / Contact', url: 'https://ircc.canada.ca/english/contacts/web-form.asp', note: 'Official IRCC immigration inquiries' },
  { label: 'RCMP Victim Services', url: 'https://www.rcmp-grc.gc.ca/en/victim-services', note: 'Victim support from federal police' },
  { label: 'Canadian Council for Refugees', url: 'https://ccrweb.ca/', note: 'Advocacy and legal rights for refugees' },
];

const MENTAL_HEALTH = [
  { label: 'Canadian Mental Health Association', url: 'https://cmha.ca/', note: 'Mental health resources and support' },
  { label: 'Newcomer & Refugee Mental Health (CAMH)', url: 'https://www.camh.ca/en/camh-news-and-stories/mental-health-resources-for-newcomers', note: 'Toronto-based, newcomer focused' },
  { label: 'Centre for Addiction and Mental Health', url: 'https://www.camh.ca/', note: 'National mental health leader' },
];

function LinkList({ items }) {
  return (
    <div className="space-y-2">
      {items.map(item => {
        const logo = getOrgLogo(item.label);
        return (
          <a
            key={item.url}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
          >
            {logo ? (
              <img src={logo} alt={item.label} className="w-6 h-6 rounded object-contain flex-shrink-0 mt-0.5" onError={e => { e.target.style.display='none'; }} />
            ) : (
              <ExternalLink className="w-4 h-4 text-primary/50 flex-shrink-0 mt-0.5 group-hover:text-primary" />
            )}
            <div>
              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.note}</p>
            </div>
          </a>
        );
      })}
    </div>
  );
}

export default function Emergency() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-1 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          Emergency Support
        </h1>
        <p className="text-muted-foreground text-sm">Crisis hotlines, shelters, legal aid and immediate support for newcomers</p>
      </div>

      {/* Emergency Numbers */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 mb-6">
        <h2 className="font-heading font-bold text-base mb-4 flex items-center gap-2 text-red-700">
          <Phone className="w-5 h-5" /> Emergency Hotlines
        </h2>
        <div className="space-y-3">
          {EMERGENCY.map(e => (
            <div key={e.label} className="flex items-center gap-3 p-3 rounded-xl bg-white/60 dark:bg-card border border-red-100 dark:border-border">
              <div className={`${e.color} text-white px-3 py-1.5 rounded-lg text-sm font-bold font-mono flex-shrink-0 min-w-[80px] text-center`}>
                {e.number}
              </div>
              <div>
                <p className="text-sm font-semibold">{e.label}</p>
                <p className="text-xs text-muted-foreground">{e.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shelters */}
      <div className="bg-card rounded-2xl border border-border/50 p-5 mb-5">
        <h2 className="font-heading font-bold text-base mb-4 flex items-center gap-2">
          <Home className="w-5 h-5 text-emerald-600" /> Shelters & Emergency Housing
        </h2>
        <LinkList items={SHELTERS} />
      </div>

      {/* Legal Aid */}
      <div className="bg-card rounded-2xl border border-border/50 p-5 mb-5">
        <h2 className="font-heading font-bold text-base mb-4 flex items-center gap-2">
          <Scale className="w-5 h-5 text-purple-600" /> Legal Aid & Police/IRCC Links
        </h2>
        <LinkList items={LEGAL_AID} />
      </div>

      {/* Mental Health */}
      <div className="bg-card rounded-2xl border border-border/50 p-5">
        <h2 className="font-heading font-bold text-base mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-600" /> Mental Health Support
        </h2>
        <LinkList items={MENTAL_HEALTH} />
      </div>
    </div>
  );
}