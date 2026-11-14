import { ExternalLink, Loader2, Navigation, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import MyLocationCard from './MyLocationCard';
import RouteSummary from './RouteSummary';

const inputClass =
  'w-full px-3 py-2 rounded-lg border border-border/60 bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none';

// The left column of the transit map: my location, directions, itinerary and nearby stations.
export default function TransitControlPanel({
  startInput,
  startSuggestions,
  showStartSuggestions,
  onStartChange,
  onStartFocus,
  onStartSelect,
  endInput,
  endSuggestions,
  showEndSuggestions,
  onEndChange,
  onEndFocus,
  onEndSelect,
  modes,
  selectedMode,
  onModeChange,
  onSubmit,
  routeLoading,
  canSubmit,
  myAddress,
  accuracy,
  locating,
  resolvingAddress,
  locationError,
  hasPosition,
  onLocate,
  onUseMyLocation,
  routeData,
  busStations,
  startLabel,
  endLabel,
}) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading font-bold text-lg flex items-center gap-2 leading-tight">
          <Navigation className="w-4 h-4 text-primary flex-shrink-0" />
          Directions & Transit
        </h1>
        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
          GPS routing · Tap the map to set a destination
        </p>
      </div>

      <MyLocationCard
        address={myAddress}
        accuracy={accuracy}
        locating={locating}
        resolving={resolvingAddress}
        error={locationError}
        hasPosition={hasPosition}
        onLocate={onLocate}
      />

      <section className="rounded-2xl border border-border/60 bg-card p-3 space-y-3">
        {/* Starting point */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Starting point</label>
          <div className="flex gap-2">
            <div className="flex-1 relative min-w-0">
              <input
                value={startInput}
                onChange={(e) => onStartChange(e.target.value)}
                onFocus={onStartFocus}
                placeholder={resolvingAddress ? 'Finding your address…' : 'Your location or address'}
                className={inputClass}
              />
              {showStartSuggestions && startSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border/50 rounded-lg shadow-lg z-[1100] max-h-40 overflow-y-auto">
                  {startSuggestions.map((place, i) => (
                    <button
                      key={i}
                      onClick={() => onStartSelect(place)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors border-b border-border/30 last:border-0"
                    >
                      <div className="font-medium text-foreground">{place.name}</div>
                      <div className="text-xs text-muted-foreground">{place.address}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={onUseMyLocation}
              disabled={!hasPosition || resolvingAddress}
              title="Use my address"
              className="rounded-lg flex-shrink-0"
            >
              {resolvingAddress ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
            </Button>
          </div>
        </div>

        {/* Destination */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Destination</label>
          <div className="relative">
            <input
              value={endInput}
              onChange={(e) => onEndChange(e.target.value)}
              onFocus={onEndFocus}
              placeholder="Where to?"
              className={inputClass}
            />
            {showEndSuggestions && endSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border/50 rounded-lg shadow-lg z-[1100] max-h-40 overflow-y-auto">
                {endSuggestions.map((place, i) => (
                  <button
                    key={i}
                    onClick={() => onEndSelect(place)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors border-b border-border/30 last:border-0"
                  >
                    <div className="font-medium text-foreground">{place.name}</div>
                    <div className="text-xs text-muted-foreground">{place.address}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Transport mode */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Transport mode</label>
          <div className="grid grid-cols-4 gap-1.5">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => onModeChange(m.id)}
                className={cn(
                  'px-1 py-2 rounded-lg border text-[11px] font-medium transition-all flex flex-col items-center gap-1',
                  selectedMode === m.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border/50 text-muted-foreground hover:border-primary/30'
                )}
              >
                <m.icon className="w-4 h-4" />
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={onSubmit}
          disabled={!canSubmit || routeLoading}
          className="w-full rounded-lg gap-2 bg-primary hover:bg-primary/90"
        >
          {routeLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Route className="w-4 h-4" />}
          {routeLoading ? 'Finding route...' : 'Get Route'}
        </Button>
      </section>

      {/* Itinerary */}
      {routeData && <RouteSummary route={routeData} startLabel={startLabel} endLabel={endLabel} />}

      {/* Nearby bus stations */}
      {busStations.length > 0 && (
        <section className="bg-card rounded-2xl border border-border/60 p-3 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Nearby bus stations</p>
          {busStations.map((bs, i) => (
            <div key={i} className="text-[11px] p-2 bg-muted/30 rounded-lg">
              <div className="font-medium text-foreground">{bs.name}</div>
              {Array.isArray(bs.buses) && bs.buses.length > 0 && (
                <div className="text-muted-foreground">Buses: {bs.buses.join(', ')}</div>
              )}
            </div>
          ))}
          <a
            href="https://www.edmonton.ca/ets/route-schedules-and-maps"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1"
          >
            View ETS Routes & Schedules
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </section>
      )}
    </div>
  );
}