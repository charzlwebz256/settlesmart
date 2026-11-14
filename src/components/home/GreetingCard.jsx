export default function GreetingCard({ part, eyebrow, title, subtitle, children }) {
  return (
    <section className="max-w-7xl mx-auto px-4 pt-5">
      <div className="relative overflow-hidden rounded-3xl border border-border/50">
        {/* Mobile: the photo is the card background */}
        <img
          src={part.image}
          alt={part.alt}
          className="md:hidden absolute inset-0 h-full w-full object-cover object-center saturate-[1.12] contrast-[1.06] brightness-[1.02] animate-fade-in"
        />
        <div className={`md:hidden absolute inset-0 bg-gradient-to-br ${part.grad} opacity-25`} />
        <div className="md:hidden absolute inset-0 bg-gradient-to-r from-card/95 via-card/80 to-card/30" />

        <div className="relative flex flex-col md:flex-row md:items-center gap-5 p-6 md:p-8">
          <div className="flex-1 min-w-0">
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

          {/* Desktop: the photo sits larger on the right */}
          <img
            src={part.image}
            alt={part.alt}
            className="hidden md:block md:w-[45%] lg:w-[48%] max-h-[360px] object-contain object-center rounded-2xl saturate-[1.12] contrast-[1.06] brightness-[1.02] animate-fade-in"
          />
        </div>
      </div>
    </section>
  );
}