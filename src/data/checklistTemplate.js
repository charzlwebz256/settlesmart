// Province-specific links for key settlement steps
const PROVINCE_HEALTH_LINKS = {
  'Ontario': 'https://www.ontario.ca/page/apply-ohip-and-get-health-card',
  'Alberta': 'https://www.alberta.ca/ahcip',
  'British Columbia': 'https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp',
  'Saskatchewan': 'https://www.saskatchewan.ca/residents/health/accessing-health-care-services/health-cards',
  'Manitoba': 'https://www.gov.mb.ca/health/mhsip/',
  'Quebec': 'https://www.ramq.gouv.qc.ca/en/citizens/health-insurance',
  'Nova Scotia': 'https://novascotia.ca/dhw/msi/',
  'New Brunswick': 'https://www2.gnb.ca/content/gnb/en/departments/health/Medicare_Plan.html',
  'Newfoundland & Labrador': 'https://www.gov.nl.ca/hcs/mcp/',
  'Prince Edward Island': 'https://www.princeedwardisland.ca/en/topic/health-pei',
};

const PROVINCE_DRIVER_LINKS = {
  'Ontario': 'https://www.ontario.ca/page/exchange-foreign-drivers-licence',
  'Alberta': 'https://www.alberta.ca/exchange-non-alberta-licence',
  'British Columbia': 'https://www.icbc.com/driver-licensing/moving-bc',
  'Saskatchewan': 'https://www.sgi.sk.ca/exchanging',
  'Manitoba': 'https://www.mpi.mb.ca/Pages/exchange-foreign-licence.aspx',
  'Quebec': 'https://saaq.gouv.qc.ca/en/drivers-licence/exchanging-foreign-drivers-licence/',
  'Nova Scotia': 'https://novascotia.ca/sns/rmv/handbook/DL-foreign.asp',
  'New Brunswick': 'https://www2.gnb.ca/content/gnb/en/departments/psmv/driver_licensing.html',
  'Newfoundland & Labrador': 'https://www.gov.nl.ca/motorregistration/exchanging-foreign-licence/',
  'Prince Edward Island': 'https://www.princeedwardisland.ca/en/information/transportation/transfer-out-province-drivers-licence',
};

