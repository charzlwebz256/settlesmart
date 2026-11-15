import { Link } from 'react-router-dom';
import {
  Compass, BookOpen, Sparkles, Headphones, ArrowRight, Heart,
  GraduationCap, Bus, Clock, Scale, Newspaper, AlertTriangle, MapPin,
  ShoppingBag, Clapperboard, MessageCircle, Plug, Mail,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/AuthContext';

const LOGO = 'https://media.base44.com/images/public/69f2dbb716d886c9c4ab31fc/34a7de8f6_generated_image.png';

const COLUMNS = [
  {
    title: 'Explore',
    icon: Compass,
    tint: 'text-primary',
    dot: 'bg-primary',
    links: [
      { label: 'Healthcare', to: '/healthcare', icon: Heart },
      { label: 'Benefits', to: '/benefits', icon: Sparkles },
      { label: 'Settlement Services', to: '/services', icon: MapPin },
      { label: 'Scholarships', to: '/scholarships', icon: GraduationCap },
      { label: 'Job Search', to: '/jobs', icon: Compass },
      { label: 'Events', to: '/events', icon: BookOpen },
    ],
  },
  {
    title: 'Resources',
    icon: BookOpen,
    tint: 'text-sky-600 dark:text-sky-400',
    dot: 'bg-sky-500',
    links: [
      { label: 'Transit Map', to: '/transit-map', icon: Bus },
      { label: 'Time Zones', to: '/time-zones', icon: Clock },
      { label: 'Legal & IRCC', to: '/legal', icon: Scale },
      { label: 'News & Updates', to: '/news', icon: Newspaper },
      { label: 'Education', to: '/education', icon: GraduationCap },
      { label: 'Emergency Help', to: '/emergency', icon: AlertTriangle },
    ],
  },
  {
    title: 'SettleSmart',
    icon: Sparkles,
    tint: 'text-amber-600 dark:text-amber-400',
    dot: 'bg-amber-500',
    links: [
      { label: 'About Us', to: '/about', icon: Sparkles },
      { label: 'Ask Nexa', to: '/assistant', icon: MessageCircle },
      { label: 'Support Us', to: '/support-us', icon: Heart },
      { label: 'Meet the Developer', to: '/meet-the-developer', icon: BookOpen },
      { label: 'Privacy Policy', to: '/privacy', icon: Scale },
      { label: 'Contact', to: '/contact', icon: Mail },
    ],
  },
  {
    title: 'Everyday Life',
    icon: ShoppingBag,
    tint: 'text-rose-600 dark:text-rose-400',
    dot: 'bg-rose-500',
    links: [
      { label: 'ShopSmart', to: '/shop-smart', icon: ShoppingBag },
      { label: 'SmartPlay', to: '/smart-play', icon: Clapperboard },
      { label: 'Career Tools', to: '/work', icon: Sparkles },
      { label: 'Connect AI Assistants', to: '/connect', icon: Plug },
      { label: 'Volunteer', to: '/volunteer', icon: Heart },
      { label: 'Near Me', to: '/near-me', icon: MapPin },
    ],
  },
];

function FooterLink({ link }) {
  const Icon = link.icon;
  return (
    <li>
      <Link
        to={link.to}
        className="footer-link group inline-flex items-center gap-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        {Icon && <Icon className="w-3.5 h-3.5 text-primary/50 group-hover:text-primary transition-colors" />}
        <span>{link.label}</span>
      </Link>
    </li>
  );
}

export default function SiteFooter() {
  const { isAuthenticated } = useAuth();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-card mt-10">
      {/* animated colour band */}
      <div className="footer-banner h-16 md:h-20 w-full" role="presentation" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">
        <div className="grid gap-8 md:grid-cols-2 pb-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                <img src={LOGO} alt="SettleSmart logo" className="w-11 h-11 object-cover" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-lg leading-tight text-foreground">SettleSmart</h2>
                <p className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">Canada</p>
              </div>
            </Link>
            <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
              Practical, verified guidance for newcomers, healthcare, benefits, careers, transit
              and daily life across every province and territory.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to="/explore"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5"
              >
                <Compass className="w-3.5 h-3.5" /> Start exploring
              </Link>
              <Link
                to="/emergency"
                className="inline-flex items-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2 text-xs font-semibold text-destructive transition-transform hover:-translate-y-0.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" /> Emergency help
              </Link>
            </div>
          </div>

          <div className="md:justify-self-end md:text-left">
            <div className="flex items-center gap-2 mb-2">
              <Headphones className="w-4 h-4 text-primary" />
              <h3 className="font-heading font-bold text-sm">Newsletter</h3>
            </div>
            <p className="max-w-sm text-[13px] leading-relaxed text-muted-foreground">
              Settlement tips, deadlines and new resources, sent to your inbox.{" "}
              {isAuthenticated
                ? 'Manage your email updates from your profile.'
                : 'Free account required so we can reach you.'}
            </p>
            <Link
              to={isAuthenticated ? '/profile' : '/register'}
              className="group mt-3 inline-flex items-center gap-2 border-b border-primary pb-0.5 text-[13px] font-semibold text-primary transition-all hover:gap-3.5"
            >
              {isAuthenticated ? 'Manage email updates' : 'Sign up for updates'}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <nav className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-border/50" aria-label="Footer">
          {COLUMNS.map((col) => {
            const ColIcon = col.icon;
            return (
              <div key={col.title}>
                <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
                  <span className={cn('w-1.5 h-1.5 rounded-full', col.dot)} />
                  <ColIcon className={cn('w-3.5 h-3.5', col.tint)} />
                  {col.title}
                </h3>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <FooterLink key={link.label + link.to} link={link} />
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>

        <div className="mt-8 flex flex-col items-center gap-2 border-t border-border/50 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {year} SettleSmart Canada. Built on Base44.
          </p>
          <p className="text-[11px] text-muted-foreground/80">
            Information is for guidance only. Confirm details with the official source before you act.
          </p>
        </div>
      </div>
    </footer>
  );
}