import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, MessageCircle, User, Navigation, Menu, X, CalendarDays, Briefcase, Scale, AlertTriangle, MapPin, Newspaper, ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import NewcomerChatWidget from '@/components/assistant/NewcomerChatWidget';
import LanguageTranslator from '@/components/layout/LanguageTranslator';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/services', icon: Search, label: 'Services' },
  { path: '/events', icon: CalendarDays, label: 'Events' },
  { path: '/transit-map', icon: Navigation, label: 'Transit' },
  { path: '/jobs', icon: Briefcase, label: 'Jobs' },
  { path: '/near-me', icon: MapPin, label: 'Near Me' },
  { path: '/legal', icon: Scale, label: 'Legal' },
  { path: '/news', icon: Newspaper, label: 'News' },
  { path: '/emergency', icon: AlertTriangle, label: 'Emergency' },
  { path: '/assistant', icon: MessageCircle, label: 'AI Help' },
  { path: '/profile', icon: User, label: 'Profile' },
];

const ROOT_TABS = navItems.map(i => i.path);

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isRootTab = ROOT_TABS.includes(location.pathname);

  const { data: profile } = useQuery({
    queryKey: ['myProfile'],
    queryFn: async () => {
      const user = await base44.auth.me();
      const results = await base44.entities.UserProfile.filter({ created_by: user.email });
      return results[0] || null;
    },
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50 safe-top select-none">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {!isRootTab ? (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-sm font-medium text-primary hover:opacity-70 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
          ) : (
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-heading font-bold text-sm">SS</span>
            </div>
            <div>
              <h1 className="font-heading font-bold text-base leading-tight text-foreground">SettleSmart</h1>
              <p className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase">Canada</p>
            </div>
          </Link>
          )}

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <LanguageTranslator />
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-card p-3 space-y-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Global AI Chat Widget — hidden on /assistant page */}
      {location.pathname !== '/assistant' && (
        <NewcomerChatWidget
          userCity={profile?.city}
          userProvince={profile?.province}
        />
      )}

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border/50 safe-area-bottom select-none">
        <div className="flex items-center justify-around px-2 py-1">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-[56px]",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", active && "stroke-[2.5]")} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}