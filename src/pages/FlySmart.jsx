import { Plane, ShieldCheck } from 'lucide-react';
import { SECTIONS } from '@/data/flySmartData';
import FlightCard from '@/components/flysmart/FlightCard';

export default function FlySmart() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 pb-24 md:pb-10">
      <div className="mb-6">
        <h1 className="mb-2 flex items-center gap-2 font-heading text-2xl font-bold md:text-3xl">
          <Plane className="h-6 w-6 text-primary" />
          FlySmart
        </h1>
        <p className="text-sm text-muted-foreground">
          Compare fares, book with a trusted agency or go straight to the airline. Tap any card to open it in a new tab.
        </p>
      </div>

      <div className="space-y-8">
        {SECTIONS.map((section) => (
          <div key={section.id}>
            <h2 className="font-heading text-base font-bold text-foreground">{section.label}</h2>
            <p className="mb-3 mt-0.5 text-xs text-muted-foreground">{section.note}</p>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
              {section.items.map((item, i) => (
                <FlightCard key={item.name} item={item} tint={section.tint} index={i} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border/50 bg-card p-5">
        <h3 className="mb-2 flex items-center gap-2 font-heading text-base font-bold">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Before you book
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Fares change by the hour. Compare the total price including baggage, seat selection and cancellation rules,
          book with the airline when you may need to change the ticket, and pay with a credit card so you have
          chargeback protection if a booking goes wrong.
        </p>
      </div>
    </div>
  );
}