import { motion } from 'framer-motion';
import { Heart, Mail, Phone, DollarSign, Users, Lightbulb, Globe, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WAYS_TO_SUPPORT = [
  {
    icon: DollarSign,
    title: 'Financial Donation',
    description: 'Your financial contribution helps cover server costs, development time, and keeps SettleSmart free for all newcomers.',
    color: 'bg-green-50 border-green-200 text-green-700 dark:bg-green-950/30 dark:border-green-800',
    iconColor: 'text-green-600',
  },
  {
    icon: Users,
    title: 'Partnership & Sponsorship',
    description: 'Organizations, settlement agencies, and non-profits can partner with us to reach newcomers and expand the platform\'s reach.',
    color: 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/30 dark:border-blue-800',
    iconColor: 'text-blue-600',
  },
  {
    icon: Lightbulb,
    title: 'Grant Funding',
    description: 'If you represent a foundation or granting body interested in immigrant integration and digital inclusion, we would love to connect.',
    color: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/30 dark:border-amber-800',
    iconColor: 'text-amber-600',
  },
  {
    icon: Globe,
    title: 'Volunteer & Contribute',
    description: 'Developers, translators, and community advocates can volunteer their skills to help improve and expand the platform.',
    color: 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950/30 dark:border-purple-800',
    iconColor: 'text-purple-600',
  },
];

export default function SupportUs() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            <Heart className="w-3.5 h-3.5" />
            Support SettleSmart
          </div>
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4 leading-tight">
            Support SettleSmart
          </h1>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            SettleSmart is a free platform built with passion and purpose. Your support, whether financial, 
            through partnership, or through volunteering, directly helps immigrants and refugees access the 
            resources they need to build better lives in Canada.
          </p>
        </div>

        {/* Ways to Support */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {WAYS_TO_SUPPORT.map((item) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`rounded-2xl border p-6 ${item.color}`}
            >
              <item.icon className={`w-8 h-8 mb-3 ${item.iconColor}`} />
              <h3 className="font-heading font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm leading-relaxed opacity-80">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Impact Stats */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 mb-10">
          <h2 className="font-heading font-bold text-xl mb-4 text-center text-foreground">Why Your Support Matters</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-primary mb-1">100%</p>
              <p className="text-xs text-muted-foreground">Free for newcomers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary mb-1">500+</p>
              <p className="text-xs text-muted-foreground">Services listed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary mb-1">13</p>
              <p className="text-xs text-muted-foreground">Provinces & territories</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center mt-4 leading-relaxed">
            Every dollar donated goes directly toward maintaining, improving, and expanding SettleSmart 
            so more newcomers can access the support they deserve.
          </p>
        </div>

        {/* Contact Section */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8">
          <h2 className="font-heading font-bold text-xl mb-2 text-foreground flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Get in Touch to Support Us
          </h2>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            Interested in donating, partnering, or learning more about how you can support this initiative? 
            Reach out directly to the developer. We welcome all conversations about collaboration and funding.
          </p>

          <div className="space-y-4">
            <a
              href="mailto:charzlwebz256@gmail.com"
              className="flex items-center gap-4 p-4 rounded-xl bg-muted hover:bg-primary/10 hover:text-primary transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Email us at</p>
                <p className="font-semibold text-foreground">charzlwebz256@gmail.com</p>
              </div>
              <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
            </a>

            <a
              href="tel:+14372475086"
              className="flex items-center gap-4 p-4 rounded-xl bg-muted hover:bg-primary/10 hover:text-primary transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Call or text</p>
                <p className="font-semibold text-foreground">+1 (437) 247-5086</p>
              </div>
              <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">
            SettleSmart is an independent, community-driven initiative. All support is deeply appreciated.
          </p>
        </div>
      </motion.div>
    </div>
  );
}