import { useState } from 'react';
import { Phone, Globe, MapPin, Mail, ExternalLink, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getOrgLogo } from '@/lib/orgLogos';

const organizations = [
  // Edmonton
  { city: 'Edmonton', category: 'Literacy & Education', name: 'Project Adult Literacy Society (PALS)', website: 'https://palsedmonton.ca/', address: '#416, 9707 110 Street NW, Edmonton, AB T5K 2L9', phone: '780-424-5514', email: 'info@palsedmonton.ca', services: ['Adult literacy tutoring (reading, writing, math, digital skills)', 'Volunteer mentorship programs'], note: 'Volunteers support learners one-on-one to build life and employment skills.' },
  { city: 'Edmonton', category: 'Newcomer Support', name: 'Edmonton Mennonite Centre for Newcomers (EMCN)', website: 'https://emcn.ab.ca', address: '11713 82 St NW, Edmonton, AB', phone: '780-424-7709', email: '', services: ['Settlement & integration', 'Language programs', 'Volunteer mentorship'], note: '' },
  { city: 'Edmonton', category: 'Literacy & Education', name: 'Centre for Family Literacy', website: 'https://famlit.ca', address: 'Edmonton, AB', phone: '780-421-7323', email: '', services: ['Family literacy programs', 'Volunteer tutoring opportunities'], note: 'Volunteers help adults and families improve literacy skills.' },
  { city: 'Edmonton', category: 'Food & Shelter', name: 'Bissell Centre', website: 'https://bissellcentre.org', address: '10527 96 St NW, Edmonton, AB', phone: '780-423-2285', email: '', services: ['Housing support', 'Employment programs', 'Volunteer community outreach'], note: '' },
  { city: 'Edmonton', category: 'Food & Shelter', name: 'Hope Mission', website: 'https://hopemission.com', address: '9908 106 Ave NW, Edmonton, AB', phone: '780-422-2018', email: '', services: ['Shelter & meals', 'Addiction recovery', 'Volunteer meal service'], note: '' },
  { city: 'Edmonton', category: 'Food & Shelter', name: 'Edmonton Food Bank', website: 'https://www.edmontonsfoodbank.com', address: '11508 120 St NW, Edmonton, AB', phone: '780-425-4190', email: '', services: ['Food distribution', 'Volunteer warehouse & delivery roles'], note: '' },
  { city: 'Edmonton', category: 'Youth & Family', name: 'YMCA of Northern Alberta', website: 'https://northernalberta.ymca.ca', address: 'Edmonton, AB', phone: '780-426-9622', email: '', services: ['Newcomer programs', 'Youth mentoring', 'Volunteer programs'], note: '' },
  { city: 'Edmonton', category: 'Youth & Family', name: 'Caregivers Alberta', website: 'https://caregiversalberta.ca', address: 'Edmonton, AB', phone: '780-453-5088', email: '', services: ['Caregiver support', 'Volunteer peer support roles'], note: 'Provides coaching, education, and support programs for caregivers.' },
  // Calgary
  { city: 'Calgary', category: 'Newcomer Support', name: 'Centre for Newcomers', website: 'https://www.centrefornewcomers.ca', address: '565 36 St NE #125, Calgary, AB', phone: '403-569-3325', email: '', services: ['Settlement support', 'Volunteer mentorship'], note: '' },
  { city: 'Calgary', category: 'Newcomer Support', name: 'Calgary Immigrant Women\'s Association (CIWA)', website: 'https://www.ciwa-online.com', address: '200, 138 4 Ave SE, Calgary, AB', phone: '403-263-4414', email: '', services: ['Women-focused support', 'Employment & language', 'Volunteer programs'], note: '' },
  { city: 'Calgary', category: 'Newcomer Support', name: 'Immigrant Services Calgary', website: 'https://www.immigrantservicescalgary.ca', address: '910 7 Ave SW, Calgary, AB', phone: '403-265-1120', email: '', services: ['Settlement services', 'Volunteer roles'], note: '' },
  { city: 'Calgary', category: 'Literacy & Education', name: 'The Immigrant Education Society (TIES)', website: 'https://www.immigrant-education.ca', address: '3820 32 St NE, Calgary, AB', phone: '403-235-3666', email: '', services: ['ESL programs', 'Volunteer teaching support'], note: '' },
  { city: 'Calgary', category: 'Food & Shelter', name: 'Calgary Food Bank', website: 'https://www.calgaryfoodbank.com', address: '5000 11 St SE, Calgary, AB', phone: '403-253-2055', email: '', services: ['Food distribution', 'Volunteer packing & logistics'], note: '' },
  { city: 'Calgary', category: 'Food & Shelter', name: 'The Mustard Seed', website: 'https://theseed.ca', address: 'Calgary, AB', phone: '403-269-1319', email: '', services: ['Shelter & meals', 'Volunteer outreach'], note: '' },
  // Province-wide
  { city: 'Province-Wide', category: 'Newcomer Support', name: 'Volunteer Connector', website: 'https://www.volunteerconnector.org', address: 'Alberta', phone: '', email: '', services: ['Connects volunteers to hundreds of opportunities across Alberta', 'Filters by city, interest, and availability'], note: '' },
  { city: 'Province-Wide', category: 'Youth & Family', name: 'United Way Alberta Capital Region', website: 'https://www.myunitedway.ca', address: 'Edmonton, AB', phone: '780-990-1000', email: '', services: ['Community support programs', 'Volunteer engagement'], note: '' },
  { city: 'Province-Wide', category: 'Emergency & Crisis', name: 'Canadian Red Cross (Alberta)', website: 'https://www.redcross.ca', address: 'Alberta', phone: '', email: '', services: ['Emergency response', 'Disaster relief volunteering'], note: '' },
];

