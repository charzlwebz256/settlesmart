import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { MapPin, Loader2, RefreshCw, ExternalLink, Phone, Globe, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCityDetection } from '@/hooks/useCityDetection';

const CATEGORY_CONFIG = {
  food_bank: { label: 'Food Banks', emoji: '🍎', color: 'bg-orange-500/10 text-orange-700 border-orange-200' },
  clinic: { label: 'Clinics', emoji: '🏥', color: 'bg-rose-500/10 text-rose-700 border-rose-200' },
  settlement: { label: 'Settlement Agencies', emoji: '🧭', color: 'bg-teal-500/10 text-teal-700 border-teal-200' },
  community: { label: 'Community Centres', emoji: '🤝', color: 'bg-blue-500/10 text-blue-700 border-blue-200' },
};

const CATEGORY_TABS = [
  { value: 'all', label: 'All' },
  ...Object.entries(CATEGORY_CONFIG).map(([k, v]) => ({ value: k, label: v.emoji + ' ' + v.label })),
];

export default function NearMe() {
  const { city, province, loading: cityLoading } = useCityDetection();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!cityLoading && city) fetchPlaces(city);
  }, [city, cityLoading]);

  const fetchPlaces = async (loc = city) => {
    if (!loc) return;
    setLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Find 8 real, currently operating local services for newcomers in ${loc}, ${province || 'Canada'}.
Include 2 of each: food banks, walk-in clinics, settlement agencies, community centres.
For each return: name, category (food_bank/clinic/settlement/community), address, phone, website, notes (one short sentence).`,
      add_context_from_internet: true,
      response_json_schema: {
        type: 'object',
        properties: {
          places: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                category: { type: 'string' },
                address: { type: 'string' },
                phone: { type: 'string' },
                website: { type: 'string' },
                notes: { type: 'string' },
              },
            },
          },
        },
      },
    });
    setPlaces(result?.places || []);
    setLoaded(true);
    setLoading(false);
  };

  const filtered = activeTab === 'all' ? places : places.filter(p => p.category === activeTab);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-1 flex items-center gap-2">
          <Navigation className="w-6 h-6 text-primary" />
          Services Near Me
        </h1>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          {cityLoading ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Detecting location...</>
          ) : (
            <>
              <MapPin className="w-3.5 h-3.5 text-primary" />
              Nearby services in <span className="font-medium text-foreground">{city}{province ? `, ${province}` : ''}</span>
            </>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {CATEGORY_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
              activeTab === tab.value
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border/50 text-muted-foreground hover:border-primary/30"
            )}
          >
            {tab.label}
          </button>
        ))}
        <Button
          size="sm"
          variant="outline"
          onClick={() => fetchPlaces()}
          disabled={loading || cityLoading}
          className="flex-shrink-0 rounded-xl gap-1.5 h-8 ml-auto"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm font-medium">Finding services near {city}...</p>
        </div>
      )}

      {/* Empty/Not loaded */}
      {!loading && !loaded && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📍</div>
          <h3 className="font-heading font-bold text-lg mb-2">Waiting for location</h3>
          <p className="text-muted-foreground text-sm mb-4">Allow location or wait for detection to find nearby services</p>
          {city && (
            <Button onClick={() => fetchPlaces()} className="rounded-xl gap-2 bg-primary">
              <Navigation className="w-4 h-4" /> Find Services in {city}
            </Button>
          )}
        </div>
      )}

      {/* Results */}
      {!loading && loaded && (
        <>
          <p className="text-xs text-muted-foreground mb-4">{filtered.length} place{filtered.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((place, i) => {
              const cat = CATEGORY_CONFIG[place.category] || CATEGORY_CONFIG.community;
              return (
                <div key={i} className="bg-card rounded-2xl border border-border/50 p-4 flex flex-col gap-3 hover:border-primary/20 hover:shadow-sm transition-all">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl flex-shrink-0">{cat.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <Badge className={cn("text-[10px] border mb-1.5 px-2 py-0", cat.color)}>{cat.label}</Badge>
                      <h3 className="font-heading font-bold text-sm leading-snug">{place.name}</h3>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    {place.address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-primary/50 mt-0.5" />
                        <span>{place.address}</span>
                      </div>
                    )}
                    {place.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 flex-shrink-0 text-primary/50" />
                        <a href={`tel:${place.phone}`} className="hover:text-primary transition-colors">{place.phone}</a>
                      </div>
                    )}

                  </div>
                  {place.notes && <p className="text-xs text-muted-foreground leading-relaxed">{place.notes}</p>}
                  <div className="flex gap-2 mt-auto">
                    {place.address && (
                      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/15 transition-colors">
                        <MapPin className="w-3 h-3" /> Directions
                      </a>
                    )}
                    {place.website && (
                      <a href={place.website} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-semibold hover:bg-muted/70 transition-colors">
                        <Globe className="w-3 h-3" /> Website
                        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}