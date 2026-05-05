import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function HeroSection({ hasProfile }) {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-accent/5" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <div className="relative max-w-7xl mx-auto px-4 pt-12 pb-16 md:pt-20 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6">
            <MapPin className="w-3.5 h-3.5" />
            Your guide to settling in Canada
          </div>

          <h1 className="font-heading font-extrabold text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.1] mb-5">
            <span className="block">Start Your New Life</span>
            <span className="text-primary">in Canada</span>
            <br />
            <span className="text-muted-foreground font-bold text-2xl md:text-3xl lg:text-4xl">
              with Confidence
            </span>
          </h1>

          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8 max-w-xl">Free settlement services, housing, jobs, education, and more all in one place. Personalized for your journey as a newcomer to Canada.


          </p>

          <div className="flex flex-wrap gap-3">
            {!hasProfile ?
            <Link to="/onboarding">
                <Button size="lg" className="rounded-xl gap-2 font-semibold text-base h-12 px-6 bg-primary hover:bg-primary/90">
                  <Sparkles className="w-4 h-4" />
                  Get Started — It's Free
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link> :

            <Link to="/dashboard">
                <Button size="lg" className="rounded-xl gap-2 font-semibold text-base h-12 px-6 bg-primary hover:bg-primary/90">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            }
            <Link to="/services">
              <Button variant="outline" size="lg" className="rounded-xl font-semibold text-base h-12 px-6">
                Browse Services
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>);

}