import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CornerDownLeft, Sparkles, Home, Briefcase, CalendarDays, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const CATEGORY_META = {
  quick: { label: 'Quick Tools', icon: Sparkles },
  settle: { label: 'Settlement & Services', icon: Home },
  career: { label: 'Career & Jobs', icon: Briefcase },
  community: { label: 'Community & Events', icon: CalendarDays },
  info: { label: 'Info & Support', icon: Info },
};

const CATALOG = [
  { path: '/dashboard', label: 'Dashboard', category: 'quick', keywords: 'home overview progress summary my day start' },
  { path: '/checklist', label: '90-Day Checklist', category: 'quick', keywords: 'checklist tasks to do steps first days 90 days roadmap' },
  { path: '/assistant', label: 'AI Assistant', category: 'quick', keywords: 'ask chat help questions ai assistant support guidance' },
  { path: '/profile', label: 'My Profile', category: 'quick', keywords: 'profile account settings preferences language interests' },
  { path: '/services', label: 'Settlement Services', category: 'settle', keywords: 'services settlement language classes housing help organizations free newcomer' },
  { path: '/near-me', label: 'Near Me', category: 'settle', keywords: 'nearby near close around me map location services places' },
  { path: '/legal', label: 'Legal & IRCC', category: 'settle', keywords: 'legal ircc immigration law citizenship refugee status documents lawyer' },
  { path: '/education', label: 'Education', category: 'settle', keywords: 'education school university college study credentials assessment degree' },
  { path: '/transit-map', label: 'Transit Map', category: 'settle', keywords: 'transit bus map transportation public transit commute' },
  { path: '/scholarships', label: 'Scholarships', category: 'settle', keywords: 'scholarships funding financial aid grants education money awards bursaries' },
  { path: '/jobs', label: 'Job Search', category: 'career', keywords: 'jobs job search employment hiring careers work find jobs' },
  { path: '/resume-builder', label: 'Resume Builder', category: 'career', keywords: 'resume cv cover letter job application create resume' },
  { path: '/job-tracker', label: 'Job Tracker', category: 'career', keywords: 'track applications job tracker follow up applied status' },
  { path: '/interview-prep', label: 'Interview Prep', category: 'career', keywords: 'interview preparation practice questions job interview' },
  { path: '/job-coach', label: 'AI Job Coach', category: 'career', keywords: 'job coach career advice ai coach mentor' },
  { path: '/work', label: 'Work Hub', category: 'career', keywords: 'work employment career jobs hub' },
  { path: '/events', label: 'Community Events', category: 'community', keywords: 'events community workshops calendar gatherings meetings sessions' },
  { path: '/volunteer', label: 'Volunteer', category: 'community', keywords: 'volunteer community service give back opportunities' },
  { path: '/shop-smart', label: 'ShopSmart', category: 'community', keywords: 'shopping prices deals compare groceries budget savings' },
  { path: '/explore', label: 'Explore', category: 'info', keywords: 'explore browse discover find everything all' },
  { path: '/resources', label: 'Resources', category: 'info', keywords: 'resources guides information help articles' },
  { path: '/news', label: 'News & Updates', category: 'info', keywords: 'news updates announcements canada immigration news' },
  { path: '/emergency', label: 'Emergency', category: 'info', keywords: 'emergency 911 crisis urgent police ambulance fire' },
  { path: '/about', label: 'About SettleSmart', category: 'info', keywords: 'about mission what is settlesmart' },
  { path: '/contact', label: 'Contact', category: 'info', keywords: 'contact reach support help email message' },
  { path: '/support-us', label: 'Support Us', category: 'info', keywords: 'support donate contribute help fund' },
  { path: '/privacy', label: 'Privacy Policy', category: 'info', keywords: 'privacy data policy personal information' },
  { path: '/meet-the-developer', label: 'Meet the Developer', category: 'info', keywords: 'developer creator who made about author' },
];

export default function GlobalSearch({ open, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && open) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATALOG;
    return CATALOG.filter(item =>
      item.label.toLowerCase().includes(q) ||
      item.keywords.toLowerCase().includes(q) ||
      CATEGORY_META[item.category].label.toLowerCase().includes(q)
    );
  }, [query]);

  const rendered = useMemo(() => {
    const out = [];
    let lastCat = null;
    results.forEach((item, idx) => {
      if (item.category !== lastCat) {
        out.push({ type: 'header', cat: item.category });
        lastCat = item.category;
      }
      out.push({ type: 'item', item, idx });
    });
    return out;
  }, [results]);

  useEffect(() => { setActiveIndex(0); }, [query]);

  const goTo = (path) => { navigate(path); onClose(); };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); const r = results[activeIndex]; if (r) goTo(r.path); }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-[10vh] px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-card border border-border/60 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search SettleSmart — services, jobs, events, guides…"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <kbd className="text-[10px] font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">ESC</kbd>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {results.length === 0 ? (
                <div className="text-center py-10 text-sm text-muted-foreground">No results for “{query}”</div>
              ) : (
                rendered.map((node, i) => {
                  if (node.type === 'header') {
                    const meta = CATEGORY_META[node.cat];
                    const Icon = meta.icon;
                    return (
                      <div key={`h-${node.cat}`} className="flex items-center gap-1.5 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                        <Icon className="w-3 h-3" /> {meta.label}
                      </div>
                    );
                  }
                  const item = node.item;
                  const active = node.idx === activeIndex;
                  return (
                    <button
                      key={item.path}
                      onMouseEnter={() => setActiveIndex(node.idx)}
                      onClick={() => goTo(item.path)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                        active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                      )}
                    >
                      <span>{item.label}</span>
                      {active && <CornerDownLeft className="w-3.5 h-3.5 opacity-60" />}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}