import { Link } from 'react-router-dom';
import { Scale, Newspaper, Globe, ArrowRight, ShoppingBag, ChevronDown, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import CanadaTimeZones from '@/components/resources/CanadaTimeZones';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const resourceSections = [
  {
    value: 'legal',
    icon: Scale,
    color: 'bg-purple-500/10 text-purple-600',
    label: 'Legal & IRCC',
    desc: 'Access official government links for immigration documents, SIN, legal rights, and IRCC contacts.',
    path: '/legal',
  },
  {
    value: 'news',
    icon: Newspaper,
    color: 'bg-slate-500/10 text-slate-600',
    label: 'News & Updates',
    desc: 'Live Canadian news from CBC, CTV, and Global News — with plain-language insights tailored for newcomers.',
    path: '/news',
  },
];

const shopPlatforms = [
  {
    name: 'Amazon.ca',
    desc: 'Canada\'s largest online shopping platform with millions of products and fast delivery.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    url: 'https://www.amazon.ca/',
    color: 'bg-orange-500/10 text-orange-600',
  },
  {
    name: 'eBay.ca',
    desc: 'Marketplace for new and used items with competitive pricing and seller protection.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg',
    url: 'https://www.ebay.ca/',
    color: 'bg-red-500/10 text-red-600',
  },
];

const tabTriggerClass = "flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 h-auto py-2 px-2 text-[11px] sm:text-sm whitespace-normal text-center rounded-lg";

export default function Resources() {
  const [shopOpen, setShopOpen] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 pb-24 md:pb-12">
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-2">Resources</h1>
        <p className="text-muted-foreground text-sm">Legal information, news, live time zones, and shopping guides to keep you informed.</p>
      </div>

      <Tabs defaultValue="legal" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1 gap-1 rounded-xl">
          <TabsTrigger value="legal" className={tabTriggerClass}>
            <Scale className="w-4 h-4 flex-shrink-0" />
            <span>Legal &amp; IRCC</span>
          </TabsTrigger>
          <TabsTrigger value="news" className={tabTriggerClass}>
            <Newspaper className="w-4 h-4 flex-shrink-0" />
            <span>News &amp; Updates</span>
          </TabsTrigger>
          <TabsTrigger value="timezones" className={tabTriggerClass}>
            <Globe className="w-4 h-4 flex-shrink-0" />
            <span>Time Zones</span>
          </TabsTrigger>
        </TabsList>

        {resourceSections.map((s) => (
          <TabsContent key={s.value} value={s.value} className="mt-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Link
                to={s.path}
                className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", s.color)}>
                  <s.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-heading font-bold text-base mb-0.5 group-hover:text-primary transition-colors">{s.label}</h2>
                  <p className="text-muted-foreground text-sm leading-snug">{s.desc}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground/40 group-hover:text-primary transition-colors flex-shrink-0" />
              </Link>
            </motion.div>
          </TabsContent>
        ))}

        <TabsContent value="timezones" className="mt-4">
          <CanadaTimeZones />
        </TabsContent>
      </Tabs>

      {/* Shop Smart Dropdown */}
      <div className="mt-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button
            onClick={() => setShopOpen(!shopOpen)}
            className="w-full flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-md transition-all group text-left"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-orange-500/10 text-orange-600">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-heading font-bold text-base mb-0.5 group-hover:text-primary transition-colors">Shop Smart</h2>
              <p className="text-muted-foreground text-sm leading-snug">Access major online shopping platforms — Amazon.ca and eBay.ca for convenient home delivery.</p>
            </div>
            <ChevronDown className={cn("w-5 h-5 text-muted-foreground/40 group-hover:text-primary transition-all flex-shrink-0", shopOpen && "rotate-180")} />
          </button>

          {shopOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="mt-2 space-y-2 pl-4 border-l-2 border-primary/30"
            >
              {shopPlatforms.map((platform, i) => (
                <a
                  key={i}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn("flex items-center gap-3 p-4 rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-sm transition-all group", platform.color)}
                >
                  <img
                    src={platform.logo}
                    alt={platform.name}
                    className="w-6 h-6 object-contain flex-shrink-0"
                    onError={e => e.target.style.display = 'none'}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-sm group-hover:text-primary transition-colors">{platform.name}</h3>
                    <p className="text-muted-foreground text-xs leading-snug">{platform.desc}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors flex-shrink-0" />
                </a>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}