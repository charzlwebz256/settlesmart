import { Compass, GraduationCap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Explore() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 pb-24 md:pb-12">
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Compass className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-3">Explore</h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Use the menu above to discover settlement services, find places near you, or explore transit options in your area.
        </p>
      </div>

      <Link
        to="/scholarships"
        className="flex items-center gap-3 bg-card border border-border/50 rounded-2xl p-4 hover:border-primary/30 hover:shadow-md transition-all group"
      >
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-heading font-bold text-base">Scholarships in Canada</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Government-funded grants, university awards, private scholarships & refugee funding — by province and city.
          </p>
        </div>
        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
      </Link>
    </div>
  );
}