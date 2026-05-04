import { Link } from 'react-router-dom';
import {
  GraduationCap, Home as HomeIcon, Briefcase, Scale, Heart,
  Bus, Users, MapPin, AlertTriangle, Navigation
} from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  { icon: GraduationCap, label: 'Education & Language', color: 'bg-blue-500/10 text-blue-600', path: '/services?category=education' },
  { icon: HomeIcon, label: 'Housing', color: 'bg-emerald-500/10 text-emerald-600', path: '/services?category=housing' },
  { icon: Briefcase, label: 'Jobs', color: 'bg-amber-500/10 text-amber-600', path: '/jobs' },
  { icon: Scale, label: 'Legal & IRCC', color: 'bg-purple-500/10 text-purple-600', path: '/legal' },
  { icon: Heart, label: 'Health & Wellness', color: 'bg-rose-500/10 text-rose-600', path: '/services?category=health' },
  { icon: AlertTriangle, label: 'Emergency Support', color: 'bg-red-500/10 text-red-600', path: '/emergency' },
  { icon: Navigation, label: 'Services Near Me', color: 'bg-teal-500/10 text-teal-600', path: '/near-me' },
  { icon: MapPin, label: 'Settlement Services', color: 'bg-orange-500/10 text-orange-600', path: '/services?category=settlement' },
];

export default function QuickAccessGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="font-heading font-bold text-xl md:text-2xl mb-2">Find What You Need</h2>
      <p className="text-muted-foreground text-sm mb-8">Explore free services across Canada for newcomers</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
          >
            <Link
              to={cat.path}
              className="group flex flex-col items-center gap-3 p-5 md:p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <cat.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-center text-foreground">{cat.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}