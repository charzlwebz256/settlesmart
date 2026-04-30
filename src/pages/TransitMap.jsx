import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { Loader2, Navigation, Bus, MapPin, RotateCcw, ExternalLink, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

const transitLinks = [
  { city: 'Toronto', url: 'https://ttc.ca/routes-and-schedules', label: 'TTC Trip Planner' },
  { city: 'Vancouver', url: 'https://www.translink.ca/trip-planner', label: 'TransLink Planner' },
  { city: 'Edmonton', url: 'https://www.edmonton.ca/ets/plan-your-trip', label: 'ETS Trip Planner' },
  { city: 'Calgary', url: 'https://www.calgarytransit.com/plan-your-trip', label: 'Calgary Transit' },
  { city: 'Ottawa', url: 'https://www.octranspo.com/en/plan-your-trip/', label: 'OC Transpo' },
  { city: 'Montreal', url: 'https://www.stm.info/en/info/networks/metro', label: 'STM Planner' },
  { city: 'Winnipeg', url: 'https://winnipegtransit.com/en/navigo/', label: 'Winnipeg Transit' },
];

function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 14);
  }, [position, map]);
  return null;
}

export default function TransitMap() {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const watchId = useRef(null);

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

  const defaultCenter = [43.6532, -79.3832]; // Toronto fallback

  return (
    <div className="flex flex-col h-screen pb-16 md:pb-0">
      {/* Header */}
      <div className="px-4 py-4 bg-card border-b border-border/50 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-xl flex items-center gap-2">
              <Navigation className="w-5 h-5 text-primary" />
              Transit & GPS Map
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live location · Nearby bus stops · Route planning
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
                <span className="text-xs text-muted-foreground">
                  {position[0].toFixed(5)}, {position[1].toFixed(5)}
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
          center={position || defaultCenter}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          {/* Satellite + streets hybrid */}
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='Tiles &copy; Esri'
            maxZoom={19}
          />
          {/* Street labels overlay */}
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
                  <div className="text-xs text-gray-500 mt-1">Accuracy: ±{accuracy}m</div>
                </Popup>
              </Marker>
              {/* Accuracy circle */}
              <Circle
                center={position}
                radius={accuracy || 50}
                pathOptions={{ color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.1, weight: 1 }}
              />
            </>
          )}
        </MapContainer>

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

      {/* Transit Links Panel */}
      <div className="flex-shrink-0 bg-card border-t border-border/50 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Bus className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-foreground">Plan Your Route — Official Transit Apps</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {transitLinks.map(t => (
              <a
                key={t.city}
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/15 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
              >
                <MapPin className="w-3 h-3" />
                {t.city}
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            Map shows satellite imagery with road overlays. Tap a city above to plan routes with real-time bus/train info.
          </p>
        </div>
      </div>
    </div>
  );
}