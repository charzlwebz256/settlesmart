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