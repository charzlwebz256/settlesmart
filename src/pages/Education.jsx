import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Globe, MapPin, Mail, ExternalLink, GraduationCap, BadgeCheck, BookOpen, Sparkles, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getOrgLogo } from '@/lib/orgLogos';
import ResourceList from '@/components/work/ResourceList';

const institutions = [
  // Edmonton
  { city: 'Edmonton', type: 'University', name: 'University of Alberta', website: 'https://www.ualberta.ca', address: '83 University Campus NW, Edmonton, AB T6G 2J9', phone: '(780) 407-8861', email: '', notes: "One of Canada's top universities with 200+ programs.", newcomer: false },
  { city: 'Edmonton', type: 'University', name: 'Concordia University of Edmonton', website: 'https://concordia.ab.ca', address: '7128 Ada Blvd NW, Edmonton, AB T5B 4E4', phone: '(780) 479-8481', email: 'info@concordia.ab.ca', notes: 'Undergraduate and graduate programs with smaller class sizes.', newcomer: false },
  { city: 'Edmonton', type: 'University', name: 'MacEwan University', website: 'https://www.macewan.ca', address: '10700 104 Ave NW, Edmonton, AB', phone: '(780) 497-5000', email: '', notes: 'Strong in business, arts, and health programs.', newcomer: false },
  { city: 'Edmonton', type: 'Polytechnic', name: 'NAIT', website: 'https://www.nait.ca', address: '11762 106 St NW, Edmonton, AB', phone: '(780) 471-6248', email: '', notes: 'Leading polytechnic for technical and career-focused training.', newcomer: false },
  { city: 'Edmonton', type: 'College', name: 'Sundance College', website: 'https://sundancecollege.com', address: 'Downtown Edmonton (near Central LRT Station)', phone: '', email: '', notes: 'Diploma programs with practicum training.', newcomer: true },
  { city: 'Edmonton', type: 'College', name: 'Aquinas College', website: 'https://aquinascollege.ca', address: '10301 109 Street NW, Edmonton, AB T5J 2Z1', phone: '+1 587-416-0549', email: 'info@aquinascollege.ca', notes: 'Career-focused diploma programs.', newcomer: true },
  { city: 'Edmonton', type: 'College', name: 'Campbell College', website: 'https://campbellcollege.ca', address: '6020 104 St NW, Edmonton, AB T6H 5S4', phone: '780-448-1850', email: 'info@campbellcollege.ca', notes: 'Healthcare and career certification programs.', newcomer: true },
  { city: 'Edmonton', type: 'College', name: 'MaKami College', website: 'https://makamicollege.com', address: '8330 82 Ave NW, Edmonton, AB T6C 4E3', phone: '780-468-3454', email: '', notes: 'Known for massage therapy and healthcare training.', newcomer: true },
  // Calgary
  { city: 'Calgary', type: 'University', name: 'University of Calgary', website: 'https://www.ucalgary.ca', address: '2500 University Dr NW, Calgary, AB', phone: '(403) 220-4636', email: '', notes: 'Top-ranked research university with strong engineering and business programs.', newcomer: false },
  { city: 'Calgary', type: 'University', name: 'Mount Royal University', website: 'https://www.mtroyal.ca', address: '4825 Mt Royal Gate SW, Calgary, AB', phone: '(403) 440-6111', email: '', notes: 'Known for undergraduate programs and smaller class sizes.', newcomer: false },
  { city: 'Calgary', type: 'Polytechnic', name: 'SAIT', website: 'https://www.sait.ca', address: '1301 16 Ave NW, Calgary, AB', phone: '(403) 284-7248', email: '', notes: 'Polytechnic focused on trades and applied education.', newcomer: false },
  { city: 'Calgary', type: 'College', name: 'Bow Valley College', website: 'https://bowvalleycollege.ca', address: '345 6 Ave SE, Calgary, AB', phone: '(403) 410-1400', email: '', notes: 'Popular among newcomers for career programs and English training.', newcomer: true },
  { city: 'Calgary', type: 'College', name: 'Aquinas College', website: 'https://aquinascollege.ca', address: '9705 Horton Rd SW, Calgary, AB T2V 2X5', phone: '+1 877-460-8575', email: '', notes: 'Career-focused diploma programs.', newcomer: true },
  { city: 'Calgary', type: 'College', name: 'MCG Career College', website: 'https://mcgcollege.com', address: '4774 Westwinds Dr NE, Calgary, AB T3J 0L7', phone: '1-888-261-8999', email: 'info@mcgcollege.com', notes: 'Career-focused programs in health and business.', newcomer: true },
  { city: 'Calgary', type: 'College', name: 'MaKami College', website: 'https://makamicollege.com', address: '3800 Memorial Dr NE, Calgary, AB T2A 2K2', phone: '403-474-0772', email: '', notes: 'Known for massage therapy and healthcare training.', newcomer: true },
];

