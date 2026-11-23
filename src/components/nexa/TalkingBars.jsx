import { cn } from '@/lib/utils';

// Small equaliser that moves while Nexa is talking.
export default function TalkingBars({ active = false, tone = 'nexa', className }) {
  return (
    <span className={cn('flex items-end gap-[3px]', className)} aria-hidden="true">
      {[2, 4, 3, 5, 2].map((size, i) => (
        <span
          key={i}
          className={cn(
            'w-[3px] rounded-full',
            tone === 'you' ? 'bg-accent' : 'bg-primary',
            active ? 'talking-bar' : 'opacity-25'
          )}
          style={{ height: `${size * 3}px`, animationDelay: `${i * 0.11}s` }}
        />
      ))}
    </span>
  );
}