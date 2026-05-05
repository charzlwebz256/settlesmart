import { ExternalLink, Shield } from 'lucide-react';

const sources = [
  {
    name: 'Government of Canada',
    url: 'https://www.canada.ca',
    logo: 'https://www.canada.ca/content/dam/canada/logos/gov_ca_logo_en.svg',
  },
  {
    name: 'IRCC-Funded',
    url: 'https://www.canada.ca/en/immigration-refugees-citizenship.html',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Coat_of_Arms_of_Canada_%282021%29.svg/512px-Coat_of_Arms_of_Canada_%282021%29.svg.png',
  },
  {
    name: 'Newcomer Centre',
    url: 'https://newcomercentre.com/',
    logo: 'https://www.centrefornewcomers.ca/images/logo.png',
  },
  {
    name: 'Catholic Social Services',
    url: 'https://www.cssalberta.ca/',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Cross_Floury.svg/512px-Cross_Floury.svg.png',
  },
];

export default function InfoBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 pb-12">
      <div className="rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-bold text-lg mb-2">Trusted & Verified Information</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              All services and information on SettleSmart are sourced from the Government of Canada, 
              IRCC-funded settlement agencies, and verified nonprofit organizations. Services listed are 
              <strong className="text-foreground"> free for eligible newcomers</strong>.
            </p>
            <div className="flex flex-wrap gap-2">
              {sources.map(source => (
                <a
                  key={source.name}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-card border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors group"
                >
                  <img
                    src={source.logo}
                    alt={source.name}
                    className="w-4 h-4 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                    onError={e => e.target.style.display = 'none'}
                  />
                  {source.name}
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}