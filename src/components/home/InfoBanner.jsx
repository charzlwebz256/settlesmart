import { ExternalLink, Shield } from 'lucide-react';

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
              {['Government of Canada', 'IRCC-Funded', 'Newcomer Centre', 'Catholic Social Services'].map(source => (
                <span key={source} className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full bg-card border border-border text-muted-foreground">
                  <ExternalLink className="w-3 h-3" />
                  {source}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}