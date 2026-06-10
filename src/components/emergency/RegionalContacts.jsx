import { ExternalLink } from 'lucide-react';

const REGIONAL_DATA = {
  'Ontario': {
    settlement: [
      { label: 'ACCES Employment', url: 'https://accesemployment.ca/', note: 'Job integration for newcomers' },
      { label: 'COSTI Immigrant Services', url: 'https://www.costi.org/', note: 'Comprehensive settlement in Toronto' },
      { label: 'Newcomer Centre of Peel', url: 'https://www.newcomerpeel.ca/', note: 'Brampton/Mississauga newcomer hub' },
      { label: '211 Ontario', url: 'https://211ontario.ca/', note: 'All social services — phone or web' },
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
      { label: '211 BC', url: 'https://www.211.ca/', note: 'Social services across BC' },
    ],
    crisis: [
      { label: 'BC Crisis Line', number: '1-800-784-2433', note: '24/7 suicide and crisis support' },
      { label: 'Vancouver Crisis Centre', number: '604-872-3311', note: 'Metro Vancouver crisis support' },
      { label: 'VictimLinkBC', number: '1-800-563-0808', note: 'Crime & trauma victims support' },
    ],
  },
  'Alberta': {
    settlement: [
      { label: 'Catholic Social Services', url: 'https://www.catholicsocialservices.ab.ca/', note: 'Edmonton newcomer services' },
      { label: 'CIWA Calgary', url: 'https://ciwa-online.com/', note: 'Calgary Immigrant Women Association' },
      { label: 'Mennonite Centre for Newcomers', url: 'https://www.mcnedmonton.com/', note: 'Edmonton settlement support' },
      { label: '211 Alberta', url: 'https://ab.211.ca/', note: 'Province-wide services directory' },
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
      { label: '211 Quebec', url: 'https://www.211qc.ca/', note: 'Quebec social services directory' },
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
      { label: '211 Manitoba', url: 'https://mb.211.ca/', note: 'Province-wide helpline' },
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
      { label: '211 Saskatchewan', url: 'https://sk.211.ca/', note: 'Province-wide directory' },
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
      { label: '211 Nova Scotia', url: 'https://ns.211.ca/', note: 'NS social services directory' },
    ],
    crisis: [
      { label: 'NS Mental Health Crisis Line', number: '1-888-429-8167', note: '24/7 province-wide' },
      { label: 'Tearmann Society DV', number: '902-893-3232', note: 'Domestic violence support' },
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

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary inline-block" />
          Settlement Services in {name}
        </h3>
        <div className="space-y-2">
          {data.settlement.map(item => (
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
    </div>
  );
}