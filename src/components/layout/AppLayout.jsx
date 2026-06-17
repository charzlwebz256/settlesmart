import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Home, Compass, Briefcase, BookOpen, AlertTriangle, Menu, X, ChevronLeft, User, MessageCircle, Newspaper, Scale, Search, Navigation, MapPin, CalendarDays, ChevronDown, Moon, Sun, Heart, Info } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import NewcomerChatWidget from '@/components/assistant/NewcomerChatWidget';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { useLocation_ } from '@/lib/LocationContext';

import LanguageTranslator from '@/components/layout/LanguageTranslator';

// Sub-items for tabs with dropdowns
const TAB_CHILDREN = {
  '/explore': [
    { path: '/services', icon: Search, label: 'Settlement Services' },
    { path: '/near-me', icon: MapPin, label: 'Near Me' },
    { path: '/transit-map', icon: Navigation, label: 'Transit Map' },
  ],
  '/work': [
    { path: '/jobs', icon: Briefcase, label: 'Job Search' },
    { path: '/events', icon: CalendarDays, label: 'Events' },
  ],
  '/resources': [
    { path: '/legal', icon: Scale, label: 'Legal & IRCC' },
    { path: '/news', icon: Newspaper, label: 'News & Updates' },
  ],
};

// Primary 5 tabs
const primaryNav = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/explore', icon: Compass, label: 'Explore' },
  { path: '/work', icon: Briefcase, label: 'Work' },
  { path: '/resources', icon: BookOpen, label: 'Resources' },
  { path: '/emergency', icon: AlertTriangle, label: 'Emergency' },
];

// Secondary items in hamburger menu (no duplicates with primary nav)
const secondaryNav = [
  { path: '/assistant', icon: MessageCircle, label: 'AI Assistant' },
  { path: '/checklist', icon: BookOpen, label: 'Checklist' },
  { path: '/events', icon: CalendarDays, label: 'Community Events' },
  { path: '/profile', icon: User, label: 'My Profile' },
  { path: '/support-us', icon: Heart, label: 'Support Us' },
  { path: '/meet-the-developer', icon: Info, label: 'Meet the Developer' },
  { path: '/about', icon: Info, label: 'About SettleSmart' },
];

const ALL_NAV_PATHS = [
  ...primaryNav.map(i => i.path),
  ...Object.values(TAB_CHILDREN).flat().map(i => i.path),
  ...secondaryNav.map(i => i.path),
];

// Which tab is "active" including its children
function getActiveTab(pathname) {
  for (const [tabPath, children] of Object.entries(TAB_CHILDREN)) {
    if (children.some(c => c.path === pathname)) return tabPath;
  }
  return pathname;
}

// Desktop dropdown for a tab with children
function TabDropdown({ item, isActive }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const children = TAB_CHILDREN[item.path];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          "nav-pulse-btn flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
          isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        <item.icon className="w-4 h-4" />
        {item.label}
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute top-full left-0 mt-1.5 w-48 bg-card border border-border/60 rounded-xl shadow-lg overflow-hidden z-50"
          >
            {children.map(child => (
              <Link
                key={child.path}
                to={child.path}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <child.icon className="w-4 h-4 text-primary/60" />
                {child.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const menuRef = useRef(null);
  const { city: detectedCity, province: detectedProvince } = useLocation_();
  const activeTab = getActiveTab(location.pathname);
  const ROOT_TABS = ['/', '/explore', '/work', '/resources', '/emergency'];
  const isRootTab = ROOT_TABS.includes(location.pathname);

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [menuOpen]);

  const toggleTheme = () => {
    const html = document.documentElement;
    html.classList.toggle('dark');
    setIsDark(!isDark);
  };

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
      <header ref={menuRef} className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50 safe-top select-none">
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
                <img src="https://media.base44.com/images/public/69f2dbb716d886c9c4ab31fc/34a7de8f6_generated_image.png" alt="SettleSmart logo" className="w-9 h-9 object-cover" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-base leading-tight text-foreground">SettleSmart</h1>
                <p className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase">Canada</p>
              </div>
            </Link>
          )}

          {/* Desktop + Mobile Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {primaryNav.map(item => {
              const hasChildren = !!TAB_CHILDREN[item.path];
              const isActive = activeTab === item.path;
              if (hasChildren) {
                return <TabDropdown key={item.path} item={item} isActive={isActive} />;
              }
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "nav-pulse-btn flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side: theme + language + hamburger */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <LanguageTranslator />
            <button
              className="p-2 rounded-lg hover:bg-muted min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Slide-in right side menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.18 }}
              className="absolute top-full right-0 w-72 border border-border/50 rounded-bl-2xl bg-card/95 backdrop-blur-xl shadow-xl p-3 z-50"
            >
              {/* Mobile only: full primary nav tree. Desktop: only Emergency (others are in the top nav) */}
              <div className="space-y-0.5">
                {primaryNav.map(item => {
                  const children = TAB_CHILDREN[item.path];
                  const isActive = activeTab === item.path;
                  // Hide on desktop (top nav) AND on mobile (bottom nav handles these)
                  const isDesktopOnly = ['/', '/explore', '/work', '/resources', '/emergency'].includes(item.path);
                  return (
                    <div key={item.path} className={isDesktopOnly ? 'hidden' : ''}>
                      {children ? (
                        <>
                          <div className={cn("flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-semibold",
                            isActive ? "text-primary" : "text-foreground")}>
                            <item.icon className="w-4 h-4" />
                            {item.label}
                          </div>
                          <div className="ml-8 space-y-0.5">
                            {children.map(child => (
                              <Link key={child.path} to={child.path} onClick={() => setMenuOpen(false)}
                                className={cn("flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                                  location.pathname === child.path ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
                                <child.icon className="w-4 h-4" />
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </>
                      ) : (
                        <Link to={item.path} onClick={() => setMenuOpen(false)}
                          className={cn("flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                            location.pathname === item.path ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Secondary nav */}
              <div className="border-t border-border/40 pt-1.5 mt-1 space-y-0.5">
                {secondaryNav.map(item => (
                  <Link key={item.path} to={item.path} onClick={() => setMenuOpen(false)}
                    className={cn("flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                      location.pathname === item.path ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main */}
      <main className="flex-1 overflow-x-hidden md:pb-0 pb-[calc(5rem+env(safe-area-inset-bottom))]">
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

      {/* Mobile Bottom Nav */}
      <MobileBottomNav activeTab={activeTab} location={location} />

      {/* Global AI Chat Widget */}
      {location.pathname !== '/assistant' && (
        <NewcomerChatWidget
          userCity={profile?.city || detectedCity}
          userProvince={profile?.province || detectedProvince}
        />
      )}
    </div>
  );
}