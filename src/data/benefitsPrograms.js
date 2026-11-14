const RESIDENT = ['permanent_resident', 'refugee', 'citizen'];
const LOW_INCOME = ['none', 'low', 'moderate'];

/**
 * Curated federal and provincial programs. Each `applies(answers)` decides
 * whether a program is *potentially* relevant, it never confirms eligibility.
 * Always link people to the official page for the final decision.
 */
export const benefitsPrograms = [
  {
    id: 'ccb',
    name: 'Canada Child Benefit (CCB)',
    level: 'Federal',
    description: 'A tax-free monthly payment to help with the cost of raising children under 18.',
    eligibility: 'You live with and care for a child under 18 and are a Canadian resident for tax purposes. File your taxes to keep payments coming.',
    link: 'https://www.canada.ca/en/revenue-agency/services/child-family-benefits/canada-child-benefit-overview.html',
    applies: (a) => !!a.children && RESIDENT.includes(a.status),
  },
  {
    id: 'gst',
    name: 'GST/HST Credit',
    level: 'Federal',
    description: 'A quarterly payment to help individuals and families with low or modest incomes offset the GST/HST they pay.',
    eligibility: 'You are a Canadian resident for tax purposes and file a tax return, even with little or no income.',
    link: 'https://www.canada.ca/en/revenue-agency/services/child-family-benefits/goods-services-tax-harmonized-sales-tax-gst-hst-credit.html',
    applies: (a) => LOW_INCOME.includes(a.income) && RESIDENT.includes(a.status),
  },
  {
    id: 'cwb',
    name: 'Canada Workers Benefit',
    level: 'Federal',
    description: 'A refundable tax credit that tops up the income of low-income people who are working.',
    eligibility: 'You earn income from employment and have a low income. It is usually claimed on your tax return.',
    link: 'https://www.canada.ca/en/revenue-agency/services/child-family-benefits/canada-workers-benefit.html',
    applies: (a) => a.working === true && ['low', 'moderate'].includes(a.income) && RESIDENT.includes(a.status),
  },
  {
    id: 'ei',
    name: 'Employment Insurance (EI)',
    level: 'Federal',
    description: 'Temporary income support if you lose your job through no fault of your own, or for maternity, parental, sickness or caregiving leave.',
    eligibility: 'You need enough insurable hours from a job where EI premiums were deducted. Job loss must generally not be your fault.',
    link: 'https://www.canada.ca/en/employment-social-development/programs/ei.html',
    applies: (a) => a.working === false && ['permanent_resident', 'refugee', 'citizen', 'temporary_worker'].includes(a.status),
  },
  {
    id: 'student-aid',
    name: 'Canada Student Grants & Loans',
    level: 'Federal',
    description: 'Money to help pay for post-secondary education, including grants that do not need to be repaid.',
    eligibility: 'You are a Canadian citizen, permanent resident or protected person enrolled in an eligible program. Provincial aid usually applies too.',
    link: 'https://www.canada.ca/en/services/benefits/education/student-aid.html',
    applies: (a) => !!a.studying && RESIDENT.includes(a.status),
  },
  {
    id: 'dental',
    name: 'Canadian Dental Care Plan',
    level: 'Federal',
    description: 'Helps reduce the cost of dental care for eligible residents who do not have private dental insurance.',
    eligibility: 'You are a Canadian resident with a low or modest family income and no access to private dental coverage.',
    link: 'https://www.canada.ca/en/services/benefits/dental/dental-care-plan.html',
    applies: (a) => LOW_INCOME.includes(a.income) && RESIDENT.includes(a.status),
  },
  {
    id: 'housing-benefit',
    name: 'Canada Housing Benefit',
    level: 'Federal + Provincial',
    description: 'Support for renters who are struggling with the cost of housing, delivered with provinces and territories.',
    eligibility: 'You rent your home and have a low income. Specific rules and amounts are set by your province or territory.',
    link: 'https://www.canada.ca/en/services/benefits.html',
    applies: (a) => !!a.renting && LOW_INCOME.includes(a.income) && RESIDENT.includes(a.status),
  },
  {
    id: 'social-assistance',
    name: 'Provincial / Territorial Income Assistance',
    level: 'Provincial',
    description: 'Monthly financial help for people with little or no income, such as Ontario Works, Alberta Supports or BC Income Assistance.',
    eligibility: 'You have very little income or savings and live in the province. Each province has its own rules and application process.',
    link: 'https://211.ca',
    applies: (a) => ['none', 'low'].includes(a.income) && a.working === false && a.status !== 'international_student',
  },
  {
    id: 'childcare',
    name: 'Childcare Subsidy',
    level: 'Provincial',
    description: 'Help paying for licensed childcare so parents can work, study or attend language classes.',
    eligibility: 'You have children and need childcare while working or studying. Subsidy rules and income cut-offs vary by province.',
    link: 'https://211.ca',
    applies: (a) => !!a.children && (a.working === true || a.studying === true),
  },
];