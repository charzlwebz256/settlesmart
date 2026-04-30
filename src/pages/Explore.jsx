import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap, Home as HomeIcon, Briefcase, Scale, Heart, Bus,
  Users, MapPin, Globe, FileText, DollarSign, Baby, ArrowRight, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const modules = [
  {
    id: 'education',
    icon: GraduationCap,
    title: 'Education & Language Hub',
    description: 'ESL/LINC programs, school enrollment, credential assessment, digital literacy training',
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    items: ['Language assessments (LINC, ESL)', 'School enrollment guides', 'Credential recognition', 'Adult literacy programs', 'Post-secondary pathways'],
    link: '/services?category=education',
  },
  {
    id: 'transportation',
    icon: Bus,
    title: 'Transportation Navigator',
    description: 'City-specific transit guides, route planning, and transit card information',
    color: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
    items: ['Getting transit cards', 'Route planning by city', 'Driver\'s license process', 'Ride-sharing options', 'Cycling infrastructure'],
    link: '/services?category=transportation',
  },
  {
    id: 'legal',
    icon: Scale,
    title: 'Legal & Immigration',
    description: 'Immigration pathways, legal rights, citizenship info, and legal aid access',
    color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    items: ['PR applications & pathways', 'Asylum & refugee claims', 'Citizenship process', 'Tenant & worker rights', 'Free legal aid services'],
    link: '/services?category=legal',
  },
  {
    id: 'volunteering',
    icon: Users,
    title: 'Volunteering & Community',
    description: 'Community events, skill-building opportunities, and volunteer programs',
    color: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    items: ['Volunteer opportunities', 'Community events', 'Cultural organizations', 'Mentorship programs', 'Peer support networks'],
    link: '/services?category=volunteering',
  },
  {
    id: 'housing',
    icon: HomeIcon,
    title: 'Housing & Cost of Living',
    description: 'Rental guides, tenant rights, housing search, cost calculators, scam alerts',
    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    items: ['Rental market guides', 'Tenant rights by province', 'Affordable housing programs', 'Cost-of-living comparisons', 'Housing scam prevention'],
    link: '/services?category=housing',
  },
  {
    id: 'settlement',
    icon: MapPin,
    title: 'Settlement Services',
    description: 'Settlement workers, case management, cultural integration support',
    color: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
    items: ['Find settlement workers', 'Case management support', 'Orientation programs', 'Cultural integration', 'Government programs'],
    link: '/services?category=settlement',
  },
  {
    id: 'employment',
    icon: Briefcase,
    title: 'Employment & Skills',
    description: 'Job search tools, resume building, training programs, mentorship',
    color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    items: ['Job search strategies', 'Resume & cover letter help', 'Canadian work experience', 'Skills training programs', 'Professional mentorship'],
    link: '/services?category=employment',
  },
  {
    id: 'health',
    icon: Heart,
    title: 'Wellness & Family',
    description: 'Healthcare access, mental health, family services, cultural adaptation',
    color: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    items: ['Health card registration', 'Mental health resources', 'Family & youth programs', 'Prenatal & childcare', 'Cultural adjustment support'],
    link: '/services?category=health',
  },
];

export default function Explore() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-24 md:pb-8">
      <div className="mb-8">
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-2">Explore Resources</h1>
        <p className="text-muted-foreground text-sm">
          Comprehensive guides and resources for every aspect of settling in Canada
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((mod, i) => {
          const Icon = mod.icon;
          const isExpanded = expanded === mod.id;
          return (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-card rounded-2xl border border-border/50 overflow-hidden transition-all duration-300 ${isExpanded ? 'ring-2 ring-primary/20' : 'hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5'}`}
            >
              <button
                onClick={() => setExpanded(isExpanded ? null : mod.id)}
                className="w-full text-left p-6"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${mod.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-base mb-1">{mod.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{mod.description}</p>
                  </div>
                </div>
              </button>

              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-6"
                >
                  <ul className="space-y-2 mb-4">
                    {mod.items.map(item => (
                      <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link to={mod.link}>
                    <Button size="sm" className="rounded-lg gap-2 w-full bg-primary hover:bg-primary/90">
                      Browse {mod.title}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}