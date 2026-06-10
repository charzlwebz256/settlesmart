import { useState } from 'react';
import { Phone, MapPin, Scale, Heart, Home, Shield, ExternalLink, AlertTriangle, ChevronDown } from 'lucide-react';
import { getOrgLogo } from '@/lib/orgLogos';
import { RegionalContacts } from '@/components/emergency/RegionalContacts';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const EMERGENCY = [
  { label: 'Police / Fire / Ambulance', number: '911', tel: '911', color: 'bg-red-500', note: 'For immediate life-threatening emergencies' },
  { label: '211 — Social Services Helpline', number: '211', tel: '211', color: 'bg-blue-500', note: 'Housing, food, crisis, mental health — 24/7' },
  { label: 'Kids Help Phone', number: '1-800-668-6868', tel: '18006686868', color: 'bg-pink-500', note: 'For youth in crisis — 24/7' },
  { label: 'Crisis Text Line (Canada)', number: 'Text HOME to 686868', sms: '686868', smsBody: 'HOME', color: 'bg-purple-500', note: 'Free, confidential crisis support' },
  { label: 'Suicide Crisis Helpline', number: '9-8-8', tel: '988', color: 'bg-rose-600', note: 'Dial 9-8-8 for suicide crisis support' },
  { label: 'IRCC — Immigration Canada', number: '1-888-242-2100', tel: '18882422100', color: 'bg-teal-600', note: 'Canada only — immigration inquiries & urgent help' },
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
  { label: 'Canadian Mental Health Association', url: 'https://cmha.ca/', note: 'Mental health resources and support across Canada' },
  { label: 'Newcomer & Refugee Mental Health (CAMH)', url: 'https://www.camh.ca/en/camh-news-and-stories/mental-health-resources-for-newcomers', note: 'Free mental health resources tailored for newcomers & refugees in Canada' },
  { label: 'CAMH — Centre for Addiction & Mental Health', url: 'https://www.camh.ca/', note: "Canada's largest mental health teaching hospital & research centre" },
  { label: 'CAMH Mental Health Line', url: 'https://www.camh.ca/en/health-info/mental-health-and-covid-19/covid-19-resources-for-newcomers', note: 'COVID-19 & ongoing support resources for newcomers' },
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

const PROVINCES = [
  'Ontario', 'British Columbia', 'Alberta', 'Quebec',
  'Manitoba', 'Saskatchewan', 'Nova Scotia',
];

export default function Emergency() {
  const [selectedProvince, setSelectedProvince] = useState('');
  const [showProvinceMenu, setShowProvinceMenu] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['myProfile'],
    queryFn: async () => {
      const user = await base44.auth.me();
      const results = await base44.entities.UserProfile.filter({ created_by: user.email });
      return results[0] || null;
    },
  });

  // Auto-set province from profile
  const activeProvince = selectedProvince || profile?.province || '';

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
          {EMERGENCY.map(e => {
            const href = e.tel ? `tel:${e.tel}` : e.sms ? `sms:${e.sms}${e.smsBody ? `?body=${encodeURIComponent(e.smsBody)}` : ''}` : null;
            const Inner = (
              <>
                <div className={`${e.color} text-white px-3 py-1.5 rounded-lg text-sm font-bold font-mono flex-shrink-0 min-w-[80px] text-center`}>
                  {e.number}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{e.label}</p>
                  <p className="text-xs text-muted-foreground">{e.note}</p>
                </div>
                <Phone className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
              </>
            );
            return href ? (
              <a key={e.label} href={href} className="flex items-center gap-3 p-3 rounded-xl bg-white/60 dark:bg-card border border-red-100 dark:border-border hover:border-red-300 hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors active:scale-[0.98]">
                {Inner}
              </a>
            ) : (
              <div key={e.label} className="flex items-center gap-3 p-3 rounded-xl bg-white/60 dark:bg-card border border-red-100 dark:border-border">
                {Inner}
              </div>
            );
          })}
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
      <div className="bg-card rounded-2xl border border-border/50 p-5 mb-5">
        <h2 className="font-heading font-bold text-base mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-600" /> Mental Health Support
        </h2>
        <LinkList items={MENTAL_HEALTH} />
      </div>

      {/* Regional Resources */}
      <div className="bg-card rounded-2xl border border-border/50 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-base flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" /> Regional Resources
          </h2>
          {/* Province selector */}
          <div className="relative">
            <button
              onClick={() => setShowProvinceMenu(p => !p)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 text-xs font-medium bg-muted/50 hover:bg-muted transition-colors"
            >
              {activeProvince || 'Select Province'}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showProvinceMenu ? 'rotate-180' : ''}`} />
            </button>
            {showProvinceMenu && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-card border border-border/60 rounded-xl shadow-lg z-20 overflow-hidden">
                {PROVINCES.map(p => (
                  <button
                    key={p}
                    onClick={() => { setSelectedProvince(p); setShowProvinceMenu(false); }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-muted transition-colors ${activeProvince === p ? 'text-primary bg-primary/5' : 'text-foreground'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {activeProvince ? (
          <RegionalContacts province={activeProvince} />
        ) : (
          <div className="text-center py-8">
            <MapPin className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Select your province to see local crisis lines and settlement services</p>
          </div>
        )}
      </div>
    </div>
  );
}