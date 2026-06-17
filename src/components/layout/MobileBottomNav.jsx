import { Link, useNavigate } from 'react-router-dom';
import { Home, Compass, Briefcase, BookOpen, AlertTriangle, Search, MapPin, Navigation, CalendarDays, Scale, Newspaper, ChevronUp } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Pulse animation style injected once
const PULSE_STYLE = `
@keyframes nav-pulse {
  0% { box-shadow: 0 0 0 0 hsl(var(--primary) / 0.45); }
  70% { box-shadow: 0 0 0 8px hsl(var(--primary) / 0); }
  100% { box-shadow: 0 0 0 0 hsl(var(--primary) / 0); }
}
.nav-pulse-btn:active, .nav-pulse-btn:focus-visible {
  animation: nav-pulse 0.5s ease-out forwards;
}
`;

// Persist the last visited sub-path per primary tab across renders
const tabHistory = new Map();

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

const primaryNav = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/explore', icon: Compass, label: 'Explore' },
  { path: '/work', icon: Briefcase, label: 'Work' },
  { path: '/resources', icon: BookOpen, label: 'Resources' },
  { path: '/emergency', icon: AlertTriangle, label: 'Emergency' },
];

// Store scroll positions per route
const scrollPositions = new Map();

export default function MobileBottomNav({ activeTab, location }) {
  const [openMenu, setOpenMenu] = useState(null); // which tab's submenu is open
  const navigate = useNavigate();
  const ref = useRef(null);

  // Save scroll position when leaving a route
  useEffect(() => {
    return () => {
      const mainScroll = document.querySelector('main');
      if (mainScroll) {
        scrollPositions.set(location.pathname, mainScroll.scrollTop);
      }
    };
  }, [location.pathname]);

  // Close on outside tap
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpenMenu(null);
    };
    document.addEventListener('touchstart', handler);
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('touchstart', handler);
      document.removeEventListener('mousedown', handler);
    };
  }, []);

  // Track last visited sub-path for each tab
  useEffect(() => {
    // Record current path as last visited for its parent tab
    for (const [tabPath, children] of Object.entries(TAB_CHILDREN)) {
      if (children.some(c => c.path === location.pathname)) {
        tabHistory.set(tabPath, location.pathname);
        return;
      }
    }
    // For top-level tabs, record the path itself
    if (primaryNav.some(n => n.path === location.pathname)) {
      tabHistory.set(location.pathname, location.pathname);
    }
  }, [location.pathname]);

  // Close submenu on route change
  useEffect(() => { setOpenMenu(null); }, [location.pathname]);

  const handleTabPress = (item) => {
    const children = TAB_CHILDREN[item.path];
    if (children) {
      if (activeTab === item.path && openMenu === item.path) {
        // Second tap while submenu open: go to root
        setOpenMenu(null);
        navigate(item.path);
      } else if (activeTab !== item.path) {
        // Switching to a new tab: restore last sub-page if available
        const lastPath = tabHistory.get(item.path);
        if (lastPath && lastPath !== item.path) {
          setOpenMenu(null);
          navigate(lastPath);
        } else {
          setOpenMenu(prev => prev === item.path ? null : item.path);
        }
      } else {
        setOpenMenu(prev => prev === item.path ? null : item.path);
      }
    } else {
      setOpenMenu(null);
      navigate(item.path);
      setTimeout(() => {
        const mainScroll = document.querySelector('main');
        const savedScroll = scrollPositions.get(item.path);
        if (mainScroll && savedScroll !== undefined) {
          mainScroll.scrollTop = savedScroll;
        }
      }, 0);
    }
  };

  return (
    <div ref={ref} className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-bottom select-none">
      <style>{PULSE_STYLE}</style>
      {/* Sub-menu popup */}
      <AnimatePresence>
        {openMenu && TAB_CHILDREN[openMenu] && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="bg-card/95 backdrop-blur-xl border-t border-border/50 px-3 py-2 flex gap-2 justify-center"
          >
            {TAB_CHILDREN[openMenu].map(child => {
              const isActive = location.pathname === child.path;
              return (
                <Link
                  key={child.path}
                  to={child.path}
                  onClick={() => setOpenMenu(null)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all border",
                    isActive
                      ? "bg-primary/10 text-primary border-primary/30"
                      : "bg-muted text-muted-foreground border-border/50 hover:text-foreground"
                  )}
                >
                  <child.icon className="w-3.5 h-3.5" />
                  <span>{child.label}</span>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom tab bar */}
      <nav className="bg-card/90 backdrop-blur-xl border-t border-border/50">
        <div className="flex items-center justify-around px-2 py-1">
          {primaryNav.map(item => {
            const active = activeTab === item.path;
            const hasChildren = !!TAB_CHILDREN[item.path];
            const isMenuOpen = openMenu === item.path;

            return (
              <button
                key={item.path}
                onClick={() => handleTabPress(item)}
                aria-label={item.label}
                className={cn(
                  "nav-pulse-btn flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-[56px] relative",
                  active || isMenuOpen ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", (active || isMenuOpen) && "stroke-[2.5]")} />
                <span className="text-[10px] font-medium">{item.label}</span>
                {hasChildren && (
                  <ChevronUp className={cn(
                    "absolute -top-0.5 right-0.5 w-2.5 h-2.5 transition-transform",
                    isMenuOpen ? "rotate-0 text-primary" : "rotate-180 text-muted-foreground/40"
                  )} />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}