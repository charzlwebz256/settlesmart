import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { base44 } from '@/api/base44Client';
import { Loader2, Navigation, Bus, MapPin, RotateCcw, ExternalLink, Info, Clock, Route, Fuel, Footprints, Bike, ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCityDetection } from '@/hooks/useCityDetection';
import WeatherWidget from '@/components/transit/WeatherWidget';
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
  const [routeData, setRouteData] = useState(null);
  const [busStations, setBusStations] = useState([]);
  const [routeLoading, setRouteLoading] = useState(false);
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [showEndSuggestions, setShowEndSuggestions] = useState(false);
  const watchId = useRef(null);

  const modes = [
    { id: 'driving', label: 'Car', icon: Fuel, color: 'text-blue-600' },
    { id: 'transit', label: 'Bus', icon: Bus, color: 'text-orange-600' },
    { id: 'walking', label: 'Walk', icon: Footprints, color: 'text-green-600' },
    { id: 'bicycling', label: 'Bike', icon: Bike, color: 'text-purple-600' },
  ];

  const getLocation = () => {
    setLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }
    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
        setAccuracy(Math.round(pos.coords.accuracy));
        setLoading(false);
      },
      (err) => {
        setError('Unable to determine your location. Please allow location access.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    getLocation();
    return () => {
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
    };
  }, []);

  const getPlaceSuggestions = async (query, setSuggestions, setShow) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Find 5 real places/addresses in Canada matching "${query}". Return JSON array: [{"name": "Place Name", "address": "Full Address", "lat": number, "lng": number}, ...]`,
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
                address: { type: 'string' },
                lat: { type: 'number' },
                lng: { type: 'number' },
              },
            },
          },
        },
      },
    });
    setSuggestions(result.places || []);
    setShow(true);
  };

  const geocodeAddress = async (address, setCoords) => {
    if (!address.trim()) return;
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Get the latitude and longitude coordinates for "${address}" in Canada. Return ONLY JSON: {"lat": number, "lng": number}`,
      add_context_from_internet: true,
      response_json_schema: {
        type: 'object',
        properties: {
          lat: { type: 'number' },
          lng: { type: 'number' },
        },
      },
    });
    setCoords([result.lat, result.lng]);
  };

  const getRoute = async () => {
    if (!startCoords || !endCoords) return;
    setRouteLoading(true);

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Calculate a detailed route in Canada from coordinates [${startCoords[0].toFixed(5)}, ${startCoords[1].toFixed(5)}] to [${endCoords[0].toFixed(5)}, ${endCoords[1].toFixed(5)}] using ${selectedMode} mode. Return JSON with:
- distance_km (number)
- duration_minutes (number)
- waypoints: array of [lat, lng] coordinates for the exact route path
- steps: array of turn-by-turn navigation instructions with distance
- bus_info: for transit, array of bus routes with numbers and names
- nearby_bus_stations: for transit, array of nearby station coordinates and bus numbers`,
      add_context_from_internet: true,
      response_json_schema: {
        type: 'object',
        properties: {
          distance_km: { type: 'number' },
          duration_minutes: { type: 'number' },
          waypoints: {
            type: 'array',
            items: {
              type: 'array',
              items: { type: 'number' },
            },
          },
          steps: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                instruction: { type: 'string' },
                distance_m: { type: 'number' },
              },
            },
          },
          bus_info: {
            type: ['array', 'null'],
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                route: { type: 'string' },
              },
            },
          },
          nearby_bus_stations: {
            type: ['array', 'null'],
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                lat: { type: 'number' },
                lng: { type: 'number' },
                buses: { type: 'array', items: { type: 'string' } },
              },
            },
          },
        },
      },
    });

    setRouteData(result);
    setBusStations(result.nearby_bus_stations || []);
    setRouteLoading(false);
  };

  const defaultCenter = [43.6532, -79.3832]; // Toronto fallback
  const displayCenter = startCoords || position || defaultCenter;

  // Use waypoints for route path
  const routePath = routeData?.waypoints || [];

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
              Route planning with GPS · Bus stations · Multiple transport modes
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
                      <div className="text-muted-foreground">Buses: {bs.buses.join(', ')}</div>
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
              <span className="text-xs text-destructive flex items-center gap-1">
                <Info className="w-3.5 h-3.5" /> {error}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Map */}
      <div className="flex-1 relative min-h-0">
        <MapContainer
          center={displayCenter}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='Tiles &copy; Esri'
            maxZoom={19}
          />
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}"
            attribution=''
            maxZoom={19}
            opacity={0.8}
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
          {busStations.map((bs, i) => (
            <Marker key={i} position={[bs.lat, bs.lng]} icon={busIcon}>
              <Popup>
                <div className="text-sm font-semibold">{bs.name}</div>
                <div className="text-xs text-gray-600 mt-1">Buses: {bs.buses.join(', ')}</div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {routeLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 z-[1000]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
              <p className="text-sm font-medium">Calculating route...</p>
            </div>
          </div>
        )}

        {loading && !position && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 z-[1000]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
              <p className="text-sm font-medium">Getting your location...</p>
              <p className="text-xs text-muted-foreground mt-1">Please allow location access</p>
            </div>
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