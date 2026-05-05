import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Globe, Phone, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Rough geocodes for known Alberta addresses
const CITY_CENTERS = {
  Edmonton: [53.5461, -113.4938],
  Calgary: [51.0447, -114.0719],
};

// Simple address → coordinate lookup for known addresses
const ADDRESS_COORDS = {
  // Edmonton language
  '10215 108 St NW, Edmonton': [53.5472, -113.5005],
  '9649 – 105A Ave NW, Edmonton': [53.5547, -113.4892],
  'Unit 200, 10117 150 St NW, Edmonton': [53.5267, -113.6082],
  '11713 82 St NW, Edmonton': [53.5607, -113.4428],
  // Calgary language
  '1111 11 Ave SW, Calgary': [51.0403, -114.0856],
  '707 14 St NW, Calgary': [51.0609, -114.1027],
  '4039 Brentwood Rd NW, Calgary': [51.0842, -114.1214],
  // Edmonton education
  '83 University Campus NW, Edmonton': [53.5232, -113.5263],
  '7128 Ada Blvd NW, Edmonton': [53.5699, -113.4528],
  '10700 104 Ave NW, Edmonton': [53.5504, -113.5039],
  '11762 106 St NW, Edmonton': [53.5607, -113.5072],
  '10301 109 Street NW, Edmonton': [53.5480, -113.5113],
  '6020 104 St NW, Edmonton': [53.5102, -113.5030],
  '8330 82 Ave NW, Edmonton': [53.5178, -113.4520],
  // Calgary education
  '2500 University Dr NW, Calgary': [51.0787, -114.1327],
  '4825 Mt Royal Gate SW, Calgary': [51.0090, -114.1289],
  '1301 16 Ave NW, Calgary': [51.0673, -114.0949],
  '345 6 Ave SE, Calgary': [51.0455, -114.0583],
  '9705 Horton Rd SW, Calgary': [50.9897, -114.0918],
  '4774 Westwinds Dr NE, Calgary': [51.1012, -113.9568],
  '3800 Memorial Dr NE, Calgary': [51.0605, -113.9803],
};

function getCoords(item) {
  if (item.coords) return item.coords;
  const addr = item.address || '';
  // Try to match known address
  for (const [key, coords] of Object.entries(ADDRESS_COORDS)) {
    if (addr.includes(key.split(',')[0])) return coords;
  }
  // Fallback to city center with slight jitter
  const city = item.city || (addr.includes('Calgary') ? 'Calgary' : 'Edmonton');
  const center = CITY_CENTERS[city] || CITY_CENTERS.Edmonton;
  return [center[0] + (Math.random() - 0.5) * 0.04, center[1] + (Math.random() - 0.5) * 0.06];
}

export default function MapView({ items, cityFilter = 'all' }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const mappableItems = items.filter(item => {
    const addr = item.address || '';
    return addr && addr !== 'Online' && addr !== 'Alberta' && addr.length > 5;
  });

  const center = cityFilter === 'Calgary'
    ? CITY_CENTERS.Calgary
    : cityFilter === 'Edmonton'
    ? CITY_CENTERS.Edmonton
    : CITY_CENTERS.Edmonton;

  const zoom = cityFilter === 'all' ? 10 : 12;

  return (
    <div className="rounded-2xl overflow-hidden border border-border/50 shadow-sm" style={{ height: 480 }}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mappableItems.map((item, i) => {
          const coords = getCoords(item);
          return (
            <Marker key={i} position={coords}>
              <Popup maxWidth={260}>
                <div className="p-1 space-y-2">
                  {item.logo && (
                    <img src={item.logo} alt={item.name} className="h-8 object-contain mb-1" onError={e => e.target.style.display='none'} />
                  )}
                  <p className="font-bold text-sm leading-snug">{item.name}</p>
                  {item.address && <p className="text-xs text-gray-500">{item.address}</p>}
                  {item.phone && (
                    <a href={`tel:${item.phone}`} className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                      <Phone className="w-3 h-3" /> {item.phone}
                    </a>
                  )}
                  {item.website && (
                    <a href={item.website} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                      <Globe className="w-3 h-3" /> Visit Website <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}