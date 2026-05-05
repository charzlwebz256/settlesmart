import { useState } from 'react';
import { Phone, Globe, MapPin, Mail, ExternalLink, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

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

export default function Education() {
  const [cityFilter, setCityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = institutions.filter(i => {
    const cityMatch = cityFilter === 'all' || i.city === cityFilter;
    const typeMatch = typeFilter === 'all' || i.type === typeFilter;
    return cityMatch && typeMatch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-10">
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-1 flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-primary" />
          Universities & Colleges in Alberta
        </h1>
        <p className="text-muted-foreground text-sm">Find post-secondary institutions in Edmonton and Calgary.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex gap-1.5">
          {['all', 'Edmonton', 'Calgary'].map(c => (
            <button key={c} onClick={() => setCityFilter(c)}
              className={cn("px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border",
                cityFilter === c ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border/50 text-muted-foreground hover:border-primary/30")}>
              {c === 'all' ? 'All Cities' : c}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {['all', 'University', 'Polytechnic', 'College'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={cn("px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border",
                typeFilter === t ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border/50 text-muted-foreground hover:border-primary/30")}>
              {t === 'all' ? 'All Types' : t}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-4">{filtered.length} institution{filtered.length !== 1 ? 's' : ''} found</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((inst, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-5 flex flex-col gap-3 hover:border-primary/20 hover:shadow-sm transition-all">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-md border", typeColors[inst.type])}>{inst.type}</span>
                  <span className="text-[10px] text-muted-foreground font-medium">{inst.city}</span>
                  {inst.newcomer && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                      🍁 Newcomer Friendly
                    </span>
                  )}
                </div>
                <h2 className="font-heading font-bold text-sm leading-snug">{inst.name}</h2>
              </div>
            </div>

            {inst.notes && <p className="text-xs text-muted-foreground leading-relaxed">{inst.notes}</p>}

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
        ))}
      </div>
    </div>
  );
}