// Build a personalized 90-day settlement checklist instantly (no LLM call).
export function buildChecklist(profile) {
  const province = profile?.province || 'your province';
  const city = profile?.city || 'your city';
  const status = profile?.immigration_status?.replace(/_/g, ' ') || 'newcomer';
  const healthLink = PROVINCE_HEALTH_LINKS[province] || 'https://www.canada.ca/en/health-canada/services/health-care-system.html';
  const driverLink = PROVINCE_DRIVER_LINKS[province] || 'https://www.canada.ca/en/services/transport.html';

  const items = [
    // Week 1
    {
      title: 'Apply for Social Insurance Number',
      description: `Visit a Service Canada office to get your SIN — required to work and access government services in ${city}.`,
      category: 'documents', day_range: 'week1', order: 1,
      link: 'https://www.canada.ca/en/employment-social-development/services/sin.html',
    },
    {
      title: 'Get your provincial health card',
      description: `Apply for public health coverage in ${province}. Carry your card for all medical visits.`,
      category: 'health', day_range: 'week1', order: 2,
      link: healthLink,
    },
    {
      title: 'Open a Canadian bank account',
      description: 'Bring your passport, SIN, and proof of address to open an account at a major Canadian bank.',
      category: 'banking', day_range: 'week1', order: 3,
      link: 'https://www.canada.ca/en/financial-consumer-agency/services/banking/opening-bank-account.html',
    },
    {
      title: 'Secure temporary housing',
      description: `Find short-term accommodation in ${city} while you search for a permanent home.`,
      category: 'housing', day_range: 'week1', order: 4,
      link: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/new-immigrants/settle-canada/housing.html',
    },
    {
      title: 'Get a local phone plan',
      description: 'Purchase a Canadian SIM card and phone plan from Rogers, Bell, Telus, or a budget carrier.',
      category: 'social', day_range: 'week1', order: 5,
      link: '',
    },

    // Week 2
    {
      title: 'Register with settlement services',
      description: `Connect with a local settlement agency in ${city} for free newcomer support and guidance.`,
      category: 'social', day_range: 'week2', order: 6,
      link: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/new-immigrants/settle-canada/find-free-services.html',
    },
    {
      title: 'Apply for a driver\'s licence',
      description: `Exchange your foreign licence or apply for a ${province} driver\'s licence if you plan to drive.`,
      category: 'transportation', day_range: 'week2', order: 7,
      link: driverLink,
    },
    {
      title: 'Enrol children in school',
      description: `Register school-age children at your local school board in ${city}. Education is free for residents.`,
      category: 'education', day_range: 'week2', order: 8,
      link: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/new-immigrants/settle-canada/education.html',
    },
    {
      title: 'Learn local public transit',
      description: `Get a transit pass and map your daily routes around ${city}.`,
      category: 'transportation', day_range: 'week2', order: 9,
      link: '',
    },
    {
      title: 'Find a family doctor or clinic',
      description: `Register with a walk-in clinic or family doctor in ${city} while your health coverage activates.`,
      category: 'health', day_range: 'week2', order: 10,
      link: '',
    },

    // Week 3
    {
      title: 'Create a Canadian-format resume',
      description: 'Format your resume to Canadian standards — concise, skills-focused, ATS-friendly.',
      category: 'employment', day_range: 'week3', order: 11,
      link: '',
    },
    {
      title: 'Attend community networking events',
      description: `Join newcomer meetups and professional networks in ${city} to build connections.`,
      category: 'social', day_range: 'week3', order: 12,
      link: '',
    },
    {
      title: 'Apply for child benefits',
      description: 'If you have children, apply for the Canada Child Benefit for monthly financial support.',
      category: 'legal', day_range: 'week3', order: 13,
      link: 'https://www.canada.ca/en/revenue-agency/services/child-family-benefits/canada-child-benefit-overview.html',
    },
    {
      title: 'Understand tenant rights',
      description: `Review ${province} tenancy laws before signing a lease — know your rights and responsibilities.`,
      category: 'legal', day_range: 'week3', order: 14,
      link: '',
    },

    // Week 4
    {
      title: 'Start your job search',
      description: 'Search Canadian job platforms — Job Bank, LinkedIn, Indeed — and apply to relevant roles.',
      category: 'employment', day_range: 'week4', order: 15,
      link: 'https://www.jobbank.gc.ca',
    },
    {
      title: 'Get credentials assessed',
      description: 'Have your foreign education and credentials evaluated for Canadian equivalency.',
      category: 'education', day_range: 'week4', order: 16,
      link: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/new-immigrants/prepare-life-canada/credentials-assessment.html',
    },
    {
      title: 'Set up a budget & savings',
      description: 'Track your expenses, open a TFSA, and start building a Canadian credit history.',
      category: 'banking', day_range: 'week4', order: 17,
      link: 'https://www.canada.ca/en/financial-consumer-agency/services/savings.html',
    },
    {
      title: 'Enrol in language classes',
      description: 'Join free English or French language classes if you want to improve your proficiency.',
      category: 'education', day_range: 'week4', order: 18,
      link: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/new-immigrants/prepare-life-canada/improve-english-french.html',
    },

    // Month 2
    {
      title: 'Apply for PR card (if applicable)',
      description: `If you're a permanent resident, confirm your PR card status with IRCC as a ${status}.`,
      category: 'documents', day_range: 'month2', order: 19,
      link: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/new-immigrants/pr-card.html',
    },
    {
      title: 'Build professional network',
      description: `Connect with industry groups and professionals in ${city} related to your interests.`,
      category: 'employment', day_range: 'month2', order: 20,
      link: '',
    },
    {
      title: 'Explore volunteering',
      description: 'Volunteer locally to gain Canadian references and community experience.',
      category: 'social', day_range: 'month2', order: 21,
      link: '',
    },

    // Month 3
    {
      title: 'Review financial goals',
      description: 'Assess your budget, start an emergency fund, and plan long-term savings.',
      category: 'banking', day_range: 'month3', order: 22,
      link: '',
    },
    {
      title: 'Consider further education',
      description: `Look into upgrading, certifications, or courses at institutions in ${province}.`,
      category: 'education', day_range: 'month3', order: 23,
      link: '',
    },
    {
      title: 'Apply for provincial ID',
      description: `If you don't drive, get a provincial photo ID card as official identification in ${province}.`,
      category: 'documents', day_range: 'month3', order: 24,
      link: '',
    },
  ];

  return items;
}