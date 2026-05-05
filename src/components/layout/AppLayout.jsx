import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Search, Briefcase, BookOpen, AlertTriangle,
  Menu, X, ChevronLeft, User, MessageCircle,
  Navigation, MapPin, CalendarDays, Scale, Newspaper,
  Info, Mail
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import NewcomerChatWidget from '@/components/assistant/NewcomerChatWidget';
import LanguageTranslator from '@/components/layout/LanguageTranslator';

// 5 primary bottom tabs
const primaryTabs = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/explore', icon: Search, label: 'Explore' },
  { path: '/work', icon: Briefcase, label: 'Work' },
  { path: '/resources', icon: BookOpen, label: 'Resources' },
  { path: '/emergency', icon: AlertTriangle, label: 'Emergency' },
];

// "Explore" group paths (for active highlight)
const explorePaths = ['/', '/services', '/near-me', '/transit-map'];
const workPaths = ['/jobs', '/events'];
const resourcePaths = ['/legal', '/news'];

// All pages — used for isRootTab check
const ROOT_PATHS = [
  '/', '/services', '/near-me', '/transit-map', '/explore',
  '/jobs', '/events', '/work',
  '/legal', '/news', '/resources',
  '/emergency', '/assistant', '/profile',
  '/about', '/contact',
];

// Hamburger menu items
const menuItems = [
  { path: '/assistant', icon: MessageCircle, label: 'AI Help' },
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/about', icon: Info, label: 'About' },
  { path: '/contact', icon: Mail, label: 'Contact' },
];

// Desktop nav — all meaningful links
const desktopNavItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/services', icon: Search, label: 'Services' },
  { path: '/near-me', icon: MapPin, label: 'Near Me' },
  { path: '/transit-map', icon: Navigation, label: 'Transit' },
  { path: '/jobs', icon: Briefcase, label: 'Jobs' },
  { path: '/events', icon: CalendarDays, label: 'Events' },
  { path: '/legal', icon: Scale, label: 'Legal' },
  { path: '/news', icon: Newspaper, label: 'News' },
  { path: '/emergency', icon: AlertTriangle, label: 'Emergency' },
  { path: '/assistant', icon: MessageCircle, label: 'AI Help' },
  { path: '/profile', icon: User, label: 'Profile' },
];

function getTabActive(tabPath, currentPath) {
  if (tabPath === '/explore') return ['/services', '/near-me', '/transit-map'].includes(currentPath);
  if (tabPath === '/work') return ['/jobs', '/events'].includes(currentPath);
  if (tabPath === '/resources') return ['/legal', '/news'].includes(currentPath);
  return currentPath === tabPath;
}

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const isRootTab = ROOT_PATHS.includes(location.pathname);

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
              aria-label="Go back"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:opacity-70 transition-opacity min-w-[44px] min-h-[44px]"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
          ) : (
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center overflow-hidden">
                <img src="https://media.base44.com/images/public/69f2dbb716d886c9c4ab31fc/34a7de8f6_generated_image.png" alt="SettleSmart logo" className="w-7 h-7 object-contain" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-base leading-tight text-foreground">SettleSmart</h1>
                <p className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase">Canada</p>
              </div>
            </Link>
          )}

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 flex-wrap">
            {desktopNavItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
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
            {/* Hamburger — mobile & desktop secondary */}
            <button
              className="p-2 rounded-lg hover:bg-muted min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Hamburger Dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="border-t border-border/50 bg-card p-3 space-y-1"
            >
              {menuItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
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
              <div className="border-t border-border/30 pt-2 mt-1 flex gap-4 px-4 py-1">
                <Link to="/about" onClick={() => setMenuOpen(false)} className="text-xs text-muted-foreground hover:text-primary transition-colors">About</Link>
                <Link to="/contact" onClick={() => setMenuOpen(false)} className="text-xs text-muted-foreground hover:text-primary transition-colors">Contact</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main */}
      <main className="flex-1 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            className="overflow-x-hidden"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global AI Chat Widget */}
      {location.pathname !== '/assistant' && (
        <NewcomerChatWidget
          userCity={profile?.city}
          userProvince={profile?.province}
        />
      )}

      {/* Mobile Bottom Nav — 5 tabs */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border/50 safe-area-bottom select-none">
        <div className="flex items-center justify-around px-2 py-1">
          {primaryTabs.map(tab => {
            const active = getTabActive(tab.path, location.pathname);
            // Explore tab links to /services as the hub
            const href = tab.path === '/explore' ? '/services'
              : tab.path === '/work' ? '/jobs'
              : tab.path === '/resources' ? '/legal'
              : tab.path;
            return (
              <Link
                key={tab.path}
                to={href}
                aria-label={tab.label}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-[56px]",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <tab.icon className={cn("w-5 h-5", active && "stroke-[2.5]")} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}