import { Phone, Globe, MapPin, Mail, ExternalLink, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

// ── LANGUAGE DATA ────────────────────────────────────────────────────────────
const languageOrgs = [
  { city: 'Edmonton', name: 'NorQuest College (LINC Program)', website: 'https://www.norquest.ca', address: '10215 108 St NW, Edmonton, AB', phone: '780-644-6000', email: '', services: ['Free LINC English classes (CLB 0–8)', 'Flexible schedules (full-time/part-time)', 'Work-integrated learning'], note: 'Helps newcomers build English for jobs and daily life' },
  { city: 'Edmonton', name: 'ASSIST Community Services Centre', website: 'https://assistcsc.org', address: '9649 – 105A Ave NW, Edmonton, AB T5H 0M3', phone: '780-429-3111', email: 'info@assistcsc.org', services: ['LINC English classes', 'Language placement & registration', 'Newcomer support programs'], note: 'Offers both daytime and evening classes' },
  { city: 'Edmonton', name: 'Global TESOL College', website: 'https://globaltesol.com', address: 'Unit 200, 10117 150 St NW, Edmonton, AB', phone: '+1-780-438-5704', email: 'info@globaltesol.com', services: ['TESOL certification', 'English teaching training', 'Online & in-person courses'], note: '' },
  { city: 'Edmonton', name: 'Edmonton Mennonite Centre for Newcomers', website: 'https://emcn.ab.ca', address: '11713 82 St NW, Edmonton, AB', phone: '780-424-7709', email: '', services: ['ESL & LINC classes', 'Language support for newcomers', 'Integration programs'], note: '' },
  { city: 'Calgary', name: 'Calgary Catholic Immigration Society', website: 'https://www.ccisab.ca', address: '1111 11 Ave SW, Calgary, AB', phone: '403-262-2006', email: '', services: ['Free LINC English classes', 'Day & evening programs', 'Beginner to advanced levels'], note: 'Designed to help newcomers integrate and find employment' },
  { city: 'Calgary', name: 'Equilibrium School', website: 'https://www.equilibrium.ab.ca', address: '707 14 St NW, Calgary, AB T2N 2A4', phone: '403-283-1111', email: 'school@equilibrium.ab.ca', services: ['LINC (free English classes)', 'ESL / EAL programs', 'Language testing & accent reduction'], note: 'Offers CLB Pre-Benchmark to Level 4 classes' },
  { city: 'Calgary', name: 'Agapé Language Centre', website: 'https://agapelanguagecentre.com', address: 'Calgary, AB', phone: '403-516-1846', email: 'contact@agapelanguagecentre.com', services: ['LINC English programs (free)', 'Online & in-person classes', 'Focus on real-life communication (banking, health, jobs)'], note: '' },
  { city: 'Calgary', name: 'CanLanguage', website: 'https://canlanguage.com', address: '4039 Brentwood Rd NW, Calgary, AB', phone: '403-688-9999', email: 'info@canlanguage.com', services: ['IELTS & CELPIP preparation', 'ESL courses', 'Translation & interpreter training'], note: '' },
];

// ── EDUCATION DATA ───────────────────────────────────────────────────────────
const educationInstitutions = [
  { city: 'Edmonton', type: 'University', name: 'University of Alberta', website: 'https://www.ualberta.ca', address: '83 University Campus NW, Edmonton, AB T6G 2J9', phone: '(780) 407-8861', email: '' },
  { city: 'Edmonton', type: 'University', name: 'Concordia University of Edmonton', website: 'https://concordia.ab.ca', address: '7128 Ada Blvd NW, Edmonton, AB T5B 4E4', phone: '(780) 479-8481', email: 'info@concordia.ab.ca' },
  { city: 'Edmonton', type: 'University', name: 'MacEwan University', website: 'https://www.macewan.ca', address: '10700 104 Ave NW, Edmonton, AB', phone: '(780) 497-5000', email: '' },
  { city: 'Edmonton', type: 'Polytechnic', name: 'NAIT', website: 'https://www.nait.ca', address: '11762 106 St NW, Edmonton, AB', phone: '(780) 471-6248', email: '' },
  { city: 'Edmonton', type: 'College', name: 'Sundance College', website: 'https://sundancecollege.com', address: 'Downtown Edmonton (near Central LRT Station)', phone: '', email: '' },
  { city: 'Edmonton', type: 'College', name: 'Aquinas College', website: 'https://aquinascollege.ca', address: '10301 109 Street NW, Edmonton, AB T5J 2Z1', phone: '+1 587-416-0549', email: 'info@aquinascollege.ca' },
  { city: 'Edmonton', type: 'College', name: 'Campbell College', website: 'https://campbellcollege.ca', address: '6020 104 St NW, Edmonton, AB T6H 5S4', phone: '780-448-1850', email: 'info@campbellcollege.ca' },
  { city: 'Edmonton', type: 'College', name: 'MaKami College', website: 'https://makamicollege.com', address: '8330 82 Ave NW, Edmonton, AB T6C 4E3', phone: '780-468-3454', email: '' },
  { city: 'Calgary', type: 'University', name: 'University of Calgary', website: 'https://www.ucalgary.ca', address: '2500 University Dr NW, Calgary, AB', phone: '(403) 220-4636', email: '' },
  { city: 'Calgary', type: 'University', name: 'Mount Royal University', website: 'https://www.mtroyal.ca', address: '4825 Mt Royal Gate SW, Calgary, AB', phone: '(403) 440-6111', email: '' },
  { city: 'Calgary', type: 'Polytechnic', name: 'SAIT', website: 'https://www.sait.ca', address: '1301 16 Ave NW, Calgary, AB', phone: '(403) 284-7248', email: '' },
  { city: 'Calgary', type: 'College', name: 'Bow Valley College', website: 'https://bowvalleycollege.ca', address: '345 6 Ave SE, Calgary, AB', phone: '(403) 410-1400', email: '' },
  { city: 'Calgary', type: 'College', name: 'Aquinas College', website: 'https://aquinascollege.ca', address: '9705 Horton Rd SW, Calgary, AB T2V 2X5', phone: '+1 877-460-8575', email: '' },
  { city: 'Calgary', type: 'College', name: 'MCG Career College', website: 'https://mcgcollege.com', address: '4774 Westwinds Dr NE, Calgary, AB T3J 0L7', phone: '1-888-261-8999', email: 'info@mcgcollege.com' },
  { city: 'Calgary', type: 'College', name: 'MaKami College', website: 'https://makamicollege.com', address: '3800 Memorial Dr NE, Calgary, AB T2A 2K2', phone: '403-474-0772', email: '' },
];

// ── LEGAL DATA ───────────────────────────────────────────────────────────────
const legalOrgs = [
  { section: 'Legal Aid & Provincial Services', name: 'Legal Aid Alberta (LAA)', website: 'https://www.legalaid.ab.ca', address: '900 Sun Life Place, 10123 99 St NW, Edmonton, AB T5J 3H1', phone: '1-866-845-3425', email: '', services: ['Criminal law help', 'Family law (custody, divorce, support)', 'Immigration and refugee legal support', 'Youth legal representation', 'Domestic violence protection orders'] },
  { section: 'Legal Aid & Provincial Services', name: 'Alberta Law Libraries', website: 'https://lawlibrary.ab.ca', address: 'Courthouses across Alberta', phone: '', email: '', services: ['Free legal information', 'Help finding lawyers and legal resources', 'Court forms and legal research'] },
  { section: 'Legal Aid & Provincial Services', name: '211 Alberta (Legal Referrals)', website: 'https://ab.211.ca', address: '', phone: '211', email: '', services: ['Legal clinics', 'Housing legal help', 'Family violence legal supports'] },
  { section: 'Free Legal Clinics', name: 'Edmonton Community Legal Centre (ECLC)', website: 'https://www.eclc.ca', address: 'Suite 200, 10020 100 Street, Edmonton, AB T5J 0N3', phone: '780-702-1725', email: 'intake@eclc.ca', services: ['Free legal advice (income-based)', 'Family law, tenant issues, employment law', 'Immigration and human rights'] },
  { section: 'Free Legal Clinics', name: 'Calgary Legal Guidance (CLG)', website: 'https://clg.ab.ca', address: 'Calgary, AB', phone: '(403) 234-9266', email: '', services: ['Free legal advice clinics', 'Immigration, family law, elder law', 'Homeless outreach legal assistance'] },
  { section: 'Free Legal Clinics', name: 'Central Alberta Community Legal Clinic', website: 'https://cplea.ca/legalhelp/', address: 'Red Deer, AB', phone: '403-314-9129', email: '', services: ['Free legal advice for eligible clients', 'Family, housing, employment issues'] },
  { section: 'Free Legal Clinics', name: 'Student Legal Clinics (University-based)', website: 'https://cplea.ca/legalhelp/', address: 'Edmonton & Calgary universities', phone: '', email: '', services: ['Free legal assistance by supervised law students', 'Small claims, landlord-tenant, minor disputes'] },
  { section: 'Lawyer Referral Services', name: 'Law Society of Alberta', website: 'https://www.lawsociety.ab.ca', address: 'Suite 700, 333 11 Ave SW, Calgary, AB T2R 1L9', phone: '1-800-661-9003', email: '', services: ['Lawyer directory', 'Free 30-min consultation referral', 'Professional regulation'] },
  { section: 'Human Rights & Justice', name: 'Alberta Human Rights Commission', website: 'https://albertahumanrights.ab.ca', address: 'Edmonton & Calgary offices', phone: '780-427-7661', email: '', services: ['Discrimination complaints (work, housing, services)', 'Human rights legal guidance'] },
  { section: 'Human Rights & Justice', name: 'Centre for Public Legal Education Alberta (CPLEA)', website: 'https://www.cplea.ca', address: 'Edmonton, AB', phone: '780-451-8764', email: '', services: ['Free legal education resources', 'Tenant, family, immigration legal info'] },
  { section: 'Specialized Legal Support', name: 'JusticeNet', website: 'https://www.justicenet.ca', address: '', phone: '', email: '', services: ['Low-income legal fee reduction', 'Family, civil, immigration law support'] },
  { section: 'Specialized Legal Support', name: 'Pro Bono Law Alberta', website: 'https://www.pbla.ca', address: 'Calgary & Edmonton', phone: '', email: '', services: ['Volunteer lawyer programs', 'Limited free legal assistance for civil cases'] },
];

// ── HEALTH DATA ──────────────────────────────────────────────────────────────
const healthFacilities = [
  { section: 'Major Hospitals – Edmonton', name: 'University of Alberta Hospital', website: 'https://www.albertahealthservices.ca/findhealth/facility.aspx?id=1001013', address: '8440 112 St NW, Edmonton, AB T6G 2B7', phone: '780-407-8822' },
  { section: 'Major Hospitals – Edmonton', name: 'Royal Alexandra Hospital', website: 'https://www.albertahealthservices.ca/findhealth/facility.aspx?id=1000970', address: '10240 Kingsway NW, Edmonton, AB T5H 3V9', phone: '780-735-4111' },
  { section: 'Major Hospitals – Edmonton', name: 'Grey Nuns Community Hospital', website: 'https://www.albertahealthservices.ca/findhealth/facility.aspx?id=1000968', address: '1100 Youville Dr W NW, Edmonton, AB T6L 5X8', phone: '780-735-7000' },
  { section: 'Major Hospitals – Calgary', name: 'Foothills Medical Centre', website: 'https://www.albertahealthservices.ca/findhealth/facility.aspx?id=1001107', address: '1403 29 St NW, Calgary, AB T2N 2T9', phone: '403-944-1110' },
  { section: 'Major Hospitals – Calgary', name: 'Peter Lougheed Centre', website: 'https://www.albertahealthservices.ca/findhealth/facility.aspx?id=1001122', address: '3500 26 Ave NE, Calgary, AB T1Y 6J4', phone: '403-943-4555' },
  { section: 'Major Hospitals – Calgary', name: 'South Health Campus', website: 'https://www.albertahealthservices.ca/findhealth/facility.aspx?id=1012140', address: '4448 Front St SE, Calgary, AB T3M 1M4', phone: '403-956-1000' },
  { section: 'Regional Hospitals', name: 'Red Deer Regional Hospital Centre', website: 'https://www.albertahealthservices.ca/findhealth/facility.aspx?id=1001113', address: '3942 50A Ave, Red Deer, AB', phone: '403-343-4422' },
  { section: 'Regional Hospitals', name: 'Medicine Hat Regional Hospital', website: 'https://www.albertahealthservices.ca/findhealth/facility.aspx?id=1001110', address: '666 5 St SW, Medicine Hat, AB', phone: '403-529-8000' },
  { section: 'Urgent Care & Walk-In', name: 'AHS Urgent Care Centres', website: 'https://www.albertahealthservices.ca', address: 'Multiple locations (Edmonton & Calgary)', phone: '811 (Health Link 24/7)', notes: 'East Edmonton Health Centre · Sheldon M. Chumir Centre (Calgary) · South Calgary Health Centre' },
  { section: 'Urgent Care & Walk-In', name: 'Medimap (Walk-In Clinic Finder)', website: 'https://medimap.ca', address: 'Online directory', phone: '', notes: 'Find nearest walk-in clinic with wait times' },
  { section: 'Dental Clinics', name: 'University of Alberta Dental Clinic', website: 'https://www.ualberta.ca/school-of-dentistry', address: 'Edmonton Clinic Health Academy, Edmonton', phone: '780-492-1319' },
  { section: 'Dental Clinics', name: 'Opencare (Dental Clinic Finder)', website: 'https://www.opencare.com', address: 'Online directory', phone: '', notes: 'Find nearest dental clinic across Alberta' },
  { section: 'Full Facility Finder', name: 'AHS Facility & Service Finder', website: 'https://www.albertahealthservices.ca/findhealth/service.aspx', address: 'All Alberta hospitals, clinics, dental, mental health', phone: '811', notes: 'Best tool to find any health facility on a map' },
];

// ── TRANSPORT DATA ───────────────────────────────────────────────────────────
const transitSystems = [
  { section: 'Edmonton Transit', name: 'Edmonton Transit Service (ETS)', website: 'https://www.edmonton.ca/ets', address: 'Edmonton, AB', phone: '311 / 780-442-5311', services: ['City buses', 'LRT (Metro Line, Capital Line, Valley Line)', 'On-Demand Transit', 'Park & Ride'], liveMap: 'https://www.edmonton.ca/ets/live-bus-finder' },
  { section: 'Calgary Transit', name: 'Calgary Transit', website: 'https://www.calgarytransit.com', address: '200 NW Centre Street, Calgary, AB T2E 2C4', phone: '403-262-1000', services: ['Bus network', 'CTrain (Red Line & Blue Line)', 'MAX Bus Rapid Transit', 'On Demand Transit'], liveMap: 'https://www.calgarytransit.com' },
  { section: 'Regional Transit', name: 'St. Albert Transit (StAT)', website: 'https://stalbert.ca/city/transit/', address: 'St. Albert, AB', phone: '780-418-6060', services: [] },
  { section: 'Regional Transit', name: 'Strathcona County Transit (Sherwood Park)', website: 'https://www.strathcona.ca/transit', address: 'Sherwood Park, AB', phone: '780-464-7433', services: [] },
  { section: 'Regional Transit', name: 'Red Deer Transit', website: 'https://www.reddeer.ca/city-services/transit/', address: 'Red Deer, AB', phone: '403-342-8225', services: [] },
  { section: 'Regional Transit', name: 'Fort McMurray Transit', website: 'https://www.rmwb.ca/transit', address: 'Fort McMurray, AB', phone: '780-743-7890', services: [] },
  { section: 'Intercity Bus', name: 'Rider Express', website: 'https://riderexpress.ca', address: 'Edmonton ↔ Calgary ↔ Saskatoon', phone: '1-833-583-3636', services: [] },
  { section: 'Intercity Bus', name: 'Ebus', website: 'https://ebus.ca', address: 'Edmonton, Calgary terminals', phone: '1-877-769-3287', services: [] },
  { section: 'Intercity Bus', name: 'Red Arrow', website: 'https://www.redarrow.ca', address: 'Edmonton & Calgary stations', phone: '1-800-232-1958', services: [] },
  { section: 'Intercity Bus', name: 'FlixBus Canada', website: 'https://www.flixbus.ca', address: 'Edmonton & Calgary stops', phone: '', services: [] },
];

// ── HOUSING DATA ─────────────────────────────────────────────────────────────
const housingOrgs = [
  { section: 'Provincial Services', name: 'Alberta Supports (Housing + Rent Assistance)', website: 'https://www.alberta.ca/affordable-housing-and-rent-assistance', address: 'Province-wide (no single office)', phone: '1-877-644-9992', email: '', services: ['Rent assistance', 'Affordable housing applications', 'Emergency financial housing support'] },
  { section: 'Provincial Services', name: 'Find Housing Alberta (Digital Housing Navigator)', website: 'https://findhousing.alberta.ca/', address: 'Online', phone: '211 Alberta', email: '', services: ['Find subsidized housing', 'Identify shelters', 'Match with housing programs'] },
  { section: 'Provincial Services', name: '211 Alberta (Housing & Crisis Referral)', website: 'https://ab.211.ca', address: '', phone: '211', email: '', services: ['Emergency shelters', 'Housing workers', 'Food + income support', 'Mental health housing support'] },
  { section: 'Edmonton Housing', name: 'Civida (Edmonton Community Housing Authority)', website: 'https://www.civida.ca', address: '10255 112 St NW, Edmonton, AB T5K 1M7', phone: '780-420-6161', email: '', services: ['Subsidized housing (rent-geared-to-income)', 'Affordable rental units', 'Tenant support programs'] },
  { section: 'Edmonton Housing', name: 'Homeward Trust Edmonton', website: 'https://homewardtrust.ca', address: 'Edmonton, AB', phone: '780-702-5267', email: 'coordinatedaccess@homewardtrust.ca', services: ['Housing placement for homelessness', 'Coordinated Access system', 'Housing-first support'] },
  { section: 'Edmonton Housing', name: 'Bissell Centre', website: 'https://bissellcentre.org', address: '10527 96 St NW, Edmonton, AB T5H 2H6', phone: '780-423-2285', email: '', services: ['Housing navigation', 'Emergency shelter referrals', 'ID replacement + income support help'] },
  { section: 'Edmonton Housing', name: 'HomeEd (Edmonton Public Housing)', website: 'https://homeed.ca', address: 'Edmonton, AB', phone: '780-496-8080', email: '', services: ['Public housing units', 'Affordable rental programs'] },
  { section: 'Edmonton Housing', name: 'The Mustard Seed', website: 'https://theseed.ca', address: '10050 105 Ave NW, Edmonton, AB', phone: '780-426-5600', email: '', services: ['Emergency shelter', 'Transitional housing', 'Housing stabilization programs'] },
  { section: 'Calgary Housing', name: 'Calgary Housing Company (CHC)', website: 'https://www.calgary.ca/calgary-housing.html', address: '1000 800 Macleod Trail SE, Calgary, AB', phone: '403-221-3660', email: '', services: ['Subsidized housing', 'Affordable rental programs', 'Rent assistance housing'] },
  { section: 'Calgary Housing', name: 'Calgary Homeless Foundation', website: 'https://calgaryhomeless.com', address: '1500 615 Macleod Trail SE, Calgary, AB T2G 4T8', phone: '403-237-6456', email: '', services: [] },
  { section: 'Calgary Housing', name: 'The Alex Community Housing', website: 'https://www.thealex.ca', address: '2840 2 Ave SE, Calgary, AB', phone: '403-266-2622', email: '', services: ['Housing-first programs', 'Mental health + housing support', 'Transitional housing'] },
  { section: 'Calgary Housing', name: 'Inn from the Cold (Family Housing)', website: 'https://www.innfromthecold.org', address: '110 11 Ave SE, Calgary, AB', phone: '403-263-8384', email: '', services: ['Emergency family shelter', 'Transitional housing for parents & children'] },
  { section: 'Co-operative Housing', name: 'NACHA (Northern Alberta Co-op Housing)', website: 'https://nacha.ca', address: '#102, 12120 106 Ave NW, Edmonton, AB T5N 0Z2', phone: '780-482-6128', email: '', services: ['Cooperative housing applications', 'Housing co-op listings', 'Waitlist guidance'] },
  { section: 'Co-operative Housing', name: 'SACHA (Southern Alberta Co-op Housing)', website: 'https://www.sacha-coop.ca', address: 'Calgary, AB', phone: '403-233-0969', email: '', services: ['Co-operative housing listings', 'Waitlist guidance'] },
];

// ── SHARED CARD ──────────────────────────────────────────────────────────────
function OrgCard({ item, showServices = true }) {
  const mapQuery = item.address && item.address !== 'Online' && item.address !== ''
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address)}`
    : null;

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-4 flex flex-col gap-3 hover:border-primary/20 hover:shadow-sm transition-all">
      <div>
        <h3 className="font-heading font-bold text-sm leading-snug mb-1">{item.name}</h3>
        {item.note && <p className="text-xs text-primary/80 font-medium">{item.note}</p>}
        {item.notes && <p className="text-xs text-muted-foreground">{item.notes}</p>}
      </div>

      {showServices && item.services && item.services.length > 0 && (
        <ul className="space-y-0.5">
          {item.services.map((s, i) => (
            <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
              <span className="text-primary mt-0.5">•</span> {s}
            </li>
          ))}
        </ul>
      )}

      <div className="space-y-1 text-xs text-muted-foreground">
        {item.address && item.address !== 'Online' && item.address !== '' && (
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-primary/50 mt-0.5" />
            <span>{item.address}</span>
          </div>
        )}
        {item.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 flex-shrink-0 text-primary/50" />
            <a href={`tel:${item.phone}`} className="hover:text-primary transition-colors">{item.phone}</a>
          </div>
        )}
        {item.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 flex-shrink-0 text-primary/50" />
            <a href={`mailto:${item.email}`} className="hover:text-primary transition-colors truncate">{item.email}</a>
          </div>
        )}
      </div>

      <div className="flex gap-2 flex-wrap mt-auto pt-1">
        {item.website && (
          <a href={item.website} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/15 transition-colors">
            <Globe className="w-3 h-3" /> Website <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>
        )}
        {mapQuery && (
          <a href={mapQuery} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-semibold hover:bg-muted/70 transition-colors">
            <MapPin className="w-3 h-3" /> Map
          </a>
        )}
        {item.liveMap && (
          <a href={item.liveMap} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-700 text-xs font-semibold hover:bg-teal-500/15 transition-colors">
            <Navigation className="w-3 h-3" /> Live Map
          </a>
        )}
      </div>
    </div>
  );
}

function SectionedGrid({ items, sectionKey = 'section' }) {
  const sections = [...new Set(items.map(i => i[sectionKey]))];
  return (
    <div className="space-y-8">
      {sections.map(sec => (
        <div key={sec}>
          <h2 className="font-heading font-bold text-sm text-muted-foreground uppercase tracking-wider mb-3 px-1">{sec}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.filter(i => i[sectionKey] === sec).map((item, idx) => (
              <OrgCard key={idx} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── EDUCATION PANEL ──────────────────────────────────────────────────────────
const typeColors = {
  University: 'bg-blue-500/10 text-blue-700 border-blue-200',
  Polytechnic: 'bg-orange-500/10 text-orange-700 border-orange-200',
  College: 'bg-teal-500/10 text-teal-700 border-teal-200',
};

function EducationPanel() {
  const [cityFilter, setCityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const filtered = educationInstitutions.filter(i =>
    (cityFilter === 'all' || i.city === cityFilter) &&
    (typeFilter === 'all' || i.type === typeFilter)
  );
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-5">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((inst, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-4 flex flex-col gap-3 hover:border-primary/20 hover:shadow-sm transition-all">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-md border", typeColors[inst.type])}>{inst.type}</span>
                <span className="text-[10px] text-muted-foreground font-medium">{inst.city}</span>
              </div>
              <h3 className="font-heading font-bold text-sm">{inst.name}</h3>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              {inst.address && <div className="flex items-start gap-2"><MapPin className="w-3.5 h-3.5 text-primary/50 mt-0.5 flex-shrink-0" /><span>{inst.address}</span></div>}
              {inst.phone && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-primary/50 flex-shrink-0" /><a href={`tel:${inst.phone}`} className="hover:text-primary">{inst.phone}</a></div>}
              {inst.email && <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-primary/50 flex-shrink-0" /><a href={`mailto:${inst.email}`} className="hover:text-primary truncate">{inst.email}</a></div>}
            </div>
            <div className="flex gap-2 mt-auto pt-1">
              <a href={inst.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/15 transition-colors">
                <Globe className="w-3 h-3" /> Website <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
              {inst.address && (
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(inst.address)}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-semibold hover:bg-muted/70 transition-colors">
                  <MapPin className="w-3 h-3" /> Map
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── TRANSPORT PANEL ──────────────────────────────────────────────────────────
function TransportPanel() {
  return (
    <div className="space-y-6">
      {/* GPS Google Maps shortcut */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="font-heading font-bold text-sm">🗺️ Find Places on Google Maps</p>
          <p className="text-xs text-muted-foreground mt-0.5">Use GPS to navigate to any location across Alberta</p>
        </div>
        <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors flex-shrink-0">
          <Navigation className="w-3.5 h-3.5" /> Open Google Maps
        </a>
      </div>
      <SectionedGrid items={transitSystems} />
    </div>
  );
}

// ── MAIN EXPORT ──────────────────────────────────────────────────────────────
import React, { useState } from 'react';

export default function StaticCategoryPanel({ category }) {
  if (category === 'language') {
    return (
      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
          <p className="font-heading font-bold text-sm mb-1">🇨🇦 LINC — Free English for Newcomers</p>
          <p className="text-xs text-muted-foreground">LINC (Language Instruction for Newcomers to Canada) is <strong>FREE</strong>, funded by the Government of Canada. Available to permanent residents and protected persons. Covers speaking, listening, reading, writing, and Canadian life skills.</p>
        </div>
        <SectionedGrid items={languageOrgs.map(o => ({ ...o, section: o.city === 'Edmonton' ? 'Edmonton Language Organizations' : 'Calgary Language Organizations' }))} />
      </div>
    );
  }

  if (category === 'education') return <EducationPanel />;

  if (category === 'legal') return <SectionedGrid items={legalOrgs} />;

  if (category === 'health') return <SectionedGrid items={healthFacilities} />;

  if (category === 'transportation') return <TransportPanel />;

  if (category === 'housing') return <SectionedGrid items={housingOrgs} />;

  return null;
}