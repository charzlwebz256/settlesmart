import { Link } from 'react-router-dom';
import { MapPin, Heart, Users, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 pb-24 md:pb-12">
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

        {/* Main content */}
        <div className="prose prose-slate max-w-none space-y-6 text-foreground">
          <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8">
            <h2 className="font-heading font-bold text-xl mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              What We Do
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Moving to a new country is one of the most challenging experiences a person can face. Language barriers, 
              unfamiliar government systems, and the pressure of finding housing, employment, and healthcare can feel 
              overwhelming. SettleSmart Canada was built to remove those barriers. Our platform aggregates hundreds of 
              verified, free settlement services from government agencies, non-profit organizations, and community 
              groups across all provinces and territories in Canada. Whether you need to find a language class, a food 
              bank, legal aid, a transit card, or a family doctor — we help you find it fast, in one place, tailored 
              to your city and immigration status.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Beyond resource discovery, SettleSmart Canada includes an AI-powered settlement assistant available 
              24/7 to answer your questions in plain language. We also offer a personalized 90-day checklist to 
              keep you on track during your first critical weeks in Canada, live local news curated for newcomers, 
              real-time job listings from LinkedIn and Indeed, and a community events calendar — all in a single, 
              mobile-friendly app.
            </p>
          </div>

          <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8">
            <h2 className="font-heading font-bold text-xl mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Who It's For
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              SettleSmart Canada serves anyone who is new to Canada or helping someone who is. This includes 
              permanent residents navigating their first months, refugees and protected persons seeking urgent 
              support, international students adjusting to life in a new city, temporary foreign workers looking 
              for employment and community resources, and asylum seekers in need of legal guidance. Our platform 
              supports multiple languages and is designed with accessibility in mind, so that no one is left behind 
              regardless of their English or French proficiency.
            </p>
          </div>

          <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8">
            <h2 className="font-heading font-bold text-xl mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Who Builds It
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              SettleSmart Canada is built by a team passionate about using technology to create positive social 
              impact for newcomer communities. Our data is sourced from trusted organizations including Immigration, 
              Refugees and Citizenship Canada (IRCC), provincial settlement agencies, 211 Canada, and leading 
              non-profit newcomer support networks. We are committed to keeping the platform free, up-to-date, 
              and genuinely useful for the people who need it most.
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
          <Link to="/contact">
            <Button variant="outline" className="rounded-xl gap-2">
              <Heart className="w-4 h-4" />
              Contact Us
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}