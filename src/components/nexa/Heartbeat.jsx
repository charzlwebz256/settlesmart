import { cn } from '@/lib/utils';

// A heartbeat instead of rings: a soft double-beat halo around its child.
export default function Heartbeat({ active = false, tone = 'nexa', className, children }) {
  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      {active && (
        <span className="pointer-events-none absolute inset-0" aria-hidden="true">
          <span className={cn('heartbeat-halo', tone === 'you' ? 'bg-accent/40' : 'bg-primary/40')} />
          <span className={cn('heartbeat-halo heartbeat-halo-late', tone === 'you' ? 'bg-accent/30' : 'bg-primary/30')} />
        </span>
      )}
      <span className="relative z-10 inline-flex items-center justify-center">{children}</span>
    </div>
  );
}

// A small dot that beats twice, for compact indicators.
export function HeartbeatDot({ active = false, tone = 'nexa', className, children }) {
  return (
    <span className={cn('relative inline-flex items-center justify-center', className)}>
      {active && (
        <span
          className={cn(
            'heartbeat-dot pointer-events-none absolute inset-0 rounded-full',
            tone === 'you' ? 'bg-accent/50' : 'bg-primary/50'
          )}
          aria-hidden="true"
        />
      )}
      <span className="relative inline-flex items-center justify-center">{children}</span>
    </span>
  );
}

// A wavy heartbeat trace that drifts sideways while someone is speaking.
export function HeartbeatWave({ active = false, tone = 'nexa', className }) {
  return (
    <div className={cn('pointer-events-none overflow-hidden', className)} aria-hidden="true">
      <div className={cn('heartbeat-wave flex h-full w-[200%]', !active && 'opacity-0')}>
        {[0, 1].map((i) => (
          <svg
            key={i}
            viewBox="0 0 200 24"
            preserveAspectRatio="none"
            className={cn('h-full w-1/2', tone === 'you' ? 'text-accent' : 'text-primary')}
          >
            <polyline
              points="0,12 28,12 36,12 42,4 48,20 54,12 88,12 98,12 104,7 110,17 116,12 200,12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ))}
      </div>
    </div>
  );
}