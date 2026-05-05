import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Search, Briefcase, BookOpen, AlertTriangle,
  Menu, X, ChevronLeft, User, MessageCircle,
  Navigation, MapPin, CalendarDays, Scale, Newspaper,
  Info, Mail, GraduationCap, Heart
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import NewcomerChatWidget from '@/components/assistant/NewcomerChatWidget';
import LanguageTranslator from '@/components/layout/LanguageTranslator';

// Popup menus for specific tabs
const explorePopup = [
  { path: '/services', icon: Search, label: 'Services' },
  { path: '/events', icon: CalendarDays, label: 'Events' },
  { path: '/volunteer', icon: Heart, label: 'Volunteer & Support' },
];

const resourcesPopup = [
  { path: '/news', icon: Newspaper, label: 'News' },
  { path: '/jobs', icon: Briefcase, label: 'Jobs' },
  { path: '/education', icon: GraduationCap, label: 'Education' },
];

// 5 primary bottom tabs
const primaryTabs = [
  { path: '/', icon: Home, label: 'Home', popup: null },
  { path: '/explore', icon: Search, label: 'Explore', popup: explorePopup },
  { path: '/work', icon: Briefcase, label: 'Work', popup: null },
  { path: '/resources', icon: BookOpen, label: 'Resources', popup: resourcesPopup },
  { path: '/emergency', icon: AlertTriangle, label: 'Emergency', popup: null },
];

// All pages — used for isRootTab check
const ROOT_PATHS = [
  '/', '/services', '/near-me', '/transit-map', '/explore',
  '/jobs', '/events', '/work',
  '/legal', '/news', '/resources', '/education', '/volunteer',
  '/emergency', '/assistant', '/profile',
  '/about', '/contact', '/privacy',
];

// Hamburger menu items
const menuItems = [
  { path: '/assistant', icon: MessageCircle, label: 'AI Help' },
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/about', icon: Info, label: 'About' },
  { path: '/contact', icon: Mail, label: 'Contact' },
  { path: '/privacy', icon: Scale, label: 'Privacy Policy' },
];

// Desktop nav — mirrors the 5 primary tabs
const desktopNavItems = [
  { path: '/', icon: Home, label: 'Home', popup: null },
  { path: '/explore', icon: Search, label: 'Explore', popup: explorePopup },
  { path: '/work', icon: Briefcase, label: 'Work', popup: null },
  { path: '/resources', icon: BookOpen, label: 'Resources', popup: resourcesPopup },
  { path: '/emergency', icon: AlertTriangle, label: 'Emergency', popup: null },
];

function getTabActive(tabPath, currentPath) {
  if (tabPath === '/explore') return ['/services', '/near-me', '/transit-map', '/events', '/volunteer'].includes(currentPath);
  if (tabPath === '/work') return ['/jobs', '/work'].includes(currentPath);
  if (tabPath === '/resources') return ['/legal', '/news', '/resources', '/education'].includes(currentPath);
  return currentPath === tabPath;
}

function TabPopup({ items, onClose, align = 'center' }) {
  const posClass = align === 'right'
    ? 'right-0'
    : align === 'left'
    ? 'left-0'
    : 'left-1/2 -translate-x-1/2';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className={`absolute bottom-full mb-2 ${posClass} bg-card border border-border rounded-2xl shadow-xl p-2 min-w-[170px] z-[200]`}
    >
      {items.map(item => (
        <Link
          key={item.path}
          to={item.path}
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all whitespace-nowrap"
        >
          <item.icon className="w-4 h-4 text-primary" />
          {item.label}
        </Link>
      ))}
    </motion.div>
  );
}

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openPopup, setOpenPopup] = useState(null); // tab path
  const isRootTab = ROOT_PATHS.includes(location.pathname);

  // Close popup on route change
  useEffect(() => { setOpenPopup(null); }, [location.pathname]);

  const { data: profile } = useQuery({
    queryKey: ['myProfile'],
    queryFn: async () => {
      const user = await base44.auth.me();
      const results = await base44.entities.UserProfile.filter({ created_by: user.email });
      return results[0] || null;
    },
  });

  const handleTabPress = (tab) => {
    if (tab.popup) {
      setOpenPopup(prev => prev === tab.path ? null : tab.path);
    } else {
      setOpenPopup(null);
      navigate(tab.path);
    }
  };

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

          {/* Desktop Nav — mirrors mobile 5 tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {desktopNavItems.map(tab => {
              const active = getTabActive(tab.path, location.pathname) || openPopup === tab.path;
              return (
                <div key={tab.path} className="relative">
                  <AnimatePresence>
                    {openPopup === tab.path && tab.popup && (
                      <TabPopup
                        items={tab.popup}
                        onClose={() => setOpenPopup(null)}
                        align={tab.path === '/resources' ? 'right' : 'center'}
                      />
                    )}
                  </AnimatePresence>
                  <button
                    onClick={() => {
                      if (tab.popup) {
                        setOpenPopup(prev => prev === tab.path ? null : tab.path);
                      } else {
                        setOpenPopup(null);
                        navigate(tab.path);
                      }
                    }}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                </div>
              );
            })}
          </nav>

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
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main */}
      <main className="flex-1 overflow-x-hidden" onClick={() => setOpenPopup(null)}>
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

      {/* Mobile Bottom Nav — 5 tabs with popups */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border/50 safe-area-bottom select-none">
        <div className="flex items-center justify-around px-2 py-1">
          {primaryTabs.map(tab => {
            const active = getTabActive(tab.path, location.pathname) || openPopup === tab.path;
            return (
              <div key={tab.path} className="relative">
                <AnimatePresence>
                  {openPopup === tab.path && tab.popup && (
                    <TabPopup
                      items={tab.popup}
                      onClose={() => setOpenPopup(null)}
                      align={tab.path === '/resources' ? 'right' : tab.path === '/explore' ? 'left' : 'center'}
                    />
                  )}
                </AnimatePresence>
                <button
                  onClick={() => handleTabPress(tab)}
                  aria-label={tab.label}
                  className={cn(
                    "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-[56px]",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <tab.icon className={cn("w-5 h-5", active && "stroke-[2.5]")} />
                  <span className="text-[10px] font-medium">{tab.label}</span>
                </button>
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
}