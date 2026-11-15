import { Link } from 'react-router-dom';
import { HelpCircle, MessageSquareHeart, Mail } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FEEDBACK_EMAIL = 'charzlwebz256@gmail.com';
const FEEDBACK_HREF = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent('SettleSmart question')}`;

const FAQS = [
  {
    q: 'What is SettleSmart?',
    a: 'SettleSmart is a free settlement guide for newcomers to Canada. It brings healthcare, government benefits, settlement services, scholarships, jobs, transit, legal help and local events into one place, filtered by your province and city.',
  },
  {
    q: 'Is SettleSmart an official government service?',
    a: 'No. SettleSmart is independent and not affiliated with IRCC or any government body. Everything here is for guidance, and official sources always have the final word on requirements, deadlines and eligibility.',
  },
  {
    q: 'Does it cost anything?',
    a: 'No. Browsing services, scholarships, events, legal information and transit is free. Support Us exists only for people who want to help keep the project running.',
  },
  {
    q: 'Do I need an account?',
    a: 'You can browse most of the app without signing in. An account is required to save services and events, track job applications and scholarships, build a resume, keep a settlement checklist and get personalized recommendations.',
  },
  {
    q: 'How accurate are the resources and deadlines?',
    a: 'Listings are checked against official sources and carry a review date, but programs change. Always confirm a phone number, address or deadline on the organization\'s own website before you rely on it.',
  },
  {
    q: 'How does Ask Nexa work? Can I trust its answers?',
    a: 'Ask Nexa is an AI assistant that answers using this app\'s settlement data and your province. It is a fast starting point, not professional advice. For legal, medical, tax or immigration decisions, speak with a regulated professional or the official agency.',
  },
  {
    q: 'Why does the app ask for my location?',
    a: 'Location is used to show your province\'s services, local time, weather, transit and nearby help. You can browse by choosing a province manually, and your location is not shared with third parties.',
  },
  {
    q: 'Which languages are supported?',
    a: 'The interface is in English and can be translated with the language menu in the header. Ask Nexa can reply in many languages, including French, Arabic, Spanish, Mandarin, Tagalog, Urdu, Farsi and Somali.',
  },
  {
    q: 'I found a wrong phone number or expired program. How do I report it?',
    a: 'Use the report option on a service card, or email the site admin from the footer. Include the service name and what you found so it can be corrected quickly.',
  },
  {
    q: 'How is my personal information handled?',
    a: 'Your profile details, saved items and checklist stay with your account and are only visible to you. See the Privacy Policy for the full picture.',
  },
];

export default function Faq() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <HelpCircle className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold leading-tight text-foreground">Frequently Asked Questions</h1>
          <p className="text-sm text-muted-foreground">Short answers about how SettleSmart works.</p>
        </div>
      </div>

      <Accordion type="single" collapsible className="mt-6 rounded-2xl border border-border/50 bg-card px-5">
        {FAQS.map((item, i) => (
          <AccordionItem key={item.q} value={`faq-${i}`} className="border-border/50">
            <AccordionTrigger className="text-left text-sm font-semibold text-foreground hover:no-underline">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-[13px] leading-relaxed text-muted-foreground">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2.5">
          <MessageSquareHeart className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            Still stuck on something? Send your question to the site admin and it may be added here.
          </p>
        </div>
        <a
          href={FEEDBACK_HREF}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5"
        >
          <Mail className="h-3.5 w-3.5" />
          Email us
        </a>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Looking for official rules? Start with{' '}
        <Link to="/legal" className="font-semibold text-primary hover:underline">
          Legal &amp; IRCC
        </Link>{' '}
        or read the{' '}
        <Link to="/privacy" className="font-semibold text-primary hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}