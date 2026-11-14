export const PROVINCES = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
  'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia',
  'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon',
];

/**
 * Provincial and territorial public health plans.
 * Links point at each government's own health pages so newcomers always
 * confirm current rules at the source.
 */
export const provincialHealth = {
  'Ontario': { plan: 'OHIP', authority: 'Ontario Ministry of Health', link: 'https://www.ontario.ca/page/apply-ohip-and-get-health-card' },
  'British Columbia': { plan: 'MSP', authority: 'Health Insurance BC', link: 'https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp' },
  'Alberta': { plan: 'AHCIP', authority: 'Alberta Health Care Insurance Plan', link: 'https://www.alberta.ca/ahcip' },
  'Quebec': { plan: 'RAMQ', authority: 'Régie de l\'assurance maladie du Québec', link: 'https://www.ramq.gouv.qc.ca/en' },
  'Manitoba': { plan: 'Manitoba Health Card', authority: 'Manitoba Health', link: 'https://www.gov.mb.ca/health/' },
  'Saskatchewan': { plan: 'Saskatchewan Health Card', authority: 'eHealth Saskatchewan', link: 'https://www.ehealthsask.ca/' },
  'Nova Scotia': { plan: 'MSI', authority: 'Nova Scotia Medical Services Insurance', link: 'https://novascotia.ca/dhw/msi/' },
  'New Brunswick': { plan: 'New Brunswick Medicare', authority: 'Department of Health', link: 'https://www.gnb.ca/' },
  'Prince Edward Island': { plan: 'PEI Health Card', authority: 'Health PEI', link: 'https://www.princeedwardisland.ca/en/topic/health' },
  'Newfoundland and Labrador': { plan: 'MCP', authority: 'Medical Care Plan', link: 'https://www.gov.nl.ca/hcs/mcp/' },
  'Yukon': { plan: 'Yukon Health Care Insurance Plan', authority: 'Yukon Health and Wellness', link: 'https://yukon.ca/en/health-and-wellness' },
  'Northwest Territories': { plan: 'NWT Health Care Card', authority: 'Health and Social Services', link: 'https://www.hss.gov.nt.ca/' },
  'Nunavut': { plan: 'Nunavut Health Care Plan', authority: 'Department of Health', link: 'https://gov.nu.ca/health' },
};