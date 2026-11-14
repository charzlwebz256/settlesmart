import { ExternalLink } from 'lucide-react';

// Official 211 service per province/territory. Territories fall back to the
// national 211.ca directory.
export const PROVINCE_211 = {
  'Ontario': { label: '211 Ontario', url: 'https://211ontario.ca/', note: 'Shelters, food, crisis and social services in Ontario — dial 211' },
  'British Columbia': { label: '211 British Columbia', url: 'https://bc.211.ca/', note: 'Community and social services across BC — dial 211' },
  'Alberta': { label: '211 Alberta', url: 'https://ab.211.ca/', note: 'Shelters, food and social services in Alberta — dial 211' },
  'Quebec': { label: '211 Quebec', url: 'https://www.211qc.ca/', note: 'Community and social services in Quebec — dial 211' },
  'Manitoba': { label: '211 Manitoba', url: 'https://mb.211.ca/', note: 'Province-wide community services — dial 211' },
  'Saskatchewan': { label: '211 Saskatchewan', url: 'https://sk.211.ca/', note: 'Province-wide community services — dial 211' },
  'Nova Scotia': { label: '211 Nova Scotia', url: 'https://ns.211.ca/', note: 'Province-wide community services — dial 211' },
  'New Brunswick': { label: '211 New Brunswick', url: 'https://nb.211.ca/', note: 'Province-wide community services — dial 211' },
  'Newfoundland and Labrador': { label: '211 Newfoundland and Labrador', url: 'https://nl.211.ca/', note: 'Province-wide community services — dial 211' },
  'Prince Edward Island': { label: '211 Prince Edward Island', url: 'https://pei.211.ca/', note: 'Province-wide community services — dial 211' },
};

const NATIONAL_211 = { label: '211 Canada', url: 'https://www.211.ca/', note: 'Community and social services directory — dial 211' };

export function get211(province) {
  if (!province) return NATIONAL_211;
  const key = Object.keys(PROVINCE_211).find(
    k => k.toLowerCase() === province.toLowerCase() || province.toLowerCase().includes(k.toLowerCase())
  );
  return key ? PROVINCE_211[key] : NATIONAL_211;
}

