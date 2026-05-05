import { Link } from 'react-router-dom';
import { Scale, Newspaper, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const sections = [
  {
    icon: Scale,
    color: 'bg-purple-500/10 text-purple-600',
    label: 'Legal & IRCC',
    desc: 'Access official government links for immigration documents, SIN, legal rights, and IRCC contacts.',
    path: '/legal',
  },
  {
    icon: Newspaper,
    color: 'bg-slate-500/10 text-slate-600',
    label: 'News & Updates',
    desc: 'Live Canadian news from CBC, CTV, and Global News — with plain-language insights tailored for newcomers.',
    path: '/news',
  },
];

export default function Resources() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 pb-24 md:pb-12">
      <div className="mb-8">
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-2">Resources</h1>
        <p className="text-muted-foreground text-sm">Legal information and news to keep you informed.</p>
      </div>
      <div className="space-y-4">
        {sections.map((s, i) => (
          <motion.div
            key={s.path}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Link
              to={s.path}
              className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-md transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
                <s.icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-heading font-bold text-base mb-0.5 group-hover:text-primary transition-colors">{s.label}</h2>
                <p className="text-muted-foreground text-sm leading-snug">{s.desc}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground/40 group-hover:text-primary transition-colors flex-shrink-0" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}