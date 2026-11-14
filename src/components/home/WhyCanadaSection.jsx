import { motion } from 'framer-motion';
import { Heart, Globe, Mountain, Waves, Users, Shield, Smile, Star } from 'lucide-react';

const reasons = [
  {
    icon: Heart,
    title: 'Peaceful & Welcoming',
    description: 'Canadians are internationally recognized for their peaceful, cooperative and generous nature, accepting of what makes each person unique.',
    image: 'https://media.base44.com/images/public/69f2dbb716d886c9c4ab31fc/38617e4af_generated_image.png',
  },
  {
    icon: Globe,
    title: 'Vibrant Multiculturalism',
    description: 'A wide variety of ethnic foods, festivals, and cultural celebrations are held year-round to honour the diverse traditions of Canadian people.',
    image: 'https://media.base44.com/images/public/69f2dbb716d886c9c4ab31fc/c3d56753c_generated_image.png',
  },
  {
    icon: Mountain,
    title: 'World-Class Nature',
    description: 'Home to Whistler, Banff, Lake Louise and countless parks, Canada offers breathtaking landscapes for outdoor adventures in every season.',
    image: 'https://media.base44.com/images/public/69f2dbb716d886c9c4ab31fc/0fc3c9592_generated_image.png',
  },
  {
    icon: Waves,
    title: 'Abundant Water & Sports',
    description: 'Rivers, lakes and oceans make water sports like kayaking, fishing and sailing a way of life, alongside hockey, soccer, skiing and more.',
    image: 'https://media.base44.com/images/public/69f2dbb716d886c9c4ab31fc/98f1eef1b_generated_image.png',
  },
  {
    icon: Shield,
    title: 'Strong Social Safety Net',
    description: 'Access to Employment Insurance, public pensions (CPP/OAS), the Canadian Dental Care Plan, and robust disability benefits for residents.',
    image: 'https://media.base44.com/images/public/69f2dbb716d886c9c4ab31fc/9c9acde1d_generated_image.png',
  },
  {
    icon: Users,
    title: 'Pathways to Belong',
    description: 'Clear immigration and citizenship pathways, visit, work, study, or settle permanently with support from government settlement services.',
    image: 'https://media.base44.com/images/public/69f2dbb716d886c9c4ab31fc/6ca393e59_generated_image.png',
  },
  {
    icon: Smile,
    title: 'Active, Healthy Lifestyles',
    description: 'Canadians enjoy active living year-round: hiking, cycling, camping, swimming, rock climbing, dance, basketball, and community sports leagues.',
    image: 'https://media.base44.com/images/public/69f2dbb716d886c9c4ab31fc/61cd4be90_generated_image.png',
  },
  {
    icon: Star,
    title: 'World Events & Culture',
    description: 'Canada hosts world-class events like the FIFA World Cup 2026™ and celebrates Pride, Indigenous History Month, and cultural milestones nationally.',
    image: 'https://media.base44.com/images/public/69f2dbb716d886c9c4ab31fc/dd8f7374a_generated_image.png',
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
      <div className="auto-grid gap-5 [--card-min:20rem]">
        {reasons.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.07, ease: 'easeOut' }}
            whileHover={{ y: -6 }}
            className="group relative flex h-full w-full min-h-[240px] flex-col overflow-hidden rounded-2xl border border-border/50 bg-black md:min-h-[290px]"
          >
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/25" />

            <div className="relative z-10 flex flex-1 flex-col gap-3 p-5">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/25 bg-white/15 backdrop-blur">
                <item.icon className="h-5 w-5 text-white" />
              </span>
              <div>
                <h3 className="font-heading font-semibold text-base text-white mb-1.5">{item.title}</h3>
                <p className="text-sm leading-relaxed text-white/85">{item.description}</p>
              </div>
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