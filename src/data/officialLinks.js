// Official websites for the institutions listed in the national services directory.
// Entries are keyed by the directory entry name; a string is one official site and an
// array is used where a single entry names several organisations.

export const OFFICIAL_LINKS = {
  // Emergency
  '988': 'https://988.ca',
  '211': 'https://211.ca',
  'Kids Help Phone': 'https://kidshelpphone.ca',

  // Housing
  '211 emergency shelter placement': 'https://211.ca',
  'Resettlement Assistance Program (RAP)':
    'https://www.canada.ca/en/immigration-refugees-citizenship/services/refugees.html',
  'First Home Savings Account (FHSA)':
    'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account.html',
  "Home Buyers' Plan (HBP)":
    'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans/what-home-buyers-plan.html',
  'CMHC Newcomers mortgage insurance': 'https://www.cmhc-schl.gc.ca',
  Civida: 'https://civida.ca',
  'Calgary Housing Company': 'https://calgaryhousingcompany.org',
  'Find Housing Alberta': 'https://www.alberta.ca',
  'BC Housing': 'https://www.bchousing.org',
  'Saskatchewan Housing Corporation': 'https://www.saskatchewan.ca',
  'Manitoba Housing': 'https://www.gov.mb.ca/housing/',
  'Ontario affordable housing programs': 'https://www.ontario.ca',
  'Ottawa Community Housing': 'https://www.och-lco.ca',
  'Peel Region housing': 'https://www.peelregion.ca',
  'Quebec housing authority': 'https://www.habitation.gouv.qc.ca',
  'Montreal Municipal Housing Office': 'https://montreal.ca',
  'Nova Scotia Provincial Housing Agency': 'https://novascotia.ca',
  'New Brunswick Provincial Housing Agency': 'https://www.gnb.ca',
  'PEI Housing Corporation': 'https://www.princeedwardisland.ca',
  'Newfoundland and Labrador Housing Corporation': 'https://www.nlhc.nl.ca',
  'Yukon Housing Corporation': 'https://yukon.ca',
  'Northwest Territories Housing Corporation': 'https://www.gov.nt.ca',
  'Nunavut Housing Corporation': 'https://www.gov.nu.ca',

  // Banking
  'Royal Bank of Canada (RBC)': 'https://www.rbc.com',
  'TD Canada Trust': 'https://www.td.com',
  Scotiabank: 'https://www.scotiabank.com',
  'BMO Bank of Montreal': 'https://www.bmo.com',
  CIBC: 'https://www.cibc.com',
  'National Bank of Canada': 'https://www.nbc.ca',
  Desjardins: 'https://www.desjardins.com',
  'Tangerine, EQ Bank, Simplii, Wealthsimple, KOHO, PC Financial': [
    { label: 'Tangerine', url: 'https://www.tangerine.ca' },
    { label: 'EQ Bank', url: 'https://www.eqbank.ca' },
    { label: 'Simplii Financial', url: 'https://www.simplii.com' },
    { label: 'Wealthsimple', url: 'https://www.wealthsimple.com' },
    { label: 'KOHO', url: 'https://www.koho.ca' },
    { label: 'PC Financial', url: 'https://www.pcfinancial.ca' },
  ],
  'Deposit protection': 'https://www.cdic.ca',

  // Family & children
  '211 Canada': 'https://211.ca',
  'Children and Family Services': 'https://www.alberta.ca',
  'Ministry of Children and Family Development': 'https://www2.gov.bc.ca',
  'Ministry of Social Services': 'https://www.saskatchewan.ca',
  'Department of Families': 'https://www.gov.mb.ca',
  "Ministry of Children, Community and Social Services and Children's Aid Societies": 'https://www.ontario.ca',
  'Ministère de la Famille, DPJ and CISSS/CIUSSS': 'https://www.quebec.ca',
  'Department of Opportunities and Social Development': 'https://novascotia.ca',
  'Department of Social Development': 'https://www.gnb.ca',
  'Department of Social Development and Seniors': 'https://www.princeedwardisland.ca',
  'Department of Children, Seniors and Social Development': 'https://www.gov.nl.ca',
  'Department of Health and Social Services': 'https://yukon.ca',
  'Child and Family Services': 'https://www.gov.nt.ca',
  'Department of Family Services': 'https://www.gov.nu.ca',

  // Seniors & disability
  'Old Age Security (OAS)': 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security.html',
  'CPP Disability': 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/cpp-disability-benefit.html',
  'Canada Disability Benefit': 'https://www.canada.ca/en/services/benefits/disability/canada-disability-benefit.html',
  'Benefits Finder': 'https://www.canada.ca/en/services/benefits/finder.html',
  'Alberta Seniors Benefit, AISH, AADL': 'https://www.alberta.ca',
  'BC seniors and disability services': 'https://www2.gov.bc.ca',
  'Seniors Income Plan, SAID and SAIL': 'https://www.saskatchewan.ca',
  'Manitoba Supports for Persons with Disabilities': 'https://www.gov.mb.ca',
  'ODSP and Assistive Devices Program': 'https://www.ontario.ca',
  'Programme de soutien aux aînés and CHSLD': 'https://www.quebec.ca',
  'Disability Support Program and Seniors Pharmacare': 'https://novascotia.ca',
  'Disability Support Program': 'https://www.gnb.ca',
  'AccessAbility Supports and Seniors Independence Initiative': 'https://www.princeedwardisland.ca',
  'Seniors and disability services': 'https://www.gov.nl.ca',
  'Chronic Disease and Disability Benefits': 'https://yukon.ca',
  'Extended health benefits and home care': 'https://www.gov.nt.ca',
  'Seniors and extended health benefits': 'https://www.gov.nu.ca',

  // Transit
  'VIA Rail': 'https://www.viarail.ca',
  'FlixBus and Rider Express': [
    { label: 'FlixBus', url: 'https://www.flixbus.ca' },
    { label: 'Rider Express', url: 'https://riderexpress.ca' },
  ],
  'Ontario Northland and Orléans Express': [
    { label: 'Ontario Northland', url: 'https://www.ontarionorthland.ca' },
    { label: 'Orléans Express', url: 'https://www.orleansexpress.com' },
  ],
  'Maritime Bus': 'https://maritimebus.com',
  'BC Ferries': 'https://www.bcferries.com',
  'Edmonton Transit Service, Calgary Transit': [
    { label: 'Edmonton Transit', url: 'https://www.edmonton.ca' },
    { label: 'Calgary Transit', url: 'https://www.calgarytransit.com' },
  ],
  'TransLink and BC Transit': [
    { label: 'TransLink', url: 'https://www.translink.ca' },
    { label: 'BC Transit', url: 'https://www.bctransit.com' },
  ],
  'Saskatoon and Regina Transit': [
    { label: 'Saskatoon Transit', url: 'https://www.saskatoon.ca' },
    { label: 'Regina Transit', url: 'https://www.regina.ca' },
  ],
  'Winnipeg Transit': 'https://winnipegtransit.com',
  'TTC, OC Transpo, MiWay, GO Transit': [
    { label: 'TTC', url: 'https://www.ttc.ca' },
    { label: 'OC Transpo', url: 'https://www.octranspo.com' },
    { label: 'MiWay', url: 'https://www.mississauga.ca' },
    { label: 'GO Transit', url: 'https://www.gotransit.com' },
  ],
  'STM, RTC, STL, RTL, STO': [
    { label: 'STM', url: 'https://www.stm.info' },
    { label: 'RTC Québec', url: 'https://www.rtcquebec.ca' },
    { label: 'exo', url: 'https://exo.quebec' },
  ],
  'Halifax Transit': 'https://www.halifax.ca',
  'Codiac Transpo': 'https://www.moncton.ca',

  // Parks & recreation
  'Parks Canada': 'https://parks.canada.ca',

  // Libraries
  'Bibliothèque et Archives nationales du Québec': 'https://www.banq.qc.ca',
  'PEI Public Library Service': 'https://www.princeedwardisland.ca',

  // Pets
  'Alberta SPCA, AARCS and Edmonton Humane Society': [
    { label: 'Alberta SPCA', url: 'https://albertaspca.org' },
    { label: 'AARCS', url: 'https://aarcs.ca' },
    { label: 'Edmonton Humane Society', url: 'https://www.edmontonhumanesociety.com' },
  ],
  'BC SPCA': 'https://spca.bc.ca',
  'Winnipeg Humane Society': 'https://winnipeghumanesociety.ca',
  'Ontario SPCA and Humane Society': 'https://ontariospca.ca',
  'SPCA Montréal': 'https://www.spca.com',
};

// Always returns a list of { label, url } for one directory entry.
export function officialLinks(name) {
  const value = OFFICIAL_LINKS[name];
  if (!value) return [];
  return Array.isArray(value) ? value : [{ label: 'Official site', url: value }];
}