const REGIONAL_DATA = {
  'Ontario': {
    settlement: [
      { label: 'ACCES Employment', url: 'https://accesemployment.ca/', note: 'Job integration for newcomers' },
      { label: 'COSTI Immigrant Services', url: 'https://www.costi.org/', note: 'Comprehensive settlement in Toronto' },
      { label: 'Newcomer Centre of Peel', url: 'https://www.newcomerpeel.ca/', note: 'Brampton/Mississauga newcomer hub' },
    ],
    crisis: [
      { label: 'Distress Centre Toronto', number: '416-408-4357', note: '24/7 crisis line' },
      { label: 'Good2Talk (Youth)', number: '1-866-925-5454', note: 'Post-secondary mental health' },
      { label: 'Assaulted Women Helpline', number: '1-866-863-0511', note: '24/7 support in 200+ languages' },
    ],
  },
  'British Columbia': {
    settlement: [
      { label: 'SUCCESS BC', url: 'https://successbc.ca/', note: 'Settlement services across BC' },
      { label: 'DIVERSEcity', url: 'https://www.dcrs.ca/', note: 'Surrey and Lower Mainland' },
      { label: 'Immigrant Services Society of BC', url: 'https://issbc.org/', note: 'Housing, employment, integration' },
    ],
    crisis: [
      { label: 'BC Crisis Line', number: '1-800-784-2433', note: '24/7 suicide and crisis support' },
      { label: 'Vancouver Crisis Centre', number: '604-872-3311', note: 'Metro Vancouver crisis support' },
      { label: 'VictimLinkBC', number: '1-800-563-0808', note: 'Crime and trauma victims support' },
    ],
  },
  'Alberta': {
    settlement: [
      { label: 'Catholic Social Services', url: 'https://www.catholicsocialservices.ab.ca/', note: 'Edmonton newcomer services' },
      { label: 'CIWA Calgary', url: 'https://ciwa-online.com/', note: 'Calgary Immigrant Women Association' },
      { label: 'Mennonite Centre for Newcomers', url: 'https://www.mcnedmonton.com/', note: 'Edmonton settlement support' },
    ],
    crisis: [
      { label: 'Distress Line Alberta', number: '1-800-232-7288', note: '24/7 crisis and suicide support' },
      { label: 'Calgary Crisis Centre', number: '403-266-4357', note: '24/7 crisis intervention' },
      { label: 'Edmonton Distress Line', number: '780-482-4357', note: 'Edmonton crisis support' },
    ],
  },
  'Quebec': {
    settlement: [
      { label: 'Quebec Immigration (MIDI)', url: 'https://www.quebec.ca/en/immigration', note: 'Provincial immigration services' },
      { label: 'TCRI (Immigrants & Refugees)', url: 'https://tcri.qc.ca/', note: 'Refugee and immigrant support' },
    ],
    crisis: [
      { label: 'Tel-Aide Quebec', number: '514-935-1101', note: '24/7 crisis support line' },
      { label: 'Crisis Centre Montreal', number: '1-866-277-3553', note: 'Suicide intervention' },
      { label: 'SOS Violence Conjugale', number: '1-800-363-9010', note: 'Domestic violence support' },
    ],
  },
  'Manitoba': {
    settlement: [
      { label: 'Immigration Partnership Winnipeg', url: 'https://www.immigrationpartnership.mb.ca/', note: 'Newcomer coordination' },
      { label: 'IRCOM — Inner City Refugees', url: 'https://ircom.ca/', note: 'Refugee housing and support' },
    ],
    crisis: [
      { label: 'Manitoba Suicide Line', number: '1-877-435-7170', note: '24/7 crisis support' },
      { label: 'Klinic Crisis Line', number: '204-786-8686', note: 'Winnipeg crisis intervention' },
    ],
  },
  'Saskatchewan': {
    settlement: [
      { label: 'Regina Open Door Society', url: 'https://rods.sk.ca/', note: 'Regina newcomer services' },
      { label: 'Saskatoon Open Door Society', url: 'https://www.sods.sk.ca/', note: 'Saskatoon settlement support' },
    ],
    crisis: [
      { label: 'Mobile Crisis Services Regina', number: '306-525-5333', note: '24/7 mobile crisis response' },
      { label: 'Crisis Line Saskatoon', number: '306-933-6200', note: 'Saskatoon crisis support' },
    ],
  },
  'Nova Scotia': {
    settlement: [
      { label: 'ISANS — Immigrant Services', url: 'https://isans.ca/', note: 'Halifax newcomer hub' },
      { label: 'Halifax Refugee Clinic', url: 'https://halifaxrefugeeclinic.ca/', note: 'Legal aid for refugees' },
    ],
    crisis: [
      { label: 'NS Mental Health Crisis Line', number: '1-888-429-8167', note: '24/7 province-wide' },
      { label: 'Tearmann Society DV', number: '902-893-3232', note: 'Domestic violence support' },
    ],
  },
  'New Brunswick': {
    settlement: [
      { label: 'New Brunswick Multicultural Council', url: 'https://www.nbmc-cnbm.ca/', note: 'Province-wide newcomer services' },
      { label: 'Saint John Newcomers Centre', url: 'https://sjnc.ca/', note: 'Settlement support in Saint John' },
    ],
    crisis: [
      { label: 'Chimo Helpline', number: '1-800-667-5005', note: 'Province-wide crisis line' },
    ],
  },
  'Newfoundland and Labrador': {
    settlement: [
      { label: 'Association for New Canadians', url: 'https://www.ancnl.ca/', note: 'Settlement services across NL' },
      { label: 'Government of NL — Immigration', url: 'https://www.gov.nl.ca/immigration/', note: 'Provincial immigration programs' },
    ],
    crisis: [
      { label: 'NL Mental Health Crisis Line', number: '1-888-737-4668', note: '24/7 province-wide' },
    ],
  },
  'Prince Edward Island': {
    settlement: [
      { label: 'PEI Association for Newcomers', url: 'https://www.peianc.com/', note: 'Settlement services across PEI' },
      { label: 'Government of PEI — Immigration', url: 'https://www.princeedwardisland.ca/en/topic/immigration', note: 'Provincial immigration programs' },
    ],
    crisis: [
      { label: 'Island Helpline', number: '1-800-218-2885', note: '24/7 mental health and crisis support' },
    ],
  },
  'Yukon': {
    settlement: [
      { label: 'Multicultural Centre of the Yukon', url: 'https://www.mcyukon.ca/', note: 'Newcomer settlement support' },
      { label: 'Government of Yukon — Immigration', url: 'https://yukon.ca/en/immigration', note: 'Provincial immigration programs' },
    ],
    crisis: [
      { label: 'Suicide Crisis Helpline', number: '988', note: 'National 24/7 crisis support' },
    ],
  },
  'Northwest Territories': {
    settlement: [
      { label: 'NWT Immigration', url: 'https://www.immigratenwt.ca/', note: 'Northwest Territories immigration programs' },
      { label: 'Government of NWT', url: 'https://www.gov.nt.ca/', note: 'Territorial services and programs' },
    ],
    crisis: [
      { label: 'NWT Helpline', number: '1-800-661-0844', note: '24/7 community and mental health support' },
    ],
  },
  'Nunavut': {
    settlement: [
      { label: 'Government of Nunavut', url: 'https://www.gov.nu.ca/', note: 'Territorial services and programs' },
    ],
    crisis: [
      { label: 'Kamatsiaqtut Help Line', number: '1-800-265-3333', note: '24/7 confidential support' },
    ],
  },
};

export function getRegionalData(province) {
  if (!province) return null;
  const key = Object.keys(REGIONAL_DATA).find(
    k => k.toLowerCase() === province.toLowerCase() || province.toLowerCase().includes(k.toLowerCase())
  );
  return key ? { data: REGIONAL_DATA[key], name: key } : null;
}

export function RegionalContacts({ province }) {
  const result = getRegionalData(province);
  if (!result) return null;
  const { data, name } = result;
  const local211 = get211(name);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary inline-block" />
          Settlement Services in {name}
        </h3>
        <div className="space-y-2">
          {[...data.settlement, local211].map(item => (
            <a
              key={item.label}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
            >
              <ExternalLink className="w-3.5 h-3.5 text-primary/50 flex-shrink-0 mt-0.5 group-hover:text-primary" />
              <div>
                <p className="text-sm font-semibold group-hover:text-primary transition-colors">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.note}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
          Crisis Lines in {name}
        </h3>
        <div className="space-y-2">
          {data.crisis.map(item => {
            const tel = item.number.replace(/[^0-9]/g, '');
            return (
              <a
                key={item.label}
                href={`tel:${tel}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/5 border border-rose-100 dark:border-rose-900/30 hover:border-rose-300 hover:bg-rose-50/50 dark:hover:bg-rose-900/20 transition-colors active:scale-[0.98]"
              >
                <div className="bg-rose-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold font-mono flex-shrink-0 min-w-[80px] text-center">
                  {item.number}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.note}</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
              </a>
            );
          })}
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground leading-snug">
        For immediate danger call 911. If a local line is busy, call 988 for suicide crisis support or 211 to reach a
        local service navigator. Numbers can change — confirm on the official site.
      </p>
    </div>
  );
}