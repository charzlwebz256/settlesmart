import { useEffect } from 'react';
import { TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { Map as MapIcon, Satellite, Layers, Mountain } from 'lucide-react';
import { cn } from '@/lib/utils';

// The four base maps, mirroring the layer choices people expect from Google Maps.
export const MAP_TYPES = [
  { id: 'street', label: 'Map', icon: MapIcon },
  { id: 'satellite', label: 'Satellite', icon: Satellite },
  { id: 'hybrid', label: 'Hybrid', icon: Layers },
  { id: 'terrain', label: 'Terrain', icon: Mountain },
];

export function MapLayerTiles({ type }) {
  if (type === 'satellite') {
    return (
      <TileLayer
        key="satellite"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution='Tiles &copy; Esri, Maxar, Earthstar Geographics'
        maxZoom={19}
      />
    );
  }

  if (type === 'hybrid') {
    return (
      <>
        <TileLayer
          key="hybrid-imagery"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='Tiles &copy; Esri, Maxar, Earthstar Geographics'
          maxZoom={19}
        />
        <TileLayer
          key="hybrid-transport"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}"
          attribution=""
          maxZoom={19}
          opacity={0.9}
        />
        <TileLayer
          key="hybrid-places"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          attribution=""
          maxZoom={19}
        />
      </>
    );
  }

  if (type === 'terrain') {
    return (
      <TileLayer
        key="terrain"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
        attribution='Tiles &copy; Esri, HERE, Garmin, USGS'
        maxZoom={19}
      />
    );
  }

  return (
    <TileLayer
      key="street"
      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
      attribution='Tiles &copy; Esri, HERE, Garmin, OpenStreetMap contributors'
      maxZoom={19}
    />
  );
}

// Keeps the Leaflet canvas the right size when the page layout changes.
export function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 250);
    const onResize = () => map.invalidateSize();
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', onResize);
    };
  }, [map]);
  return null;
}

// Reports the current map centre so nearby searches follow the view.
export function MapCenterWatcher({ onChange }) {
  const map = useMap();
  useMapEvents({
    moveend() {
      const c = map.getCenter();
      onChange([c.lat, c.lng]);
    },
  });
  return null;
}

export function MapTypeSwitcher({ value, onChange }) {
  return (
    <div className="absolute top-3 right-3 z-[1000] bg-card/95 backdrop-blur border border-border/60 rounded-xl shadow-lg p-1 flex flex-col gap-1">
      {MAP_TYPES.map((t) => {
        const Icon = t.icon;
        const active = value === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

// Click the map to drop the destination pin, like Google Maps.
export function MapClickToPin({ enabled, onPick }) {
  useMapEvents({
    click(e) {
      if (enabled) onPick(e.latlng);
    },
  });
  return null;
}