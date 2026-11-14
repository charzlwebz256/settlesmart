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
            className="hidden md:block w-96 lg:w-[40rem] xl:w-[44rem] h-80 lg:h-[25rem] object-cover object-center flex-shrink-0 saturate-[1.12] contrast-[1.06] brightness-[1.02] animate-fade-in [mask-image:radial-gradient(ellipse_at_center,black_58%,transparent_82%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_58%,transparent_82%)]"
          />
        </div>
      </div>
    </section>
  );
}