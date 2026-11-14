export default function GreetingCard({ part, eyebrow, title, subtitle, children }) {
  return (
    <section className="max-w-7xl mx-auto px-4 pt-5">
      <div className="relative overflow-hidden rounded-3xl border border-border/50">
        {/* The time-of-day photo is the header backdrop */}
        <img
          key={part.image}
          src={part.image}
          alt={part.alt}
          className="absolute inset-0 h-full w-full object-cover object-center saturate-[1.12] contrast-[1.06] brightness-[1.02] animate-fade-in"
        />

        {/* Time-of-day tint */}
        <div className={`absolute inset-0 bg-gradient-to-br ${part.grad} opacity-70`} />

        {/* Scrim so the greeting stays readable over the photo */}
        <div className="absolute inset-0 bg-gradient-to-r from-card via-card/90 to-card/70 md:via-card/85 md:to-card/25" />

        <div className="relative p-6 md:p-8">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {eyebrow}
          </p>

          <h1 className="font-heading font-extrabold text-2xl md:text-4xl leading-tight mt-2 flex items-center gap-2 flex-wrap">
            {title}
          </h1>

          {subtitle && (
            <p className="text-sm md:text-base text-muted-foreground mt-1.5">{subtitle}</p>
          )}

          {children}
        </div>
      </div>
    </section>
  );
}