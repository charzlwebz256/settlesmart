import { Link } from 'react-router-dom';
import { MapPin, Heart, Users, Shield, Sparkles, ArrowRight, Target, CheckCircle, Globe, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const OBJECTIVES = [
  'Provide a single, trusted hub for all settlement services across Canada',
  'Remove language and information barriers for newcomers',
  'Offer AI-powered guidance available 24/7 in plain language',
  'Help newcomers track their first 90 days with a personalized checklist',
  'Connect newcomers to jobs, events, legal aid, and community resources',
  'Support multiple languages and accessibility for all immigration statuses',
];

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            <MapPin className="w-3.5 h-3.5" />
            About SettleSmart Canada
          </div>
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4 leading-tight">
            Helping Newcomers Settle in Canada with Confidence
          </h1>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            SettleSmart Canada is a free, all-in-one digital platform designed to guide immigrants, refugees, 
            international students, and temporary workers through every step of settling in Canada.
          </p>
        </div>

        <div className="space-y-6">
          {/* Why it was developed */}
          <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8">
            <h2 className="font-heading font-bold text-xl mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Why SettleSmart Was Built
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              Moving to a new country is one of the most challenging experiences a person can face. Language barriers, 
              unfamiliar government systems, and the pressure of finding housing, employment, and healthcare can feel 
              overwhelming, especially for refugees, newcomers with limited English, and those arriving without support networks.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3 text-sm md:text-base">
              SettleSmart Canada was created by <strong className="text-foreground">Lwebuga Charles</strong>, a newcomer 
              himself originally from Uganda, who experienced firsthand the difficulty of navigating Canada's settlement 
              systems. Drawing on his background in technology and his lived experience in refugee settings, Charles built 
              SettleSmart to be the platform he wished had existed when he arrived: a single, reliable, and free resource 
              that puts everything newcomers need in one place.
            </p>
          </div>

          {/* What we do */}
          <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8">
            <h2 className="font-heading font-bold text-xl mb-3 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              What SettleSmart Does
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              Our platform aggregates hundreds of verified, free settlement services from government agencies, non-profit 
              organizations, and community groups across all provinces and territories in Canada. Whether you need to find 
              a language class, a food bank, legal aid, a transit card, or a family doctor. We help you find it fast, 
              in one place, tailored to your city and immigration status.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3 text-sm md:text-base">
              Beyond resource discovery, SettleSmart includes an AI-powered settlement assistant available 24/7, a 
              personalized 90-day checklist, live local news for newcomers, real-time job listings, a community events 
              calendar, a job application tracker, an interview prep tool, and a resume builder, all in a single 
              mobile-friendly app.
            </p>
          </div>

          {/* Aims & Objectives */}
          <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8">
            <h2 className="font-heading font-bold text-xl mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Our Aims & Objectives
            </h2>
            <ul className="space-y-3">
              {OBJECTIVES.map((obj, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  {obj}
                </li>
              ))}
            </ul>
          </div>

          {/* Who it's for */}
          <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8">
            <h2 className="font-heading font-bold text-xl mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Who It's For
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              SettleSmart Canada serves anyone who is new to Canada or helping someone who is. This includes 
              permanent residents navigating their first months, refugees and protected persons seeking urgent 
              support, international students adjusting to life in a new city, temporary foreign workers looking 
              for employment and community resources, and asylum seekers in need of legal guidance. Our platform 
              supports multiple languages and is designed with accessibility in mind, so that no one is left behind 
              regardless of their English or French proficiency.
            </p>
          </div>

          {/* Data & Trust */}
          <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8">
            <h2 className="font-heading font-bold text-xl mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Trusted & Verified Information
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              All information on SettleSmart is sourced from trusted organizations including Immigration, Refugees 
              and Citizenship Canada (IRCC), provincial settlement agencies, 211 Canada, and leading non-profit newcomer 
              support networks. We are committed to keeping the platform free, up-to-date, and genuinely useful for the 
              people who need it most. SettleSmart will always remain 100% free for newcomers.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/onboarding">
            <Button className="rounded-xl gap-2 bg-primary hover:bg-primary/90">
              <Sparkles className="w-4 h-4" />
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/meet-the-developer">
            <Button variant="outline" className="rounded-xl gap-2">
              <Heart className="w-4 h-4" />
              Meet the Developer
            </Button>
          </Link>
          <Link to="/support-us">
            <Button variant="outline" className="rounded-xl gap-2">
              <Heart className="w-4 h-4" />
              Support This Initiative
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}