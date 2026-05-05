import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Compass, Briefcase, BookOpen, AlertTriangle, Menu, X, ChevronLeft, User, MessageCircle, Newspaper, Scale, Search, Navigation, MapPin, CalendarDays, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import NewcomerChatWidget from '@/components/assistant/NewcomerChatWidget';
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

// Secondary items in hamburger menu
const secondaryNav = [
  { path: '/assistant', icon: MessageCircle, label: 'AI Assistant' },
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/checklist', icon: BookOpen, label: 'Checklist' },
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
          "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
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
  const activeTab = getActiveTab(location.pathname);
  const isRootTab = ALL_NAV_PATHS.includes(location.pathname);

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
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side: language + hamburger */}
          <div className="flex items-center gap-1">
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

        {/* Slide-down hamburger menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="border-t border-border/50 bg-card/95 backdrop-blur-xl p-3"
            >
              {/* Mobile: full nav tree */}
              <div className="md:hidden space-y-1">
                {primaryNav.map(item => {
                  const children = TAB_CHILDREN[item.path];
                  const isActive = activeTab === item.path;
                  return (
                    <div key={item.path}>
                      {children ? (
                        <>
                          <div className={cn("flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold",
                            isActive ? "text-primary" : "text-foreground")}>
                            <item.icon className="w-5 h-5" />
                            {item.label}
                          </div>
                          <div className="ml-9 space-y-0.5">
                            {children.map(child => (
                              <Link key={child.path} to={child.path} onClick={() => setMenuOpen(false)}
                                className={cn("flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                                  location.pathname === child.path ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
                                <child.icon className="w-4 h-4" />
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </>
                      ) : (
                        <Link to={item.path} onClick={() => setMenuOpen(false)}
                          className={cn("flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                            location.pathname === item.path ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
                          <item.icon className="w-5 h-5" />
                          {item.label}
                        </Link>
                      )}
                    </div>
                  );
                })}
                <div className="my-2 border-t border-border/40" />
                {secondaryNav.map(item => (
                  <Link key={item.path} to={item.path} onClick={() => setMenuOpen(false)}
                    className={cn("flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                      location.pathname === item.path ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Desktop: secondary nav only */}
              <div className="hidden md:flex gap-1 justify-end">
                {secondaryNav.map(item => (
                  <Link key={item.path} to={item.path} onClick={() => setMenuOpen(false)}
                    className={cn("flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
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

      {/* Mobile Bottom Nav — 5 primary tabs */}
      <MobileBottomNav activeTab={activeTab} location={location} />
    </div>
  );
}