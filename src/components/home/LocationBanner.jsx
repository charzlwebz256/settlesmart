import { MapPin, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LocationBanner({ city, province, isDetecting }) {
  if (!isDetecting && !city && !province) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
      <div className="flex items-center gap-2 bg-primary/8 border border-primary/15 rounded-xl px-4 py-2.5 text-sm">
        {isDetecting ? (
          <>
            <Loader2 className="w-4 h-4 text-primary animate-spin flex-shrink-0" />
            <span className="text-muted-foreground">Detecting your location to show local resources…</span>
          </>
        ) : (
          <>
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-foreground">
              Showing resources for{' '}
              <span className="font-semibold text-primary">
                {city ? `${city}, ` : ''}{province}
              </span>
            </span>
            <Link to="/profile" className="ml-auto text-[11px] text-primary/70 hover:text-primary font-medium whitespace-nowrap">
              Change location
            </Link>
          </>
        )}
      </div>
    </div>
  );
}