// Institution marks for the national directory. Google's favicon service returns a
// real logo for each domain, so entries without a known domain fall back to a letter tile.

const LOGO_DOMAINS = [
  ['Royal Bank of Canada', 'rbc.com'],
  ['RBC', 'rbc.com'],
  ['TD Canada Trust', 'td.com'],
  ['Scotiabank', 'scotiabank.com'],
  ['BMO', 'bmo.com'],
  ['CIBC', 'cibc.com'],
  ['National Bank', 'nbc.ca'],
  ['Desjardins', 'desjardins.com'],
  ['Tangerine', 'tangerine.ca'],
  ['EQ Bank', 'eqbank.ca'],
  ['Simplii', 'simplii.com'],
  ['Wealthsimple', 'wealthsimple.com'],
  ['KOHO', 'koho.ca'],
  ['PC Financial', 'pcfinancial.ca'],
  ['BC Housing', 'bchousing.org'],
  ['Civida', 'civida.ca'],
  ['Calgary Housing', 'calgaryhousingcompany.org'],
  ['CMHC', 'cmhc-schl.gc.ca'],
  ['VIA Rail', 'viarail.ca'],
  ['TransLink', 'translink.ca'],
  ['TTC', 'ttc.ca'],
  ['OC Transpo', 'octranspo.com'],
  ['STM', 'stm.info'],
  ['GO Transit', 'gotransit.com'],
  ['BC Ferries', 'bcferries.com'],
  ['FlixBus', 'flixbus.com'],
  ['Maritime Bus', 'maritimebus.com'],
  ['Orléans Express', 'orleansexpress.com'],
  ['Kids Help Phone', 'kidshelpphone.ca'],
  ['BC SPCA', 'spca.bc.ca'],
  ['Ontario SPCA', 'ontariospca.ca'],
  ['Alberta SPCA', 'albertaspca.org'],
  ['Winnipeg Humane Society', 'winnipeghumanesociety.ca'],
  ['SPCA Montréal', 'spca.com'],
  ['Parks Canada', 'pc.gc.ca'],
  ['Edmonton Transit', 'edmonton.ca'],
  ['Calgary Transit', 'calgarytransit.com'],
  ['Winnipeg Transit', 'winnipegtransit.com'],
  ['Saskatoon Transit', 'saskatoontransit.ca'],
  ['Regina Transit', 'regina.ca'],
  ['Halifax Transit', 'halifax.ca'],
  ['Metrobus', 'metrobus.com'],
  ['Yellowknife Transit', 'yellowknife.ca'],
  ['Whitehorse Transit', 'whitehorse.ca'],
  ['AccessAbility', 'princeedwardisland.ca'],
  ['ODSP', 'ontario.ca'],
  ['AISH', 'alberta.ca'],
  ['Ontario SPCA and Humane Society', 'ontariospca.ca'],
];

export function institutionLogo(name) {
  if (!name) return null;
  const found = LOGO_DOMAINS.find(([match]) => name.toLowerCase().includes(match.toLowerCase()));
  return found ? `https://www.google.com/s2/favicons?sz=64&domain=${found[1]}` : null;
}