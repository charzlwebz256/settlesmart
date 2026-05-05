/**
 * Centralized logo registry for all organizations used in the app.
 * Uses Google Favicon API as a reliable fallback — always returns an icon.
 * For orgs with known good logo URLs, those are listed directly.
 */

const favicon = (domain) =>
  `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;

export const ORG_LOGOS = {
  // ── Language ──────────────────────────────────────────────────────────────
  'NorQuest College (LINC Program)': favicon('norquest.ca'),
  'ASSIST Community Services Centre': favicon('assistcsc.org'),
  'Global TESOL College': favicon('globaltesol.com'),
  'Edmonton Mennonite Centre for Newcomers': favicon('emcn.ab.ca'),
  'Calgary Catholic Immigration Society': favicon('ccisab.ca'),
  'Equilibrium School': favicon('equilibrium.ab.ca'),
  'Agapé Language Centre': favicon('agapelanguagecentre.com'),
  'CanLanguage': favicon('canlanguage.com'),

  // ── Education ─────────────────────────────────────────────────────────────
  'University of Alberta': favicon('ualberta.ca'),
  'Concordia University of Edmonton': favicon('concordia.ab.ca'),
  'MacEwan University': favicon('macewan.ca'),
  'NAIT': favicon('nait.ca'),
  'Sundance College': favicon('sundancecollege.com'),
  'Aquinas College': favicon('aquinascollege.ca'),
  'Campbell College': favicon('campbellcollege.ca'),
  'MaKami College': favicon('makamicollege.com'),
  'University of Calgary': favicon('ucalgary.ca'),
  'Mount Royal University': favicon('mtroyal.ca'),
  'SAIT': favicon('sait.ca'),
  'Bow Valley College': favicon('bowvalleycollege.ca'),
  'MCG Career College': favicon('mcgcollege.com'),

  // ── Legal ─────────────────────────────────────────────────────────────────
  'Legal Aid Alberta (LAA)': favicon('legalaid.ab.ca'),
  'Alberta Law Libraries': favicon('lawlibrary.ab.ca'),
  '211 Alberta (Legal Referrals)': favicon('ab.211.ca'),
  'Edmonton Community Legal Centre (ECLC)': favicon('eclc.ca'),
  'Calgary Legal Guidance (CLG)': favicon('clg.ab.ca'),
  'Central Alberta Community Legal Clinic': favicon('cplea.ca'),
  'Student Legal Clinics (University-based)': favicon('cplea.ca'),
  'Law Society of Alberta': favicon('lawsociety.ab.ca'),
  'Alberta Human Rights Commission': favicon('albertahumanrights.ab.ca'),
  'Centre for Public Legal Education Alberta (CPLEA)': favicon('cplea.ca'),
  'JusticeNet': favicon('justicenet.ca'),
  'Pro Bono Law Alberta': favicon('pbla.ca'),

  // ── Health ────────────────────────────────────────────────────────────────
  'University of Alberta Hospital': favicon('albertahealthservices.ca'),
  'Royal Alexandra Hospital': favicon('albertahealthservices.ca'),
  'Grey Nuns Community Hospital': favicon('albertahealthservices.ca'),
  'Foothills Medical Centre': favicon('albertahealthservices.ca'),
  'Peter Lougheed Centre': favicon('albertahealthservices.ca'),
  'South Health Campus': favicon('albertahealthservices.ca'),
  'Red Deer Regional Hospital Centre': favicon('albertahealthservices.ca'),
  'Medicine Hat Regional Hospital': favicon('albertahealthservices.ca'),
  'AHS Urgent Care Centres': favicon('albertahealthservices.ca'),
  'Medimap (Walk-In Clinic Finder)': favicon('medimap.ca'),
  'University of Alberta Dental Clinic': favicon('ualberta.ca'),
  'Opencare (Dental Clinic Finder)': favicon('opencare.com'),
  'AHS Facility & Service Finder': favicon('albertahealthservices.ca'),

  // ── Transit ───────────────────────────────────────────────────────────────
  'Edmonton Transit Service (ETS)': favicon('edmonton.ca'),
  'Calgary Transit': favicon('calgarytransit.com'),
  'St. Albert Transit (StAT)': favicon('stalbert.ca'),
  'Strathcona County Transit': favicon('strathcona.ca'),
  'Red Deer Transit': favicon('reddeer.ca'),
  'Fort McMurray Transit': favicon('rmwb.ca'),
  'Rider Express': favicon('riderexpress.ca'),
  'Ebus': favicon('ebus.ca'),
  'Red Arrow': favicon('redarrow.ca'),
  'FlixBus Canada': favicon('flixbus.ca'),

  // ── Housing ───────────────────────────────────────────────────────────────
  'Alberta Supports (Housing + Rent Assistance)': favicon('alberta.ca'),
  'Find Housing Alberta': favicon('findhousing.alberta.ca'),
  '211 Alberta (Housing & Crisis Referral)': favicon('ab.211.ca'),
  'Civida (Edmonton Community Housing Authority)': favicon('civida.ca'),
  'Homeward Trust Edmonton': favicon('homewardtrust.ca'),
  'Bissell Centre': favicon('bissellcentre.org'),
  'HomeEd (Edmonton Public Housing)': favicon('homeed.ca'),
  'The Mustard Seed': favicon('theseed.ca'),
  'Calgary Housing Company (CHC)': favicon('calgary.ca'),
  'Calgary Homeless Foundation': favicon('calgaryhomeless.com'),
  'The Alex Community Housing': favicon('thealex.ca'),
  'Inn from the Cold (Family Housing)': favicon('innfromthecold.org'),
  'NACHA (Northern Alberta Co-op Housing)': favicon('nacha.ca'),
  'SACHA (Southern Alberta Co-op Housing)': favicon('sacha-coop.ca'),

  // ── Volunteering ──────────────────────────────────────────────────────────
  'Project Adult Literacy Society (PALS)': favicon('palsedmonton.ca'),
  'Edmonton Mennonite Centre for Newcomers (EMCN)': favicon('emcn.ab.ca'),
  'Centre for Family Literacy': favicon('famlit.ca'),
  'Hope Mission': favicon('hopemission.com'),
  'Edmonton Food Bank': favicon('edmontonsfoodbank.com'),
  'YMCA of Northern Alberta': favicon('northernalberta.ymca.ca'),
  'Caregivers Alberta': favicon('caregiversalberta.ca'),
  'Centre for Newcomers': favicon('centrefornewcomers.ca'),
  "Calgary Immigrant Women's Association (CIWA)": favicon('ciwa-online.com'),
  'Immigrant Services Calgary': favicon('immigrantservicescalgary.ca'),
  'The Immigrant Education Society (TIES)': favicon('immigrant-education.ca'),
  'Calgary Food Bank': favicon('calgaryfoodbank.com'),
  'Volunteer Connector': favicon('volunteerconnector.org'),
  'United Way Alberta Capital Region': favicon('myunitedway.ca'),
  'Canadian Red Cross (Alberta)': favicon('redcross.ca'),

  // ── Family Support ────────────────────────────────────────────────────────
  'Fiddler Family Services Inc': favicon('fiddlerfamilyservices.ca'),
  'Bridgeway Connection Services': favicon('bridgewayconnections.ca'),
  'Healthy Families Healthy Futures': favicon('hfalberta.com'),
  'McMan Central': favicon('mcmancentral.ca'),
  'Sunrise House Grande Prairie': favicon('sunrisehouse.ca'),
  'Alberta Family Mediation Society': favicon('afms.ca'),
  'Alberta Family Court Assistance Program': favicon('alberta.ca'),
  'Caseflow Conference Alberta': favicon('alberta.ca'),
  'HomeFront Calgary': favicon('lawcentralalberta.ca'),

  // ── Emergency page ────────────────────────────────────────────────────────
  'Find a Shelter — 211 Ontario': favicon('211ontario.ca'),
  'Shelter Finder Canada (Homeless Hub)': favicon('homelesshub.ca'),
  "YWCA Canada — Women's Shelters": favicon('ywcacanada.ca'),
  'Salvation Army — Emergency Shelter': favicon('salvationarmy.ca'),
  'Refugee Housing (COSTI)': favicon('costi.org'),
  'Legal Aid Ontario': favicon('legalaid.on.ca'),
  'Legal Aid BC': favicon('lss.bc.ca'),
  'Legal Aid Alberta': favicon('legalaid.ab.ca'),
  'IRCC — Report a Problem / Contact': favicon('ircc.canada.ca'),
  'RCMP Victim Services': favicon('rcmp-grc.gc.ca'),
  'Canadian Council for Refugees': favicon('ccrweb.ca'),
  'Canadian Mental Health Association': favicon('cmha.ca'),
  'Newcomer & Refugee Mental Health (CAMH)': favicon('camh.ca'),
  'Centre for Addiction and Mental Health': favicon('camh.ca'),

  // ── Government / IRCC ────────────────────────────────────────────────────
  'Service Canada': favicon('canada.ca'),
  'IRCC': favicon('ircc.canada.ca'),
  'Canadian Human Rights Commission': favicon('chrc-ccdp.gc.ca'),
  'CMHC': favicon('cmhc-schl.gc.ca'),
};

/** Get logo URL for an org by name. Returns undefined if not found. */
export function getOrgLogo(name) {
  return ORG_LOGOS[name];
}