import { useState, useEffect, useRef } from 'react';
import { MapContainer, Marker, Popup, Polyline, ScaleControl, useMap } from 'react-leaflet';
import { base44 } from '@/api/base44Client';
import { Loader2, Bus, Fuel, Footprints, Bike, X, Crosshair } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MapLayerTiles, MapTypeSwitcher, MapClickToPin, MapResizer, MapCenterWatcher, FitRoute } from '@/components/transit/MapLayers';
import TransitControlPanel from '@/components/transit/TransitControlPanel';
import TransitAppPromo from '@/components/transit/TransitAppPromo';
import EtsNetworkPanel from '@/components/transit/EtsNetworkPanel';
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

function RecenterMap({ position, trigger }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 14);
  }, [trigger, map]);
  return null;
}

export default function TransitMap() {
  const [position, setPosition] = useState(null);
  const [myAddress, setMyAddress] = useState('');
  const [resolvingAddress, setResolvingAddress] = useState(false);
  const startTouchedRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [recenterKey, setRecenterKey] = useState(0);
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

  // Street address for a set of coordinates, so a point reads like a place.
  const reverseAddress = async (coords) => {
    if (!coords) return '';
    const { data } = await base44.functions.invoke('localAreaInfo', {
      action: 'reverse_address',
      latitude: coords[0],
      longitude: coords[1],
    });
    return data?.address || '';
  };

  // Puts the visitor's own street address into the starting point.
  const resolveMyAddress = async (coords) => {
    if (!coords) return;
    setResolvingAddress(true);
    const address = await reverseAddress(coords);
    setResolvingAddress(false);
    if (!address) return;
    setMyAddress(address);
    // GPS fills the starting point on its own, so a route can be planned straight away.
    if (!startTouchedRef.current) {
      setStartInput(address);
      setStartCoords(coords);
    }
  };

  const useMyLocation = async () => {
    if (!position) return;
    setShowStartSuggestions(false);
    setStartCoords(position);
    setRecenterKey((k) => k + 1);
    if (myAddress) {
      setStartInput(myAddress);
      return;
    }
    startTouchedRef.current = false;
    setStartInput('My current location');
    await resolveMyAddress(position);
  };

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
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setPosition(coords);
        setAccuracy(Math.round(pos.coords.accuracy));
        setLoading(false);
        setRecenterKey((k) => k + 1);
        resolveMyAddress(coords);
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

  const geocodeAddress = async (address) => {
    if (!address.trim()) return null;
    const { data } = await base44.functions.invoke('localAreaInfo', {
      action: 'geocode',
      address,
    });
    return data?.lat !== undefined && data?.lng !== undefined ? [data.lat, data.lng] : null;
  };

  const handleStartChange = (value) => {
    startTouchedRef.current = true;
    setStartInput(value);
    getPlaceSuggestions(value, setStartSuggestions, setShowStartSuggestions);
  };

  const handleStartSelect = (place) => {
    startTouchedRef.current = true;
    setStartInput(place.address);
    setStartCoords([place.lat, place.lng]);
    setShowStartSuggestions(false);
  };

  const handleEndChange = (value) => {
    setEndInput(value);
    getPlaceSuggestions(value, setEndSuggestions, setShowEndSuggestions);
  };

  const handleEndSelect = (place) => {
    setEndInput(place.address);
    setEndCoords([place.lat, place.lng]);
    setShowEndSuggestions(false);
  };

  const getRoute = async () => {
    const origin = startCoords || position;
    if (!origin) {
      setError('Set a starting point or allow location access first.');
      return;
    }
    setRouteLoading(true);
    setError(null);
    try {
      const destination = endCoords || (await geocodeAddress(endInput));
      if (!destination) {
        setError('We could not find that destination. Pick one from the suggestions.');
        return;
      }
      setEndCoords(destination);
      const { data: result } = await base44.functions.invoke('localAreaInfo', {
        action: 'route',
        start: origin,
        end: destination,
        mode: selectedMode === 'bicycling' ? 'cycling' : selectedMode,
      });
      setRouteData(result?.route || null);
      setBusStations(result?.route?.nearby_bus_stations || []);
    } finally {
      setRouteLoading(false);
    }
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
    <div className="pb-16 md:pb-0">
      {/* 25% controls · 75% map */}
      <div className="flex flex-col md:flex-row md:h-[calc(100vh-4rem)] md:overflow-hidden">
        <aside className="w-full md:w-1/4 md:h-full md:overflow-y-auto bg-card border-b md:border-b-0 md:border-r border-border/50">
          <div className="p-4">
            <TransitControlPanel
              startInput={startInput}
              startSuggestions={startSuggestions}
              showStartSuggestions={showStartSuggestions}
              onStartChange={handleStartChange}
              onStartFocus={() => startSuggestions.length > 0 && setShowStartSuggestions(true)}
              onStartSelect={handleStartSelect}
              endInput={endInput}
              endSuggestions={endSuggestions}
              showEndSuggestions={showEndSuggestions}
              onEndChange={handleEndChange}
              onEndFocus={() => endSuggestions.length > 0 && setShowEndSuggestions(true)}
              onEndSelect={handleEndSelect}
              modes={modes}
              selectedMode={selectedMode}
              onModeChange={setSelectedMode}
              onSubmit={getRoute}
              routeLoading={routeLoading}
              canSubmit={Boolean(endInput) && Boolean(startCoords || position)}
              myAddress={myAddress}
              accuracy={accuracy}
              locating={loading}
              resolvingAddress={resolvingAddress}
              locationError={error}
              hasPosition={Boolean(position)}
              onLocate={getLocation}
              onUseMyLocation={useMyLocation}
              routeData={routeData}
              busStations={busStations}
            />
          </div>
        </aside>

        {/* Map */}
        <div className="relative w-full md:w-3/4 h-[60vh] md:h-full">
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
              enabled
              onPick={async (latlng) => {
                setEndCoords([latlng.lat, latlng.lng]);
                setShowEndSuggestions(false);
                const address = await reverseAddress([latlng.lat, latlng.lng]);
                setEndInput(address || 'Dropped pin');
              }}
            />

            {position && (
              <>
                <RecenterMap position={position} trigger={recenterKey} />
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

            <FitRoute positions={routePath} />

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
          <TransitAppPromo />

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
      </div>

      {/* ETS routes, commutes and schedules */}
      <EtsNetworkPanel />
    </div>
  );
}