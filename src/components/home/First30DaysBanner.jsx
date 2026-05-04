import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function First30DaysBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 pb-12">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-foreground to-foreground/90 text-primary-foreground p-6 md:p-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        
        <div className="relative flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium mb-4">
              <Calendar className="w-3.5 h-3.5" />
              Guided Checklist
            </div>
            <h3 className="font-heading font-bold text-2xl md:text-3xl mb-3">Your First 30 Days in Canada

            </h3>
            <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-lg">
              Step-by-step checklist to get settled: SIN card, health card, bank account, housing, and more. 
              Personalized for your province and status.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link to="/checklist">
              <Button size="lg" className="rounded-xl gap-2 bg-white text-foreground hover:bg-white/90 font-semibold h-12 px-6">
                <CheckCircle2 className="w-4 h-4" />
                Start Checklist
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>);

}