const categoryColors = {
  'Literacy & Education': 'bg-purple-500/10 text-purple-700 border-purple-200',
  'Food & Shelter': 'bg-orange-500/10 text-orange-700 border-orange-200',
  'Newcomer Support': 'bg-teal-500/10 text-teal-700 border-teal-200',
  'Youth & Family': 'bg-blue-500/10 text-blue-700 border-blue-200',
  'Emergency & Crisis': 'bg-red-500/10 text-red-700 border-red-200',
};

const CITIES = ['all', 'Edmonton', 'Calgary', 'Province-Wide'];
const CATEGORIES = ['all', 'Literacy & Education', 'Food & Shelter', 'Newcomer Support', 'Youth & Family', 'Emergency & Crisis'];

export default function Volunteer() {
  const [cityFilter, setCityFilter] = useState('all');
  const [catFilter, setCatFilter] = useState('all');

  const filtered = organizations.filter(o => {
    const cityMatch = cityFilter === 'all' || o.city === cityFilter;
    const catMatch = catFilter === 'all' || o.category === catFilter;
    return cityMatch && catMatch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-10">
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-1 flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary" />
          Volunteer & Support Organizations
        </h1>
        <p className="text-muted-foreground text-sm">Find volunteer opportunities and community support across Alberta.</p>
      </div>

      {/* City Filter */}
      <div className="flex gap-1.5 flex-wrap mb-3">
        {CITIES.map(c => (
          <button key={c} onClick={() => setCityFilter(c)}
            className={cn("px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border",
              cityFilter === c ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border/50 text-muted-foreground hover:border-primary/30")}>
            {c === 'all' ? 'All Locations' : c}
          </button>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex gap-1.5 flex-wrap mb-5">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={cn("px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border",
              catFilter === c ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border/50 text-muted-foreground hover:border-primary/30")}>
            {c === 'all' ? 'All Categories' : c}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mb-4">{filtered.length} organization{filtered.length !== 1 ? 's' : ''} found</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((org, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-5 flex flex-col gap-3 hover:border-primary/20 hover:shadow-sm transition-all">
            <div className="flex items-start gap-3">
              {getOrgLogo(org.name) && (
                <img src={getOrgLogo(org.name)} alt={org.name} className="w-8 h-8 rounded object-contain flex-shrink-0 mt-0.5" onError={e => e.target.style.display='none'} />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-md border", categoryColors[org.category])}>{org.category}</span>
                  <span className="text-[10px] text-muted-foreground font-medium">{org.city}</span>
                </div>
                <h2 className="font-heading font-bold text-sm leading-snug">{org.name}</h2>
              </div>
            </div>

            <ul className="space-y-0.5">
              {org.services.map((s, j) => (
                <li key={j} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <span className="text-primary mt-0.5">•</span>{s}
                </li>
              ))}
            </ul>
            {org.note && <p className="text-xs text-primary/80 italic">{org.note}</p>}

            <div className="space-y-1.5 text-xs text-muted-foreground">
              {org.address && org.address !== org.city && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-primary/50 mt-0.5" />
                  <span>{org.address}</span>
                </div>
              )}
              {org.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0 text-primary/50" />
                  <a href={`tel:${org.phone}`} className="hover:text-primary transition-colors">{org.phone}</a>
                </div>
              )}
              {org.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0 text-primary/50" />
                  <a href={`mailto:${org.email}`} className="hover:text-primary transition-colors truncate">{org.email}</a>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-auto pt-1">
              <a href={org.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/15 transition-colors">
                <Globe className="w-3 h-3" /> Website <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
              {org.phone && (
                <a href={`tel:${org.phone}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-semibold hover:bg-muted/70 transition-colors">
                  <Phone className="w-3 h-3" /> Call
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}