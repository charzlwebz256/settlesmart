// ─────────────────────────────────────────────────────────────────────────────
// Province-by-province settlement services data for all 10 Canadian provinces
// ─────────────────────────────────────────────────────────────────────────────

export const PROVINCE_DATA = {
  Ontario: {
    settlement: [
      { name: 'YMCA Newcomer Services', organization: 'YMCA of Greater Toronto', website: 'https://ymcagta.org', address: '20 Eglinton Ave W, Toronto, ON M4R 1K8', phone: '416-928-9622', email: 'newcomerservices@ymcagta.org', services: ['Settlement support', 'Language programs', 'Employment services', 'Community connection'], city: 'Toronto' },
      { name: 'COSTI Immigrant Services', organization: 'COSTI', website: 'https://www.costi.org', address: '700 Caledonia Rd, Toronto, ON M6B 3X9', phone: '416-658-1600', email: 'info@costi.org', services: ['Settlement counselling', 'Language training', 'Employment programs', 'Housing assistance'], city: 'Toronto' },
      { name: 'Centre for Immigrant and Community Services', organization: 'CICS', website: 'https://www.cicscanada.com', address: '2330 Midland Ave, Scarborough, ON M1S 5G2', phone: '416-977-9781', email: '', services: ['Settlement services', 'Employment workshops', 'Language classes'], city: 'Toronto' },
    ],
    education: [
      { name: 'University of Toronto', type: 'University', website: 'https://www.utoronto.ca', address: '27 King\'s College Circle, Toronto, ON M5S 1A1', phone: '416-978-2011', email: '', city: 'Toronto' },
      { name: 'Seneca Polytechnic', type: 'Polytechnic', website: 'https://www.senecapolytechnic.ca', address: '1750 Finch Ave E, Toronto, ON M2J 2X5', phone: '416-491-5050', email: '', city: 'Toronto' },
      { name: 'George Brown College', type: 'College', website: 'https://www.georgebrown.ca', address: '200 King St E, Toronto, ON M5A 3W8', phone: '416-415-2000', email: '', city: 'Toronto' },
      { name: 'University of Ottawa', type: 'University', website: 'https://www.uottawa.ca', address: '75 Laurier Ave E, Ottawa, ON K1N 6N5', phone: '613-562-5700', email: '', city: 'Ottawa' },
      { name: 'Algonquin College', type: 'College', website: 'https://www.algonquincollege.com', address: '1385 Woodroffe Ave, Ottawa, ON K2G 1V8', phone: '613-727-4723', email: '', city: 'Ottawa' },
    ],
    language: [
      { name: 'LINC Ontario (IRCC-funded)', website: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/new-immigrants/improve-english-french.html', address: 'Multiple locations across Ontario', phone: '', email: '', services: ['Free English/French classes for eligible newcomers', 'CLB levels 1–8', 'Childcare support available'], city: 'Province-Wide', section: 'Government Programs' },
      { name: 'Toronto District School Board LINC', website: 'https://www.tdsb.on.ca/Community/Adult-Learning', address: 'Multiple TDSB locations, Toronto', phone: '416-397-3000', email: '', services: ['LINC English classes', 'Adult ESL programs', 'Flexible scheduling'], city: 'Toronto', section: 'Toronto Language' },
      { name: 'Algonquin College LINC', website: 'https://www.algonquincollege.com/esl', address: '1385 Woodroffe Ave, Ottawa, ON', phone: '613-727-4723', email: '', services: ['LINC classes', 'ESL programs', 'Language assessment'], city: 'Ottawa', section: 'Ottawa Language' },
    ],
    employment: [
      { name: 'Employment Ontario', website: 'https://www.ontario.ca/page/employment-ontario', address: 'Province-wide', phone: '1-800-387-5656', email: '', services: ['Job search assistance', 'Skills training funding', 'Resume and interview prep'], city: 'Province-Wide', section: 'Provincial Services' },
      { name: 'ACCES Employment', website: 'https://accesemployment.ca', address: '489 College St, Toronto, ON M6G 1A5', phone: '416-921-1800', email: 'info@accesemployment.ca', services: ['Employment programs for newcomers', 'Sector-specific job placement', 'Networking events'], city: 'Toronto', section: 'Toronto Employment' },
      { name: 'Skills for Change', website: 'https://www.skillsforchange.org', address: '791 St Clair Ave W, Toronto, ON M6C 1B8', phone: '416-658-3101', email: '', services: ['Bridging programs', 'Language for work', 'IT training'], city: 'Toronto', section: 'Toronto Employment' },
    ],
    housing: [
      { name: 'Toronto Community Housing', website: 'https://www.torontohousing.ca', address: '931 Yonge St, Toronto, ON M4W 2H2', phone: '416-981-5500', email: '', services: ['Subsidized housing', 'Community support programs'], section: 'Toronto Housing' },
      { name: 'Ottawa Community Housing', website: 'https://www.ochc.ca', address: '39 Auriga Dr, Ottawa, ON K2E 7Y7', phone: '613-731-1182', email: '', services: ['Affordable housing', 'Community programs'], section: 'Ottawa Housing' },
    ],
    legal: [
      { name: 'Legal Aid Ontario', website: 'https://www.legalaid.on.ca', address: '40 Dundas St W, Suite 200, Toronto, ON M5G 2H1', phone: '1-800-668-8258', email: '', services: ['Legal aid certificates', 'Duty counsel', 'Community legal clinics', 'Refugee and immigration legal help'], section: 'Legal Aid' },
      { name: 'PBLO (Pro Bono Law Ontario)', website: 'https://www.pblo.org', address: 'Toronto, ON', phone: '416-597-8333', email: '', services: ['Free legal services for those in need', 'Access to justice programs'], section: 'Legal Aid' },
    ],
    health: [
      { name: 'Toronto General Hospital (UHN)', website: 'https://www.uhn.ca', address: '200 Elizabeth St, Toronto, ON M5G 2C4', phone: '416-340-4800', services: [], section: 'Major Hospitals' },
      { name: 'OHIP — Ontario Health Insurance Plan', website: 'https://www.ontario.ca/page/apply-ohip-and-get-health-card', address: 'Province-wide', phone: '1-800-268-1154', services: ['Free provincial health insurance for eligible residents'], section: 'Health Insurance' },
      { name: 'Ottawa Hospital', website: 'https://www.ottawahospital.on.ca', address: '1053 Carling Ave, Ottawa, ON K1Y 4E9', phone: '613-722-7000', services: [], section: 'Major Hospitals' },
    ],
    transport: [
      { name: 'TTC (Toronto Transit Commission)', website: 'https://www.ttc.ca', address: '1900 Yonge St, Toronto, ON M4S 1Z2', phone: '416-393-4636', services: ['Subway, bus, and streetcar', 'Presto card system', 'Accessible transit'], section: 'Toronto Transit', liveMap: 'https://www.ttc.ca/routes-and-schedules' },
      { name: 'GO Transit', website: 'https://www.gotransit.com', address: '20 Bay St, Toronto, ON M5J 2W3', phone: '1-888-438-6646', services: ['Regional rail and bus', 'GTA commuter transit', 'Connections to all major hubs'], section: 'Regional Transit', liveMap: 'https://www.gotransit.com/en/trip-planning/plan-a-trip' },
      { name: 'OC Transpo (Ottawa)', website: 'https://www.octranspo.com', address: 'Ottawa, ON', phone: '613-741-4390', services: ['Bus and light rail (O-Train)', 'City-wide transit'], section: 'Ottawa Transit', liveMap: 'https://www.octranspo.com/en/plan-your-trip/travel-tools/transitway/' },
    ],
    volunteering: [
      { name: 'Volunteer Toronto', website: 'https://www.volunteertoronto.ca', address: '344 Bloor St W, Suite 404, Toronto, ON M5S 3A7', phone: '416-961-6888', email: '', services: ['Volunteer matching', 'Skills-based volunteering', 'Corporate volunteering'], section: 'Toronto Volunteering' },
      { name: 'United Way Greater Toronto', website: 'https://www.unitedwaygt.org', address: '26 Wellington St E, Toronto, ON M5E 1S2', phone: '416-777-2001', email: '', services: ['Community programs', 'Volunteer opportunities'], section: 'Toronto Volunteering' },
    ],
  },

  'British Columbia': {
    settlement: [
      { name: 'ISSofBC (Immigrant Services Society of BC)', organization: 'ISSofBC', website: 'https://issbc.org', address: '2610 Victoria Dr, Vancouver, BC V5N 4L2', phone: '604-684-2561', email: 'info@issbc.org', services: ['Settlement counselling', 'Interpretation', 'Employment', 'Housing', 'Welcome Centre'], city: 'Vancouver' },
      { name: 'MOSAIC BC', organization: 'MOSAIC', website: 'https://mosaicbc.org', address: '1720 Grant St, Vancouver, BC V5L 2Y7', phone: '604-254-9626', email: 'info@mosaicbc.org', services: ['Settlement services', 'Language training', 'Employment programs', 'Counselling'], city: 'Vancouver' },
      { name: 'DIVERSEcity Community Resources Society', website: 'https://www.dcrs.ca', address: '13455 107 Ave, Surrey, BC V3T 5H6', phone: '604-597-0205', email: '', services: ['Settlement services', 'Language classes', 'Employment support'], city: 'Surrey' },
    ],
    education: [
      { name: 'University of British Columbia', type: 'University', website: 'https://www.ubc.ca', address: '2329 West Mall, Vancouver, BC V6T 1Z4', phone: '604-822-2211', email: '', city: 'Vancouver' },
      { name: 'Simon Fraser University', type: 'University', website: 'https://www.sfu.ca', address: '8888 University Dr, Burnaby, BC V5A 1S6', phone: '778-782-3111', email: '', city: 'Burnaby' },
      { name: 'BCIT (BC Institute of Technology)', type: 'Polytechnic', website: 'https://www.bcit.ca', address: '3700 Willingdon Ave, Burnaby, BC V5G 3H2', phone: '604-434-5734', email: '', city: 'Burnaby' },
      { name: 'Langara College', type: 'College', website: 'https://langara.ca', address: '100 W 49th Ave, Vancouver, BC V5Y 2Z6', phone: '604-323-5511', email: '', city: 'Vancouver' },
      { name: 'University of Victoria', type: 'University', website: 'https://www.uvic.ca', address: '3800 Finnerty Rd, Victoria, BC V8P 5C2', phone: '250-721-7211', email: '', city: 'Victoria' },
    ],
    language: [
      { name: 'LINC BC (IRCC-funded)', website: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/new-immigrants/improve-english-french.html', address: 'Multiple locations across BC', phone: '', email: '', services: ['Free English for permanent residents and protected persons', 'CLB 1–8'], city: 'Province-Wide', section: 'Government Programs' },
      { name: 'ISSofBC Language Programs', website: 'https://issbc.org', address: '2610 Victoria Dr, Vancouver, BC', phone: '604-684-2561', email: '', services: ['LINC classes', 'EAL programs', 'Language assessment'], city: 'Vancouver', section: 'Vancouver Language' },
      { name: 'MOSAIC Language Services', website: 'https://mosaicbc.org', address: '1720 Grant St, Vancouver, BC', phone: '604-254-9626', email: '', services: ['LINC English classes', 'Language for employment'], city: 'Vancouver', section: 'Vancouver Language' },
    ],
    employment: [
      { name: 'WorkBC', website: 'https://www.workbc.ca', address: 'Province-wide (300+ centres)', phone: '1-877-952-6914', email: '', services: ['Employment counselling', 'Skills training', 'Job search support', 'Wage subsidy programs'], city: 'Province-Wide', section: 'Provincial Services' },
      { name: 'MOSAIC Employment Programs', website: 'https://mosaicbc.org', address: 'Vancouver, BC', phone: '604-254-9626', email: '', services: ['Job placement', 'Bridging programs', 'Mentorship'], city: 'Vancouver', section: 'Vancouver Employment' },
    ],
    housing: [
      { name: 'BC Housing', website: 'https://www.bchousing.org', address: '601 West Broadway, Vancouver, BC V5Z 4C2', phone: '604-433-1711', email: '', services: ['Subsidized housing', 'Rental assistance', 'Housing registry'], section: 'Provincial Housing' },
      { name: 'Vancouver Affordable Housing', website: 'https://vancouver.ca/people-programs/housing.aspx', address: 'Vancouver, BC', phone: '604-873-7000', email: '', services: ['City-run affordable housing programs'], section: 'City Housing' },
    ],
    legal: [
      { name: 'Legal Aid BC', website: 'https://legalaid.bc.ca', address: '400 510 Burrard St, Vancouver, BC V6C 3A8', phone: '604-408-2172', email: '', services: ['Legal aid for criminal, family, immigration cases', 'Duty counsel', 'Legal clinics'], section: 'Legal Aid' },
      { name: 'Law Students Legal Advice Program (LSLAP)', website: 'https://www.lslap.bc.ca', address: 'UBC, Vancouver, BC', phone: '604-822-5791', email: '', services: ['Free legal advice by supervised law students'], section: 'Free Legal Clinics' },
    ],
    health: [
      { name: 'Vancouver General Hospital', website: 'https://www.vch.ca', address: '899 W 12th Ave, Vancouver, BC V5Z 1M9', phone: '604-875-4111', services: [], section: 'Major Hospitals' },
      { name: 'BC Health Services Authority', website: 'https://www2.gov.bc.ca/gov/content/health', address: 'Province-wide', phone: '811 (HealthLink BC)', services: ['Provincial health coverage', 'MSP (Medical Services Plan)', 'Health information line'], section: 'Health Coverage' },
      { name: "BC Women's Hospital", website: 'https://www.bcwomens.ca', address: '4500 Oak St, Vancouver, BC V6H 3N1', phone: '604-875-2424', services: [], section: 'Major Hospitals' },
    ],
    transport: [
      { name: 'TransLink (Metro Vancouver)', website: 'https://www.translink.ca', address: '400-287 Nelson\'s Court, New Westminster, BC V3L 0E7', phone: '604-953-3333', services: ['SkyTrain', 'Bus network', 'West Coast Express', 'SeaBus', 'HandyDART'], section: 'Metro Vancouver', liveMap: 'https://www.translink.ca/trip-planning' },
      { name: 'BC Transit (Victoria & other cities)', website: 'https://www.bctransit.com', address: 'Victoria, BC', phone: '250-382-6161', services: ['Bus service across BC communities', 'Victoria Regional Transit'], section: 'BC Transit', liveMap: 'https://www.bctransit.com/plan-your-trip' },
    ],
    volunteering: [
      { name: 'Volunteer Vancouver', website: 'https://www.volunteervancouver.ca', address: '3375 Kingsway, Vancouver, BC V5R 5K6', phone: '604-875-9144', email: '', services: ['Volunteer matching', 'Skills-based volunteering'], section: 'Vancouver Volunteering' },
      { name: 'United Way BC', website: 'https://uwbc.ca', address: 'Vancouver, BC', phone: '604-688-1830', email: '', services: ['Community programs', 'Volunteer engagement'], section: 'Province-Wide' },
    ],
  },

  Alberta: {
    settlement: [
      { name: 'Catholic Social Services (Immigration)', organization: 'CSS Alberta', website: 'https://www.cssalberta.ca', address: '8815 99 St NW, Edmonton, AB T6E 3V6', phone: '780-420-1970', email: '', services: ['Newcomer settlement', 'Employment counselling', 'Language training', 'Community integration'], city: 'Edmonton' },
      { name: 'Centre for Newcomers (Calgary)', website: 'https://www.centrefornewcomers.ca', address: '565 36 St NE #125, Calgary, AB T2A 7E7', phone: '403-569-3325', email: '', services: ['Settlement services', 'Language programs', 'Employment support'], city: 'Calgary' },
      { name: 'Edmonton Mennonite Centre for Newcomers (EMCN)', website: 'https://emcn.ab.ca', address: '11713 82 St NW, Edmonton, AB T5B 2T7', phone: '780-424-7709', email: '', services: ['ESL & LINC classes', 'Settlement support', 'Integration programs'], city: 'Edmonton' },
    ],
    education: [
      { name: 'University of Alberta', type: 'University', website: 'https://www.ualberta.ca', address: '83 University Campus NW, Edmonton, AB T6G 2J9', phone: '780-407-8861', email: '', city: 'Edmonton' },
      { name: 'MacEwan University', type: 'University', website: 'https://www.macewan.ca', address: '10700 104 Ave NW, Edmonton, AB T5J 4S2', phone: '780-497-5000', email: '', city: 'Edmonton' },
      { name: 'NAIT', type: 'Polytechnic', website: 'https://www.nait.ca', address: '11762 106 St NW, Edmonton, AB T5G 2R1', phone: '780-471-6248', email: '', city: 'Edmonton' },
      { name: 'University of Calgary', type: 'University', website: 'https://www.ucalgary.ca', address: '2500 University Dr NW, Calgary, AB T2N 1N4', phone: '403-220-4636', email: '', city: 'Calgary' },
      { name: 'SAIT (Southern Alberta Institute of Technology)', type: 'Polytechnic', website: 'https://www.sait.ca', address: '1301 16 Ave NW, Calgary, AB T2M 0L4', phone: '403-284-7248', email: '', city: 'Calgary' },
      { name: 'Bow Valley College', type: 'College', website: 'https://bowvalleycollege.ca', address: '345 6 Ave SE, Calgary, AB T2G 4V1', phone: '403-410-1400', email: '', city: 'Calgary' },
    ],
    language: [
      { name: 'NorQuest College (LINC Program)', website: 'https://www.norquest.ca', address: '10215 108 St NW, Edmonton, AB T5J 1L6', phone: '780-644-6000', email: '', services: ['Free LINC English classes (CLB 0–8)', 'Flexible schedules', 'Work-integrated learning'], city: 'Edmonton', section: 'Edmonton Language' },
      { name: 'ASSIST Community Services Centre', website: 'https://assistcsc.org', address: '9649 105A Ave NW, Edmonton, AB T5H 0M3', phone: '780-429-3111', email: 'info@assistcsc.org', services: ['LINC English classes', 'Language placement', 'Newcomer support'], city: 'Edmonton', section: 'Edmonton Language' },
      { name: 'Calgary Catholic Immigration Society (CCIS)', website: 'https://www.ccisab.ca', address: '1111 11 Ave SW, Calgary, AB T3C 0M5', phone: '403-262-2006', email: '', services: ['Free LINC English classes', 'Day & evening programs', 'Beginner to advanced'], city: 'Calgary', section: 'Calgary Language' },
      { name: 'Equilibrium School', website: 'https://www.equilibrium.ab.ca', address: '707 14 St NW, Calgary, AB T2N 2A4', phone: '403-283-1111', email: 'school@equilibrium.ab.ca', services: ['LINC classes', 'ESL/EAL programs', 'Language testing'], city: 'Calgary', section: 'Calgary Language' },
    ],
    employment: [
      { name: 'Alberta Supports', website: 'https://www.alberta.ca/alberta-supports.aspx', address: 'Multiple locations province-wide', phone: '1-877-644-9992', email: '', services: ['Employment insurance', 'Job training', 'Career counselling'], city: 'Province-Wide', section: 'Provincial Services' },
      { name: 'Calgary Catholic Immigration Society (CCIS) Employment', website: 'https://www.ccisab.ca', address: '1111 11 Ave SW, Calgary, AB', phone: '403-262-2006', email: '', services: ['Job search workshops', 'Credential recognition', 'Bridging programs'], city: 'Calgary', section: 'Calgary Employment' },
    ],
    housing: [
      { name: 'Alberta Supports (Housing)', website: 'https://www.alberta.ca/affordable-housing-and-rent-assistance', address: 'Province-wide', phone: '1-877-644-9992', email: '', services: ['Rent assistance', 'Affordable housing applications', 'Emergency housing support'], section: 'Provincial Services' },
      { name: 'Civida (Edmonton Community Housing)', website: 'https://www.civida.ca', address: '10255 112 St NW, Edmonton, AB T5K 1M7', phone: '780-420-6161', email: '', services: ['Subsidized housing', 'Tenant support'], section: 'Edmonton Housing' },
      { name: 'HomeEd (Edmonton Public Housing)', website: 'https://homeed.ca', address: 'Edmonton, AB', phone: '780-496-8080', email: '', services: ['Public housing units', 'Affordable rental programs'], section: 'Edmonton Housing' },
      { name: 'Calgary Housing Company', website: 'https://www.calgary.ca/calgary-housing.html', address: '1000 800 Macleod Trail SE, Calgary, AB T2G 5E5', phone: '403-221-3660', email: '', services: ['Subsidized housing', 'Affordable rental programs'], section: 'Calgary Housing' },
    ],
    legal: [
      { name: 'Legal Aid Alberta', website: 'https://www.legalaid.ab.ca', address: '900 Sun Life Place, 10123 99 St NW, Edmonton, AB T5J 3H1', phone: '1-866-845-3425', email: '', services: ['Criminal, family, immigration legal help', 'Youth legal representation'], section: 'Legal Aid' },
      { name: 'Edmonton Community Legal Centre (ECLC)', website: 'https://www.eclc.ca', address: '200 10020 100 St, Edmonton, AB T5J 0N3', phone: '780-702-1725', email: 'intake@eclc.ca', services: ['Free legal advice', 'Family, tenant, employment law'], section: 'Free Legal Clinics' },
      { name: 'Calgary Legal Guidance (CLG)', website: 'https://clg.ab.ca', address: 'Calgary, AB', phone: '403-234-9266', email: '', services: ['Free legal advice clinics', 'Immigration, family law'], section: 'Free Legal Clinics' },
    ],
    health: [
      { name: 'Alberta Health Services', website: 'https://www.albertahealthservices.ca', address: 'Province-wide', phone: '811 (Health Link)', services: ['Provincial health authority', 'Find nearest hospital or clinic', 'Health Link 24/7 advice line'], section: 'Provincial Health' },
      { name: 'University of Alberta Hospital', website: 'https://www.albertahealthservices.ca', address: '8440 112 St NW, Edmonton, AB T6G 2B7', phone: '780-407-8822', services: [], section: 'Edmonton Hospitals' },
      { name: 'Foothills Medical Centre', website: 'https://www.albertahealthservices.ca', address: '1403 29 St NW, Calgary, AB T2N 2T9', phone: '403-944-1110', services: [], section: 'Calgary Hospitals' },
    ],
    transport: [
      { name: 'Edmonton Transit Service (ETS)', website: 'https://www.edmonton.ca/ets', address: 'Edmonton, AB', phone: '780-442-5311', services: ['City buses', 'LRT (Metro, Capital, Valley Line)', 'On-Demand Transit'], section: 'Edmonton Transit', liveMap: 'https://www.edmonton.ca/ets/live-bus-finder' },
      { name: 'Calgary Transit', website: 'https://www.calgarytransit.com', address: '200 NW Centre St, Calgary, AB T2E 2C4', phone: '403-262-1000', services: ['Bus network', 'CTrain (Red & Blue Line)', 'MAX Bus Rapid Transit'], section: 'Calgary Transit', liveMap: 'https://www.calgarytransit.com' },
    ],
    volunteering: [
      { name: 'Volunteer Alberta', website: 'https://volunteeralberta.ab.ca', address: 'Edmonton, AB', phone: '780-482-3300', email: '', services: ['Province-wide volunteer matching', 'Nonprofit support'], section: 'Province-Wide' },
      { name: 'Volunteer Connector', website: 'https://www.volunteerconnector.org', address: 'Alberta', phone: '', email: '', services: ['Online volunteer matching platform'], section: 'Province-Wide' },
    ],
  },

  Quebec: {
    settlement: [
      { name: 'PROMIS Montreal', organization: 'PROMIS', website: 'https://www.promis.qc.ca', address: '3900 rue Beaubien Est, Montreal, QC H1X 1H5', phone: '514-352-0665', email: 'info@promis.qc.ca', services: ['Settlement services', 'French integration programs', 'Employment support', 'Multicultural community programs'], city: 'Montreal' },
      { name: 'CARI Saint-Laurent', website: 'https://www.carisaintlaurent.com', address: '2465 Bd Thimens, Saint-Laurent, QC H4R 1T2', phone: '514-748-2007', email: '', services: ['Settlement', 'Language courses', 'Employment', 'Community integration'], city: 'Montreal' },
    ],
    education: [
      { name: 'McGill University', type: 'University', website: 'https://www.mcgill.ca', address: '845 Sherbrooke St W, Montreal, QC H3A 0G4', phone: '514-398-4455', email: '', city: 'Montreal' },
      { name: 'Université de Montréal', type: 'University', website: 'https://www.umontreal.ca', address: '2900 Boul. Édouard-Montpetit, Montreal, QC H3T 1J4', phone: '514-343-6111', email: '', city: 'Montreal' },
      { name: 'Concordia University', type: 'University', website: 'https://www.concordia.ca', address: '1455 De Maisonneuve Blvd W, Montreal, QC H3G 1M8', phone: '514-848-2424', email: '', city: 'Montreal' },
      { name: 'Université Laval', type: 'University', website: 'https://www.ulaval.ca', address: '2325 Rue de l\'Université, Quebec City, QC G1V 0A6', phone: '418-656-3333', email: '', city: 'Quebec City' },
    ],
    language: [
      { name: 'Francisation Québec', website: 'https://www.quebec.ca/en/education/learn-french', address: 'Province-wide', phone: '1-888-291-8486', email: '', services: ['Free French language integration courses', 'For all newcomers to Quebec', 'Online and in-person options'], city: 'Province-Wide', section: 'Government Programs' },
      { name: 'CÉGEP Francophone Language Programs', website: 'https://www.quebec.ca/en/education/learn-french', address: 'Multiple CÉGEP campuses', phone: '', email: '', services: ['Intensive French classes', 'Adapted programs for adult learners'], city: 'Province-Wide', section: 'Government Programs' },
    ],
    employment: [
      { name: 'Emploi-Québec', website: 'https://www.emploiquebec.gouv.qc.ca', address: 'Province-wide offices', phone: '1-888-643-4721', email: '', services: ['Employment services', 'Skills training', 'Job search support'], city: 'Province-Wide', section: 'Provincial Services' },
      { name: 'PROMIS Employment Program', website: 'https://www.promis.qc.ca', address: '3900 rue Beaubien Est, Montreal, QC', phone: '514-352-0665', email: '', services: ['Employment counselling', 'Job placement', 'Bridging programs'], city: 'Montreal', section: 'Montreal Employment' },
    ],
    housing: [
      { name: 'Office municipal d\'habitation de Montréal (OMHM)', website: 'https://www.omhm.qc.ca', address: '415 rue Saint-Antoine Ouest, Montreal, QC H2Z 1H8', phone: '514-872-6442', email: '', services: ['Social housing', 'Subsidized housing for low-income families'], section: 'Montreal Housing' },
      { name: 'Société d\'habitation du Québec', website: 'https://www.habitation.gouv.qc.ca', address: 'Province-wide', phone: '1-800-463-4315', email: '', services: ['Provincial housing programs', 'Rent supplements', 'HLM social housing'], section: 'Provincial Housing' },
    ],
    legal: [
      { name: 'Aide Juridique Québec', website: 'https://www.csj.qc.ca', address: 'Multiple locations province-wide', phone: '514-864-9300', email: '', services: ['Free legal aid', 'Criminal, family, immigration law', 'Available in French and English'], section: 'Legal Aid' },
    ],
    health: [
      { name: 'RAMQ (Quebec Health Insurance)', website: 'https://www.ramq.gouv.qc.ca', address: 'Province-wide', phone: '1-800-561-9749', services: ['Provincial health insurance registration', 'RAMQ card', 'Drug insurance plan'], section: 'Health Coverage' },
      { name: 'CHUM (Centre hospitalier de l\'Université de Montréal)', website: 'https://www.chumontreal.qc.ca', address: '1051 Rue Sanguinet, Montreal, QC H2X 3E4', phone: '514-890-8000', services: [], section: 'Major Hospitals' },
    ],
    transport: [
      { name: 'STM (Société de transport de Montréal)', website: 'https://www.stm.info', address: 'Montreal, QC', phone: '514-786-4636', services: ['Metro (subway)', 'Bus network', 'OPUS card transit passes'], section: 'Montreal Transit', liveMap: 'https://www.stm.info/en/info/networks/metro' },
      { name: 'RTC (Réseau de transport de la Capitale) – Quebec City', website: 'https://www.rtcquebec.ca', address: 'Quebec City, QC', phone: '418-627-2511', services: ['Bus network in Quebec City'], section: 'Quebec City Transit' },
    ],
    volunteering: [
      { name: 'Volunteer Bureau of Montreal', website: 'https://www.cabm.net', address: 'Montreal, QC', phone: '514-842-3351', email: '', services: ['Volunteer placement', 'Community engagement'], section: 'Montreal Volunteering' },
    ],
  },

  Manitoba: {
    settlement: [
      { name: 'Manitoba Interfaith Immigration Council (MIIC)', website: 'https://miic.ca', address: '295 Vaughan St, Winnipeg, MB R3B 2N7', phone: '204-943-9158', email: 'info@miic.ca', services: ['Newcomer settlement', 'Employment', 'Language', 'Housing'], city: 'Winnipeg' },
      { name: 'Jewish Immigrant Aid Services (JIAS) Manitoba', website: 'https://jias.org/Manitoba', address: '370 Hargrave St, Winnipeg, MB R3B 2K1', phone: '204-956-0610', email: '', services: ['Settlement services', 'Community integration', 'Employment'], city: 'Winnipeg' },
    ],
    education: [
      { name: 'University of Manitoba', type: 'University', website: 'https://umanitoba.ca', address: '66 Chancellors Circle, Winnipeg, MB R3T 2N2', phone: '204-474-8880', email: '', city: 'Winnipeg' },
      { name: 'University of Winnipeg', type: 'University', website: 'https://www.uwinnipeg.ca', address: '515 Portage Ave, Winnipeg, MB R3B 2E9', phone: '204-786-7811', email: '', city: 'Winnipeg' },
      { name: 'Red River College Polytechnic', type: 'Polytechnic', website: 'https://www.rrc.ca', address: '2055 Notre Dame Ave, Winnipeg, MB R3H 0J9', phone: '204-632-2327', email: '', city: 'Winnipeg' },
    ],
    language: [
      { name: 'LINC Manitoba (MIIC)', website: 'https://miic.ca', address: '295 Vaughan St, Winnipeg, MB', phone: '204-943-9158', email: '', services: ['Free LINC English classes', 'Settlement support integrated with language learning'], city: 'Winnipeg', section: 'Winnipeg Language' },
      { name: 'Red River College Language Programs', website: 'https://www.rrc.ca', address: '2055 Notre Dame Ave, Winnipeg, MB', phone: '204-632-2327', email: '', services: ['English for Academic Purposes', 'ESL programs'], city: 'Winnipeg', section: 'Winnipeg Language' },
    ],
    employment: [
      { name: 'Manitoba Start', website: 'https://manitobastart.com', address: '611 Manitoba Ave, Selkirk, MB / Winnipeg offices', phone: '204-940-3338', email: '', services: ['Employment programs for newcomers', 'Job search workshops', 'Bridging programs'], city: 'Winnipeg', section: 'Provincial Services' },
      { name: 'MIIC Employment Services', website: 'https://miic.ca', address: '295 Vaughan St, Winnipeg, MB', phone: '204-943-9158', email: '', services: ['Employment counselling', 'Resume writing', 'Interview skills'], city: 'Winnipeg', section: 'Winnipeg Employment' },
    ],
    housing: [
      { name: 'Manitoba Housing', website: 'https://www.gov.mb.ca/housing', address: '280 Broadway, Winnipeg, MB R3C 0R8', phone: '204-945-4663', email: '', services: ['Subsidized housing', 'Rent assist benefit', 'Affordable housing programs'], section: 'Provincial Housing' },
    ],
    legal: [
      { name: 'Legal Aid Manitoba', website: 'https://www.legalaid.mb.ca', address: '402 400 St. Mary Ave, Winnipeg, MB R3C 4K5', phone: '204-985-8500', email: '', services: ['Criminal, family, immigration legal help', 'Duty counsel'], section: 'Legal Aid' },
    ],
    health: [
      { name: 'Manitoba Health (HISC)', website: 'https://www.gov.mb.ca/health', address: 'Province-wide', phone: '204-945-3744', services: ['Provincial health coverage (HISC card)', 'Health program information'], section: 'Health Coverage' },
      { name: 'Health Sciences Centre Winnipeg', website: 'https://sharedhealthmb.ca', address: '820 Sherbrook St, Winnipeg, MB R3A 1R9', phone: '204-787-3661', services: [], section: 'Major Hospitals' },
    ],
    transport: [
      { name: 'Winnipeg Transit', website: 'https://www.winnipegtransit.com', address: 'Winnipeg, MB', phone: '311', services: ['City bus service', 'BLUE rapid transit', 'Handi-Transit for accessibility'], section: 'Winnipeg Transit', liveMap: 'https://winnipegtransit.com/en/schedules-maps/trip-planner' },
    ],
    volunteering: [
      { name: 'Volunteer Manitoba', website: 'https://volunteermanitoba.ca', address: 'Winnipeg, MB', phone: '204-477-5180', email: '', services: ['Volunteer matching', 'Community engagement programs'], section: 'Province-Wide' },
    ],
  },

  Saskatchewan: {
    settlement: [
      { name: 'Open Door Society (Regina)', website: 'https://www.opendoorsociety.org', address: '2151 Scarth St, Regina, SK S4P 2H8', phone: '306-352-5775', email: 'info@opendoorsociety.org', services: ['Settlement services', 'Language programs', 'Employment support', 'Community integration'], city: 'Regina' },
      { name: 'Saskatoon Open Door Society', website: 'https://www.sods.sk.ca', address: '419 4th Ave N, Saskatoon, SK S7K 2L8', phone: '306-653-4464', email: '', services: ['Settlement', 'Language training', 'Employment programs'], city: 'Saskatoon' },
    ],
    education: [
      { name: 'University of Saskatchewan', type: 'University', website: 'https://www.usask.ca', address: '105 Administration Pl, Saskatoon, SK S7N 5A2', phone: '306-966-4343', email: '', city: 'Saskatoon' },
      { name: 'University of Regina', type: 'University', website: 'https://www.uregina.ca', address: '3737 Wascana Pkwy, Regina, SK S4S 0A2', phone: '306-585-4111', email: '', city: 'Regina' },
      { name: 'Saskatchewan Polytechnic', type: 'Polytechnic', website: 'https://saskpolytech.ca', address: '1130 Idylwyld Dr N, Saskatoon, SK S7L 1B2', phone: '1-866-467-4278', email: '', city: 'Saskatoon' },
    ],
    language: [
      { name: 'LINC Saskatchewan', website: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/new-immigrants/improve-english-french.html', address: 'Multiple locations in Saskatchewan', phone: '', email: '', services: ['Free English for permanent residents and protected persons'], city: 'Province-Wide', section: 'Government Programs' },
      { name: 'Open Door Society Language Programs', website: 'https://www.opendoorsociety.org', address: '2151 Scarth St, Regina, SK', phone: '306-352-5775', email: '', services: ['LINC classes', 'ESL programs'], city: 'Regina', section: 'Regina Language' },
    ],
    employment: [
      { name: 'Saskatchewan Polytechnic Employment Programs', website: 'https://saskpolytech.ca', address: 'Multiple campuses', phone: '1-866-467-4278', email: '', services: ['Trades and technology training', 'Employment skills programs', 'Job placement support'], city: 'Province-Wide', section: 'Provincial Services' },
      { name: 'Open Door Society Employment', website: 'https://www.opendoorsociety.org', address: '2151 Scarth St, Regina, SK', phone: '306-352-5775', email: '', services: ['Job search workshops', 'Resume assistance', 'Employer connections'], city: 'Regina', section: 'Regina Employment' },
    ],
    housing: [
      { name: 'Saskatchewan Housing Corporation', website: 'https://www.saskatchewan.ca/residents/housing', address: 'Province-wide', phone: '1-800-667-7567', email: '', services: ['Affordable housing programs', 'Rent supplement', 'Social housing'], section: 'Provincial Housing' },
    ],
    legal: [
      { name: 'Legal Aid Saskatchewan', website: 'https://legalaid.sk.ca', address: '2201A 11th Ave, Regina, SK S4P 0J8', phone: '306-787-3000', email: '', services: ['Criminal, family, immigration legal help', 'Duty counsel'], section: 'Legal Aid' },
    ],
    health: [
      { name: 'Saskatchewan Health Authority (SHA)', website: 'https://www.saskhealthauthority.ca', address: 'Province-wide', phone: '811 (HealthLine)', services: ['Provincial health authority', 'Health coverage', '24/7 HealthLine advice'], section: 'Provincial Health' },
      { name: 'Regina General Hospital', website: 'https://www.saskhealthauthority.ca', address: '1440 14 Ave, Regina, SK S4P 0W5', phone: '306-766-4444', services: [], section: 'Major Hospitals' },
    ],
    transport: [
      { name: 'Regina Transit', website: 'https://www.regina.ca/transportation-roads-parking/public-transit/', address: 'Regina, SK', phone: '306-777-7433', services: ['City bus service'], section: 'Regina Transit', liveMap: 'https://www.regina.ca/transportation-roads-parking/public-transit/' },
      { name: 'Saskatoon Transit', website: 'https://transit.saskatoon.ca', address: 'Saskatoon, SK', phone: '306-975-3100', services: ['City bus service', 'Paratransit'], section: 'Saskatoon Transit', liveMap: 'https://transit.saskatoon.ca' },
    ],
    volunteering: [
      { name: 'Volunteer Regina', website: 'https://www.volunteerregina.ca', address: 'Regina, SK', phone: '306-352-4300', email: '', services: ['Volunteer placement', 'Community programs'], section: 'Regina Volunteering' },
    ],
  },

  'Nova Scotia': {
    settlement: [
      { name: 'Immigrant Services Association of Nova Scotia (ISANS)', website: 'https://www.isans.ca', address: '1465 Brenton St, Halifax, NS B3J 2K5', phone: '902-423-3607', email: 'isans@isans.ca', services: ['Settlement counselling', 'Language programs', 'Employment services', 'Community integration'], city: 'Halifax' },
      { name: 'Centre for Immigrant Programs (Nova Scotia)', website: 'https://www.isans.ca', address: 'Halifax, NS', phone: '902-423-3607', email: '', services: ['Newcomer orientation', 'Community connections'], city: 'Halifax' },
    ],
    education: [
      { name: 'Dalhousie University', type: 'University', website: 'https://www.dal.ca', address: '6299 South St, Halifax, NS B3H 4R2', phone: '902-494-2211', email: '', city: 'Halifax' },
      { name: 'Saint Mary\'s University', type: 'University', website: 'https://www.smu.ca', address: '923 Robie St, Halifax, NS B3H 3C3', phone: '902-420-5400', email: '', city: 'Halifax' },
      { name: 'NSCC (Nova Scotia Community College)', type: 'College', website: 'https://www.nscc.ca', address: '5685 Leeds St, Halifax, NS B3J 2X1', phone: '1-866-679-6722', email: '', city: 'Halifax' },
    ],
    language: [
      { name: 'LINC Nova Scotia (ISANS)', website: 'https://www.isans.ca', address: '1465 Brenton St, Halifax, NS', phone: '902-423-3607', email: '', services: ['Free LINC English classes', 'Language assessment', 'ESL programs'], city: 'Halifax', section: 'Halifax Language' },
    ],
    employment: [
      { name: 'Nova Scotia Works', website: 'https://novascotiaworks.ca', address: 'Multiple locations province-wide', phone: '1-800-424-5418', email: '', services: ['Employment counselling', 'Skills training', 'Job search support'], city: 'Province-Wide', section: 'Provincial Services' },
      { name: 'ISANS Employment Programs', website: 'https://www.isans.ca', address: '1465 Brenton St, Halifax, NS', phone: '902-423-3607', email: '', services: ['Bridging programs', 'Professional networking', 'Job placement'], city: 'Halifax', section: 'Halifax Employment' },
    ],
    housing: [
      { name: 'Nova Scotia Provincial Housing', website: 'https://www.novascotia.ca/housing', address: 'Province-wide', phone: '1-800-670-4357', email: '', services: ['Social housing', 'Rent supplement programs', 'Affordable housing'], section: 'Provincial Housing' },
    ],
    legal: [
      { name: 'Legal Aid Nova Scotia', website: 'https://www.nslegalaid.ca', address: '800 1701 Hollis St, Halifax, NS B3J 3M8', phone: '902-420-6573', email: '', services: ['Criminal, family, immigration legal help', 'Duty counsel'], section: 'Legal Aid' },
    ],
    health: [
      { name: 'Nova Scotia Health Authority', website: 'https://www.nshealth.ca', address: 'Province-wide', phone: '811 (811 NS health line)', services: ['Provincial health coverage', 'Health services directory'], section: 'Provincial Health' },
      { name: 'QEII Health Sciences Centre', website: 'https://www.nshealth.ca', address: '1276 South Park St, Halifax, NS B3H 2Y9', phone: '902-473-2220', services: [], section: 'Major Hospitals' },
    ],
    transport: [
      { name: 'Halifax Transit', website: 'https://www.halifax.ca/transportation/halifax-transit', address: 'Halifax, NS', phone: '902-480-8000', services: ['Bus network', 'Ferry service', 'Access-A-Bus'], section: 'Halifax Transit', liveMap: 'https://www.halifax.ca/transportation/halifax-transit/routes-schedules' },
    ],
    volunteering: [
      { name: 'Volunteer Nova Scotia', website: 'https://volunteernovascotia.ca', address: 'Halifax, NS', phone: '902-446-4170', email: '', services: ['Volunteer matching', 'Sector support'], section: 'Province-Wide' },
    ],
  },

  'New Brunswick': {
    settlement: [
      { name: 'YMCA Newcomer Connections (Fredericton)', website: 'https://www.ymcanb.ca/newcomers', address: '29 Union St, Fredericton, NB E3B 1G7', phone: '506-458-1540', email: '', services: ['Newcomer orientation', 'Language programs', 'Employment support', 'Community integration'], city: 'Fredericton' },
      { name: 'Multicultural Association of the Greater Moncton Area (MAGMA)', website: 'https://www.magma-amgm.org', address: '449 Paul St, Dieppe, NB E1A 4X5', phone: '506-858-8189', email: '', services: ['Settlement services', 'Language training', 'Community programs'], city: 'Moncton' },
    ],
    education: [
      { name: 'University of New Brunswick', type: 'University', website: 'https://www.unb.ca', address: '3 Bailey Dr, Fredericton, NB E3B 5A3', phone: '506-453-4666', email: '', city: 'Fredericton' },
      { name: 'Université de Moncton', type: 'University', website: 'https://www.umoncton.ca', address: '18 Ave Antonine-Maillet, Moncton, NB E1A 3E9', phone: '506-858-4000', email: '', city: 'Moncton' },
      { name: 'NBCC (New Brunswick Community College)', type: 'College', website: 'https://nbcc.ca', address: 'Multiple campuses province-wide', phone: '1-888-796-6222', email: '', city: 'Province-Wide' },
    ],
    language: [
      { name: 'LINC NB', website: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/new-immigrants/improve-english-french.html', address: 'Fredericton, Moncton, Saint John', phone: '', email: '', services: ['Free LINC English/French for newcomers'], city: 'Province-Wide', section: 'Government Programs' },
    ],
    employment: [
      { name: 'WorkingNB', website: 'https://www.workingnb.ca', address: 'Multiple locations province-wide', phone: '1-888-762-8600', email: '', services: ['Employment counselling', 'Skills training', 'Job placement'], city: 'Province-Wide', section: 'Provincial Services' },
    ],
    housing: [
      { name: 'NB Housing Corporation', website: 'https://www.gnb.ca/housing', address: 'Province-wide', phone: '506-453-2013', email: '', services: ['Social housing', 'Rent supplement', 'Emergency housing'], section: 'Provincial Housing' },
    ],
    legal: [
      { name: 'Legal Aid New Brunswick', website: 'https://www.legalaid.nb.ca', address: 'Multiple offices province-wide', phone: '506-444-2776', email: '', services: ['Criminal, family, immigration legal help'], section: 'Legal Aid' },
    ],
    health: [
      { name: 'Vitalité Health Network', website: 'https://www.vitalitenb.ca', address: 'North & East NB', phone: '506-862-4000', services: ['Francophone hospital network', 'Health services in French'], section: 'Major Health Networks' },
      { name: 'Horizon Health Network', website: 'https://en.horizonnb.ca', address: 'South & Central NB (Saint John, Fredericton, Moncton)', phone: '506-648-6000', services: ['English-language hospital network'], section: 'Major Health Networks' },
    ],
    transport: [
      { name: 'Saint John Transit', website: 'https://saintjohn.ca/en/live/transit', address: 'Saint John, NB', phone: '506-658-4700', services: ['City bus service'], section: 'Saint John Transit' },
      { name: 'Fredericton Transit', website: 'https://www.fredericton.ca/en/transportation/fredericton-transit', address: 'Fredericton, NB', phone: '506-460-2200', services: ['City bus service'], section: 'Fredericton Transit' },
    ],
    volunteering: [
      { name: 'Volunteer New Brunswick', website: 'https://www.volunteernb.ca', address: 'Fredericton, NB', phone: '506-457-8120', email: '', services: ['Volunteer matching', 'Nonprofit capacity building'], section: 'Province-Wide' },
    ],
  },

  'Newfoundland and Labrador': {
    settlement: [
      { name: 'Association for New Canadians (ANC)', website: 'https://www.ancnl.ca', address: '144 Military Rd, St. John\'s, NL A1C 2E6', phone: '709-722-9680', email: 'info@ancnl.ca', services: ['Newcomer settlement', 'Language programs', 'Employment', 'Community integration', 'Housing assistance'], city: 'St. John\'s' },
    ],
    education: [
      { name: 'Memorial University of Newfoundland', type: 'University', website: 'https://www.mun.ca', address: '230 Elizabeth Ave, St. John\'s, NL A1C 5S7', phone: '709-864-8000', email: '', city: 'St. John\'s' },
      { name: 'College of the North Atlantic', type: 'College', website: 'https://www.cna.nl.ca', address: 'Multiple campuses province-wide', phone: '709-758-7000', email: '', city: 'Province-Wide' },
    ],
    language: [
      { name: 'LINC NL (ANC)', website: 'https://www.ancnl.ca', address: '144 Military Rd, St. John\'s, NL', phone: '709-722-9680', email: '', services: ['Free LINC English classes', 'Language assessment', 'ESL programs'], city: 'St. John\'s', section: 'Language Programs' },
    ],
    employment: [
      { name: 'Employability Programs NL', website: 'https://www.gov.nl.ca/aesl/emp/', address: 'Province-wide', phone: '1-800-563-6600', email: '', services: ['Employment training', 'Skills development', 'Job placement support'], city: 'Province-Wide', section: 'Provincial Services' },
      { name: 'ANC Employment Programs', website: 'https://www.ancnl.ca', address: '144 Military Rd, St. John\'s, NL', phone: '709-722-9680', email: '', services: ['Job search workshops', 'Employer connections', 'Bridging programs'], city: 'St. John\'s', section: 'St. John\'s Employment' },
    ],
    housing: [
      { name: 'Newfoundland & Labrador Housing Corporation', website: 'https://www.gov.nl.ca/fin/housing', address: '2 Furlong Place, St. John\'s, NL A1C 5M2', phone: '709-724-3000', email: '', services: ['Subsidized housing', 'Rent supplement', 'Emergency housing assistance'], section: 'Provincial Housing' },
    ],
    legal: [
      { name: 'Legal Aid NL', website: 'https://www.legalaid.nl.ca', address: '251 Empire Ave, St. John\'s, NL A1C 3H9', phone: '709-753-7860', email: '', services: ['Criminal, family, immigration legal help', 'Duty counsel'], section: 'Legal Aid' },
    ],
    health: [
      { name: 'NL Health Services', website: 'https://nlhealthservices.ca', address: 'Province-wide', phone: '811 (811 NL)', services: ['Provincial health coverage', 'Medical Card', 'Health information line'], section: 'Provincial Health' },
      { name: 'Health Sciences Centre (St. John\'s)', website: 'https://nlhealthservices.ca', address: '300 Prince Philip Dr, St. John\'s, NL A1B 3V6', phone: '709-777-6300', services: [], section: 'Major Hospitals' },
    ],
    transport: [
      { name: 'Metrobus Transit (St. John\'s)', website: 'https://www.metrobus.com', address: 'St. John\'s, NL', phone: '709-570-2020', services: ['City bus service', 'GoBus accessible transit'], section: 'St. John\'s Transit', liveMap: 'https://www.metrobus.com/route-schedules' },
    ],
    volunteering: [
      { name: 'Volunteer NL', website: 'https://www.volunteernl.ca', address: 'St. John\'s, NL', phone: '709-738-4243', email: '', services: ['Volunteer matching', 'Community programs'], section: 'Province-Wide' },
    ],
  },

  'Prince Edward Island': {
    settlement: [
      { name: 'PEI Association for Newcomers to Canada (PEIANC)', website: 'https://www.peianc.com', address: '25 Westland Dr, Charlottetown, PE C1A 0E1', phone: '902-628-6009', email: 'info@peianc.com', services: ['Settlement services', 'Language programs', 'Employment support', 'Community integration'], city: 'Charlottetown' },
    ],
    education: [
      { name: 'University of Prince Edward Island (UPEI)', type: 'University', website: 'https://www.upei.ca', address: '550 University Ave, Charlottetown, PE C1A 4P3', phone: '902-566-0439', email: '', city: 'Charlottetown' },
      { name: 'Holland College', type: 'College', website: 'https://www.hollandcollege.com', address: '140 Weymouth St, Charlottetown, PE C1A 4Z1', phone: '902-629-4217', email: '', city: 'Charlottetown' },
    ],
    language: [
      { name: 'LINC PEI (PEIANC)', website: 'https://www.peianc.com', address: '25 Westland Dr, Charlottetown, PE', phone: '902-628-6009', email: '', services: ['Free LINC English classes', 'ESL programs', 'Language assessment'], city: 'Charlottetown', section: 'Language Programs' },
    ],
    employment: [
      { name: 'Employment Journey PEI', website: 'https://www.princeedwardisland.ca/en/service/employment-services', address: 'Province-wide', phone: '902-368-5260', email: '', services: ['Employment counselling', 'Skills training', 'Job placement support'], city: 'Province-Wide', section: 'Provincial Services' },
      { name: 'PEIANC Employment Programs', website: 'https://www.peianc.com', address: '25 Westland Dr, Charlottetown, PE', phone: '902-628-6009', email: '', services: ['Newcomer employment workshops', 'Employer connections'], city: 'Charlottetown', section: 'Charlottetown Employment' },
    ],
    housing: [
      { name: 'PEI Housing Corporation', website: 'https://www.princeedwardisland.ca/en/topic/housing', address: 'Province-wide', phone: '902-569-0120', email: '', services: ['Subsidized housing', 'Rent supplement', 'Emergency housing'], section: 'Provincial Housing' },
    ],
    legal: [
      { name: 'Legal Aid PEI', website: 'https://www.legalaid.pe.ca', address: '49 Water St, Charlottetown, PE C1A 1A3', phone: '902-368-6043', email: '', services: ['Criminal, family, immigration legal help', 'Duty counsel'], section: 'Legal Aid' },
    ],
    health: [
      { name: 'Health PEI', website: 'https://www.princeedwardisland.ca/en/topic/health-pei', address: 'Province-wide', phone: '811 (811 PEI)', services: ['Provincial health coverage', 'PEI Health Card', 'Health information'], section: 'Provincial Health' },
      { name: 'Queen Elizabeth Hospital', website: 'https://www.princeedwardisland.ca', address: '60 Riverside Dr, Charlottetown, PE C1A 8T5', phone: '902-894-2111', services: [], section: 'Major Hospitals' },
    ],
    transport: [
      { name: 'T3 Transit (Charlottetown)', website: 'https://www.t3transit.ca', address: 'Charlottetown, PE', phone: '902-566-5664', services: ['City bus service', 'Fixed-route transit'], section: 'Charlottetown Transit', liveMap: 'https://www.t3transit.ca/routes' },
    ],
    volunteering: [
      { name: 'Volunteer PEI', website: 'https://volunteerpei.ca', address: 'Charlottetown, PE', phone: '902-368-7337', email: '', services: ['Volunteer matching', 'Nonprofit sector support'], section: 'Province-Wide' },
    ],
  },
};

export const PROVINCES = Object.keys(PROVINCE_DATA);

export const PROVINCE_EMOJIS = {
  'Ontario': '🏙️',
  'British Columbia': '🌊',
  'Alberta': '🏔️',
  'Quebec': '⚜️',
  'Manitoba': '🌾',
  'Saskatchewan': '🌻',
  'Nova Scotia': '⚓',
  'New Brunswick': '🦞',
  'Newfoundland and Labrador': '🦭',
  'Prince Edward Island': '🦞',
};