import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    title: '1. Using SettleSmart',
    body: 'SettleSmart is a free information service for people settling in Canada. By using the app you agree to these terms. If you do not agree, please stop using the app.',
  },
  {
    title: '2. Guidance, not professional advice',
    body: 'Content is provided for general information only. It is not legal, immigration, medical, tax or financial advice, and it does not create a professional relationship. Always confirm requirements with the official agency or a regulated professional before acting.',
  },
  {
    title: '3. Accuracy of listings',
    body: 'We work to keep services, phone numbers, deadlines and program details current, but organizations change their information without notice. SettleSmart is not responsible for decisions made on outdated details.',
  },
  {
    title: '4. Your account',
    body: 'You are responsible for keeping your login secure and for the accuracy of the information you add to your profile, checklist and saved items. You may delete your saved content at any time.',
  },
  {
    title: '5. Acceptable use',
    body: 'Do not misuse the app: no unlawful activity, no automated scraping, no attempts to disrupt or access other users\' data, and no submitting false information, spam or abusive reviews.',
  },
  {
    title: '6. AI-generated answers',
    body: 'Ask Nexa generates responses with artificial intelligence using this app\'s settlement data. Answers can be incomplete or out of date. Verify anything important with an official source.',
  },
  {
    title: '7. Third-party links',
    body: 'The app links to external websites, booking pages and streaming services. Those sites have their own terms and privacy practices, and SettleSmart does not control their content.',
  },
  {
    title: '8. Availability and changes',
    body: 'Features may be added, changed or removed, and the service may be unavailable at times. These terms may be updated, and the latest version always applies.',
  },
  {
    title: '9. Contact',
    body: 'Questions about these terms or a privacy concern? Email the site admin at charzlwebz256@gmail.com.',
  },
];

export default function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold leading-tight text-foreground">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">The rules for using SettleSmart.</p>
        </div>
      </div>

      <div className="mt-6 space-y-5 rounded-2xl border border-border/50 bg-card p-6">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="font-heading text-sm font-bold text-foreground">{section.title}</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{section.body}</p>
          </section>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        See also the{' '}
        <Link to="/privacy" className="font-semibold text-primary hover:underline">
          Privacy Policy
        </Link>{' '}
        and the{' '}
        <Link to="/faq" className="font-semibold text-primary hover:underline">
          FAQ
        </Link>
        .
      </p>
    </div>
  );
}