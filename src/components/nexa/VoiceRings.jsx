import { cn } from '@/lib/utils';

// Rings that pulse around an avatar while Nexa talks, or while the visitor does.
export default function VoiceRings({ nexa = false, you = false, children, className }) {
  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <span className="pointer-events-none absolute inset-0" aria-hidden="true">
        {[0, 1].map((i) => (
          <span
            key={`nexa-${i}`}
            className={cn(
              'absolute inset-0 rounded-full border-2 border-primary',
              nexa ? 'voice-ring' : 'opacity-0'
            )}
            style={{ animationDelay: `${i * 0.65}s` }}
          />
        ))}
        {[0, 1].map((i) => (
          <span
            key={`you-${i}`}
            className={cn(
              'absolute inset-0 rounded-full border-2 border-accent',
              you ? 'voice-ring voice-ring-you' : 'opacity-0'
            )}
            style={{ animationDelay: `${i * 0.5}s` }}
          />
        ))}
      </span>
      <span className="relative z-10 inline-flex items-center justify-center">{children}</span>
    </div>
  );
}