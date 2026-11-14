import { useState, useEffect } from 'react';
import { MapContainer, Marker, Popup, Polyline, ScaleControl, useMap } from 'react-leaflet';
import { base44 } from '@/api/base44Client';
import { Loader2, Navigation, Bus, MapPin, RotateCcw, ExternalLink, Info, Clock, Route, Fuel, Footprints, Bike, ArrowLeft, X, Crosshair } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCityDetection } from '@/hooks/useCityDetection';
import WeatherWidget from '@/components/transit/WeatherWidget';
import { MapLayerTiles, MapTypeSwitcher, MapClickToPin, MapResizer, MapCenterWatcher } from '@/components/transit/MapLayers';
import { useNearbyStops } from '@/hooks/useNearbyStops';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icons for Leaflet in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const userIcon = L.divIcon({
  className: '',
  html: `<div style="width:20px;height:20px;background:#22c55e;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const startIcon = L.divIcon({
  className: '',
  html: `<div style="width:24px;height:24px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const endIcon = L.divIcon({
  className: '',
  html: `<div style="width:24px;height:24px;background:#ef4444;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const busIcon = L.divIcon({
  className: '',
  html: `<div style="width:20px;height:20px;background:#f59e0b;border:2px solid white;border-radius:3px;box-shadow:0 2px 6px rgba(0,0,0,0.2)"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const stopIcon = L.divIcon({
  className: '',
  html: `<div style="width:14px;height:14px;background:#0ea5e9;border:2px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.25)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 14);
  }, [position, map]);
  return null;
}

export default function TransitMap() {
  const { city, province } = useCityDetection();
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [showDirections, setShowDirections] = useState(false);
  const [directionsOpen, setDirectionsOpen] = useState(false);
  const [startInput, setStartInput] = useState('');
  const [endInput, setEndInput] = useState('');
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [selectedMode, setSelectedMode] = useState('driving');
  const [mapType, setMapType] = useState('street');
  const [routeData, setRouteData] = useState(null);
  const [busStations, setBusStations] = useState([]);
  const [routeLoading, setRouteLoading] = useState(false);
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [showEndSuggestions, setShowEndSuggestions] = useState(false);
  const [mapCenter, setMapCenter] = useState(null);
  const [showStops, setShowStops] = useState(false);
  const { stops, loading: stopsLoading, error: stopsError, load: loadStops, clear: clearStops } = useNearbyStops();

  const modes = [
    { id: 'driving', label: 'Car', icon: Fuel, color: 'text-blue-600' },
    { id: 'transit', label: 'Bus', icon: Bus, color: 'text-orange-600' },
    { id: 'walking', label: 'Walk', icon: Footprints, color: 'text-green-600' },
    { id: 'bicycling', label: 'Bike', icon: Bike, color: 'text-purple-600' },
  ];

  // Asks the browser for location access. Never blocks the map: if permission is
  // denied the map stays fully usable and the visitor can search or tap instead.
  const getLocation = () => {
    setError(null);
    if (!navigator.geolocation) {
      setError('This browser does not support location access. Search an address or tap the map instead.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
        setAccuracy(Math.round(pos.coords.accuracy));
        setLoading(false);
      },
      () => {
        setLoading(false);
        setError('Location access is blocked. Allow location for this site in your browser, or search an address / tap the map.');
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  const getPlaceSuggestions = async (query, setSuggestions, setShow) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }
    const { data } = await base44.functions.invoke('localAreaInfo', {
      action: 'place_lookup',
      query,
    });
    setSuggestions(data?.places || []);
    setShow(true);
  };

  const geocodeAddress = async (address, setCoords) => {
    if (!address.trim()) return;
    const { data } = await base44.functions.invoke('localAreaInfo', {
      action: 'geocode',
      address,
    });
    if (data?.lat !== undefined && data?.lng !== undefined) setCoords([data.lat, data.lng]);
  };

  const getRoute = async () => {
    if (!startCoords || !endCoords) return;
    setRouteLoading(true);

    const { data: result } = await base44.functions.invoke('localAreaInfo', {
      action: 'route',
      start: startCoords,
      end: endCoords,
      mode: selectedMode,
    });

    setRouteData(result?.route || null);
    setBusStations(result?.route?.nearby_bus_stations || []);
    setRouteLoading(false);
  };

  const defaultCenter = [43.6532, -79.3832]; // Toronto fallback
  const displayCenter = startCoords || position || defaultCenter;

  // Use waypoints for route path
  const routePath = routeData?.waypoints || [];

  const stopSearchCenter = mapCenter || position || displayCenter;

  const toggleStops = () => {
    if (showStops) {
      setShowStops(false);
      clearStops();
      return;
    }
    setShowStops(true);
    loadStops(stopSearchCenter);
  };

  return (
    <div className="flex flex-col h-screen pb-16 md:pb-0">
      {/* Header */}
      <div className="px-4 py-4 bg-card border-b border-border/50 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-xl flex items-center gap-2">
              <Navigation className="w-5 h-5 text-primary" />
              Directions & Transit Map
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              GPS routing · Map, satellite, hybrid and terrain layers · Tap the map to set a destination
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={getLocation}
            className="rounded-lg gap-1.5"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
            {loading ? 'Locating...' : 'Re-center'}
          </Button>
        </div>
      </div>

      {/* Directions Panel */}
      <div className={cn("px-4 py-4 bg-muted/30 border-b border-border/50 flex-shrink-0 transition-all", !showDirections ? "py-2" : "max-h-[40vh] overflow-y-auto")}>
        <div className="max-w-7xl mx-auto">
          {!showDirections ? (
            <Button
              onClick={() => {
                setShowDirections(true);
                setDirectionsOpen(true);
              }}
              className="w-full rounded-lg gap-2 bg-primary hover:bg-primary/90"
            >
              <Route className="w-4 h-4" />
              Get Directions
            </Button>
          ) : (
            <div className={cn("space-y-4 overflow-hidden transition-all", !directionsOpen ? "max-h-0" : "max-h-[50vh]")}>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setDirectionsOpen(!directionsOpen)}
                  className="rounded-lg"
                >
                  {directionsOpen ? '▼' : '▶'}
                </Button>
                <h2 className="font-heading font-bold text-sm">Directions</h2>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowDirections(false);
                    setStartInput('');
                    setEndInput('');
                    setStartCoords(null);
                    setEndCoords(null);
                    setRouteData(null);
                    setBusStations([]);
                    setDirectionsOpen(false);
                  }}
                  className="rounded-lg ml-auto"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Starting point input */}
              <div className="space-y-2 relative">
                <label className="text-xs font-semibold text-muted-foreground">Starting Point</label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      value={startInput}
                      onChange={e => {
                        setStartInput(e.target.value);
                        getPlaceSuggestions(e.target.value, setStartSuggestions, setShowStartSuggestions);
                      }}
                      onFocus={() => startSuggestions.length > 0 && setShowStartSuggestions(true)}
                      placeholder="Your location or address"
                      className="w-full px-3 py-2 rounded-lg border border-border/60 bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    />
                    {showStartSuggestions && startSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border/50 rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto">
                        {startSuggestions.map((place, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setStartInput(place.address);
                              setStartCoords([place.lat, place.lng]);
                              setShowStartSuggestions(false);
                            }}
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
                    onClick={() => {
                      setStartInput(`${position[0].toFixed(5)}, ${position[1].toFixed(5)}`);
                      setStartCoords(position);
                      setShowStartSuggestions(false);
                    }}
                    disabled={!position}
                    className="rounded-lg"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* Destination input */}
              <div className="space-y-2 relative">
                <label className="text-xs font-semibold text-muted-foreground">Destination</label>
                <div className="relative">
                  <input
                    value={endInput}
                    onChange={e => {
                      setEndInput(e.target.value);
                      getPlaceSuggestions(e.target.value, setEndSuggestions, setShowEndSuggestions);
                    }}
                    onFocus={() => endSuggestions.length > 0 && setShowEndSuggestions(true)}
                    placeholder="Where to?"
                    className="w-full px-3 py-2 rounded-lg border border-border/60 bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  />
                  {showEndSuggestions && endSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border/50 rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto">
                      {endSuggestions.map((place, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setEndInput(place.address);
                            setEndCoords([place.lat, place.lng]);
                            setShowEndSuggestions(false);
                          }}
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

              {/* Transport modes */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Transport Mode</label>
                <div className="grid grid-cols-4 gap-2">
                  {modes.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMode(m.id)}
                      className={cn(
                        'px-2 py-2 rounded-lg border text-xs font-medium transition-all flex flex-col items-center gap-1',
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

              {/* Get route button */}
              <Button
                onClick={() => {
                  if (endInput && !endCoords) {
                    geocodeAddress(endInput, setEndCoords);
                  }
                  getRoute();
                }}
                disabled={!startCoords || !endInput || routeLoading}
                className="w-full rounded-lg gap-2 bg-primary hover:bg-primary/90"
              >
                {routeLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Route className="w-4 h-4" />}
                {routeLoading ? 'Finding route...' : 'Get Route'}
              </Button>

              {/* Route details */}
              {routeData && (
                <div className="bg-card rounded-lg border border-border/50 p-3 space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Route className="w-4 h-4 text-primary" />
                      <span className="font-semibold">{routeData.distance_km} km</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="font-semibold">{routeData.duration_minutes} min</span>
                    </div>
                  </div>

                  {/* Bus info */}
                  {routeData.bus_info && routeData.bus_info.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground">Buses:</p>
                      <div className="flex flex-wrap gap-1">
                        {routeData.bus_info.map((b, i) => (
                          <Badge key={i} className="bg-orange-500/10 text-orange-700 border-0 text-[10px]">
                            {b.name} → {b.route}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Steps */}
                  {routeData.steps && routeData.steps.length > 0 && (
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      <p className="text-xs font-semibold text-muted-foreground">Directions:</p>
                      {routeData.steps.slice(0, 5).map((s, i) => (
                        <div key={i} className="text-[10px] text-muted-foreground">
                          {i + 1}. {s.instruction} ({(s.distance_m / 1000).toFixed(1)} km)
                        </div>
                      ))}
                      {routeData.steps.length > 5 && (
                        <p className="text-[10px] text-muted-foreground italic">... and {routeData.steps.length - 5} more steps</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Bus stations */}
              {busStations.length > 0 && (
                <div className="bg-card rounded-lg border border-border/50 p-3 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">Nearby Bus Stations:</p>
                  {busStations.map((bs, i) => (
                    <div key={i} className="text-[10px] p-2 bg-muted/30 rounded-lg">
                      <div className="font-medium text-foreground">{bs.name}</div>
                      {Array.isArray(bs.buses) && bs.buses.length > 0 && (
                        <div className="text-muted-foreground">Buses: {bs.buses.join(', ')}</div>
                      )}
                    </div>
                  ))}
                  <a
                    href="https://www.edmonton.ca/ets/maps-routes-schedules-service"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-primary hover:underline font-semibold flex items-center gap-1"
                  >
                    View ETS Routes & Schedules
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      {(position || error) && (
        <div className="px-4 py-2 bg-muted/50 border-b border-border/30 flex-shrink-0">
          <div className="max-w-7xl mx-auto flex items-center gap-3 flex-wrap">
            {position && (
              <>
                <Badge className="bg-green-500/10 text-green-600 border-0 text-xs gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  GPS Active
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Accuracy: ±{accuracy}m
                </span>
              </>
            )}
            {error && (
              <>
                <span className="text-xs text-destructive flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> {error}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={getLocation}
                  className="rounded-lg gap-1.5 ml-auto"
                  disabled={loading}
                >
                  <Crosshair className="w-3.5 h-3.5" /> Enable location
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Map */}
      <div className="flex-1 relative min-h-0">
        <MapContainer
          center={displayCenter}
          zoom={13}
          minZoom={3}
          maxZoom={19}
          scrollWheelZoom
          dragging
          doubleClickZoom
          touchZoom
          zoomControl
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          <MapLayerTiles type={mapType} />
          <MapResizer />
          <MapCenterWatcher onChange={setMapCenter} />
          <ScaleControl position="bottomleft" imperial={false} />

          {/* Tap the map to drop the destination pin */}
          <MapClickToPin
            enabled={showDirections}
            onPick={(latlng) => {
              setEndCoords([latlng.lat, latlng.lng]);
              setEndInput(`${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`);
              setShowEndSuggestions(false);
            }}
          />

          {position && (
            <>
              <RecenterMap position={position} />
              <Marker position={position} icon={userIcon}>
                <Popup>
                  <div className="text-sm font-semibold">📍 You are here</div>
                </Popup>
              </Marker>
            </>
          )}

          {/* Start marker */}
          {startCoords && (
            <Marker position={startCoords} icon={startIcon}>
              <Popup>
                <div className="text-sm font-semibold">Start</div>
              </Popup>
            </Marker>
          )}

          {/* End marker */}
          {endCoords && (
            <Marker position={endCoords} icon={endIcon}>
              <Popup>
                <div className="text-sm font-semibold">Destination</div>
              </Popup>
            </Marker>
          )}

          {/* Route polyline */}
          {routePath.length > 1 && (
            <Polyline
              positions={routePath}
              pathOptions={{
                color: '#3b82f6',
                weight: 4,
                opacity: 0.8,
                dashArray: selectedMode === 'walking' ? '5,5' : undefined,
              }}
            />
          )}

          {/* Bus stations */}
          {busStations.filter((bs) => Number.isFinite(bs.lat) && Number.isFinite(bs.lng)).map((bs, i) => (
            <Marker key={i} position={[bs.lat, bs.lng]} icon={busIcon}>
              <Popup>
                <div className="text-sm font-semibold">{bs.name}</div>
                {Array.isArray(bs.buses) && bs.buses.length > 0 && (
                  <div className="text-xs text-gray-600 mt-1">Buses: {bs.buses.join(', ')}</div>
                )}
              </Popup>
            </Marker>
          ))}

          {/* Nearby transit stops */}
          {showStops && stops.map((stop) => (
            <Marker key={stop.id} position={[stop.lat, stop.lng]} icon={stopIcon}>
              <Popup>
                <div className="text-sm font-semibold">{stop.name}</div>
                {stop.routes.length > 0 && (
                  <div className="text-xs text-gray-600 mt-1">Routes: {stop.routes.join(', ')}</div>
                )}
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <MapTypeSwitcher value={mapType} onChange={setMapType} />

        {/* Map controls — never cover the map, it stays fully usable */}
        <div className="absolute bottom-6 right-3 z-[1000] flex flex-col items-end gap-2">
          <button
            onClick={() => getLocation()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card/95 backdrop-blur border border-border/60 shadow-lg text-[11px] font-semibold text-foreground hover:bg-card transition-colors"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Crosshair className="w-3.5 h-3.5 text-primary" />}
            {loading ? 'Locating…' : position ? 'My location' : 'Allow location'}
          </button>
          <button
            onClick={toggleStops}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-xl backdrop-blur border shadow-lg text-[11px] font-semibold transition-colors',
              showStops
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card/95 text-foreground border-border/60 hover:bg-card'
            )}
          >
            {stopsLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bus className="w-3.5 h-3.5" />}
            {showStops ? 'Hide stops' : 'Transit stops'}
          </button>
        </div>

        {/* Transit stops list */}
        {showStops && (stopsLoading || stops.length > 0 || stopsError) && (
          <div className="absolute bottom-6 left-3 z-[1000] w-64 max-h-[45%] overflow-y-auto rounded-xl bg-card/95 backdrop-blur border border-border/60 shadow-lg p-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[11px] font-bold text-foreground">
                Nearby stops {stops.length > 0 && <span className="text-muted-foreground">({stops.length})</span>}
              </p>
              <button onClick={toggleStops} aria-label="Close transit stops" className="p-1 rounded-md hover:bg-muted">
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>
            {stopsLoading && (
              <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 py-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Finding stops here…
              </p>
            )}
            {stopsError && <p className="text-[11px] text-destructive py-1">{stopsError}</p>}
            {!stopsLoading && !stopsError && stops.length === 0 && (
              <p className="text-[11px] text-muted-foreground py-1">No mapped stops in this view. Zoom out or pan.</p>
            )}
            <div className="space-y-1">
              {stops.slice(0, 25).map((stop) => (
                <div key={stop.id} className="text-[11px] p-1.5 rounded-lg bg-muted/40">
                  <p className="font-medium text-foreground leading-tight">{stop.name}</p>
                  {stop.routes.length > 0 && (
                    <p className="text-muted-foreground">Routes: {stop.routes.join(', ')}</p>
                  )}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5">Stops from OpenStreetMap around the map view.</p>
          </div>
        )}

        {routeLoading && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] px-3 py-1.5 rounded-full bg-card/95 backdrop-blur border border-border/60 shadow-lg flex items-center gap-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
            <span className="text-[11px] font-semibold">Calculating route…</span>
          </div>
        )}
      </div>

      {/* Weather Widget */}
      <div className="px-4 py-6 bg-background border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <WeatherWidget city={city} province={province} />
        </div>
      </div>
    </div>
  );
}