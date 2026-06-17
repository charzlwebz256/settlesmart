import { motion } from 'framer-motion';
import { Heart, Globe, Mountain, Waves, Users, Shield, Smile, Star } from 'lucide-react';

const reasons = [
  {
    icon: Heart,
    color: 'text-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    title: 'Peaceful & Welcoming',
    description: 'Canadians are internationally recognized for their peaceful, cooperative and generous nature — accepting of what makes each person unique.',
  },
  {
    icon: Globe,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    title: 'Vibrant Multiculturalism',
    description: 'A wide variety of ethnic foods, festivals, and cultural celebrations are held year-round to honour the diverse traditions of Canadian people.',
  },
  {
    icon: Mountain,
    color: 'text-green-600',
    bg: 'bg-green-50 dark:bg-green-950/30',
    title: 'World-Class Nature',
    description: 'Home to Whistler, Banff, Lake Louise and countless parks — Canada offers breathtaking landscapes for outdoor adventures in every season.',
  },
  {
    icon: Waves,
    color: 'text-cyan-500',
    bg: 'bg-cyan-50 dark:bg-cyan-950/30',
    title: 'Abundant Water & Sports',
    description: 'Rivers, lakes and oceans make water sports like kayaking, fishing and sailing a way of life, alongside hockey, soccer, skiing and more.',
  },
  {
    icon: Shield,
    color: 'text-primary',
    bg: 'bg-primary/10 dark:bg-primary/20',
    title: 'Strong Social Safety Net',
    description: 'Access to Employment Insurance, public pensions (CPP/OAS), the Canadian Dental Care Plan, and robust disability benefits for residents.',
  },
  {
    icon: Users,
    color: 'text-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    title: 'Pathways to Belong',
    description: 'Clear immigration and citizenship pathways — visit, work, study, or settle permanently with support from government settlement services.',
  },
  {
    icon: Smile,
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    title: 'Active, Healthy Lifestyles',
    description: 'Canadians enjoy active living year-round: hiking, cycling, camping, swimming, rock climbing, dance, basketball, and community sports leagues.',
  },
  {
    icon: Star,
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    title: 'World Events & Culture',
    description: 'Canada hosts world-class events like the FIFA World Cup 2026™ and celebrates Pride, Indigenous History Month, and cultural milestones nationally.',
  },
];

export default function WhyCanadaSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
          Why Canada?
        </span>
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-2">
          A Country That Welcomes You
        </h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
          From world-class nature to multicultural cities, Canada offers newcomers safety, opportunity, and a genuine sense of belonging.
        </p>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reasons.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.07, ease: 'easeOut' }}
            whileHover={{ y: -6, boxShadow: '0 12px 32px rgba(0,0,0,0.10)' }}
            className="bg-card border border-border/50 rounded-2xl p-5 flex flex-col gap-3 cursor-default"
          >
            <motion.div
              whileHover={{ scale: 1.18, rotate: 6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}
            >
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </motion.div>
            <div>
              <h3 className="font-heading font-semibold text-sm text-foreground mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Source attribution */}
      <p className="text-center text-[10px] text-muted-foreground mt-6">
        Sources:{' '}
        <a href="https://www.canada.ca/en.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">Canada.ca</a>
        {' | '}
        <a href="https://caps-i.ca/living-in-canada/culture-recreation/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">CAPS-I Living in Canada</a>
      </p>
    </section>
  );
}