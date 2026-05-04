import { ExternalLink, FileText, Shield, Scale, Globe, Phone, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const SECTIONS = [
  {
    icon: FileText,
    color: 'bg-blue-500/10 text-blue-600',
    title: 'SIN — Social Insurance Number',
    description: 'Your SIN is required to work in Canada and access government programs. Apply at a Service Canada Centre or online.',
    links: [
      { label: 'Apply for SIN — Service Canada', url: 'https://www.canada.ca/en/employment-social-development/services/sin.html' },
      { label: 'Find a Service Canada Centre', url: 'https://www.servicecanada.gc.ca/tbsc-fsco/sc-hme.jsp?lang=eng' },
    ],
  },
  {
    icon: Shield,
    color: 'bg-emerald-500/10 text-emerald-600',
    title: 'PR Card, Work Permit & Refugee Claims',
    description: 'Manage your immigration documents, renew your PR card, extend permits, or check your refugee claim status.',
    links: [
      { label: 'Renew or Replace PR Card — IRCC', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/new-immigrants/pr-card/apply-renew-replace.html' },
      { label: 'Work Permit Applications — IRCC', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/permit.html' },
      { label: 'Refugee Claim Process — IRCC', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/refugees/claim-protection-inside-canada.html' },
      { label: 'Check Application Status (IRCC)', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/application/check-status.html' },
    ],
  },
  {
    icon: Scale,
    color: 'bg-purple-500/10 text-purple-600',
    title: 'Your Rights & Responsibilities',
    description: "Canada's Charter of Rights and Freedoms protects all people in Canada. Know your rights as a newcomer.",
    links: [
      { label: 'Rights & Responsibilities in Canada — IRCC', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/new-immigrants/learn-about-canada/rights-responsibilities.html' },
      { label: 'Canadian Human Rights Commission', url: 'https://www.chrc-ccdp.gc.ca/en' },
      { label: 'Tenant Rights by Province (CMHC)', url: 'https://www.cmhc-schl.gc.ca/consumers/renting-a-home' },
      { label: 'Worker Rights — Employment Standards', url: 'https://www.canada.ca/en/employment-social-development/services/labour-standards.html' },
    ],
  },
  {
    icon: Globe,
    color: 'bg-teal-500/10 text-teal-600',
    title: 'Immigration, Refugees & Citizenship Canada (IRCC)',
    description: 'The main federal department managing all immigration, citizenship, and refugee matters in Canada.',
    links: [
      { label: 'IRCC Home — canada.ca', url: 'https://www.canada.ca/en/immigration-refugees-citizenship.html' },
      { label: 'Contact IRCC', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/contact-ircc.html' },
      { label: 'IRCC Web Form (Questions)', url: 'https://ircc.canada.ca/english/contacts/web-form.asp' },
      { label: 'Settlement Services Finder — IRCC', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/settle-canada.html' },
      { label: 'Citizenship Application — IRCC', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-citizenship/become-citizen.html' },
    ],
  },
];

export default function Legal() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-8">
      <div className="mb-8">
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-1 flex items-center gap-2">
          <Scale className="w-6 h-6 text-primary" />
          Legal & Documentation
        </h1>
        <p className="text-muted-foreground text-sm">Official IRCC resources, your rights, and key immigration documents explained</p>
      </div>

      <div className="space-y-5">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="bg-card rounded-2xl border border-border/50 p-5">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${section.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-base">{section.title}</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">{section.description}</p>
                </div>
              </div>
              <div className="space-y-2 pl-14">
                {section.links.map(link => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-primary/40 flex-shrink-0 group-hover:text-primary transition-colors" />
                    <span className="text-sm text-primary hover:underline font-medium">{link.label}</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-800">
        <strong>Note:</strong> This page provides links to official government and non-profit sources only. For personalized legal advice, consult a certified immigration consultant (RCIC) or immigration lawyer.
      </div>
    </div>
  );
}