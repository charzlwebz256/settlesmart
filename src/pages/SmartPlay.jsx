import { useState } from 'react';
import { Clapperboard, Library } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FILTERS, SECTIONS } from '@/data/smartPlayData';
import PlayCard from '@/components/smartplay/PlayCard';

export default function SmartPlay() {
  const [filter, setFilter] = useState('all');
  const active = FILTERS.find((f) => f.id === filter) || FILTERS[0];

  const sections = SECTIONS.map((section) => ({
    ...section,
    services: active.tags
      ? section.services.filter((service) => service.tags.some((tag) => active.tags.includes(tag)))
      : section.services,
  })).filter((section) => section.services.length > 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 pb-24 md:pb-10">
      <div className="mb-6">
        <h1 className="mb-2 flex items-center gap-2 font-heading text-2xl font-bold md:text-3xl">
          <Clapperboard className="h-6 w-6 text-primary" />
          SmartPlay Canada
        </h1>
        <p className="text-sm text-muted-foreground">
          Free and paid movies, TV, live channels, music, podcasts, documentaries and eBooks in Canada — tap any service to open it in a new tab.
        </p>
      </div>

      <div className="-mx-4 mb-6 overflow-x-auto px-4 pb-1">
        <div className="flex w-max gap-2">
          {FILTERS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setFilter(option.id)}
              className={cn(
                'min-h-[38px] whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors',
                filter === option.id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border/60 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.id}>
            <h2 className="font-heading text-base font-bold text-foreground">{section.label}</h2>
            <p className="mb-3 mt-0.5 text-xs text-muted-foreground">{section.note}</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {section.services.map((service, i) => (
                <PlayCard key={service.name} service={service} tint={section.tint} index={i} />
              ))}
            </div>
          </div>
        ))}

        {sections.length === 0 && (
          <div className="rounded-2xl border border-border/50 bg-card p-8 text-center text-sm text-muted-foreground">
            Nothing in this category yet. Try another filter.
          </div>
        )}
      </div>

      <div className="mt-10 rounded-2xl border border-border/50 bg-card p-5">
        <h3 className="mb-2 flex items-center gap-2 font-heading text-base font-bold">
          <Library className="h-4 w-4 text-primary" />
          Get more for free with a library card
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          A free library card from your local Canadian library unlocks Kanopy, Hoopla and Libby at no cost — films, audiobooks, eBooks and magazines. Bring photo ID and proof of address to any branch, or apply online through your city library's website.
        </p>
      </div>
    </div>
  );
}