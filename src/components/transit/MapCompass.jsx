import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

const ROSE = [
  { label: 'N', deg: 0, primary: true },
  { label: 'E', deg: 90 },
  { label: 'S', deg: 180 },
  { label: 'W', deg: 270 },
];

const CARDINALS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

function cardinalName(heading) {
  return CARDINALS[Math.round((((heading % 360) + 360) % 360) / 45) % 8];
}

/**
 * Compass rose over the map: the dial turns with the phone while the small
 * accent arrow keeps pointing at the destination, so the rider sees at a
 * glance which way they face and which way they need to go.
 */
export default function MapCompass({ heading, bearing, needsPermission, onEnableCompass }) {
  const hasHeading = Number.isFinite(heading);
  const hasBearing = Number.isFinite(bearing);
  // The dial turns against the phone so north stays true to the ground.
  const dialRotation = hasHeading ? -heading : 0;
  const targetRotation = hasBearing ? bearing - (hasHeading ? heading : 0) : null;

  return (
    <div className="absolute left-3 top-3 z-10 flex flex-col items-center gap-1">
      <div className="relative h-[74px] w-[74px] rounded-full border border-border/60 bg-card/95 shadow-lg backdrop-blur">
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: dialRotation }}
          transition={{ type: 'spring', stiffness: 110, damping: 22 }}
        >
          {ROSE.map((point) => (
            <span
              key={point.label}
              className={cn(
                'absolute left-1/2 top-1/2 text-[9px] font-bold leading-none',
                point.primary ? 'text-primary' : 'text-muted-foreground'
              )}
              style={{ transform: `translate(-50%, -50%) rotate(${point.deg}deg) translateY(-25px)` }}
            >
              {point.label}
            </span>
          ))}
          <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted-foreground/60" />
        </motion.div>

        {/* Direction of travel stays fixed; the destination marker orbits it. */}
        <span className="absolute left-1/2 top-1/2 h-[17px] w-[1.5px] -translate-x-1/2 -translate-y-full rounded-full bg-primary" />

        {targetRotation !== null && (
          <motion.span
            className="absolute inset-0"
            animate={{ rotate: targetRotation }}
            transition={{ type: 'spring', stiffness: 110, damping: 22 }}
          >
            <span className="absolute left-1/2 top-1 h-0 w-0 -translate-x-1/2 border-x-[3.5px] border-t-[7px] border-x-transparent border-t-accent" />
          </motion.span>
        )}
      </div>

      {needsPermission ? (
        <button
          onClick={onEnableCompass}
          className="flex min-h-[22px] items-center gap-1 rounded-full border border-primary/40 bg-card/95 px-2 py-0.5 text-[9px] font-bold text-primary shadow-md backdrop-blur"
        >
          <Compass className="h-2.5 w-2.5" />
          Compass
        </button>
      ) : (
        <span className="rounded-full bg-card/95 px-2 py-0.5 text-[9px] font-bold text-muted-foreground shadow-md backdrop-blur">
          {hasHeading ? `${cardinalName(heading)} ${Math.round(heading)}°` : 'Compass'}
        </span>
      )}
    </div>
  );
}