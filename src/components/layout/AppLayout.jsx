import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Home, Compass, Briefcase, BookOpen, AlertTriangle, Menu, X, ChevronLeft, User, MessageCircle, Newspaper, Scale, Search, ShoppingBag, MapPin, ChevronDown, Moon, Sun, Heart, Info, GraduationCap, Wallet, LogIn, LogOut, Plug, Bus, Clock, Clapperboard, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import SiteFooter from '@/components/layout/SiteFooter';
import { useLocation_ } from '@/lib/LocationContext';

import LanguageTranslator from '@/components/layout/LanguageTranslator';
import GlobalSearch from '@/components/search/GlobalSearch';

// Sub-items for tabs with dropdowns
const TAB_CHILDREN = {
  '/explore': [
    { path: '/healthcare', icon: Heart, label: 'Healthcare' },
    { path: '/benefits', icon: Wallet, label: 'Benefits' },
    { path: '/services', icon: Search, label: 'Settlement Services' },
    { path: '/near-me', icon: MapPin, label: 'Near Me' },
    { path: '/scholarships', icon: GraduationCap, label: 'Scholarships' },
    { path: '/jobs', icon: Briefcase, label: 'Job Search' },
    { path: '/work', icon: Sparkles, label: 'Career Tools' },
  ],
  '/work': [
    { path: '/shop-smart', icon: ShoppingBag, label: 'ShopSmart' },
    { path: '/smart-play', icon: Clapperboard, label: 'SmartPlay' },
  ],
  '/resources': [
    { path: '/transit-map', icon: Bus, label: 'Transit Map' },
    { path: '/time-zones', icon: Clock, label: 'Time Zones' },
    { path: '/legal', icon: Scale, label: 'Legal & IRCC' },
    { path: '/news', icon: Newspaper, label: 'News & Updates' },
  ],
};

// Primary 5 tabs
const primaryNav = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/explore', icon: Compass, label: 'Explore' },
  { path: '/work', icon: Sparkles, label: 'SmartLife' },
  { path: '/resources', icon: BookOpen, label: 'Resources' },
  { path: '/emergency', icon: AlertTriangle, label: 'Emergency' },
];

// Secondary items in hamburger menu (no duplicates with primary nav)
const secondaryNav = [
  { path: '/assistant', icon: MessageCircle, label: 'Ask Nexa' },
  { path: '/checklist', icon: BookOpen, label: 'Checklist' },
  { path: '/profile', icon: User, label: 'My Profile' },
  { path: '/support-us', icon: Heart, label: 'Support Us' },
  { path: '/meet-the-developer', icon: Info, label: 'Meet the Developer' },
  { path: '/connect', icon: Plug, label: 'Connect AI Assistants' },
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

// Desktop tab button. The menu itself is shared, so every dropdown opens in the
// same place instead of jumping around with the tab it belongs to.
function NavTab({ item, isActive, isOpen, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-expanded={isOpen}
      className={cn(
        "nav-pulse-btn flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
        isActive || isOpen ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
    >
      <item.icon className="w-4 h-4" />
      {item.label}
      <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", isOpen && "rotate-180")} />
    </button>
  );
}

// The single dropdown panel: fixed anchor under the nav, three columns, clipped
// to the viewport so it can never push the page sideways.
function NavPanel({ path, onClose }) {
  const children = TAB_CHILDREN[path] || [];
  return (
    <motion.div
      initial={{ opacity: 0, y: -4, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: -4, x: '-50%' }}
      transition={{ duration: 0.12 }}
      className="absolute left-1/2 top-full z-50 mt-1.5 grid w-max max-w-[calc(100vw-2rem)] grid-cols-3 gap-1 overflow-hidden rounded-xl border border-border/60 bg-card p-1.5 shadow-lg"
    >
      {children.map(child => (
        <Link
          key={child.path}
          to={child.path}
          onClick={onClose}
          className="flex items-center gap-2 overflow-hidden rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <child.icon className="w-4 h-4 flex-shrink-0 text-primary/60" />
          <span className="truncate">{child.label}</span>
        </Link>
      ))}
    </motion.div>
  );
}

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [navMenu, setNavMenu] = useState(null);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const menuRef = useRef(null);
  const navRef = useRef(null);
  const { city: detectedCity, province: detectedProvince } = useLocation_();
  const { user, isAuthenticated, logout, navigateToLogin } = useAuth();
  const activeTab = getActiveTab(location.pathname);
  const ROOT_TABS = ['/', '/explore', '/work', '/resources', '/emergency'];
  const isRootTab = ROOT_TABS.includes(location.pathname);

  // Scroll to top on every route change; any open dropdown closes with the page
  useEffect(() => {
    window.scrollTo(0, 0);
    setNavMenu(null);
  }, [location.pathname]);

  // Close the nav dropdown on an outside click
  useEffect(() => {
    if (!navMenu) return;
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setNavMenu(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [navMenu]);

  // Open global search with Cmd/Ctrl + K
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

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
      try {
        const user = await base44.auth.me();
        const results = await base44.entities.UserProfile.filter({ created_by_id: user.id }, '-updated_date');
        if (!results || results.length === 0) return null;
        // Prefer the completed onboarding profile (your original saved info);
        // fall back to the most recently updated record.
        return results.find(p => p.onboarding_completed) || results[0];
      } catch {
        return null;
      }
    },
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header ref={menuRef} className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50 safe-top select-none overflow-x-clip">
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
          <nav ref={navRef} className="relative hidden md:flex min-w-0 items-center gap-1 [&_a]:whitespace-nowrap [&_button]:whitespace-nowrap">
            {primaryNav.map(item => {
              const hasChildren = !!TAB_CHILDREN[item.path];
              const isActive = activeTab === item.path;
              if (hasChildren) {
                return (
                  <NavTab
                    key={item.path}
                    item={item}
                    isActive={isActive}
                    isOpen={navMenu === item.path}
                    onToggle={() => setNavMenu(prev => (prev === item.path ? null : item.path))}
                  />
                );
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
            <AnimatePresence>
              {navMenu && <NavPanel key={navMenu} path={navMenu} onClose={() => setNavMenu(null)} />}
            </AnimatePresence>
          </nav>

          {/* Right side: search + theme + language + hamburger */}
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

              {/* Sign in / Sign out */}
              <div className="border-t border-border/40 pt-1.5 mt-1">
                {isAuthenticated ? (
                  <button
                    onClick={() => { setMenuOpen(false); logout(false); navigate('/'); }}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                ) : (
                  <button
                    onClick={() => { setMenuOpen(false); navigateToLogin(); }}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium text-primary hover:bg-primary/10 transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    Log In
                  </button>
                )}
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

      {/* Site footer */}
      <div className="pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
        <SiteFooter />
      </div>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav activeTab={activeTab} location={location} />

      {/* Global Search */}
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />

    </div>
  );
}