const typeColors = {
  University: 'bg-blue-500/10 text-blue-700 border-blue-200',
  Polytechnic: 'bg-orange-500/10 text-orange-700 border-orange-200',
  College: 'bg-teal-500/10 text-teal-700 border-teal-200',
};

const TUITION = {
  University: { domestic: '$6,000–$10,000', international: '$25,000–$40,000' },
  Polytechnic: { domestic: '$5,000–$9,000', international: '$16,000–$26,000' },
  College: { domestic: '$5,000–$9,000', international: '$14,000–$24,000' },
};

const PROVINCES = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
  'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia',
  'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon',
];

const PROVINCE_FINDERS = {
  'British Columbia': [
    { label: 'EducationPlannerBC', url: 'https://educationplannerbc.ca/', note: 'Official BC directory of universities, colleges and trades programs' },
    { label: 'WorkBC, Training', url: 'https://www.workbc.ca/', note: 'Short-term and skills training across BC' },
  ],
  'Ontario': [
    { label: 'OUInfo, Ontario universities', url: 'https://www.ouinfo.ca/', note: 'Official directory of Ontario universities and programs' },
    { label: 'Ontario colleges', url: 'https://www.ontariocolleges.ca/', note: 'Apply to all 24 public colleges in Ontario' },
  ],
  'Quebec': [
    { label: 'Quebec, Education', url: 'https://www.quebec.ca/en/education', note: 'Provincial education system, CEGEPs and universities' },
  ],
  'Manitoba': [
    { label: 'Manitoba, Education', url: 'https://www.edu.gov.mb.ca/', note: 'Provincial education and post-secondary information' },
  ],
  'Saskatchewan': [
    { label: 'Saskatchewan, Education', url: 'https://www.saskatchewan.ca/residents/education-and-learning', note: 'Post-secondary and training information' },
  ],
  'Nova Scotia': [
    { label: 'Nova Scotia, Education', url: 'https://novascotia.ca/education/', note: 'Provincial education and post-secondary information' },
  ],
  'New Brunswick': [
    { label: 'New Brunswick, Education', url: 'https://www.gnb.ca/en.html', note: 'Provincial education and post-secondary information' },
  ],
  'Prince Edward Island': [
    { label: 'PEI, Education', url: 'https://www.princeedwardisland.ca/en/topic/education', note: 'Provincial education and post-secondary information' },
  ],
  'Newfoundland and Labrador': [
    { label: 'NL, Education', url: 'https://www.gov.nl.ca/education/', note: 'Provincial education and post-secondary information' },
  ],
  'Yukon': [
    { label: 'Yukon, Education', url: 'https://yukon.ca/en/education', note: 'Territorial education and training information' },
  ],
  'Northwest Territories': [
    { label: 'NWT, Education, Culture and Employment', url: 'https://www.ece.gov.nt.ca/', note: 'Territorial education and training information' },
  ],
  'Nunavut': [
    { label: 'Government of Nunavut, Education', url: 'https://www.gov.nu.ca/education', note: 'Territorial education and training information' },
  ],
};

