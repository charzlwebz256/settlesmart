import { MicOff, Volume2, Loader2 } from 'lucide-react';
import { NEXA_PORTRAIT } from '@/data/nexaPortrait';
import { cn } from '@/lib/utils';

const STATE_TEXT = {
  idle: 'Here with you',
  listening: 'Listening',
  thinking: 'Thinking',
  speaking: 'Speaking',
};

const WAVE_BARS = [0, 1, 2, 3, 4, 5, 6];

// Nexa's animated presence: a breathing portrait that reacts to listening and speaking.
export default function NexaPresence({ phase = 'idle', caption = '', muted = false, onToggleMute }) {
  const active = phase === 'listening' || phase === 'speaking';

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-primary/25 via-primary/5 to-foreground/15">
      {/* soft light behind her */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,hsl(var(--primary)/0.28),transparent_62%)]" />

      {/* pulsing rings while she listens or talks */}
      {active && (
        <div className="pointer-events-none absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2">
          <span className="nexa-ring absolute -left-28 -top-28 h-56 w-56 rounded-full border border-primary/40" />
          <span
            className="nexa-ring absolute -left-28 -top-28 h-56 w-56 rounded-full border border-primary/30"
            style={{ animationDelay: '1.1s' }}
          />
        </div>
      )}

      <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2">
        <div
          className={cn(
            'overflow-hidden rounded-full ring-4 ring-white/70 shadow-xl dark:ring-white/10',
            phase === 'idle' && 'nexa-breathe',
            phase === 'listening' && 'nexa-breathe-fast',
            phase === 'speaking' && 'nexa-speak-glow'
          )}
        >
          <img src={NEXA_PORTRAIT} alt="Nexa" className="h-40 w-40 object-cover sm:h-44 sm:w-44" />
        </div>
      </div>

      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
        <div className="flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 backdrop-blur">
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              phase === 'listening' && 'bg-emerald-400 animate-pulse',
              phase === 'speaking' && 'bg-primary animate-pulse',
              phase === 'thinking' && 'bg-amber-400 animate-pulse',
              phase === 'idle' && 'bg-white/70'
            )}
          />
          <span className="text-[10px] font-semibold text-white">Nexa</span>
          <span className="text-[10px] text-white/70">· {STATE_TEXT[phase]}</span>
        </div>
        {onToggleMute && (
          <button
            onClick={onToggleMute}
            aria-label={muted ? 'Turn her voice back on' : 'Silence her voice'}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition-colors hover:bg-black/70"
          >
            {muted ? <Volume2 className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>

      {/* her voice, as a live waveform */}
      {phase === 'speaking' && (
        <div className="absolute bottom-14 left-1/2 flex -translate-x-1/2 items-end gap-1">
          {WAVE_BARS.map((bar) => (
            <span
              key={bar}
              className="nexa-wave-bar w-1 rounded-full bg-primary/80"
              style={{ height: `${12 + (bar % 3) * 8}px`, animationDelay: `${bar * 0.09}s` }}
            />
          ))}
        </div>
      )}

      {phase === 'thinking' && (
        <div className="absolute bottom-14 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-background/80 px-3 py-1.5 backdrop-blur">
          <Loader2 className="h-3 w-3 animate-spin text-primary" />
          <span className="text-[10px] font-medium text-foreground">One moment…</span>
        </div>
      )}

      {caption && (
        <div className="absolute inset-x-2 bottom-2 rounded-xl bg-black/65 px-3 py-2 backdrop-blur">
          <p className="line-clamp-3 text-[11px] leading-relaxed text-white">{caption}</p>
        </div>
      )}
    </div>
  );
}