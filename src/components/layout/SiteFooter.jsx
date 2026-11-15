import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, HelpCircle, MessageSquareHeart, ArrowRight, ArrowUp } from 'lucide-react';
import { FEEDBACK_URL } from '@/lib/gmailLink';

const LOGO = 'https://media.base44.com/images/public/69f2dbb716d886c9c4ab31fc/34a7de8f6_generated_image.png';

const FEEDBACK_HREF = FEEDBACK_URL;

const LEGAL_LINKS = [
  { label: 'Privacy Policy', to: '/privacy', icon: ShieldCheck },
  { label: 'Terms of Service', to: '/terms', icon: FileText },
  { label: 'Frequently Asked Questions', to: '/faq', icon: HelpCircle },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-card">
      {/* Thin animated brand band keeps the footer short */}
      <div className="footer-banner h-1 w-full" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-5">
        <div className="grid grid-cols-3 gap-3 sm:gap-6">
          {/* 1 — Brand + mission */}
          <div>
            <Link to="/" className="group inline-flex items-center gap-1.5 sm:gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg bg-primary shadow-sm transition-transform group-hover:scale-105 sm:h-10 sm:w-10 sm:rounded-xl">
                <img src={LOGO} alt="SettleSmart logo" className="h-7 w-7 object-cover sm:h-10 sm:w-10" />
              </div>
              <div>
                <p className="font-heading text-xs font-bold leading-tight text-foreground sm:text-base">SettleSmart</p>
                <p className="text-[8px] font-semibold uppercase tracking-widest text-muted-foreground sm:text-[10px]">Canada</p>
              </div>
            </Link>
            <p className="mt-2 max-w-xs text-[10px] leading-relaxed text-muted-foreground sm:mt-3 sm:text-[13px]">
              Helping newcomers settle in Canada with clear, verified guidance on healthcare,
              benefits, careers and everyday life, in one free place.
            </p>
          </div>

          {/* 2 — Legal & help */}
          <nav aria-label="Footer">
            <h3 className="text-[9px] font-bold uppercase tracking-wider text-foreground sm:text-[11px]">Trust &amp; Help</h3>
            <ul className="mt-2 space-y-1.5 sm:mt-3 sm:space-y-2">
              {LEGAL_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="footer-link group relative inline-flex items-start gap-1 text-[10px] font-medium leading-tight text-muted-foreground transition-colors hover:text-foreground sm:items-center sm:gap-2 sm:text-[13px]"
                    >
                      <Icon className="mt-px h-3 w-3 flex-shrink-0 text-primary/60 transition-colors group-hover:text-primary sm:mt-0 sm:h-3.5 sm:w-3.5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* 3 — Share feedback */}
          <div>
            <h3 className="text-[9px] font-bold uppercase tracking-wider text-foreground sm:text-[11px]">Share Feedback</h3>
            <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground sm:mt-3 sm:text-[13px]">
              Got an idea, suggestion, or something we could do better? We'd love to hear from you! Write
              directly to our site administrator and help us make SettleSmart better for everyone.
            </p>
            <a
              href={FEEDBACK_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-2 inline-flex max-w-full items-center gap-1 rounded-lg bg-primary px-2 py-1.5 text-[10px] font-bold text-primary-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 active:translate-y-0 sm:mt-3 sm:gap-2 sm:rounded-xl sm:px-3.5 sm:py-2 sm:text-xs"
            >
              <MessageSquareHeart className="hidden h-4 w-4 flex-shrink-0 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 sm:block" />
              Send an email
              <ArrowRight className="h-3 w-3 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1 sm:h-3.5 sm:w-3.5" />
            </a>
          </div>
        </div>

        <div className="relative mt-5 flex flex-col items-center gap-2 border-t border-border/50 pt-4 text-center">
          <p className="text-xs text-muted-foreground">&copy; {year} SettleSmart Canada</p>
          <p className="text-[11px] leading-relaxed text-muted-foreground/80">
            Guidance only. Always confirm details with the official source before acting.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            title="Back to top"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary sm:absolute sm:right-0 sm:top-4"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}