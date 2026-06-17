import { Compass } from 'lucide-react';

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
    </div>
  );
}