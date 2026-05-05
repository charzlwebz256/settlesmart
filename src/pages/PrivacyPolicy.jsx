import { Shield } from 'lucide-react';

const sections = [
  {
    title: '1. Information We Collect',
    content: 'We may collect basic information such as your name (if provided), email address (for contact or newsletter), and usage data (to improve the platform).',
  },
  {
    title: '2. How We Use Information',
    content: 'We use collected information to improve user experience, respond to inquiries, and provide relevant updates and resources.',
  },
  {
    title: '3. Data Protection',
    content: 'We take reasonable measures to protect your information from unauthorized access, misuse, or disclosure.',
  },
  {
    title: '4. Third-Party Services',
    content: 'SettleSmart may link to external websites (e.g., government or service providers). We are not responsible for their privacy practices.',
  },
  {
    title: '5. Cookies',
    content: 'We may use minimal cookies to improve functionality and performance.',
  },
  {
    title: '6. Your Rights',
    content: 'You have the right to request access to your data and request deletion of your data.',
  },
  {
    title: '7. Updates',
    content: 'This policy may be updated from time to time to reflect improvements or legal requirements.',
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 pb-24 md:pb-12">
      <div className="mb-8 flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl mb-1">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm">At SettleSmart, your privacy is important to us. We are committed to protecting your personal information and ensuring transparency in how data is handled.</p>
        </div>
      </div>

      <div className="space-y-5">
        {sections.map((s, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-5">
            <h2 className="font-heading font-bold text-base mb-2">{s.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.content}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center mt-8">Last updated: May 2026 · SettleSmart Canada</p>
    </div>
  );
}