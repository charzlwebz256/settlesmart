export default function GreetingCard({ part, eyebrow, title, subtitle, children }) {
  return (
    <section className="max-w-7xl mx-auto px-4 pt-5">
      <div className={`relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br ${part.grad} p-6 md:p-8`}>
        <div className="flex items-center gap-6">
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

          <img
            key={part.image}
            src={part.image}
            alt={part.alt}
            className="hidden md:block w-80 lg:w-[34rem] xl:w-[38rem] h-64 lg:h-80 object-cover object-center rounded-2xl flex-shrink-0 shadow-lg ring-1 ring-black/5 saturate-[1.12] contrast-[1.06] brightness-[1.02] animate-fade-in"
          />
        </div>
      </div>
    </section>
  );
}