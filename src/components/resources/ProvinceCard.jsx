import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, Landmark, Languages, MapPin, Ruler, Sparkles, Users } from 'lucide-react';
import { formatPopulation } from '@/data/provinceProfiles';
import { cn } from '@/lib/utils';

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

function Stat({ icon: Icon, label, value }) {
  return (
    <motion.div variants={fadeUp} className="flex items-baseline gap-1.5">
      <Icon className="h-3 w-3 flex-shrink-0 translate-y-0.5 text-primary" />
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </motion.div>
  );
}

/**
 * One province on the time zone page: live local time, plus the province's
 * facts revealed on hover (or tap, on a touch screen).
 */
export default function ProvinceCard({ name, profile, timeGroups, zoneInfo, open, onOpen, onClose, onToggle }) {
  return (
    <motion.div
      className={cn(
        'relative rounded-xl border bg-background/60 p-3.5 transition-colors duration-200',
        open ? 'border-primary/50 shadow-lg shadow-primary/10' : 'border-border/50'
      )}
      onPointerEnter={(e) => e.pointerType === 'mouse' && onOpen?.()}
      onPointerLeave={(e) => e.pointerType === 'mouse' && onClose?.()}
      onFocus={onOpen}
      onBlur={onClose}
      onClick={() => window.matchMedia('(hover: none)').matches && onToggle?.()}
      tabIndex={0}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      <p className="font-heading font-bold text-sm mb-2">{name}</p>
      <div className="space-y-2.5">
        {timeGroups.map(([tz, names]) => (
          <div key={tz}>
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-mono text-[15px] font-semibold tabular-nums text-primary leading-none">
                {zoneInfo[tz]?.time}
              </span>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase flex-shrink-0">
                {zoneInfo[tz]?.abbr}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug mt-1">{names.join(' · ')}</p>
          </div>
        ))}
      </div>

      <span className="mt-2.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">
        <Sparkles className="h-2.5 w-2.5" />
        {open ? 'Hover away to close' : 'Province facts'}
      </span>

      <AnimatePresence>
        {open && profile && (
          <motion.div
            key="facts"
            initial={{ opacity: 0, y: 12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.985 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute inset-0 z-10 overflow-y-auto rounded-xl border border-primary/40 bg-card/95 p-3 shadow-xl backdrop-blur-md"
          >
            <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.035 } } }}>
              <div className="mb-1.5 flex items-center gap-1.5">
                <span className="rounded-md bg-primary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary-foreground">
                  {profile.abbr}
                </span>
                <p className="font-heading text-[13px] font-bold leading-tight">{name}</p>
              </div>

              <div className="space-y-1 text-[10.5px] leading-snug">
                <Stat icon={MapPin} label="Capital" value={profile.capital} />
                <Stat icon={Users} label="Population" value={`${formatPopulation(profile.population)} (2021)`} />
                <Stat icon={Ruler} label="Area" value={`${formatPopulation(profile.areaKm2)} km²`} />
                <Stat icon={CalendarDays} label="Joined Canada" value={profile.joined} />
                <Stat icon={Landmark} label={profile.leader.title} value={`${profile.leader.name} · ${profile.leader.party}`} />
                <Stat icon={Languages} label="Languages" value={profile.languages} />
              </div>

              <motion.p variants={fadeUp} className="mt-1.5 border-t border-border/50 pt-1.5 text-[10.5px] leading-snug text-muted-foreground">
                <span className="font-semibold text-foreground">Geography · </span>
                {profile.geography}
              </motion.p>
              <motion.p variants={fadeUp} className="mt-1 text-[10.5px] leading-snug text-muted-foreground">
                <span className="font-semibold text-primary">{profile.nickname}</span> — {profile.note}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}