const LANGUAGE_PROGRAMS = [
  { label: 'Free language classes for newcomers (LINC)', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/settle-canada/language-skills.html', note: 'Official IRCC page: free LINC classes and language assessment' },
  { label: 'Mennonite Centre for Newcomers, Edmonton', url: 'https://www.mcnedmonton.com/', note: 'LINC and English classes for newcomers in Edmonton' },
  { label: 'Bow Valley College, Language training', url: 'https://bowvalleycollege.ca/', note: 'English language programs in Calgary' },
  { label: '211 Canada', url: 'https://www.211.ca/', note: 'Dial 211 for free language classes in your city' },
];

const CREDENTIAL_LINKS = [
  { label: 'CICIC, International credentials', url: 'https://www.cicic.ca/', note: 'How credential assessment works and which body to use' },
  { label: 'Canada.ca, Get your education assessed', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/documents/education-assessed.html', note: 'Official federal guidance' },
  { label: 'IQAS, Alberta', url: 'https://www.alberta.ca/iqas', note: 'Alberta government assessment service' },
  { label: 'WES Canada', url: 'https://www.wes.org/ca/', note: 'Designated credential assessment provider' },
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

export default function Education() {
  const [province, setProvince] = useState('Alberta');
  const [cityFilter, setCityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [newcomerOnly, setNewcomerOnly] = useState(false);

  const filtered = institutions.filter(i => {
    const cityMatch = cityFilter === 'all' || i.city === cityFilter;
    const typeMatch = typeFilter === 'all' || i.type === typeFilter;
    const newcomerMatch = !newcomerOnly || i.newcomer;
    return cityMatch && typeMatch && newcomerMatch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-10">
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-1 flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-primary" />
          Education & Training
        </h1>
        <p className="text-muted-foreground text-sm">
          Post-secondary institutions, tuition guidance, language classes and credential recognition.
        </p>
      </div>

      <div className="space-y-5">
        {/* Province filter */}
        <div className="bg-card rounded-2xl border border-border/50 p-5">
          <h2 className="font-heading font-bold text-base mb-1 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" /> Choose your province or territory
          </h2>
          <p className="text-xs text-muted-foreground mb-4 leading-snug">
            Detailed campus listings are available for Alberta. For every other province and territory we link the official
            provincial directory.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {PROVINCES.map(p => (
              <button
                key={p}
                onClick={() => { setProvince(p); setCityFilter('all'); setTypeFilter('all'); setNewcomerOnly(false); }}
                className={cn(
                  "px-3 py-1.5 min-h-[36px] rounded-xl text-xs font-semibold transition-all border",
                  province === p
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border/50 text-muted-foreground hover:border-primary/30"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {province === 'Alberta' ? (
          <>
            {/* Filters */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <div className="flex gap-1.5">
                  {['all', 'Edmonton', 'Calgary'].map(c => (
                    <button key={c} onClick={() => setCityFilter(c)}
                      className={cn("px-3 py-1.5 min-h-[44px] rounded-xl text-xs font-semibold transition-all border",
                        cityFilter === c ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border/50 text-muted-foreground hover:border-primary/30")}>
                      {c === 'all' ? 'All Cities' : c}
                    </button>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  {['all', 'University', 'Polytechnic', 'College'].map(t => (
                    <button key={t} onClick={() => setTypeFilter(t)}
                      className={cn("px-3 py-1.5 min-h-[44px] rounded-xl text-xs font-semibold transition-all border",
                        typeFilter === t ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border/50 text-muted-foreground hover:border-primary/30")}>
                      {t === 'all' ? 'All Types' : t}
                    </button>
                  ))}
                </div>
                <button onClick={() => setNewcomerOnly(v => !v)}
                  className={cn("px-3 py-1.5 min-h-[44px] rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5",
                    newcomerOnly ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border/50 text-muted-foreground hover:border-primary/30")}>
                  <BadgeCheck className="w-3.5 h-3.5" /> Newcomer friendly
                </button>
              </div>
              <p className="text-xs text-muted-foreground">{filtered.length} institution{filtered.length !== 1 ? 's' : ''} found</p>
            </div>

            <div className="flex items-start gap-2 text-[11px] text-muted-foreground bg-muted/40 rounded-xl p-3 leading-snug">
              <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-primary/60" />
              <p>
                Tuition ranges are approximate annual figures for a full-time year and differ by program. International
                students usually pay more. Confirm the exact fee with the institution before applying.
              </p>
            </div>

            <div className="auto-grid gap-4">
              {filtered.map((inst, i) => {
                const tuition = TUITION[inst.type];
                return (
                  <div key={i} className="bg-card rounded-2xl border border-border/50 p-5 flex flex-col gap-3 hover:border-primary/20 hover:shadow-sm transition-all">
                    <div className="flex items-start gap-3">
                      {getOrgLogo(inst.name) && (
                        <img src={getOrgLogo(inst.name)} alt={inst.name} className="w-8 h-8 rounded object-contain flex-shrink-0 mt-0.5" onError={e => e.target.style.display='none'} />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-md border", typeColors[inst.type])}>{inst.type}</span>
                          <span className="text-[10px] text-muted-foreground font-medium">{inst.city}</span>
                          {inst.newcomer && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                              🍁 Newcomer friendly
                            </span>
                          )}
                        </div>
                        <h2 className="font-heading font-bold text-sm leading-snug">{inst.name}</h2>
                      </div>
                    </div>

                    {inst.notes && <p className="text-xs text-muted-foreground leading-relaxed">{inst.notes}</p>}

                    {tuition && (
                      <div className="text-[11px] text-muted-foreground bg-muted/40 rounded-lg px-2.5 py-1.5 leading-snug">
                        <span className="font-semibold text-foreground">Approx. tuition / year:</span>{' '}
                        Domestic {tuition.domestic} · International {tuition.international}
                      </div>
                    )}

                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-primary/50 mt-0.5" />
                        <span>{inst.address}</span>
                      </div>
                      {inst.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 flex-shrink-0 text-primary/50" />
                          <a href={`tel:${inst.phone}`} className="hover:text-primary transition-colors">{inst.phone}</a>
                        </div>
                      )}
                      {inst.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 flex-shrink-0 text-primary/50" />
                          <a href={`mailto:${inst.email}`} className="hover:text-primary transition-colors truncate">{inst.email}</a>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-auto pt-1">
                      <a href={inst.website} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/15 transition-colors">
                        <Globe className="w-3 h-3" /> Website
                        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                      </a>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(inst.address)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-semibold hover:bg-muted/70 transition-colors">
                        <MapPin className="w-3 h-3" /> Directions
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <Section
            icon={MapPin}
            title={`Institutions in ${province}`}
            intro="Use the official provincial directory to compare institutions, programs and tuition for this province or territory."
          >
            <ResourceList items={PROVINCE_FINDERS[province] || []} />
            <p className="text-[11px] text-muted-foreground mt-3 leading-snug">
              Alberta has full campus listings on this page, select Alberta above to browse them.
            </p>
          </Section>
        )}

        <Section
          icon={BookOpen}
          title="Free language classes (LINC)"
          intro="Language Instruction for Newcomers to Canada (LINC) is free for eligible newcomers. Assessment is required before you start."
        >
          <ResourceList items={LANGUAGE_PROGRAMS} />
        </Section>

        <Section
          icon={Sparkles}
          title="Scholarships & financial aid"
          intro="Search Canadian scholarships, bursaries and awards, then track deadlines and applications."
        >
          <Link to="/scholarships"
            className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/15 hover:bg-primary/10 transition-colors group">
            <div>
              <p className="text-sm font-semibold group-hover:text-primary transition-colors">Browse scholarships for newcomers</p>
              <p className="text-xs text-muted-foreground">Filter by province, city and funding type</p>
            </div>
            <ExternalLink className="w-4 h-4 text-primary/60" />
          </Link>
        </Section>

        <Section
          icon={BadgeCheck}
          title="Credential assessment & bridging"
          intro="If you trained outside Canada, get your credentials assessed and check whether your profession is regulated."
        >
          <ResourceList items={CREDENTIAL_LINKS} />
          <Link to="/career-support"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
            More on credential recognition and bridging programs →
          </Link>
        </Section>
      </div>
    </div>
  );
}