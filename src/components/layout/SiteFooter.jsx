import { Link } from 'react-router-dom';
import { Mail, ShieldCheck, FileText, HelpCircle, MessageSquareHeart, ArrowUpRight } from 'lucide-react';

const LOGO = 'https://media.base44.com/images/public/69f2dbb716d886c9c4ab31fc/34a7de8f6_generated_image.png';

const FEEDBACK_EMAIL = 'charzlwebz256@gmail.com';
const FEEDBACK_HREF = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(
  'SettleSmart feedback'
)}&body=${encodeURIComponent('What I was doing:\n\nWhat was wrong or what could be better:\n\n')}`;

const LEGAL_LINKS = [
  { label: 'Privacy Policy', to: '/privacy', icon: ShieldCheck },
  { label: 'Terms of Service', to: '/terms', icon: FileText },
  { label: 'Frequently Asked Questions', to: '/faq', icon: HelpCircle },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-border/50 bg-card">
      {/* Thin animated brand band keeps the footer short */}
      <div className="footer-banner h-1 w-full" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-5 py-7">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* 1 — Brand + mission */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center overflow-hidden shadow-sm transition-transform group-hover:scale-105">
                <img src={LOGO} alt="SettleSmart logo" className="w-10 h-10 object-cover" />
              </div>
              <div>
                <p className="font-heading font-bold text-base leading-tight text-foreground">SettleSmart</p>
                <p className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">Canada</p>
              </div>
            </Link>
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
              Helping newcomers settle in Canada with clear, verified guidance on healthcare,
              benefits, careers and everyday life, in one free place.
            </p>
          </div>

          {/* 2 — Legal & help */}
          <nav aria-label="Footer">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-foreground">Trust &amp; Help</h3>
            <ul className="mt-3 space-y-2">
              {LEGAL_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="footer-link group relative inline-flex items-center gap-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Icon className="w-3.5 h-3.5 text-primary/60 transition-colors group-hover:text-primary" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* 3 — Share feedback */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-foreground">Share Feedback</h3>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              Outdated phone number, wrong deadline, or an idea that would help you settle faster? Write
              to the site admin.
            </p>
            <a
              href={FEEDBACK_HREF}
              className="group mt-3 inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5"
            >
              <MessageSquareHeart className="w-3.5 h-3.5" />
              Send an email
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Mail className="w-3 h-3 text-primary/60" />
              {FEEDBACK_EMAIL}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-1 border-t border-border/50 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">&copy; {year} SettleSmart Canada</p>
          <p className="text-[11px] text-muted-foreground/80">
            Guidance only. Always confirm details with the official source.
          </p>
        </div>
      </div>
    </footer>
  );
}